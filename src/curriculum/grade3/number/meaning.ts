const GRADE3_NUMBER_MEANINGS: Record<string, string> = {
  "expanded-form": "Expanded form shows the value of each digit.",
  "number-empire-challenge": "Number challenge uses place value and comparison.",
  "place-value": "Place value tells what each digit is worth.",
  "rounding-numbers": "Rounding finds a nearby friendly number.",
};

export function getScopedGrade3NumberMeaning(topicTitle: string): string {
  return GRADE3_NUMBER_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
