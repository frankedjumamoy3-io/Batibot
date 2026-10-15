import {
  collection,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  doc,
  deleteDoc,
  where,
  type FieldValue,
} from "firebase/firestore";

import { db } from "@/src/config/firebase";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import {
  VOCABULARY_CATEGORY_META,
  VOCABULARY_ITEMS,
  getVocabularyItem,
} from "@/src/data/vocabulary";
import type {
  VocabularyCategory,
  VocabularyItem,
  VocabularySubcategory,
} from "@/src/data/vocabulary";
import {
  getCurriculumStageForLearnerLevel,
  normalizeLearnerLevelValue,
} from "@/src/types/quiz";
import type {
  LearnerLevel,
  QuizGenerationVocabularyItem,
  QuizLayoutType,
  VocabularyQuestionSeed,
} from "@/src/types/quiz";

type JsonRecord = Record<string, unknown>;

export const VOCABULARY_COLLECTION = "vocabularyItems";

let publishedVocabularyItemsCache: VocabularyItem[] | null = null;
let publishedVocabularyItemsPromise: Promise<VocabularyItem[]> | null = null;

export type VocabularyPublicationStatus =
  | "draft"
  | "ready-for-review"
  | "published"
  | "archived";

export type VocabularyGenerationMode =
  | "selected_topic_only"
  | "random_from_approved_words"
  | "mixed_review"
  | "admin_prompt_guided";

export interface VocabularyGenerationFilters {
  adminPrompt?: string;
  category?: VocabularyCategory | "mixed";
  curriculumLevel?: number;
  learnerLevel?: LearnerLevel;
  limitCount?: number;
  mode?: VocabularyGenerationMode;
  randomize?: boolean;
  requiredWords?: string[];
  strictSubcategory?: boolean;
  subcategory?: string;
}

export interface FirestoreVocabularyItem extends QuizGenerationVocabularyItem {
  createdAt?: string | FieldValue | null;
  learningCycle?: string[];
  learningWorld?: string;
  sourceArchitecture?: string;
  updatedAt?: string | FieldValue | null;
}

function cleanString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function cleanStringArray(value: unknown) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        .map((item) => item.trim())
    : [];
}

function normalizeWord(word: string) {
  return word.trim().toLowerCase();
}

