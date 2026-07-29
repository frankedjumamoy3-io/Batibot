import type { PreschoolShapeTopicId, PreschoolShapeWorldConfig } from "./types";

export const PRESCHOOL_SHAPE_WORLD_ID = "preschool-shape-kingdom";

export const PRESCHOOL_SHAPE_WORLD_CONFIG: PreschoolShapeWorldConfig = {
  id: PRESCHOOL_SHAPE_WORLD_ID,
  title: "Shape Kingdom",
  emoji: "SHAPE",
  accentColor: "#14B8A6",
  description: "See, touch, trace, find, sort, and build with shapes.",
  activities: [
    "Tap matching shapes",
    "Trace shapes",
    "Sort shape objects",
    "Build a house",
  ],
  topics: [
    {
      assetId: "circle",
      title: "Circle",
      emoji: "O",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Circle",
    },
    {
      assetId: "square",
      title: "Square",
      emoji: "[]",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
    },
    {
      assetId: "triangle",
      title: "Triangle",
      emoji: "^",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: ["Tap Activity", "Puzzle Activity", "Drag and Drop Activity"],
    },
    {
      assetId: "rectangle",
      title: "Rectangle",
      emoji: "[]",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
    },
    {
      assetId: "star",
      title: "Star",
      emoji: "*",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: ["Tap Activity", "Puzzle Activity", "Drag and Drop Activity"],
    },
  ],
};

export const PRESCHOOL_SHAPE_TOPIC_ORDER = PRESCHOOL_SHAPE_WORLD_CONFIG.topics.map(
  (topic) => topic.title
);

export const SCOPED_SHAPE_TOPIC_IDS = new Set<PreschoolShapeTopicId>([
  "circle",
  "square",
  "triangle",
  "rectangle",
  "star",
]);
