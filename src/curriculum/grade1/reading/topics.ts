import { GRADE1_READING_WORLD_CONFIG } from "./config";
import type { Grade1ReadingTopicId } from "./types";

export const GRADE1_READING_TOPIC_ORDER =
  GRADE1_READING_WORLD_CONFIG.topics.map((topic) => topic.title);

export const SCOPED_GRADE1_READING_TOPIC_IDS = new Set<Grade1ReadingTopicId>(
  GRADE1_READING_WORLD_CONFIG.topics.map((topic) =>
    getGrade1ReadingTopicKey(topic.title)
  )
);

export function getGrade1ReadingTopicKey(
  topicTitle: string
): Grade1ReadingTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") as Grade1ReadingTopicId;
}

export function getGrade1ReadingTopicConfig(topicTitle: string) {
  const topicKey = getGrade1ReadingTopicKey(topicTitle);

  return GRADE1_READING_WORLD_CONFIG.topics.find(
    (topic) => getGrade1ReadingTopicKey(topic.title) === topicKey
  );
}
