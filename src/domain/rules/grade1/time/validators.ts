import {
  validateGrade1Distractors,
  validateGrade1StageIntegrity,
} from "@/src/domain/rules/grade1/shared";

import { GRADE1_TIME_DISTRACTORS } from "./constants";

export function validateGrade1TimeDistractors(correctAnswer: string) {
  return validateGrade1Distractors(correctAnswer, GRADE1_TIME_DISTRACTORS);
}

export function validateGrade1TimeStageIntegrity(topicTitle: string) {
  return validateGrade1StageIntegrity(topicTitle);
}
