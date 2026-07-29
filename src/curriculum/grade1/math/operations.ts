import type { Grade1MathContent } from "./types";
import { getGrade1MathTopicKey } from "./topics";

export const GRADE1_MATH_CONTENT: Record<string, Grade1MathContent> = {
  "addition-facts": {
    meaning: "Addition facts show putting numbers together to make a total.",
    pronunciation: "addition facts",
    examples: ["2 + 3 = 5", "4 + 1 = 5"],
  },
  "subtraction-facts": {
    meaning: "Subtraction facts show taking away from a number.",
    pronunciation: "subtraction facts",
    examples: ["5 - 2 = 3", "8 - 1 = 7"],
  },
  "number-sentences": {
    meaning: "A number sentence uses numbers and symbols to show a math idea.",
    pronunciation: "number sentences",
    examples: ["3 + 2 = 5", "7 - 4 = 3"],
  },
  "math-challenge": {
    meaning:
      "Math challenge uses addition, subtraction, and number sentences together.",
    pronunciation: "math challenge",
    examples: ["Build an addition sentence.", "Take away counters."],
  },
};

export function getGrade1MathContent(topicTitle: string) {
  return GRADE1_MATH_CONTENT[getGrade1MathTopicKey(topicTitle)];
}
