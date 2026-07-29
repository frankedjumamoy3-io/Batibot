import type { Grade1WordWorldConfig } from "./types";

export const GRADE1_WORD_WORLD_ID = "grade1-word-kingdom";

export const GRADE1_WORD_WORLD_CONFIG: Grade1WordWorldConfig = {
  id: GRADE1_WORD_WORLD_ID,
  title: "Word Kingdom",
  emoji: "\uD83C\uDFF0",
  accentColor: "#7C2EF2",
  description:
    "Use picture-supported words for naming, actions, descriptions, opposites, and similar meanings.",
  activities: ["Picture-word matching", "Meaning choices", "Drag words"],
  topics: [
    {
      assetId: "noun",
      title: "Noun",
      emoji: "N",
      category: "linguistic",
      subcategory: "vocabulary",
      interactionTypes: [
        "Word Relationship Activity",
        "Match Activity",
        "Drag and Drop Activity",
      ],
      example: "A noun is a name of a person, animal, place, or thing.",
    },
    {
      assetId: "action-words",
      title: "Action Words",
      emoji: "V",
      category: "linguistic",
      subcategory: "actions",
      interactionTypes: [
        "Word Relationship Activity",
        "Match Activity",
        "Drag and Drop Activity",
      ],
      example: "Action words tell what someone or something does.",
    },
    {
      assetId: "describing-words",
      title: "Describing Words",
      emoji: "A",
      category: "linguistic",
      subcategory: "vocabulary",
      interactionTypes: [
        "Word Relationship Activity",
        "Match Activity",
        "Drag and Drop Activity",
      ],
      example: "Describing words tell what something is like.",
    },
    {
      assetId: "opposite-words",
      title: "Opposite Words",
      emoji: "OP",
      category: "linguistic",
      subcategory: "vocabulary",
      interactionTypes: [
        "Word Relationship Activity",
        "Match Activity",
        "Drag and Drop Activity",
      ],
      example: "Opposite words have different meanings.",
    },
    {
      assetId: "similar-words",
      title: "Similar Words",
      emoji: "SIM",
      category: "linguistic",
      subcategory: "vocabulary",
      interactionTypes: [
        "Word Relationship Activity",
        "Match Activity",
        "Drag and Drop Activity",
      ],
      example: "Similar words mean almost the same thing.",
    },
    {
      assetId: "word-challenge",
      title: "Word Challenge",
      emoji: "BADGE",
      category: "linguistic",
      subcategory: "vocabulary",
      interactionTypes: [
        "Word Relationship Activity",
        "Drag and Drop Activity",
        "Mastery Challenge",
      ],
      example: "Use known Grade 1 words in a mixed picture-word mission.",
    },
  ],
};
