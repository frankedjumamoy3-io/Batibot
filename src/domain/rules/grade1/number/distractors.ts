import { getGrade1FriendlyDistractors } from "@/src/domain/rules/grade1/shared";

import { GRADE1_NUMBER_DISTRACTORS } from "./constants";

export function getGrade1NumberFriendlyDistractors(correctAnswer = "") {
  return getGrade1FriendlyDistractors(
    correctAnswer,
    GRADE1_NUMBER_DISTRACTORS
  );
}
