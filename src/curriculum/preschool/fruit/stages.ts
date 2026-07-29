import { PRESCHOOL_FRUIT_WORLD_ID, SCOPED_FRUIT_TOPIC_IDS } from "./config";
import type { FrameworkStageContent } from "@/src/data/curriculum/learning-path";
import type { PreschoolFruitTopicId } from "./types";

export function getFruitTopicKey(topicTitle: string): PreschoolFruitTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") as PreschoolFruitTopicId;
}

export function getFruitCorrectWord(topicTitle: string) {
  return topicTitle;
}

export function getFruitTryTarget(topicTitle: string) {
  return topicTitle;
}

export function isScopedFruitTopic(topicTitle: string) {
  return SCOPED_FRUIT_TOPIC_IDS.has(getFruitTopicKey(topicTitle));
}

export function isScopedFruitWorldTopic(worldId: string, topicTitle: string) {
  return worldId === PRESCHOOL_FRUIT_WORLD_ID && isScopedFruitTopic(topicTitle);
}

export function getFruitPlayAction(_topicTitle: string): FrameworkStageContent["requiredAction"] {
  return "drag";
}
