export const PATTERN_MEANINGS: Record<string, string> = {
  "Animal Patterns": "Animals repeat in an AB pattern.",
  "Food Patterns": "Foods repeat in an ABB pattern.",
  "Fruit Patterns": "Fruits repeat in an AAB pattern.",
  "Pattern Challenge": "Repair AB, AAB, ABB, and ABC picture patterns.",
  "Shape Patterns": "Shapes repeat in an ABC pattern.",
};

export function getPatternMeaning(topicTitle: string) {
  return PATTERN_MEANINGS[topicTitle] ?? `Learn about ${topicTitle}.`;
}
