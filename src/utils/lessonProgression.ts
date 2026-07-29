import type {
  LearnerProgressState,
  LearnerStageId,
} from "@/src/domain/entities/learner-progress";

export const LEARNING_STAGE_IDS: LearnerStageId[] = [
  "discover",
  "explore",
  "interact",
  "practice",
  "challenge",
];

export const POST_LEARNING_STAGE_IDS: LearnerStageId[] = [
  "reward",
  "progress",
  "mastery",
];

function getCompletedStages(
  progress: LearnerProgressState,
  topicId: string
): LearnerStageId[] {
  return topicId
    ? progress.completedStagesByTopic[topicId]?.completedStages ?? []
    : [];
}

export function isLessonTopicRewardClaimed(
  progress: LearnerProgressState,
  topicId: string
): boolean {
  return Boolean(topicId && progress.claimedWorldRewardIds.includes(topicId));
}

export function isLessonTopicMastered(
  progress: LearnerProgressState,
  topicId: string
): boolean {
  return Boolean(topicId && progress.masteredTopics[topicId]);
}

export function hasCompletedPostLearningStage(
  progress: LearnerProgressState,
  topicId: string
): boolean {
  const completedStages = getCompletedStages(progress, topicId);
  return POST_LEARNING_STAGE_IDS.some((stage) => completedStages.includes(stage));
}

export function hasCompletedLearningRun(
  progress: LearnerProgressState,
  topicId: string
): boolean {
  const completedStages = getCompletedStages(progress, topicId);
  return LEARNING_STAGE_IDS.every((stage) => completedStages.includes(stage));
}

export function isLessonTopicReplay(
  progress: LearnerProgressState,
  topicId: string
): boolean {
  return (
    isLessonTopicMastered(progress, topicId) ||
    isLessonTopicRewardClaimed(progress, topicId) ||
    hasCompletedPostLearningStage(progress, topicId)
  );
}

export function isLessonTopicCompleteForUnlock(
  progress: LearnerProgressState,
  topicId: string
): boolean {
  return (
    isLessonTopicReplay(progress, topicId) ||
    hasCompletedLearningRun(progress, topicId)
  );
}
