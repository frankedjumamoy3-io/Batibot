import { GRADE2_PLACE_VALUE_WORLD_CONFIG } from "./config";

export const GRADE2_PLACE_VALUE_TOPIC_ORDER = GRADE2_PLACE_VALUE_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade2PlaceValueTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade2PlaceValueTopicConfig(topicTitle: string) {
  const topicKey = getGrade2PlaceValueTopicKey(topicTitle);
  return GRADE2_PLACE_VALUE_WORLD_CONFIG.topics.find((topic) => getGrade2PlaceValueTopicKey(topic.title) === topicKey);
}