function normalizeWordKey(word: string) {
  return normalizeWord(word).replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function containsOwnVocabularyWord(copy: string, word: string) {
  const normalizedCopy = ` ${normalizeWordKey(copy)} `;
  const normalizedWord = normalizeWordKey(word);

  if (normalizedWord.length <= 1) {
    return false;
  }

  return normalizedWord.includes(" ")
    ? normalizedCopy.includes(` ${normalizedWord} `)
    : new RegExp(`\\b${normalizedWord}\\b`, "u").test(normalizedCopy);
}

function isWeakVocabularyCopy(copy: string, word: string, field: "meaning" | "sample" | "clue") {
  const normalizedCopy = normalizeWordKey(copy);

  if (!normalizedCopy) {
    return true;
  }

  if (field === "meaning" && containsOwnVocabularyWord(copy, word)) {
    return true;
  }

  if (field === "sample") {
    return [
      /^i can use .+ in a sentence$/u,
      /^we use .+ in this lesson$/u,
      /^we talk about .+ today$/u,
      /^we noticed .+ in a story$/u,
      /^we describe .+ clearly$/u,
      /^i see .+$/u,
    ].some((pattern) => pattern.test(normalizedCopy));
  }

  if (field === "clue") {
    return [
      /^find the word that means .+$/u,
      /^find the word that points to .+ in a sentence$/u,
      /^look for .+$/u,
    ].some((pattern) => pattern.test(normalizedCopy));
  }

  return false;
}

function resolveVocabularyCopy({
  field,
  firestoreCopy,
  localCopy,
  word,
}: {
  field: "meaning" | "sample" | "clue";
  firestoreCopy: string;
  localCopy?: string;
  word: string;
}) {
  if (!localCopy) {
    return firestoreCopy;
  }

  const firestoreCopyIsWeak = isWeakVocabularyCopy(firestoreCopy, word, field);
  const localCopyIsWeak = isWeakVocabularyCopy(localCopy, word, field);

  if (firestoreCopyIsWeak && !localCopyIsWeak) {
    return localCopy;
  }

  if (!firestoreCopyIsWeak && localCopyIsWeak) {
    return firestoreCopy;
  }

  return localCopy;
}

function normalizeStatus(value: unknown): VocabularyPublicationStatus {
  if (
    value === "draft" ||
    value === "ready-for-review" ||
    value === "published" ||
    value === "archived"
  ) {
    return value;
  }

  return "published";
}

function inferLearnerLevel(item: VocabularyItem): LearnerLevel {
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

function inferCurriculumLevel(learnerLevel: LearnerLevel) {
  return getCurriculumStageForLearnerLevel(learnerLevel);
}

function buildImagePrompt(item: VocabularyItem) {
  return `simple child-friendly picture of ${item.word.toLowerCase()}`;
}

function getLearningWorld(item: VocabularyItem) {
  return item.curriculumBand.split(" - ")[1] || item.subcategory;
}

function getSeedDistractors(item: VocabularyItem) {
  return VOCABULARY_ITEMS.filter(
    (candidate) =>
      candidate.subcategory === item.subcategory &&
      candidate.id !== item.id
  )
    .slice(0, 6)
    .map((candidate) => candidate.word);
}

function getSupportedQuizTypes(item: VocabularyItem): QuizLayoutType[] {
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

function buildQuestionSeeds(item: VocabularyItem): VocabularyQuestionSeed[] {
  const distractors = getSeedDistractors(item);
  const learnerLevel = inferLearnerLevel(item);
  const supportedQuizTypes = getSupportedQuizTypes(item);
  const word = item.word;

  const recognitionSeed: VocabularyQuestionSeed = {
    id: `${item.id}-recognition`,
    prompt: `Which one is ${word}?`,
    answer: word,
    distractors,
    reasoningType: "recognition",
    learnerLevel,
    supportedQuizTypes,
    explanation: item.definition,
    cognitiveSkill: "identify_vocabulary_word",
  };

  if (item.category === "numeric" && item.subcategory === "counting") {
    return [
      recognitionSeed,
      {
        id: `${item.id}-counting`,
        prompt: `Which choice shows ${word}?`,
        answer: word,
        distractors,
        reasoningType: "counting",
        learnerLevel,
        supportedQuizTypes,
        explanation: item.example,
        cognitiveSkill: "connect_number_word_to_quantity",
      },
    ];
  }

  if (item.category === "numeric" && item.subcategory === "adding") {
    return [
      recognitionSeed,
      {
        id: `${item.id}-addition-language`,
        prompt: `Which word helps us talk about putting groups together?`,
        answer: word,
        distractors,
        reasoningType: "addition",
        learnerLevel,
        supportedQuizTypes,
        explanation: item.definition,
        cognitiveSkill: "use_addition_vocabulary",
      },
    ];
  }

  if (item.category === "numeric" && item.subcategory === "comparing") {
    return [
      recognitionSeed,
      {
        id: `${item.id}-comparison-language`,
        prompt: `Which word helps us compare things?`,
        answer: word,
        distractors,
        reasoningType: "comparison",
        learnerLevel,
        supportedQuizTypes,
        explanation: item.definition,
        cognitiveSkill: "use_comparison_vocabulary",
      },
    ];
  }

  if (item.subcategory === "things") {
    return [
      recognitionSeed,
      {
        id: `${item.id}-function`,
        prompt: item.recognitionPrompt,
        answer: word,
        distractors,
        reasoningType: "classification",
        learnerLevel,
        supportedQuizTypes,
        explanation: item.definition,
        cognitiveSkill: "connect_object_to_use_or_clue",
      },
    ];
  }

  return [
    recognitionSeed,
    {
      id: `${item.id}-meaning`,
      prompt: `Which word matches this clue: ${item.recognitionPrompt}`,
      answer: word,
      distractors,
      reasoningType: "matching",
      learnerLevel,
      supportedQuizTypes,
      explanation: item.definition,
      cognitiveSkill: "match_word_to_clue",
    },
  ];
}

export function mapLocalVocabularyToFirestoreItem(
  item: VocabularyItem
): FirestoreVocabularyItem {
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
      ].map(normalizeWord))
    ),
    meaning: item.definition,
    sample: item.example,
    clue: item.recognitionPrompt,
    emoji: item.emoji,
    imagePrompt: buildImagePrompt(item),
    imageUri: item.imageUri,
    altText: item.word,
    status: "published",
    sourceArchitecture: "learning-worlds",
    questionSeeds: buildQuestionSeeds(item),
  };
}

