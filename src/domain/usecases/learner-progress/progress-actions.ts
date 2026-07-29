import {
  QUIZ_PRESETS,
  awardAchievements,
  awardBadges,
  createNotification,
  getAwardDefinition,
  getLevelUnlockEvents,
  getMasteryMilestoneEvents,
  getStreakMilestoneEvents,
  preventDuplicateNotification,
  type LearningNotification,
  type QuizCategory,
} from "@/src/data/quiz";
import { getVocabularyItem } from "@/src/data/vocabulary";
import type {
  LessonStageCompletionInput,
  LessonStageAttemptInput,
  LearnerActivity,
  LearnerStageId,
  LearnerProgressState,
  QuizCompletionInput,
  TopicMasteryInput,
  WorldRewardInput,
  ClearLessonStageAttemptsInput,
} from "@/src/domain/entities/learner-progress";
import {
  DEFAULT_UNLOCKED_QUIZ_IDS,
  recomputeDerivedProgress,
} from "@/src/domain/usecases/learner-progress/progress-state";

const RECENT_ACTIVITY_LIMIT = 6;
const NOTIFICATION_LIMIT = 30;
const REQUIRED_STAGE_IDS: LearnerStageId[] = [
  "discover",
  "explore",
  "interact",
  "practice",
  "challenge",
  "reward",
  "progress",
  "mastery",
];
const MASTERY_PREREQUISITE_STAGE_IDS = REQUIRED_STAGE_IDS.filter(
  (stage) => stage !== "mastery"
);

