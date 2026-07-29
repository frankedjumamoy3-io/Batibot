import { getFamilyTopicKey } from "./stages";

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

export function getScopedFamilyMeaning(topicLabel: string) {
  return FAMILY_MEANINGS[getFamilyTopicKey(topicLabel)] ?? "Cares and helps.";
}
