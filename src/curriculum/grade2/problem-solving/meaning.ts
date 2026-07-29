const GRADE2_PROBLEM_MEANINGS: Record<string, string> = {
  "addition-word-problems": "Addition word problems put amounts together.",
  "multi-step-problems": "Multi-step problems need more than one step.",
  "problem-solving-challenge": "Problem solving uses clues, numbers, and operations.",
  "subtraction-word-problems": "Subtraction word problems take away or compare.",
};

export function getScopedGrade2ProblemSolvingMeaning(topicTitle: string): string {
  return GRADE2_PROBLEM_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
