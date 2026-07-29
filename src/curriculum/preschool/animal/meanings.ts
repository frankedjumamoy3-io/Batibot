import { getAnimalTopicKey } from "./stages";

const ANIMAL_MEANINGS: Record<string, string> = {
  dog: "A friendly pet.",
  cat: "A soft pet.",
  bird: "Can fly.",
  fish: "Lives in water.",
  cow: "Gives milk.",
  horse: "Runs fast.",
  duck: "Says quack.",
  "animal-challenge": "Help the animals.",
};

export function getAnimalMeaning(topicTitle: string) {
  return ANIMAL_MEANINGS[getAnimalTopicKey(topicTitle)] ?? `${topicTitle}.`;
}
