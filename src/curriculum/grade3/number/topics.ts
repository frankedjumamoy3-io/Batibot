import { GRADE3_NUMBER_WORLD_CONFIG } from "./config";

export const GRADE3_NUMBER_TOPIC_ORDER = GRADE3_NUMBER_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade3NumberTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade3NumberTopicConfig(topicTitle: string) {
  const topicKey = getGrade3NumberTopicKey(topicTitle);
  return GRADE3_NUMBER_WORLD_CONFIG.topics.find((topic) => getGrade3NumberTopicKey(topic.title) === topicKey);
}
