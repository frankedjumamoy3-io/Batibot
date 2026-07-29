import { getGrade1FriendlyDistractors } from "@/src/domain/rules/grade1/shared";

import { GRADE1_NATURE_DISTRACTORS } from "./constants";

export function getGrade1NatureFriendlyDistractors(correctAnswer = "") {
  return getGrade1FriendlyDistractors(
    correctAnswer,
    GRADE1_NATURE_DISTRACTORS
  );
}
