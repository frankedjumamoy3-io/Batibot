import { GRADE2_MULTIPLICATION_WORLD_ID } from "./config";
import { getGrade2MultiplicationTopicConfig } from "./topics";

export function isScopedGrade2MultiplicationWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE2_MULTIPLICATION_WORLD_ID && Boolean(getGrade2MultiplicationTopicConfig(topicTitle));
}

export function getGrade2MultiplicationTopicSupport(topicTitle: string) {
  const topic = getGrade2MultiplicationTopicConfig(topicTitle);
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
