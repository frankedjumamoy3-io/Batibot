import { getShapeTopicKey } from "./stages";

const SHAPE_MEANINGS: Record<string, string> = {
  circle: "Round shape.",
  square: "Four equal sides.",
  triangle: "Three sides.",
  rectangle: "Long four sides.",
  star: "Five points.",
  "shape-challenge": "Build shapes.",
  "shape-builder-challenge": "Build shapes.",
};

export function getShapeMeaning(topicTitle: string) {
  return SHAPE_MEANINGS[getShapeTopicKey(topicTitle)] ?? `${topicTitle}.`;
}
