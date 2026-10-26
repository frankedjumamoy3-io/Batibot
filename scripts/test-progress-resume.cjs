const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const originalResolve = Module._resolveFilename;
const originalLoad = Module._load;
const disk = new Map();
let offline = true;
let cloud = null;
let duringUpload;
const mocks = {
  'react-native': { Platform: { OS: 'android', select: values => values.android ?? values.default }, StyleSheet: { create: value => value } },
  '@/src/config/firebase': { db: {} },
  '@/src/config/backend': { USE_NODE_BACKEND: true },
  'firebase/firestore': {},
  '@/src/infrastructure/storage/secure-json-storage': {
    getSecureJsonItem: async key => disk.has(key) ? JSON.parse(disk.get(key)) : null,
    setSecureJsonItem: async (key, value) => { await new Promise(r => setImmediate(r)); disk.set(key, JSON.stringify(value)); },
  },
  '@/src/infrastructure/api/session': {
    authenticatedRequest: async (_path, method, body, options) => {
      assert.equal(options.expectedUserId, 'ana');
      if (offline) throw new Error('offline');
      if (method === 'GET') return { learnerProgress: cloud, version: 1 };
      if (duringUpload) { const run = duringUpload; duringUpload = null; await run(); }
      cloud = body.learnerProgress;
      return { version: 2 };
    },
  },
};
Module._load = function(request, ...args) { return mocks[request] ?? originalLoad.call(this, request, ...args); };
Module._resolveFilename = function(request, parent, ...args) { return originalResolve.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, parent, ...args); };
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
for (const ext of ['.png', '.jpg', '.jpeg', '.webp', '.mp3', '.wav']) require.extensions[ext] = module => { module.exports = 1; };
global.__DEV__ = false;
const { DEFAULT_PROGRESS, sanitizeLearnerProgress } = require('../src/domain/usecases/learner-progress/progress-state');
const { mergeLearnerProgress } = require('../src/domain/usecases/learner-progress/merge-progress');
const { getLessonResumeStep } = require('../src/domain/usecases/learner-progress/lesson-checkpoints');
const { claimWorldRewardUseCase, markLessonStageCompletedUseCase } = require('../src/domain/usecases/learner-progress/progress-actions');
const repo = require('../src/data/repositories/learner-progress-repository');
const checkpoint = (stepIndex = 3, savedAt = '2026-10-25T02:00:00.000Z') => ({
  topicId: 'noun', worldId: 'grade1-word-kingdom', savedAt, stepIndex,
  interactNodeIndex: 1, challengeNodeIndex: 0, challengeCompletedNodes: [true, false, false],
  challengeCorrectNodes: [true, false, false], challengeSelectedAnswers: ['cat', null, null],
  exploreTapped: true, interactImageTapped: true, interactWordTapped: false, interactListenTapped: false, practiceAnswer: null,
});

test('legacy saved stages resume at the first unfinished stage, including an unclaimed reward', () => {
  let progress = DEFAULT_PROGRESS;
  for (const stage of ['discover', 'explore', 'interact', 'practice', 'challenge']) {
    progress = markLessonStageCompletedUseCase(progress, { topicId: 'noun', title: 'Nouns', stage });
  }
  assert.equal(getLessonResumeStep(progress, 'noun'), 5);
  assert.equal(getLessonResumeStep(sanitizeLearnerProgress({ ...progress, lessonCheckpoints: { noun: checkpoint(4) } }), 'noun'), 5);
  assert.deepEqual(sanitizeLearnerProgress({ lessonCheckpoints: { noun: { ...checkpoint(), stepIndex: 999 } } }).lessonCheckpoints, {});
});

test('offline progress survives reload and failed upload; reconnect merges cloud completions', async () => {
  const key = repo.getLearnerProgressStorageKey('ana');
  await repo.saveLocalLearnerProgress(key, { ...DEFAULT_PROGRESS, totalXp: 25, lessonCheckpoints: { noun: checkpoint() } });
  await assert.rejects(repo.syncLearnerProgress('ana'), /offline/);
  const loaded = sanitizeLearnerProgress(await repo.loadLocalLearnerProgress(key));
  assert.equal(getLessonResumeStep(loaded, 'noun'), 3);
  assert.equal(loaded.lessonCheckpoints.noun.interactNodeIndex, 1);
  assert.equal(JSON.parse(disk.get(key)).pending, true);
  assert.equal(await repo.loadLocalLearnerProgress(repo.getLearnerProgressStorageKey('ben')), null);
  offline = false;
  cloud = { ...DEFAULT_PROGRESS, totalXp: 10, claimedWorldRewardIds: ['cloud-topic'] };
  await repo.syncLearnerProgress('ana');
  const saved = await repo.loadLocalLearnerProgress(key);
  assert.equal(saved.totalXp, 25);
  assert.deepEqual(saved.claimedWorldRewardIds, ['cloud-topic']);
  assert.equal(cloud.lessonCheckpoints.noun.stepIndex, 3);
  assert.equal(JSON.parse(disk.get(key)).pending, false);
});

test('an interaction during upload remains pending and is sent on the next sync', async () => {
  const key = repo.getLearnerProgressStorageKey('ana');
  duringUpload = async () => repo.saveLocalLearnerProgress(key, {
    ...DEFAULT_PROGRESS, totalXp: 30, lessonCheckpoints: { noun: checkpoint(4, '2026-10-25T03:00:00.000Z') },
  });
  await repo.syncLearnerProgress('ana');
  assert.equal(JSON.parse(disk.get(key)).pending, true);
  assert.equal((await repo.loadLocalLearnerProgress(key)).lessonCheckpoints.noun.stepIndex, 4);
  await repo.syncLearnerProgress('ana');
  assert.equal(cloud.lessonCheckpoints.noun.stepIndex, 4);
  assert.equal(JSON.parse(disk.get(key)).pending, false);
});

test('concurrent local writes preserve order and reset tombstones prevent old cloud progress returning', async () => {
  const key = repo.getLearnerProgressStorageKey('ben');
  await Promise.all([1, 2, 3].map(totalXp => repo.saveLocalLearnerProgress(key, { ...DEFAULT_PROGRESS, totalXp })));
  assert.equal((await repo.loadLocalLearnerProgress(key)).totalXp, 3);
  const reset = { ...DEFAULT_PROGRESS, resetAt: '2026-10-25T04:00:00.000Z' };
  assert.equal(mergeLearnerProgress(reset, { ...DEFAULT_PROGRESS, totalXp: 300 }).totalXp, 0);
  assert.equal(mergeLearnerProgress({ ...DEFAULT_PROGRESS, totalXp: 300 }, reset).totalXp, 0);
});

test('replaying or double-tapping a reward never grants duplicate XP or stars', () => {
  const input = { rewardId: 'noun', title: 'Nouns', xp: 10 };
  const first = claimWorldRewardUseCase(DEFAULT_PROGRESS, input);
  const replay = claimWorldRewardUseCase(first, input);
  assert.equal(replay.totalXp, 10);
  assert.deepEqual(replay.claimedWorldRewardIds, ['noun']);
  assert.equal(first, replay);
});
