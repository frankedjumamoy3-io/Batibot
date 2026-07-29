import type { KindergartenReadingWorldConfig } from "./types";

export const KINDERGARTEN_READING_WORLD_ID =
  "kindergarten-reading-readiness";

export const KINDERGARTEN_READING_WORLD_CONFIG: KindergartenReadingWorldConfig = {
  id: KINDERGARTEN_READING_WORLD_ID,
  title: "Reading World",
  emoji: "BOOK",
  accentColor: "#2563EB",
  description:
    "Use picture reading, CVC words, sight words, simple sentences, and story sequencing in active reading missions.",
  activities: [
    "Picture story builder",
    "Build CVC words",
    "Find sight words",
    "Order story pictures",
  ],
  topics: [
    {
      assetId: "picture-reading",
      title: "Picture Reading",
      emoji: "PICTURE",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Story-Based Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Use pictures to understand and arrange a simple story.",
    },
    {
      assetId: "cvc-words",
      title: "CVC Words",
      emoji: "CVC",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Decode simple consonant-vowel-consonant words.",
    },
    {
      assetId: "sight-words",
      title: "Sight Words",
      emoji: "SIGHT",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Recognize common words automatically.",
    },
    {
      assetId: "simple-sentences",
      title: "Simple Sentences",
      emoji: "SENTENCE",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Sentence Activity", "Puzzle Activity", "Drag and Drop Activity"],
      example: "Read and build a sentence with one complete idea.",
    },
    {
      assetId: "story-sequencing",
      title: "Story Sequencing",
      emoji: "ORDER",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Story-Based Activity", "Sequence Activity", "Drag and Drop Activity"],
      example: "Put story pictures and events in order.",
    },
  ],
};
