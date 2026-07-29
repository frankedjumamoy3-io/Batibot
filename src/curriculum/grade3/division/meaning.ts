const GRADE3_DIVISION_MEANINGS: Record<string, string> = {
  "division-facts": "Division facts split a total into equal groups.",
  "division-word-problems": "Division word problems share or group equally.",
  remainders: "A remainder is what is left after equal groups.",
};

export function getScopedGrade3DivisionMeaning(topicTitle: string): string {
  return GRADE3_DIVISION_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
