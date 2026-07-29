const GRADE1_SHAPE_MEANINGS: Record<string, string> = {
  "2d-shapes": "2D shapes are flat shapes.",
  "3d-shapes": "3D shapes are solid shapes.",
  circle: "A circle is round and has no corners.",
  rectangle: "A rectangle has four sides.",
  "shape-properties": "Shape properties describe sides, corners, and faces.",
  square: "A square has four equal sides.",
  triangle: "A triangle has three sides.",
};

export function getScopedGrade1ShapeMeaning(topicTitle: string): string {
  return GRADE1_SHAPE_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
