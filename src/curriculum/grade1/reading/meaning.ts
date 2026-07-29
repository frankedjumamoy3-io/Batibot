const GRADE1_READING_MEANINGS: Record<string, string> = {
  "reading-challenge": "Use words, sentences, and story clues together.",
  "reading-comprehension": "Questions help us understand what we read.",
  "reading-passage": "A passage tells a short story.",
  sentences: "A sentence tells a complete idea.",
  words: "Sight words are words we see often.",
};

export function getScopedGrade1ReadingMeaning(topicTitle: string): string {
  return GRADE1_READING_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
