import { GRADE2_PLACE_VALUE_WORLD_ID } from "./config";
import { getGrade2PlaceValueTopicConfig } from "./topics";

export function isScopedGrade2PlaceValueWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE2_PLACE_VALUE_WORLD_ID && Boolean(getGrade2PlaceValueTopicConfig(topicTitle));
}

export function getGrade2PlaceValueTopicSupport(topicTitle: string) {
  const topic = getGrade2PlaceValueTopicConfig(topicTitle);
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