function findLocalVocabularyItem(item: QuizGenerationVocabularyItem) {
  const normalizedItemWord = normalizeWordKey(item.word);

  return VOCABULARY_ITEMS.find(
    (candidate) =>
      candidate.id === item.id ||
      candidate.legacyIds.includes(item.id) ||
      normalizeWordKey(candidate.word) === normalizedItemWord
  );
}

function mergePublishedVocabularyWithLocalCopy(
  item: QuizGenerationVocabularyItem
): QuizGenerationVocabularyItem {
  const localItem = findLocalVocabularyItem(item);

  if (!localItem) {
    return item;
  }

  const localFirestoreItem = mapLocalVocabularyToFirestoreItem(localItem);

  return {
    ...item,
    word: localItem.word,
    normalizedWord: localFirestoreItem.normalizedWord,
    category: localFirestoreItem.category,
    subcategory: localFirestoreItem.subcategory,
    learnerLevel: localFirestoreItem.learnerLevel,
    curriculumLevel: localFirestoreItem.curriculumLevel,
    curriculumObjective: localFirestoreItem.curriculumObjective,
    skillTags: Array.from(new Set([...localFirestoreItem.skillTags, ...item.skillTags])),
    meaning: resolveVocabularyCopy({
      field: "meaning",
      firestoreCopy: item.meaning,
      localCopy: localItem.definition,
      word: localItem.word,
    }),
    sample: resolveVocabularyCopy({
      field: "sample",
      firestoreCopy: item.sample,
      localCopy: localItem.example,
      word: localItem.word,
    }),
    clue: resolveVocabularyCopy({
      field: "clue",
      firestoreCopy: item.clue,
      localCopy: localItem.recognitionPrompt,
      word: localItem.word,
    }),
    emoji: localItem.emoji,
    imagePrompt: localFirestoreItem.imagePrompt,
    imageUri: localItem.imageUri,
    altText: localItem.word,
    questionSeeds: localFirestoreItem.questionSeeds,
  };
}

function mergeDuplicateQuizVocabularyItems(items: QuizGenerationVocabularyItem[]) {
  const mergedItems: QuizGenerationVocabularyItem[] = [];
  const itemsByWord = new Map<string, QuizGenerationVocabularyItem>();

  items.forEach((item) => {
    const normalizedWord = normalizeWordKey(item.word);
    const existingItem = itemsByWord.get(normalizedWord);

    if (!existingItem) {
      itemsByWord.set(normalizedWord, item);
      mergedItems.push(item);
      return;
    }

    existingItem.skillTags = Array.from(
      new Set([...existingItem.skillTags, ...item.skillTags])
    );
  });

  return mergedItems;
}

function mergeDuplicateLearnerVocabularyItems(items: VocabularyItem[]) {
  const mergedItems: VocabularyItem[] = [];
  const itemsByWord = new Map<string, VocabularyItem>();

  items.forEach((item) => {
    const normalizedWord = normalizeWordKey(item.word);
    const existingItem = itemsByWord.get(normalizedWord);

    if (!existingItem) {
      const nextItem = { ...item, legacyIds: Array.from(new Set(item.legacyIds)) };

      itemsByWord.set(normalizedWord, nextItem);
      mergedItems.push(nextItem);
      return;
    }

    existingItem.legacyIds = Array.from(
      new Set([...existingItem.legacyIds, item.id, ...item.legacyIds])
    );
  });

  return mergedItems;
}

