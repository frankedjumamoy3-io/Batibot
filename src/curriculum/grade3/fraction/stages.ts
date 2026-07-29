import { GRADE3_FRACTION_WORLD_ID } from "./config";
import { getGrade3FractionTopicConfig } from "./topics";

export function isScopedGrade3FractionWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE3_FRACTION_WORLD_ID && Boolean(getGrade3FractionTopicConfig(topicTitle));
}

export function getGrade3FractionTopicSupport(topicTitle: string) {
  const topic = getGrade3FractionTopicConfig(topicTitle);

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
