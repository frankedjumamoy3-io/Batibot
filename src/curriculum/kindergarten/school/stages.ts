import { KINDERGARTEN_SCHOOL_WORLD_ID } from "./config";
import { SCOPED_KINDERGARTEN_SCHOOL_TOPIC_IDS } from "./topics";
import type {
  KindergartenSchoolTopicId,
  KindergartenSchoolTopicSupportConfig,
} from "./types";

export function getKindergartenSchoolTopicKey(
  topicTitle: string
): KindergartenSchoolTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") as KindergartenSchoolTopicId;
}

export function isScopedKindergartenSchoolTopic(topicTitle: string) {
  return SCOPED_KINDERGARTEN_SCHOOL_TOPIC_IDS.has(
    getKindergartenSchoolTopicKey(topicTitle)
  );
}

export function isScopedKindergartenSchoolWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return (
    worldId === KINDERGARTEN_SCHOOL_WORLD_ID &&
    isScopedKindergartenSchoolTopic(topicTitle)
  );
}

export function getKindergartenSchoolTopicSupport(
  topicTitle: string
): KindergartenSchoolTopicSupportConfig | null {
  if (!isScopedKindergartenSchoolTopic(topicTitle)) {
    return null;
  }

  return {
    audioPrompt: `This is ${topicTitle}.`,
    competencyFocus: ["Oral Language", "Early Reading"],
    oralPrompt: `Say ${topicTitle}.`,
    pictureMatch: [`${topicTitle} picture`],
    target: topicTitle,
    wordMatch: [topicTitle],
    stagePrompts: {
      Interact: "What is this?",
      Practice: `Tap the ${topicTitle}.`,
      Challenge: `Match ${topicTitle} to its word.`,
    },
    example: `What is this? Say ${topicTitle}. Tap the school item.`,
    interactionTypes: ["Listening Activity", "Tap Activity", "Match Activity", "Timed Challenge"],
  };
}
