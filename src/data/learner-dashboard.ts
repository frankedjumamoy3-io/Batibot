import {
  ACHIEVEMENT_DEFINITIONS,
  BADGE_DEFINITIONS,
  getAwardProgress,
  type AwardDefinition,
  type SpecificWordProgressItem,
} from "@/src/data/quiz";
import {
  getGradeQuizPresets,
  getGradeVocabularyItems,
  getLearnerModuleSummary,
} from "@/src/data/learner-module";
import { getCurriculumForGrade } from "@/src/data/curriculum/learning-path";
import type { LearnerProgressState } from "@/src/domain/entities/learner-progress";
import type { LearnerGradeLevel } from "@/src/types/user";

export type LearnerRewardStatus = "locked" | "in-progress" | "unlocked";

export type LearnerRewardGroup =
  | "achievement"
  | "badge"
  | "grade"
  | "progress"
  | "world";

export interface LearnerRewardCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  unlocked: boolean;
  type: "badge" | "achievement";
  rewardGroup: LearnerRewardGroup;
  percentage: number;
  completed: number;
  total: number;
  status: LearnerRewardStatus;
  sourceLabel: string;
  requirementText: string[];
  requiredWords: SpecificWordProgressItem[];
}

export interface LearnerWorldProgress {
  accentColor: string;
  completedStages: number;
  completedTopics: number;
  id: string;
  masteredTopics: number;
  percentage: number;
  rewardStars: number;
  title: string;
  totalStages: number;
  totalTopics: number;
  unlocked: boolean;
}

export interface LearnerDashboardSummary {
  completedGradeQuizzes: number;
  completedStages: number;
  completedWorlds: number;
  gradeLevel: LearnerGradeLevel;
  masteredTopicCount: number;
  nextWorldTitle: string;
  starsEarned: number;
  streakDays: number;
  totalGradeQuizzes: number;
  totalStages: number;
  totalTopics: number;
  totalWords: number;
  viewedGradeWords: number;
  worldCount: number;
  worldProgress: LearnerWorldProgress[];
}

export interface QuizInteractionSummaryItem {
  id: string;
  title: string;
  completed: number;
  total: number;
  percentage: number;
}

const REQUIRED_STAGE_COUNT = 8;

