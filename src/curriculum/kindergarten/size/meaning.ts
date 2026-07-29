const KINDERGARTEN_SIZE_MEANINGS: Record<string, string> = {
  "Big": "Big means large in size.",
  "Small": "Small means little in size.",
  "Tall": "Tall means high from bottom to top.",
  "Short": "Short means not tall.",
  "Long": "Long stretches far from end to end.",
};

export function getKindergartenSizeMeaning(topicTitle: string): string {
  return KINDERGARTEN_SIZE_MEANINGS[topicTitle] ?? "Compare the sizes.";
}
