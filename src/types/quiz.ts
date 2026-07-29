import type {
  QuizCategory,
  QuizDifficulty,
  QuizRewards,
  UnlockRequirements,
} from "@/src/data/quiz/types";
import {
  LEARNER_GRADE_LEVELS,
  type LearnerGradeLevel,
} from "@/src/types/user";
import type { ActiveLearningPhase } from "@/src/data/curriculum/learning-path";

export const QUIZ_LAYOUT_TYPES = [
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
] as const;

export type QuizLayoutType = (typeof QUIZ_LAYOUT_TYPES)[number];
export type MatchingQuizLayoutType = "matching" | "image-to-word" | "word-to-image";
export type ChoiceBasedQuizLayoutType = Exclude<
  QuizLayoutType,
  "fill-in-the-blank" | MatchingQuizLayoutType
>;

export const QUIZ_INTERACTION_TYPES = [
  "tap-choice",
  "typed-answer",
  "tap-or-drag-match",
  "drag-sequence",
  "audio-choice",
  "speech-response",
  "image-choice",
  "story-choice",
] as const;

export type QuizInteractionType = (typeof QUIZ_INTERACTION_TYPES)[number];

export const LEARNER_LEVELS = LEARNER_GRADE_LEVELS;

export type LearnerLevel = LearnerGradeLevel;

const LEGACY_LEARNER_LEVEL_MAP = {
  starter: "Preschool",
  beginner: "Kindergarten",
  developing: "Grade 1",
  intermediate: "Grade 2",
  advanced: "Grade 3",
  challenge: "Grade 3",
} as const;

export function normalizeLearnerLevelValue(
  value: unknown,
  fallback: LearnerLevel = "Kindergarten"
): LearnerLevel {
  if (
    typeof value === "string" &&
    LEARNER_LEVELS.includes(value as LearnerLevel)
  ) {
    return value as LearnerLevel;
  }

  if (
    typeof value === "string" &&
    value in LEGACY_LEARNER_LEVEL_MAP
  ) {
    return LEGACY_LEARNER_LEVEL_MAP[
      value as keyof typeof LEGACY_LEARNER_LEVEL_MAP
    ];
  }

  return fallback;
}

export function getCurriculumStageForLearnerLevel(level: LearnerLevel) {
  switch (level) {
    case "Preschool":
      return 1;
    case "Kindergarten":
      return 2;
    case "Grade 1":
      return 3;
    case "Grade 2":
      return 4;
    case "Grade 3":
      return 5;
    default:
      return 2;
  }
}

export const QUESTION_REASONING_TYPES = [
  "recognition",
  "matching",
  "classification",
  "counting",
  "comparison",
  "sequencing",
  "addition",
  "short_scenario",
  "mixed_review",
] as const;

export type QuestionReasoningType = (typeof QUESTION_REASONING_TYPES)[number];

export const CURATED_QUIZ_STATUSES = [
  "draft",
  "ready-for-review",
  "published",
  "archived",
] as const;

export type CuratedQuizStatus = (typeof CURATED_QUIZ_STATUSES)[number];

export const DRAFT_LIFECYCLE_STATUSES = [
  "draft",
  "generated",
  "tested",
  "edited",
  "approved",
  "validated",
  "published",
] as const;

export type DraftLifecycleStatus = (typeof DRAFT_LIFECYCLE_STATUSES)[number];

export interface AdminDraftLifecycleLog {
  status: DraftLifecycleStatus;
  at: string | null;
  byUid?: string | null;
  note: string;
}

export interface AdminDraftPreviewSnapshot {
  checkedAt: string | null;
  checkedByUid: string | null;
  modes: string[];
  passed: boolean;
}

export interface AdminDraftApprovalSnapshot {
  approvedAt: string | null;
  approvedByUid: string | null;
  checklist: QuizReviewChecklist;
}

export interface AdminDraftValidationSnapshot {
  checkedAt: string | null;
  errors: string[];
  passed: boolean;
}

export interface AdminDraftPublishSnapshot {
  publishedAt: string | null;
  publishedByUid: string | null;
  statusBeforePublish: DraftLifecycleStatus;
}

export interface QuizReviewChecklist {
  ageAppropriate: boolean;
  objectiveClear: boolean;
  instructionsUnderstandable: boolean;
  questionsComplete: boolean;
  answersValid: boolean;
  noDuplicateQuestions: boolean;
  noBrokenMatchingPairs: boolean;
  noLowQualityAiOutput: boolean;
  topicMatchesCurriculum: boolean;
  questionCountAcceptable: boolean;
}

