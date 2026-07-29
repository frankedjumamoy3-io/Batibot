import {
  FieldValue,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { User } from "firebase/auth";

import { db } from "@/src/config/firebase";
import { getCurriculumPromptContext } from "@/src/content/curriculum";
import {
  ACTIVE_LEARNING_PHASES,
  DEFAULT_CHALLENGE_RULE,
  LEARNING_STAGE_RULES,
  type ActiveLearningPhase,
} from "@/src/data/curriculum/learning-path";
import { requestGeminiQuizDraft } from "@/src/infrastructure/gemini/quiz-draft-client";
import {
  buildBatiBotCurriculumDraftApiContract,
  buildBatiBotCurriculumPromptSection,
} from "@/src/services/curriculumDraftApi";
import {
  getBlockingPublishIssues,
  validateAdminPlayContentForPublish,
} from "@/src/domain/rules/admin-publish-rules";
import type {
  QuizCategory,
  QuizDifficulty,
  QuizRewards,
  UnlockRequirements,
} from "@/src/data/quiz/types";
import {
  CuratedQuiz,
  CuratedQuizDraft,
  CuratedQuizQuestion,
  CuratedQuizStatus,
  DRAFT_LIFECYCLE_STATUSES,
  DEFAULT_REVIEW_CHECKLIST,
  DraftLifecycleStatus,
  FillInTheBlankQuestion,
  GenerateQuizDraftInput,
  LearnerLevel,
  MatchingPair,
  MatchingQuestion,
  MultipleChoiceQuestion,
  QUESTION_REASONING_TYPES,
  QUIZ_INTERACTION_TYPES,
  QUIZ_LAYOUT_TYPES,
  QuizGenerationVocabularyItem,
  QuizInteractionType,
  QuizQualitySummary,
  QuizReviewChecklist,
  QuizLayoutType,
  QuestionReasoningType,
  normalizeLearnerLevelValue,
} from "@/src/types/quiz";

const QUIZ_GENERATION_PROMPT_VERSION = "2026-06-challenge-known-content-v3";
const GEMINI_MODEL_NAME = "gemini-1.5-flash";
const MIN_QUESTION_QUALITY_SCORE = 0.72;
const MIN_PUBLISH_QUESTION_QUALITY_SCORE = 0.65;
const REQUIRED_CHOICE_COUNT = 4;
const BUILT_IN_QUIZ_STYLE_GUIDE = [
  "Built-in BatiBot quiz style guide:",
  "Use short learner-facing prompts only. Do not include admin labels, item numbers, generic topic checks, or draft wording.",
  "Preferred vocabulary prompt patterns: 'Clue: ... Which word is it?', 'This word means: ... Which word matches?', 'Which word means ...?', 'Which thing can you use to ...?', and 'Choose the best word: ... ___.'.",
  "Preferred numeracy prompt patterns: 'There are ... How many ...?', 'Start with ... How many are left?', 'Which is more: ...?', 'Which is less: ...?', and 'Which number ...?'.",
  "Preferred listening and speaking patterns: 'Listen and choose the word.' and 'Say the word: ...'.",
  "Interaction contract: fill-in-the-blank and spelling-style items are typed-answer tasks; the approved Learning Worlds word set is a hint only and must not be treated as tappable answer buttons.",
  "Interaction contract: ordering items are drag-sequence tasks; answer is the exact sequence and options are the draggable tiles.",
  "Interaction contract: matching, image-to-word, and word-to-image items are tap-or-drag-match tasks with pairs.",
  "Interaction contract: text-to-speech items are audio-choice tasks; speech-to-text items are speech-response tasks.",
  `Challenge contract: ${DEFAULT_CHALLENGE_RULE.formula}. Challenge items must not introduce new content; use only ${DEFAULT_CHALLENGE_RULE.allowedContentSources.join(", ")} while changing style through ${DEFAULT_CHALLENGE_RULE.taskChanges.join(", ")}.`,
  "Choices should look like built-in choices: exactly four compact options, same answer format, one correct answer, and three plausible but clearly wrong distractors from the same preset scope when possible.",
  "Explanations should be one short sentence that confirms the answer using the same word, meaning, clue, or number relationship.",
].join(" ");

type JsonRecord = Record<string, unknown>;

const LEVEL_GENERATION_RULES: Record<
  LearnerLevel,
  {
    choiceCount: string;
    difficultyRange: string;
    languageRule: string;
    logicRule: string;
    numberRange: string;
    questionStyle: string;
  }
> = {
  Preschool: {
    choiceCount: "exactly 4 choices, with very obvious distractors",
    difficultyRange: "0.05-0.2",
    languageRule: "3-6 words, concrete nouns, no abstract wording",
    logicRule: "single-step recognition only",
    numberRange: "1-3",
    questionStyle: "picture-supported recognition and direct matching",
  },
  Kindergarten: {
    choiceCount: "exactly 4 choices, with familiar distractors",
    difficultyRange: "0.15-0.3",
    languageRule: "short familiar sentences",
    logicRule: "single-step recall or matching",
    numberRange: "1-10",
    questionStyle: "basic recall, word-to-picture, image-to-word, simple counting",
  },
  "Grade 1": {
    choiceCount: "exactly 4 choices, with one clearly helpful clue",
    difficultyRange: "0.25-0.45",
    languageRule: "short sentences with one clue",
    logicRule: "one small inference or application",
    numberRange: "1-20",
    questionStyle: "simple application, classification, ordering, nearby-number reasoning",
  },
  "Grade 2": {
    choiceCount: "exactly 4 choices, with age-appropriate distractors",
    difficultyRange: "0.4-0.65",
    languageRule: "short problem statements are allowed",
    logicRule: "one-step reasoning",
    numberRange: "1-100",
    questionStyle: "short problem solving, comparison, addition stories, category reasoning",
  },
  "Grade 3": {
    choiceCount: "4 choices",
    difficultyRange: "0.55-0.8",
    languageRule: "clear applied prompts with slightly richer language",
    logicRule: "one to two linked reasoning steps",
    numberRange: "1-1,000",
    questionStyle: "applied reasoning, sequencing, comparison, and mixed review without trick wording",
  },
};

export type AdminActivityType =
  | "admin-topic-approved"
  | "admin-topic-published"
  | "admin-topic-preview-passed"
  | "admin-world-approved"
  | "admin-world-published"
  | "admin-world-preview-passed"
  | "quiz-draft-created"
  | "ai-draft-generated"
  | "quiz-edited"
  | "quiz-published"
  | "quiz-archived"
  | "quiz-unpublished"
  | "draft-deleted"
  | "report-generated"
  | "vocabulary-synced"
  | "learner-quiz-completed"
  | "learner-word-viewed";

export interface AdminActivityLog {
  id: string;
  actionType: AdminActivityType;
  quizId: string | null;
  adminUid: string;
  adminEmail: string;
  timestamp: string | null;
  details: string;
}

const curatedQuizResponseSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    objective: { type: "string" },
    instructions: { type: "string" },
    notes: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: QUIZ_LAYOUT_TYPES,
          },
          prompt: { type: "string" },
          interactionType: {
            type: "string",
            enum: QUIZ_INTERACTION_TYPES,
          },
          options: {
            type: "array",
            items: { type: "string" },
          },
          answer: { type: "string" },
          audioText: { type: "string" },
          helperText: { type: "string" },
          imageLabel: { type: "string" },
          sentence: { type: "string" },
          wordBank: {
            type: "array",
            items: { type: "string" },
          },
          instruction: { type: "string" },
          pairs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                left: { type: "string" },
                right: { type: "string" },
                leftType: {
                  type: "string",
                  enum: ["text", "word", "image"],
                },
                rightType: {
                  type: "string",
                  enum: ["text", "word", "image"],
                },
                word: { type: "string" },
                imagePrompt: { type: "string" },
                altText: { type: "string" },
                assetId: { type: "string" },
              },
            },
          },
          explanation: { type: "string" },
          learningObjective: { type: "string" },
          targetSkill: { type: "string" },
          reasoningType: {
            type: "string",
            enum: QUESTION_REASONING_TYPES,
          },
          cognitiveSkill: { type: "string" },
          questionIntent: { type: "string" },
          difficultyScore: { type: "number" },
          levelFitScore: { type: "number" },
          qualityScore: { type: "number" },
          alignmentScore: { type: "number" },
          clarityScore: { type: "number" },
          depthScore: { type: "number" },
          uniquenessScore: { type: "number" },
          answerValidityScore: { type: "number" },
          ageFitScore: { type: "number" },
          levelFitExplanation: { type: "string" },
          alignmentNotes: { type: "string" },
          whyThisAnswerIsCorrect: { type: "string" },
          whyDistractorsAreWrong: { type: "string" },
          validationFlags: {
            type: "array",
            items: { type: "string" },
          },
          vocabularyUsed: {
            type: "array",
            items: { type: "string" },
          },
          sourceQuestionSeedId: { type: "string" },
          sourceVocabularyWord: { type: "string" },
        },
        required: ["type", "prompt"],
      },
    },
  },
  required: ["title", "objective", "instructions", "questions"],
} as const;

function isQuizLayoutType(value: unknown): value is QuizLayoutType {
  return typeof value === "string" && QUIZ_LAYOUT_TYPES.includes(value as QuizLayoutType);
}

function isChoiceBasedLayoutType(
  value: QuizLayoutType
): value is Exclude<QuizLayoutType, "fill-in-the-blank" | "matching" | "image-to-word" | "word-to-image"> {
  return (
    value !== "fill-in-the-blank" &&
    value !== "matching" &&
    value !== "image-to-word" &&
    value !== "word-to-image"
  );
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

function cleanNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function cleanOptionalScore(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  return clampNumber(value, 0, 1);
}

function normalizeQuizCategory(value: unknown): QuizCategory {
  if (value === "numeric" || value === "linguistic" || value === "mixed") {
    return value;
  }

  return "linguistic";
}

function normalizeQuizDifficulty(value: unknown): QuizDifficulty {
  if (
    value === "beginner" ||
    value === "easy" ||
    value === "medium" ||
    value === "advanced" ||
    value === "mastery"
  ) {
    return value;
  }

  return "beginner";
}

function normalizeLearnerLevel(value: unknown): LearnerLevel {
  return normalizeLearnerLevelValue(value);
}

function normalizeActiveLearningPhase(value: unknown): ActiveLearningPhase | undefined {
  return typeof value === "string" &&
    ACTIVE_LEARNING_PHASES.includes(value as ActiveLearningPhase)
    ? (value as ActiveLearningPhase)
    : undefined;
}

function normalizeQuizRewards(value: unknown): QuizRewards {
  if (!value || typeof value !== "object") {
    return { xp: 20 };
  }

  const candidate = value as Partial<QuizRewards>;

  return {
    xp:
      typeof candidate.xp === "number" && Number.isFinite(candidate.xp)
        ? candidate.xp
        : 20,
    ...(typeof candidate.badge === "string" && candidate.badge.trim()
      ? { badge: candidate.badge.trim() }
      : {}),
    ...(typeof candidate.mastery === "boolean" ? { mastery: candidate.mastery } : {}),
    ...(typeof candidate.nextUnlockId === "string" && candidate.nextUnlockId.trim()
      ? { nextUnlockId: candidate.nextUnlockId.trim() }
      : {}),
    ...(typeof candidate.rankProgress === "number" && Number.isFinite(candidate.rankProgress)
      ? { rankProgress: candidate.rankProgress }
      : {}),
    ...(typeof candidate.rewardProgress === "number" && Number.isFinite(candidate.rewardProgress)
      ? { rewardProgress: candidate.rewardProgress }
      : {}),
    ...(typeof candidate.stars === "number" && Number.isFinite(candidate.stars)
      ? { stars: candidate.stars }
      : {}),
    ...(typeof candidate.unlockMessage === "string" && candidate.unlockMessage.trim()
      ? { unlockMessage: candidate.unlockMessage.trim() }
      : {}),
  };
}

function normalizeUnlockRequirements(value: unknown): UnlockRequirements | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  return value as UnlockRequirements;
}

function toIsoDate(value: unknown) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toISOString();
  }

  return null;
}

function normalizeReviewChecklist(value: unknown): QuizReviewChecklist {
  if (!value || typeof value !== "object") {
    return DEFAULT_REVIEW_CHECKLIST;
  }

  const candidate = value as Partial<QuizReviewChecklist>;

  return {
    ageAppropriate: candidate.ageAppropriate === true,
    objectiveClear: candidate.objectiveClear === true,
    instructionsUnderstandable: candidate.instructionsUnderstandable === true,
    questionsComplete: candidate.questionsComplete === true,
    answersValid: candidate.answersValid === true,
    noDuplicateQuestions: candidate.noDuplicateQuestions === true,
    noBrokenMatchingPairs: candidate.noBrokenMatchingPairs === true,
    noLowQualityAiOutput: candidate.noLowQualityAiOutput === true,
    topicMatchesCurriculum: candidate.topicMatchesCurriculum === true,
    questionCountAcceptable: candidate.questionCountAcceptable === true,
  };
}

function normalizeCuratedQuizStatus(value: unknown): CuratedQuizStatus {
  if (
    value === "draft" ||
    value === "ready-for-review" ||
    value === "published" ||
    value === "archived"
  ) {
    return value;
  }

  return "draft";
}

