import {
  validateGrade1Distractors,
  validateGrade1StageIntegrity,
} from "@/src/domain/rules/grade1/shared";

import { GRADE1_MATH_DISTRACTORS } from "./constants";

export function validateGrade1MathDistractors(correctAnswer: string) {
  return validateGrade1Distractors(correctAnswer, GRADE1_MATH_DISTRACTORS);
}

export function validateGrade1MathStageIntegrity(topicTitle: string) {
  return validateGrade1StageIntegrity(topicTitle);
}
