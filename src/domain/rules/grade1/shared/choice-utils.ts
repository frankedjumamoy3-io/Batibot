export function getGrade1FriendlyDistractors(
  correctAnswer: string,
  distractorPool: string[]
) {
  return distractorPool.filter(
    (choice) =>
      normalizeChoice(choice) !== normalizeChoice(correctAnswer)
  );
}

function normalizeChoice(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
