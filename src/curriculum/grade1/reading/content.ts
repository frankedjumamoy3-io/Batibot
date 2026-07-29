import type { Grade1ReadingContent } from "./types";
import { getGrade1ReadingTopicKey } from "./topics";

export const GRADE1_READING_CONTENT: Record<string, Grade1ReadingContent> = {
  words: {
    meaning: "Sight words are words we see often.",
    pronunciation: "words",
    examples: ["I", "a", "the", "is"],
  },
  sentences: {
    meaning: "A sentence tells a complete idea.",
    pronunciation: "sentences",
    examples: ["I run fast.", "The dog jumps."],
  },
  "reading-passage": {
    meaning: "A passage tells a short story.",
    pronunciation: "reading passage",
    examples: ["The boy runs in the park.", "Character: boy", "Setting: park", "Event: runs"],
  },
  "reading-comprehension": {
    meaning: "Questions help us understand what we read.",
    pronunciation: "reading comprehension",
    examples: ["Who: boy", "What: run", "Where: park", "When: morning"],
  },
  "reading-challenge": {
    meaning: "Use words, sentences, and story clues together.",
    pronunciation: "reading challenge",
    examples: ["the", "I run fast.", "boy", "park"],
  },
};

export function getGrade1ReadingContent(topicTitle: string) {
  return GRADE1_READING_CONTENT[getGrade1ReadingTopicKey(topicTitle)];
}
