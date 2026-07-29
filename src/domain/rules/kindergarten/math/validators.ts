import {
  createKindergartenDistractorValidator,
  isKindergartenNormalizedAnswerMatch,
} from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_MATH_DISTRACTORS } from "./constants";

export const validateKindergartenMathDistractors =
  createKindergartenDistractorValidator(KINDERGARTEN_MATH_DISTRACTORS);

export function isKindergartenMathCorrectAnswer(
  expected: string,
  actual: string
) {
  return isKindergartenNormalizedAnswerMatch(expected, actual);
}

export function validateKindergartenMathStageIntegrity(topicTitle: string) {
  return topicTitle.trim().length > 0;
}
