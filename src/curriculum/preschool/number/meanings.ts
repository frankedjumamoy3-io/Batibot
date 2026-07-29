import { getNumberTopicKey } from "./stages";

const NUMBER_MEANINGS: Record<string, string> = {
  "number-1": "One object.",
  "number-2": "Two objects.",
  "number-3": "Three objects.",
  "number-4": "Four objects.",
  "number-5": "Five objects.",
  "number-6": "Six objects.",
  "number-7": "Seven objects.",
  "number-8": "Eight objects.",
  "number-9": "Nine objects.",
  "number-10": "Ten objects.",
  "number-challenge": "Let's count!",
};

export function getNumberMeaning(topicTitle: string) {
  return NUMBER_MEANINGS[getNumberTopicKey(topicTitle)] ?? "Let's count!";
}
