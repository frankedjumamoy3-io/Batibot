const COLOR_MEANINGS: Record<string, string> = {
  black: "A dark color.",
  blue: "A sky color.",
  green: "A leaf color.",
  red: "A bright color.",
  yellow: "A sun color.",
};

export function getColorMeaning(topicTitle: string): string {
  return COLOR_MEANINGS[toMeaningKey(topicTitle)] ?? "A color.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
