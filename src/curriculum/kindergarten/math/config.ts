import type { KindergartenMathWorldConfig } from "./types";

export const KINDERGARTEN_MATH_WORLD_ID = "kindergarten-number-adventure";

export const KINDERGARTEN_MATH_WORLD_CONFIG: KindergartenMathWorldConfig = {
  id: KINDERGARTEN_MATH_WORLD_ID,
  title: "Math Adventure",
  emoji: "LADDER",
  accentColor: "#F59E0B",
  description:
    "Use number names, matching, comparison, and before-after reasoning in active math missions.",
  activities: [
    "Number race",
    "Number ladder",
    "Compare numbers",
    "Number treasure hunt",
  ],
  topics: [
    {
      assetId: "number-names",
      title: "Number Names",
      emoji: "NAME",
      category: "numeric",
      subcategory: "numbers",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Match spoken and written number names.",
    },
    {
      assetId: "number-matching",
      title: "Number Matching",
      emoji: "MATCH",
      category: "numeric",
      subcategory: "numbers",
      interactionTypes: ["Counting Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Match numbers to quantities and names.",
    },
    {
      assetId: "number-comparison",
      title: "Number Comparison",
      emoji: "VS",
      category: "numeric",
      subcategory: "comparing",
      interactionTypes: ["Counting Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Compare two numbers to find greater, less, or equal.",
    },
    {
      assetId: "before-and-after-numbers",
      title: "Before and After Numbers",
      emoji: "<>",
      category: "numeric",
      subcategory: "numbers",
      interactionTypes: ["Sequence Activity", "Puzzle Activity", "Drag and Drop Activity"],
      example: "Find the number before and after.",
    },
    {
      assetId: "number-adventure-challenge",
      title: "Number Adventure Challenge",
      emoji: "BADGE",
      category: "numeric",
      subcategory: "numbers",
      interactionTypes: ["Sequence Activity", "Drag and Drop Activity", "Mastery Challenge"],
      example: "Complete the number race, ladder, and treasure hunt.",
    },
  ],
};
