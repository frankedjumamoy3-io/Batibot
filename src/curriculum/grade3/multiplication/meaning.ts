const GRADE3_MULTIPLICATION_MEANINGS: Record<string, string> = {
  "multiplication-facts": "Multiplication facts help solve products quickly.",
  "multiplication-patterns": "Multiplication patterns help predict products.",
  "multiplication-word-problems": "Multiplication word problems use equal groups.",
};

export function getScopedGrade3MultiplicationMeaning(topicTitle: string): string {
  return GRADE3_MULTIPLICATION_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
