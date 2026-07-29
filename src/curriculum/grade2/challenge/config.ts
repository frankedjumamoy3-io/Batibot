import type { Grade2ChallengeWorldConfig } from "./types";

export const GRADE2_CHALLENGE_WORLD_ID = "grade2-challenge";

export const GRADE2_CHALLENGE_WORLD_CONFIG: Grade2ChallengeWorldConfig = {
  id: GRADE2_CHALLENGE_WORLD_ID,
  title: "Challenge Arena",
  emoji: "🏟️",
  accentColor: "#EF4444",
  description: "Timed practice for vocabulary and numeracy mastery.",
  activities: ["Timed challenges","Mastery challenge","Achievement card"],
  topics: [
    {
      assetId: "mixed-literacy",
      title: "Mixed Literacy",
      emoji: "L",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Passage Activity","Mastery Challenge"],
    },
    {
      assetId: "mixed-numeracy",
      title: "Mixed Numeracy",
      emoji: "N",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Timed Challenge","Mastery Challenge"],
    },
    {
      assetId: "mixed-challenge",
      title: "Mixed Challenge",
      emoji: "M",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Passage Activity","Multi-Step Problem Activity","Mastery Challenge"],
      example: "Switch strategies across literacy and numeracy missions.",
    },
    {
      assetId: "arena-challenge",
      title: "Arena Challenge",
      emoji: "BADGE",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Passage Activity","Multi-Step Problem Activity","Mastery Challenge"],
      example: "Demonstrate evidence and model-based reasoning across Grade 2.",
    }
  ],
};
