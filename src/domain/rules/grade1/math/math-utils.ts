import { isGrade1AnswerMatch, normalizeGrade1Answer } from "@/src/domain/rules/grade1/shared";

export const normalizeGrade1MathAnswer = normalizeGrade1Answer;

export function isGrade1MathAnswerMatch(expected: string, actual: string) {
  return isGrade1AnswerMatch(expected, actual);
}

export function isGrade1OperationTopic(topicTitle: string) {
  const normalized = normalizeGrade1MathAnswer(topicTitle);

  return (
    normalized === "addition facts" ||
    normalized === "subtraction facts" ||
    normalized === "number sentences"
  );
}
