const assert = require('node:assert/strict');
const { test, before, after } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const originalResolve = Module._resolveFilename;
const originalLoad = Module._load;
const originalFetch = global.fetch;
const mocks = {
  'expo-secure-store': { setItemAsync: async () => {}, deleteItemAsync: async () => {}, getItemAsync: async () => null },
  'react-native': { Platform: { OS: 'android' } },
  '@/src/config/firebase': { db: {} },
  '@/src/data/repositories/user-profile-repository': { isAdminProfile: profile => profile?.role === 'admin' },
};
Module._load = function(request, ...args) { return mocks[request] ?? originalLoad.call(this, request, ...args); };
Module._resolveFilename = function(request, parent, ...args) { return originalResolve.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, parent, ...args); };
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
for (const ext of ['.png', '.jpg', '.jpeg', '.webp', '.mp3', '.wav']) require.extensions[ext] = module => { module.exports = 1; };
global.__DEV__ = false;
process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.example.test/api/v1';
const sessions = require('../src/infrastructure/api/session');
const { generateAIQuizDraft } = require('../src/services/adminQuizService');
const content = require('../src/services/admin/adminContentDraftService');
const { getPublishedLearnerStageContent } = require('../src/services/learnerPublishedContentService');
const { adaptLegacyContentToSharedRenderer, adaptLegacyTemplateToSharedRenderer } = require('../src/services/admin/legacyStageRendererAdapter');
const ok = data => new Response(JSON.stringify({ data }), { status: 200 });
const input = { topic: 'Mother', ageGroup: 'Preschool', category: 'linguistic', curriculumLevel: 1, difficulty: 'beginner', learnerLevel: 'Preschool', gradeLevel: 'Preschool', worldId: 'preschool-family-world', topicId: 'Mother', phase: 'Practice', objective: 'Identify Mother', notes: '', adminPrompt: 'Use family words', questionCount: 1, questionTypes: ['multiple-choice'] };
const quiz = { ...input, title: 'Family quiz', instructions: 'Choose the word.', modelName: 'gpt-6.1-sol', createdWith: 'openai', questions: [{ id: 'q1', type: 'multiple-choice', prompt: 'Who is a female parent?', options: ['Mother', 'Father', 'Brother', 'Sister'], answer: 'Mother', explanation: 'A mother is a female parent.' }], rewards: { xp: 20 } };
before(async () => {
  global.fetch = async () => ok({ accessToken: 'test-access', refreshToken: 'test-refresh', accessTokenExpiresInSeconds: 900, user: { id: 'admin-test', email: 'admin@example.test', displayName: 'Admin', role: 'admin' } });
  await sessions.loginApi('admin@example.test', 'test-only');
});
after(() => { global.fetch = originalFetch; Module._load = originalLoad; Module._resolveFilename = originalResolve; });

test('quiz generation uses the authenticated Node route, preserves model attribution, and never requests a Firebase token', async () => {
  let calls = 0;
  global.fetch = async (url, options) => {
    calls++;
    assert.ok(url.endsWith('/admin/ai/quizzes'));
    assert.equal(options.headers.Authorization, 'Bearer test-access');
    assert.equal(JSON.parse(options.body).questionCount, 1);
    return ok({ quiz });
  };
  const generated = await generateAIQuizDraft(input, { getIdToken: async () => assert.fail('Firebase is not the active admin session') });
  assert.equal(generated.createdWith, 'openai');
  assert.equal(generated.modelName, 'gpt-6.1-sol');
  assert.equal(generated.questions.length, 1);
  assert.equal(generated.mobilePreviewChecked, false);
  assert.equal(calls, 1);
});

test('missing configuration, quota and provider failures stay visible; no local template is returned', async () => {
  for (const [status, code, message] of [[503, 'AI_NOT_CONFIGURED', /backend hosting secrets/], [429, 'AI_QUOTA_EXCEEDED', /quota/], [422, 'AI_INVALID_OUTPUT', /failed validation/]]) {
    let calls = 0;
    global.fetch = async () => { calls++; return new Response(JSON.stringify({ error: { code, message: 'private provider details' } }), { status }); };
    await assert.rejects(generateAIQuizDraft(input), error => message.test(error.message) && !error.message.includes('private'));
    assert.equal(calls, 1);
  }
});

test('lesson generation failure does not create a pretend saved draft', async () => {
  let calls = 0;
  global.fetch = async url => {
    calls++; assert.ok(url.endsWith('/admin/ai/content'));
    return new Response(JSON.stringify({ error: { code: 'AI_NOT_CONFIGURED' } }), { status: 503 });
  };
  await assert.rejects(content.generateAdminContentDraft({ ...input, contentKind: 'activity', exampleCount: 4, stageStructure: ['LOOK', 'TAP', 'TRY', 'CHOOSE', 'PLAY', 'REWARD', 'PROGRESS', 'MASTERY'], stageType: 'LOOK', topicTitle: 'Mother', topicType: 'concept' }, null, { uid: 'admin-test', role: 'admin' }), /backend hosting secrets/);
  assert.equal(calls, 1);
});