function clampPercentage(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

function toStatus(percentage: number): LearnerRewardStatus {
  if (percentage >= 100) {
    return "unlocked";
  }

  return percentage > 0 ? "in-progress" : "locked";
}

function getSafeTotal(total: number) {
  return Math.max(1, total);
}

function getWorldTopicRewardId(worldId: string, topicTitle: string) {
  return `${worldId}:${topicTitle}`;
}

function getWorldProgress(
  progress: LearnerProgressState,
  gradeLevel?: LearnerGradeLevel | null
): LearnerWorldProgress[] {
  const curriculum = getCurriculumForGrade(gradeLevel);

  return curriculum.worlds.map((world) => {
    const topicIds = world.topics.map((topic) =>
      getWorldTopicRewardId(world.id, topic.title)
    );
    const totalTopics = topicIds.length;
    const totalStages = totalTopics * REQUIRED_STAGE_COUNT;
    const rewardStars = topicIds.filter((topicId) =>
      progress.claimedWorldRewardIds.includes(topicId)
    ).length;
    const masteredTopics = topicIds.filter(
      (topicId) => progress.masteredTopics[topicId]
    ).length;
    const completedTopics = topicIds.filter(
      (topicId) => progress.completedStagesByTopic[topicId]
    ).length;
    const completedStages = topicIds.reduce(
      (total, topicId) =>
        total +
        (progress.completedStagesByTopic[topicId]?.completedStages.length ?? 0),
      0
    );
    const percentage = totalTopics
      ? clampPercentage((masteredTopics / totalTopics) * 100)
      : 0;

    return {
      accentColor: world.accentColor,
      completedStages,
      completedTopics,
      id: world.id,
      masteredTopics,
      percentage,
      rewardStars,
      title: world.title,
      totalStages,
      totalTopics,
      unlocked: totalTopics > 0 && masteredTopics >= totalTopics,
    };
  });
}

function createRewardCard({
  accentColor,
  completed,
  description,
  icon,
  id,
  requirementText,
  rewardGroup,
  sourceLabel,
  title,
  total,
  type,
  requiredWords = [],
}: {
  accentColor: string;
  completed: number;
  description: string;
  icon: string;
  id: string;
  requirementText: string[];
  rewardGroup: LearnerRewardGroup;
  requiredWords?: SpecificWordProgressItem[];
  sourceLabel: string;
  title: string;
  total: number;
  type: "badge" | "achievement";
}): LearnerRewardCard {
  const safeTotal = getSafeTotal(total);
  const percentage = clampPercentage((completed / safeTotal) * 100);
  const status = toStatus(percentage);

  return {
    accentColor,
    completed: Math.min(Math.max(0, completed), safeTotal),
    description,
    icon,
    id,
    percentage,
    requiredWords,
    requirementText,
    rewardGroup,
    sourceLabel,
    status,
    title,
    total: safeTotal,
    type,
    unlocked: status === "unlocked",
  };
}

function toRewardCard(
  definition: AwardDefinition,
  progress: LearnerProgressState
): LearnerRewardCard {
  const evaluation = getAwardProgress(definition, progress);
  const forceUnlocked = progress.unlockAllQuizzes === true;
  const storedUnlocked =
    definition.type === "badge"
      ? progress.badges.includes(definition.id)
      : progress.achievements.includes(definition.id);
  const unlocked = forceUnlocked || storedUnlocked || evaluation.eligible;
  const completed = unlocked ? evaluation.total : evaluation.completed;
  const total = evaluation.total || 1;
  const percentage = unlocked
    ? 100
    : clampPercentage((completed / getSafeTotal(total)) * 100);

  return {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    icon: definition.icon,
    accentColor: definition.accentColor,
    unlocked,
    type: definition.type,
    rewardGroup: definition.type,
    percentage,
    completed: Math.min(completed, getSafeTotal(total)),
    total: getSafeTotal(total),
    status: unlocked ? "unlocked" : toStatus(percentage),
    sourceLabel: definition.type === "badge" ? "Badge" : "Achievement",
    requirementText: evaluation.checklist.map(
      (item) => `${item.label}: ${item.statusText}`
    ),
    requiredWords: evaluation.requiredWords,
  };
}

export function getCurriculumSummary(gradeLevel?: LearnerGradeLevel | null) {
  const quizPresets = getGradeQuizPresets(gradeLevel);
  const vocabularyItems = getGradeVocabularyItems(gradeLevel);
  const totalQuizSets = quizPresets.length;
  const totalQuizQuestions = quizPresets.reduce(
    (total, quiz) => total + quiz.questions.length,
    0
  );

  return {
    vocabularyCount: vocabularyItems.length,
    totalQuizSets,
    totalQuizQuestions,
    totalActivities: vocabularyItems.length + totalQuizSets,
  };
}

export function getLearnerDashboardSummary(
  progress: LearnerProgressState,
  gradeLevel?: LearnerGradeLevel | null
): LearnerDashboardSummary {
  const moduleSummary = getLearnerModuleSummary(gradeLevel);
  const worldProgress = getWorldProgress(progress, moduleSummary.gradeLevel);
  const completedWorlds = worldProgress.filter((world) => world.unlocked).length;
  const totalTopics = worldProgress.reduce(
    (total, world) => total + world.totalTopics,
    0
  );
  const masteredTopicCount = worldProgress.reduce(
    (total, world) => total + world.masteredTopics,
    0
  );
  const totalStages = totalTopics * REQUIRED_STAGE_COUNT;
  const completedStages = worldProgress.reduce(
    (total, world) => total + world.completedStages,
    0
  );
  const completedQuizIds = new Set([
    ...progress.completedQuizIds,
    ...progress.completedQuizzes,
  ]);
  const completedGradeQuizzes = moduleSummary.quizPresets.filter((quiz) =>
    completedQuizIds.has(quiz.id)
  ).length;
  const viewedGradeWords = moduleSummary.vocabularyItems.filter((item) =>
    progress.viewedWordIds.includes(item.id)
  ).length;
  const nextWorld =
    worldProgress.find((world) => !world.unlocked) ?? worldProgress[0];

  return {
    completedGradeQuizzes,
    completedStages,
    completedWorlds,
    gradeLevel: moduleSummary.gradeLevel,
    masteredTopicCount,
    nextWorldTitle: nextWorld?.title ?? "your next world",
    starsEarned: progress.claimedWorldRewardIds.length,
    streakDays: Math.max(progress.streak, progress.streakDays),
    totalGradeQuizzes: moduleSummary.totalQuizSets,
    totalStages,
    totalTopics,
    totalWords: moduleSummary.vocabularyCount,
    viewedGradeWords,
    worldCount: moduleSummary.worldCount,
    worldProgress,
  };
}

function getQuizInteractionGroup(quizType: string) {
  if (quizType.includes("image") || quizType === "counting-objects") {
    return "image";
  }

  if (quizType.includes("listen") || quizType.includes("audio") || quizType === "text-to-speech") {
    return "listening";
  }

  if (quizType.includes("speech")) {
    return "speaking";
  }

  if (quizType.includes("matching") || quizType.includes("match")) {
    return "matching";
  }

  return "thinking";
}

export function getQuizInteractionSummary(
  progress: LearnerProgressState,
  gradeLevel?: LearnerGradeLevel | null
): QuizInteractionSummaryItem[] {
  const groups: Record<string, QuizInteractionSummaryItem> = {
    image: {
      id: "image",
      title: "Image quizzes",
      completed: 0,
      total: 0,
      percentage: 0,
    },
    listening: {
      id: "listening",
      title: "Listening quizzes",
      completed: 0,
      total: 0,
      percentage: 0,
    },
    speaking: {
      id: "speaking",
      title: "Speaking quizzes",
      completed: 0,
      total: 0,
      percentage: 0,
    },
    matching: {
      id: "matching",
      title: "Matching quizzes",
      completed: 0,
      total: 0,
      percentage: 0,
    },
    thinking: {
      id: "thinking",
      title: "Thinking quizzes",
      completed: 0,
      total: 0,
      percentage: 0,
    },
  };
  const completedQuizIds = new Set([
    ...progress.completedQuizIds,
    ...progress.completedQuizzes,
  ]);

  getGradeQuizPresets(gradeLevel).forEach((quiz) => {
    const group = groups[getQuizInteractionGroup(quiz.quizType)];

    group.total += 1;

    if (completedQuizIds.has(quiz.id)) {
      group.completed += 1;
    }
  });

  return Object.values(groups).map((group) => ({
    ...group,
    percentage: group.total
      ? Math.round((group.completed / group.total) * 100)
      : 0,
  }));
}

export function getLearnerBadges(progress: LearnerProgressState): LearnerRewardCard[] {
  return BADGE_DEFINITIONS.map((badge) => toRewardCard(badge, progress));
}

export function getLearnerAchievements(
  progress: LearnerProgressState
): LearnerRewardCard[] {
  return ACHIEVEMENT_DEFINITIONS.map((achievement) =>
    toRewardCard(achievement, progress)
  );
}

export function getGradeScopedRewards(
  progress: LearnerProgressState,
  gradeLevel?: LearnerGradeLevel | null
): LearnerRewardCard[] {
  const dashboard = getLearnerDashboardSummary(progress, gradeLevel);
  const totalTopics = getSafeTotal(dashboard.totalTopics);
  const gradeSlug = dashboard.gradeLevel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const worldCards = dashboard.worldProgress.map((world) =>
    createRewardCard({
      accentColor: world.accentColor,
      completed: world.masteredTopics,
      description: `Master every topic in ${world.title}.`,
      icon: "map",
      id: `${world.id}-world-badge`,
      requirementText: [
        `Mastered topics: ${world.masteredTopics}/${world.totalTopics}`,
        `Reward stars: ${world.rewardStars}/${world.totalTopics}`,
        `Completed steps: ${world.completedStages}/${world.totalStages}`,
      ],
      rewardGroup: "world",
      sourceLabel: "World Reward",
      title: `${world.title} Badge`,
      total: world.totalTopics,
      type: "badge",
    })
  );
  const gradeBadge = createRewardCard({
    accentColor: "#6B21F2",
    completed: dashboard.masteredTopicCount,
    description: `Master ${dashboard.gradeLevel} topics to grow your level path.`,
    icon: "school",
    id: `${gradeSlug}-level-badge`,
    requirementText: [
      `Mastered topics: ${dashboard.masteredTopicCount}/${totalTopics}`,
      `Completed worlds: ${dashboard.completedWorlds}/${dashboard.worldCount}`,
    ],
    rewardGroup: "grade",
    sourceLabel: "Grade Reward",
    title: `${dashboard.gradeLevel} Level Badge`,
    total: totalTopics,
    type: "badge",
  });
  const gradeAchievement = createRewardCard({
    accentColor: "#14B8A6",
    completed: dashboard.completedWorlds,
    description: `Complete worlds in ${dashboard.gradeLevel} Play.`,
    icon: "ribbon",
    id: `${gradeSlug}-achievement-path`,
    requirementText: [
      `Completed worlds: ${dashboard.completedWorlds}/${dashboard.worldCount}`,
      `Mastered topics: ${dashboard.masteredTopicCount}/${totalTopics}`,
    ],
    rewardGroup: "grade",
    sourceLabel: "Grade Achievement",
    title: `${dashboard.gradeLevel} Achievement Path`,
    total: dashboard.worldCount,
    type: "achievement",
  });

  return [gradeBadge, ...worldCards, gradeAchievement];
}

export function getProgressBadgeRewards(
  progress: LearnerProgressState,
  gradeLevel?: LearnerGradeLevel | null
): LearnerRewardCard[] {
  const dashboard = getLearnerDashboardSummary(progress, gradeLevel);
  const nextHundredXp = Math.max(100, Math.ceil((progress.totalXp + 1) / 100) * 100);

  return [
    createRewardCard({
      accentColor: "#F5A400",
      completed: dashboard.starsEarned,
      description: "Earn stars by finishing Play reward steps.",
      icon: "star",
      id: "progress-stars",
      requirementText: [`Stars earned: ${dashboard.starsEarned}/${dashboard.totalTopics}`],
      rewardGroup: "progress",
      sourceLabel: "Progress Badge",
      title: "Star Badge",
      total: dashboard.totalTopics,
      type: "badge",
    }),
    createRewardCard({
      accentColor: "#6B21F2",
      completed: progress.totalXp,
      description: "Grow XP by learning, practicing, and mastering topics.",
      icon: "flash",
      id: "progress-xp",
      requirementText: [`XP earned: ${progress.totalXp}/${nextHundredXp}`],
      rewardGroup: "progress",
      sourceLabel: "Progress Badge",
      title: "XP Badge",
      total: nextHundredXp,
      type: "badge",
    }),
    createRewardCard({
      accentColor: "#159B70",
      completed: dashboard.completedWorlds,
      description: "Complete Play worlds by mastering their topics.",
      icon: "map",
      id: "progress-worlds",
      requirementText: [`Completed worlds: ${dashboard.completedWorlds}/${dashboard.worldCount}`],
      rewardGroup: "progress",
      sourceLabel: "Progress Badge",
      title: "World Badge",
      total: dashboard.worldCount,
      type: "badge",
    }),
    createRewardCard({
      accentColor: "#0EA5E9",
      completed: dashboard.masteredTopicCount,
      description: "Show mastery after completing the full learning rhythm.",
      icon: "sparkles",
      id: "progress-mastery",
      requirementText: [`Mastered topics: ${dashboard.masteredTopicCount}/${dashboard.totalTopics}`],
      rewardGroup: "progress",
      sourceLabel: "Progress Badge",
      title: "Mastery Badge",
      total: dashboard.totalTopics,
      type: "badge",
    }),
    createRewardCard({
      accentColor: "#22C55E",
      completed: dashboard.completedStages,
      description: "Move through Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery.",
      icon: "trail-sign",
      id: "progress-stages",
      requirementText: [`Completed steps: ${dashboard.completedStages}/${dashboard.totalStages}`],
      rewardGroup: "progress",
      sourceLabel: "Progress Badge",
      title: "Step Badge",
      total: dashboard.totalStages,
      type: "badge",
    }),
    createRewardCard({
      accentColor: "#EF4444",
      completed: dashboard.streakDays,
      description: "Build a steady learning streak.",
      icon: "flame",
      id: "progress-streak",
      requirementText: [`Active streak: ${dashboard.streakDays}/7 days`],
      rewardGroup: "progress",
      sourceLabel: "Progress Badge",
      title: "Streak Badge",
      total: 7,
      type: "badge",
    }),
  ];
}

export function getAllLearnerRewards(
  progress: LearnerProgressState,
  gradeLevel?: LearnerGradeLevel | null
) {
  return [
    ...getGradeScopedRewards(progress, gradeLevel),
    ...getProgressBadgeRewards(progress, gradeLevel),
    ...getLearnerBadges(progress),
    ...getLearnerAchievements(progress),
  ];
}

export function getLearnerRewardById(
  id: string | undefined,
  progress: LearnerProgressState,
  gradeLevel?: LearnerGradeLevel | null
) {
  if (!id) {
    return null;
  }

  return getAllLearnerRewards(progress, gradeLevel).find((reward) => reward.id === id) ?? null;
}
