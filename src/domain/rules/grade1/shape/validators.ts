import {
  validateGrade1Distractors,
  validateGrade1StageIntegrity,
} from "@/src/domain/rules/grade1/shared";

import { GRADE1_SHAPE_DISTRACTORS } from "./constants";

export function validateGrade1ShapeDistractors(correctAnswer: string) {
  return validateGrade1Distractors(correctAnswer, GRADE1_SHAPE_DISTRACTORS);
}

export function validateGrade1ShapeStageIntegrity(topicTitle: string) {
  return validateGrade1StageIntegrity(topicTitle);
}
