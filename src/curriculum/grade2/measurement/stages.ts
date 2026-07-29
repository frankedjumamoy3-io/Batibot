import { GRADE2_MEASUREMENT_WORLD_ID } from "./config";
import { getGrade2MeasurementTopicConfig } from "./topics";

export function isScopedGrade2MeasurementWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE2_MEASUREMENT_WORLD_ID && Boolean(getGrade2MeasurementTopicConfig(topicTitle));
}

export function getGrade2MeasurementTopicSupport(topicTitle: string) {
  const topic = getGrade2MeasurementTopicConfig(topicTitle);
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
