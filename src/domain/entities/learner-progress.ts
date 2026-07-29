import type {
  LearningNotification,
  PersistedQuizPracticeRecommendation,
  QuizCategory,
  QuizScoreRecord,
} from "@/src/data/quiz";

export interface LearnerActivity {
  id: string;
  type: "word" | "quiz" | "reward" | "stage" | "mastery";
  title: string;
  detail: string;
  xpEarned: number;
  occurredAt: string;
}

export type LearnerStageId =
  | "discover"
  | "explore"
  | "interact"
  | "practice"
  | "challenge"
  | "reward"
  | "progress"
  | "mastery";

export interface TopicStageProgress {
  completedStages: LearnerStageId[];
  currentStage: LearnerStageId;
  lastCompletedAt: string;
  topicMasteryPercent: number;
  topicId: string;
  worldId?: string;
}

export interface TopicStageAttemptProgress {
  attempts: number;
  lastAttemptAt: string;
  lastStage: LearnerStageId;
  needsRemediation: boolean;
  topicId: string;
  worldId?: string;
}

export interface MasteredTopicRecord {
  masteredAt: string;
  masteryPercent: number;
  nextUnlockedTopicId?: string;
  rewardClaimed: boolean;
  topicId: string;
  worldId?: string;
}

export interface WorldProgressRecord {
  completedTopicCount: number;
  masteredTopicCount: number;
  percent: number;
  updatedAt: string;
  worldId: string;
}

export interface SavedQuizQuestionResponse {
  answer: string;
  correct: boolean;
  correctAnswer: string;
  prompt: string;
  questionId: string;
}

export interface ActiveQuizProgressDraft {
  answerInput: string;
  isReviewOnly: boolean;
  mistakes: string[];
  questionIndex: number;
  quizId: string;
  responses: SavedQuizQuestionResponse[];
  savedAt: string;
  score: number;
  total: number;
}

export interface LearnerProgressState {
  isTestAccount: boolean;
  unlockAllQuizzes: boolean;
  totalXp: number;
  streak: number;
  streakDays: number;
  lastActiveDate: string | null;
  currentLevel: number;
  unlockedLevels: number[];
  viewedWords: string[];
  viewedWordIds: string[];
  viewedSpecificWords: string[];
  viewedLetters: Record<string, number>;
  viewedCategories: string[];
  completedLessons: string[];
  completedStagesByTopic: Record<string, TopicStageProgress>;
  stageAttemptsByTopic: Record<string, TopicStageAttemptProgress>;
  claimedWorldRewardIds: string[];
  masteredTopics: Record<string, MasteredTopicRecord>;
  unlockedTopics: string[];
  worldProgress: Record<string, WorldProgressRecord>;
  completedQuizzes: string[];
  completedQuizIds: string[];
  completedQuizCountByLevel: Record<number, number>;
  completedQuizCountByCategory: Record<QuizCategory, number>;
  perfectQuizIds: string[];
  quizScores: Record<string, QuizScoreRecord>;
  masteryByCategory: Record<QuizCategory, number>;
  badges: string[];
  achievements: string[];
  correctAnswersTotal: number;
  unlockedQuizIds: string[];
  notifications: LearningNotification[];
  notifiedUnlockEventIds: string[];
  practiceRecommendations: PersistedQuizPracticeRecommendation[];
  recentActivity: LearnerActivity[];
  activeQuizDrafts: Record<string, ActiveQuizProgressDraft>;
}

export interface QuizCompletionInput {
  quizId: string;
  title: string;
  category: QuizCategory | string;
  score: number;
  total: number;
  curriculumLevel?: number;
  practiceRecommendation?: PersistedQuizPracticeRecommendation | null;
  rewardsXp?: number;
}

export interface WorldRewardInput {
  rewardId: string;
  title: string;
  xp: number;
}

export interface LessonStageCompletionInput {
  stage: LearnerStageId;
  title: string;
  topicId: string;
  worldId?: string;
  xp?: number;
}

export interface LessonStageAttemptInput {
  maxAttempts?: number;
  stage: LearnerStageId;
  topicId: string;
  worldId?: string;
}

export interface ClearLessonStageAttemptsInput {
  topicId: string;
}

export interface TopicMasteryInput {
  nextUnlockedTopicId?: string;
  title: string;
  topicId: string;
  worldId?: string;
  xp?: number;
}

export interface SaveQuizDraftInput {
  answerInput: string;
  isReviewOnly: boolean;
  mistakes: string[];
  questionIndex: number;
  quizId: string;
  responses: SavedQuizQuestionResponse[];
  score: number;
  total: number;
}
