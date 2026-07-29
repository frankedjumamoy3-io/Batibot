import { getGrade1FriendlyDistractors } from "@/src/domain/rules/grade1/shared";

import { GRADE1_TIME_DISTRACTORS } from "./constants";

export function getGrade1TimeFriendlyDistractors(correctAnswer = "") {
  return getGrade1FriendlyDistractors(correctAnswer, GRADE1_TIME_DISTRACTORS);
}
