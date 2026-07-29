import type { Grade2StoryWorldConfig } from "./types";

export const GRADE2_STORY_WORLD_ID = "grade2-story";

export const GRADE2_STORY_WORLD_CONFIG: Grade2StoryWorldConfig = {
  id: GRADE2_STORY_WORLD_ID,
  title: "Story Quest",
  emoji: "📚",
  accentColor: "#DB2777",
  description: "Read short stories, identify story parts, and sequence events.",
  activities: ["Story cards","Setting hunt","Sequence activity","Reading response","Mini challenge"],
  topics: [
    {
      assetId: "characters",
      title: "Characters",
      emoji: "C",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Story-Based Activity","Passage Activity"],
      example: "Use actions and words to identify who is in the story.",
    },
    {
      assetId: "setting",
      title: "Setting",
      emoji: "S",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Story-Based Activity","Passage Activity"],
      example: "Find where and when the story happens.",
    },
    {
      assetId: "beginning",
      title: "Beginning",
      emoji: "1",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Sequence Activity","Passage Activity"],
      example: "Tell what happens first in the story.",
    },
    {
      assetId: "middle",
      title: "Middle",
      emoji: "2",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Sequence Activity","Passage Activity"],
      example: "Tell what happens next in the story.",
    },
    {
      assetId: "ending",
      title: "Ending",
      emoji: "3",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Sequence Activity","Passage Activity"],
      example: "Tell how the story finishes.",
    },
    {
      assetId: "story-sequence",
      title: "Story Sequence",
      emoji: "1-2-3",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Sequence Activity","Passage Activity"],
      example: "Arrange beginning, middle, and ending in order.",
    },
    {
      assetId: "story-challenge",
      title: "Story Challenge",
      emoji: "BADGE",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Story-Based Activity","Sequence Activity","Passage Activity","Mastery Challenge"],
      example: "Combine main idea, details, sequence, and character evidence.",
    }
  ],
};
