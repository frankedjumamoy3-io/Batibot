import { GRADE3_CHALLENGE_WORLD_ID } from "./config";
import { getGrade3ChallengeTopicConfig } from "./topics";

export function isScopedGrade3ChallengeWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE3_CHALLENGE_WORLD_ID && Boolean(getGrade3ChallengeTopicConfig(topicTitle));
}

export function getGrade3ChallengeTopicSupport(topicTitle: string) {
  const topic = getGrade3ChallengeTopicConfig(topicTitle);

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
