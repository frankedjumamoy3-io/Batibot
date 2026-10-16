const assert = require('node:assert/strict');
const test = require('node:test');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { validatePreviewConfig } = require('./validate-preview-config.cjs');
const valid = { EXPO_PUBLIC_ENABLE_QA_MODE: 'true', EXPO_PUBLIC_API_BASE_URL: 'https://batibot-test.onrender.com/api/v1/' };

test('accepts the HTTPS API and normalizes a trailing slash', () => {
  assert.equal(validatePreviewConfig(valid), 'https://batibot-test.onrender.com/api/v1');
});
test('requires the QA flag', () => {
  for (const value of [undefined, '', 'false']) {
    assert.throws(() => validatePreviewConfig({ ...valid, EXPO_PUBLIC_ENABLE_QA_MODE: value }));
  }
});
test('rejects missing, local, insecure, credential-bearing, and malformed API configuration', () => {
  for (const value of ['', 'not a URL', 'http://test.onrender.com/api/v1', 'https://localhost/api/v1',
    'https://10.0.2.2/api/v1', 'https://example.com/api/v1', 'https://test.onrender.com/',
    'https://user:password@test.onrender.com/api/v1', 'https://test.onrender.com/api/v1?token=x',
    'https://test.onrender.com/api/v1#fragment']) {
    assert.throws(() => validatePreviewConfig({ ...valid, EXPO_PUBLIC_API_BASE_URL: value }));
  }
});
test('EAS hook blocks an unconfigured preview but leaves other profiles unchanged', () => {
  const script = path.join(__dirname, 'validate-preview-config.cjs');
  for (const [profile, status] of [['preview', 1], ['development', 0], ['production', 0]]) {
    const result = spawnSync(process.execPath, [script, '--eas-hook'], {
      env: { ...process.env, EAS_BUILD_PROFILE: profile, EXPO_PUBLIC_API_BASE_URL: '', EXPO_PUBLIC_ENABLE_QA_MODE: 'true' },
      encoding: 'utf8',
    });
    assert.equal(result.status, status, result.stderr);
  }
});
