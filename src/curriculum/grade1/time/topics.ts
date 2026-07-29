import { GRADE1_TIME_WORLD_CONFIG } from "./config";
import type { Grade1TimeTopicId } from "./types";

export const GRADE1_TIME_TOPIC_ORDER =
  GRADE1_TIME_WORLD_CONFIG.topics.map((topic) => topic.title);

export const SCOPED_GRADE1_TIME_TOPIC_IDS = new Set<Grade1TimeTopicId>(
  GRADE1_TIME_WORLD_CONFIG.topics.map((topic) =>
    getGrade1TimeTopicKey(topic.title)
  )
);

export function getGrade1TimeTopicKey(
  topicTitle: string
): Grade1TimeTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") as Grade1TimeTopicId;
}

export function getGrade1TimeTopicConfig(topicTitle: string) {
  const topicKey = getGrade1TimeTopicKey(topicTitle);

  return GRADE1_TIME_WORLD_CONFIG.topics.find(
    (topic) => getGrade1TimeTopicKey(topic.title) === topicKey
  );
}
