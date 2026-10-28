const assert = require('node:assert/strict');
const { test, after } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const originalResolve = Module._resolveFilename;
const originalLoad = Module._load;
const stored = new Map();
const secure = { setItemAsync: async (key, value) => stored.set(key, value), getItemAsync: async key => stored.get(key) ?? null, deleteItemAsync: async key => { stored.delete(key); } };
const mocks = {
  'expo-secure-store': secure, 'react-native': { Platform: { OS: 'android' } },
  '@/src/config/firebase': { db: {} }, 'firebase/firestore': {},
  '@/src/data/quiz/study-requirements': { withQuizContentStudyRequirements: quiz => quiz },
  '@/src/services/admin/adminTopicDraftService': { listTopicDrafts: async () => [{ gradeLevel: 'Grade 1', worldId: 'family-world', status: 'published' }] },
};
Module._load = function(request, ...args) { return mocks[request] ?? originalLoad.call(this, request, ...args); };
Module._resolveFilename = function(request, parent, ...args) { return originalResolve.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, parent, ...args); };
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText, filename);
global.__DEV__ = false;
process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.example.test/api/v1';
const client = require('../src/infrastructure/api/client');
const sessions = require('../src/infrastructure/api/session');
const originalFetch = global.fetch;
const ok = data => new Response(JSON.stringify({ data }), { status: 200 });
const admin = { id: 'test-admin', role: 'admin', email: 'admin@example.test', displayName: 'Administrator' };
const session = { accessToken: 'access-1', refreshToken: 'refresh-1', accessTokenExpiresInSeconds: 900, user: admin };
after(() => { global.fetch = originalFetch; Module._load = originalLoad; Module._resolveFilename = originalResolve; });

test('learner registration saves imported progress before publishing the authenticated session', async () => {
  const learner = { ...admin, id: 'learner-ana', role: 'learner', gradeLevel: 'Grade 1' };
  global.fetch = async url => { assert.ok(url.endsWith('/auth/register')); return ok({ ...session, user: learner }); };
  let imported = false;
  const stop = sessions.observeApiSession(user => { if (user?.id === learner.id) assert.equal(imported, true); });
  const user = await sessions.registerLearnerApi({ email: 'ana@example.test', password: 'test-only-password', displayName: 'Ana', gradeLevel: 'Grade 1' }, async id => {
    assert.equal(id, learner.id); imported = true;
  });
  assert.equal(user.gradeLevel, 'Grade 1');
  stop();
  await sessions.logoutApi();
});

test('authenticated learners remain available offline and account-bound uploads reject the wrong user', async () => {
  const learner = { ...admin, id: 'learner-offline', role: 'learner', gradeLevel: 'Grade 2' };
  global.fetch = async () => ok({ ...session, user: learner });
  await sessions.loginApi('ana@example.test', 'test-only-password', 'learner');
  global.fetch = async () => { throw new Error('offline'); };
  assert.equal((await sessions.restoreApiSession()).id, learner.id);
  await assert.rejects(sessions.authenticatedRequest('/learner/progress', 'PUT', {}, { expectedUserId: 'another-child' }), error => error.status === 401);
  assert.ok(stored.size > 0);
  await sessions.logoutApi();
});

test('safe reads retry once, mutations do not retry, server details stay private', async () => {
  let calls = 0;
  global.fetch = async () => { calls++; if (calls === 1) throw new Error('offline'); return ok({ items: [] }); };
  assert.deepEqual(await client.apiRequest('/quizzes'), { items: [] });
  assert.equal(calls, 2);
  calls = 0;
  global.fetch = async () => { calls++; throw new Error('private infrastructure error'); };
  await assert.rejects(client.apiRequest('/quiz-attempts', { method: 'POST', body: {} }), error => !error.message.includes('private'));
  assert.equal(calls, 1);
  global.fetch = async () => new Response(JSON.stringify({ error: { code: 'INVALID_REQUEST', message: 'private SQL details' } }), { status: 400 });
  await assert.rejects(client.apiRequest('/quizzes'), error => error.status === 400 && !error.message.includes('SQL'));
});

test('administrator tokens use secure storage and concurrent refresh is coalesced', async () => {
  global.fetch = async () => ok(session);
  await sessions.loginApi('admin@example.test', 'test-only-password');
  assert.equal(stored.size, 1);
  let refreshCalls = 0;
  global.fetch = async url => {
    assert.ok(url.endsWith('/auth/refresh')); refreshCalls++;
    await new Promise(resolve => setImmediate(resolve));
    return ok({ ...session, accessToken: 'access-2', refreshToken: 'refresh-2' });
  };
  assert.deepEqual(await Promise.all([sessions.getApiAccessToken(true), sessions.getApiAccessToken(true)]), ['access-2', 'access-2']);
  assert.equal(refreshCalls, 1);
  assert.ok([...stored.values()][0].includes('refresh-2'));
});

