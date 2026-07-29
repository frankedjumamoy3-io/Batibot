export const QUANTITY_MEANINGS: Record<string, string> = {
  "More & Less Challenge": "Complete every quantity comparison mission.",
  "More Animals": "Count animal groups, then choose more or less.",
  "More Foods": "Count food groups, then choose more or less.",
  "More Fruits": "Count fruit groups, then choose more or less.",
  "More Shapes": "Count shape groups, then choose more or less.",
};

export function getQuantityMeaning(topicTitle: string) {
  return QUANTITY_MEANINGS[topicTitle] ?? `Learn about ${topicTitle}.`;
}
