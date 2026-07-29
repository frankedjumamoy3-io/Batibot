import type { KindergartenShapeWorldConfig } from "./types";

export const KINDERGARTEN_SHAPE_WORLD_ID = "kindergarten-shapes";

export const KINDERGARTEN_SHAPE_WORLD_CONFIG: KindergartenShapeWorldConfig = {
  id: KINDERGARTEN_SHAPE_WORLD_ID,
  title: "Shape Kingdom",
  emoji: "\uD83D\uDD37",
  accentColor: "#8B5CF6",
  description:
    "Recognize, trace, construct, and apply shapes in a shape town.",
  activities: [
    "Tap shape",
    "Trace shape",
    "Sort shapes",
    "Shape-object match",
    "Shape hunt",
  ],
  topics: [
    {
      assetId: "circle",
      title: "Circle",
      emoji: "\u26AA",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: ["Tap Activity", "Match Activity", "Puzzle Activity", "Timed Challenge"],
      example: "This is a Circle.",
    },
    {
      assetId: "oval",
      title: "Oval",
      emoji: "\uD83E\uDD5A",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: ["Tap Activity", "Match Activity", "Puzzle Activity", "Timed Challenge"],
    },
    {
      assetId: "square",
      title: "Square",
      emoji: "\u25FC\uFE0F",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: ["Tap Activity", "Match Activity", "Puzzle Activity", "Timed Challenge"],
    },
    {
      assetId: "rectangle",
      title: "Rectangle",
      emoji: "\u25AD",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: ["Tap Activity", "Match Activity", "Puzzle Activity", "Timed Challenge"],
    },
    {
      assetId: "triangle",
      title: "Triangle",
      emoji: "\uD83D\uDD3A",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: ["Tap Activity", "Match Activity", "Puzzle Activity", "Timed Challenge"],
    },
    {
      assetId: "shape-challenge",
      title: "Shape Challenge",
      emoji: "BADGE",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: ["Puzzle Activity", "Drag and Drop Activity", "Mastery Challenge"],
      example: "Build a town with all Kindergarten shapes.",
    },
  ],
};
