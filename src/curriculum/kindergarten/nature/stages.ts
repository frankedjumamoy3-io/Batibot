import { KINDERGARTEN_NATURE_WORLD_ID } from "./config";
import { SCOPED_KINDERGARTEN_NATURE_TOPIC_IDS } from "./topics";
import type {
  KindergartenNatureTopicId,
  KindergartenNatureTopicSupportConfig,
} from "./types";

export function getKindergartenNatureTopicKey(
  topicTitle: string
): KindergartenNatureTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") as KindergartenNatureTopicId;
}

export function isScopedKindergartenNatureTopic(topicTitle: string) {
  return SCOPED_KINDERGARTEN_NATURE_TOPIC_IDS.has(
    getKindergartenNatureTopicKey(topicTitle)
  );
}

export function isScopedKindergartenNatureWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return (
    worldId === KINDERGARTEN_NATURE_WORLD_ID &&
    isScopedKindergartenNatureTopic(topicTitle)
  );
}

export function getKindergartenNatureTopicSupport(
  topicTitle: string
): KindergartenNatureTopicSupportConfig | null {
  if (!isScopedKindergartenNatureTopic(topicTitle)) {
    return null;
  }

  const challengePrompt =
    topicTitle === "Sun" || topicTitle === "Moon"
      ? "Is it day or night?"
      : "What do you see?";

  return {
    audioPrompt: `This is ${topicTitle}.`,
    competencyFocus: ["Oral Language", "Early Reading"],
    oralPrompt: `Say ${topicTitle}.`,
    pictureMatch: [`${topicTitle} picture`],
    target: topicTitle,
    wordMatch: [topicTitle],
    stagePrompts: {
      Interact: "What do you see?",
      Practice: `Tap the ${topicTitle}.`,
      Challenge: challengePrompt,
    },
    example: `What do you see? Tap the nature object: ${topicTitle}.`,
    interactionTypes: ["Listening Activity", "Tap Activity", "Match Activity", "Timed Challenge"],
  };
}
