import {
  QUIZ_PRESETS,
  calculateMasteryByCategory,
  checkLevelUnlocks,
  getUnlockedQuizIds,
  type LearningNotification,
  type PersistedQuizPracticeRecommendation,
  type QuizScoreRecord,
} from "@/src/data/quiz";
import { getVocabularyItem } from "@/src/data/vocabulary";
import { sanitizeLessonCheckpoints } from "./lesson-checkpoints";
import type {
  ActiveQuizProgressDraft,
  LearnerActivity,
  LearnerStageId,
  LearnerProgressState,
  MasteredTopicRecord,
  SavedQuizQuestionResponse,
  TopicStageAttemptProgress,
  TopicStageProgress,
  WorldProgressRecord,
} from "@/src/domain/entities/learner-progress";

export const DEFAULT_UNLOCKED_QUIZ_IDS = QUIZ_PRESETS.filter(
  (quiz) => quiz.curriculumLevel === 1 && !quiz.unlockRequirements
).map((quiz) => quiz.id);

export const DEFAULT_PROGRESS: LearnerProgressState = {
  lessonCheckpoints: {},
  resetAt: null,
  isTestAccount: false,
  unlockAllQuizzes: false,
  totalXp: 0,
  streak: 0,
  streakDays: 0,
  lastActiveDate: null,
  currentLevel: 1,
  unlockedLevels: [1],
  viewedWords: [],
  viewedWordIds: [],
  viewedSpecificWords: [],
  viewedLetters: {},
  viewedCategories: [],
  completedLessons: [],
  completedStagesByTopic: {},
  stageAttemptsByTopic: {},
  claimedWorldRewardIds: [],
  masteredTopics: {},
  unlockedTopics: [],
  worldProgress: {},
  completedQuizzes: [],
  completedQuizIds: [],
  completedQuizCountByLevel: {},
  completedQuizCountByCategory: {
    linguistic: 0,
    mixed: 0,
    numeric: 0,
  },
  perfectQuizIds: [],
  quizScores: {},
  masteryByCategory: {
    linguistic: 0,
    mixed: 0,
    numeric: 0,
  },
  badges: [],
  achievements: [],
  correctAnswersTotal: 0,
  unlockedQuizIds: DEFAULT_UNLOCKED_QUIZ_IDS,
  notifications: [],
  notifiedUnlockEventIds: [],
  practiceRecommendations: [],
  recentActivity: [],
  activeQuizDrafts: {},
};

function sanitizeStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

const LEARNER_STAGE_IDS: LearnerStageId[] = [
  "discover",
  "explore",
  "interact",
  "practice",
  "challenge",
  "reward",
  "progress",
  "mastery",
];

function isLearnerStageId(value: unknown): value is LearnerStageId {
  return typeof value === "string" && LEARNER_STAGE_IDS.includes(value as LearnerStageId);
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function filterKnownVocabularyIds(values: string[]) {
  return unique(values).filter((wordId) => !!getVocabularyItem(wordId));
}

function normalizeWordKey(word: string) {
  return word.trim().toLowerCase().replace(/\s+/g, " ");
}

function sanitizeNumberRecord(value: unknown) {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value).reduce<Record<string, number>>((record, [key, item]) => {
    if (typeof item === "number" && item >= 0) {
      record[key] = item;
    }

    return record;
  }, {});
}

export function getLearnerAccessFlags(raw: unknown) {
  if (!raw || typeof raw !== "object") {
    return {
      isTestAccount: false,
      unlockAllQuizzes: false,
    };
  }

  const candidate = raw as Partial<LearnerProgressState> & {
    learnerProgress?: Partial<LearnerProgressState>;
  };

  return {
    isTestAccount:
      candidate.isTestAccount === true ||
      candidate.learnerProgress?.isTestAccount === true,
    unlockAllQuizzes:
      candidate.unlockAllQuizzes === true ||
      candidate.learnerProgress?.unlockAllQuizzes === true,
  };
}

export function withLearnerAccessFlags(
  progress: LearnerProgressState,
  flags: Pick<LearnerProgressState, "isTestAccount" | "unlockAllQuizzes">
) {
  return recomputeDerivedProgress({
    ...progress,
    ...flags,
  });
}

export function getPersistableLearnerProgress(progress: LearnerProgressState) {
  const { isTestAccount, unlockAllQuizzes, ...persistableProgress } = progress;

  return persistableProgress;
}

