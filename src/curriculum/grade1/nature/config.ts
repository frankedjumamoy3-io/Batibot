import type { Grade1NatureWorldConfig } from "./types";

export const GRADE1_NATURE_WORLD_ID = "grade1-nature";

export const GRADE1_NATURE_WORLD_CONFIG: Grade1NatureWorldConfig = {
  id: GRADE1_NATURE_WORLD_ID,
  title: "Nature Explorer",
  emoji: "\uD83C\uDF3F",
  accentColor: "#22C55E",
  description: "Connect vocabulary to nature observations.",
  activities: [
    "Picture-word matching",
    "Story-based activity",
    "Mini challenge",
  ],
  topics: [
    {
      assetId: "plants",
      title: "Plants",
      emoji: "PL",
      category: "linguistic",
      subcategory: "nature",
      interactionTypes: ["Match Activity", "Sentence Activity"],
      example: "Plants include trees, flowers, grass, and leaves.",
    },
    {
      assetId: "animals",
      title: "Animals",
      emoji: "AN",
      category: "linguistic",
      subcategory: "nature",
      interactionTypes: ["Match Activity", "Sentence Activity"],
      example: "Animals include birds, fish, dogs, and insects.",
    },
    {
      assetId: "weather",
      title: "Weather",
      emoji: "WE",
      category: "linguistic",
      subcategory: "nature",
      interactionTypes: ["Match Activity", "Sentence Activity"],
      example: "Weather can be sunny, rainy, windy, or cloudy.",
    },
    {
      assetId: "land",
      title: "Land",
      emoji: "LA",
      category: "linguistic",
      subcategory: "nature",
      interactionTypes: ["Match Activity", "Sentence Activity"],
      example: "Land can be soil, hills, mountains, and fields.",
    },
    {
      assetId: "water",
      title: "Water",
      emoji: "WA",
      category: "linguistic",
      subcategory: "nature",
      interactionTypes: ["Match Activity", "Sentence Activity"],
      example: "Water can be in rivers, lakes, rain, and ponds.",
    },
  ],
};
