const fs = require("fs");
const Module = require("module");
const path = require("path");
const ts = require("typescript");

const rootDir = path.resolve(__dirname, "..");

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return originalResolveFilename.call(
      this,
      path.join(rootDir, request.slice(2)),
      parent,
      isMain,
      options
    );
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require.extensions[".ts"] = function loadTs(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.React,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  });

  module._compile(transpiled.outputText, filename);
};

function escapeCell(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
}

const { VOCABULARY_ITEMS } = require("../src/data/vocabulary");

const rows = VOCABULARY_ITEMS.map((item) =>
  [
    item.category,
    item.subcategory,
    item.word,
    item.definition,
    item.example,
  ]
    .map(escapeCell)
    .join(" | ")
);

const markdown = [
  "# BatiBot Vocabulary Word Copy List",
  "",
  `Local source words scanned: ${VOCABULARY_ITEMS.length}.`,
  "Firestore sync source: this local list is written to `vocabularyItems` by the admin vocabulary sync and by `scripts/sync-vocabulary-firestore.js` when admin credentials are available.",
  "",
  "| Category | Subcategory | Word | Meaning | Example sentence |",
  "|---|---|---|---|---|",
  ...rows.map((row) => `| ${row} |`),
  "",
].join("\n");

fs.writeFileSync(
  path.join(rootDir, "docs", "vocabulary-word-copy-list.md"),
  markdown,
  "utf8"
);

console.log(`Exported ${VOCABULARY_ITEMS.length} vocabulary rows.`);
