import type { Grade3NumberWorldConfig } from "./types";

export const GRADE3_NUMBER_WORLD_ID = "grade3-number";

export const GRADE3_NUMBER_WORLD_CONFIG: Grade3NumberWorldConfig = {
  id: GRADE3_NUMBER_WORLD_ID,
  title: "Number Empire",
  emoji: "👑",
  accentColor: "#FF850F",
  description: "Solve multi-step number missions.",
  activities: ["Puzzle quests","Mission challenges","Mastery check"],
  topics: [
    {
      assetId: "multi-step-operations",
      title: "Multi-Digit Addition",
      emoji: "MS",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Multi-Step Problem Activity","Mastery Challenge"],
      example: "Add 3-digit numbers: 345 + 287 = 632.",
    },
    {
      assetId: "addition-and-subtraction-review",
      title: "Multi-Digit Subtraction",
      emoji: "+-",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Multi-Step Problem Activity","Mastery Challenge"],
      example: "Subtract 3-digit numbers: 654 - 278 = 376.",
    },
    {
      assetId: "mixed-operations",
      title: "Number Challenge",
      emoji: "MO",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Multi-Step Problem Activity","Mastery Challenge"],
      example: "Solve addition, subtraction, and pattern review tasks.",
    },
    {
      assetId: "number-patterns",
      title: "Number Patterns",
      emoji: "NP",
      category: "numeric",
      subcategory: "patterns",
      interactionTypes: ["Sequence Activity","Puzzle Activity"],
      example: "Find the rule in a number pattern.",
    },
    {
      assetId: "missing-numbers",
      title: "Missing Numbers",
      emoji: "?",
      category: "numeric",
      subcategory: "patterns",
      interactionTypes: ["Sequence Activity","Puzzle Activity"],
      example: "Find the missing number in a pattern.",
    },
    {
      assetId: "solve-step-1-and-step-2",
      title: "Mixed Number Review",
      emoji: "1-2",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Multi-Step Problem Activity","Mastery Challenge"],
      example: "Solve one number task, then check the next.",
    }
  ],
};
