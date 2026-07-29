import type { Grade2PlaceValueWorldConfig } from "./types";

export const GRADE2_PLACE_VALUE_WORLD_ID = "grade2-place-value";

export const GRADE2_PLACE_VALUE_WORLD_CONFIG: Grade2PlaceValueWorldConfig = {
  id: GRADE2_PLACE_VALUE_WORLD_ID,
  title: "Place Value City",
  emoji: "🏙️",
  accentColor: "#0EA5E9",
  description: "Build and explain numbers using ones, tens, hundreds, and expanded form.",
  activities: ["Place value builder","Number blocks","Expanded form","Mini challenge"],
  topics: [
    {
      assetId: "ones",
      title: "Ones",
      emoji: "1",
      category: "numeric",
      subcategory: "place-value",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
    },
    {
      assetId: "tens",
      title: "Tens",
      emoji: "10",
      category: "numeric",
      subcategory: "place-value",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
    },
    {
      assetId: "hundreds",
      title: "Hundreds",
      emoji: "100",
      category: "numeric",
      subcategory: "place-value",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
    },
    {
      assetId: "expanded-form",
      title: "Expanded Form",
      emoji: "100+",
      category: "numeric",
      subcategory: "place-value",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
      example: "Show a number as hundreds, tens, and ones.",
    },
    {
      assetId: "place-value-challenge",
      title: "Place Value Challenge",
      emoji: "BADGE",
      category: "numeric",
      subcategory: "place-value",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
      example: "Build, compare, and explain three-digit numbers.",
    }
  ],
};
