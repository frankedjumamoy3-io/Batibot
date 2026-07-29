const GRADE2_CHALLENGE_MEANINGS: Record<string, string> = {
  "challenge-arena": "Challenge arena reviews Grade 2 skills.",
};

export function getScopedGrade2ChallengeMeaning(topicTitle: string): string {
  return GRADE2_CHALLENGE_MEANINGS[toMeaningKey(topicTitle)] ?? "Grade 2 challenge reviews known skills.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
