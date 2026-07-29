const GRADE2_MULTIPLICATION_MEANINGS: Record<string, string> = {
  arrays: "Arrays show equal rows and columns.",
  "equal-groups": "Equal groups have the same number in each group.",
  "multiplication-challenge": "Multiplication challenge uses groups, arrays, and facts.",
  "repeated-addition": "Repeated addition is multiplication.",
};

export function getScopedGrade2MultiplicationMeaning(topicTitle: string): string {
  return GRADE2_MULTIPLICATION_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
