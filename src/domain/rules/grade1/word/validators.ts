import {
  validateGrade1Distractors,
  validateGrade1StageIntegrity,
} from "@/src/domain/rules/grade1/shared";

import { GRADE1_WORD_DISTRACTORS } from "./constants";

export function validateGrade1WordDistractors(correctAnswer: string) {
  return validateGrade1Distractors(correctAnswer, GRADE1_WORD_DISTRACTORS);
}

export function validateGrade1WordStageIntegrity(topicTitle: string) {
  return validateGrade1StageIntegrity(topicTitle);
}
