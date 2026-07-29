import type { FruitStageType, FruitTopicId } from "@/src/data/preschoolFruitGarden";
import {
  awardPreschoolTopicReward,
  getNextUnlockedPreschoolTopic,
  getPreschoolWorldProgress,
  isPreschoolTopicUnlocked,
  markPreschoolStageComplete,
  markPreschoolTopicComplete,
  recordPreschoolAttempt,
} from "@/src/services/preschoolWorldProgressService";

const FRUIT_DEFINITION = {
  topicOrder: ["apple", "banana", "mango", "orange", "grapes", "watermelon"] as FruitTopicId[],
  worldId: "preschool-fruit-garden",
};

export function getFruitGardenProgress(userId: string) {
  return getPreschoolWorldProgress(userId, FRUIT_DEFINITION);
}

export function markFruitStageComplete(userId: string, topicId: FruitTopicId, stage: FruitStageType) {
  return markPreschoolStageComplete(userId, FRUIT_DEFINITION, topicId, stage);
}

export function markFruitTopicComplete(userId: string, topicId: FruitTopicId) {
  return markPreschoolTopicComplete(userId, FRUIT_DEFINITION, topicId);
}

export function awardFruitTopicReward(userId: string, topicId: FruitTopicId, stars: number, xp: number) {
  return awardPreschoolTopicReward(userId, FRUIT_DEFINITION, topicId, stars, xp);
}

export function getNextUnlockedFruitTopic(userId: string) {
  return getNextUnlockedPreschoolTopic(userId, FRUIT_DEFINITION);
}

export function isFruitTopicUnlocked(userId: string, topicId: FruitTopicId) {
  return isPreschoolTopicUnlocked(userId, FRUIT_DEFINITION, topicId);
}

export function recordFruitAttempt(userId: string, topicId: FruitTopicId, stage: "try" | "choose" | "play") {
  return recordPreschoolAttempt(userId, FRUIT_DEFINITION, topicId, stage);
}
