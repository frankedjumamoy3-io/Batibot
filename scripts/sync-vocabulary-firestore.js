const fs = require("fs");
const Module = require("module");
const path = require("path");
const ts = require("typescript");

const rootDir = path.resolve(__dirname, "..");
const projectId = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || "batibot-app-e3cc9";

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

const admin = require("../firebase/functions/node_modules/firebase-admin");
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
  };
}

async function deleteStaleVocabularyDocuments(db, collectionRef, currentIds) {
  const snapshot = await collectionRef.get();
  const staleDocs = snapshot.docs.filter((document) => !currentIds.has(document.id));
  const chunkSize = 450;

  for (let index = 0; index < staleDocs.length; index += chunkSize) {
    const batch = db.batch();
    const chunk = staleDocs.slice(index, index + chunkSize);

    chunk.forEach((document) => {
      batch.delete(document.ref);
    });

    await batch.commit();
    console.log(`Deleted stale vocabulary docs ${Math.min(index + chunk.length, staleDocs.length)} / ${staleDocs.length}`);
  }
}

async function main() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    });
  }

  const db = admin.firestore();
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  const collectionRef = db.collection("vocabularyItems");
  const chunkSize = 450;
  const currentIds = new Set(VOCABULARY_ITEMS.map((item) => item.id));

  await deleteStaleVocabularyDocuments(db, collectionRef, currentIds);

  for (let index = 0; index < VOCABULARY_ITEMS.length; index += chunkSize) {
    const batch = db.batch();
    const chunk = VOCABULARY_ITEMS.slice(index, index + chunkSize);

    chunk.forEach((item) => {
      const vocabularyItem = mapVocabularyItem(item);
      batch.set(
        collectionRef.doc(vocabularyItem.id),
        {
          ...vocabularyItem,
          sourceArchitecture: "learning-worlds",
          createdAt: timestamp,
          updatedAt: timestamp,
        }
      );
    });

    await batch.commit();
    console.log(`Synced ${Math.min(index + chunk.length, VOCABULARY_ITEMS.length)} / ${VOCABULARY_ITEMS.length}`);
  }

  console.log(`Firestore vocabulary sync complete for ${VOCABULARY_ITEMS.length} words.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
