import {
  validateGrade1Distractors,
  validateGrade1StageIntegrity,
} from "@/src/domain/rules/grade1/shared";

import { GRADE1_NATURE_DISTRACTORS } from "./constants";

export function validateGrade1NatureDistractors(correctAnswer: string) {
  return validateGrade1Distractors(correctAnswer, GRADE1_NATURE_DISTRACTORS);
}

export function validateGrade1NatureStageIntegrity(topicTitle: string) {
  return validateGrade1StageIntegrity(topicTitle);
}
