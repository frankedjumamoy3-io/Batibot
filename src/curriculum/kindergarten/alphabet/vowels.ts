import type { KindergartenAlphabetLetter } from "./types";

export const KINDERGARTEN_VOWELS = ["A", "E", "I", "O", "U"] as const;

export function isKindergartenVowel(
  letter: KindergartenAlphabetLetter | string
) {
  return KINDERGARTEN_VOWELS.includes(
    letter.toUpperCase() as (typeof KINDERGARTEN_VOWELS)[number]
  );
}
