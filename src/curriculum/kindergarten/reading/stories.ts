import type { KindergartenReadingStory } from "./types";

export const KINDERGARTEN_READING_STORIES: KindergartenReadingStory[] = [
  {
    title: "Story Sequencing",
    events: ["First", "Next", "Then", "Last"],
  },
];

export function getKindergartenReadingStory(title: string) {
  return KINDERGARTEN_READING_STORIES.find(
    (story) => story.title === title
  );
}
