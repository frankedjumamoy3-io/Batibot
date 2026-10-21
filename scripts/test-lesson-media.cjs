const assert = require('node:assert/strict');
const { test, after, afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const originalResolve = Module._resolveFilename;
const originalLoad = Module._load;
const assetPaths = new Map();
const createdPlayers = [];
const spoken = [];
const mocks = {
  'expo-audio': { createAudioPlayer: () => {
    const player = { plays: 0, pauses: 0, volume: 1, seekTo: async () => {}, play() { this.plays++; }, pause() { this.pauses++; } };
    createdPlayers.push(player);
    return player;
  } },
  'expo-speech': { stop: async () => {}, speak: (message) => spoken.push(message) },
};
Module._load = function(request, ...args) { return mocks[request] ?? originalLoad.call(this, request, ...args); };
Module._resolveFilename = function(request, parent, ...args) {
  return originalResolve.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, parent, ...args);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
for (const extension of ['.png', '.jpg', '.jpeg', '.mp3', '.wav', '.webp']) {
  require.extensions[extension] = (module, filename) => {
    const id = assetPaths.size + 1;
    assetPaths.set(id, filename);
    module.exports = id;
  };
}
global.__DEV__ = false;
const resolver = require('../src/services/assets/assetResolver');
const { LESSON_CONCEPT_ASSETS } = require('../src/data/assets/lesson-concept-assets');
const { batibotAssetRegistry } = require('../src/assets/assetRegistry');
const { resolveBatibotAsset } = require('../src/utils/batibotAssetResolver');
const audio = require('../src/services/audioService');
const speech = require('../src/services/speechService');
afterEach(() => { resolver.clearRuntimeAssets(); audio.setLearningAudioEnabled(true); });
after(() => { Module._load = originalLoad; Module._resolveFilename = originalResolve; });

test('every concrete picture label used in word activities resolves to real concept art in every grade', () => {
  const source = fs.readFileSync(path.join(root, 'app/(tabs)/play.tsx'), 'utf8');
  const labels = new Set([...source.matchAll(/imageLabel: "([^"]+)", word:/g)].map((match) => match[1]));
  assert.ok(labels.size >= 15);
  for (const worldId of ['grade1-word-kingdom', 'grade1-reading', 'grade2-vocabulary', 'grade3-context-clue-canyon']) {
    for (const label of labels) {
      const asset = resolver.resolveAsset({ topic: label, stage: 'PLAY', worldId });
      assert.ok(asset.localSource, `${worldId}: ${label} has no image`);
      assert.notEqual(asset.assetType, 'world', `${label} incorrectly shows a world`);
      assert.ok(asset.id.startsWith('concept_'), `${label} did not resolve semantically: ${asset.id}`);
      assert.ok(fs.existsSync(assetPaths.get(asset.localSource)), `${label} references a missing file`);
    }
  }
});

test('noun answers and opposite concepts have distinct pictures', () => {
  for (const labels of [['boy', 'dog', 'school', 'ball'], ['running child', 'walking child', 'smiling child', 'sad child']]) {
    const assets = labels.map((topic) => resolver.resolveAsset({ topic, worldId: 'grade1-word-kingdom' }));
    assert.equal(new Set(assets.map((asset) => asset.localSource)).size, 4);
  }
  for (const concept of LESSON_CONCEPT_ASSETS) {
    assert.equal(batibotAssetRegistry[concept.key].source, concept.source);
    assert.ok(concept.source, concept.key);
    assert.equal(resolveBatibotAsset({ key: concept.key, label: concept.label, grade: 'grade1', world: 'grade1-word-kingdom' }).source, concept.source);
  }
});

test('approved scoped uploads replace cached concept art; pending uploads cannot replace it', () => {
  const request = { topic: 'dog', stage: 'PLAY', worldId: 'grade1-word-kingdom' };
  const original = resolver.resolveAsset(request);
  const upload = {
    id: 'dog-play-upload', assetType: 'stage', category: 'illustration',
    altText: 'Dog', label: 'Dog', remoteUri: 'https://example.test/dog.png',
    topicId: 'grade1-word-kingdom-dog', worldId: request.worldId, stage: 'PLAY', tags: ['dog'],
  };
  resolver.registerAsset({ ...upload, status: 'pending-review' });
  assert.equal(resolver.resolveAsset(request).id, original.id);
  resolver.registerAsset({ ...upload, status: 'approved' });
  assert.equal(resolver.resolveAsset(original.resolutionRequest).id, upload.id);
  resolver.clearRuntimeAssets();
  assert.equal(resolver.resolveAsset(request).id, original.id);
});

test('world requests keep world artwork', () => {
  assert.equal(resolver.resolveWorldAsset('grade1-word-kingdom').assetType, 'world');
});

test('picture matching configurations have four distinct images and four distinct answers', () => {
  const source = fs.readFileSync(path.join(root, 'app/(tabs)/play.tsx'), 'utf8');
  const blocks = [...source.matchAll(/type: "image-word-drag",[\s\S]*?pairs: \[([\s\S]*?)\]/g)];
  assert.ok(blocks.length >= 8);
  for (const [, block] of blocks) {
    const pairs = [...block.matchAll(/imageLabel: "([^"]+)", word: "([^"]+)"/g)];
    assert.equal(pairs.length, 4);
    assert.equal(new Set(pairs.map((pair) => pair[2].toLowerCase())).size, 4);
    const pictures = pairs.map((pair) => resolver.resolveAsset({ topic: pair[1], worldId: 'grade1-word-kingdom' }).localSource);
    assert.equal(new Set(pictures).size, 4, `Ambiguous images: ${block}`);
  }
});

test('bundled sounds are short non-silent PCM files with headroom', () => {
  for (const name of ['tap', 'correct', 'retry', 'complete']) {
    const bytes = fs.readFileSync(path.join(root, 'assets/audio/feedback', `${name}.wav`));
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.readUInt32LE(40), bytes.length - 44);
    let peak = 0;
    for (let i = 44; i < bytes.length; i += 2) peak = Math.max(peak, Math.abs(bytes.readInt16LE(i)));
    assert.ok(peak > 1000 && peak < 32767);
    assert.ok((bytes.length - 44) / bytes.readUInt32LE(28) < 1.1);
  }
});

test('mute stops players, suppresses new cues and narration, and prevents pending playback', async () => {
  audio.setLearningAudioEnabled(true);
  assert.equal(audio.playLessonCue('correct'), true);
  await new Promise((resolve) => setImmediate(resolve));
  const player = createdPlayers.at(-1);
  assert.equal(player.plays, 1);
  audio.playLessonCue('correct');
  audio.setLearningAudioEnabled(false);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(player.plays, 1);
  assert.ok(player.pauses > 0);
  assert.equal(audio.playLessonCue('tap'), false);
  await speech.speakText('Dog');
  assert.deepEqual(spoken, []);
  audio.setLearningAudioEnabled(true);
  await speech.speakText('Dog');
  assert.deepEqual(spoken, ['Dog']);
});
