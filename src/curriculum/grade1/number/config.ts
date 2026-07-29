import type { Grade1NumberWorldConfig } from "./types";

export const GRADE1_NUMBER_WORLD_ID = "grade1-number-kingdom";

export const GRADE1_NUMBER_WORLD_CONFIG: Grade1NumberWorldConfig = {
  id: GRADE1_NUMBER_WORLD_ID,
  title: "Number Kingdom",
  emoji: "100",
  accentColor: "#22C55E",
  description:
    "Build number understanding with 1 to 100, comparing, and skip counting.",
  activities: [
    "Read numbers",
    "Compare numbers",
    "Match number symbols",
    "Skip counting",
  ],
  topics: [
    {
      assetId: "number-100",
      title: "Numbers 1-100",
      emoji: "100",
      category: "numeric",
      subcategory: "numbers",
      interactionTypes: ["Counting Activity", "Sequence Activity"],
    },
    {
      assetId: "comparing-numbers",
      title: "Comparing Numbers",
      emoji: "< >",
      category: "numeric",
      subcategory: "comparing",
      interactionTypes: ["Counting Activity", "Match Activity"],
      example: "Compare numbers with greater than, less than, and equal to.",
    },
    {
      assetId: "skip-counting",
      title: "Skip Counting",
      emoji: "2s",
      category: "numeric",
      subcategory: "patterns",
      interactionTypes: ["Sequence Activity", "Match Activity"],
      example: "Count by 2s, 5s, and 10s.",
    },
  ],
};
