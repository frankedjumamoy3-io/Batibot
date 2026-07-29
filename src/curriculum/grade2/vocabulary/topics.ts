import { GRADE2_VOCABULARY_WORLD_CONFIG } from "./config";

export const GRADE2_VOCABULARY_TOPIC_ORDER = GRADE2_VOCABULARY_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade2VocabularyTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade2VocabularyTopicConfig(topicTitle: string) {
  const topicKey = getGrade2VocabularyTopicKey(topicTitle);
  return GRADE2_VOCABULARY_WORLD_CONFIG.topics.find((topic) => getGrade2VocabularyTopicKey(topic.title) === topicKey);
}