function normalizeDraftLifecycleStatus(
  value: unknown,
  fallback: DraftLifecycleStatus = "draft"
): DraftLifecycleStatus {
  return typeof value === "string" &&
    DRAFT_LIFECYCLE_STATUSES.includes(value as DraftLifecycleStatus)
    ? (value as DraftLifecycleStatus)
    : fallback;
}

function getDefaultLifecycleStatus(
  status: CuratedQuizStatus,
  draft: Pick<CuratedQuizDraft, "createdWith" | "lifecycleStatus">
): DraftLifecycleStatus {
  if (status === "published") {
    return "published";
  }

  if (draft.lifecycleStatus) {
    return draft.lifecycleStatus;
  }

  if (status === "ready-for-review") {
    return "edited";
  }

  return draft.createdWith === "gemini" ? "generated" : "draft";
}

function getStatusForLifecycleStatus(
  lifecycleStatus: DraftLifecycleStatus,
  fallback: CuratedQuizStatus
): CuratedQuizStatus {
  if (lifecycleStatus === "published") {
    return "published";
  }

  if (
    lifecycleStatus === "edited" ||
    lifecycleStatus === "approved" ||
    lifecycleStatus === "validated"
  ) {
    return "ready-for-review";
  }

  return fallback === "published" ? "ready-for-review" : fallback;
}

function normalizeLifecycleLogs(value: unknown): CuratedQuizDraft["lifecycleLogs"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is JsonRecord => Boolean(item) && typeof item === "object")
    .map((item) => ({
      status: normalizeDraftLifecycleStatus(item.status),
      at: toIsoDate(item.at),
      byUid: cleanString(item.byUid) || null,
      note: cleanString(item.note),
    }));
}

function getLifecycleLogEntry({
  note,
  status,
  user,
}: {
  note: string;
  status: DraftLifecycleStatus;
  user: Pick<User, "uid">;
}): NonNullable<CuratedQuizDraft["lifecycleLogs"]>[number] {
  return {
    status,
    at: new Date().toISOString(),
    byUid: user.uid,
    note,
  };
}

function buildLifecyclePayload({
  draft,
  lifecycleStatus,
  note,
  user,
}: {
  draft: CuratedQuizDraft;
  lifecycleStatus: DraftLifecycleStatus;
  note: string;
  user: Pick<User, "uid">;
}) {
  return {
    lifecycleStatus,
    lifecycleLogs: [
      ...(draft.lifecycleLogs ?? []),
      getLifecycleLogEntry({ note, status: lifecycleStatus, user }),
    ].slice(-25),
  };
}

function normalizePreviewSnapshot(value: unknown): CuratedQuizDraft["previewSnapshot"] {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as JsonRecord;

  return {
    checkedAt: toIsoDate(candidate.checkedAt),
    checkedByUid: cleanString(candidate.checkedByUid) || null,
    modes: cleanStringArray(candidate.modes),
    passed: candidate.passed === true,
  };
}

function normalizeApprovalSnapshot(value: unknown): CuratedQuizDraft["approvalSnapshot"] {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as JsonRecord;

  return {
    approvedAt: toIsoDate(candidate.approvedAt),
    approvedByUid: cleanString(candidate.approvedByUid) || null,
    checklist: normalizeReviewChecklist(candidate.checklist),
  };
}

function normalizeValidationSnapshot(value: unknown): CuratedQuizDraft["validationSnapshot"] {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as JsonRecord;

  return {
    checkedAt: toIsoDate(candidate.checkedAt),
    errors: cleanStringArray(candidate.errors),
    passed: candidate.passed === true,
  };
}

function normalizePublishSnapshot(value: unknown): CuratedQuizDraft["publishSnapshot"] {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as JsonRecord;

  return {
    publishedAt: toIsoDate(candidate.publishedAt),
    publishedByUid: cleanString(candidate.publishedByUid) || null,
    statusBeforePublish: normalizeDraftLifecycleStatus(candidate.statusBeforePublish),
  };
}

function normalizeCuratedQuizDocument(id: string, data: JsonRecord): CuratedQuiz {
  const draft = normalizeDraft(data, {
    adminPrompt: cleanString(data.sourcePrompt, "Imported admin quiz"),
    ageGroup: cleanString(data.ageGroup, "Preschool to Grade 3"),
    category: normalizeQuizCategory(data.category),
    curriculumLevel: Math.max(1, Math.round(cleanNumber(data.curriculumLevel, 1))),
    difficulty: normalizeQuizDifficulty(data.difficulty),
    learnerLevel: normalizeLearnerLevel(data.learnerLevel),
    notes: cleanString(data.notes),
    objective: cleanString(data.objective, "Practice a focused curriculum skill."),
    questionCount: Array.isArray(data.questions) ? data.questions.length : 1,
    questionTypes: Array.isArray(data.questionTypes)
      ? data.questionTypes.filter(isQuizLayoutType)
      : ["multiple-choice"],
    topic: cleanString(data.topic, "Untitled topic"),
  });

  return {
    ...draft,
    id,
    status: normalizeCuratedQuizStatus(data.status),
    lifecycleStatus: normalizeDraftLifecycleStatus(
      data.lifecycleStatus,
      getDefaultLifecycleStatus(normalizeCuratedQuizStatus(data.status), draft)
    ),
    lifecycleLogs: normalizeLifecycleLogs(data.lifecycleLogs),
    reviewChecklist: normalizeReviewChecklist(data.reviewChecklist),
    createdByUid: cleanString(data.createdByUid),
    createdByEmail: cleanString(data.createdByEmail),
    createdAt: toIsoDate(data.createdAt),
    updatedAt: toIsoDate(data.updatedAt),
    publishedAt: toIsoDate(data.publishedAt),
    archivedAt: toIsoDate(data.archivedAt),
  };
}

function getAdminIdentity(user: Pick<User, "uid" | "email">) {
  return {
    adminUid: user.uid,
    adminEmail: user.email ?? "",
  };
}

function normalizeReasoningType(value: unknown): QuestionReasoningType | undefined {
  return typeof value === "string" &&
    QUESTION_REASONING_TYPES.includes(value as QuestionReasoningType)
    ? (value as QuestionReasoningType)
    : undefined;
}

function getInteractionTypeForLayout(type: QuizLayoutType): QuizInteractionType {
  if (type === "fill-in-the-blank") {
    return "typed-answer";
  }

  if (type === "speech-to-text") {
    return "speech-response";
  }

  if (type === "text-to-speech") {
    return "audio-choice";
  }

  if (type === "ordering") {
    return "drag-sequence";
  }

  if (type === "matching" || type === "image-to-word" || type === "word-to-image") {
    return "tap-or-drag-match";
  }

  if (
    type === "image-choice" ||
    type === "picture-based" ||
    type === "counting-objects"
  ) {
    return "image-choice";
  }

  if (type === "word-problem" || type === "scenario") {
    return "story-choice";
  }

  return "tap-choice";
}

function normalizeInteractionType(
  value: unknown,
  layoutType: QuizLayoutType
): QuizInteractionType {
  return typeof value === "string" &&
    QUIZ_INTERACTION_TYPES.includes(value as QuizInteractionType)
    ? (value as QuizInteractionType)
    : getInteractionTypeForLayout(layoutType);
}

function normalizeQuestionIntelligence(question: JsonRecord) {
  return {
    ...(cleanString(question.learningObjective)
      ? { learningObjective: cleanString(question.learningObjective) }
      : {}),
    ...(cleanString(question.targetSkill)
      ? { targetSkill: cleanString(question.targetSkill) }
      : {}),
    ...(normalizeReasoningType(question.reasoningType)
      ? { reasoningType: normalizeReasoningType(question.reasoningType) }
      : {}),
    ...(cleanString(question.cognitiveSkill)
      ? { cognitiveSkill: cleanString(question.cognitiveSkill) }
      : {}),
    ...(cleanString(question.questionIntent)
      ? { questionIntent: cleanString(question.questionIntent) }
      : {}),
    ...(cleanOptionalScore(question.difficultyScore) !== undefined
      ? { difficultyScore: cleanOptionalScore(question.difficultyScore) }
      : {}),
    ...(cleanOptionalScore(question.levelFitScore) !== undefined
      ? { levelFitScore: cleanOptionalScore(question.levelFitScore) }
      : {}),
    ...(cleanOptionalScore(question.qualityScore) !== undefined
      ? { qualityScore: cleanOptionalScore(question.qualityScore) }
      : {}),
    ...(cleanOptionalScore(question.alignmentScore) !== undefined
      ? { alignmentScore: cleanOptionalScore(question.alignmentScore) }
      : {}),
    ...(cleanOptionalScore(question.clarityScore) !== undefined
      ? { clarityScore: cleanOptionalScore(question.clarityScore) }
      : {}),
    ...(cleanOptionalScore(question.depthScore) !== undefined
      ? { depthScore: cleanOptionalScore(question.depthScore) }
      : {}),
    ...(cleanOptionalScore(question.uniquenessScore) !== undefined
      ? { uniquenessScore: cleanOptionalScore(question.uniquenessScore) }
      : {}),
    ...(cleanOptionalScore(question.answerValidityScore) !== undefined
      ? { answerValidityScore: cleanOptionalScore(question.answerValidityScore) }
      : {}),
    ...(cleanOptionalScore(question.ageFitScore) !== undefined
      ? { ageFitScore: cleanOptionalScore(question.ageFitScore) }
      : {}),
    ...(cleanString(question.levelFitExplanation)
      ? { levelFitExplanation: cleanString(question.levelFitExplanation) }
      : {}),
    ...(cleanString(question.alignmentNotes)
      ? { alignmentNotes: cleanString(question.alignmentNotes) }
      : {}),
    ...(cleanString(question.whyThisAnswerIsCorrect)
      ? { whyThisAnswerIsCorrect: cleanString(question.whyThisAnswerIsCorrect) }
      : {}),
    ...(cleanString(question.whyDistractorsAreWrong)
      ? { whyDistractorsAreWrong: cleanString(question.whyDistractorsAreWrong) }
      : {}),
    ...(cleanStringArray(question.validationFlags).length
      ? { validationFlags: cleanStringArray(question.validationFlags) }
      : {}),
    ...(cleanStringArray(question.vocabularyUsed).length
      ? { vocabularyUsed: cleanStringArray(question.vocabularyUsed) }
      : {}),
    ...(cleanString(question.sourceQuestionSeedId)
      ? { sourceQuestionSeedId: cleanString(question.sourceQuestionSeedId) }
      : {}),
    ...(cleanString(question.sourceVocabularyWord)
      ? { sourceVocabularyWord: cleanString(question.sourceVocabularyWord) }
      : {}),
  };
}

function normalizeMultipleChoiceQuestion(
  question: JsonRecord,
  index: number
): MultipleChoiceQuestion | null {
  const type = isQuizLayoutType(question.type) ? question.type : "multiple-choice";
  const options =
    type === "true-or-false"
      ? cleanStringArray(question.options).length
        ? cleanStringArray(question.options)
        : ["True", "False"]
      : cleanStringArray(question.options);
  const answer = cleanString(question.answer);
  const needsOptions = type !== "speech-to-text";

  if (!isChoiceBasedLayoutType(type) || (needsOptions && options.length < 2) || !answer) {
    return null;
  }

  return {
    id: `question-${index + 1}`,
    type,
    interactionType: normalizeInteractionType(question.interactionType, type),
    prompt: cleanString(question.prompt, `Question ${index + 1}`),
    options,
    answer,
    audioText: cleanString(question.audioText),
    explanation: cleanString(question.explanation),
    helperText: cleanString(question.helperText),
    imageLabel: cleanString(question.imageLabel),
    ...normalizeQuestionIntelligence(question),
  };
}

function normalizeFillInTheBlankQuestion(
  question: JsonRecord,
  index: number
): FillInTheBlankQuestion | null {
  const answer = cleanString(question.answer);
  const sentence = cleanString(question.sentence);

  if (!answer || !sentence) {
    return null;
  }

  return {
    id: `question-${index + 1}`,
    type: "fill-in-the-blank",
    interactionType: normalizeInteractionType(question.interactionType, "fill-in-the-blank"),
    prompt: cleanString(question.prompt, `Question ${index + 1}`),
    sentence,
    answer,
    wordBank: cleanStringArray(question.wordBank),
    explanation: cleanString(question.explanation),
    ...normalizeQuestionIntelligence(question),
  };
}

