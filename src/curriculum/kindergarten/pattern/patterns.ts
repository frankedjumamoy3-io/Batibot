import type { KindergartenPatternSequence } from "./types";

export const KINDERGARTEN_PATTERN_SEQUENCES: Record<
  string,
  KindergartenPatternSequence
> = {
  "kindergarten-colors": {
    answerId: "red",
    patternType: "AB",
    tiles: [
      { id: "red-1", label: "Red", color: "#EF4444", assetId: "red", shape: "square" },
      { id: "blue-1", label: "Blue", color: "#3B82F6", assetId: "blue", shape: "square" },
      { id: "yellow-1", label: "Yellow", color: "#FACC15", assetId: "yellow", shape: "square" },
      { id: "red-2", label: "Red", color: "#EF4444", assetId: "red", shape: "square" },
      { id: "blue-2", label: "Blue", color: "#3B82F6", assetId: "blue", shape: "square" },
    ],
    choices: [
      { id: "red", label: "Red", color: "#EF4444", assetId: "red", shape: "square" },
      { id: "blue", label: "Blue", color: "#3B82F6", assetId: "blue", shape: "square" },
      { id: "yellow", label: "Yellow", color: "#FACC15", assetId: "yellow", shape: "square" },
    ],
  },
  "kindergarten-numbers": {
    answerId: "thirteen",
    patternType: "ABC",
    tiles: [
      { id: "eleven-1", label: "11", color: "#38BDF8", assetId: "number-11", shape: "square" },
      { id: "twelve-1", label: "12", color: "#A855F7", assetId: "number-12", shape: "square" },
      { id: "thirteen-1", label: "13", color: "#F97316", assetId: "number-13", shape: "square" },
      { id: "eleven-2", label: "11", color: "#38BDF8", assetId: "number-11", shape: "square" },
      { id: "twelve-2", label: "12", color: "#A855F7", assetId: "number-12", shape: "square" },
    ],
    choices: [
      { id: "eleven", label: "11", color: "#38BDF8", assetId: "number-11", shape: "square" },
      { id: "twelve", label: "12", color: "#A855F7", assetId: "number-12", shape: "square" },
      { id: "thirteen", label: "13", color: "#F97316", assetId: "number-13", shape: "square" },
    ],
  },
  "kindergarten-objects": {
    answerId: "train",
    patternType: "ABB",
    tiles: [
      { id: "ball-1", label: "Ball", color: "#38BDF8", assetId: "ball", shape: "circle" },
      { id: "car-1", label: "Car", color: "#F97316", assetId: "car", shape: "circle" },
      { id: "train-1", label: "Train", color: "#22C55E", assetId: "train", shape: "circle" },
      { id: "ball-2", label: "Ball", color: "#38BDF8", assetId: "ball", shape: "circle" },
      { id: "car-2", label: "Car", color: "#F97316", assetId: "car", shape: "circle" },
    ],
    choices: [
      { id: "ball", label: "Ball", color: "#38BDF8", assetId: "ball", shape: "circle" },
      { id: "car", label: "Car", color: "#F97316", assetId: "car", shape: "circle" },
      { id: "train", label: "Train", color: "#22C55E", assetId: "train", shape: "circle" },
    ],
  },
  "kindergarten-shapes": {
    answerId: "triangle",
    patternType: "AAB",
    tiles: [
      { id: "circle-1", label: "Circle", color: "#38BDF8", assetId: "circle", shape: "circle" },
      { id: "square-1", label: "Square", color: "#A855F7", assetId: "square", shape: "square" },
      { id: "triangle-1", label: "Triangle", color: "#F97316", assetId: "triangle", shape: "triangle" },
      { id: "circle-2", label: "Circle", color: "#38BDF8", assetId: "circle", shape: "circle" },
      { id: "square-2", label: "Square", color: "#A855F7", assetId: "square", shape: "square" },
    ],
    choices: [
      { id: "circle", label: "Circle", color: "#38BDF8", assetId: "circle", shape: "circle" },
      { id: "square", label: "Square", color: "#A855F7", assetId: "square", shape: "square" },
      { id: "triangle", label: "Triangle", color: "#F97316", assetId: "triangle", shape: "triangle" },
    ],
  },
};

export function getKindergartenPatternSequence(patternKey: string) {
  return KINDERGARTEN_PATTERN_SEQUENCES[patternKey];
}