function getDateStamp(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayDifference(previousStamp: string, nextStamp: string) {
  const previousDate = new Date(`${previousStamp}T00:00:00`);
  const nextDate = new Date(`${nextStamp}T00:00:00`);
  return Math.round(
    (nextDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizeWordKey(word: string) {
  return word.trim().toLowerCase().replace(/\s+/g, " ");
}

function applyDailyActivity(progress: LearnerProgressState) {
  const today = getDateStamp();

  if (!progress.lastActiveDate) {
    return {
      streak: 1,
      streakDays: 1,
      lastActiveDate: today,
    };
  }

  const difference = getDayDifference(progress.lastActiveDate, today);

  if (difference <= 0) {
    const streak = progress.streak || progress.streakDays || 1;
    return {
      streak,
      streakDays: streak,
      lastActiveDate: today,
    };
  }

  if (difference === 1) {
    const streak = Math.max(progress.streak, progress.streakDays) + 1;
    return {
      streak,
      streakDays: streak,
      lastActiveDate: today,
    };
  }

  return {
    streak: 1,
    streakDays: 1,
    lastActiveDate: today,
  };
}

function withRecentActivity(
  progress: LearnerProgressState,
  activity: LearnerActivity
) {
  return [activity, ...progress.recentActivity].slice(0, RECENT_ACTIVITY_LIMIT);
}

function withNotification(
  progress: LearnerProgressState,
  eventId: string,
  notification: LearningNotification
) {
  if (preventDuplicateNotification(progress, eventId)) {
    return progress;
  }

  return {
    ...progress,
    notifications: [notification, ...progress.notifications].slice(
      0,
      NOTIFICATION_LIMIT
    ),
    notifiedUnlockEventIds: [...progress.notifiedUnlockEventIds, eventId],
  };
}

function appendAwardNotifications(
  before: LearnerProgressState,
  after: LearnerProgressState
) {
  let nextProgress = after;
  const badgeIds = awardBadges(after);
  const achievementIds = awardAchievements({
    ...after,
    badges: unique([...after.badges, ...badgeIds]),
  });

  nextProgress = {
    ...nextProgress,
    badges: unique([...nextProgress.badges, ...badgeIds]),
    achievements: unique([...nextProgress.achievements, ...achievementIds]),
  };
  nextProgress = recomputeDerivedProgress(nextProgress);

  badgeIds.forEach((badgeId) => {
    const award = getAwardDefinition(badgeId);
    const eventId = `badge-${badgeId}`;
    nextProgress = withNotification(
      nextProgress,
      eventId,
      createNotification(
        "badge",
        `Badge Unlocked: ${award?.title ?? badgeId}`,
        award?.description ?? "A new badge is ready.",
        eventId
      )
    );
  });

  achievementIds.forEach((achievementId) => {
    const award = getAwardDefinition(achievementId);
    const eventId = `achievement-${achievementId}`;
    nextProgress = withNotification(
      nextProgress,
      eventId,
      createNotification(
        "achievement",
        `Achievement Earned: ${award?.title ?? achievementId}`,
        award?.description ?? "A new achievement is ready.",
        eventId
      )
    );
  });

  getLevelUnlockEvents(before, nextProgress).forEach((event) => {
    nextProgress = withNotification(
      nextProgress,
      event.eventId,
      createNotification("level", event.title, event.message, event.eventId)
    );
  });

  getMasteryMilestoneEvents(before, nextProgress).forEach((event) => {
    nextProgress = withNotification(
      nextProgress,
      event.eventId,
      createNotification("mastery", event.title, event.message, event.eventId)
    );
  });

  getStreakMilestoneEvents(before, nextProgress).forEach((event) => {
    nextProgress = withNotification(
      nextProgress,
      event.eventId,
      createNotification("streak", event.title, event.message, event.eventId)
    );
  });

  nextProgress.unlockedQuizIds
    .filter((quizId) => !before.unlockedQuizIds.includes(quizId))
    .forEach((quizId) => {
      const quiz = QUIZ_PRESETS.find((preset) => preset.id === quizId);
      const eventId = `quiz-unlocked-${quizId}`;

      if (!quiz || DEFAULT_UNLOCKED_QUIZ_IDS.includes(quizId)) {
        return;
      }

      nextProgress = withNotification(
        nextProgress,
        eventId,
        createNotification(
          "quiz",
          `New Quiz Unlocked: ${quiz.title}`,
          quiz.rewards.unlockMessage ?? `${quiz.title} is now ready to play.`,
          eventId
        )
      );
    });

  return nextProgress;
}

function finalizeProgressUpdate(
  before: LearnerProgressState,
  draft: LearnerProgressState
) {
  const recomputed = recomputeDerivedProgress(draft);
  return appendAwardNotifications(before, recomputed);
}

function withUpdatedWorldProgress(
  progress: LearnerProgressState,
  worldId?: string
) {
  if (!worldId) {
    return progress;
  }

  const completedTopicCount = Object.values(progress.completedStagesByTopic).filter(
    (record) => record.worldId === worldId
  ).length;
  const masteredTopicCount = Object.values(progress.masteredTopics).filter(
    (record) => record.worldId === worldId
  ).length;
  const percent = completedTopicCount
    ? Math.round((masteredTopicCount / completedTopicCount) * 100)
    : 0;

  return {
    ...progress,
    worldProgress: {
      ...progress.worldProgress,
      [worldId]: {
        completedTopicCount,
        masteredTopicCount,
        percent,
        updatedAt: new Date().toISOString(),
        worldId,
      },
    },
  };
}

export function claimWorldRewardUseCase(
  progress: LearnerProgressState,
  { rewardId, title, xp }: WorldRewardInput
) {
  if (progress.claimedWorldRewardIds.includes(rewardId)) {
    return progress;
  }

  const xpEarned = Math.max(0, Math.floor(xp));
  const dailyActivity = applyDailyActivity(progress);
  const draft: LearnerProgressState = {
    ...progress,
    ...dailyActivity,
    claimedWorldRewardIds: [...progress.claimedWorldRewardIds, rewardId],
    totalXp: progress.totalXp + xpEarned,
    recentActivity: withRecentActivity(progress, {
      id: `world-reward-${rewardId}-${Date.now()}`,
      type: "reward",
      title,
      detail: "World reward claimed",
      xpEarned,
      occurredAt: new Date().toISOString(),
    }),
  };

  return finalizeProgressUpdate(progress, draft);
}

export function markLessonStageCompletedUseCase(
  progress: LearnerProgressState,
  { stage, title, topicId, worldId, xp = 2 }: LessonStageCompletionInput
) {
  const currentRecord = progress.completedStagesByTopic[topicId];

  if (currentRecord?.completedStages.includes(stage)) {
    return progress;
  }

  const xpEarned = Math.max(0, Math.floor(xp));
  const completedStages = unique([
    ...(currentRecord?.completedStages ?? []),
    stage,
  ]).filter((item): item is LearnerStageId =>
    REQUIRED_STAGE_IDS.includes(item as LearnerStageId)
  );
  const dailyActivity = applyDailyActivity(progress);
  const draft: LearnerProgressState = {
    ...progress,
    ...dailyActivity,
    completedLessons: unique([...progress.completedLessons, `${topicId}:${stage}`]),
    completedStagesByTopic: {
      ...progress.completedStagesByTopic,
      [topicId]: {
        completedStages,
        currentStage: stage,
        lastCompletedAt: new Date().toISOString(),
        topicMasteryPercent: Math.round(
          (completedStages.length / REQUIRED_STAGE_IDS.length) * 100
        ),
        topicId,
        ...(worldId ? { worldId } : {}),
      },
    },
    totalXp: progress.totalXp + xpEarned,
    recentActivity: withRecentActivity(progress, {
      id: `stage-${topicId}-${stage}-${Date.now()}`,
      type: "stage",
      title,
      detail: `${stage} stage completed`,
      xpEarned,
      occurredAt: new Date().toISOString(),
    }),
  };

  return finalizeProgressUpdate(progress, withUpdatedWorldProgress(draft, worldId));
}

export function recordLessonStageAttemptUseCase(
  progress: LearnerProgressState,
  { maxAttempts = 3, stage, topicId, worldId }: LessonStageAttemptInput
) {
  const currentRecord = progress.stageAttemptsByTopic[topicId];
  const attempts = (currentRecord?.attempts ?? 0) + 1;

  return {
    ...progress,
    stageAttemptsByTopic: {
      ...progress.stageAttemptsByTopic,
      [topicId]: {
        attempts,
        lastAttemptAt: new Date().toISOString(),
        lastStage: stage,
        needsRemediation: attempts >= maxAttempts,
        topicId,
        ...(worldId ? { worldId } : {}),
      },
    },
  };
}

export function clearLessonStageAttemptsUseCase(
  progress: LearnerProgressState,
  { topicId }: ClearLessonStageAttemptsInput
) {
  if (!progress.stageAttemptsByTopic[topicId]) {
    return progress;
  }

  const nextAttempts = { ...progress.stageAttemptsByTopic };
  delete nextAttempts[topicId];

  return {
    ...progress,
    stageAttemptsByTopic: nextAttempts,
  };
}

export function markTopicMasteredUseCase(
  progress: LearnerProgressState,
  { nextUnlockedTopicId, title, topicId, worldId, xp = 12 }: TopicMasteryInput
) {
  const stageRecord = progress.completedStagesByTopic[topicId];
  const rewardClaimed = progress.claimedWorldRewardIds.includes(topicId);
  const readyForMastery = MASTERY_PREREQUISITE_STAGE_IDS.every((stage) =>
    stageRecord?.completedStages.includes(stage)
  );

  if (
    progress.masteredTopics[topicId] ||
    !rewardClaimed ||
    !readyForMastery
  ) {
    return progress;
  }

  const xpEarned = Math.max(0, Math.floor(xp));
  const dailyActivity = applyDailyActivity(progress);
  const draft: LearnerProgressState = {
    ...progress,
    ...dailyActivity,
    masteredTopics: {
      ...progress.masteredTopics,
      [topicId]: {
        masteryPercent: 100,
        masteredAt: new Date().toISOString(),
        ...(nextUnlockedTopicId ? { nextUnlockedTopicId } : {}),
        rewardClaimed,
        topicId,
        ...(worldId ? { worldId } : {}),
      },
    },
    unlockedTopics: unique([
      ...progress.unlockedTopics,
      ...(nextUnlockedTopicId ? [nextUnlockedTopicId] : []),
    ]),
    totalXp: progress.totalXp + xpEarned,
    recentActivity: withRecentActivity(progress, {
      id: `mastery-${topicId}-${Date.now()}`,
      type: "mastery",
      title,
      detail: "Topic mastered",
      xpEarned,
      occurredAt: new Date().toISOString(),
    }),
  };

  return finalizeProgressUpdate(progress, withUpdatedWorldProgress(draft, worldId));
}

export function markWordViewedUseCase(
  progress: LearnerProgressState,
  wordId: string,
  wordLabel: string,
  legacyIds: string[] = []
) {
  if (
    [wordId, ...legacyIds].some((candidateId) =>
      progress.viewedWords.includes(candidateId)
    )
  ) {
    return progress;
  }

  const xpEarned = 8;
  const dailyActivity = applyDailyActivity(progress);
  const viewedVocabulary = getVocabularyItem(wordId);
  const viewedCategories = new Set(progress.viewedCategories);

  if (viewedVocabulary) {
    viewedCategories.add(viewedVocabulary.category);
    viewedCategories.add(viewedVocabulary.subcategory);
  }

  const draft = {
    ...progress,
    ...dailyActivity,
    totalXp: progress.totalXp + xpEarned,
    viewedWords: [...progress.viewedWords, wordId],
    viewedWordIds: [...progress.viewedWordIds, wordId],
    viewedSpecificWords: unique([
      ...progress.viewedSpecificWords,
      normalizeWordKey(viewedVocabulary?.word ?? wordLabel),
    ]),
    viewedCategories: Array.from(viewedCategories),
    recentActivity: withRecentActivity(progress, {
      id: `word-${wordId}-${Date.now()}`,
      type: "word" as const,
      title: wordLabel,
      detail: "New vocabulary explored",
      xpEarned,
      occurredAt: new Date().toISOString(),
    }),
  };

  return finalizeProgressUpdate(progress, draft);
}

export function recordQuizCompletionUseCase(
  progress: LearnerProgressState,
  {
    quizId,
    title,
    category,
    score,
    total,
    curriculumLevel = 1,
    practiceRecommendation,
    rewardsXp,
  }: QuizCompletionInput
) {
  const isFirstCompletion =
    !progress.completedQuizIds.includes(quizId) &&
    !progress.completedQuizzes.includes(quizId);
  const isPerfectScore = score === total;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const previousScore = progress.quizScores[quizId];
  const baseXp = rewardsXp ?? Math.max(6, score * 3);
  const completionBonus = isFirstCompletion ? 8 : 3;
  const perfectBonus = isPerfectScore ? 5 : 0;
  const xpEarned = baseXp + completionBonus + perfectBonus;
  const dailyActivity = applyDailyActivity(progress);
  const quizCategory: QuizCategory =
    category === "numeric" || category === "linguistic" || category === "mixed"
      ? category
      : "linguistic";
  const nextQuizScores: LearnerProgressState["quizScores"] = {
    ...progress.quizScores,
    [quizId]: {
      attempts: (previousScore?.attempts ?? 0) + 1,
      bestPercentage: Math.max(previousScore?.bestPercentage ?? 0, percentage),
      bestScore: Math.max(previousScore?.bestScore ?? 0, score),
      category: quizCategory,
      curriculumLevel,
      lastCompletedAt: new Date().toISOString(),
      percentage,
      score,
      total,
    },
  };
  const nextPracticeRecommendations = practiceRecommendation
    ? [
        practiceRecommendation,
        ...progress.practiceRecommendations.filter(
          (recommendation) => recommendation.sourceQuizId !== quizId
        ),
      ].slice(0, 5)
    : progress.practiceRecommendations;
  const draft: LearnerProgressState = {
    ...progress,
    ...dailyActivity,
    activeQuizDrafts: Object.fromEntries(
      Object.entries(progress.activeQuizDrafts).filter(
        ([draftQuizId]) => draftQuizId !== quizId
      )
    ),
    totalXp: progress.totalXp + xpEarned,
    correctAnswersTotal: progress.correctAnswersTotal + score,
    quizScores: nextQuizScores,
    practiceRecommendations: nextPracticeRecommendations,
    completedQuizzes: isFirstCompletion
      ? [...progress.completedQuizzes, quizId]
      : progress.completedQuizzes,
    completedQuizIds: isFirstCompletion
      ? [...progress.completedQuizIds, quizId]
      : progress.completedQuizIds,
    perfectQuizIds:
      isPerfectScore && !progress.perfectQuizIds.includes(quizId)
        ? [...progress.perfectQuizIds, quizId]
        : progress.perfectQuizIds,
    recentActivity: withRecentActivity(progress, {
      id: `quiz-${quizId}-${Date.now()}`,
      type: "quiz",
      title,
      detail: `${quizCategory} quiz completed with ${score}/${total}`,
      xpEarned,
      occurredAt: new Date().toISOString(),
    }),
  };

  return finalizeProgressUpdate(progress, draft);
}
