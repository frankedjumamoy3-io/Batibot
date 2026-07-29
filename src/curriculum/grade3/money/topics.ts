import { GRADE3_MONEY_WORLD_CONFIG } from "./config";

export const GRADE3_MONEY_TOPIC_ORDER = GRADE3_MONEY_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade3MoneyTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade3MoneyTopicConfig(topicTitle: string) {
  const topicKey = getGrade3MoneyTopicKey(topicTitle);
  return GRADE3_MONEY_WORLD_CONFIG.topics.find((topic) => getGrade3MoneyTopicKey(topic.title) === topicKey);
}
