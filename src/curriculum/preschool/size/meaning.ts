const SIZE_MEANINGS: Record<string, string> = {
  big: "Large in size.",
  small: "Little in size.",
};

export function getSizeMeaning(topicTitle: string): string {
  return SIZE_MEANINGS[toMeaningKey(topicTitle)] ?? "Compare size.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
