import { getAnimalTopicKey } from "@/src/curriculum/preschool/animal";

const TRY_DISTRACTORS: Record<string, string> = {
  dog: "Cat",
  cat: "Dog",
  bird: "Fish",
  fish: "Bird",
  cow: "Horse",
  horse: "Cow",
  duck: "Bird",
  "animal-challenge": "Toy",
};

export function getAnimalTryDistractor(topicTitle: string) {
  return TRY_DISTRACTORS[getAnimalTopicKey(topicTitle)] ?? "Cat";
}
