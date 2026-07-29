import { getFoodTopicKey } from "@/src/curriculum/preschool/food";

const TRY_DISTRACTORS: Record<string, string> = {
  rice: "Milk",
  bread: "Juice",
  milk: "Rice",
  egg: "Bread",
  vegetables: "Meat",
  meat: "Vegetables",
  juice: "Bread",
  "food-challenge": "Toy",
};

export function getFoodTryDistractor(topicTitle: string) {
  return TRY_DISTRACTORS[getFoodTopicKey(topicTitle)] ?? "Milk";
}
