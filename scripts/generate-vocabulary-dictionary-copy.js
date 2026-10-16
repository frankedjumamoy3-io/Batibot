const fs = require("fs");
const Module = require("module");
const path = require("path");
const ts = require("typescript");

const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(
  rootDir,
  "src",
  "data",
  "vocabulary",
  "dictionary-copy-overrides.ts"
);
const documentationDir = path.resolve(rootDir, "..", "docs");
const reportPath = path.join(documentationDir, "vocabulary-dictionary-copy-report.md");
fs.mkdirSync(documentationDir, { recursive: true });
const apiBaseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en";
const requestDelayMs = 90;

process.env.BATIBOT_SKIP_DICTIONARY_OVERRIDES = "1";

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

const { VOCABULARY_ITEMS } = require("../src/data/vocabulary");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeWord(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizeForMatch(value) {
  return normalizeWord(value).replace(/[^a-z0-9]+/g, " ").trim();
}

function containsOwnWord(text, word) {
  const normalizedText = ` ${normalizeForMatch(text)} `;
  const normalizedWord = normalizeForMatch(word);

  if (!normalizedWord || normalizedWord.length <= 1) {
    return false;
  }

  if (normalizedWord.includes(" ")) {
    return normalizedText.includes(` ${normalizedWord} `);
  }

  return new RegExp(`\\b${normalizedWord}\\b`, "u").test(normalizedText);
}

function titleCase(value) {
  return value
    .split(/\s+/)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(" ");
}

function toSentence(value) {
  const trimmed = String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.?!])/g, "$1")
    .trim();

  if (!trimmed) {
    return "";
  }

  const sentence = `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
}

function cleanDefinition(value) {
  return toSentence(
    String(value ?? "")
      .replace(/\([^)]*\)/g, "")
      .replace(/\[[^\]]*\]/g, "")
      .replace(/^a word used to mean\s+/i, "Used to mean ")
      .replace(/^used as a function word to\s+/i, "Used to ")
      .replace(/^used to indicate\s+/i, "Used to show ")
      .replace(/^used to express\s+/i, "Used to show ")
      .replace(/^the act of\s+/i, "The action of ")
      .replace(/^the state of being\s+/i, "The state of being ")
  );
}

function cleanExample(value, word) {
  const sentence = toSentence(value);

  if (!sentence || sentence.length > 95) {
    return "";
  }

  if (!containsOwnWord(sentence, word)) {
    return "";
  }

  return sentence;
}

function isUsableDefinition(definition, word) {
  if (!definition) {
    return false;
  }

  if (definition.length < 12 || definition.length > 120) {
    return false;
  }

  if (containsOwnWord(definition, word)) {
    return false;
  }

  if (
    /\b(card|cards|lenormand|tarot|heraldry|obsolete|archaic|slang|vulgar|chemical element|genus|species)\b/i.test(
      definition
    )
  ) {
    return false;
  }

  return ![
    /^plural of /i,
    /^past tense of /i,
    /^present participle of /i,
    /^alternative form of /i,
    /^obsolete /i,
    /^archaic /i,
    /^misspelling of /i,
  ].some((pattern) => pattern.test(definition));
}

function isWeakLocalDefinition(definition) {
  return [
    /^A common reading/i,
    /^A data word/i,
    /^A math (idea|word)/i,
    /^A shape idea/i,
    /^A comparison idea/i,
    /^A measurement idea/i,
    /^A number name/i,
    /^A position idea/i,
    /^A simple term/i,
    /^An everyday idea/i,
    /^An outdoor idea/i,
    /^A living creature/i,
    /^A growing thing/i,
  ].some((pattern) => pattern.test(definition));
}

function isSimpleLocalDefinition(definition) {
  return (
    definition.length >= 12 &&
    definition.length <= 115 &&
    !isWeakLocalDefinition(definition)
  );
}

function scoreDefinition(definition) {
  let score = 100;

  score -= Math.max(0, definition.length - 72);

  if (/^Used to /i.test(definition)) {
    score += 20;
  }

  if (/^(A|An|The|To) /i.test(definition)) {
    score += 12;
  }

  if (/[;:]/.test(definition)) {
    score -= 16;
  }

  if (/\b(especially|specifically|technical|archaic|formal)\b/i.test(definition)) {
    score -= 18;
  }

  return score;
}

function getDefinitionsFromEntry(entry, word) {
  if (!Array.isArray(entry)) {
    return [];
  }

  return entry.flatMap((wordEntry) =>
    (wordEntry.meanings ?? []).flatMap((meaning) =>
      (meaning.definitions ?? []).map((definition) => ({
        definition: cleanDefinition(definition.definition),
        example: cleanExample(definition.example, word),
        partOfSpeech: meaning.partOfSpeech,
      }))
    )
  );
}

function pickDictionaryCopy(entry, item) {
  if (isSimpleLocalDefinition(item.definition)) {
    return null;
  }

  const definitions = getDefinitionsFromEntry(entry, item.word)
    .filter(({ definition }) => isUsableDefinition(definition, item.word))
    .sort((left, right) => scoreDefinition(right.definition) - scoreDefinition(left.definition));

  const selected = definitions[0];

  if (!selected) {
    return null;
  }

  return {
    definition: selected.definition,
    example: selected.example || item.example,
  };
}

async function fetchDictionaryEntry(item) {
  const word = normalizeWord(item.word);

  if (isSimpleLocalDefinition(item.definition)) {
    return null;
  }

  if (!/^[a-z]+(?: [a-z]+)?$/.test(word)) {
    return null;
  }

  const response = await fetch(`${apiBaseUrl}/${encodeURIComponent(word)}`);

  if (!response.ok) {
    return null;
  }

  return response.json();
}

function escapeTsString(value) {
  return JSON.stringify(value);
}

function buildOutputFile(overrides) {
  const rows = Object.entries(overrides)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([word, copy]) => {
      return `  ${escapeTsString(word)}: {\n    definition: ${escapeTsString(copy.definition)},\n    example: ${escapeTsString(copy.example)},\n  },`;
    })
    .join("\n");

  return [
    "export type VocabularyCopyOverride = {",
    "  definition: string;",
    "  example: string;",
    "};",
    "",
    "// Generated by scripts/generate-vocabulary-dictionary-copy.js.",
    "// Dictionary API output is cleaned into short, child-friendly BatiBot copy.",
    "export const DICTIONARY_COPY_OVERRIDES: Record<string, VocabularyCopyOverride> = {",
    rows,
    "};",
    "",
  ].join("\n");
}

function buildReport({ apiCount, fallbackCount, totalCount }) {
  return [
    "# Vocabulary Dictionary Copy Report",
    "",
    `Total local vocabulary rows: ${totalCount}`,
    `Rows improved with Dictionary API source: ${apiCount}`,
    `Rows kept from BatiBot local fallback rules: ${fallbackCount}`,
    "",
    "The app does not call the dictionary API at runtime. This report is produced by the batch script, then the cleaned copy is stored locally and can be synced to Firestore.",
    "",
  ].join("\n");
}

async function main() {
  if (typeof fetch !== "function") {
    throw new Error("This script needs Node.js with global fetch support.");
  }

  const overrides = {};
  let apiCount = 0;
  let fallbackCount = 0;

  for (const [index, item] of VOCABULARY_ITEMS.entries()) {
    let dictionaryCopy = null;

    try {
      const entry = await fetchDictionaryEntry(item);
      dictionaryCopy = entry ? pickDictionaryCopy(entry, item) : null;
    } catch {
      dictionaryCopy = null;
    }

    if (dictionaryCopy) {
      apiCount += 1;
      overrides[normalizeWord(item.word)] = dictionaryCopy;
    } else {
      fallbackCount += 1;
    }

    if ((index + 1) % 100 === 0 || index === VOCABULARY_ITEMS.length - 1) {
      console.log(
        `Processed ${index + 1} / ${VOCABULARY_ITEMS.length} (${apiCount} API, ${fallbackCount} fallback)`
      );
    }

    await sleep(requestDelayMs);
  }

  fs.writeFileSync(outputPath, buildOutputFile(overrides), "utf8");
  fs.writeFileSync(
    reportPath,
    buildReport({
      apiCount,
      fallbackCount,
      totalCount: VOCABULARY_ITEMS.length,
    }),
    "utf8"
  );

  console.log(`Wrote ${Object.keys(overrides).length} vocabulary copy overrides.`);
  console.log(`API source rows: ${apiCount}. Fallback rows: ${fallbackCount}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
