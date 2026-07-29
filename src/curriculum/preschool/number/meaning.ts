const NUMBER_MEANINGS: Record<string, string> = {
  one: "One item.",
  two: "Two items.",
  three: "Three items.",
  four: "Four items.",
  five: "Five items.",
};

export function getNumberMeaning(topicTitle: string): string {
  return NUMBER_MEANINGS[toMeaningKey(topicTitle)] ?? "A number.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/^number-?/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