function sanitizeNotification(value: unknown): LearningNotification | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<LearningNotification>;

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.eventId !== "string" ||
    typeof candidate.title !== "string" ||
    typeof candidate.message !== "string" ||
    typeof candidate.timestamp !== "string" ||
    typeof candidate.type !== "string"
  ) {
    return null;
  }

  return {
    id: candidate.id,
    eventId: candidate.eventId,
    type: candidate.type,
    title: candidate.title,
    message: candidate.message,
    timestamp: candidate.timestamp,
    read: typeof candidate.read === "boolean" ? candidate.read : false,
    icon: candidate.icon,
  } as LearningNotification;
}

function sanitizePracticeRecommendation(
  value: unknown
): PersistedQuizPracticeRecommendation | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<PersistedQuizPracticeRecommendation>;

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.sourceQuizId !== "string" ||
    typeof candidate.sourceQuizTitle !== "string" ||
    typeof candidate.createdAt !== "string" ||
    typeof candidate.message !== "string"
  ) {
    return null;
  }

  return {
    category:
      candidate.category === "numeric" || candidate.category === "mixed"
        ? candidate.category
        : "linguistic",
    createdAt: candidate.createdAt,
    curriculumLevel:
      typeof candidate.curriculumLevel === "number" ? candidate.curriculumLevel : 1,
    id: candidate.id,
    message: candidate.message,
    missedQuestionIds: sanitizeStringArray(candidate.missedQuestionIds),
    percentage:
      typeof candidate.percentage === "number" ? candidate.percentage : 0,
    recommendedQuizIds: sanitizeStringArray(candidate.recommendedQuizIds),
    reviewOnlyQuizIds: sanitizeStringArray(candidate.reviewOnlyQuizIds),
    recommendedWordIds: sanitizeStringArray(candidate.recommendedWordIds),
    sourceQuizId: candidate.sourceQuizId,
    sourceQuizTitle: candidate.sourceQuizTitle,
  };
}

export function sanitizeLearnerActivity(value: unknown): LearnerActivity | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<LearnerActivity>;

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.title !== "string" ||
    typeof candidate.detail !== "string" ||
    typeof candidate.xpEarned !== "number" ||
    typeof candidate.occurredAt !== "string" ||
    candidate.type !== "word" &&
    candidate.type !== "quiz" &&
    candidate.type !== "reward" &&
    candidate.type !== "stage" &&
    candidate.type !== "mastery"
  ) {
    return null;
  }

  return candidate as LearnerActivity;
}

function sanitizeCompletedStagesByTopic(value: unknown) {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value).reduce<Record<string, TopicStageProgress>>(
    (records, [topicId, item]) => {
      if (!item || typeof item !== "object") {
        return records;
      }

      const candidate = item as Partial<TopicStageProgress>;
      const completedStages = Array.isArray(candidate.completedStages)
        ? candidate.completedStages.filter(isLearnerStageId)
        : [];

      if (!topicId || !completedStages.length) {
        return records;
      }

      records[topicId] = {
        completedStages: unique(completedStages).filter(isLearnerStageId),
        currentStage: isLearnerStageId(candidate.currentStage)
          ? candidate.currentStage
          : completedStages.at(-1) ?? "discover",
        lastCompletedAt:
          typeof candidate.lastCompletedAt === "string"
            ? candidate.lastCompletedAt
            : new Date().toISOString(),
        topicMasteryPercent:
          typeof candidate.topicMasteryPercent === "number"
            ? Math.max(0, Math.min(100, candidate.topicMasteryPercent))
            : Math.round((unique(completedStages).length / LEARNER_STAGE_IDS.length) * 100),
        topicId:
          typeof candidate.topicId === "string" && candidate.topicId
            ? candidate.topicId
            : topicId,
        ...(typeof candidate.worldId === "string" && candidate.worldId
          ? { worldId: candidate.worldId }
          : {}),
      };

      return records;
    },
    {}
  );
}

function sanitizeStageAttemptsByTopic(value: unknown) {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value).reduce<Record<string, TopicStageAttemptProgress>>(
    (records, [topicId, item]) => {
      if (!item || typeof item !== "object") {
        return records;
      }

      const candidate = item as Partial<TopicStageAttemptProgress>;
      const lastStage = isLearnerStageId(candidate.lastStage)
        ? candidate.lastStage
        : "challenge";

      records[topicId] = {
        attempts:
          typeof candidate.attempts === "number" && candidate.attempts >= 0
            ? Math.floor(candidate.attempts)
            : 0,
        lastAttemptAt:
          typeof candidate.lastAttemptAt === "string"
            ? candidate.lastAttemptAt
            : new Date().toISOString(),
        lastStage,
        needsRemediation: candidate.needsRemediation === true,
        topicId:
          typeof candidate.topicId === "string" && candidate.topicId
            ? candidate.topicId
            : topicId,
        ...(typeof candidate.worldId === "string" && candidate.worldId
          ? { worldId: candidate.worldId }
          : {}),
      };

      return records;
    },
    {}
  );
}

