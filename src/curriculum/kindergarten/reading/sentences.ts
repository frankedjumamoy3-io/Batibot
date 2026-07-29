export const KINDERGARTEN_READING_SENTENCE_EXAMPLES = [
  "I see a cat.",
  "I see a dog.",
  "I read a book.",
  "The sun is up.",
];

export function isKindergartenReadingSentence(value: string) {
  return KINDERGARTEN_READING_SENTENCE_EXAMPLES.includes(value);
}
