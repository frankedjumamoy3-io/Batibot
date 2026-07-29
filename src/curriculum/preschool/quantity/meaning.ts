const QUANTITY_MEANINGS: Record<string, string> = {
  less: "A smaller amount.",
  more: "A bigger amount.",
  same: "An equal amount.",
};

export function getQuantityMeaning(topicTitle: string): string {
  return QUANTITY_MEANINGS[toMeaningKey(topicTitle)] ?? "Compare amounts.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
