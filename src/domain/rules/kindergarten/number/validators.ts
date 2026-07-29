import {
  createKindergartenDistractorValidator,
  isKindergartenNormalizedAnswerMatch,
} from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_NUMBER_DISTRACTORS } from "./constants";
import { hasKindergartenNumberValue } from "./numeracy-utils";

export const validateKindergartenNumberDistractors =
  createKindergartenDistractorValidator(KINDERGARTEN_NUMBER_DISTRACTORS);

export function isKindergartenNumberCorrectAnswer(
  expected: string,
  actual: string
) {
  return isKindergartenNormalizedAnswerMatch(expected, actual);
}

export function validateKindergartenNumberStageIntegrity(topicTitle: string) {
  return topicTitle === "Number Challenge" || hasKindergartenNumberValue(topicTitle);
}
