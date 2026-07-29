const KINDERGARTEN_SHAPE_MEANINGS: Record<string, string> = {
  circle: "A circle is round.",
  oval: "An oval is a long round shape.",
  rectangle: "A rectangle has four sides.",
  square: "A square has four equal sides.",
  triangle: "A shape with three sides.",
};

export function getKindergartenShapeMeaning(topicTitle: string): string {
  return KINDERGARTEN_SHAPE_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
