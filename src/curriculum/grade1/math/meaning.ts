const GRADE1_MATH_MEANINGS: Record<string, string> = {
  "addition-facts": "Addition facts show putting numbers together.",
  addition: "Addition puts numbers together.",
  "math-challenge": "Math challenge uses addition and subtraction.",
  "number-sentences": "A number sentence shows a math idea.",
  subtraction: "Subtraction means taking away.",
  "subtraction-facts": "Subtraction facts show taking away.",
};

export function getScopedGrade1MathMeaning(topicTitle: string): string {
  return GRADE1_MATH_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
