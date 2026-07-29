const FOOD_MEANINGS: Record<string, string> = {
  bread: "Food we eat.",
  egg: "Food we eat.",
  juice: "A drink.",
  milk: "A drink.",
  rice: "Food we eat.",
};

export function getFoodMeaning(topicTitle: string): string {
  return FOOD_MEANINGS[toMeaningKey(topicTitle)] ?? "Food we eat.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
