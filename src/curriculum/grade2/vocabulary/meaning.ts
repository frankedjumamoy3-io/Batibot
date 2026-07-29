const GRADE2_VOCABULARY_MEANINGS: Record<string, string> = {
  antonyms: "Antonyms have opposite meanings.",
  categories: "Categories group things that belong together.",
  "compound-words": "Compound words join two words to make a new word.",
  synonyms: "Synonyms have almost the same meaning.",
  "vocabulary-challenge": "Vocabulary challenge combines word relationships.",
};

export function getScopedVocabularyMeaning(topicTitle: string): string {
  return GRADE2_VOCABULARY_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
