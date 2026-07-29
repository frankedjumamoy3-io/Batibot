import type { Grade3StageChoiceExpectation } from "./types";
import { hasDuplicateEquivalentGrade3Choices, normalizeGrade3ChoiceLabel } from "./choice-utils";

export const GRADE3_TRY_CHOICE_COUNT = 2;
export const GRADE3_CHOOSE_CHOICE_COUNT = 4;

export function hasVisibleGrade3CorrectAnswer({ choices, correctAnswer }: Pick<Grade3StageChoiceExpectation, "choices" | "correctAnswer">) {
  const normalizedCorrectAnswer = normalizeGrade3ChoiceLabel(correctAnswer);
  return choices.some((choice) => normalizeGrade3ChoiceLabel(choice) === normalizedCorrectAnswer);
}

export function validateGrade3StageChoices({ choices, correctAnswer, expectedChoiceCount }: Grade3StageChoiceExpectation) {
  return choices.length === expectedChoiceCount && hasVisibleGrade3CorrectAnswer({ choices, correctAnswer }) && !hasDuplicateEquivalentGrade3Choices(choices);
}
