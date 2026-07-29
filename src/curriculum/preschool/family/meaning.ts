const FAMILY_MEANINGS: Record<string, string> = {
  baby: "The youngest child.",
  brother: "A boy in the family.",
  family: "Cares together.",
  "family-group": "Cares together.",
  father: "Works and helps.",
  friend: "Plays with you.",
  home: "Family lives here.",
  mother: "Loves and cares.",
  sister: "A girl in the family.",
};

export function getScopedFamilyMeaning(topicLabel: string): string {
  return FAMILY_MEANINGS[toMeaningKey(topicLabel)] ?? "Cares and helps.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
