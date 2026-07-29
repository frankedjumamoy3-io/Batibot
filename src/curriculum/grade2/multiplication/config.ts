import type { Grade2MultiplicationWorldConfig } from "./types";

export const GRADE2_MULTIPLICATION_WORLD_ID = "grade2-multiplication";

export const GRADE2_MULTIPLICATION_WORLD_CONFIG: Grade2MultiplicationWorldConfig = {
  id: GRADE2_MULTIPLICATION_WORLD_ID,
  title: "Multiplication Workshop",
  emoji: "x",
  accentColor: "#F59E0B",
  description: "Build multiplication through groups, repeated addition, and facts.",
  activities: ["Group builder","Repeated addition","Multiplication fact match"],
  topics: [
    {
      assetId: "equal-groups",
      title: "Equal Groups",
      emoji: "G",
      category: "numeric",
      subcategory: "multiplication",
      interactionTypes: ["Counting Activity","Puzzle Activity"],
    },
    {
      assetId: "repeated-addition",
      title: "Repeated Addition",
      emoji: "+",
      category: "numeric",
      subcategory: "multiplication",
      interactionTypes: ["Counting Activity","Puzzle Activity"],
    },
    {
      assetId: "multiplication-facts",
      title: "Multiplication Facts",
      emoji: "F",
      category: "numeric",
      subcategory: "multiplication",
      interactionTypes: ["Counting Activity","Puzzle Activity","Mastery Challenge"],
      example: "Use equal groups, arrays, and repeated addition to find multiplication facts.",
    },
    {
      assetId: "multiplication-challenge",
      title: "Multiplication Challenge",
      emoji: "BADGE",
      category: "numeric",
      subcategory: "multiplication",
      interactionTypes: ["Counting Activity","Puzzle Activity","Mastery Challenge"],
      example: "Build equal groups, repeated addition, and facts for the same product.",
    }
  ],
};
