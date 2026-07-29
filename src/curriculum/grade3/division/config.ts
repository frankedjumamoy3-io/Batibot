import type { Grade3DivisionWorldConfig } from "./types";

export const GRADE3_DIVISION_WORLD_ID = "grade3-division";

export const GRADE3_DIVISION_WORLD_CONFIG: Grade3DivisionWorldConfig = {
  id: GRADE3_DIVISION_WORLD_ID,
  title: "Division Kingdom",
  emoji: "➗",
  accentColor: "#0EA5E9",
  description: "Share groups equally and solve division puzzles.",
  activities: ["Puzzle quests","Mission challenges","Mastery check"],
  topics: [
    {
      assetId: "division-facts",
      title: "Division Facts",
      emoji: "DF",
      category: "numeric",
      subcategory: "division",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
      example: "Use known division facts.",
    },
    {
      assetId: "equal-sharing",
      title: "Equal Sharing",
      emoji: "ES",
      category: "numeric",
      subcategory: "division",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
      example: "Share objects equally.",
    },
    {
      assetId: "equal-groups",
      title: "Equal Groups",
      emoji: "EG",
      category: "numeric",
      subcategory: "division",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
      example: "Make equal groups.",
    },
    {
      assetId: "division-by-2",
      title: "Division by 2",
      emoji: "/2",
      category: "numeric",
      subcategory: "division",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
    },
    {
      assetId: "division-by-3",
      title: "Division by 3",
      emoji: "/3",
      category: "numeric",
      subcategory: "division",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
    },
    {
      assetId: "division-by-4",
      title: "Division by 4",
      emoji: "/4",
      category: "numeric",
      subcategory: "division",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
    },
    {
      assetId: "division-word-problems",
      title: "Division Word Problems",
      emoji: "W",
      category: "numeric",
      subcategory: "division",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
      example: "Solve a word problem with division.",
    }
  ],
};
