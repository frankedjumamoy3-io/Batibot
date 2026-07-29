import { GRADE3_NUMBER_WORLD_ID } from "./config";
import { getGrade3NumberTopicConfig } from "./topics";

export function isScopedGrade3NumberWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE3_NUMBER_WORLD_ID && Boolean(getGrade3NumberTopicConfig(topicTitle));
}

export function getGrade3NumberTopicSupport(topicTitle: string) {
  const topic = getGrade3NumberTopicConfig(topicTitle);

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
