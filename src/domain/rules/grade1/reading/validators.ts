import {
  validateGrade1Distractors,
  validateGrade1StageIntegrity,
} from "@/src/domain/rules/grade1/shared";

import { GRADE1_READING_DISTRACTORS } from "./constants";

export function validateGrade1ReadingDistractors(correctAnswer: string) {
  return validateGrade1Distractors(correctAnswer, GRADE1_READING_DISTRACTORS);
}

export function validateGrade1ReadingStageIntegrity(topicTitle: string) {
  return validateGrade1StageIntegrity(topicTitle);
}
