import type { KindergartenReadingLesson, KindergartenReadingTopicId } from "./types";

export const KINDERGARTEN_READING_TOPIC_ORDER = [
  "Picture Reading",
  "CVC Words",
  "Sight Words",
  "Simple Sentences",
  "Story Sequencing",
];

export const KINDERGARTEN_READING_LESSONS: Record<
  KindergartenReadingTopicId,
  KindergartenReadingLesson
> = {
  "cvc-words": {
    example: "Cat is a CVC word. Match the cat picture to Cat.",
    meaning: "CVC words have beginning, middle, and ending sounds.",
    pictureMatch: ["Cat", "Dog", "Sun", "Hat"],
    prompt: "Which word has three simple sounds?",
    wordMatch: ["Cat", "Dog", "Sun", "Hat"],
  },
  "picture-reading": {
    example: "Cat is a picture word. Look at the cat picture, then read Cat.",
    meaning: "Pictures help us understand a story.",
    pictureMatch: ["Cat", "Dog", "Sun", "Book"],
    prompt: "What is in the picture?",
    wordMatch: ["Cat", "Dog", "Sun", "Book"],
  },
  "sight-words": {
    example: "See is a sight word. Tap see and read it quickly.",
    meaning: "Sight words are words we know quickly.",
    pictureMatch: ["I", "see", "the", "a"],
    prompt: "Which word do we know quickly?",
    wordMatch: ["I", "see", "the", "a"],
  },
  "simple-sentences": {
    example: "I see a cat. Match the sentence to the cat picture.",
    meaning: "A simple sentence tells one idea.",
    pictureMatch: ["Cat", "Dog", "Book", "Sun"],
    prompt: "Which sentence matches?",
    wordMatch: ["I see a cat.", "I see a dog.", "I read a book.", "The sun is up."],
  },
  "story-sequencing": {
    example:
      "First sun, next book, then write, last home. Put the pictures in order.",
    meaning: "Story sequencing puts events in order.",
    pictureMatch: ["Sun", "Book", "Write", "Home"],
    prompt: "What comes next in the story?",
    wordMatch: ["First", "Next", "Then", "Last"],
  },
};

export const KINDERGARTEN_READING_TARGETS: Record<string, string> = {
  "listening comprehension": "Picture Reading",
  "reading readiness challenge": "Story Sequencing",
  "word recognition": "Sight Words",
};

export const KINDERGARTEN_READING_SCAFFOLD_DESCRIPTIONS: Record<
  string,
  string
> = {
  "CVC Words": "CVC words use simple sounds.",
  "Picture Reading": "Pictures help us understand a story.",
  "Sight Words": "Sight words are words we know quickly.",
  "Simple Sentences": "A simple sentence tells one idea.",
  "Story Sequencing": "Story sequencing puts events in order.",
};

export function getKindergartenReadingTopicKey(
  topicTitle: string
): KindergartenReadingTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") as KindergartenReadingTopicId;
}

export function getKindergartenReadingLesson(topicTitle: string) {
  return KINDERGARTEN_READING_LESSONS[
    getKindergartenReadingTopicKey(topicTitle)
  ];
}

export function getKindergartenReadingMeaning(topicTitle: string) {
  return getKindergartenReadingLesson(topicTitle)?.meaning ?? `${topicTitle}.`;
}

export function getKindergartenReadingScaffoldDescription(topicTitle: string) {
  return (
    KINDERGARTEN_READING_SCAFFOLD_DESCRIPTIONS[topicTitle] ??
    `${topicTitle} helps us read.`
  );
}
