import { KINDERGARTEN_MATH_WORLD_CONFIG } from "./config";
import { KINDERGARTEN_NUMBER_WORLD_ID } from "@/src/curriculum/kindergarten/number";
import type { KindergartenMathTopicId } from "./types";

export const KINDERGARTEN_MATH_TOPIC_ORDER =
  KINDERGARTEN_MATH_WORLD_CONFIG.topics.map((topic) => topic.title);

export const SCOPED_KINDERGARTEN_MATH_TOPIC_IDS =
  new Set<KindergartenMathTopicId>([
    "number-names",
    "number-matching",
    "number-comparison",
    "before-and-after-numbers",
    "number-adventure-challenge",
  ]);

export function getKindergartenMathOptions() {
  return [
    {
      assetTopic: "Number 11",
      assetWorldId: KINDERGARTEN_NUMBER_WORLD_ID,
      label: "Number Names",
      meaning: "Number names tell how we say numbers.",
      mission: "Match the number name.",
    },
    {
      assetTopic: "Number 12",
      assetWorldId: KINDERGARTEN_NUMBER_WORLD_ID,
      label: "Number Matching",
      meaning: "Number matching connects a number to a group.",
      mission: "Match the number to the group.",
    },
    {
      assetTopic: "Number 13",
      assetWorldId: KINDERGARTEN_NUMBER_WORLD_ID,
      label: "Number Comparison",
      meaning: "Number comparison tells which number is more or less.",
      mission: "Compare the numbers.",
    },
    {
      assetTopic: "Number 14",
      assetWorldId: KINDERGARTEN_NUMBER_WORLD_ID,
      label: "Before and After",
      meaning: "Before and after show number order.",
      mission: "Put the number in order.",
    },
    {
      assetTopic: "Number 20",
      assetWorldId: KINDERGARTEN_NUMBER_WORLD_ID,
      label: "Number Adventure",
      meaning: "Use number names, matching, comparing, and order.",
      mission: "Finish the math adventure.",
    },
  ];
}
