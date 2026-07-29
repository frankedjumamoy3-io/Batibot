import { GRADE3_DIVISION_WORLD_CONFIG } from "./config";

export const GRADE3_DIVISION_TOPIC_ORDER = GRADE3_DIVISION_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade3DivisionTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade3DivisionTopicConfig(topicTitle: string) {
  const topicKey = getGrade3DivisionTopicKey(topicTitle);
  return GRADE3_DIVISION_WORLD_CONFIG.topics.find((topic) => getGrade3DivisionTopicKey(topic.title) === topicKey);
}
