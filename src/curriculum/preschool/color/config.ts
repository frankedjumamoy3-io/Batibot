import type { PreschoolColorTopicId, PreschoolVisualWorldConfig } from "./types";

export const PRESCHOOL_COLOR_WORLD_ID = "preschool-colorful-world";

export const PRESCHOOL_COLOR_WORLD_CONFIG: PreschoolVisualWorldConfig = {
  id: PRESCHOOL_COLOR_WORLD_ID,
  title: "My Colorful World",
  emoji: "COLOR",
  accentColor: "#A855F7",
  description: "See, tap, find, sort, paint, collect, and build with colors.",
  activities: [
    "Tap matching colors",
    "Find colors",
    "Sort colored objects",
    "Build a rainbow",
  ],
  topics: [
    {
      assetId: "red",
      title: "Red",
      emoji: "R",
      category: "linguistic",
      subcategory: "colors",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Red",
    },
    {
      assetId: "blue",
      title: "Blue",
      emoji: "B",
      category: "linguistic",
      subcategory: "colors",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
    },
    {
      assetId: "yellow",
      title: "Yellow",
      emoji: "Y",
      category: "linguistic",
      subcategory: "colors",
      interactionTypes: ["Tap Activity", "Puzzle Activity", "Drag and Drop Activity"],
    },
    {
      assetId: "green",
      title: "Green",
      emoji: "G",
      category: "linguistic",
      subcategory: "colors",
      interactionTypes: ["Tap Activity", "Puzzle Activity", "Drag and Drop Activity"],
    },
    {
      assetId: "orange",
      title: "Orange",
      emoji: "O",
      category: "linguistic",
      subcategory: "colors",
      interactionTypes: ["Tap Activity", "Puzzle Activity", "Drag and Drop Activity"],
    },
    {
      assetId: "purple",
      title: "Purple",
      emoji: "P",
      category: "linguistic",
      subcategory: "colors",
      interactionTypes: ["Tap Activity", "Puzzle Activity", "Drag and Drop Activity"],
    },
    {
      assetId: "white",
      title: "White",
      emoji: "W",
      category: "linguistic",
      subcategory: "colors",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
    },
    {
      assetId: "black",
      title: "Black",
      emoji: "B",
      category: "linguistic",
      subcategory: "colors",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
    },
  ],
};

export const PRESCHOOL_COLOR_TOPIC_ORDER = PRESCHOOL_COLOR_WORLD_CONFIG.topics.map(
  (topic) => topic.title
);

export const SCOPED_COLOR_TOPIC_IDS = new Set<PreschoolColorTopicId>([
  "red",
  "blue",
  "yellow",
  "green",
  "orange",
  "purple",
  "white",
  "black",
]);
