import { GRADE3_CONTEXT_CLUE_WORLD_CONFIG } from "./config";

export const GRADE3_CONTEXT_CLUE_TOPIC_ORDER = GRADE3_CONTEXT_CLUE_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade3ContextClueTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade3ContextClueTopicConfig(topicTitle: string) {
  const topicKey = getGrade3ContextClueTopicKey(topicTitle);
  return GRADE3_CONTEXT_CLUE_WORLD_CONFIG.topics.find((topic) => getGrade3ContextClueTopicKey(topic.title) === topicKey);
}
