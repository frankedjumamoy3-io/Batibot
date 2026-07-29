const SHAPE_MEANINGS: Record<string, string> = {
  circle: "A round shape.",
  rectangle: "Has four sides.",
  square: "Has four equal sides.",
  star: "Has points.",
  triangle: "Has three sides.",
};

export function getShapeMeaning(topicTitle: string): string {
  return SHAPE_MEANINGS[toMeaningKey(topicTitle)] ?? "A shape.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
