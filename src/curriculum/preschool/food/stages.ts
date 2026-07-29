import { PRESCHOOL_FOOD_WORLD_ID, SCOPED_FOOD_TOPIC_IDS } from "./config";
import type { FrameworkStageContent } from "@/src/data/curriculum/learning-path";
import type { PreschoolFoodTopicId } from "./types";

export function getFoodTopicKey(topicTitle: string): PreschoolFoodTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") as PreschoolFoodTopicId;
}

export function getFoodCorrectWord(topicTitle: string) {
  return topicTitle;
}

export function getFoodTryTarget(topicTitle: string) {
  return topicTitle;
}

export function isScopedFoodTopic(topicTitle: string) {
  return SCOPED_FOOD_TOPIC_IDS.has(getFoodTopicKey(topicTitle));
}

export function isScopedFoodWorldTopic(worldId: string, topicTitle: string) {
  return worldId === PRESCHOOL_FOOD_WORLD_ID && isScopedFoodTopic(topicTitle);
}

export function getFoodPlayAction(_topicTitle: string): FrameworkStageContent["requiredAction"] {
  return "drag";
}