function mapPublishedVocabularyToLearnerItem(
  item: QuizGenerationVocabularyItem
): VocabularyItem {
  const localItem = findLocalVocabularyItem(item);
  const category: VocabularyCategory =
    item.category === "numeric" ? "numeric" : "linguistic";
  const categoryMeta = VOCABULARY_CATEGORY_META[category];
  const subcategory = item.subcategory as VocabularySubcategory;

  return {
    id: item.id,
    legacyIds: localItem
      ? Array.from(new Set([localItem.id, ...localItem.legacyIds].filter((id) => id !== item.id)))
      : [],
    word: localItem?.word ?? item.word,
    pronunciation: localItem?.pronunciation ?? item.word,
    definition: item.meaning || item.curriculumObjective,
    example: item.sample || `I can use ${item.word} in a sentence.`,
    imageUri: item.imageUri ?? "",
    emoji: item.emoji || "?",
    accentColor: localItem?.accentColor ?? categoryMeta.accentColor,
    category,
    subcategory,
    curriculumBand:
      localItem?.curriculumBand ?? `Level ${item.curriculumLevel} vocabulary`,
    learningGoal: item.curriculumObjective || localItem?.learningGoal || categoryMeta.targetSkill,
    recognitionPrompt:
      item.clue || localItem?.recognitionPrompt || `Look for ${item.word}.`,
    searchTerms: Array.from(
      new Set(
        [
          item.word,
          item.normalizedWord,
          item.subcategory,
          item.curriculumObjective,
          item.meaning,
          item.sample,
          item.clue,
          ...item.skillTags,
          ...(localItem?.searchTerms ?? []),
        ]
          .map((term) => term.trim())
          .filter(Boolean)
      )
    ),
  };
}

function normalizeQuestionSeeds(value: unknown): VocabularyQuestionSeed[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((seed): VocabularyQuestionSeed | null => {
      if (!seed || typeof seed !== "object") {
        return null;
      }

      const item = seed as JsonRecord;
      const id = cleanString(item.id);
      const prompt = cleanString(item.prompt);
      const answer = cleanString(item.answer);
      const reasoningType =
        item.reasoningType === "recognition" ||
        item.reasoningType === "matching" ||
        item.reasoningType === "classification" ||
        item.reasoningType === "counting" ||
        item.reasoningType === "comparison" ||
        item.reasoningType === "sequencing" ||
        item.reasoningType === "addition" ||
        item.reasoningType === "short_scenario" ||
        item.reasoningType === "mixed_review"
          ? item.reasoningType
          : "recognition";
      const learnerLevel = normalizeLearnerLevelValue(
        item.learnerLevel,
        "Kindergarten"
      );

      if (!id || !prompt || !answer) {
        return null;
      }

      return {
        id,
        prompt,
        answer,
        distractors: cleanStringArray(item.distractors),
        reasoningType,
        learnerLevel,
        supportedQuizTypes: cleanStringArray(item.supportedQuizTypes).filter(
          (type): type is QuizLayoutType =>
            [
              "multiple-choice",
              "fill-in-the-blank",
              "matching",
              "image-to-word",
              "word-to-image",
              "true-or-false",
              "word-problem",
              "ordering",
              "counting-objects",
              "compare-numbers",
              "picture-based",
              "scenario",
              "text-to-speech",
              "speech-to-text",
              "image-choice",
              "timed-challenge",
            ].includes(type)
        ),
        explanation: cleanString(item.explanation),
        cognitiveSkill: cleanString(item.cognitiveSkill, "practice_vocabulary"),
      };
    })
    .filter((seed): seed is VocabularyQuestionSeed => !!seed);
}

function buildFallbackDocumentSeed({
  id,
  learnerLevel,
  meaning,
  word,
}: {
  id: string;
  learnerLevel: LearnerLevel;
  meaning: string;
  word: string;
}): VocabularyQuestionSeed {
  return {
    id: `${id}-recognition`,
    prompt: `Which one is ${word}?`,
    answer: word,
    distractors: [],
    reasoningType: "recognition",
    learnerLevel,
    supportedQuizTypes: ["multiple-choice", "image-to-word", "word-to-image"],
    explanation: meaning,
    cognitiveSkill: "identify_vocabulary_word",
  };
}

