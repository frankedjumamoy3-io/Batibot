const KINDERGARTEN_QUANTITY_MEANINGS: Record<string, string> = {
  "More": "More means a bigger amount.",
  "Less": "Less means a smaller amount.",
  "Same": "Same means equal amounts.",
  "More or Less": "Compare groups to find more or less.",
};

export function getKindergartenQuantityMeaning(topicTitle: string): string {
  return KINDERGARTEN_QUANTITY_MEANINGS[topicTitle] ?? "Compare the amounts.";
}
