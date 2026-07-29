import { GRADE2_MULTIPLICATION_WORLD_CONFIG } from "./config";

export const GRADE2_MULTIPLICATION_TOPIC_ORDER = GRADE2_MULTIPLICATION_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade2MultiplicationTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade2MultiplicationTopicConfig(topicTitle: string) {
  const topicKey = getGrade2MultiplicationTopicKey(topicTitle);
  return GRADE2_MULTIPLICATION_WORLD_CONFIG.topics.find((topic) => getGrade2MultiplicationTopicKey(topic.title) === topicKey);
}