function sanitizeMasteredTopics(value: unknown) {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value).reduce<Record<string, MasteredTopicRecord>>(
    (records, [topicId, item]) => {
      if (!item || typeof item !== "object") {
        return records;
      }

      const candidate = item as Partial<MasteredTopicRecord>;

      if (!topicId) {
        return records;
      }

      records[topicId] = {
        masteredAt:
          typeof candidate.masteredAt === "string"
            ? candidate.masteredAt
            : new Date().toISOString(),
        masteryPercent:
          typeof candidate.masteryPercent === "number"
            ? Math.max(0, Math.min(100, candidate.masteryPercent))
            : 100,
        ...(typeof candidate.nextUnlockedTopicId === "string" && candidate.nextUnlockedTopicId
          ? { nextUnlockedTopicId: candidate.nextUnlockedTopicId }
          : {}),
        rewardClaimed: candidate.rewardClaimed !== false,
        topicId:
          typeof candidate.topicId === "string" && candidate.topicId
            ? candidate.topicId
            : topicId,
        ...(typeof candidate.worldId === "string" && candidate.worldId
          ? { worldId: candidate.worldId }
          : {}),
      };

      return records;
    },
    {}
  );
}

function sanitizeWorldProgress(value: unknown) {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value).reduce<Record<string, WorldProgressRecord>>(
    (records, [worldId, item]) => {
      if (!item || typeof item !== "object") {
        return records;
      }

      const candidate = item as Partial<WorldProgressRecord>;

      if (!worldId) {
        return records;
      }

      records[worldId] = {
        completedTopicCount:
          typeof candidate.completedTopicCount === "number"
            ? Math.max(0, Math.floor(candidate.completedTopicCount))
            : 0,
        masteredTopicCount:
          typeof candidate.masteredTopicCount === "number"
            ? Math.max(0, Math.floor(candidate.masteredTopicCount))
            : 0,
        percent:
          typeof candidate.percent === "number"
            ? Math.max(0, Math.min(100, candidate.percent))
            : 0,
        updatedAt:
          typeof candidate.updatedAt === "string"
            ? candidate.updatedAt
            : new Date().toISOString(),
        worldId:
          typeof candidate.worldId === "string" && candidate.worldId
            ? candidate.worldId
            : worldId,
      };

      return records;
    },
    {}
  );
}

function sanitizeSavedQuizResponse(value: unknown): SavedQuizQuestionResponse | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<SavedQuizQuestionResponse>;

  if (
    typeof candidate.answer !== "string" ||
    typeof candidate.correct !== "boolean" ||
    typeof candidate.correctAnswer !== "string" ||
    typeof candidate.prompt !== "string" ||
    typeof candidate.questionId !== "string"
  ) {
    return null;
  }

  return {
    answer: candidate.answer,
    correct: candidate.correct,
    correctAnswer: candidate.correctAnswer,
    prompt: candidate.prompt,
    questionId: candidate.questionId,
  };
}

function sanitizeActiveQuizDraft(value: unknown): ActiveQuizProgressDraft | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<ActiveQuizProgressDraft>;

  if (
    typeof candidate.quizId !== "string" ||
    typeof candidate.questionIndex !== "number" ||
    typeof candidate.score !== "number" ||
    typeof candidate.total !== "number" ||
    typeof candidate.savedAt !== "string"
  ) {
    return null;
  }

  const total = Math.max(1, Math.floor(candidate.total));
  const questionIndex = Math.max(
    0,
    Math.min(total - 1, Math.floor(candidate.questionIndex))
  );

  return {
    answerInput: typeof candidate.answerInput === "string" ? candidate.answerInput : "",
    isReviewOnly: candidate.isReviewOnly === true,
    mistakes: sanitizeStringArray(candidate.mistakes),
    questionIndex,
    quizId: candidate.quizId,
    responses: Array.isArray(candidate.responses)
      ? candidate.responses
          .map(sanitizeSavedQuizResponse)
          .filter((item): item is SavedQuizQuestionResponse => item !== null)
      : [],
    savedAt: candidate.savedAt,
    score: Math.max(0, Math.floor(candidate.score)),
    total,
  };
}