export const DEFAULT_REVIEW_CHECKLIST: QuizReviewChecklist = {
  ageAppropriate: false,
  objectiveClear: false,
  instructionsUnderstandable: false,
  questionsComplete: false,
  answersValid: false,
  noDuplicateQuestions: false,
  noBrokenMatchingPairs: false,
  noLowQualityAiOutput: false,
  topicMatchesCurriculum: false,
  questionCountAcceptable: false,
};

export interface QuizLayoutPreset {
  type: QuizLayoutType;
  label: string;
  helperText: string;
}

export const QUIZ_LAYOUT_PRESETS: QuizLayoutPreset[] = [
  {
    type: "multiple-choice",
    label: "Multiple Choice",
    helperText: "One question with four choices and one correct answer.",
  },
  {
    type: "fill-in-the-blank",
    label: "Fill in the Blank",
    helperText: "A sentence with a missing word. The approved word set is a hint; learners type the answer.",
  },
  {
    type: "matching",
    label: "Matching Type",
    helperText: "Learners tap or drag related pairs like word-to-picture or number-to-name.",
  },
  {
    type: "image-to-word",
    label: "Image to Word",
    helperText: "Learners match picture concepts to the correct vocabulary word interactively.",
  },
  {
    type: "word-to-image",
    label: "Word to Image",
    helperText: "Learners match vocabulary words to picture concepts or approved assets interactively.",
  },
  {
    type: "true-or-false",
    label: "True or False",
    helperText: "A quick statement with True and False choices.",
  },
  {
    type: "word-problem",
    label: "Word Problem",
    helperText: "A short story or math-language problem with answer choices.",
  },
  {
    type: "ordering",
    label: "Ordering",
    helperText: "Learners drag or tap numbers, words, or events into the correct sequence.",
  },
  {
    type: "counting-objects",
    label: "Counting Objects",
    helperText: "A picture-supported numeracy item where learners count visible objects.",
  },
  {
    type: "compare-numbers",
    label: "Compare Numbers",
    helperText: "Learners choose the bigger, smaller, or equal quantity.",
  },
  {
    type: "picture-based",
    label: "Picture Based",
    helperText: "A question built around a picture clue, label, or approved image asset.",
  },
  {
    type: "scenario",
    label: "Mini Scenario",
    helperText: "A short child-friendly situation that checks vocabulary or numeracy.",
  },
  {
    type: "text-to-speech",
    label: "Listening Prompt",
    helperText: "Learners listen to spoken text, then answer from what they heard.",
  },
  {
    type: "speech-to-text",
    label: "Speaking Prompt",
    helperText: "Learners say the expected word or phrase with microphone support.",
  },
  {
    type: "image-choice",
    label: "Image Choice",
    helperText: "A picture clue or image label with multiple answer choices.",
  },
  {
    type: "timed-challenge",
    label: "Timed Challenge",
    helperText: "A fast mastery-style question with answer choices.",
  },
];

export interface MatchingPair {
  left: string;
  right: string;
  leftType?: "text" | "word" | "image";
  rightType?: "text" | "word" | "image";
  word?: string;
  imagePrompt?: string;
  altText?: string;
  assetId?: string;
}

export interface BaseCuratedQuizQuestion {
  id: string;
  type: QuizLayoutType;
  prompt: string;
  interactionType?: QuizInteractionType;
  explanation?: string;
  learningObjective?: string;
  targetSkill?: string;
  reasoningType?: QuestionReasoningType;
  cognitiveSkill?: string;
  questionIntent?: string;
  difficultyScore?: number;
  levelFitScore?: number;
  qualityScore?: number;
  alignmentScore?: number;
  clarityScore?: number;
  depthScore?: number;
  uniquenessScore?: number;
  answerValidityScore?: number;
  ageFitScore?: number;
  levelFitExplanation?: string;
  alignmentNotes?: string;
  whyThisAnswerIsCorrect?: string;
  whyDistractorsAreWrong?: string;
  validationFlags?: string[];
  vocabularyUsed?: string[];
  sourceQuestionSeedId?: string;
  sourceVocabularyWord?: string;
}

export interface MultipleChoiceQuestion extends BaseCuratedQuizQuestion {
  type: ChoiceBasedQuizLayoutType;
  options: string[];
  answer: string;
  audioText?: string;
  helperText?: string;
  imageLabel?: string;
}

