import { PRESCHOOL_COUNTING_WORLD_ID, SCOPED_COUNTING_TOPIC_IDS } from "./config";
import type { PreschoolCountingTopicId } from "./types";

export function getCountingTopicKey(topicTitle: string): PreschoolCountingTopicId {
  const key = topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (key === "count-animals") return "counting-animals";
  if (key === "count-fruits") return "counting-fruits";
  if (key === "count-food") return "counting-foods";
  if (key === "count-shapes") return "counting-shapes";
  if (key === "forest-counting-challenge") return "counting-challenge";

  return key as PreschoolCountingTopicId;
}

export function isScopedCountingTopic(topicTitle: string) {
  return SCOPED_COUNTING_TOPIC_IDS.has(getCountingTopicKey(topicTitle));
}

export function isScopedCountingWorldTopic(worldId: string, topicTitle: string) {
  return worldId === PRESCHOOL_COUNTING_WORLD_ID && isScopedCountingTopic(topicTitle);
}
