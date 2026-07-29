import type { ShapeStageType, ShapeTopicId } from "@/src/data/preschoolShapeKingdom";
import {
  awardPreschoolTopicReward,
  getNextUnlockedPreschoolTopic,
  getPreschoolWorldProgress,
  isPreschoolTopicUnlocked,
  markPreschoolStageComplete,
  markPreschoolTopicComplete,
  recordPreschoolAttempt,
} from "@/src/services/preschoolWorldProgressService";

const SHAPE_DEFINITION = {
  topicOrder: ["circle", "square", "triangle", "rectangle", "star"] as ShapeTopicId[],
  worldId: "preschool-shape-kingdom",
};

export function getShapeKingdomProgress(userId: string) {
  return getPreschoolWorldProgress(userId, SHAPE_DEFINITION);
}

export function markShapeStageComplete(userId: string, topicId: ShapeTopicId, stage: ShapeStageType) {
  return markPreschoolStageComplete(userId, SHAPE_DEFINITION, topicId, stage);
}

export function markShapeTopicComplete(userId: string, topicId: ShapeTopicId) {
  return markPreschoolTopicComplete(userId, SHAPE_DEFINITION, topicId);
}

export function awardShapeTopicReward(userId: string, topicId: ShapeTopicId, stars: number, xp: number) {
  return awardPreschoolTopicReward(userId, SHAPE_DEFINITION, topicId, stars, xp);
}

export function getNextUnlockedShapeTopic(userId: string) {
  return getNextUnlockedPreschoolTopic(userId, SHAPE_DEFINITION);
}

export function isShapeTopicUnlocked(userId: string, topicId: ShapeTopicId) {
  return isPreschoolTopicUnlocked(userId, SHAPE_DEFINITION, topicId);
}

export function recordShapeAttempt(userId: string, topicId: ShapeTopicId, stage: "try" | "choose" | "play") {
  return recordPreschoolAttempt(userId, SHAPE_DEFINITION, topicId, stage);
}