test('logout clears local admin access even if the service is unavailable', async () => {
  global.fetch = async () => { throw new Error('offline'); };
  await sessions.logoutApi();
  assert.equal(stored.size, 0);
  await assert.rejects(sessions.getApiAccessToken(), error => error.status === 401);
});

test('a late refresh cannot restore an administrator after logout', async () => {
  global.fetch = async () => ok(session);
  await sessions.loginApi('admin@example.test', 'test-only-password');
  let resolveRefresh;
  global.fetch = async url => url.endsWith('/auth/refresh') ? new Promise(resolve => { resolveRefresh = resolve; }) : ok({ loggedOut: true });
  const refreshing = sessions.getApiAccessToken(true);
  await sessions.logoutApi();
  resolveRefresh(ok({ ...session, accessToken: 'late-token' }));
  await assert.rejects(refreshing, error => error.status === 401);
  assert.equal(stored.size, 0);
});

test('non-admin accounts cannot enter the mobile admin session', async () => {
  global.fetch = async url => ok(url.endsWith('/auth/logout') ? {} : { ...session, user: { ...admin, role: 'learner' } });
  await assert.rejects(sessions.loginApi('learner@example.test', 'test-only-password'), error => error.status === 403);
  assert.equal(stored.size, 0);
});

test('published quiz subscription maps valid content and falls back without surfacing network errors', async () => {
  const { subscribeToPublishedCuratedQuizPresets } = require('../src/services/curatedQuizLearnerService');
  const quiz = { id: 'server-quiz', title: 'Family practice', status: 'published', learnerLevel: 'Preschool', gradeLevel: 'Preschool',
    questions: [{ id: 'q1', type: 'multiple-choice', prompt: 'Choose Mother.', options: ['Mother', 'Father'], answer: 'Mother' }] };
  global.fetch = async () => ok({ items: [quiz, { ...quiz, id: 'draft-quiz', status: 'draft' }], nextOffset: null });
  const updates = [];
  const stop = subscribeToPublishedCuratedQuizPresets(items => updates.push(items), { gradeLevel: 'Preschool' });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(updates.at(-1).length, 1);
  assert.equal(updates.at(-1)[0].id, 'curated-server-quiz');
  stop();
  global.fetch = async () => { throw new Error('private offline failure'); };
  const offline = [];
  const stopOffline = subscribeToPublishedCuratedQuizPresets(items => offline.push(items), {}, () => assert.fail('Raw network errors must not reach learner UI'));
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(offline.at(-1), []);
  stopOffline();
});

test('admin insights power grade-filtered reports and CSV export', async () => {
  const { getAdminInsights } = require('../src/services/admin/adminInsightsService');
  const { buildLiveAdminReport, reportToCsv } = require('../src/services/admin/liveAdminReports');
  const insights = {
    generatedAt: '2026-10-29T00:00:00.000Z',
    learners: { total: 2, active30Days: 1, completedLessons: 3, masteredTopics: 1, savedQuizAttempts: 4, averageLatestScore: 80, byGrade: {} },
    content: { quizStatus: { published: 1, draft: 1 }, contentStatus: { published: 1 }, worldCoverage: [] },
    learnerRows: [
      { id: 'one', displayName: 'Ana, Jr.', gradeLevel: 'Grade 1', totalXp: 20, completedLessons: 2, completedTopics: 1, savedQuizAttempts: 3, averageLatestScore: 80, lastActiveAt: '2026-10-29T00:00:00.000Z' },
      { id: 'two', displayName: 'Ben', gradeLevel: 'Grade 2', totalXp: 10, completedLessons: 1, completedTopics: 0, savedQuizAttempts: 1, averageLatestScore: 60, lastActiveAt: null },
    ],
    quizPerformance: [], recentActivity: [],
  };
  global.fetch = async url => {
    if (url.endsWith('/auth/login')) return ok(session);
    if (url.endsWith('/admin/insights')) return ok(insights);
    if (url.endsWith('/auth/logout')) return ok({});
    throw new Error(`Unexpected request: ${url}`);
  };
  await sessions.loginApi('admin@example.test', 'test-only-password');
  const data = await getAdminInsights({ role: 'admin' });
  const report = buildLiveAdminReport(data, 'learner-progress', 'Grade 1');
  assert.equal(report.tableRows.length, 1);
  assert.equal(report.summaryCards[0].value, '1');
  assert.ok(reportToCsv(report).includes('"Ana, Jr."'));
  assert.ok(reportToCsv({ tableHeaders: ['Name'], tableRows: [['=1+1']] }).includes('"\'=1+1"'));
  const coverage = buildLiveAdminReport(data, 'curriculum-coverage', 'Grade 1');
  assert.equal(coverage.tableRows[0][6], '1');
  await sessions.logoutApi();
});
