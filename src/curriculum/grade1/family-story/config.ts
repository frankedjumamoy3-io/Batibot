import type { Grade1FamilyStoryWorldConfig } from "./types";

export const GRADE1_FAMILY_STORY_WORLD_ID = "grade1-family-story-village";

export const GRADE1_FAMILY_STORY_WORLD_CONFIG: Grade1FamilyStoryWorldConfig = {
  id: GRADE1_FAMILY_STORY_WORLD_ID,
  title: "Family Story Village",
  emoji: "\uD83D\uDCDA",
  accentColor: "#DB2777",
  description: "Bridge family vocabulary into simple sentences and story words.",
  activities: ["Picture-word matching", "Sentence builder", "Story-based activity"],
  topics: [
    {
      assetId: "family-stories",
      title: "Family Stories",
      emoji: "F",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Story-Based Activity", "Sentence Activity"],
    },
    {
      assetId: "family-sentences",
      title: "Family Sentences",
      emoji: "S",
      category: "linguistic",
      subcategory: "reading",
      interactionTypes: ["Sentence Activity", "Puzzle Activity"],
    },
    {
      assetId: "story-characters",
      title: "Story Characters",
      emoji: "C",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Story-Based Activity", "Match Activity"],
    },
    {
      assetId: "family-story-challenge",
      title: "Family Story Challenge",
      emoji: "BADGE",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: [
        "Story-Based Activity",
        "Sentence Activity",
        "Mastery Challenge",
      ],
      example: "Read, arrange, and solve a family story mission.",
    },
  ],
};
