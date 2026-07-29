import { GRADE1_SHAPE_WORLD_CONFIG } from "./config";
import type { Grade1ShapeTopicId } from "./types";

export const GRADE1_SHAPE_TOPIC_ORDER =
  GRADE1_SHAPE_WORLD_CONFIG.topics.map((topic) => topic.title);

export const SCOPED_GRADE1_SHAPE_TOPIC_IDS = new Set<Grade1ShapeTopicId>(
  GRADE1_SHAPE_WORLD_CONFIG.topics.map((topic) =>
    getGrade1ShapeTopicKey(topic.title)
  )
);

export function getGrade1ShapeTopicKey(
  topicTitle: string
): Grade1ShapeTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") as Grade1ShapeTopicId;
}

export function getGrade1ShapeTopicConfig(topicTitle: string) {
  const topicKey = getGrade1ShapeTopicKey(topicTitle);

  return GRADE1_SHAPE_WORLD_CONFIG.topics.find(
    (topic) => getGrade1ShapeTopicKey(topic.title) === topicKey
  );
}
