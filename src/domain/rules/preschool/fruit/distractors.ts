import { getFruitTopicKey } from "@/src/curriculum/preschool/fruit";

const TRY_DISTRACTORS: Record<string, string> = {
  apple: "Banana",
  banana: "Apple",
  mango: "Orange",
  orange: "Mango",
  grapes: "Watermelon",
  watermelon: "Grapes",
  "fruit-challenge": "Toy",
};

export function getFruitTryDistractor(topicTitle: string) {
  return TRY_DISTRACTORS[getFruitTopicKey(topicTitle)] ?? "Banana";
}
