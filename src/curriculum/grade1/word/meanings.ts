import type { Grade1WordMeaning } from "./types";
import { getGrade1WordTopicKey } from "./topics";

export const GRADE1_WORD_MEANINGS: Record<string, Grade1WordMeaning> = {
  noun: {
    meaning: "A noun is a name.",
    pronunciation: "noun",
    examples: ["boy", "dog", "school", "ball"],
  },
  "action-words": {
    meaning: "Action words tell what someone or something does.",
    pronunciation: "action words",
    examples: ["run", "jump", "read", "write"],
  },
  "describing-words": {
    meaning: "Describing words tell what something is like.",
    pronunciation: "describing words",
    examples: ["big", "small", "tall", "happy"],
  },
  "opposite-words": {
    meaning: "Opposite words have different meanings.",
    pronunciation: "opposite words",
    examples: ["big and small", "hot and cold"],
  },
  "similar-words": {
    meaning: "Similar words mean almost the same thing.",
    pronunciation: "similar words",
    examples: ["big and large", "happy and glad"],
  },
  "word-challenge": {
    meaning: "Known words can name, show actions, describe, or relate by meaning.",
    pronunciation: "word challenge",
    examples: ["teacher", "run", "big", "small"],
  },
};

export function getGrade1WordMeaning(topicTitle: string) {
  return GRADE1_WORD_MEANINGS[getGrade1WordTopicKey(topicTitle)];
}