test('lesson saves and reopened timestamps use the API; persistence failures propagate', async () => {
  const wire = { ...input, id: 'saved-draft', createdAt: '2026-10-21T00:00:00Z', updatedAt: '2026-10-21T01:00:00Z', publishedAt: null };
  global.fetch = async url => { assert.ok(url.includes('/admin/content-drafts')); return ok(wire); };
  const saved = await content.saveAdminContentDraft({ ...input });
  assert.equal(saved.id, 'saved-draft');
  assert.equal(saved.createdAt.toDate().toISOString(), new Date(wire.createdAt).toISOString());
  const reopened = await content.getAdminContentDraft(saved.id);
  assert.equal(reopened.id, saved.id);
  global.fetch = async () => { throw new Error('offline'); };
  await assert.rejects(content.saveAdminContentDraft(input));
  await assert.rejects(content.updateAdminContentDraft(saved.id, { status: 'needs_review' }));
});

test('a generated lesson is saved as a durable review draft with valid choices and a matching mission', async () => {
  const curriculum = require('../src/services/admin/batibotCurriculumApi');
  const world = curriculum.getAdminWorldMetadata('Preschool', input.worldId);
  const draftInput = { ...input, contentKind: 'activity', exampleCount: 2, stageStructure: ['LOOK', 'TAP', 'TRY', 'CHOOSE', 'PLAY', 'REWARD', 'PROGRESS', 'MASTERY'], stageType: 'PLAY', topicTitle: 'Mother', topicType: world.allowedTopicTypes[0] };
  const local = content.buildLocalDraftContent(draftInput);
  const stages = local.stages.map(stage => ({ ...stage, title: 'Mother', instruction: 'Explore the family.', body: 'A mother is a parent.', meaning: 'A mother is a female parent.', question: 'Who is a female parent?',
    ...(['TRY', 'CHOOSE'].includes(stage.stageLabel) ? { choices: [{ id: 'm', label: 'Mother', isCorrect: true }, { id: 'f', label: 'Father', isCorrect: false }], correctAnswer: 'm' } : {}),
    ...(stage.stageLabel === 'PLAY' ? { activityType: 'matching', items: [{ id: 'm', left: 'Mother', right: 'Female parent' }, { id: 'f', left: 'Father', right: 'Male parent' }] } : {}),
  }));
  const lesson = { ...local, ...stages.find(stage => stage.stageLabel === 'PLAY'), stages, examples: [{ label: 'Mother', explanation: 'A mother is a parent.' }] };
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push(url);
    if (url.endsWith('/admin/ai/content')) return ok({ draft: lesson });
    assert.ok(url.endsWith('/admin/content-drafts'));
    const saved = JSON.parse(options.body);
    assert.equal(saved.status, 'ai_generated');
    return ok({ ...saved, id: 'durable-lesson', createdAt: '2026-10-21T00:00:00Z', updatedAt: '2026-10-21T00:00:00Z' });
  };
  const saved = await content.generateAdminContentDraft(draftInput, null, { uid: 'admin-test', role: 'admin' });
  assert.equal(saved.id, 'durable-lesson');
  const issues = await content.validateAdminContentDraft(saved);
  assert.deepEqual(issues.filter(issue => issue.severity === 'error'), []);
  assert.equal(calls.length, 2);
});

test('published lessons reach the learner through the API with matching data and bundled asset refs', async () => {
  const metadata = { gradeLevel: 'Preschool', worldId: input.worldId, topicId: 'Mother', topicTitle: 'Mother', stageType: 'LOOK' };
  const stages = [{ stageLabel: 'PLAY', activityType: 'matching', instruction: 'Match the family words.', items: [{ id: 'a', left: 'Mother', right: 'Female parent' }, { id: 'b', left: 'Father', right: 'Male parent' }], assetRefs: { images: ['boy'], audio: [], backgrounds: [], icons: [] } }];
  global.fetch = async url => { assert.ok(url.includes('/published-content?')); return ok({ items: [{ id: 'published', metadata, content: { stages }, topicTitle: 'Mother' }], nextOffset: null }); };
  const lesson = await getPublishedLearnerStageContent({ ...input, topicTitle: 'Mother', stageType: 'PLAY', stageIndex: 4, totalStages: 8 });
  assert.equal(lesson.metadata.stageType, 'PLAY');
  const template = adaptLegacyTemplateToSharedRenderer({ stageType: 'PLAY' });
  const renderContent = adaptLegacyContentToSharedRenderer(lesson.content, template);
  assert.equal(renderContent.activityData.length, 2);
  assert.equal(renderContent.assets[0].assetId, 'boy');
});

test('every AI authoring world and topic matches the learner curriculum', () => {
  const { CURRICULUM } = require('../src/data/curriculum/learning-path');
  const { getAdminCurriculumMetadata } = require('../src/services/admin/batibotCurriculumApi');
  const authoring = getAdminCurriculumMetadata();
  for (const grade of CURRICULUM) {
    const adminGrade = authoring.find(item => item.gradeLevel === grade.gradeLevel);
    assert.equal(adminGrade.worlds.length, grade.worlds.length);
    for (const world of grade.worlds) assert.deepEqual(adminGrade.worlds.find(item => item.worldId === world.id).topicTitles, world.topics.map(topic => topic.title));
  }
});
