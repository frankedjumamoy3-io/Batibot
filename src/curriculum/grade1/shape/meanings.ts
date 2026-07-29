import type { Grade1ShapeMeaning } from "./types";
import { getGrade1ShapeTopicKey } from "./topics";

export const GRADE1_SHAPE_MEANINGS: Record<string, Grade1ShapeMeaning> = {
  circle: {
    meaning: "A circle is round and has no corners.",
    pronunciation: "circle",
    examples: ["ball", "wheel", "plate"],
  },
  square: {
    meaning: "A square has four equal sides and four corners.",
    pronunciation: "square",
    examples: ["tile", "window", "block"],
  },
  triangle: {
    meaning: "A triangle has three sides and three corners.",
    pronunciation: "triangle",
    examples: ["roof", "slice", "sign"],
  },
  rectangle: {
    meaning: "A rectangle has four sides and four corners.",
    pronunciation: "rectangle",
    examples: ["door", "book", "table"],
  },
  "shape-challenge": {
    meaning: "Shape challenge uses circle, square, triangle, and rectangle.",
    pronunciation: "shape challenge",
    examples: ["Build with shapes.", "Match real objects to shapes."],
  },
};

export function getGrade1ShapeMeaning(topicTitle: string) {
  return GRADE1_SHAPE_MEANINGS[getGrade1ShapeTopicKey(topicTitle)];
}
