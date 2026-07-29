import { GRADE3_FRACTION_WORLD_CONFIG } from "./config";

export const GRADE3_FRACTION_TOPIC_ORDER = GRADE3_FRACTION_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade3FractionTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade3FractionTopicConfig(topicTitle: string) {
  const topicKey = getGrade3FractionTopicKey(topicTitle);
  return GRADE3_FRACTION_WORLD_CONFIG.topics.find((topic) => getGrade3FractionTopicKey(topic.title) === topicKey);
}
