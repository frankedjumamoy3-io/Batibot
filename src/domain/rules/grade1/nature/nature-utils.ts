import { isGrade1AnswerMatch, normalizeGrade1Answer } from "@/src/domain/rules/grade1/shared";

export const normalizeGrade1NatureAnswer = normalizeGrade1Answer;

export function isGrade1NatureAnswerMatch(expected: string, actual: string) {
  return isGrade1AnswerMatch(expected, actual);
}

export function isGrade1NatureFeature(topicTitle: string) {
  return GRADE1_NATURE_FEATURES.has(normalizeGrade1NatureAnswer(topicTitle));
}

const GRADE1_NATURE_FEATURES = new Set([
  "tree",
  "flower",
  "forest",
  "river",
  "mountain",
]);
