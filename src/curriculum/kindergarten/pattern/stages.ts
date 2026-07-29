import { KINDERGARTEN_PATTERN_WORLD_ID } from "./config";
import { getKindergartenPatternTopicConfig, getKindergartenPatternTopicKey } from "./topics";
import { getKindergartenPatternSequence } from "./patterns";
import type {
  KindergartenPatternStageMetadata,
  KindergartenPatternTopicSupportConfig,
} from "./types";

export function isScopedKindergartenPatternTopic(topicTitle: string) {
  return Boolean(getKindergartenPatternTopicConfig(topicTitle));
}

export function isScopedKindergartenPatternWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return (
    worldId === KINDERGARTEN_PATTERN_WORLD_ID &&
    isScopedKindergartenPatternTopic(topicTitle)
  );
}

export function getKindergartenPatternTopicSupport(
  topicTitle: string
): KindergartenPatternTopicSupportConfig | null {
  const topic = getKindergartenPatternTopicConfig(topicTitle);

  if (!topic) {
    return null;
  }

  const supportPatternType =
    topic.title === "Number Patterns"
      ? "ABC"
      : topic.title === "Shape Patterns"
        ? "AAB"
        : "AB";

  return {
    audioPrompt: "Listen to the pattern.",
    competencyFocus: ["Foundational Numeracy", "Oral Language"],
    oralPrompt: "What comes next?",
    patternType: supportPatternType,
    target: topic.title,
    wordMatch: [topic.title],
    stagePrompts: {
      Discover: `${supportPatternType} patterns repeat.`,
      Interact: "Tap the pattern parts.",
      Practice: "What comes next?",
      Challenge: "Tap the missing part.",
    },
    example: `${supportPatternType} pattern. What comes next? Tap the missing part.`,
    interactionTypes: [
      "Sequence Activity",
      "Tap Activity",
      "Match Activity",
      "Drag and Drop Activity",
      "Puzzle Activity",
      "Timed Challenge",
    ],
  };
}

export function getKindergartenPatternStageMetadata(
  topicTitle: string
): KindergartenPatternStageMetadata | Record<string, never> {
  const topic = getKindergartenPatternTopicConfig(topicTitle);

  if (!topic) {
    return {};
  }

  const sequence = getKindergartenPatternSequence(topic.patternKey);
  const objectTypes = sequence?.choices.map((choice) => choice.assetId) ?? [
    topic.assetId,
  ];

  return {
    patternChallengeTypes:
      getKindergartenPatternTopicKey(topicTitle) === "pattern-challenge"
        ? ["AB", "AAB", "ABB", "ABC"]
        : undefined,
    patternObjectTypes: objectTypes,
    patternType: topic.patternType,
  };
}

export function getKindergartenPatternIntroCopy() {
  return {
    description: "A pattern repeats in order. We can find what comes next.",
    title: "Meet Pattern Playground.",
  };
}

export function getKindergartenPatternLessonDescription() {
  return "A pattern repeats in order. Find what comes next.";
}
