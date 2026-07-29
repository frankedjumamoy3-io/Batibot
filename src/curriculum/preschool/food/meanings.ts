import { getFoodTopicKey } from "./stages";

const FOOD_MEANINGS: Record<string, string> = {
  rice: "Our main food.",
  bread: "Soft baked food.",
  milk: "Healthy drink.",
  egg: "Good for breakfast.",
  vegetables: "Vegetables help us grow.",
  meat: "Meat is food.",
  juice: "Sweet drink.",
  "food-challenge": "Make a meal.",
};

export function getFoodMeaning(topicTitle: string) {
  return FOOD_MEANINGS[getFoodTopicKey(topicTitle)] ?? `${topicTitle}.`;
}
