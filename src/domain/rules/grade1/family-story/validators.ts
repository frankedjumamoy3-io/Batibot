import {
  validateGrade1Distractors,
  validateGrade1StageIntegrity,
} from "@/src/domain/rules/grade1/shared";

import { GRADE1_FAMILY_STORY_DISTRACTORS } from "./constants";

export function validateGrade1FamilyStoryDistractors(correctAnswer: string) {
  return validateGrade1Distractors(
    correctAnswer,
    GRADE1_FAMILY_STORY_DISTRACTORS
  );
}

export function validateGrade1FamilyStoryStageIntegrity(topicTitle: string) {
  return validateGrade1StageIntegrity(topicTitle);
}
