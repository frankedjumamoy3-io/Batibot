import { validateKindergartenDistractors } from "./choice-rules";

export function normalizeKindergartenAnswer(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isKindergartenNormalizedAnswerMatch(
  expected: string,
  actual: string
) {
  return (
    normalizeKindergartenAnswer(expected) ===
    normalizeKindergartenAnswer(actual)
  );
}

export function createKindergartenDistractorValidator(
  distractorPool: string[]
) {
  return (correctAnswer: string) =>
    validateKindergartenDistractors(correctAnswer, distractorPool);
}