function sanitizeActiveQuizDrafts(value: unknown) {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value).reduce<Record<string, ActiveQuizProgressDraft>>(
    (drafts, [quizId, draft]) => {
      const sanitizedDraft = sanitizeActiveQuizDraft(draft);

      if (sanitizedDraft && sanitizedDraft.quizId === quizId) {
        drafts[quizId] = sanitizedDraft;
      }

      return drafts;
    },
    {}
  );
}

function deriveViewedLetters(viewedWordIds: string[]) {
  return viewedWordIds.reduce<Record<string, number>>((letters, wordId) => {
    const vocabularyItem = getVocabularyItem(wordId);
    const firstLetter = vocabularyItem?.word.trim().charAt(0).toUpperCase();

    if (firstLetter) {
      letters[firstLetter] = (letters[firstLetter] ?? 0) + 1;
    }

    return letters;
  }, {});
}

function deriveViewedSpecificWords(viewedWordIds: string[]) {
  return unique(
    viewedWordIds
      .map((wordId) => getVocabularyItem(wordId)?.word)
      .filter((word): word is string => typeof word === "string")
      .map(normalizeWordKey)
  );
}

function deriveQuizCounts(completedQuizIds: string[]) {
  const completedQuizCountByCategory: LearnerProgressState["completedQuizCountByCategory"] = {
    linguistic: 0,
    mixed: 0,
    numeric: 0,
  };
  const completedQuizCountByLevel: Record<number, number> = {};

  completedQuizIds.forEach((quizId) => {
    const quiz = QUIZ_PRESETS.find((preset) => preset.id === quizId);

    if (!quiz) {
      return;
    }

    completedQuizCountByCategory[quiz.category] += 1;
    completedQuizCountByLevel[quiz.curriculumLevel] =
      (completedQuizCountByLevel[quiz.curriculumLevel] ?? 0) + 1;
  });

  return {
    completedQuizCountByCategory,
    completedQuizCountByLevel,
  };
}

export function recomputeDerivedProgress(progress: LearnerProgressState) {
  const completedQuizIds = unique([
    ...progress.completedQuizIds,
    ...progress.completedQuizzes,
  ]);
  const viewedWordIds = unique([...progress.viewedWordIds, ...progress.viewedWords]);
  const viewedSpecificWords = unique([
    ...(progress.viewedSpecificWords ?? []).map(normalizeWordKey),
    ...deriveViewedSpecificWords(viewedWordIds),
  ]);
  const quizCounts = deriveQuizCounts(completedQuizIds);
  const baseProgress = {
    ...progress,
    completedQuizIds,
    completedQuizzes: completedQuizIds,
    viewedWordIds,
    viewedWords: viewedWordIds,
    viewedSpecificWords,
    viewedLetters: deriveViewedLetters(viewedWordIds),
    ...quizCounts,
  };
  const progressWithMastery = {
    ...baseProgress,
    masteryByCategory: calculateMasteryByCategory(baseProgress),
  };
  const progressWithLevels = {
    ...progressWithMastery,
    ...checkLevelUnlocks(progressWithMastery),
  };

  return {
    ...progressWithLevels,
    unlockedQuizIds: getUnlockedQuizIds(progressWithLevels),
  };
}

function sanitizeQuizScores(raw: unknown) {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  return Object.entries(raw).reduce<Record<string, QuizScoreRecord>>(
    (scores, [quizId, value]) => {
      if (!value || typeof value !== "object") {
        return scores;
      }

      const score = value as Partial<QuizScoreRecord>;

      if (
        typeof score.score !== "number" ||
        typeof score.total !== "number" ||
        typeof score.percentage !== "number"
      ) {
        return scores;
      }

      scores[quizId] = {
        attempts:
          typeof score.attempts === "number" && score.attempts > 0
            ? score.attempts
            : 1,
        bestPercentage:
          typeof score.bestPercentage === "number"
            ? score.bestPercentage
            : score.percentage,
        bestScore: typeof score.bestScore === "number" ? score.bestScore : score.score,
        category:
          score.category === "numeric" ||
          score.category === "linguistic" ||
          score.category === "mixed"
            ? score.category
            : "linguistic",
        curriculumLevel:
          typeof score.curriculumLevel === "number" ? score.curriculumLevel : 1,
        lastCompletedAt:
          typeof score.lastCompletedAt === "string"
            ? score.lastCompletedAt
            : new Date().toISOString(),
        percentage: score.percentage,
        score: score.score,
        total: score.total,
      };

      return scores;
    },
    {}
  );
}

