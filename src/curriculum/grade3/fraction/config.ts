import type { Grade3FractionWorldConfig } from "./types";

export const GRADE3_FRACTION_WORLD_ID = "grade3-fractions";

export const GRADE3_FRACTION_WORLD_CONFIG: Grade3FractionWorldConfig = {
  id: GRADE3_FRACTION_WORLD_ID,
  title: "Fraction Fortress",
  emoji: "½",
  accentColor: "#14B8A6",
  description: "Understand equal parts and fraction names.",
  activities: ["Puzzle quests","Match activity","Mastery challenge"],
  topics: [
    {
      assetId: "equal-parts",
      title: "Equal Parts",
      emoji: "=",
      category: "numeric",
      subcategory: "fractions",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
      example: "Fractions need equal parts.",
    },
    {
      assetId: "1-2",
      title: "1/2",
      emoji: "1/2",
      category: "numeric",
      subcategory: "fractions",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
      example: "Recognize and represent one-half.",
    },
    {
      assetId: "1-3",
      title: "1/3",
      emoji: "1/3",
      category: "numeric",
      subcategory: "fractions",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
      example: "Recognize and represent one-third.",
    },
    {
      assetId: "1-4",
      title: "1/4",
      emoji: "1/4",
      category: "numeric",
      subcategory: "fractions",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
      example: "Recognize and represent one-fourth.",
    },
    {
      assetId: "color-the-fraction",
      title: "Color the Fraction",
      emoji: "C",
      category: "numeric",
      subcategory: "fractions",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
      example: "Color the correct fraction of a whole.",
    },
    {
      assetId: "compare-fractions",
      title: "Compare Fractions",
      emoji: "<>",
      category: "numeric",
      subcategory: "fractions",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
      example: "Compare simple visual fractions.",
    },
    {
      assetId: "fractions-in-real-objects",
      title: "Fractions in Real Objects",
      emoji: "RO",
      category: "numeric",
      subcategory: "fractions",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
      example: "Find fractions in real objects.",
    }
  ],
};
