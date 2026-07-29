import { KINDERGARTEN_SHAPE_WORLD_ID } from "./config";
import { getKindergartenShapeObjectMatch } from "./meanings";
import { SCOPED_KINDERGARTEN_SHAPE_TOPIC_IDS } from "./topics";
import type {
  KindergartenShapeTopicId,
  KindergartenShapeTopicSupportConfig,
} from "./types";

export function getKindergartenShapeTopicKey(
  topicTitle: string
): KindergartenShapeTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") as KindergartenShapeTopicId;
}

export function isScopedKindergartenShapeTopic(topicTitle: string) {
  return SCOPED_KINDERGARTEN_SHAPE_TOPIC_IDS.has(
    getKindergartenShapeTopicKey(topicTitle)
  );
}

export function isScopedKindergartenShapeWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return (
    worldId === KINDERGARTEN_SHAPE_WORLD_ID &&
    isScopedKindergartenShapeTopic(topicTitle)
  );
}

export function getKindergartenShapeTopicSupport(
  topicTitle: string
): KindergartenShapeTopicSupportConfig | null {
  if (!isScopedKindergartenShapeTopic(topicTitle)) {
    return null;
  }

  const objectMatch = getKindergartenShapeObjectMatch(topicTitle);

  return {
    audioPrompt: `This is a ${topicTitle}.`,
    competencyFocus: ["Foundational Numeracy", "Oral Language"],
    objectMatch,
    oralPrompt: `Say ${topicTitle}.`,
    patternType: undefined,
    pictureMatch: objectMatch ? [topicTitle, objectMatch] : [topicTitle],
    target: topicTitle,
    wordMatch: [topicTitle],
    stagePrompts: {
      Interact: `Trace the ${topicTitle}.`,
      Practice: objectMatch
        ? `Match ${topicTitle} to ${objectMatch}.`
        : `Tap the ${topicTitle}.`,
      Challenge: `Find the ${topicTitle}.`,
    },
    example: objectMatch
      ? `${topicTitle} can match a ${objectMatch}. Trace, sort, and match the shape.`
      : `${topicTitle} is a shape. Trace, sort, and match it.`,
    interactionTypes: ["Tap Activity", "Match Activity", "Puzzle Activity", "Drag and Drop Activity", "Timed Challenge"],
  };
}
