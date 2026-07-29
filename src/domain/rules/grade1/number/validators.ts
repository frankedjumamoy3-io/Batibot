import {
  validateGrade1Distractors,
  validateGrade1StageIntegrity,
} from "@/src/domain/rules/grade1/shared";

import { GRADE1_NUMBER_DISTRACTORS } from "./constants";

export function validateGrade1NumberDistractors(correctAnswer: string) {
  return validateGrade1Distractors(correctAnswer, GRADE1_NUMBER_DISTRACTORS);
}

export function validateGrade1NumberStageIntegrity(topicTitle: string) {
  return validateGrade1StageIntegrity(topicTitle);
}
