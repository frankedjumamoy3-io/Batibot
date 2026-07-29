const GRADE2_PLACE_VALUE_MEANINGS: Record<string, string> = {
  hundreds: "Hundreds show groups of one hundred.",
  "ones-tens-hundreds": "Place value tells what each digit means.",
  "place-value-challenge": "Place value challenge uses ones, tens, and hundreds.",
  tens: "Tens show groups of ten.",
};

export function getScopedGrade2PlaceValueMeaning(topicTitle: string): string {
  return GRADE2_PLACE_VALUE_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
