import { PRESCHOOL_ANIMAL_WORLD_ID, SCOPED_ANIMAL_TOPIC_IDS } from "./config";
import type { PreschoolAnimalTopicId } from "./types";

export function getAnimalTopicKey(topicTitle: string): PreschoolAnimalTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") as PreschoolAnimalTopicId;
}

export function getAnimalCorrectWord(topicTitle: string) {
  return topicTitle === "Animal Challenge" ? "Animals" : topicTitle;
}

export function isScopedAnimalTopic(topicTitle: string) {
  return SCOPED_ANIMAL_TOPIC_IDS.has(getAnimalTopicKey(topicTitle));
}

export function isScopedAnimalWorldTopic(worldId: string, topicTitle: string) {
  return worldId === PRESCHOOL_ANIMAL_WORLD_ID && isScopedAnimalTopic(topicTitle);
}

export function getAnimalPlayAction(topicTitle: string) {
  return topicTitle === "Animal Challenge" ? "match" : "drag";
}