function normalizeVocabularyDocument(
  id: string,
  data: JsonRecord
): QuizGenerationVocabularyItem | null {
  const word = cleanString(data.word);
  const category = data.category === "numeric" ? "numeric" : "linguistic";
  const subcategory = cleanString(data.subcategory);
  const localItem =
    getVocabularyItem(id) ??
    VOCABULARY_ITEMS.find(
      (candidate) =>
        normalizeWord(candidate.word) === normalizeWord(word) &&
        candidate.category === category &&
        candidate.subcategory === subcategory
    ) ??
    null;

  if (!word || !subcategory) {
    return null;
  }

  const learnerLevel = normalizeLearnerLevelValue(
    data.learnerLevel,
    localItem ? inferLearnerLevel(localItem) : "Kindergarten"
  );

  const questionSeeds = normalizeQuestionSeeds(data.questionSeeds);

  return {
    id,
    word,
    normalizedWord: cleanString(data.normalizedWord, normalizeWord(word)),
    category,
    subcategory,
    learnerLevel,
    curriculumLevel:
      typeof data.curriculumLevel === "number" && data.curriculumLevel > 0
        ? data.curriculumLevel
        : inferCurriculumLevel(learnerLevel),
    curriculumObjective: cleanString(
      data.curriculumObjective,
      "Practice an approved BatiBot vocabulary word."
    ),
    skillTags: cleanStringArray(data.skillTags),
    meaning: cleanString(data.meaning),
    sample: cleanString(data.sample),
    clue: cleanString(data.clue),
    emoji: cleanString(data.emoji) || undefined,
    imagePrompt: cleanString(data.imagePrompt, `simple child-friendly picture of ${word}`),
    imageUri: cleanString(data.imageUri) || undefined,
    imageAssetId: cleanString(data.imageAssetId) || undefined,
    altText: cleanString(data.altText, word),
    status: normalizeStatus(data.status),
    questionSeeds: questionSeeds.length
      ? questionSeeds
      : [
          buildFallbackDocumentSeed({
            id,
            learnerLevel,
            meaning: cleanString(data.meaning),
            word,
          }),
        ],
  };
}

function mapPublishedDocumentToLearnerItem(id: string, data: JsonRecord) {
  const normalizedItem = normalizeVocabularyDocument(id, data);

  if (!normalizedItem || normalizedItem.status !== "published") {
    return null;
  }

  return mapPublishedVocabularyToLearnerItem(
    mergePublishedVocabularyWithLocalCopy(normalizedItem)
  );
}

function scoreVocabularyForFilters(
  item: QuizGenerationVocabularyItem,
  filters: VocabularyGenerationFilters
) {
  let score = 0;
  const promptTerms = getPromptTerms(filters.adminPrompt ?? "");

  if (filters.subcategory && item.subcategory === filters.subcategory) {
    score += 5;
  }

  if (filters.learnerLevel && item.learnerLevel === filters.learnerLevel) {
    score += 3;
  }

  if (filters.curriculumLevel && item.curriculumLevel === filters.curriculumLevel) {
    score += 2;
  }

  if (filters.mode === "admin_prompt_guided" && promptTerms.length) {
    score += promptTerms.reduce((total, term) => {
      const searchableText = [
        item.word,
        item.subcategory,
        item.curriculumObjective,
        item.meaning,
        item.sample,
        item.clue,
        ...item.skillTags,
      ]
        .join(" ")
        .toLowerCase();

      return total + (searchableText.includes(term) ? 4 : 0);
    }, 0);
  }

  return score;
}

function getPromptTerms(prompt: string) {
  const stopWords = new Set([
    "a",
    "about",
    "an",
    "and",
    "for",
    "in",
    "of",
    "quiz",
    "the",
    "to",
    "with",
  ]);

  return prompt
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 3 && !stopWords.has(term));
}

