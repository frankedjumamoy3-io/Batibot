import { PRESCHOOL_SHAPE_WORLD_ID, SCOPED_SHAPE_TOPIC_IDS } from "./config";
import type { PreschoolShapeTopicId } from "./types";

export function getShapeTopicKey(topicTitle: string): PreschoolShapeTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") as PreschoolShapeTopicId;
}

export function getShapeCorrectWord(topicTitle: string) {
  return topicTitle === "Shape Challenge" ? "Shape" : topicTitle;
}

export function isScopedShapeTopic(topicTitle: string) {
  return SCOPED_SHAPE_TOPIC_IDS.has(getShapeTopicKey(topicTitle));
}

export function isScopedShapeWorldTopic(worldId: string, topicTitle: string) {
  return worldId === PRESCHOOL_SHAPE_WORLD_ID && isScopedShapeTopic(topicTitle);
}

export function getShapePlayAction(topicTitle: string) {
  return topicTitle === "Shape Challenge" ? "build" : "drag";
}
