import { isGrade1AnswerMatch, normalizeGrade1Answer } from "@/src/domain/rules/grade1/shared";

export const normalizeGrade1ShapeAnswer = normalizeGrade1Answer;

export function isGrade1ShapeAnswerMatch(expected: string, actual: string) {
  return isGrade1AnswerMatch(expected, actual);
}

export function isGrade1ShapeName(topicTitle: string) {
  return GRADE1_SHAPE_NAMES.has(normalizeGrade1ShapeAnswer(topicTitle));
}

const GRADE1_SHAPE_NAMES = new Set([
  "circle",
  "square",
  "triangle",
  "rectangle",
]);
