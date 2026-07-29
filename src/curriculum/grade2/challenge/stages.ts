import { GRADE2_CHALLENGE_WORLD_ID } from "./config";
import { getGrade2ChallengeTopicConfig } from "./topics";

export function isScopedGrade2ChallengeWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE2_CHALLENGE_WORLD_ID && Boolean(getGrade2ChallengeTopicConfig(topicTitle));
}

export function getGrade2ChallengeTopicSupport(topicTitle: string) {
  const topic = getGrade2ChallengeTopicConfig(topicTitle);
  if (!topic) {
    return null;
  }
  return {
    assetId: topic.assetId,
    example: topic.example,
    interactionTypes: topic.interactionTypes,
    title: topic.title,
  };
}
