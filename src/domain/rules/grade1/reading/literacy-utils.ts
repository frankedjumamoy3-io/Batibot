import { isGrade1LiteracyAnswerMatch } from "@/src/domain/rules/grade1/shared";

export function isGrade1ReadingCorrectAnswer(expected: string, actual: string) {
  return isGrade1LiteracyAnswerMatch(expected, actual);
}
