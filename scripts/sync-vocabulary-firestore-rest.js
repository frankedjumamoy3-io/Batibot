const fs = require("fs");
const Module = require("module");
const os = require("os");
const path = require("path");
const ts = require("typescript");

const rootDir = path.resolve(__dirname, "..");
const projectId =
  process.env.GCLOUD_PROJECT ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  "batibot-app-e3cc9";

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

function normalizeWord(word) {
  return word.trim().toLowerCase();
}

function normalizeSkillTag(value) {
  return normalizeWord(value).replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function inferLearnerLevel(item) {
  if (item.curriculumBand.startsWith("Preschool")) {
    return "Preschool";
  }

  if (item.curriculumBand.startsWith("Kindergarten")) {
    return "Kindergarten";
  }

  if (item.curriculumBand.startsWith("Grade 1")) {
    return "Grade 1";
  }

  if (item.curriculumBand.startsWith("Grade 2")) {
    return "Grade 2";
  }

  if (item.curriculumBand.startsWith("Grade 3")) {
    return "Grade 3";
  }

  return "Preschool";
}

function inferCurriculumLevel(learnerLevel) {
  switch (learnerLevel) {
    case "Kindergarten":
      return 2;
    case "Grade 1":
      return 3;
    case "Grade 2":
      return 4;
    case "Grade 3":
      return 5;
    case "Preschool":
    default:
      return 1;
  }
}

function getLearningWorld(item) {
  return item.curriculumBand.split(" - ")[1] || item.subcategory;
}

function getSupportedQuizTypes(item) {
  if (item.category === "numeric" && item.subcategory === "counting") {
    return ["counting-objects", "multiple-choice", "ordering"];
  }

  if (item.category === "numeric" && item.subcategory === "adding") {
    return ["word-problem", "scenario", "multiple-choice"];
  }

  if (item.category === "numeric" && item.subcategory === "comparing") {
    return ["compare-numbers", "true-or-false", "multiple-choice"];
  }

  if (item.category === "numeric" && item.subcategory === "shapes") {
    return ["picture-based", "matching", "multiple-choice"];
  }

  return ["image-to-word", "word-to-image", "multiple-choice", "matching"];
}

function getDistractors(item) {
  return VOCABULARY_ITEMS.filter(
    (candidate) => candidate.subcategory === item.subcategory && candidate.id !== item.id
  )
    .slice(0, 6)
    .map((candidate) => candidate.word);
}

function buildQuestionSeeds(item, learnerLevel) {
  const supportedQuizTypes = getSupportedQuizTypes(item);
  const distractors = getDistractors(item);
  const recognitionSeed = {
    id: `${item.id}-recognition`,
    prompt: `Which one is ${item.word}?`,
    answer: item.word,
    distractors,
    reasoningType: "recognition",
    learnerLevel,
    supportedQuizTypes,
    explanation: item.definition,
    cognitiveSkill: "identify_vocabulary_word",
  };

  return [
    recognitionSeed,
    {
      id: `${item.id}-meaning`,
      prompt: `Which word matches this clue: ${item.recognitionPrompt}`,
      answer: item.word,
      distractors,
      reasoningType: item.category === "numeric" ? "comparison" : "matching",
      learnerLevel,
      supportedQuizTypes,
      explanation: item.definition,
      cognitiveSkill: "match_word_to_clue",
    },
  ];
}

function mapVocabularyItem(item) {
  const learnerLevel = inferLearnerLevel(item);

  return {
    id: item.id,
    word: item.word,
    normalizedWord: normalizeWord(item.word),
    category: item.category,
    subcategory: item.subcategory,
    learningWorld: getLearningWorld(item),
    learnerLevel,
    curriculumLevel: inferCurriculumLevel(learnerLevel),
    curriculumObjective: item.learningGoal,
    learningCycle: [
      "discover",
      "explore",
      "interact",
      "practice",
      "challenge",
      "reward",
      "progress",
      "mastery",
    ],
    skillTags: Array.from(
      new Set([
        item.category,
        item.subcategory,
        getLearningWorld(item),
        ...item.searchTerms,
      ].map(normalizeSkillTag))
    ),
    meaning: item.definition,
    sample: item.example,
    clue: item.recognitionPrompt,
    emoji: item.emoji,
    imagePrompt: `simple child-friendly picture of ${item.word.toLowerCase()}`,
    imageUri: item.imageUri,
    altText: item.word,
    status: "published",
    questionSeeds: buildQuestionSeeds(item, learnerLevel),
    sourceArchitecture: "learning-worlds",
    updatedAt: new Date().toISOString(),
  };
}

function toFirestoreValue(value) {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }

  if (typeof value === "string") {
    return { stringValue: value };
  }

  if (typeof value === "boolean") {
    return { booleanValue: value };
  }

  if (Number.isInteger(value)) {
    return { integerValue: `${value}` };
  }

  if (typeof value === "number") {
    return { doubleValue: value };
  }

  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }

  return {
    mapValue: {
      fields: Object.fromEntries(
        Object.entries(value).map(([key, nestedValue]) => [
          key,
          toFirestoreValue(nestedValue),
        ])
      ),
    },
  };
}

