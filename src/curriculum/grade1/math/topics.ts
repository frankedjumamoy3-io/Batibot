import { GRADE1_MATH_WORLD_CONFIG } from "./config";
import type { Grade1MathTopicId } from "./types";

export const GRADE1_MATH_TOPIC_ORDER =
  GRADE1_MATH_WORLD_CONFIG.topics.map((topic) => topic.title);

export const SCOPED_GRADE1_MATH_TOPIC_IDS = new Set<Grade1MathTopicId>(
  GRADE1_MATH_WORLD_CONFIG.topics.map((topic) =>
    getGrade1MathTopicKey(topic.title)
  )
);

export function getGrade1MathTopicKey(
  topicTitle: string
): Grade1MathTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") as Grade1MathTopicId;
}

export function getGrade1MathTopicConfig(topicTitle: string) {
  const topicKey = getGrade1MathTopicKey(topicTitle);

  return GRADE1_MATH_WORLD_CONFIG.topics.find(
    (topic) => getGrade1MathTopicKey(topic.title) === topicKey
  );
}
