export function getPatternDistractorChoiceIds(choiceIds: string[], answerId: string) {
  return choiceIds.filter((id) => id !== answerId);
}
