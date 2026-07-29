import { PRESCHOOL_BODY_WORLD_ID } from "./config";
import { SCOPED_BODY_TOPIC_IDS } from "./topics";
import type { PreschoolBodyTopicId } from "./types";

export function getBodyTopicKey(topicTitle: string): PreschoolBodyTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") as PreschoolBodyTopicId;
}

export function getBodyCorrectWord(topicTitle: string) {
  return topicTitle;
}

export function isScopedBodyTopic(topicTitle: string) {
  return SCOPED_BODY_TOPIC_IDS.has(getBodyTopicKey(topicTitle));
}

export function isScopedBodyWorldTopic(worldId: string, topicTitle: string) {
  return worldId === PRESCHOOL_BODY_WORLD_ID && isScopedBodyTopic(topicTitle);
}

export function getBodyPlayAction(topicTitle: string) {
  return topicTitle === "Body" ? "build" : "drag";
}
