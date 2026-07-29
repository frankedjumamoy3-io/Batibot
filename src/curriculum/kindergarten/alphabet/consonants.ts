import { KINDERGARTEN_ALPHABET_LETTERS } from "./letters";
import { isKindergartenVowel } from "./vowels";

export const KINDERGARTEN_CONSONANTS = KINDERGARTEN_ALPHABET_LETTERS.filter(
  (letter) => !isKindergartenVowel(letter)
);

export function isKindergartenConsonant(letter: string) {
  const normalized = letter.toUpperCase();

  return KINDERGARTEN_CONSONANTS.includes(
    normalized as (typeof KINDERGARTEN_CONSONANTS)[number]
  );
}
