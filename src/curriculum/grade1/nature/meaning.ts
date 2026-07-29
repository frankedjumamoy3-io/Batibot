const GRADE1_NATURE_MEANINGS: Record<string, string> = {
  animals: "Animals are living things.",
  land: "Land is ground around us.",
  plants: "Plants are living things that grow.",
  water: "Water can move, fall, or stay still.",
  weather: "Weather tells what the sky is like.",
};

export function getScopedGrade1NatureMeaning(topicTitle: string): string {
  return GRADE1_NATURE_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
