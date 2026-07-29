import { GRADE1_WORD_WORLD_CONFIG } from "./config";
import type { Grade1WordTopicId } from "./types";

export const GRADE1_WORD_TOPIC_ORDER = GRADE1_WORD_WORLD_CONFIG.topics.map(
  (topic) => topic.title
);

export const SCOPED_GRADE1_WORD_TOPIC_IDS = new Set<Grade1WordTopicId>(
  GRADE1_WORD_WORLD_CONFIG.topics.map((topic) =>
    getGrade1WordTopicKey(topic.title)
  )
);

export function getGrade1WordTopicKey(topicTitle: string): Grade1WordTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") as Grade1WordTopicId;
}

export function getGrade1WordTopicConfig(topicTitle: string) {
  const topicKey = getGrade1WordTopicKey(topicTitle);

  return GRADE1_WORD_WORLD_CONFIG.topics.find(
    (topic) => getGrade1WordTopicKey(topic.title) === topicKey
  );
}
