import { PRESCHOOL_COLOR_WORLD_ID, SCOPED_COLOR_TOPIC_IDS } from "./config";
import type { PreschoolColorTopicId } from "./types";

export function getColorTopicKey(topicTitle: string): PreschoolColorTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") as PreschoolColorTopicId;
}

export function getColorCorrectWord(topicTitle: string) {
  return topicTitle === "Rainbow Color Challenge" ? "Rainbow" : topicTitle;
}

export function isScopedColorTopic(topicTitle: string) {
  return SCOPED_COLOR_TOPIC_IDS.has(getColorTopicKey(topicTitle));
}

export function isScopedColorWorldTopic(worldId: string, topicTitle: string) {
  return worldId === PRESCHOOL_COLOR_WORLD_ID && isScopedColorTopic(topicTitle);
}

export function getColorPlayAction(topicTitle: string) {
  return topicTitle === "Rainbow Color Challenge" ? "build" : "drag";
}
