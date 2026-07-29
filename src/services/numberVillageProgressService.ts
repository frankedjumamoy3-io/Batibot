import type { NumberStageType, NumberTopicId } from "@/src/data/preschoolNumberVillage";
import {
  awardPreschoolTopicReward,
  getNextUnlockedPreschoolTopic,
  getPreschoolWorldProgress,
  isPreschoolTopicUnlocked,
  markPreschoolMasteryComplete,
  markPreschoolStageComplete,
  markPreschoolTopicComplete,
  recordPreschoolAttempt,
} from "@/src/services/preschoolWorldProgressService";

const NUMBER_DEFINITION = {
  topicOrder: [
    "number-1",
    "number-2",
    "number-3",
    "number-4",
    "number-5",
    "number-6",
    "number-7",
    "number-8",
    "number-9",
    "number-10",
    "number-challenge",
  ] as NumberTopicId[],
  worldId: "preschool-number-village",
};

export function getNumberVillageProgress(userId: string) {
  return getPreschoolWorldProgress(userId, NUMBER_DEFINITION);
}

export function markNumberStageComplete(userId: string, topicId: NumberTopicId, stage: NumberStageType) {
  return markPreschoolStageComplete(userId, NUMBER_DEFINITION, topicId, stage);
}

export function markNumberTopicComplete(userId: string, topicId: NumberTopicId) {
  return markPreschoolTopicComplete(userId, NUMBER_DEFINITION, topicId);
}

export function markNumberMasteryComplete(userId: string, topicId: NumberTopicId) {
  return markPreschoolMasteryComplete(userId, NUMBER_DEFINITION, topicId);
}

export function awardNumberTopicReward(userId: string, topicId: NumberTopicId, stars: number, xp: number) {
  return awardPreschoolTopicReward(userId, NUMBER_DEFINITION, topicId, stars, xp);
}

export function getNextUnlockedNumberTopic(userId: string) {
  return getNextUnlockedPreschoolTopic(userId, NUMBER_DEFINITION);
}

export function isNumberTopicUnlocked(userId: string, topicId: NumberTopicId) {
  return isPreschoolTopicUnlocked(userId, NUMBER_DEFINITION, topicId);
}

export function recordNumberAttempt(userId: string, topicId: NumberTopicId, stage: "try" | "choose" | "play") {
  return recordPreschoolAttempt(userId, NUMBER_DEFINITION, topicId, stage);
}
