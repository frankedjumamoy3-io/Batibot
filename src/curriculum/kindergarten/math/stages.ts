import { KINDERGARTEN_MATH_WORLD_ID } from "./config";
import { SCOPED_KINDERGARTEN_MATH_TOPIC_IDS } from "./topics";
import type {
  KindergartenMathTopicId,
  KindergartenMathTopicSupportConfig,
} from "./types";

export const KINDERGARTEN_MATH_PROMPTS_BY_TOPIC: Record<string, string> = {
  "Before and After Numbers": "What comes before or after?",
  "Number Adventure Challenge": "Finish the math adventure.",
  "Number Comparison": "Which number is greater?",
  "Number Matching": "Which group matches the number?",
  "Number Names": "Which word names the number?",
};

export function getKindergartenMathTopicKey(
  topicTitle: string
): KindergartenMathTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") as KindergartenMathTopicId;
}

export function isScopedKindergartenMathTopic(topicTitle: string) {
  return SCOPED_KINDERGARTEN_MATH_TOPIC_IDS.has(
    getKindergartenMathTopicKey(topicTitle)
  );
}

export function isScopedKindergartenMathWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return (
    worldId === KINDERGARTEN_MATH_WORLD_ID &&
    isScopedKindergartenMathTopic(topicTitle)
  );
}

export function getKindergartenMathPrompt(topicTitle: string) {
  return KINDERGARTEN_MATH_PROMPTS_BY_TOPIC[topicTitle] ?? `Solve ${topicTitle}.`;
}

export function getKindergartenMathLessonDescription(topicTitle: string) {
  return `${topicTitle} is a math skill for number names, matching, comparing, or order.`;
}

export function getKindergartenMathTopicSupport(
  topicTitle: string
): KindergartenMathTopicSupportConfig | null {
  if (!isScopedKindergartenMathTopic(topicTitle)) {
    return null;
  }

  const prompt = getKindergartenMathPrompt(topicTitle);

  return {
    audioPrompt: `Solve ${topicTitle}.`,
    competencyFocus: ["Foundational Numeracy", "Oral Language"],
    oralPrompt: prompt,
    pictureMatch: ["number mission picture"],
    target: topicTitle,
    wordMatch: [topicTitle],
    stagePrompts: {
      Discover: `Look at ${topicTitle}.`,
      Explore: `Tap ${topicTitle}.`,
      Interact: prompt,
      Practice: prompt,
      Challenge: `Solve ${topicTitle} by yourself.`,
    },
    example: `${prompt} Use number names, groups, comparison, and order.`,
    interactionTypes: [
      "Counting Activity",
      "Match Activity",
      "Sequence Activity",
      "Drag and Drop Activity",
    ],
  };
}
