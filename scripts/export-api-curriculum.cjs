// Emits validation metadata only; no Firebase access or database writes.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const original = Module._resolveFilename;
Module._resolveFilename = function(request, parent, ...rest) {
  return original.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, parent, ...rest);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText, filename);
const { CURRICULUM } = require('../src/data/curriculum/learning-path');
process.stdout.write(JSON.stringify(CURRICULUM.flatMap(grade => grade.worlds.map(world => ({
  gradeLevel: grade.gradeLevel, worldId: world.id,
  topics: world.topics.flatMap(topic => [topic.title, `${world.id}:${topic.title}`, topic.batibotContent?.id].filter(Boolean)),
}))), null, 2));
