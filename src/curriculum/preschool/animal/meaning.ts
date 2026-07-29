const ANIMAL_MEANINGS: Record<string, string> = {
  bird: "Can fly.",
  cat: "Says meow.",
  cow: "Gives milk.",
  dog: "Says woof.",
  fish: "Lives in water.",
  horse: "Runs fast.",
};

export function getAnimalMeaning(topicTitle: string): string {
  return ANIMAL_MEANINGS[toMeaningKey(topicTitle)] ?? "An animal.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
