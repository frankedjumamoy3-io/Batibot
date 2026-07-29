import { GRADE2_MEASUREMENT_WORLD_CONFIG } from "./config";

export const GRADE2_MEASUREMENT_TOPIC_ORDER = GRADE2_MEASUREMENT_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade2MeasurementTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade2MeasurementTopicConfig(topicTitle: string) {
  const topicKey = getGrade2MeasurementTopicKey(topicTitle);
  return GRADE2_MEASUREMENT_WORLD_CONFIG.topics.find((topic) => getGrade2MeasurementTopicKey(topic.title) === topicKey);
}
