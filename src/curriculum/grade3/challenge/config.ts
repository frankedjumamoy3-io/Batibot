import type { Grade3ChallengeWorldConfig } from "./types";

export const GRADE3_CHALLENGE_WORLD_ID = "grade3-master";

export const GRADE3_CHALLENGE_WORLD_CONFIG: Grade3ChallengeWorldConfig = {
  id: GRADE3_CHALLENGE_WORLD_ID,
  title: "Master Challenge Arena",
  emoji: "🏆",
  accentColor: "#EF4444",
  description: "Complete reading and math mastery missions.",
  activities: ["Mission challenges","Mastery challenge","Achievement card"],
  topics: [
    {
      assetId: "literacy-mastery-challenge",
      title: "Literacy Mastery Challenge",
      emoji: "L",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Passage Activity","Mastery Challenge"],
      example: "Apply known literacy skills in a mastery task.",
    },
    {
      assetId: "numeracy-mastery-challenge",
      title: "Numeracy Mastery Challenge",
      emoji: "N",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Multi-Step Problem Activity","Mastery Challenge"],
      example: "Apply known numeracy skills in a mastery task.",
    },
    {
      assetId: "context-clue-challenge",
      title: "Context Clue Challenge",
      emoji: "C",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Context Clue Activity","Mastery Challenge"],
    },
    {
      assetId: "story-element-challenge",
      title: "Story Element Challenge",
      emoji: "S",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Passage Activity","Mastery Challenge"],
      example: "Apply known story element skills.",
    },
    {
      assetId: "fraction-challenge",
      title: "Fraction Challenge",
      emoji: "F",
      category: "numeric",
      subcategory: "fractions",
      interactionTypes: ["Puzzle Activity","Mastery Challenge"],
    },
    {
      assetId: "money-challenge",
      title: "Money Challenge",
      emoji: "M",
      category: "numeric",
      subcategory: "money",
      interactionTypes: ["Counting Activity","Mastery Challenge"],
    },
    {
      assetId: "multi-step-operation-challenge",
      title: "Multi-Step Operation Challenge",
      emoji: "MS",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Multi-Step Problem Activity","Mastery Challenge"],
      example: "Apply multi-step operation skills.",
    },
    {
      assetId: "mixed-grand-challenge",
      title: "Mixed Grand Challenge",
      emoji: "G",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Timed Challenge","Mastery Challenge"],
      example: "Complete a mixed literacy and numeracy challenge.",
    }
  ],
};
