import { getGrade1FriendlyDistractors } from "@/src/domain/rules/grade1/shared";

import { GRADE1_SHAPE_DISTRACTORS } from "./constants";

export function getGrade1ShapeFriendlyDistractors(correctAnswer = "") {
  return getGrade1FriendlyDistractors(
    correctAnswer,
    GRADE1_SHAPE_DISTRACTORS
  );
}