function normalizeMatchingQuestion(
  question: JsonRecord,
  index: number
): MatchingQuestion | null {
  const type =
    question.type === "image-to-word" || question.type === "word-to-image"
      ? question.type
      : "matching";
  const pairs = Array.isArray(question.pairs)
    ? question.pairs
        .map((pair): MatchingPair | null => {
          if (!pair || typeof pair !== "object") {
            return null;
          }

          const item = pair as JsonRecord;
          const word = cleanString(item.word);
          const imagePrompt = cleanString(item.imagePrompt);
          const altText = cleanString(item.altText);
          const left = cleanString(
            item.left,
            type === "image-to-word" ? imagePrompt || altText : word
          );
          const right = cleanString(
            item.right,
            type === "word-to-image" ? imagePrompt || altText : word
          );

          const leftType: MatchingPair["leftType"] =
            item.leftType === "image" || item.leftType === "word" || item.leftType === "text"
              ? item.leftType
              : type === "image-to-word"
                ? "image"
                : type === "word-to-image"
                  ? "word"
                  : "text";
          const rightType: MatchingPair["rightType"] =
            item.rightType === "image" || item.rightType === "word" || item.rightType === "text"
              ? item.rightType
              : type === "image-to-word"
                ? "word"
                : type === "word-to-image"
                  ? "image"
                  : "text";

          return left && right
            ? {
                left,
                right,
                leftType,
                rightType,
                ...(word ? { word } : {}),
                ...(imagePrompt ? { imagePrompt } : {}),
                ...(altText ? { altText } : {}),
                ...(cleanString(item.assetId) ? { assetId: cleanString(item.assetId) } : {}),
              }
            : null;
        })
        .filter((pair): pair is MatchingPair => pair !== null)
    : [];

  if (pairs.length < 2) {
    return null;
  }

  return {
    id: `question-${index + 1}`,
    type,
    interactionType: normalizeInteractionType(question.interactionType, type),
    prompt: cleanString(question.prompt, `Question ${index + 1}`),
    instruction: cleanString(
      question.instruction,
      "Match each item with its correct pair."
    ),
    pairs,
    explanation: cleanString(question.explanation),
    ...normalizeQuestionIntelligence(question),
  };
}

function normalizeQuestion(
  question: unknown,
  index: number
): CuratedQuizQuestion | null {
  if (!question || typeof question !== "object") {
    return null;
  }

  const candidate = question as JsonRecord;

  if (!isQuizLayoutType(candidate.type)) {
    return null;
  }

  switch (candidate.type) {
    case "multiple-choice":
    case "true-or-false":
    case "word-problem":
    case "text-to-speech":
    case "speech-to-text":
    case "image-choice":
    case "timed-challenge":
    case "ordering":
    case "counting-objects":
    case "compare-numbers":
    case "picture-based":
    case "scenario":
      return normalizeMultipleChoiceQuestion(candidate, index);
    case "fill-in-the-blank":
      return normalizeFillInTheBlankQuestion(candidate, index);
    case "matching":
    case "image-to-word":
    case "word-to-image":
      return normalizeMatchingQuestion(candidate, index);
    default:
      return null;
  }
}

function formatVocabularyContext(items: QuizGenerationVocabularyItem[]) {
  if (!items.length) {
    return "No approved vocabulary context was provided.";
  }

  return items
    .slice(0, 20)
    .map((item) =>
      [
        `word=${item.word}`,
        `subcategory=${item.subcategory}`,
        `level=${item.learnerLevel}`,
        `objective=${item.curriculumObjective}`,
        `meaning=${item.meaning}`,
        `sample=${item.sample}`,
        `clue=${item.clue}`,
        `imagePrompt=${item.imagePrompt}`,
        `imageUri=${item.imageUri ?? ""}`,
        `altText=${item.altText}`,
        `miniQuestionSeeds=${item.questionSeeds
          .slice(0, 3)
          .map(
            (seed) =>
              `{id:${seed.id}; prompt:${seed.prompt}; answer:${seed.answer}; distractors:${seed.distractors.join(", ")}; reasoning:${seed.reasoningType}; level:${seed.learnerLevel}; skill:${seed.cognitiveSkill}; explanation:${seed.explanation}}`
          )
          .join(" ")}`,
      ].join("; ")
    )
    .join(" || ");
}

function formatRequiredWordBank(items: QuizGenerationVocabularyItem[]) {
  if (!items.length) {
    return "none";
  }

  return items.map((item) => item.word).join(", ");
}

function formatLevelGenerationRules(level: LearnerLevel) {
  const rules = LEVEL_GENERATION_RULES[level];

  return [
    `level=${level}`,
    `numberRange=${rules.numberRange}`,
    `choices=${rules.choiceCount}`,
    `style=${rules.questionStyle}`,
    `logic=${rules.logicRule}`,
    `language=${rules.languageRule}`,
    `targetDifficultyScore=${rules.difficultyRange}`,
  ].join("; ");
}

function formatCurriculumLevelInteractionRules(level: number, category: QuizCategory) {
  if (level <= 1) {
    return category === "numeric"
      ? "Level 1 numeric should use picture/counting or image-choice tasks with visible quantity clues."
      : "Level 1 linguistic should use image-to-word or picture-supported recognition tasks.";
  }

  if (level === 2) {
    return category === "numeric"
      ? "Level 2 numeric should use ordering or before/after sequence tasks."
      : "Level 2 linguistic should use typed fill-in-the-blank with approved Learning Worlds word-set hints.";
  }

  if (level === 3) {
    return category === "numeric"
      ? "Level 3 numeric should use image-based counting or shape questions."
      : "Level 3 linguistic should use matching tasks for categories, clues, pictures, or meanings.";
  }

  if (level === 4) {
    return category === "numeric"
      ? "Level 4 numeric should connect numerals, quantities, and number words."
      : "Level 4 linguistic should use typed spelling or recall tasks.";
  }

  if (level === 5) {
    return category === "numeric"
      ? "Level 5 numeric should use counting, total, and simple add-story questions."
      : "Level 5 linguistic should use spelling and typed recall.";
  }

  if (level === 6) {
    return "Level 6 must prioritize listening and speaking: use text-to-speech/audio-choice and speech-to-text/microphone-response layouts when included.";
  }

  if (level === 7) {
    return "Level 7 should use ordering and sentence-building style tasks with draggable/tappable word sequence tiles.";
  }

  if (level === 8) {
    return "Level 8 should mix image, word, number, and comprehension clues in multi-step but gentle questions.";
  }

  if (level === 9) {
    return "Level 9 should use short word problems that require understanding the story before answering.";
  }

  if (level === 10) {
    return "Level 10 should use mastery review across comparison, explanation, sorting, matching, and short scenarios.";
  }

  if (level === 11) {
    return "Level 11 should emphasize advanced listening with text-to-speech/audio-choice questions.";
  }

  if (level === 12) {
    return "Level 12 should emphasize advanced speaking with speech-to-text/microphone-response questions.";
  }

  if (level === 13) {
    return "Level 13 should use grammar-in-context, position words, before/after, because, under, over, above, and below.";
  }

  if (level === 14) {
    return "Level 14 should use short reading comprehension passages and detail questions.";
  }

  return "Level 15 should be a boss review that mixes listening, speaking, matching, ordering, typed recall, word problems, and reading comprehension.";
}

function formatQuizTypeReasoningRules(questionTypes: QuizLayoutType[]) {
  return questionTypes
    .map((type) => {
      switch (type) {
        case "image-to-word":
        case "word-to-image":
          return `${type}: interactionType=tap-or-drag-match; reasoningType=matching; use approved words and imagePrompt/altText from vocabulary context.`;
        case "counting-objects":
          return "counting-objects: interactionType=image-choice; reasoningType=counting; answer must match the visible object count; distractors should be nearby numbers.";
        case "compare-numbers":
          return "compare-numbers: interactionType=tap-choice; reasoningType=comparison; compare two clear quantities or numerals.";
        case "ordering":
          return "ordering: interactionType=drag-sequence; reasoningType=sequencing; options are draggable tiles and answer is the correct comma-separated sequence.";
        case "word-problem":
        case "scenario":
          return `${type}: interactionType=story-choice; reasoningType=short_scenario or addition; use a short realistic child-safe situation.`;
        case "matching":
          return "matching: interactionType=tap-or-drag-match; reasoningType=matching or classification; pairs must be unique and directly related.";
        case "fill-in-the-blank":
          return "fill-in-the-blank: interactionType=typed-answer; use a sentence with ___ and make the learner type the answer; wordBank is only a hint.";
        case "text-to-speech":
          return "text-to-speech: interactionType=audio-choice; include audioText and ask the learner to listen before answering.";
        case "speech-to-text":
          return "speech-to-text: interactionType=speech-response; include audioText when useful and ask the learner to say the word or phrase.";
        default:
          return `${type}: choose the simplest interactionType and reasoningType that directly assess the objective.`;
      }
    })
    .join(" ");
}

