import type { Ionicons } from "@expo/vector-icons";

import type { VocabularyCategory, VocabularySubcategory } from "@/src/data/vocabulary";
import type { LearnerGradeLevel } from "@/src/types/user";

export type QuizCategory = "numeric" | "linguistic" | "mixed";

export type LearningNotificationType =
  | "quiz"
  | "badge"
  | "achievement"
  | "level"
  | "mastery"
  | "streak";

export type QuizDifficulty = "beginner" | "easy" | "medium" | "advanced" | "mastery";

export type QuizQuestionType =
  | "multipleChoice"
  | "fillBlank"
  | "matching"
  | "speechToText"
  | "textToSpeech"
  | "dragDrop"
  | "ordering"
  | "imageChoice"
  | "audioChoice"
  | "trueFalse"
  | "wordProblem"
  | "timedChallenge";

export type QuizType =
  | "multiple-choice"
  | "number-matching"
  | "fill-in-the-blank"
  | "ordering-numbers"
  | "true-or-false"
  | "image-to-number"
  | "number-to-word"
  | "counting-objects"
  | "audio-number-recognition"
  | "timed-quick-answer"
  | "matching-type"
  | "word-to-image"
  | "image-to-word"
  | "speech-to-text"
  | "text-to-speech"
  | "drag-and-drop-sentence"
  | "synonym-antonym"
  | "definition-matching"
  | "spelling"
  | "context-sentence"
  | "word-problem"
  | "listen-and-choose"
  | "read-and-count"
  | "image-based-question"
  | "word-quantity-matching"
  | "missing-word-number"
  | "story-comprehension"
  | "multi-step-challenge"
  | "timed-mastery-challenge"
  | "review-boss";

export type QuizAnswer = string | string[];

export type QuizQuestionInteractionType =
  | "tap-choice"
  | "typed-answer"
  | "tap-or-drag-match"
  | "drag-sequence"
  | "audio-choice"
  | "speech-response"
  | "image-choice"
  | "story-choice";

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  answer: QuizAnswer;
  interactionType?: QuizQuestionInteractionType;
  options?: string[];
  helperText?: string;
  imageLabel?: string;
  audioText?: string;
  wordBank?: string[];
  pairs?: {
    left: string;
    right: string;
    leftType?: "text" | "word" | "image";
    rightType?: "text" | "word" | "image";
    word?: string;
    imagePrompt?: string;
    altText?: string;
    assetId?: string;
  }[];
}

export interface UnlockRequirements {
  requiredLevel?: number;
  requiredViewedSpecificWords?: string[];
  requiredViewedWords?: number;
  requiredViewedWordIds?: string[];
  requiredViewedLetters?: Partial<Record<string, number>>;
  requiredDistinctViewedLetters?: number;
  requiredViewedCategories?: Partial<Record<VocabularyCategory | VocabularySubcategory | string, number>>;
  requiredViewedCategoryCount?: number;
  requiredCompletedLessons?: string[];
  requiredCompletedQuizCount?: number;
  requiredCompletedQuizzes?: string[];
  requiredCompletedQuizIds?: string[];
  requiredCompletedQuizCountByLevel?: Partial<Record<number, number>>;
  requiredCompletedQuizCountByType?: Partial<Record<QuizType, number>>;
  requiredAverageScore?: number;
  requiredAverageScoreByCategory?: Partial<Record<QuizCategory, number>>;
  requiredAverageScoreByLevel?: Partial<Record<number, number>>;
  requiredAverageScoreByType?: Partial<Record<QuizType, number>>;
  requiredMinimumScores?: Record<string, number>;
  requiredQuizTypeMinimumScores?: Partial<Record<QuizType, number>>;
  requiredMasteryPercentage?: number;
  requiredMasteryByCategory?: Partial<Record<QuizCategory, number>>;
  requiredOverallMastery?: number;
  requiredUnlockedLevels?: number[];
  requiredCompletedQuizCountByCategory?: Partial<Record<QuizCategory, number>>;
  requiredBadges?: string[];
  requiredBadgeCount?: number;
  requiredAchievements?: string[];
  requiredPerfectQuizCount?: number;
  requiredCorrectAnswersTotal?: number;
  requiredStreakDays?: number;
}

export interface QuizRewards {
  xp: number;
  badge?: string;
  mastery?: boolean;
  nextUnlockId?: string;
  rankProgress?: number;
  rewardProgress?: number;
  stars?: number;
  unlockMessage?: string;
}

export interface QuizPreset {
  id: string;
  title: string;
  description: string;
  category: QuizCategory;
  quizType: QuizType;
  curriculumLevel: number;
  difficulty: QuizDifficulty;
  learnerLevel?: LearnerGradeLevel;
  playMap?: {
    assetId?: string;
    gradeLevel?: LearnerGradeLevel;
    node?: number;
    phase?: string;
    topicId?: string;
    worldId?: string;
  };
  questions: QuizQuestion[];
  unlockRequirements?: UnlockRequirements;
  rewards: QuizRewards;
}

export interface QuizCategoryMeta {
  accentColor: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

export interface CurriculumQuizLevel {
  id: number;
  title: string;
  focus: string;
  summary: string;
  unlockRequirements?: UnlockRequirements;
  isAdvanced?: boolean;
}

export interface QuizScoreRecord {
  attempts: number;
  bestPercentage: number;
  bestScore: number;
  category: QuizCategory;
  curriculumLevel: number;
  lastCompletedAt: string;
  percentage: number;
  score: number;
  total: number;
}

export interface LearningNotification {
  id: string;
  eventId: string;
  type: LearningNotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export interface QuizResultSummary {
  percentage: number;
  score: number;
  total: number;
}

export interface SpecificWordProgressItem {
  id: string;
  word: string;
  vocabularyItemId?: string;
  viewed: boolean;
  statusText: string;
}
