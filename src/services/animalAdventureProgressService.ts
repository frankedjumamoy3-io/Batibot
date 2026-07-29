import type { AnimalStageType, AnimalTopicId } from "@/src/data/preschoolAnimalAdventure";
import {
  awardPreschoolTopicReward,
  getNextUnlockedPreschoolTopic,
  getPreschoolWorldProgress,
  isPreschoolTopicUnlocked,
  markPreschoolStageComplete,
  markPreschoolTopicComplete,
  recordPreschoolAttempt,
} from "@/src/services/preschoolWorldProgressService";

const ANIMAL_DEFINITION = {
  topicOrder: ["dog", "cat", "bird", "fish", "cow", "horse", "duck"] as AnimalTopicId[],
  worldId: "preschool-animal-adventure",
};

export function getAnimalAdventureProgress(userId: string) {
  return getPreschoolWorldProgress(userId, ANIMAL_DEFINITION);
}

export function markAnimalStageComplete(userId: string, topicId: AnimalTopicId, stage: AnimalStageType) {
  return markPreschoolStageComplete(userId, ANIMAL_DEFINITION, topicId, stage);
}

export function markAnimalTopicComplete(userId: string, topicId: AnimalTopicId) {
  return markPreschoolTopicComplete(userId, ANIMAL_DEFINITION, topicId);
}

export function awardAnimalTopicReward(userId: string, topicId: AnimalTopicId, stars: number, xp: number) {
  return awardPreschoolTopicReward(userId, ANIMAL_DEFINITION, topicId, stars, xp);
}

export function getNextUnlockedAnimalTopic(userId: string) {
  return getNextUnlockedPreschoolTopic(userId, ANIMAL_DEFINITION);
}

export function isAnimalTopicUnlocked(userId: string, topicId: AnimalTopicId) {
  return isPreschoolTopicUnlocked(userId, ANIMAL_DEFINITION, topicId);
}

export function recordAnimalAttempt(userId: string, topicId: AnimalTopicId, stage: "try" | "choose" | "play") {
  return recordPreschoolAttempt(userId, ANIMAL_DEFINITION, topicId, stage);
}
