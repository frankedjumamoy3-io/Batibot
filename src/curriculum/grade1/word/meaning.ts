const GRADE1_WORD_MEANINGS: Record<string, string> = {
  "action-words": "Action words tell what someone or something does.",
  "describing-words": "Describing words tell what something is like.",
  noun: "A noun names a person, place, animal, or thing.",
  "opposite-words": "Opposite words have different meanings.",
  "similar-words": "Similar words mean almost the same thing.",
  "word-challenge": "Known words can name, act, describe, or connect.",
};

export function getScopedWordKingdomMeaning(topicTitle: string): string {
  return GRADE1_WORD_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
