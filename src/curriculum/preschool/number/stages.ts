import { NUMBER_WORDS, PRESCHOOL_NUMBER_WORLD_ID, SCOPED_NUMBER_TOPIC_IDS } from "./config";
import type { PreschoolNumberTopicId } from "./types";

export function getNumberTopicKey(topicTitle: string): PreschoolNumberTopicId {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") as PreschoolNumberTopicId;
}

export function getNumberQuantityFromTitle(topicTitle: string) {
  return Number(topicTitle.match(/\d+/)?.[0] ?? 0);
}

export function getNumberWord(topicTitle: string) {
  const quantity = getNumberQuantityFromTitle(topicTitle);
  return NUMBER_WORDS[quantity] ?? "Count";
}

export function isNumberChallengeTopic(topicTitle: string) {
  return getNumberTopicKey(topicTitle) === "number-challenge";
}

export function isScopedNumberTopic(topicTitle: string) {
  return SCOPED_NUMBER_TOPIC_IDS.has(getNumberTopicKey(topicTitle));
}

export function isScopedNumberWorldTopic(worldId: string, topicTitle: string) {
  return worldId === PRESCHOOL_NUMBER_WORLD_ID && isScopedNumberTopic(topicTitle);
}
