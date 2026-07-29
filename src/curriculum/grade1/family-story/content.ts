import type { Grade1FamilyStoryContent } from "./types";
import { getGrade1FamilyStoryTopicKey } from "./topics";

export const GRADE1_FAMILY_STORY_CONTENT: Record<
  string,
  Grade1FamilyStoryContent
> = {
  "family-stories": {
    meaning: "A family story tells who is in the story, what they do, and what happens next.",
    pronunciation: "family stories",
    examples: ["Ana helped Mother cook soup.", "The family ate together."],
  },
  "family-sentences": {
    meaning: "Family sentences tell about family people and actions.",
    pronunciation: "family sentences",
    examples: ["Mother cooks dinner.", "Father reads a book."],
  },
  "story-characters": {
    meaning: "A story character is who the story is about.",
    pronunciation: "story characters",
    examples: ["Ana", "Mother", "Father", "Baby"],
  },
  "family-story-challenge": {
    meaning: "Family story missions use characters, actions, and events together.",
    pronunciation: "family story challenge",
    examples: ["Ana helped.", "Mother cooked.", "The family ate."],
  },
};

export function getGrade1FamilyStoryContent(topicTitle: string) {
  return GRADE1_FAMILY_STORY_CONTENT[
    getGrade1FamilyStoryTopicKey(topicTitle)
  ];
}
