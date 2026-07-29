import { KINDERGARTEN_ALPHABET_SEQUENCE } from "./constants";
import { normalizeKindergartenLetter } from "./phonics-utils";

export function getKindergartenLetterChoices(letter: string, limit = 4) {
  const normalized = normalizeKindergartenLetter(letter);
  const index = Math.max(0, KINDERGARTEN_ALPHABET_SEQUENCE.indexOf(normalized));
  const choices = new Set([normalized]);

  for (const offset of [-1, 1, 2, -2, 3, -3]) {
    const candidate = KINDERGARTEN_ALPHABET_SEQUENCE[index + offset];

    if (candidate) {
      choices.add(candidate);
    }

    if (choices.size >= limit) {
      break;
    }
  }

  return Array.from(choices).slice(0, limit);
}

export function getKindergartenAlphabetFriendlyDistractors() {
  return ["A", "B", "M", "S", "Apple", "Ball"];
}
