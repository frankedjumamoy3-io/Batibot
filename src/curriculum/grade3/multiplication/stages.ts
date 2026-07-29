import { GRADE3_MULTIPLICATION_WORLD_ID } from "./config";
import { getGrade3MultiplicationTopicConfig } from "./topics";

export function isScopedGrade3MultiplicationWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE3_MULTIPLICATION_WORLD_ID && Boolean(getGrade3MultiplicationTopicConfig(topicTitle));
}

export function getGrade3MultiplicationTopicSupport(topicTitle: string) {
  const topic = getGrade3MultiplicationTopicConfig(topicTitle);

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
