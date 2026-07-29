const GRADE1_NUMBER_MEANINGS: Record<string, string> = {
  "equal-to": "Equal to means two numbers show the same amount.",
  "greater-than": "Greater than means one number is more.",
  "less-than": "Less than means one number is smaller.",
  "number-challenge": "Number challenge uses order and comparisons.",
  "numbers-1-100": "Numbers 1 to 100 show counting order.",
  "numbers-1-20": "Numbers 1 to 20 start counting order.",
  "skip-counting": "Skip counting counts by equal steps.",
};

export function getScopedGrade1NumberMeaning(topicTitle: string): string {
  return GRADE1_NUMBER_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
