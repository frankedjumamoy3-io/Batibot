import type { KindergartenNumberOption, KindergartenNumberTopicId } from "./types";

export const KINDERGARTEN_NUMBER_FOREST_VALUES = [
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
];

export const KINDERGARTEN_NUMBER_WORDS: Record<number, string> = {
  11: "eleven",
  12: "twelve",
  13: "thirteen",
  14: "fourteen",
  15: "fifteen",
  16: "sixteen",
  17: "seventeen",
  18: "eighteen",
  19: "nineteen",
  20: "twenty",
};

export function getKindergartenNumberTopicKey(
  topicTitle: string
): KindergartenNumberTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") as KindergartenNumberTopicId;
}

export function getKindergartenNumberValue(topicTitle: string) {
  const match = topicTitle.match(/^Number\s+(1[1-9]|20)$/);

  return match ? Number(match[1]) : null;
}

export function getKindergartenNumberWord(value: number) {
  return KINDERGARTEN_NUMBER_WORDS[value] ?? `${value}`;
}

export function getKindergartenNumberMeaning(value: number) {
  if (value > 10 && value <= 20) {
    return `10 and ${value - 10} make ${value}.`;
  }

  return `${value} helps us count bigger groups.`;
}

export function getKindergartenNumberForestOptions(): KindergartenNumberOption[] {
  return KINDERGARTEN_NUMBER_FOREST_VALUES.map((value) => ({
    assetTopic: `Number ${value}`,
    label: `${value}`,
    meaning: getKindergartenNumberMeaning(value),
    mission: `Match ${value} to its quantity.`,
  }));
}
