import type { Grade3StoryWorldConfig } from "./types";

export const GRADE3_STORY_WORLD_ID = "grade3-story-adventure";

export const GRADE3_STORY_WORLD_CONFIG: Grade3StoryWorldConfig = {
  id: GRADE3_STORY_WORLD_ID,
  title: "Story Adventure",
  emoji: "📚",
  accentColor: "#DB2777",
  description: "Understand the structure and meaning of literary texts.",
  activities: ["Story elements","Problem and solution","Story structure","Theme and moral"],
  topics: [
    {
      assetId: "characters-and-setting",
      title: "Characters & Setting",
      emoji: "CS",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Story-Based Activity","Passage Activity"],
      example: "Identify main/supporting characters and where and when the story happens.",
    },
    {
      assetId: "problem-and-solution",
      title: "Problem & Solution",
      emoji: "PS",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Story-Based Activity","Passage Activity"],
      example: "Identify the story problem and how it is solved.",
    },
    {
      assetId: "beginning-middle-and-ending",
      title: "Beginning, Middle & Ending",
      emoji: "BME",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Sequence Activity","Passage Activity"],
      example: "Identify story sequence, structure, and order of events.",
    },
    {
      assetId: "theme-and-moral-lesson",
      title: "Theme & Moral Lesson",
      emoji: "TM",
      category: "linguistic",
      subcategory: "story",
      interactionTypes: ["Story-Based Activity","Passage Activity"],
      example: "Identify the central message and lesson learned from the story.",
    }
  ],
};
