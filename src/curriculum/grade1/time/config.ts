import type { Grade1TimeWorldConfig } from "./types";

export const GRADE1_TIME_WORLD_ID = "grade1-time-town";

export const GRADE1_TIME_WORLD_CONFIG: Grade1TimeWorldConfig = {
  id: GRADE1_TIME_WORLD_ID,
  title: "Time Town",
  emoji: "\uD83D\uDD52",
  accentColor: "#14B8A6",
  description: "Learn clocks and daily time words through matching and routines.",
  activities: ["Tap clock", "Match time word", "Sequence the day"],
  topics: [
    {
      assetId: "hour",
      title: "Hour",
      emoji: "\u23F0",
      category: "numeric",
      subcategory: "measurement",
      interactionTypes: ["Tap Activity", "Sequence Activity"],
    },
    {
      assetId: "half-hour",
      title: "Half Hour",
      emoji: "30",
      category: "numeric",
      subcategory: "measurement",
      interactionTypes: ["Tap Activity", "Sequence Activity"],
      example: "Half hour means thirty minutes after the hour.",
    },
    {
      assetId: "morning",
      title: "Morning",
      emoji: "\uD83C\uDF05",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Sequence Activity", "Story-Based Activity"],
    },
    {
      assetId: "afternoon",
      title: "Afternoon",
      emoji: "\u2600\uFE0F",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Sequence Activity", "Story-Based Activity"],
    },
    {
      assetId: "evening",
      title: "Evening",
      emoji: "\uD83C\uDF06",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Sequence Activity", "Story-Based Activity"],
    },
  ],
};
