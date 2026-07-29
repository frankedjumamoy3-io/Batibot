import { isGrade1AnswerMatch, normalizeGrade1Answer } from "@/src/domain/rules/grade1/shared";

export const normalizeGrade1TimeAnswer = normalizeGrade1Answer;

export function isGrade1TimeAnswerMatch(expected: string, actual: string) {
  return isGrade1AnswerMatch(expected, actual);
}

export function isGrade1TimeWord(topicTitle: string) {
  return GRADE1_TIME_WORDS.has(normalizeGrade1TimeAnswer(topicTitle));
}

const GRADE1_TIME_WORDS = new Set([
  "clock",
  "hour",
  "morning",
  "afternoon",
  "evening",
]);
