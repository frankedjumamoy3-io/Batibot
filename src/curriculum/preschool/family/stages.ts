import { FAMILY_TOPIC_LESSONS, SCOPED_FAMILY_WORD_TOPIC_KEYS } from "./config";

export function getFamilyTopicKey(topicLabel: string) {
  return topicLabel
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getFamilyTopicLesson(topicLabel: string) {
  return FAMILY_TOPIC_LESSONS[getFamilyTopicKey(topicLabel)] ?? FAMILY_TOPIC_LESSONS["what-is-family"];
}

export function isScopedFamilyWordTopic(topicLabel: string) {
  return SCOPED_FAMILY_WORD_TOPIC_KEYS.has(getFamilyTopicKey(topicLabel));
}

export function isScopedFamilyWorldTopic(worldId: string, topicTitle: string) {
  return worldId === "preschool-family-world" && isScopedFamilyWordTopic(topicTitle);
}