function normalizeForComparison(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isChallengeStyleQuestion(question: CuratedQuizQuestion) {
  return [
    question.type,
    question.reasoningType ?? "",
    question.targetSkill ?? "",
    question.questionIntent ?? "",
  ].some((value) => normalizeForComparison(value).includes("challenge"));
}

function hasChallengeGuidanceLeak(question: CuratedQuizQuestion) {
  const helperText =
    "helperText" in question
      ? question.helperText ?? ""
      : "";
  const guidanceText = normalizeForComparison(
    [
      question.prompt,
      helperText,
      question.type === "fill-in-the-blank" ? question.sentence : "",
    ].join(" ")
  );

  return ["hint", "glow", "guided", "help from", "with bati"].some((term) =>
    guidanceText.includes(term)
  );
}

function getQuestionAnswerSignature(question: CuratedQuizQuestion) {
  if (
    question.type === "matching" ||
    question.type === "image-to-word" ||
    question.type === "word-to-image"
  ) {
    return question.pairs
      .map(
        (pair) =>
          `${normalizeForComparison(pair.left)}:${normalizeForComparison(pair.right)}`
      )
      .sort()
      .join("|");
  }

  if (question.type === "fill-in-the-blank") {
    return [
      normalizeForComparison(question.sentence),
      normalizeForComparison(question.answer),
      ...question.wordBank.map(normalizeForComparison).sort(),
    ].join("|");
  }

  const choiceQuestion = question as MultipleChoiceQuestion;

  return [
    normalizeForComparison(choiceQuestion.answer),
    ...choiceQuestion.options.map(normalizeForComparison).sort(),
  ].join("|");
}

function getQuestionGenerationSignature(question: CuratedQuizQuestion) {
  return [
    question.type,
    normalizeForComparison(question.prompt),
    getQuestionAnswerSignature(question),
  ].join("::");
}

function removeRepeatedGeneratedQuestions(questions: CuratedQuizQuestion[]) {
  const seenPrompts = new Set<string>();
  const seenQuestionSignatures = new Set<string>();

  return questions.filter((question) => {
    const prompt = normalizeForComparison(question.prompt);
    const signature = getQuestionGenerationSignature(question);

    if (seenPrompts.has(prompt) || seenQuestionSignatures.has(signature)) {
      return false;
    }

    seenPrompts.add(prompt);
    seenQuestionSignatures.add(signature);
    return true;
  });
}

function getApprovedVocabularyWordSet(items: QuizGenerationVocabularyItem[]) {
  return new Set(
    items.flatMap((item) => [
      normalizeForComparison(item.word),
      normalizeForComparison(item.normalizedWord),
    ])
  );
}

function isApprovedVocabularyTerm(term: string, vocabularyContext: QuizGenerationVocabularyItem[]) {
  const approvedWords = getApprovedVocabularyWordSet(vocabularyContext);

  return approvedWords.has(normalizeForComparison(term));
}

function getQuestionVocabularyTerms(question: CuratedQuizQuestion) {
  const explicitVocabulary = question.vocabularyUsed ?? [];

  if (
    question.type === "matching" ||
    question.type === "image-to-word" ||
    question.type === "word-to-image"
  ) {
    return [
      ...explicitVocabulary,
      ...question.pairs.flatMap((pair) => [
        pair.word ?? "",
        pair.leftType === "word" ? pair.left : "",
        pair.rightType === "word" ? pair.right : "",
      ]),
    ];
  }

  if (question.type === "fill-in-the-blank") {
    return [...explicitVocabulary, question.answer, ...question.wordBank];
  }

  const choiceQuestion = question as MultipleChoiceQuestion;

  return [...explicitVocabulary, choiceQuestion.answer, ...choiceQuestion.options];
}

function findUnapprovedVocabularyTerms(
  questions: CuratedQuizQuestion[],
  vocabularyContext: QuizGenerationVocabularyItem[]
) {
  if (!vocabularyContext.length) {
    return [];
  }

  const approvedWords = getApprovedVocabularyWordSet(vocabularyContext);
  const unapprovedTerms = new Set<string>();

  questions.forEach((question) => {
    if (
      question.type !== "image-to-word" &&
      question.type !== "word-to-image" &&
      question.type !== "matching" &&
      question.type !== "image-choice" &&
      question.type !== "picture-based" &&
      question.type !== "multiple-choice" &&
      question.type !== "fill-in-the-blank"
    ) {
      return;
    }

    getQuestionVocabularyTerms(question).forEach((term) => {
      const normalizedTerm = normalizeForComparison(term);

      if (normalizedTerm && !approvedWords.has(normalizedTerm)) {
        unapprovedTerms.add(term.trim());
      }
    });
  });

  return Array.from(unapprovedTerms).slice(0, 8);
}

function questionUsesRequiredWordBank(
  question: CuratedQuizQuestion,
  vocabularyContext: QuizGenerationVocabularyItem[]
) {
  if (!vocabularyContext.length) {
    return true;
  }

  return getQuestionVocabularyTerms(question).some((term) =>
    isApprovedVocabularyTerm(term, vocabularyContext)
  );
}

function questionSourceWordIsInWordBank(
  question: CuratedQuizQuestion,
  vocabularyContext: QuizGenerationVocabularyItem[]
) {
  if (!vocabularyContext.length) {
    return true;
  }

  const sourceWord = normalizeForComparison(question.sourceVocabularyWord ?? "");

  if (!sourceWord) {
    return false;
  }

  return getApprovedVocabularyWordSet(vocabularyContext).has(sourceWord);
}

function getQuestionOptionCount(question: CuratedQuizQuestion) {
  if (
    question.type === "matching" ||
    question.type === "image-to-word" ||
    question.type === "word-to-image"
  ) {
    return question.pairs.length;
  }

  if (question.type === "fill-in-the-blank") {
    return question.wordBank.length;
  }

  return (question as MultipleChoiceQuestion).options.length;
}

function shouldHaveFourChoices(question: CuratedQuizQuestion) {
  return (
    question.type !== "speech-to-text" &&
    question.type !== "matching" &&
    question.type !== "image-to-word" &&
    question.type !== "word-to-image"
  );
}

function hasRequiredChoiceCount(question: CuratedQuizQuestion) {
  if (!shouldHaveFourChoices(question)) {
    return true;
  }

  return getQuestionOptionCount(question) === REQUIRED_CHOICE_COUNT;
}

function getQuestionPrimaryAnswer(question: CuratedQuizQuestion) {
  if (
    question.type === "matching" ||
    question.type === "image-to-word" ||
    question.type === "word-to-image"
  ) {
    return question.pairs.map((pair) => pair.right).join("|");
  }

  if (question.type === "fill-in-the-blank") {
    return question.answer;
  }

  return (question as MultipleChoiceQuestion).answer;
}

function getPromptFrameSignature(question: CuratedQuizQuestion) {
  const answerTerms = getQuestionVocabularyTerms(question)
    .map(normalizeForComparison)
    .filter(Boolean)
    .sort((first, second) => second.length - first.length);
  let prompt = normalizeForComparison(question.prompt)
    .replace(/\b\d+\b/g, "#")
    .replace(/\b(item|question|picture clue)\s+#\b/g, "$1 #");

  answerTerms.forEach((term) => {
    if (term.length > 2) {
      prompt = prompt.replace(new RegExp(`\\b${term}\\b`, "g"), "{word}");
    }
  });

  return `${question.type}:${prompt}`;
}

function getPromptWordCount(question: CuratedQuizQuestion) {
  return normalizeForComparison(question.prompt)
    .split(" ")
    .filter(Boolean).length;
}

function hasShallowPrompt(question: CuratedQuizQuestion) {
  const normalizedPrompt = normalizeForComparison(question.prompt);
  const wordCount = getPromptWordCount(question);

  return (
    wordCount < 4 ||
    normalizedPrompt.includes("matches the topic") ||
    normalizedPrompt.includes("quiz about") ||
    normalizedPrompt.includes("this topic") ||
    normalizedPrompt.includes("today s learning topic") ||
    normalizedPrompt.includes("which answer matches")
  );
}

function hasUnclearPrompt(question: CuratedQuizQuestion, learnerLevel: LearnerLevel) {
  const wordCount = getPromptWordCount(question);
  const normalizedPrompt = normalizeForComparison(question.prompt);
  const maxWords =
    learnerLevel === "Preschool"
      ? 12
      : learnerLevel === "Kindergarten"
        ? 18
        : learnerLevel === "Grade 1"
          ? 24
          : 36;

  return (
    wordCount > maxWords ||
    /\b(item|picture clue)\s+\d+\b/.test(normalizedPrompt) ||
    normalizedPrompt.includes("not specified")
  );
}

function hasBuiltInQuizPromptStyle(question: CuratedQuizQuestion) {
  const prompt = normalizeForComparison(question.prompt);
  const hasDraftOnlyWording =
    prompt.includes("learning topic") ||
    prompt.includes("quiz topic") ||
    /\b(item|set|example|picture clue)\s+\d+\b/.test(prompt) ||
    prompt.includes("which answer matches");

  if (!prompt || hasDraftOnlyWording) {
    return false;
  }

  if (
    question.type === "matching" ||
    question.type === "image-to-word" ||
    question.type === "word-to-image"
  ) {
    return prompt.startsWith("match ");
  }

  if (question.type === "fill-in-the-blank") {
    return prompt.startsWith("choose ") && question.sentence.includes("___");
  }

  if (question.type === "text-to-speech") {
    return prompt.startsWith("listen ");
  }

  if (question.type === "speech-to-text") {
    return prompt.startsWith("say the word");
  }

  if (question.type === "true-or-false") {
    return prompt.startsWith("true or false");
  }

  if (question.type === "counting-objects") {
    return prompt.startsWith("how many ");
  }

  if (question.type === "compare-numbers") {
    return (
      prompt.startsWith("which is more") ||
      prompt.startsWith("which is less") ||
      prompt.startsWith("which number")
    );
  }

  if (question.type === "word-problem" || question.type === "scenario") {
    return /^(there are|start with|a learner|a story|ana has|which is more|which is less)\b/.test(
      prompt
    );
  }

  if (question.type === "ordering") {
    return (
      prompt.startsWith("put these ") ||
      prompt.startsWith("which comes ") ||
      prompt.startsWith("what comes ")
    );
  }

  return /^(which|what|choose|clue|this word means|read the clue|listen|quick answer)\b/.test(
    prompt
  );
}

function getQuestionChoiceTextValues(question: CuratedQuizQuestion) {
  if (
    question.type === "matching" ||
    question.type === "image-to-word" ||
    question.type === "word-to-image"
  ) {
    return question.pairs.flatMap((pair) => [pair.left, pair.right]);
  }

  if (question.type === "fill-in-the-blank") {
    return question.wordBank;
  }

  return (question as MultipleChoiceQuestion).options ?? [];
}

function hasCompactBuiltInChoices(question: CuratedQuizQuestion) {
  if (question.type === "speech-to-text") {
    return true;
  }

  return getQuestionChoiceTextValues(question).every((choice) => {
    const trimmedChoice = choice.trim();
    const wordCount = trimmedChoice.split(/\s+/).filter(Boolean).length;

    return trimmedChoice.length <= 56 && wordCount <= 8;
  });
}

function getAnswerValidityScore(question: CuratedQuizQuestion) {
  return isQuestionComplete(question) ? 1 : 0.25;
}

function getAgeFitScore(question: CuratedQuizQuestion, learnerLevel: LearnerLevel) {
  const optionCount = getQuestionOptionCount(question);
  const difficultyScore =
    typeof question.difficultyScore === "number" ? question.difficultyScore : 0.5;

  if (learnerLevel === "Preschool") {
    return difficultyScore <= 0.3 && optionCount === REQUIRED_CHOICE_COUNT ? 1 : 0.45;
  }

  if (learnerLevel === "Kindergarten") {
    return difficultyScore <= 0.45 && optionCount === REQUIRED_CHOICE_COUNT ? 1 : 0.55;
  }

  if (learnerLevel === "Grade 3") {
    return difficultyScore >= 0.45 ? 1 : 0.5;
  }

  return typeof question.levelFitScore === "number" ? question.levelFitScore : 0.75;
}

function getQuestionQualityScores({
  answerUseCount,
  frameUseCount,
  question,
  learnerLevel,
  vocabularyContext,
}: {
  answerUseCount: number;
  frameUseCount: number;
  question: CuratedQuizQuestion;
  learnerLevel: LearnerLevel;
  vocabularyContext: QuizGenerationVocabularyItem[];
}) {
  const hasVocabularyContext = vocabularyContext.length > 0;
  const hasCoreMetadata = Boolean(
    question.learningObjective &&
      question.targetSkill &&
      question.reasoningType &&
      question.cognitiveSkill &&
      question.questionIntent
  );
  const alignmentScore =
    (!hasVocabularyContext || questionUsesRequiredWordBank(question, vocabularyContext)) &&
    (question.alignmentNotes || question.learningObjective)
      ? 1
      : 0.45;
  const clarityScore = hasUnclearPrompt(question, learnerLevel)
    ? 0.45
    : hasBuiltInQuizPromptStyle(question) && hasCompactBuiltInChoices(question)
      ? 1
      : 0.7;
  const depthScore =
    hasShallowPrompt(question) || !question.reasoningType
      ? 0.35
      : question.reasoningType === "recognition" && learnerLevel !== "Preschool"
        ? 0.7
        : 1;
  const uniquenessScore = frameUseCount > 1 || answerUseCount > 2 ? 0.45 : 1;
  const answerValidityScore = getAnswerValidityScore(question);
  const ageFitScore = getAgeFitScore(question, learnerLevel);
  const metadataScore = hasCoreMetadata ? 1 : 0.55;
  const qualityScore =
    alignmentScore * 0.18 +
    clarityScore * 0.16 +
    depthScore * 0.18 +
    uniquenessScore * 0.16 +
    answerValidityScore * 0.18 +
    ageFitScore * 0.1 +
    metadataScore * 0.04;

  return {
    alignmentScore,
    answerValidityScore,
    ageFitScore,
    clarityScore,
    depthScore,
    qualityScore: clampNumber(qualityScore, 0, 1),
    uniquenessScore,
  };
}

function getLevelQualityFlags(
  question: CuratedQuizQuestion,
  learnerLevel: LearnerLevel,
  vocabularyContext: QuizGenerationVocabularyItem[],
  duplicateContext: {
    answerUseCount: number;
    frameUseCount: number;
  } = {
    answerUseCount: 1,
    frameUseCount: 1,
  }
) {
  const flags: string[] = [];
  const normalizedPrompt = normalizeForComparison(question.prompt);
  const scores = getQuestionQualityScores({
    answerUseCount: duplicateContext.answerUseCount,
    frameUseCount: duplicateContext.frameUseCount,
    question,
    learnerLevel,
    vocabularyContext,
  });

  if (!question.learningObjective) {
    flags.push("Missing learning objective.");
  }

  if (!question.targetSkill) {
    flags.push("Missing target skill.");
  }

  if (!question.reasoningType) {
    flags.push("Missing reasoning type.");
  }

  if (!question.questionIntent) {
    flags.push("Missing question intent.");
  }

  if (!question.cognitiveSkill) {
    flags.push("Missing cognitive skill.");
  }

  if (!question.whyThisAnswerIsCorrect) {
    flags.push("Missing correct-answer rationale.");
  }

  if (question.interactionType !== getInteractionTypeForLayout(question.type)) {
    flags.push("Interaction type does not match the selected quiz layout.");
  }

  if (isChallengeStyleQuestion(question) && hasChallengeGuidanceLeak(question)) {
    flags.push(
      "Challenge should use known content with a new question style and less guidance."
    );
  }

  if (
    question.type !== "speech-to-text" &&
    question.type !== "matching" &&
    question.type !== "image-to-word" &&
    question.type !== "word-to-image" &&
    !question.whyDistractorsAreWrong
  ) {
    flags.push("Missing distractor rationale.");
  }

  if (
    normalizedPrompt.includes("matches the topic") ||
    normalizedPrompt.includes("quiz about") ||
    normalizedPrompt.includes("this topic")
  ) {
    flags.push("Question is about the topic label instead of selected words.");
  }

  if (hasShallowPrompt(question)) {
    flags.push("Question may be too shallow.");
  }

  if (hasUnclearPrompt(question, learnerLevel)) {
    flags.push("Prompt may be unclear for the selected learner level.");
  }

  if (!hasBuiltInQuizPromptStyle(question)) {
    flags.push("Question format should match built-in quiz style.");
  }

  if (!hasCompactBuiltInChoices(question)) {
    flags.push("Answer choices should be short, built-in-style choices.");
  }

  if (duplicateContext.frameUseCount > 1) {
    flags.push("Question repeats a sentence frame used elsewhere.");
  }

  if (duplicateContext.answerUseCount > 2) {
    flags.push("Correct answer is reused too often in this draft.");
  }

  if (vocabularyContext.length && !questionUsesRequiredWordBank(question, vocabularyContext)) {
    flags.push("Question does not use the selected Learning Worlds word set.");
  }

  if (
    ["image-choice", "picture-based", "counting-objects"].includes(question.type) &&
    !(question as MultipleChoiceQuestion).imageLabel?.trim()
  ) {
    flags.push("Image-based question needs an image prompt or clue.");
  }

  if (vocabularyContext.some((item) => item.questionSeeds.length) && !question.sourceQuestionSeedId) {
    flags.push("Missing mini question seed reference.");
  }

  if (vocabularyContext.length && !question.sourceVocabularyWord) {
    flags.push("Missing source vocabulary word.");
  }

  if (vocabularyContext.length && !questionSourceWordIsInWordBank(question, vocabularyContext)) {
    flags.push("Source vocabulary word must be one of the selected random quiz words.");
  }

  if (!hasRequiredChoiceCount(question)) {
    flags.push("Question must have exactly four answer choices.");
  }

  if (typeof question.levelFitScore === "number" && question.levelFitScore < 0.65) {
    flags.push("Low level-fit score.");
  }

  if (scores.qualityScore < MIN_QUESTION_QUALITY_SCORE) {
    flags.push("Low generated quality score.");
  }

  if (typeof question.difficultyScore === "number") {
    if (
      learnerLevel === "Preschool" &&
      question.difficultyScore > 0.3
    ) {
      flags.push("May be too hard for Preschool learners.");
    }

    if (
      learnerLevel === "Kindergarten" &&
      question.difficultyScore > 0.45
    ) {
      flags.push("May be too hard for Kindergarten learners.");
    }

    if (
      learnerLevel === "Grade 3" &&
      question.difficultyScore < 0.45
    ) {
      flags.push("May be too easy for Grade 3 learners.");
    }
  }

  if (
    (question.type === "word-problem" || question.type === "scenario") &&
    (learnerLevel === "Preschool" || learnerLevel === "Kindergarten") &&
    !["recognition", "matching", "counting"].includes(question.reasoningType ?? "")
  ) {
      flags.push("Scenario reasoning may exceed selected learner level.");
  }

  return [...(question.validationFlags ?? []), ...flags];
}

function addGeneratedQualityFlags(
  questions: CuratedQuizQuestion[],
  learnerLevel: LearnerLevel,
  vocabularyContext: QuizGenerationVocabularyItem[]
) {
  const frameCounts = questions.reduce((counts, question) => {
    const signature = getPromptFrameSignature(question);
    counts.set(signature, (counts.get(signature) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());
  const answerCounts = questions.reduce((counts, question) => {
    const answer = normalizeForComparison(getQuestionPrimaryAnswer(question));
    counts.set(answer, (counts.get(answer) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());

  return questions.map((question) => {
    const frameUseCount = frameCounts.get(getPromptFrameSignature(question)) ?? 1;
    const answerUseCount =
      answerCounts.get(normalizeForComparison(getQuestionPrimaryAnswer(question))) ?? 1;
    const scores = getQuestionQualityScores({
      answerUseCount,
      frameUseCount,
      question,
      learnerLevel,
      vocabularyContext,
    });
    const validationFlags = Array.from(
      new Set(
        getLevelQualityFlags(question, learnerLevel, vocabularyContext, {
          answerUseCount,
          frameUseCount,
        })
      )
    );

    return {
      ...question,
      ...scores,
      ...(validationFlags.length ? { validationFlags } : {}),
    };
  });
}

function getDraftQualitySummary(questions: CuratedQuizQuestion[]) {
  const flags = questions.flatMap((question, index) =>
    (question.validationFlags ?? []).map((flag) => `Q${index + 1}: ${flag}`)
  );

  return flags.slice(0, 8);
}

export function getQuizQualitySummary(
  questions: CuratedQuizQuestion[]
): QuizQualitySummary {
  const skillCoverage: Record<string, number> = {};
  const vocabularyCoverage: Record<string, number> = {};
  const frameCounts = new Map<string, number>();
  const qualityScores = questions.map((question) =>
    typeof question.qualityScore === "number" ? question.qualityScore : 0.7
  );

  questions.forEach((question) => {
    const skill =
      question.targetSkill ||
      question.cognitiveSkill ||
      question.reasoningType ||
      question.type;
    skillCoverage[skill] = (skillCoverage[skill] ?? 0) + 1;
    (question.vocabularyUsed ?? []).forEach((word) => {
      vocabularyCoverage[word] = (vocabularyCoverage[word] ?? 0) + 1;
    });
    const frame = getPromptFrameSignature(question);
    frameCounts.set(frame, (frameCounts.get(frame) ?? 0) + 1);
  });

  const flaggedQuestionCount = questions.filter(
    (question) => question.validationFlags?.length
  ).length;
  const duplicateRiskCount = questions.filter(
    (question) => (frameCounts.get(getPromptFrameSignature(question)) ?? 0) > 1
  ).length;
  const shallowQuestionCount = questions.filter(hasShallowPrompt).length;
  const unclearQuestionCount = questions.filter((question) =>
    question.validationFlags?.some((flag) => flag.toLowerCase().includes("unclear"))
  ).length;
  const weakDistractorCount = questions.filter((question) =>
    question.validationFlags?.some((flag) => flag.toLowerCase().includes("distractor"))
  ).length;
  const missingMetadataCount = questions.filter(
    (question) =>
      !question.learningObjective ||
      !question.targetSkill ||
      !question.reasoningType ||
      !question.questionIntent
  ).length;
  const overallScore = qualityScores.length
    ? Math.round(
        (qualityScores.reduce((total, score) => total + score, 0) /
          qualityScores.length) *
          100
      )
    : 0;
  const recommendations = [
    flaggedQuestionCount
      ? "Regenerate or edit flagged questions before review."
      : "",
    duplicateRiskCount
      ? "Vary repeated sentence frames, answers, and distractor sets."
      : "",
    shallowQuestionCount
      ? "Ask for a clearer skill action instead of topic-label recognition."
      : "",
    missingMetadataCount
      ? "Require objective, target skill, reasoning, and intent metadata."
      : "",
  ].filter(Boolean);

  return {
    duplicateRiskCount,
    flaggedQuestionCount,
    missingMetadataCount,
    overallScore,
    recommendations,
    shallowQuestionCount,
    skillCoverage,
    unclearQuestionCount,
    vocabularyCoverage,
    weakDistractorCount,
  };
}

function buildGeminiPrompt(input: GenerateQuizDraftInput) {
  const layoutList = input.questionTypes.join(", ");
  const mediaRequired = input.mediaRequired ?? "none";
  const language = input.language ?? "english";
  const curriculumContract = buildBatiBotCurriculumDraftApiContract(input);

  return [
    "You are helping an administrator curate curriculum-aligned quiz drafts for BatiBot, a mobile-first learning app for early learners.",
    "You are downstream from the BatiBot Curriculum Intelligence API. Treat the API contract as the source of truth.",
    buildBatiBotCurriculumPromptSection(curriculumContract),
    getCurriculumPromptContext(),
    `Topic: ${input.topic.trim()}.`,
    `Subject domain: ${input.category}.`,
    `Curriculum level: ${input.curriculumLevel}.`,
    `Learner progression level: ${input.learnerLevel}.`,
    `Level generation rules: ${formatLevelGenerationRules(input.learnerLevel)}.`,
    `Curriculum interaction rule: ${formatCurriculumLevelInteractionRules(input.curriculumLevel, input.category)}.`,
    `Difficulty: ${input.difficulty}.`,
    `Curriculum objective: ${input.objective.trim()}.`,
    `Skill tag: ${(input.skillTag ?? "").trim() || "not specified"}.`,
    `Language: ${language}.`,
    `Required media: ${mediaRequired}.`,
    `Vocabulary source mode: ${input.vocabularyMode ?? "selected_topic_only"}.`,
    `Admin request: ${input.adminPrompt.trim()}.`,
    `Admin notes: ${input.notes.trim() || "None"}.`,
    `Target age group: ${input.ageGroup.trim()}.`,
    `Create ${input.questionCount} total questions.`,
    `Use these preset layouts only: ${layoutList}.`,
    `Required Learning Worlds word set for this draft: ${formatRequiredWordBank(input.vocabularyContext ?? [])}.`,
    `Quiz-type reasoning rules: ${formatQuizTypeReasoningRules(input.questionTypes)}`,
    `Approved BatiBot vocabulary context: ${formatVocabularyContext(input.vocabularyContext ?? [])}`,
    `Prompt contract version: ${QUIZ_GENERATION_PROMPT_VERSION}.`,
    `BatiBot stage framework: ${Object.values(LEARNING_STAGE_RULES)
      .map((rule) => `${rule.stage}=${rule.purpose}`)
      .join(" ")}`,
    BUILT_IN_QUIZ_STYLE_GUIDE,
    "Generate from a blueprint: assign each question a distinct targetSkill, vocabulary focus, reasoning operation, answer, and distractor plan before writing final JSON.",
    "Model the structure and logic of BatiBot built-in quizzes: short prompt, clear child action, one correct answer, fair distractors, direct feedback, and no trick wording.",
    "Do not ask literal topic-label questions such as 'Which answer matches the topic Things?' or 'What is this quiz about?'. The topic only selects the Learning Worlds word set. Questions must be about the selected words under that topic.",
    "The approved vocabulary context is the source of truth. Selected Topic mode must stay inside the selected subcategory. Random Approved Words mode may use any provided approved word. Mixed Review mode should combine several provided subcategories. Admin Prompt Guided mode should choose the provided words that best match the admin request.",
    "Every vocabulary-based question must use at least one word from the required Learning Worlds word set. Put every word used from that set in vocabularyUsed.",
    "Every question must be anchored to one exact vocabulary item. Put that exact item word in sourceVocabularyWord and vocabularyUsed.",
    "When the vocabulary context contains the same number of words as the requested question count, create one question for each selected word before reusing any word.",
    "For preset-topic quizzes, treat the required Learning Worlds word set as the selected practice words. The selected words are the only content anchors and the preferred option/distractor pool.",
    "The question content must be about the sourceVocabularyWord itself: use its meaning, sample sentence, clue, use, category, imagePrompt, or child-safe real-world context.",
    "For an everyday object such as Bag, a good question asks what it is used for, what clue points to it, or which word matches a picture of it. Example style: 'Which thing can you use to carry books?' answer 'Bag'.",
    "Do not generate generic topic questions, generic item numbers, or prompts where the selected word is only a random option. The correct answer and explanation must prove the question is about the source word.",
    "Spread the selected words across the draft. If focus words are provided, cover those focus words before using other words from the same preset scope.",
    "Use exactly four unique answer choices for every choice-style question and every fill-in-the-blank wordBank. Matching/image matching layouts should use exactly four unique pairs when enough scoped vocabulary is available.",
    "For each blueprint item, use the four listed choices exactly when choices are provided. The correct sourceVocabularyWord must appear once, and the other three choices must be plausible but clearly wrong.",
    "Use the miniQuestionSeeds in the vocabulary context as structural examples for question logic. Adapt them to the requested quiz layout and learner level, but keep the same answer logic and child-friendly structure.",
    "When a question is based on a miniQuestionSeed, return sourceQuestionSeedId and sourceVocabularyWord.",
    "For selected-topic generation, use random words from that chosen sub-tab only. For random or mixed generation, spread the selected Learning Worlds word set across the draft so the same word is not reused unnecessarily.",
    "When a question needs a vocabulary word, correct answer, distractor, matching word, image prompt, or explanation example, use only the approved vocabulary context above.",
    "Do not introduce outside vocabulary words unless the admin request explicitly asks for a custom topic and no approved vocabulary context was provided.",
    "Every question must be meaningfully different. Do not repeat the same prompt, sentence frame, answer set, correct answer pattern, matching pair, object example, or distractor set.",
    "Do not reuse the same sourceVocabularyWord in nearby questions unless the admin requested focus words and the word needs multiple layouts. Even then, vary the skill and wording.",
    "Before writing each final question, internally plan the skill target, selected vocabulary, reasoning operation, expected answer, and distractor logic. Return only the final JSON, not the hidden plan.",
    "Every question must include reasoningType, cognitiveSkill, questionIntent, difficultyScore from 0 to 1, levelFitScore from 0 to 1, levelFitExplanation, and alignmentNotes.",
    "Every question must also include learningObjective, targetSkill, qualityScore, alignmentScore, clarityScore, depthScore, uniquenessScore, answerValidityScore, ageFitScore, whyThisAnswerIsCorrect, and whyDistractorsAreWrong.",
    "All score fields must be numbers from 0 to 1. Do not assign high scores if the prompt is generic, repeated, unclear, or unsupported by the approved vocabulary.",
    "Distractors must be plausible but clearly wrong. Explain why the distractors are wrong in one short phrase.",
    "difficultyScore must match the selected learner level range. levelFitExplanation must briefly explain why the question fits the selected level.",
    "Harder questions should use more reasoning, not confusing wording, obscure vocabulary, or trick phrasing.",
    "Every question must include interactionType that matches its layout: multiple-choice/true-or-false/compare-numbers/timed-challenge=tap-choice; fill-in-the-blank=typed-answer; matching/image-to-word/word-to-image=tap-or-drag-match; ordering=drag-sequence; text-to-speech=audio-choice; speech-to-text=speech-response; image-choice/picture-based/counting-objects=image-choice; word-problem/scenario=story-choice.",
    "Do not make interactive layouts behave like plain multiple choice. Speaking questions must require the learner to say the word or phrase. Listening questions must require audio playback before answering. Ordering questions must provide draggable sequence tiles. Matching, image-to-word, and word-to-image questions must provide pairs for tap/drag matching.",
    "For fill-in-the-blank, the learner must type the missing word in the blank. You may provide a wordBank for hints, but never phrase the prompt as if the learner simply taps a choice.",
    "Make each question slightly thoughtful: the learner should use a clue, sentence meaning, object use, sound, order, category, count, or short scenario to answer. Keep this reasoning gentle for the selected learner level and avoid trick questions.",
    "If one objective needs several questions, vary the example, wording, skill angle, and distractors while staying aligned to the same curriculum objective.",
    "Treat image-to-word and word-to-image as matching layouts with pairs. Each image pair must include word, imagePrompt, and altText fields. Do not invent live image URLs or secrets; use child-safe image prompts for admin review.",
    "For image-choice, picture-based, counting-objects, image-to-word, and word-to-image layouts, every question must include an imageLabel or pair imagePrompt/altText that describes the exact selected vocabulary word or count.",
    "For matching layouts, use exactly four unique pairs and avoid duplicate left or right values.",
    "For counting-objects, use nearby-number distractors and put the count clue in imageLabel or helperText.",
    "For ordering, put the correct sequence in the options array and the answer as a comma-separated sequence.",
    "Keep the tone child-friendly, clear, and age-appropriate.",
    "Align difficulty, vocabulary, and task type with the selected learner level and curriculum objective.",
    "For linguistic content, prioritize communication, listening, reading, and writing progression.",
    "For numeric content, prioritize number sense, operations, patterns, measurement, and logical reasoning.",
    "Do not include unsafe, violent, or mature content.",
    "Return only structured quiz content that matches the provided JSON schema.",
  ].join(" ");
}

function normalizeDraft(
  rawDraft: unknown,
  input: GenerateQuizDraftInput
): CuratedQuizDraft {
  if (!rawDraft || typeof rawDraft !== "object") {
    throw new Error("The AI service returned an invalid quiz draft.");
  }

  const candidate = rawDraft as JsonRecord;
  const normalizedQuestions = Array.isArray(candidate.questions)
    ? candidate.questions
        .map((question, index) => normalizeQuestion(question, index))
        .filter((question): question is CuratedQuizQuestion => question !== null)
    : [];
  const questions = addGeneratedQualityFlags(
    removeRepeatedGeneratedQuestions(normalizedQuestions),
    input.learnerLevel,
    input.vocabularyContext ?? []
  );
  const removedRepeatedQuestionCount = normalizedQuestions.length - questions.length;
  const unapprovedVocabularyTerms = findUnapprovedVocabularyTerms(
    questions,
    input.vocabularyContext ?? []
  );
  const qualityFlags = getDraftQualitySummary(questions);

  if (!questions.length) {
    throw new Error("The AI service did not return any usable quiz questions.");
  }

  const questionTypes = Array.from(new Set(questions.map((question) => question.type)));
  const qualitySummary = getQuizQualitySummary(questions);

  return {
    title: cleanString(candidate.title, `${input.topic.trim()} Quiz`),
    topic: input.topic.trim(),
    ageGroup: input.ageGroup.trim(),
    category: normalizeQuizCategory(candidate.category || input.category),
    curriculumLevel: Math.max(
      1,
      Math.round(cleanNumber(candidate.curriculumLevel, input.curriculumLevel))
    ),
    difficulty: normalizeQuizDifficulty(candidate.difficulty || input.difficulty),
    learnerLevel: normalizeLearnerLevel(candidate.learnerLevel || input.learnerLevel),
    gradeLevel: normalizeLearnerLevel(
      candidate.gradeLevel || input.gradeLevel || candidate.learnerLevel || input.learnerLevel
    ),
    worldId: cleanString(candidate.worldId, input.worldId ?? ""),
    topicId: cleanString(candidate.topicId, input.topicId ?? ""),
    phase: normalizeActiveLearningPhase(candidate.phase) ?? input.phase,
    node: Math.max(1, Math.round(cleanNumber(candidate.node, input.node ?? 1))),
    assetId: cleanString(candidate.assetId, input.assetId ?? ""),
    unlockRewardMapping: cleanString(
      candidate.unlockRewardMapping,
      input.unlockRewardMapping ?? ""
    ),
    mobilePreviewChecked: false,
    previewCheckedAt: null,
    previewCheckedByUid: null,
    objective: cleanString(
      candidate.objective,
      `Help learners practice ${input.topic.trim()}.`
    ),
    instructions: cleanString(
      candidate.instructions,
      "Read each question carefully and answer one at a time."
    ),
    notes: [
      cleanString(candidate.notes),
      removedRepeatedQuestionCount > 0
        ? `${removedRepeatedQuestionCount} repeated generated question${
            removedRepeatedQuestionCount === 1 ? " was" : "s were"
          } removed before admin review.`
        : "",
      unapprovedVocabularyTerms.length
        ? `Review vocabulary alignment: these generated terms were not in the selected approved Learning Worlds word set: ${unapprovedVocabularyTerms.join(", ")}.`
        : "",
      qualityFlags.length
        ? `Smart review flags: ${qualityFlags.join(" ")}`
        : "",
    ]
      .filter(Boolean)
      .join(" "),
    sourcePrompt: input.adminPrompt.trim(),
    createdWith: "gemini",
    lifecycleStatus: normalizeDraftLifecycleStatus(candidate.lifecycleStatus, "generated"),
    lifecycleLogs: normalizeLifecycleLogs(candidate.lifecycleLogs),
    previewSnapshot: normalizePreviewSnapshot(candidate.previewSnapshot),
    approvalSnapshot: normalizeApprovalSnapshot(candidate.approvalSnapshot),
    validationSnapshot: normalizeValidationSnapshot(candidate.validationSnapshot),
    publishSnapshot: normalizePublishSnapshot(candidate.publishSnapshot),
    promptVersion: cleanString(candidate.promptVersion, QUIZ_GENERATION_PROMPT_VERSION),
    modelName: cleanString(candidate.modelName, GEMINI_MODEL_NAME),
    qualitySummary,
    questionTypes,
    questions,
    rewards: {
      stars: 1,
      rankProgress: input.rewardXp ?? 20,
      rewardProgress: 1,
      mastery: input.phase === "Mastery",
      nextUnlockId: input.topicId,
      ...normalizeQuizRewards(candidate.rewards),
    },
    unlockRequirements: normalizeUnlockRequirements(candidate.unlockRequirements),
  };
}

function getErrorMessage(payload: unknown) {
  if (payload && typeof payload === "object" && typeof (payload as JsonRecord).message === "string") {
    return (payload as JsonRecord).message as string;
  }

  return "The Gemini quiz service could not generate a draft right now.";
}

function buildFallbackOptions(answer: string, index: number, candidateWords: string[] = []) {
  const numericAnswer = Number(answer);

  if (Number.isFinite(numericAnswer)) {
    const options = new Set<string>([`${numericAnswer}`]);
    let offset = 1;

    while (options.size < REQUIRED_CHOICE_COUNT) {
      options.add(`${Math.max(0, numericAnswer - offset)}`);

      if (options.size < REQUIRED_CHOICE_COUNT) {
        options.add(`${numericAnswer + offset}`);
      }

      offset += 1;
    }

    return Array.from(options).slice(0, REQUIRED_CHOICE_COUNT);
  }

  const distractorSets = [
    candidateWords,
    ["book", "apple", "chair", "ball"],
    ["sun", "cup", "tree", "pencil"],
    ["listen", "count", "match", "read"],
    ["red", "blue", "big", "small"],
  ];
  const distractors = distractorSets[index % distractorSets.length].filter(
    (item) => normalizeForComparison(item) !== normalizeForComparison(answer)
  );

  const allDistractors = [
    ...distractors,
    ...distractorSets.flat().filter(
      (item) => normalizeForComparison(item) !== normalizeForComparison(answer)
    ),
  ];

  return Array.from(new Set([answer, ...allDistractors])).slice(0, 4);
}

function createFallbackQuestion(
  type: QuizLayoutType,
  index: number,
  topic: string,
  sourceItem?: QuizGenerationVocabularyItem,
  vocabularyContext: QuizGenerationVocabularyItem[] = []
): CuratedQuizQuestion {
  const id = `fallback-question-${index + 1}`;
  const sourceWord = sourceItem?.word || topic;
  const sourceClue =
    sourceItem?.clue || sourceItem?.meaning || sourceItem?.sample || `${sourceWord} is a practice word`;
  const candidateWords = vocabularyContext.map((item) => item.word);
  const alternateWords = ["apple", "ball", "book", "sun", "cup", "tree"];
  const alternateWord =
    alternateWords.find(
      (word) => normalizeForComparison(word) !== normalizeForComparison(sourceWord)
    ) ?? "word";
  const count = (index % 4) + 2;
  const nextCount = count + 1;

  if (type === "fill-in-the-blank") {
    return {
      id,
      type,
      interactionType: getInteractionTypeForLayout(type),
      prompt: "Choose the best word: The class practices ___.",
      sentence:
        index % 2 === 0
          ? `We are learning about ___.`
          : `The class practices ___ today.`,
      answer: sourceWord,
      wordBank: buildFallbackOptions(sourceWord, index, candidateWords),
      explanation: `The missing word is ${sourceWord}.`,
      sourceVocabularyWord: sourceWord,
      vocabularyUsed: [sourceWord],
    };
  }

  if (type === "matching") {
    return {
      id,
      type,
      interactionType: getInteractionTypeForLayout(type),
      prompt: "Match each word with its meaning.",
      instruction: "Match each item with the best pair.",
      pairs: [
        { left: sourceWord, right: sourceItem?.meaning || "selected vocabulary word" },
        { left: alternateWord, right: "different practice word" },
        { left: "book", right: "thing learners can read" },
        { left: "apple", right: "fruit learners may eat" },
      ],
      explanation: "Matching helps learners connect related ideas.",
      sourceVocabularyWord: sourceWord,
      vocabularyUsed: [sourceWord],
    };
  }

  if (type === "image-to-word" || type === "word-to-image") {
    const pairs =
      type === "image-to-word"
        ? [
            {
              left: `Picture of ${sourceWord}`,
              right: sourceWord,
              leftType: "image" as const,
              rightType: "word" as const,
              word: sourceWord,
              imagePrompt: sourceItem?.imagePrompt || `simple child-friendly picture of ${sourceWord}`,
              altText: sourceWord,
            },
            {
              left: `Picture of ${alternateWord}`,
              right: alternateWord,
              leftType: "image" as const,
              rightType: "word" as const,
              word: alternateWord,
              imagePrompt: `simple child-friendly picture of ${alternateWord}`,
              altText: alternateWord,
            },
            {
              left: "Picture of book",
              right: "book",
              leftType: "image" as const,
              rightType: "word" as const,
              word: "book",
              imagePrompt: "simple child-friendly picture of a book",
              altText: "book",
            },
            {
              left: "Picture of apple",
              right: "apple",
              leftType: "image" as const,
              rightType: "word" as const,
              word: "apple",
              imagePrompt: "simple child-friendly picture of an apple",
              altText: "apple",
            },
          ]
        : [
            {
              left: sourceWord,
              right: `Picture of ${sourceWord}`,
              leftType: "word" as const,
              rightType: "image" as const,
              word: sourceWord,
              imagePrompt: sourceItem?.imagePrompt || `simple child-friendly picture of ${sourceWord}`,
              altText: sourceWord,
            },
            {
              left: alternateWord,
              right: `Picture of ${alternateWord}`,
              leftType: "word" as const,
              rightType: "image" as const,
              word: alternateWord,
              imagePrompt: `simple child-friendly picture of ${alternateWord}`,
              altText: alternateWord,
            },
            {
              left: "book",
              right: "Picture of book",
              leftType: "word" as const,
              rightType: "image" as const,
              word: "book",
              imagePrompt: "simple child-friendly picture of a book",
              altText: "book",
            },
            {
              left: "apple",
              right: "Picture of apple",
              leftType: "word" as const,
              rightType: "image" as const,
              word: "apple",
              imagePrompt: "simple child-friendly picture of an apple",
              altText: "apple",
            },
          ];

    return {
      id,
      type,
      interactionType: getInteractionTypeForLayout(type),
      prompt: type === "image-to-word" ? "Match each picture to its word." : "Match each word to its picture.",
      instruction:
        type === "image-to-word"
          ? "Match each picture to its word."
          : "Match each word to its picture.",
      pairs,
      explanation: "Image matching drafts should be reviewed against approved assets.",
      sourceVocabularyWord: sourceWord,
      vocabularyUsed: [sourceWord],
    };
  }

  if (type === "true-or-false") {
    return {
      id,
      type,
      interactionType: getInteractionTypeForLayout(type),
      prompt:
        index % 2 === 0
          ? `True or false: ${sourceWord} is a practice word.`
          : `True or false: ${alternateWord} is the same as ${sourceWord}.`,
      options: ["True", "False", "Yes", "No"],
      answer: index % 2 === 0 ? "True" : "False",
      explanation:
        index % 2 === 0
          ? `The statement uses the practice word ${sourceWord}.`
          : "The two words are different examples.",
      sourceVocabularyWord: sourceWord,
      vocabularyUsed: [sourceWord],
    };
  }

  if (type === "word-problem" || type === "scenario") {
    return {
      id,
      type,
      interactionType: getInteractionTypeForLayout(type),
      prompt: `There are ${count} counters. We add 1 more. How many counters are there now?`,
      options: buildFallbackOptions(`${nextCount}`, index, candidateWords),
      answer: `${nextCount}`,
      explanation: `${count} plus one equals ${nextCount}.`,
    };
  }

  if (type === "text-to-speech") {
    return {
      id,
      type,
      interactionType: getInteractionTypeForLayout(type),
      prompt: "Listen and choose the word.",
      options: buildFallbackOptions(sourceWord, index, candidateWords),
      answer: sourceWord,
      audioText: sourceWord,
      explanation: `The spoken word is ${sourceWord}.`,
      sourceVocabularyWord: sourceWord,
      vocabularyUsed: [sourceWord],
    };
  }

  if (type === "speech-to-text") {
    return {
      id,
      type,
      interactionType: getInteractionTypeForLayout(type),
      prompt: `Say the word: ${sourceWord}`,
      options: [],
      answer: sourceWord,
      audioText: sourceWord,
      helperText: "Speak clearly or type the word.",
      explanation: `The expected word is ${sourceWord}.`,
      sourceVocabularyWord: sourceWord,
      vocabularyUsed: [sourceWord],
    };
  }

  if (type === "image-choice" || type === "picture-based") {
    return {
      id,
      type,
      interactionType: getInteractionTypeForLayout(type),
      prompt: "Choose the word that matches the picture.",
      options: buildFallbackOptions(sourceWord, index, candidateWords),
      answer: sourceWord,
      imageLabel: sourceItem?.imagePrompt || `Picture of ${sourceWord}`,
      explanation: `The image clue points to ${sourceWord}.`,
      sourceVocabularyWord: sourceWord,
      vocabularyUsed: [sourceWord],
    };
  }

  if (type === "counting-objects") {
    return {
      id,
      type,
      interactionType: getInteractionTypeForLayout(type),
      prompt: `How many ${sourceWord} items are there?`,
      options: buildFallbackOptions(`${count}`, index, candidateWords),
      answer: `${count}`,
      imageLabel: `${count} child-friendly ${sourceWord} items`,
      explanation: `There are ${count} items.`,
      sourceVocabularyWord: sourceWord,
      vocabularyUsed: [sourceWord],
    };
  }

  if (type === "compare-numbers") {
    return {
      id,
      type,
      interactionType: getInteractionTypeForLayout(type),
      prompt: `Which number is bigger: ${count} or ${nextCount}?`,
      options: buildFallbackOptions(`${nextCount}`, index, candidateWords),
      answer: `${nextCount}`,
      explanation: `${nextCount} is bigger than ${count}.`,
    };
  }

  if (type === "ordering") {
    return {
      id,
      type,
      interactionType: getInteractionTypeForLayout(type),
      prompt: "Put these numbers in order.",
      options: [`${count}`, `${nextCount}`, `${nextCount + 1}`, `${nextCount + 2}`],
      answer: `${count}, ${nextCount}, ${nextCount + 1}, ${nextCount + 2}`,
      explanation: "The numbers go from smallest to biggest.",
      sourceVocabularyWord: sourceWord,
      vocabularyUsed: [sourceWord],
    };
  }

  if (type === "timed-challenge") {
    return {
      id,
      type,
      interactionType: getInteractionTypeForLayout(type),
      prompt: `Quick answer: Which word matches the clue?`,
      options: buildFallbackOptions(sourceWord, index, candidateWords),
      answer: sourceWord,
      explanation: `${sourceWord} is the matching answer.`,
      sourceVocabularyWord: sourceWord,
      vocabularyUsed: [sourceWord],
    };
  }

  return {
    id,
    type: "multiple-choice",
    interactionType: getInteractionTypeForLayout("multiple-choice"),
    prompt: `Clue: ${sourceClue.replace(/[.?!]\s*$/, "")}. Which word is it?`,
    options: buildFallbackOptions(sourceWord, index, candidateWords),
    answer: sourceWord,
    explanation: `${sourceWord} is the matching word.`,
    sourceVocabularyWord: sourceWord,
    vocabularyUsed: [sourceWord],
  };
}

export function createLocalQuizDraft(input: GenerateQuizDraftInput): CuratedQuizDraft {
  const topic = input.topic.trim() || "vocabulary";
  const questionTypes = input.questionTypes.length
    ? input.questionTypes
    : (["multiple-choice"] as QuizLayoutType[]);
  const questionCount = Math.max(1, input.questionCount || 10);
  const questions = addGeneratedQualityFlags(
    Array.from({ length: questionCount }, (_, index) => {
      const sourceItem = input.vocabularyContext?.[index % (input.vocabularyContext.length || 1)];

      return createFallbackQuestion(
        questionTypes[index % questionTypes.length],
        index,
        topic,
        sourceItem,
        input.vocabularyContext ?? []
      );
    }),
    input.learnerLevel,
    input.vocabularyContext ?? []
  );

  return {
    title: `${topic} Practice Draft`,
    topic,
    ageGroup: input.ageGroup.trim() || "Preschool to Grade 3",
    category: input.category,
    curriculumLevel: input.curriculumLevel,
    difficulty: input.difficulty,
    learnerLevel: input.learnerLevel,
    gradeLevel: input.gradeLevel ?? input.learnerLevel,
    worldId: input.worldId ?? "",
    topicId: input.topicId ?? "",
    phase: input.phase,
    node: input.node ?? 1,
    assetId: input.assetId ?? "",
    unlockRewardMapping:
      input.unlockRewardMapping ??
      "Rank XP, Reward progress, star progress, and mastery state.",
    mobilePreviewChecked: false,
    previewCheckedAt: null,
    previewCheckedByUid: null,
    objective: `Help learners practice ${topic} with editable preset questions.`,
    instructions: "Review and edit each question before sending this draft to review.",
    notes:
      "Generated locally because the Gemini function could not be reached. Review carefully before publishing.",
    sourcePrompt: input.adminPrompt.trim(),
    createdWith: "local-fallback",
    promptVersion: QUIZ_GENERATION_PROMPT_VERSION,
    modelName: "local-fallback",
    qualitySummary: getQuizQualitySummary(questions),
    questionTypes: Array.from(new Set(questions.map((question) => question.type))),
    questions,
    rewards: {
      xp: input.rewardXp ?? 20,
      stars: 1,
      rankProgress: input.rewardXp ?? 20,
      rewardProgress: 1,
      mastery: input.phase === "Mastery",
      nextUnlockId: input.topicId,
      unlockMessage: `${topic} practice is ready.`,
    },
    unlockRequirements: {
      requiredLevel: input.curriculumLevel,
    },
  };
}

function isFetchConnectionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    error.name === "TypeError" &&
    (message.includes("failed to fetch") ||
      message.includes("network request failed") ||
      message.includes("load failed"))
  );
}

export async function generateQuizDraftWithGemini(
  input: GenerateQuizDraftInput,
  user?: Pick<User, "getIdToken">
) {
  const token = user ? await user.getIdToken() : null;

  let response: Response;

  try {
    response = await requestGeminiQuizDraft({
      token,
      body: {
        curriculumContract: buildBatiBotCurriculumDraftApiContract(input),
        topic: input.topic.trim(),
        adminPrompt: input.adminPrompt.trim(),
        ageGroup: input.ageGroup.trim(),
        questionCount: input.questionCount,
        questionTypes: input.questionTypes,
        category: input.category,
        curriculumLevel: input.curriculumLevel,
        difficulty: input.difficulty,
        learnerLevel: input.learnerLevel,
        objective: input.objective,
        notes: input.notes,
        language: input.language,
        mediaRequired: input.mediaRequired,
        skillTag: input.skillTag,
        vocabularyMode: input.vocabularyMode,
        vocabularyContext: input.vocabularyContext ?? [],
        gradeLevel: input.gradeLevel ?? input.learnerLevel,
        worldId: input.worldId ?? "",
        topicId: input.topicId ?? "",
        phase: input.phase,
        node: input.node ?? 1,
        assetId: input.assetId ?? "",
        rewardXp: input.rewardXp,
        unlockRewardMapping: input.unlockRewardMapping,
        promptVersion: QUIZ_GENERATION_PROMPT_VERSION,
        modelName: GEMINI_MODEL_NAME,
        generationConfig: {
          responseMimeType: "application/json",
          responseJsonSchema: curatedQuizResponseSchema,
        },
        prompt: buildGeminiPrompt(input),
      },
    });
  } catch (error) {
    if (isFetchConnectionError(error)) {
      return createLocalQuizDraft(input);
    }

    throw error;
  }

  const payload = (await response.json().catch(() => null)) as JsonRecord | null;

  if (!response.ok) {
    throw new Error(getErrorMessage(payload));
  }

  return normalizeDraft(payload?.quiz ?? payload?.data ?? payload, input);
}

export async function saveCuratedQuizDraft(
  draft: CuratedQuizDraft,
  user: Pick<User, "uid" | "email">
) {
  const timestamp = serverTimestamp() as FieldValue;
  const lifecyclePayload = buildLifecyclePayload({
    draft,
    lifecycleStatus: draft.lifecycleStatus ?? "draft",
    note: `${draft.title} was saved as a draft.`,
    user,
  });
  const docRef = await addDoc(collection(db, "curatedQuizzes"), {
    ...draft,
    status: "draft",
    ...lifecyclePayload,
    reviewChecklist: DEFAULT_REVIEW_CHECKLIST,
    createdByUid: user.uid,
    createdByEmail: user.email ?? "",
    createdAt: timestamp,
    updatedAt: timestamp,
    publishedAt: null,
    archivedAt: null,
  });

  return docRef.id;
}

export async function createAdminActivityLog({
  actionType,
  details,
  quizId = null,
  user,
}: {
  actionType: AdminActivityType;
  details: string;
  quizId?: string | null;
  user: Pick<User, "uid" | "email">;
}) {
  const identity = getAdminIdentity(user);

  await addDoc(collection(db, "adminActivityLogs"), {
    actionType,
    quizId,
    ...identity,
    details,
    timestamp: serverTimestamp(),
  });
}

export async function getAdminActivityLogs(maxCount = 20): Promise<AdminActivityLog[]> {
  const snapshot = await getDocs(
    query(
      collection(db, "adminActivityLogs"),
      orderBy("timestamp", "desc"),
      limit(maxCount)
    )
  );

  return snapshot.docs.map((activityDoc) => {
    const data = activityDoc.data() as JsonRecord;

    return {
      id: activityDoc.id,
      actionType:
        typeof data.actionType === "string"
          ? (data.actionType as AdminActivityType)
          : "quiz-edited",
      quizId: typeof data.quizId === "string" ? data.quizId : null,
      adminUid: cleanString(data.adminUid),
      adminEmail: cleanString(data.adminEmail),
      timestamp: toIsoDate(data.timestamp),
      details: cleanString(data.details),
    };
  });
}

export async function getCuratedQuizzes(): Promise<CuratedQuiz[]> {
  const snapshot = await getDocs(
    query(collection(db, "curatedQuizzes"), orderBy("updatedAt", "desc"))
  );

  return snapshot.docs.map((quizDoc) =>
    normalizeCuratedQuizDocument(quizDoc.id, quizDoc.data() as JsonRecord)
  );
}

export async function getCuratedQuizById(id: string): Promise<CuratedQuiz | null> {
  const snapshot = await getDoc(doc(db, "curatedQuizzes", id));

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeCuratedQuizDocument(snapshot.id, snapshot.data() as JsonRecord);
}

export async function createQuizDraft(
  draft: CuratedQuizDraft & { reviewChecklist?: QuizReviewChecklist },
  user: Pick<User, "uid" | "email">,
  status: CuratedQuizStatus = "draft"
) {
  const timestamp = serverTimestamp() as FieldValue;

  if (
    status === "published" &&
    draft.lifecycleStatus !== "validated" &&
    draft.lifecycleStatus !== "published"
  ) {
    throw new Error("Run and pass BatiBot validation before publishing.");
  }

  if (status === "published") {
    const validation = validateQuizBeforePublish({
      ...draft,
      reviewChecklist: draft.reviewChecklist ?? DEFAULT_REVIEW_CHECKLIST,
    });

    if (!validation.isValid) {
      throw new Error(validation.errors.join("\n"));
    }
  }

  const lifecycleStatus = normalizeDraftLifecycleStatus(
    status === "published" ? "published" : draft.lifecycleStatus,
    getDefaultLifecycleStatus(status, draft)
  );
  const resolvedStatus = getStatusForLifecycleStatus(lifecycleStatus, status);
  const lifecyclePayload = buildLifecyclePayload({
    draft,
    lifecycleStatus,
    note: `${draft.title} moved to ${lifecycleStatus}.`,
    user,
  });
  const docRef = await addDoc(collection(db, "curatedQuizzes"), {
    ...draft,
    status: resolvedStatus,
    ...lifecyclePayload,
    ...(resolvedStatus === "published"
      ? {
          publishSnapshot: {
            publishedAt: new Date().toISOString(),
            publishedByUid: user.uid,
            statusBeforePublish: draft.lifecycleStatus ?? "validated",
          },
        }
      : {}),
    reviewChecklist: draft.reviewChecklist ?? DEFAULT_REVIEW_CHECKLIST,
    createdByUid: user.uid,
    createdByEmail: user.email ?? "",
    createdAt: timestamp,
    updatedAt: timestamp,
    publishedAt: null,
    archivedAt: null,
  });

  await createAdminActivityLog({
    actionType: resolvedStatus === "ready-for-review" ? "quiz-edited" : "quiz-draft-created",
    details: `${draft.title} was saved as ${lifecycleStatus}.`,
    quizId: docRef.id,
    user,
  });

  return docRef.id;
}

export async function generateAIQuizDraft(
  input: GenerateQuizDraftInput,
  user?: Pick<User, "getIdToken">
) {
  return generateQuizDraftWithGemini(input, user);
}

export async function saveQuizDraft(
  draft: CuratedQuizDraft,
  user: Pick<User, "uid" | "email">
) {
  return createQuizDraft(draft, user, "draft");
}

export async function updateQuizDraft(
  quizId: string,
  draft: CuratedQuizDraft,
  user: Pick<User, "uid" | "email">,
  options: {
    lifecycleStatus?: DraftLifecycleStatus;
    reviewChecklist?: QuizReviewChecklist;
    status?: CuratedQuizStatus;
  } = {}
) {
  const lifecycleStatus = normalizeDraftLifecycleStatus(
    options.lifecycleStatus ?? draft.lifecycleStatus,
    getDefaultLifecycleStatus(options.status ?? "draft", draft)
  );
  const resolvedStatus = getStatusForLifecycleStatus(
    lifecycleStatus,
    options.status ?? "draft"
  );
  const lifecyclePayload = buildLifecyclePayload({
    draft,
    lifecycleStatus,
    note: `${draft.title} moved to ${lifecycleStatus}.`,
    user,
  });

  await updateDoc(doc(db, "curatedQuizzes", quizId), {
    ...draft,
    ...lifecyclePayload,
    ...(options.reviewChecklist ? { reviewChecklist: options.reviewChecklist } : {}),
    ...(options.status || options.lifecycleStatus ? { status: resolvedStatus } : {}),
    updatedAt: serverTimestamp(),
  });

  await createAdminActivityLog({
    actionType: "quiz-edited",
    details: `${draft.title} was updated.`,
    quizId,
    user,
  });
}

export async function duplicateQuiz(
  quizId: string,
  user: Pick<User, "uid" | "email">
) {
  const quiz = await getCuratedQuizById(quizId);

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  const draft: CuratedQuizDraft = {
    ageGroup: quiz.ageGroup,
    category: quiz.category,
    createdWith: quiz.createdWith,
    curriculumLevel: quiz.curriculumLevel,
    difficulty: quiz.difficulty,
    gradeLevel: quiz.gradeLevel,
    worldId: quiz.worldId,
    topicId: quiz.topicId,
    phase: quiz.phase,
    node: quiz.node,
    assetId: quiz.assetId,
    unlockRewardMapping: quiz.unlockRewardMapping,
    learnerLevel: quiz.learnerLevel,
    instructions: quiz.instructions,
    notes: quiz.notes,
    objective: quiz.objective,
    promptVersion: quiz.promptVersion,
    modelName: quiz.modelName,
    qualitySummary: quiz.qualitySummary,
    questionTypes: quiz.questionTypes,
    questions: quiz.questions,
    sourcePrompt: quiz.sourcePrompt,
    title: `${quiz.title} Copy`,
    topic: quiz.topic,
    rewards: quiz.rewards,
    unlockRequirements: quiz.unlockRequirements,
  };
  const duplicateId = await createQuizDraft(
    draft,
    user,
    "draft"
  );

  await createAdminActivityLog({
    actionType: "quiz-draft-created",
    details: `${quiz.title} was duplicated.`,
    quizId: duplicateId,
    user,
  });

  return duplicateId;
}

function hasDuplicatePrompts(questions: CuratedQuizQuestion[]) {
  const prompts = questions.map((question) => normalizeForComparison(question.prompt));
  return new Set(prompts).size !== prompts.length;
}

function hasRepeatedQuestionContent(questions: CuratedQuizQuestion[]) {
  const signatures = questions.map(getQuestionGenerationSignature);
  return new Set(signatures).size !== signatures.length;
}

function hasDuplicateOptions(question: MultipleChoiceQuestion) {
  const options = question.options.map(normalizeForComparison);
  return new Set(options).size !== options.length;
}

function hasDuplicateValues(values: string[]) {
  const normalizedValues = values.map(normalizeForComparison);
  return new Set(normalizedValues).size !== normalizedValues.length;
}

function hasDuplicateMatchingPairs(question: MatchingQuestion) {
  const leftValues = question.pairs.map((pair) => pair.left.trim().toLowerCase());
  const rightValues = question.pairs.map((pair) => pair.right.trim().toLowerCase());
  const pairValues = question.pairs.map(
    (pair) => `${pair.left.trim().toLowerCase()}::${pair.right.trim().toLowerCase()}`
  );

  return (
    new Set(leftValues).size !== leftValues.length ||
    new Set(rightValues).size !== rightValues.length ||
    new Set(pairValues).size !== pairValues.length
  );
}

function isQuestionComplete(question: CuratedQuizQuestion) {
  if (!question.prompt.trim()) {
    return false;
  }

  if (question.type === "multiple-choice") {
    return (
      question.options.length === REQUIRED_CHOICE_COUNT &&
      !hasDuplicateOptions(question) &&
      question.answer.trim().length > 0 &&
      question.options.map(normalizeForComparison).includes(normalizeForComparison(question.answer))
    );
  }

  if (
    question.type === "true-or-false" ||
    question.type === "word-problem" ||
    question.type === "text-to-speech" ||
    question.type === "image-choice" ||
    question.type === "timed-challenge" ||
    question.type === "counting-objects" ||
    question.type === "compare-numbers" ||
    question.type === "picture-based" ||
    question.type === "scenario"
  ) {
    return (
      question.options.length === REQUIRED_CHOICE_COUNT &&
      !hasDuplicateOptions(question) &&
      question.answer.trim().length > 0 &&
      question.options.map(normalizeForComparison).includes(normalizeForComparison(question.answer))
    );
  }

  if (question.type === "speech-to-text") {
    return question.answer.trim().length > 0;
  }

  if (question.type === "ordering") {
    return (
      question.options.length === REQUIRED_CHOICE_COUNT &&
      !hasDuplicateOptions(question) &&
      question.answer.trim().length > 0
    );
  }

  if (question.type === "fill-in-the-blank") {
    return (
      question.sentence.trim().length > 0 &&
      question.answer.trim().length > 0 &&
      question.wordBank.length === REQUIRED_CHOICE_COUNT &&
      !hasDuplicateValues(question.wordBank) &&
      question.wordBank.map(normalizeForComparison).includes(normalizeForComparison(question.answer))
    );
  }

  if (
    question.type === "matching" ||
    question.type === "image-to-word" ||
    question.type === "word-to-image"
  ) {
    return (
      question.pairs.length === REQUIRED_CHOICE_COUNT &&
      question.pairs.every((pair) => {
        const hasRequiredImageMetadata =
          question.type === "matching" || pair.imagePrompt?.trim() || pair.altText?.trim();

        return pair.left.trim() && pair.right.trim() && hasRequiredImageMetadata;
      }) &&
      !hasDuplicateMatchingPairs(question)
    );
  }

  return false;
}

export function validateQuizBeforePublish(
  quiz: Pick<
    CuratedQuiz,
    | "title"
    | "topic"
    | "ageGroup"
    | "category"
    | "createdWith"
    | "curriculumLevel"
    | "difficulty"
    | "gradeLevel"
    | "worldId"
    | "topicId"
    | "phase"
    | "assetId"
    | "unlockRewardMapping"
    | "mobilePreviewChecked"
    | "objective"
    | "instructions"
    | "questions"
    | "reviewChecklist"
    | "rewards"
  >
) {
  const errors: string[] = [];
  const playIssues = validateAdminPlayContentForPublish(quiz);
  const blockingPlayIssues = getBlockingPublishIssues(playIssues);

  blockingPlayIssues.forEach((issue) => {
    errors.push(issue.message);
  });

  if (!quiz.title.trim()) {
    errors.push("Title is required.");
  }

  if (!quiz.topic.trim()) {
    errors.push("Topic is required.");
  }

  if (!quiz.ageGroup.trim()) {
    errors.push("Age group is required.");
  }

  if (quiz.curriculumLevel < 1) {
    errors.push("Curriculum level must be 1 or higher.");
  }

  if (!quiz.category) {
    errors.push("Category is required.");
  }

  if (!quiz.difficulty) {
    errors.push("Difficulty is required.");
  }

  if (quiz.rewards.xp < 0) {
    errors.push("XP reward cannot be negative.");
  }

  if (!quiz.objective.trim()) {
    errors.push("Objective is required.");
  }

  if (!quiz.instructions.trim()) {
    errors.push("Instructions are required.");
  }

  if (!quiz.questions.length) {
    errors.push("At least one question is required.");
  }

  if (quiz.questions.some((question) => !isQuestionComplete(question))) {
    errors.push("All questions need complete prompts, answers, and options or pairs.");
  }

  if (hasDuplicatePrompts(quiz.questions)) {
    errors.push("Duplicate question prompts must be removed.");
  }

  if (hasRepeatedQuestionContent(quiz.questions)) {
    errors.push("Repeated question content must be varied before publishing.");
  }

  const qualitySummary = getQuizQualitySummary(quiz.questions);

  if (qualitySummary.flaggedQuestionCount > 0) {
    errors.push("Generated quality flags must be resolved before publishing.");
  }

  if (qualitySummary.duplicateRiskCount > 0) {
    errors.push("Near-duplicate question frames must be varied before publishing.");
  }

  if (
    quiz.questions.some(
      (question) =>
        typeof question.qualityScore === "number" &&
        question.qualityScore < MIN_PUBLISH_QUESTION_QUALITY_SCORE
    )
  ) {
    errors.push("Low-scoring generated questions need repair before publishing.");
  }

  if (quiz.questions.some((question) => !hasRequiredChoiceCount(question))) {
    errors.push("Choice-style questions must have exactly four answer choices before publishing.");
  }

  if (
    quiz.questions.some(
      (question) =>
        quiz.createdWith === "gemini" &&
        (!question.learningObjective ||
          !question.targetSkill ||
          !question.reasoningType ||
          !question.questionIntent ||
          !question.whyThisAnswerIsCorrect)
    )
  ) {
    errors.push("AI-generated questions need objective, skill, reasoning, intent, and answer rationale metadata.");
  }

  if (
    quiz.questions.some(
      (question) =>
        typeof question.levelFitScore === "number" && question.levelFitScore < 0.6
    )
  ) {
    errors.push("Questions with low level-fit scores need review before publishing.");
  }

  if (
    quiz.questions.some(
      (question) =>
        (question.type === "matching" ||
          question.type === "image-to-word" ||
          question.type === "word-to-image") &&
        hasDuplicateMatchingPairs(question)
    )
  ) {
    errors.push("Matching questions need unique left and right pair values.");
  }

  if (!Object.values(quiz.reviewChecklist).every(Boolean)) {
    errors.push("The review checklist must be completed before publishing.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function publishQuiz(
  quiz: CuratedQuiz,
  user: Pick<User, "uid" | "email">
) {
  if (quiz.lifecycleStatus !== "validated" && quiz.lifecycleStatus !== "published") {
    throw new Error("Run and pass BatiBot validation before publishing.");
  }

  const validation = validateQuizBeforePublish(quiz);

  if (!validation.isValid) {
    throw new Error(validation.errors.join("\n"));
  }

  await updateDoc(doc(db, "curatedQuizzes", quiz.id), {
    status: "published",
    lifecycleStatus: "published",
    lifecycleLogs: [
      ...(quiz.lifecycleLogs ?? []),
      getLifecycleLogEntry({
        note: `${quiz.title} was published.`,
        status: "published",
        user,
      }),
    ].slice(-25),
    publishSnapshot: {
      publishedAt: new Date().toISOString(),
      publishedByUid: user.uid,
      statusBeforePublish: quiz.lifecycleStatus,
    },
    publishedAt: serverTimestamp(),
    archivedAt: null,
    updatedAt: serverTimestamp(),
  });

  await createAdminActivityLog({
    actionType: "quiz-published",
    details: `${quiz.title} was published.`,
    quizId: quiz.id,
    user,
  });
}

export async function unpublishQuiz(
  quiz: CuratedQuiz,
  user: Pick<User, "uid" | "email">
) {
  await updateDoc(doc(db, "curatedQuizzes", quiz.id), {
    status: "ready-for-review",
    lifecycleStatus: "edited",
    lifecycleLogs: [
      ...(quiz.lifecycleLogs ?? []),
      getLifecycleLogEntry({
        note: `${quiz.title} was moved back to review.`,
        status: "edited",
        user,
      }),
    ].slice(-25),
    publishedAt: null,
    updatedAt: serverTimestamp(),
  });

  await createAdminActivityLog({
    actionType: "quiz-unpublished",
    details: `${quiz.title} was moved back to review.`,
    quizId: quiz.id,
    user,
  });
}

export async function archiveQuiz(
  quiz: CuratedQuiz,
  user: Pick<User, "uid" | "email">
) {
  await updateDoc(doc(db, "curatedQuizzes", quiz.id), {
    status: "archived",
    lifecycleLogs: [
      ...(quiz.lifecycleLogs ?? []),
      getLifecycleLogEntry({
        note: `${quiz.title} was archived.`,
        status: quiz.lifecycleStatus ?? "edited",
        user,
      }),
    ].slice(-25),
    archivedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await createAdminActivityLog({
    actionType: "quiz-archived",
    details: `${quiz.title} was archived.`,
    quizId: quiz.id,
    user,
  });
}

export async function deleteDraft(
  quiz: CuratedQuiz,
  user: Pick<User, "uid" | "email">
) {
  if (quiz.status === "published") {
    throw new Error("Published quizzes must be unpublished before deletion.");
  }

  await deleteDoc(doc(db, "curatedQuizzes", quiz.id));

  await createAdminActivityLog({
    actionType: "draft-deleted",
    details: `${quiz.title} was deleted.`,
    quizId: quiz.id,
    user,
  });
}
