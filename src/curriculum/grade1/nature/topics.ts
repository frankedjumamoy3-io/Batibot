import { GRADE1_NATURE_WORLD_CONFIG } from "./config";
import type { Grade1NatureTopicId } from "./types";

export const GRADE1_NATURE_TOPIC_ORDER =
  GRADE1_NATURE_WORLD_CONFIG.topics.map((topic) => topic.title);

export const SCOPED_GRADE1_NATURE_TOPIC_IDS = new Set<Grade1NatureTopicId>(
  GRADE1_NATURE_WORLD_CONFIG.topics.map((topic) =>
    getGrade1NatureTopicKey(topic.title)
  )
);

export function getGrade1NatureTopicKey(
  topicTitle: string
): Grade1NatureTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") as Grade1NatureTopicId;
}

export function getGrade1NatureTopicConfig(topicTitle: string) {
  const topicKey = getGrade1NatureTopicKey(topicTitle);

  return GRADE1_NATURE_WORLD_CONFIG.topics.find(
    (topic) => getGrade1NatureTopicKey(topic.title) === topicKey
  );
}
