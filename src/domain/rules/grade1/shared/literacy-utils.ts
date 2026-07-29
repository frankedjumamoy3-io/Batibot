import { isGrade1AnswerMatch, normalizeGrade1Answer } from "./answer-utils";

export const normalizeGrade1LiteracyAnswer = normalizeGrade1Answer;

export function isGrade1LiteracyAnswerMatch(expected: string, actual: string) {
  return isGrade1AnswerMatch(expected, actual);
}