function toFirestoreFields(document) {
  return Object.fromEntries(
    Object.entries(document).map(([key, value]) => [key, toFirestoreValue(value)])
  );
}

function getFirebaseCliAccessToken() {
  const configPath = path.join(os.homedir(), ".config", "configstore", "firebase-tools.json");

  if (!fs.existsSync(configPath)) {
    throw new Error("Firebase CLI credential file was not found. Run `npx firebase-tools login` first.");
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const accessToken = config.tokens?.access_token;

  if (!accessToken) {
    throw new Error("Firebase CLI access token was not found. Run `npx firebase-tools projects:list` first.");
  }

  return accessToken;
}

async function batchWriteVocabulary(accessToken, documents) {
  const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:batchWrite`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      writes: documents.map((document) => ({
        update: {
          name: `projects/${projectId}/databases/(default)/documents/vocabularyItems/${encodeURIComponent(document.id)}`,
          fields: toFirestoreFields(document),
        },
      })),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Firestore batchWrite failed (${response.status}): ${errorText}`);
  }

  return response.json();
}

async function listVocabularyDocumentIds(accessToken) {
  const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/vocabularyItems?pageSize=1000`;
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Firestore vocabulary list failed (${response.status}): ${errorText}`);
  }

  const payload = await response.json();

  return (payload.documents ?? []).map((document) =>
    decodeURIComponent(document.name.split("/").pop())
  );
}

async function batchDeleteVocabulary(accessToken, ids) {
  if (!ids.length) {
    return;
  }

  const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:batchWrite`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      writes: ids.map((id) => ({
        delete: `projects/${projectId}/databases/(default)/documents/vocabularyItems/${encodeURIComponent(id)}`,
      })),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Firestore vocabulary delete failed (${response.status}): ${errorText}`);
  }
}

async function main() {
  const accessToken = getFirebaseCliAccessToken();
  const documents = VOCABULARY_ITEMS.map(mapVocabularyItem);
  const chunkSize = 450;
  const currentIds = new Set(documents.map((document) => document.id));
  const existingIds = await listVocabularyDocumentIds(accessToken);
  const staleIds = existingIds.filter((id) => !currentIds.has(id));

  for (let index = 0; index < staleIds.length; index += chunkSize) {
    const chunk = staleIds.slice(index, index + chunkSize);
    await batchDeleteVocabulary(accessToken, chunk);
    console.log(`Deleted stale vocabulary docs ${Math.min(index + chunk.length, staleIds.length)} / ${staleIds.length}`);
  }

  for (let index = 0; index < documents.length; index += chunkSize) {
    const chunk = documents.slice(index, index + chunkSize);

    await batchWriteVocabulary(accessToken, chunk);
    console.log(`Synced ${Math.min(index + chunk.length, documents.length)} / ${documents.length}`);
  }

  console.log(`Firestore vocabulary REST sync complete for ${documents.length} words.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
