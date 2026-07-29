import { getShapeTopicKey } from "@/src/curriculum/preschool/shape";

const TRY_DISTRACTORS: Record<string, string> = {
  circle: "Square",
  square: "Rectangle",
  triangle: "Star",
  rectangle: "Square",
  star: "Circle",
  "shape-challenge": "Toy",
  "shape-builder-challenge": "Toy",
};

export function getShapeTryDistractor(topicTitle: string) {
  return TRY_DISTRACTORS[getShapeTopicKey(topicTitle)] ?? "Square";
}
