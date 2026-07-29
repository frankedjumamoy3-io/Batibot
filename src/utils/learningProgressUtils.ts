import type {
  Achievement,
  Badge,
  LearnerProfile,
  TopicNode,
  WorldNode,
} from "@/src/types/learning";

export function getVisibleWorldsForLearner(
  worlds: WorldNode[],
  learner: LearnerProfile
): WorldNode[] {
  return worlds
    .filter((world) => world.gradeLevel === learner.gradeLevel)
    .sort((a, b) => a.order - b.order);
}

export function isWorldUnlocked(
  world: WorldNode,
  learner: LearnerProfile
): boolean {
  if (learner.unlockAllQuizzes === true) return true;
  if (!world.requiredWorldId) return true;
  return learner.completedWorlds.includes(world.requiredWorldId);
}

export function getTopicsForWorld(
  topics: TopicNode[],
  worldId: string
): TopicNode[] {
  return topics
    .filter((topic) => topic.worldId === worldId)
    .sort((a, b) => a.order - b.order);
}

export function isTopicUnlocked(
  topic: TopicNode,
  learner: LearnerProfile
): boolean {
  if (learner.unlockAllQuizzes === true) return true;
  if (!topic.requiredTopicId) return true;
  return learner.completedTopics.includes(topic.requiredTopicId);
}

export function getVisibleBadgesForLearner(
  badges: Badge[],
  learner: LearnerProfile
): Badge[] {
  return badges.filter((badge) => badge.gradeLevel === learner.gradeLevel);
}

export function getVisibleAchievementsForLearner(
  achievements: Achievement[],
  learner: LearnerProfile
): Achievement[] {
  return achievements.filter(
    (achievement) =>
      achievement.gradeLevel === learner.gradeLevel ||
      achievement.gradeLevel === "global"
  );
}
