import type { Grade2StageChoiceExpectation } from "./types";
import {
  hasDuplicateEquivalentGrade2Choices,
  normalizeGrade2ChoiceLabel,
} from "./choice-utils";

export const GRADE2_TRY_CHOICE_COUNT = 2;
export const GRADE2_CHOOSE_CHOICE_COUNT = 4;

export function hasVisibleGrade2CorrectAnswer({
  choices,
  correctAnswer,
}: Pick<Grade2StageChoiceExpectation, "choices" | "correctAnswer">) {
  const normalizedCorrectAnswer = normalizeGrade2ChoiceLabel(correctAnswer);

  return choices.some(
    (choice) => normalizeGrade2ChoiceLabel(choice) === normalizedCorrectAnswer
  );
}

export function validateGrade2StageChoices({
  choices,
  correctAnswer,
  expectedChoiceCount,
}: Grade2StageChoiceExpectation) {
  return (
    choices.length === expectedChoiceCount &&
    hasVisibleGrade2CorrectAnswer({ choices, correctAnswer }) &&
    !hasDuplicateEquivalentGrade2Choices(choices)
  );
}
