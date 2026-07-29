import type { Grade3MultiplicationWorldConfig } from "./types";

export const GRADE3_MULTIPLICATION_WORLD_ID = "grade3-multiplication";

export const GRADE3_MULTIPLICATION_WORLD_CONFIG: Grade3MultiplicationWorldConfig = {
  id: GRADE3_MULTIPLICATION_WORLD_ID,
  title: "Multiplication Empire",
  emoji: "✖️",
  accentColor: "#7C2EF2",
  description: "Practice multiplication facts and products.",
  activities: ["Timed challenge","Puzzle quest","Mastery challenge"],
  topics: [
    {
      assetId: "multiplication-tables",
      title: "Multiplication Tables",
      emoji: "T",
      category: "numeric",
      subcategory: "multiplication",
      interactionTypes: ["Timed Challenge","Mastery Challenge"],
      example: "Use multiplication tables to find products.",
    },
    {
      assetId: "multiplication-by-2",
      title: "Multiplication by 2",
      emoji: "2x",
      category: "numeric",
      subcategory: "multiplication",
      interactionTypes: ["Timed Challenge","Mastery Challenge"],
    },
    {
      assetId: "multiplication-by-3",
      title: "Multiplication by 3",
      emoji: "3x",
      category: "numeric",
      subcategory: "multiplication",
      interactionTypes: ["Timed Challenge","Mastery Challenge"],
    },
    {
      assetId: "multiplication-by-4",
      title: "Multiplication by 4",
      emoji: "4x",
      category: "numeric",
      subcategory: "multiplication",
      interactionTypes: ["Timed Challenge","Mastery Challenge"],
    },
    {
      assetId: "multiplication-by-5",
      title: "Multiplication by 5",
      emoji: "5x",
      category: "numeric",
      subcategory: "multiplication",
      interactionTypes: ["Timed Challenge","Mastery Challenge"],
    },
    {
      assetId: "multiplication-by-6-to-10",
      title: "Multiplication by 6 to 10",
      emoji: "6-10x",
      category: "numeric",
      subcategory: "multiplication",
      interactionTypes: ["Timed Challenge","Mastery Challenge"],
      example: "Practice multiplication from 6 to 10.",
    },
    {
      assetId: "multiplication-word-problems",
      title: "Multiplication Word Problems",
      emoji: "W",
      category: "numeric",
      subcategory: "multiplication",
      interactionTypes: ["Multi-Step Problem Activity","Mastery Challenge"],
      example: "Apply multiplication in a word problem.",
    },
    {
      assetId: "multiplication-arrays",
      title: "Multiplication Arrays",
      emoji: "A",
      category: "numeric",
      subcategory: "multiplication",
      interactionTypes: ["Multi-Step Problem Activity","Mastery Challenge"],
      example: "Use arrays to model multiplication.",
    }
  ],
};