export function sanitizeLearnerProgress(raw: unknown): LearnerProgressState {
  if (!raw || typeof raw !== "object") {
    return DEFAULT_PROGRESS;
  }

  const candidate = raw as Partial<LearnerProgressState>;
  const viewedWords = filterKnownVocabularyIds([
    ...sanitizeStringArray(candidate.viewedWords),
    ...sanitizeStringArray(candidate.viewedWordIds),
  ]);
  const viewedSpecificWords = unique([
    ...sanitizeStringArray(candidate.viewedSpecificWords).map(normalizeWordKey),
    ...deriveViewedSpecificWords(viewedWords),
  ]);
  const completedQuizzes = unique([
    ...sanitizeStringArray(candidate.completedQuizzes),
    ...sanitizeStringArray(candidate.completedQuizIds),
  ]);
  const streak =
    typeof candidate.streak === "number" && candidate.streak >= 0
      ? candidate.streak
      : 0;
  const streakDays =
    typeof candidate.streakDays === "number" && candidate.streakDays >= 0
      ? candidate.streakDays
      : streak;

  return recomputeDerivedProgress({
    ...DEFAULT_PROGRESS,
    ...getLearnerAccessFlags(candidate),
    totalXp:
      typeof candidate.totalXp === "number" && candidate.totalXp >= 0
        ? candidate.totalXp
        : 0,
    streak,
    streakDays,
    lastActiveDate:
      typeof candidate.lastActiveDate === "string" ? candidate.lastActiveDate : null,
    currentLevel:
      typeof candidate.currentLevel === "number" && candidate.currentLevel >= 1
        ? candidate.currentLevel
        : 1,
    unlockedLevels: Array.isArray(candidate.unlockedLevels)
      ? candidate.unlockedLevels.filter(
          (item): item is number => typeof item === "number" && item >= 1
        )
      : [1],
    viewedWords,
    viewedWordIds: viewedWords,
    viewedSpecificWords,
    viewedLetters: sanitizeNumberRecord(candidate.viewedLetters),
    viewedCategories: sanitizeStringArray(candidate.viewedCategories),
    completedLessons: sanitizeStringArray(candidate.completedLessons),
    completedStagesByTopic: sanitizeCompletedStagesByTopic(
      candidate.completedStagesByTopic
    ),
    stageAttemptsByTopic: sanitizeStageAttemptsByTopic(
      candidate.stageAttemptsByTopic
    ),
    claimedWorldRewardIds: sanitizeStringArray(candidate.claimedWorldRewardIds),
    masteredTopics: sanitizeMasteredTopics(candidate.masteredTopics),
    unlockedTopics: sanitizeStringArray(candidate.unlockedTopics),
    worldProgress: sanitizeWorldProgress(candidate.worldProgress),
    completedQuizzes,
    completedQuizIds: completedQuizzes,
    perfectQuizIds: sanitizeStringArray(candidate.perfectQuizIds),
    quizScores: sanitizeQuizScores(candidate.quizScores),
    badges: sanitizeStringArray(candidate.badges),
    achievements: sanitizeStringArray(candidate.achievements),
    correctAnswersTotal:
      typeof candidate.correctAnswersTotal === "number" &&
      candidate.correctAnswersTotal >= 0
        ? candidate.correctAnswersTotal
        : 0,
    notifications: Array.isArray(candidate.notifications)
      ? candidate.notifications
          .map(sanitizeNotification)
          .filter((item): item is LearningNotification => item !== null)
      : [],
    notifiedUnlockEventIds: sanitizeStringArray(candidate.notifiedUnlockEventIds),
    practiceRecommendations: Array.isArray(candidate.practiceRecommendations)
      ? candidate.practiceRecommendations
          .map(sanitizePracticeRecommendation)
          .filter(
            (item): item is PersistedQuizPracticeRecommendation => item !== null
          )
      : [],
    recentActivity: Array.isArray(candidate.recentActivity)
      ? candidate.recentActivity
          .map(sanitizeLearnerActivity)
          .filter((item): item is LearnerActivity => item !== null)
      : [],
    activeQuizDrafts: sanitizeActiveQuizDrafts(candidate.activeQuizDrafts),
    lessonCheckpoints: sanitizeLessonCheckpoints(candidate.lessonCheckpoints),
    resetAt: typeof candidate.resetAt === "string" && Number.isFinite(Date.parse(candidate.resetAt)) ? candidate.resetAt : null,
  });
}
