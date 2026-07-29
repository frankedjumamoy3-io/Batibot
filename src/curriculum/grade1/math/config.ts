import type { Grade1MathWorldConfig } from "./types";

export const GRADE1_MATH_WORLD_ID = "grade1-math";

export const GRADE1_MATH_WORLD_CONFIG: Grade1MathWorldConfig = {
  id: GRADE1_MATH_WORLD_ID,
  title: "Math Mountain",
  emoji: "\u26F0\uFE0F",
  accentColor: "#FF850F",
  description: "Climb through numbers, addition, and subtraction.",
  activities: ["Drag-and-solve", "Number blocks", "Timed challenge"],
  topics: [
    {
      assetId: "plus",
      title: "Addition",
      emoji: "+",
      category: "numeric",
      subcategory: "adding",
      interactionTypes: ["Counting Activity", "Puzzle Activity"],
    },
    {
      assetId: "minus",
      title: "Subtraction",
      emoji: "-",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Counting Activity", "Puzzle Activity"],
    },
    {
      assetId: "equal-to",
      title: "Number Sentences",
      emoji: "=",
      category: "numeric",
      subcategory: "numbers",
      interactionTypes: ["Sentence Activity", "Puzzle Activity"],
    },
    {
      assetId: "math-challenge",
      title: "Math Challenge",
      emoji: "BADGE",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: [
        "Counting Activity",
        "Puzzle Activity",
        "Mastery Challenge",
      ],
      example:
        "Build and solve addition, subtraction, and number sentences.",
    },
  ],
};
