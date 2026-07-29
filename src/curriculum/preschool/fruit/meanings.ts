import { getFruitTopicKey } from "./stages";

const FRUIT_MEANINGS: Record<string, string> = {
  apple: "Crunchy fruit.",
  banana: "Yellow fruit.",
  mango: "Sweet fruit.",
  orange: "Juicy fruit.",
  grapes: "Small sweet fruit.",
  watermelon: "Big juicy fruit.",
  "fruit-challenge": "Pick the fruits.",
};

export function getFruitMeaning(topicTitle: string) {
  return FRUIT_MEANINGS[getFruitTopicKey(topicTitle)] ?? `${topicTitle}.`;
}
