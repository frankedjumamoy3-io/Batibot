import { GRADE3_READING_WORLD_ID } from "./config";
import { getGrade3ReadingTopicConfig } from "./topics";

export function isScopedGrade3ReadingWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE3_READING_WORLD_ID && Boolean(getGrade3ReadingTopicConfig(topicTitle));
}

export function getGrade3ReadingTopicSupport(topicTitle: string) {
  const topic = getGrade3ReadingTopicConfig(topicTitle);

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
