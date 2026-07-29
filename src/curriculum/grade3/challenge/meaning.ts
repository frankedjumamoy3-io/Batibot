const GRADE3_CHALLENGE_MEANINGS: Record<string, string> = {
  "master-challenge": "Master challenge reviews Grade 3 skills.",
};

export function getScopedGrade3ChallengeMeaning(topicTitle: string): string {
  return GRADE3_CHALLENGE_MEANINGS[toMeaningKey(topicTitle)] ?? "Grade 3 challenge reviews known skills.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
