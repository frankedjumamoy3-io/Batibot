import { getCountingTopicKey } from "./stages";

const COUNTING_MEANINGS: Record<string, string> = {
  "counting-animals": "Count animals once.",
  "counting-fruits": "Count fruits once.",
  "counting-foods": "Count foods once.",
  "counting-shapes": "Count shapes once.",
  "counting-challenge": "Count forest groups.",
};

export function getCountingMeaning(topicTitle: string) {
  return COUNTING_MEANINGS[getCountingTopicKey(topicTitle)] ?? "Count each object once.";
}