export interface FillInTheBlankQuestion extends BaseCuratedQuizQuestion {
  type: "fill-in-the-blank";
  sentence: string;
  answer: string;
  wordBank: string[];
}

export interface MatchingQuestion extends BaseCuratedQuizQuestion {
  type: MatchingQuizLayoutType;
  instruction: string;
  pairs: MatchingPair[];
}

export type CuratedQuizQuestion =
  | MultipleChoiceQuestion
  | FillInTheBlankQuestion
  | MatchingQuestion;

export interface CuratedQuizDraft {
  title: string;
  topic: string;
  ageGroup: string;
  category: QuizCategory;
  curriculumLevel: number;
  difficulty: QuizDifficulty;
  learnerLevel: LearnerLevel;
  gradeLevel?: LearnerLevel;
  worldId?: string;
  topicId?: string;
  phase?: ActiveLearningPhase;
  node?: number;
  assetId?: string;
  unlockRewardMapping?: string;
  mobilePreviewChecked?: boolean;
  previewCheckedAt?: string | null;
  previewCheckedByUid?: string | null;
  objective: string;
  instructions: string;
  notes: string;
  sourcePrompt: string;
  createdWith: "gemini" | "local-fallback";
  lifecycleStatus?: DraftLifecycleStatus;
  lifecycleLogs?: AdminDraftLifecycleLog[];
  previewSnapshot?: AdminDraftPreviewSnapshot | null;
  approvalSnapshot?: AdminDraftApprovalSnapshot | null;
  validationSnapshot?: AdminDraftValidationSnapshot | null;
  publishSnapshot?: AdminDraftPublishSnapshot | null;
  promptVersion?: string;
  modelName?: string;
  qualitySummary?: QuizQualitySummary;
  reviewChecklist?: QuizReviewChecklist;
  questionTypes: QuizLayoutType[];
  questions: CuratedQuizQuestion[];
  rewards: QuizRewards;
  unlockRequirements?: UnlockRequirements;
}

export interface QuizQualitySummary {
  overallScore: number;
  flaggedQuestionCount: number;
  duplicateRiskCount: number;
  shallowQuestionCount: number;
  unclearQuestionCount: number;
  weakDistractorCount: number;
  missingMetadataCount: number;
  skillCoverage: Record<string, number>;
  vocabularyCoverage: Record<string, number>;
  recommendations: string[];
}

export interface CuratedQuiz extends CuratedQuizDraft {
  id: string;
  status: CuratedQuizStatus;
  reviewChecklist: QuizReviewChecklist;
  createdByUid: string;
  createdByEmail: string;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
  archivedAt: string | null;
}

export interface GenerateQuizDraftInput {
  topic: string;
  adminPrompt: string;
  ageGroup: string;
  category: QuizCategory;
  curriculumLevel: number;
  difficulty: QuizDifficulty;
  learnerLevel: LearnerLevel;
  gradeLevel?: LearnerLevel;
  worldId?: string;
  topicId?: string;
  phase?: ActiveLearningPhase;
  node?: number;
  assetId?: string;
  rewardXp?: number;
  unlockRewardMapping?: string;
  objective: string;
  notes: string;
  questionCount: number;
  questionTypes: QuizLayoutType[];
  language?: string;
  mediaRequired?: "none" | "image" | "audio";
  skillTag?: string;
  vocabularyContext?: QuizGenerationVocabularyItem[];
  vocabularyMode?: "selected_topic_only" | "random_from_approved_words" | "mixed_review" | "admin_prompt_guided";
}

export interface QuizGenerationVocabularyItem {
  id: string;
  word: string;
  normalizedWord: string;
  category: QuizCategory;
  subcategory: string;
  learnerLevel: LearnerLevel;
  curriculumLevel: number;
  curriculumObjective: string;
  skillTags: string[];
  meaning: string;
  sample: string;
  clue: string;
  emoji?: string;
  imagePrompt: string;
  imageUri?: string;
  imageAssetId?: string;
  altText: string;
  status: "draft" | "ready-for-review" | "published" | "archived";
  questionSeeds: VocabularyQuestionSeed[];
}

export interface VocabularyQuestionSeed {
  id: string;
  prompt: string;
  answer: string;
  distractors: string[];
  reasoningType: QuestionReasoningType;
  learnerLevel: LearnerLevel;
  supportedQuizTypes: QuizLayoutType[];
  explanation: string;
  cognitiveSkill: string;
}
