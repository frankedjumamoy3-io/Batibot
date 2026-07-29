import { GRADE1_NUMBER_WORLD_CONFIG } from "./config";
import type { Grade1NumberTopicId } from "./types";

export const GRADE1_NUMBER_TOPIC_ORDER =
  GRADE1_NUMBER_WORLD_CONFIG.topics.map((topic) => topic.title);

export const SCOPED_GRADE1_NUMBER_TOPIC_IDS = new Set<Grade1NumberTopicId>(
  GRADE1_NUMBER_WORLD_CONFIG.topics.map((topic) =>
    getGrade1NumberTopicKey(topic.title)
  )
);

export function getGrade1NumberTopicKey(
  topicTitle: string
): Grade1NumberTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") as Grade1NumberTopicId;
}

export function getGrade1NumberTopicConfig(topicTitle: string) {
  const topicKey = getGrade1NumberTopicKey(topicTitle);

  return GRADE1_NUMBER_WORLD_CONFIG.topics.find(
    (topic) => getGrade1NumberTopicKey(topic.title) === topicKey
  );
}
