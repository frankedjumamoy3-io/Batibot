import { KINDERGARTEN_NUMBER_WORLD_ID } from "./config";
import { getKindergartenNumberValue } from "./numbers";
import { SCOPED_KINDERGARTEN_NUMBER_TOPIC_IDS } from "./topics";
import type {
  KindergartenNumberTopicId,
  KindergartenNumberTopicSupportConfig,
} from "./types";

export function isScopedKindergartenNumberTopic(topicTitle: string) {
  return SCOPED_KINDERGARTEN_NUMBER_TOPIC_IDS.has(
    topicTitle
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") as KindergartenNumberTopicId
  );
}

export function isScopedKindergartenNumberWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return (
    worldId === KINDERGARTEN_NUMBER_WORLD_ID &&
    isScopedKindergartenNumberTopic(topicTitle)
  );
}

export function getKindergartenNumberTopicSupport(
  topicTitle: string
): KindergartenNumberTopicSupportConfig | null {
  if (!isScopedKindergartenNumberTopic(topicTitle)) {
    return null;
  }

  const numberLabel = getKindergartenNumberValue(topicTitle);

  return {
    audioPrompt: numberLabel
      ? `This is Number ${numberLabel}. Count and match ${numberLabel}.`
      : "Complete numbers eleven to twenty.",
    competencyFocus: ["Foundational Numeracy", "Oral Language"],
    moreLess: false,
    oralPrompt: numberLabel ? `Say ${numberLabel}.` : "Count eleven to twenty.",
    pictureMatch: ["forest number scene"],
    target: topicTitle,
    wordMatch: [topicTitle],
    stagePrompts: {
      Discover: numberLabel ? `Look at Number ${numberLabel}.` : "Look at numbers 11 to 20.",
      Interact: numberLabel ? `Tap Number ${numberLabel}.` : "Tap and count.",
      Practice: numberLabel ? `Match ${numberLabel}.` : "Match the numbers.",
      Challenge: numberLabel ? `Choose ${numberLabel}.` : "Finish the number challenge.",
    },
    example: numberLabel
      ? `Number ${numberLabel}. Tap, count, match, and build ${numberLabel}.`
      : "Use numbers 11 to 20 to finish the forest challenge.",
    interactionTypes: [
      "Counting Activity",
      "Tap Activity",
      "Match Activity",
      "Drag and Drop Activity",
      "Timed Challenge",
    ],
  };
}
