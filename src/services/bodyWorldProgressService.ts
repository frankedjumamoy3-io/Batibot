import type { BodyStageType, BodyTopicId } from "@/src/data/preschoolBodyWorld";
import {
  awardPreschoolTopicReward,
  getNextUnlockedPreschoolTopic,
  getPreschoolWorldProgress,
  isPreschoolTopicUnlocked,
  markPreschoolStageComplete,
  markPreschoolTopicComplete,
  recordPreschoolAttempt,
} from "@/src/services/preschoolWorldProgressService";

const BODY_DEFINITION = {
  topicOrder: ["head", "hair", "eyes", "ears", "nose", "mouth", "teeth", "hands", "feet", "body"] as BodyTopicId[],
  worldId: "preschool-body-world",
};

export function getBodyWorldProgress(userId: string) {
  return getPreschoolWorldProgress(userId, BODY_DEFINITION);
}

export function markBodyStageComplete(userId: string, topicId: BodyTopicId, stage: BodyStageType) {
  return markPreschoolStageComplete(userId, BODY_DEFINITION, topicId, stage);
}

export function markBodyTopicComplete(userId: string, topicId: BodyTopicId) {
  return markPreschoolTopicComplete(userId, BODY_DEFINITION, topicId);
}

export function awardBodyTopicReward(userId: string, topicId: BodyTopicId, stars: number, xp: number) {
  return awardPreschoolTopicReward(userId, BODY_DEFINITION, topicId, stars, xp);
}

export function getNextUnlockedBodyTopic(userId: string) {
  return getNextUnlockedPreschoolTopic(userId, BODY_DEFINITION);
}

export function isBodyTopicUnlocked(userId: string, topicId: BodyTopicId) {
  return isPreschoolTopicUnlocked(userId, BODY_DEFINITION, topicId);
}

export function recordBodyAttempt(userId: string, topicId: BodyTopicId, stage: "try" | "choose" | "play") {
  return recordPreschoolAttempt(userId, BODY_DEFINITION, topicId, stage);
}
