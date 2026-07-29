import type { KindergartenNatureWorldConfig } from "./types";

export const KINDERGARTEN_NATURE_WORLD_ID = "kindergarten-nature";

export const KINDERGARTEN_NATURE_WORLD_CONFIG: KindergartenNatureWorldConfig = {
  id: KINDERGARTEN_NATURE_WORLD_ID,
  title: "Nature World",
  emoji: "\uD83C\uDF33",
  accentColor: "#22C55E",
  description:
    "Care for plants, flowers, trees, weather, and animals in nature.",
  activities: [
    "Water plants",
    "Grow flowers",
    "Match weather",
    "Explore animals",
    "Build nature scene",
  ],
  topics: [
    {
      assetId: "plants",
      title: "Plants",
      emoji: "PLANT",
      category: "linguistic",
      subcategory: "nature",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Plants grow with water, light, and care.",
    },
    {
      assetId: "animals",
      title: "Animals In Nature",
      emoji: "ANIMAL",
      category: "linguistic",
      subcategory: "nature",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Animals are living parts of nature.",
    },
    {
      assetId: "weather",
      title: "Weather",
      emoji: "WEATHER",
      category: "linguistic",
      subcategory: "nature",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Weather can be sunny, cloudy, rainy, or windy.",
    },
    {
      assetId: "trees",
      title: "Trees",
      emoji: "TREE",
      category: "linguistic",
      subcategory: "nature",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Trees are large plants with trunks and branches.",
    },
    {
      assetId: "flowers",
      title: "Flowers",
      emoji: "FLOWER",
      category: "linguistic",
      subcategory: "nature",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Flowers grow in many colors.",
    },
    {
      assetId: "nature-challenge",
      title: "Nature Challenge",
      emoji: "BADGE",
      category: "linguistic",
      subcategory: "nature",
      interactionTypes: ["Match Activity", "Drag and Drop Activity", "Mastery Challenge"],
      example: "Build and care for a nature scene.",
    },
  ],
};
