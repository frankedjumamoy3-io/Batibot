import type { Grade1ReadingWorldConfig } from "./types";

export const GRADE1_READING_WORLD_ID = "grade1-reading";

export const GRADE1_READING_WORLD_CONFIG: Grade1ReadingWorldConfig = {
  id: GRADE1_READING_WORLD_ID,
  title: "Reading Quest",
  emoji: "\uD83D\uDCD6",
  accentColor: "#2563EB",
  description:
    "Practice sight words, simple sentences, short passages, and comprehension questions.",
  activities: [
    "Sight word reading",
    "Sentence building",
    "Passage listening",
    "Comprehension questions",
    "Mixed reading challenge",
  ],
  topics: [
    {
      assetId: "words",
      title: "Words",
      emoji: "WORD",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Sight words are words we see often.",
    },
    {
      assetId: "sentences",
      title: "Sentences",
      emoji: "SENT",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Sentence Activity", "Match Activity", "Drag and Drop Activity"],
      example: "A sentence tells a complete idea.",
    },
    {
      assetId: "reading-passage",
      title: "Reading Passage",
      emoji: "BOOK",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Story-Based Activity", "Sequence Activity", "Match Activity"],
      example: "Read The boy runs in the park and find story parts.",
    },
    {
      assetId: "reading-comprehension",
      title: "Reading Comprehension",
      emoji: "Q",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Question Activity", "Match Activity", "Story-Based Activity"],
      example: "Who: boy. What: run. Where: park. When: morning.",
    },
    {
      assetId: "reading-challenge",
      title: "Reading Challenge",
      emoji: "BADGE",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Mastery Challenge", "Sequence Activity", "Match Activity"],
      example: "Review words, sentences, passage, and question words.",
    },
  ],
};
