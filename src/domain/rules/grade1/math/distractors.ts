import { getGrade1FriendlyDistractors } from "@/src/domain/rules/grade1/shared";

import { GRADE1_MATH_DISTRACTORS } from "./constants";

export function getGrade1MathFriendlyDistractors(correctAnswer = "") {
  return getGrade1FriendlyDistractors(correctAnswer, GRADE1_MATH_DISTRACTORS);
}
