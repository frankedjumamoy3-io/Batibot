import type { Grade3ContextClueWorldConfig } from "./types";

export const GRADE3_CONTEXT_CLUE_WORLD_ID = "grade3-context-clue-canyon";

export const GRADE3_CONTEXT_CLUE_WORLD_CONFIG: Grade3ContextClueWorldConfig = {
  id: GRADE3_CONTEXT_CLUE_WORLD_ID,
  title: "Context Clue Canyon",
  emoji: "🔎",
  accentColor: "#7C3AED",
  description: "Develop vocabulary by determining the meaning of unfamiliar words using context.",
  activities: ["Definition clues","Example clues","Synonym and antonym clues","Context challenge"],
  topics: [
    {
      assetId: "definition-clues",
      title: "Definition Clues",
      emoji: "D",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Context Clue Activity","Passage Activity"],
      example: "Meaning is directly stated.",
    },
    {
      assetId: "example-clues",
      title: "Example Clues",
      emoji: "E",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Context Clue Activity","Passage Activity"],
      example: "Meaning is inferred from examples.",
    },
    {
      assetId: "synonym-and-antonym-clues",
      title: "Synonym & Antonym Clues",
      emoji: "SA",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Context Clue Activity","Passage Activity"],
      example: "Meaning is inferred from similar and opposite words.",
    },
    {
      assetId: "context-challenge",
      title: "Context Challenge",
      emoji: "BADGE",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Context Clue Activity","Passage Activity","Mastery Challenge"],
      example: "Use definition, example, synonym, antonym, sentence context, and multiple-meaning clues.",
    }
  ],
};
