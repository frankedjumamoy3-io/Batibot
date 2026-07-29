import { isGrade1AnswerMatch, normalizeGrade1Answer } from "@/src/domain/rules/grade1/shared";

export const normalizeGrade1NumberAnswer = normalizeGrade1Answer;

export function isGrade1NumberAnswerMatch(expected: string, actual: string) {
  return isGrade1AnswerMatch(expected, actual);
}

export function isGrade1ComparisonTopic(topicTitle: string) {
  const normalized = normalizeGrade1NumberAnswer(topicTitle);

  return (
    normalized === "greater than" ||
    normalized === "less than" ||
    normalized === "equal to"
  );
}
