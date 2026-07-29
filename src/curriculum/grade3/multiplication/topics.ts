import { GRADE3_MULTIPLICATION_WORLD_CONFIG } from "./config";

export const GRADE3_MULTIPLICATION_TOPIC_ORDER = GRADE3_MULTIPLICATION_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade3MultiplicationTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade3MultiplicationTopicConfig(topicTitle: string) {
  const topicKey = getGrade3MultiplicationTopicKey(topicTitle);
  return GRADE3_MULTIPLICATION_WORLD_CONFIG.topics.find((topic) => getGrade3MultiplicationTopicKey(topic.title) === topicKey);
}
