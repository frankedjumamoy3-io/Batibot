const PATTERN_MEANINGS: Record<string, string> = {
  "ab-pattern": "Repeats two parts.",
  "abc-pattern": "Repeats three parts.",
  pattern: "Repeats again.",
};

export function getPatternMeaning(topicTitle: string): string {
  return PATTERN_MEANINGS[toMeaningKey(topicTitle)] ?? "Repeats again.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
