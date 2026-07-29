import {
  getKindergartenNumberValue,
  KINDERGARTEN_NUMBER_TOPIC_ORDER,
} from "@/src/curriculum/kindergarten/number";
import { normalizeKindergartenAnswer } from "@/src/domain/rules/kindergarten/shared";

export function normalizeKindergartenNumberAnswer(value: string) {
  return normalizeKindergartenAnswer(value);
}

export function isKindergartenNumberForestTopic(topicTitle: string) {
  return KINDERGARTEN_NUMBER_TOPIC_ORDER.some(
    (topic) =>
      normalizeKindergartenNumberAnswer(topic) ===
      normalizeKindergartenNumberAnswer(topicTitle)
  );
}

export function getKindergartenNumberForestTargetLabel(topicTitle: string) {
  const normalized = normalizeKindergartenNumberAnswer(topicTitle);
  const map: Record<string, string> = {
    "count-backward": "20",
    "count-forward": "11",
    "count-objects": "13",
    "forest-counting-challenge": "20",
    "missing-numbers": "15",
    "more-and-less": "16",
    "number-order": "14",
    "numbers-1-20": "11",
    "numbers-1a-20": "11",
  };

  return map[normalized.replace(/[^a-z0-9]+/g, "-")] ?? topicTitle;
}

export function getKindergartenNumberForestPlayAction(renderer: string) {
  return renderer.includes("Compare")
    ? "sort"
    : renderer.includes("Count")
      ? "count"
      : "sequence";
}

export function hasKindergartenNumberValue(topicTitle: string) {
  return getKindergartenNumberValue(topicTitle) !== null;
}
