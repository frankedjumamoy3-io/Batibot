import type { FoodStageType, FoodTopicId } from "@/src/data/preschoolFoodTown";
import {
  awardPreschoolTopicReward,
  getNextUnlockedPreschoolTopic,
  getPreschoolWorldProgress,
  isPreschoolTopicUnlocked,
  markPreschoolStageComplete,
  markPreschoolTopicComplete,
  recordPreschoolAttempt,
} from "@/src/services/preschoolWorldProgressService";

const FOOD_DEFINITION = {
  topicOrder: ["rice", "bread", "milk", "egg", "meat", "vegetables", "juice"] as FoodTopicId[],
  worldId: "preschool-food-town",
};

export function getFoodTownProgress(userId: string) {
  return getPreschoolWorldProgress(userId, FOOD_DEFINITION);
}

export function markFoodStageComplete(userId: string, topicId: FoodTopicId, stage: FoodStageType) {
  return markPreschoolStageComplete(userId, FOOD_DEFINITION, topicId, stage);
}

export function markFoodTopicComplete(userId: string, topicId: FoodTopicId) {
  return markPreschoolTopicComplete(userId, FOOD_DEFINITION, topicId);
}

export function awardFoodTopicReward(userId: string, topicId: FoodTopicId, stars: number, xp: number) {
  return awardPreschoolTopicReward(userId, FOOD_DEFINITION, topicId, stars, xp);
}

export function getNextUnlockedFoodTopic(userId: string) {
  return getNextUnlockedPreschoolTopic(userId, FOOD_DEFINITION);
}

export function isFoodTopicUnlocked(userId: string, topicId: FoodTopicId) {
  return isPreschoolTopicUnlocked(userId, FOOD_DEFINITION, topicId);
}

export function recordFoodAttempt(userId: string, topicId: FoodTopicId, stage: "try" | "choose" | "play") {
  return recordPreschoolAttempt(userId, FOOD_DEFINITION, topicId, stage);
}
