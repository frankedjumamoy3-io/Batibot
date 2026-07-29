import type { Grade3ReadingWorldConfig } from "./types";

export const GRADE3_READING_WORLD_ID = "grade3-reading";

export const GRADE3_READING_WORLD_CONFIG: Grade3ReadingWorldConfig = {
  id: GRADE3_READING_WORLD_ID,
  title: "Reading Quest",
  emoji: "📖",
  accentColor: "#2563EB",
  description: "Develop foundational reading comprehension skills using grade-level texts.",
  activities: ["Word reading","Sentence reading","Passage reading","Core comprehension"],
  topics: [
    {
      assetId: "reading-words",
      title: "Reading Words",
      emoji: "RW",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Passage Activity","Context Clue Activity"],
      example: "Read unfamiliar words, pronounce them correctly, and understand word meaning.",
    },
    {
      assetId: "reading-sentences",
      title: "Reading Sentences",
      emoji: "RS",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Sentence Activity","Passage Activity"],
      example: "Read complete sentences and identify who, what, where, and when.",
    },
    {
      assetId: "reading-passages",
      title: "Reading Passages",
      emoji: "RP",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Passage Activity","Story-Based Activity"],
      example: "Read short stories, informational passages, and everyday texts for details.",
    },
    {
      assetId: "reading-comprehension",
      title: "Reading Comprehension",
      emoji: "RC",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Passage Activity","Sequence Activity","Mastery Challenge"],
      example: "Apply main idea, supporting details, sequence of events, and cause and effect.",
    }
  ],
};
