import type { Grade1NumberContent } from "./types";
import { getGrade1NumberTopicKey } from "./topics";

export const GRADE1_NUMBER_RANGE = {
  min: 1,
  max: 100,
};

export const GRADE1_NUMBER_CONTENT: Record<string, Grade1NumberContent> = {
  "numbers-1-100": {
    meaning: "Numbers 1 to 100 show counting order and quantity.",
    pronunciation: "numbers one to one hundred",
    examples: ["1", "10", "25", "50", "100"],
  },
  "greater-than": {
    meaning: "Greater than means one number is more than another number.",
    pronunciation: "greater than",
    examples: ["8 > 5", "12 > 9"],
  },
  "less-than": {
    meaning: "Less than means one number is smaller than another number.",
    pronunciation: "less than",
    examples: ["4 < 7", "10 < 15"],
  },
  "equal-to": {
    meaning: "Equal to means two numbers show the same amount.",
    pronunciation: "equal to",
    examples: ["6 = 6", "10 = 10"],
  },
  "number-challenge": {
    meaning:
      "Number challenge uses number order, greater than, less than, and equal to.",
    pronunciation: "number challenge",
    examples: ["Find the greater number.", "Put numbers in order."],
  },
};

export function getGrade1NumberContent(topicTitle: string) {
  return GRADE1_NUMBER_CONTENT[getGrade1NumberTopicKey(topicTitle)];
}
