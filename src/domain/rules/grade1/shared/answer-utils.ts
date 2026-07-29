export function normalizeGrade1Answer(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isGrade1AnswerMatch(expected: string, actual: string) {
  return normalizeGrade1Answer(expected) === normalizeGrade1Answer(actual);
}
