const FRUIT_MEANINGS: Record<string, string> = {
  apple: "A crunchy fruit.",
  banana: "A yellow fruit.",
  grapes: "Small round fruits.",
  mango: "A sweet fruit.",
  orange: "A juicy fruit.",
};

export function getFruitMeaning(topicTitle: string): string {
  return FRUIT_MEANINGS[toMeaningKey(topicTitle)] ?? "A fruit.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
