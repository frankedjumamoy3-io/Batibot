const GRADE3_CONTEXT_CLUE_MEANINGS: Record<string, string> = {
  "context-challenge": "Context clues use evidence to prove word meaning.",
  "definition-clues": "Definition clues explain a word by giving its meaning nearby.",
  "example-clues": "Example clues give samples that help explain a word.",
  "multiple-meaning-words": "Context tells which meaning of a word is correct.",
  "sentence-clues": "Sentence clues use nearby information to infer meaning.",
  "synonym-and-antonym-clues": "Similar and opposite clues help readers infer meaning.",
  "synonym-clues": "Synonym clues use similar words to explain meaning.",
};

export function getScopedContextClueMeaning(topicTitle: string): string {
  return GRADE3_CONTEXT_CLUE_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
