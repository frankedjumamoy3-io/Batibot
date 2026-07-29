import { KINDERGARTEN_PATTERN_WORLD_CONFIG } from "./config";
import type { KindergartenPatternTopicId } from "./types";

export const KINDERGARTEN_PATTERN_TOPIC_ORDER =
  KINDERGARTEN_PATTERN_WORLD_CONFIG.topics.map((topic) => topic.title);

export const SCOPED_KINDERGARTEN_PATTERN_TOPIC_IDS =
  new Set<KindergartenPatternTopicId>([
    "ab-pattern",
    "aab-pattern",
    "abb-pattern",
    "abc-pattern",
    "pattern-challenge",
  ]);

export function getKindergartenPatternTopicKey(
  topicTitle: string
): KindergartenPatternTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") as KindergartenPatternTopicId;
}

export function getKindergartenPatternTopicConfig(topicTitle: string) {
  const topicKey = getKindergartenPatternTopicKey(topicTitle);

  return KINDERGARTEN_PATTERN_WORLD_CONFIG.topics.find(
    (topic) => getKindergartenPatternTopicKey(topic.title) === topicKey
  );
}