function shuffleVocabularyItems(items: QuizGenerationVocabularyItem[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function filterVocabularyItems(
  items: QuizGenerationVocabularyItem[],
  filters: VocabularyGenerationFilters
) {
  const mode = filters.mode ?? "selected_topic_only";
  const requiredWords = new Set((filters.requiredWords ?? []).map(normalizeWordKey));
  const filtered = items.filter((item) => {
    if (item.status !== "published") {
      return false;
    }

    if (
      filters.category &&
      filters.category !== "mixed" &&
      item.category !== filters.category
    ) {
      return false;
    }

    if (filters.strictSubcategory && filters.subcategory && item.subcategory !== filters.subcategory) {
      return false;
    }

    return true;
  });
  const requiredItems = requiredWords.size
    ? filtered.filter(
        (item) =>
          requiredWords.has(normalizeWordKey(item.word)) ||
          requiredWords.has(normalizeWordKey(item.normalizedWord))
      )
    : [];
  const requiredItemIds = new Set(requiredItems.map((item) => item.id));
  const filteredWithRequiredFirst = [
    ...requiredItems,
    ...shuffleVocabularyItems(filtered.filter((item) => !requiredItemIds.has(item.id))),
  ];

  if (requiredWords.size && requiredItems.length) {
    return filteredWithRequiredFirst.slice(0, filters.limitCount ?? 12);
  }

  if (mode === "random_from_approved_words") {
    return shuffleVocabularyItems(filtered).slice(0, filters.limitCount ?? 12);
  }

  if (mode === "selected_topic_only" && filters.randomize !== false) {
    return shuffleVocabularyItems(filtered).slice(0, filters.limitCount ?? 12);
  }

  if (mode === "mixed_review") {
    const grouped = filtered.reduce<Record<string, QuizGenerationVocabularyItem[]>>(
      (groups, item) => {
        groups[item.subcategory] = [...(groups[item.subcategory] ?? []), item];
        return groups;
      },
      {}
    );
    const mixed = Object.values(grouped).flatMap((group) =>
      shuffleVocabularyItems(group).slice(0, 3)
    );

    return shuffleVocabularyItems(mixed).slice(0, filters.limitCount ?? 12);
  }

  return filtered
    .sort((first, second) => {
      const scoreDelta =
        scoreVocabularyForFilters(second, filters) -
        scoreVocabularyForFilters(first, filters);

      return scoreDelta || first.word.localeCompare(second.word);
    })
    .slice(0, filters.limitCount ?? 12);
}

export async function getPublishedVocabularyForQuizGeneration(
  filters: VocabularyGenerationFilters
) {
  if (USE_NODE_BACKEND) return filterVocabularyItems(VOCABULARY_ITEMS.map(mapLocalVocabularyToFirestoreItem), filters);
  const mode = filters.mode ?? "selected_topic_only";
  const constraints = [where("status", "==", "published")];

  if (filters.category && filters.category !== "mixed") {
    constraints.push(where("category", "==", filters.category));
  }

  if ((mode === "selected_topic_only" || filters.strictSubcategory) && filters.subcategory) {
    constraints.push(where("subcategory", "==", filters.subcategory));
  }

  try {
    const snapshot = await getDocs(
      query(collection(db, VOCABULARY_COLLECTION), ...constraints)
    );
    const firestoreItems = snapshot.docs
      .map((itemDoc) =>
        normalizeVocabularyDocument(itemDoc.id, itemDoc.data() as JsonRecord)
      )
      .filter((item): item is QuizGenerationVocabularyItem => !!item)
      .map(mergePublishedVocabularyWithLocalCopy);

    if (firestoreItems.length) {
      return filterVocabularyItems(
        mergeDuplicateQuizVocabularyItems(firestoreItems),
        filters
      );
    }
  } catch {
    // Local vocabulary keeps the generator usable before Firestore vocabulary is seeded.
  }

  return filterVocabularyItems(
    VOCABULARY_ITEMS.map(mapLocalVocabularyToFirestoreItem),
    filters
  );
}

async function loadPublishedVocabularyItemsFromFirestore() {
  if (USE_NODE_BACKEND) return VOCABULARY_ITEMS;
  try {
    const snapshot = await getDocs(
      query(collection(db, VOCABULARY_COLLECTION), where("status", "==", "published"))
    );
    const firestoreItems = snapshot.docs
      .map((itemDoc) => mapPublishedDocumentToLearnerItem(
        itemDoc.id,
        itemDoc.data() as JsonRecord
      ))
      .filter((item): item is VocabularyItem => !!item)
      .sort((first, second) => first.word.localeCompare(second.word));

    if (firestoreItems.length) {
      return mergeDuplicateLearnerVocabularyItems(firestoreItems);
    }
  } catch {
    // Keep learner vocabulary usable when Firestore is unavailable or unseeded.
  }

  return VOCABULARY_ITEMS;
}

export async function getPublishedVocabularyItems() {
  if (publishedVocabularyItemsCache) {
    return publishedVocabularyItemsCache;
  }

  if (!publishedVocabularyItemsPromise) {
    publishedVocabularyItemsPromise = loadPublishedVocabularyItemsFromFirestore()
      .then((items) => {
        publishedVocabularyItemsCache = items;
        return items;
      })
      .finally(() => {
        publishedVocabularyItemsPromise = null;
      });
  }

  return publishedVocabularyItemsPromise;
}

export async function getPublishedVocabularyItemById(id?: string | string[]) {
  const itemId = Array.isArray(id) ? id[0] : id;

  if (!itemId) {
    return null;
  }

  const localItem = getVocabularyItem(itemId) ?? null;
  if (USE_NODE_BACKEND) return localItem;
  const cachedItem = publishedVocabularyItemsCache?.find(
    (item) => item.id === itemId || item.legacyIds.includes(itemId)
  );

  if (cachedItem) {
    return cachedItem;
  }

  try {
    const directSnapshot = await getDoc(doc(db, VOCABULARY_COLLECTION, itemId));

    if (directSnapshot.exists()) {
      const directItem = mapPublishedDocumentToLearnerItem(
        directSnapshot.id,
        directSnapshot.data() as JsonRecord
      );

      if (directItem) {
        return directItem;
      }
    }

    if (localItem) {
      const snapshot = await getDocs(
        query(
          collection(db, VOCABULARY_COLLECTION),
          where("status", "==", "published"),
          where("normalizedWord", "==", normalizeWord(localItem.word)),
          limit(3)
        )
      );
      const matchedItem = snapshot.docs
        .map((itemDoc) => mapPublishedDocumentToLearnerItem(
          itemDoc.id,
          itemDoc.data() as JsonRecord
        ))
        .find((item): item is VocabularyItem =>
          !!item &&
          (item.id === itemId ||
            item.legacyIds.includes(itemId) ||
            normalizeWordKey(item.word) === normalizeWordKey(localItem.word))
        );

      if (matchedItem) {
        return matchedItem;
      }
    }
  } catch {
    // Local vocabulary keeps detail screens instant when Firestore is slow.
  }

  return (
    publishedVocabularyItemsCache?.find(
      (item) => item.id === itemId || item.legacyIds.includes(itemId)
    ) ??
    localItem ??
    null
  );
}

export async function seedPublishedVocabularyItems() {
  if (USE_NODE_BACKEND) throw new Error("Live vocabulary seeding is disabled for controlled testing.");
  const timestamp = serverTimestamp();
  const currentIds = new Set(VOCABULARY_ITEMS.map((item) => item.id));
  const snapshot = await getDocs(collection(db, VOCABULARY_COLLECTION));
  const staleDeletes = snapshot.docs
    .filter((itemDoc) => !currentIds.has(itemDoc.id))
    .map((itemDoc) => deleteDoc(itemDoc.ref));

  await Promise.all(staleDeletes);

  const writeResults = await Promise.all(
    VOCABULARY_ITEMS.map((item) => {
      const vocabularyItem = mapLocalVocabularyToFirestoreItem(item);

      return setDoc(
        doc(db, VOCABULARY_COLLECTION, vocabularyItem.id),
        {
          ...vocabularyItem,
          createdAt: timestamp,
          updatedAt: timestamp,
        }
      );
    })
  );

  publishedVocabularyItemsCache = null;
  publishedVocabularyItemsPromise = null;

  return writeResults.length;
}
