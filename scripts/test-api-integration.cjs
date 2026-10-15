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
