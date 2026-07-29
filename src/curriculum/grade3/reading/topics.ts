import { GRADE3_READING_WORLD_CONFIG } from "./config";

export const GRADE3_READING_TOPIC_ORDER = GRADE3_READING_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade3ReadingTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade3ReadingTopicConfig(topicTitle: string) {
  const topicKey = getGrade3ReadingTopicKey(topicTitle);
  return GRADE3_READING_WORLD_CONFIG.topics.find((topic) => getGrade3ReadingTopicKey(topic.title) === topicKey);
}
