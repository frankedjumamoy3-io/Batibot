const KINDERGARTEN_PATTERN_MEANINGS: Record<string, string> = {
  "Color Patterns": "A pattern repeats colors in order.",
  "Number Patterns": "A number pattern repeats numbers in order.",
  "Object Patterns": "An object pattern repeats things in order.",
  "Shape Patterns": "A shape pattern repeats shapes in order.",
};

export function getKindergartenPatternMeaning(topicTitle: string): string {
  return KINDERGARTEN_PATTERN_MEANINGS[topicTitle] ?? "Patterns repeat in order.";
}
