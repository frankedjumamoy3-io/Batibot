import type { Grade2VocabularyWorldConfig } from "./types";

export const GRADE2_VOCABULARY_WORLD_ID = "grade2-vocabulary";

export const GRADE2_VOCABULARY_WORLD_CONFIG: Grade2VocabularyWorldConfig = {
  id: GRADE2_VOCABULARY_WORLD_ID,
  title: "Vocabulary Village",
  emoji: "🏘️",
  accentColor: "#7C2EF2",
  description: "Build vocabulary with word relationships, compound words, categories, and review missions.",
  activities: ["Word puzzles","Category sorting","Timed challenges","Story problems"],
  topics: [
    {
      assetId: "synonyms",
      title: "Synonyms",
      emoji: "S",
      category: "linguistic",
      subcategory: "vocabulary",
      interactionTypes: ["Word Relationship Activity","Match Activity"],
      example: "Synonyms have the same or nearly the same meaning.",
    },
    {
      assetId: "antonyms",
      title: "Antonyms",
      emoji: "A",
      category: "linguistic",
      subcategory: "vocabulary",
      interactionTypes: ["Word Relationship Activity","Match Activity"],
      example: "Antonyms have opposite meanings.",
    },
    {
      assetId: "compound-words",
      title: "Compound Words",
      emoji: "C",
      category: "linguistic",
      subcategory: "vocabulary",
      interactionTypes: ["Word Relationship Activity","Puzzle Activity"],
      example: "Compound words join two words to make a new word.",
    },
    {
      assetId: "categories",
      title: "Categories",
      emoji: "CAT",
      category: "linguistic",
      subcategory: "vocabulary",
      interactionTypes: ["Word Relationship Activity","Match Activity","Puzzle Activity"],
      example: "Sort animals, fruits, food, school objects, and transportation into groups.",
    },
    {
      assetId: "vocabulary-challenge",
      title: "Vocabulary Challenge",
      emoji: "BADGE",
      category: "linguistic",
      subcategory: "vocabulary",
      interactionTypes: ["Word Relationship Activity","Sentence Activity","Mastery Challenge"],
      example: "Combine synonyms, antonyms, compound words, and categories.",
    }
  ],
};
