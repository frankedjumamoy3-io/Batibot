const COUNTING_MEANINGS: Record<string, string> = {
  "count-1": "Count one.",
  "count-2": "Count two.",
  "count-3": "Count three.",
  "count-4": "Count four.",
  "count-5": "Count five.",
};

export function getCountingMeaning(topicTitle: string): string {
  return COUNTING_MEANINGS[toMeaningKey(topicTitle)] ?? "Count the group.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
