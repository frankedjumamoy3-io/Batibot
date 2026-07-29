import type { ColorTopicId, ColorfulStageType } from "@/src/data/preschoolColorfulWorld";
import {
  awardPreschoolTopicReward,
  getNextUnlockedPreschoolTopic,
  getPreschoolWorldProgress,
  isPreschoolTopicUnlocked,
  markPreschoolStageComplete,
  markPreschoolTopicComplete,
  recordPreschoolAttempt,
} from "@/src/services/preschoolWorldProgressService";

const COLORFUL_DEFINITION = {
  topicOrder: ["red", "blue", "yellow", "green", "orange", "purple", "white", "black"] as ColorTopicId[],
  worldId: "preschool-colorful-world",
};

export function getColorfulWorldProgress(userId: string) {
  return getPreschoolWorldProgress(userId, COLORFUL_DEFINITION);
}

export function markColorfulStageComplete(userId: string, topicId: ColorTopicId, stage: ColorfulStageType) {
  return markPreschoolStageComplete(userId, COLORFUL_DEFINITION, topicId, stage);
}

export function markColorfulTopicComplete(userId: string, topicId: ColorTopicId) {
  return markPreschoolTopicComplete(userId, COLORFUL_DEFINITION, topicId);
}

export function awardColorfulTopicReward(userId: string, topicId: ColorTopicId, stars: number, xp: number) {
  return awardPreschoolTopicReward(userId, COLORFUL_DEFINITION, topicId, stars, xp);
}

export function getNextUnlockedColorfulTopic(userId: string) {
  return getNextUnlockedPreschoolTopic(userId, COLORFUL_DEFINITION);
}

export function isColorfulTopicUnlocked(userId: string, topicId: ColorTopicId) {
  return isPreschoolTopicUnlocked(userId, COLORFUL_DEFINITION, topicId);
}

export function recordColorfulAttempt(userId: string, topicId: ColorTopicId, stage: "try" | "choose" | "play") {
  return recordPreschoolAttempt(userId, COLORFUL_DEFINITION, topicId, stage);
}
