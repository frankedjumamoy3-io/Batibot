import type { FamilyStageType, FamilyTopicId } from "@/src/data/preschoolFamilyWorld";
import {
  awardPreschoolTopicReward,
  getNextUnlockedPreschoolTopic,
  getPreschoolWorldProgress,
  isPreschoolTopicUnlocked,
  markPreschoolStageComplete,
  markPreschoolTopicComplete,
  recordPreschoolAttempt,
} from "@/src/services/preschoolWorldProgressService";

const FAMILY_DEFINITION = {
  topicOrder: ["mother", "father", "brother", "sister", "baby", "friend", "home", "family"] as FamilyTopicId[],
  worldId: "preschool-family-world",
};

export function getFamilyWorldProgress(userId: string) {
  return getPreschoolWorldProgress(userId, FAMILY_DEFINITION);
}

export function markFamilyStageComplete(userId: string, topicId: FamilyTopicId, stage: FamilyStageType) {
  return markPreschoolStageComplete(userId, FAMILY_DEFINITION, topicId, stage);
}

export function markFamilyTopicComplete(userId: string, topicId: FamilyTopicId) {
  return markPreschoolTopicComplete(userId, FAMILY_DEFINITION, topicId);
}

export function awardFamilyTopicReward(userId: string, topicId: FamilyTopicId, stars: number, xp: number) {
  return awardPreschoolTopicReward(userId, FAMILY_DEFINITION, topicId, stars, xp);
}

export function getNextUnlockedFamilyTopic(userId: string) {
  return getNextUnlockedPreschoolTopic(userId, FAMILY_DEFINITION);
}

export function isFamilyTopicUnlocked(userId: string, topicId: FamilyTopicId) {
  return isPreschoolTopicUnlocked(userId, FAMILY_DEFINITION, topicId);
}

export function recordFamilyAttempt(userId: string, topicId: FamilyTopicId, stage: "try" | "choose" | "play") {
  return recordPreschoolAttempt(userId, FAMILY_DEFINITION, topicId, stage);
}
