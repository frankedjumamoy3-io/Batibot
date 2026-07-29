export const SIZE_MEANINGS: Record<string, string> = {
  Big: "Big means larger physical size.",
  "Mixed Sizes": "Mixed Sizes means big, small, tall, and short together.",
  Short: "Short means lower physical height.",
  Small: "Small means smaller physical size.",
  Tall: "Tall means higher physical height.",
};

export function getSizeMeaning(topicTitle: string) {
  return SIZE_MEANINGS[topicTitle] ?? `Learn about ${topicTitle}.`;
}
