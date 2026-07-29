import {
  getKindergartenLetterFoundation,
  isKindergartenConsonant,
  isKindergartenVowel,
} from "@/src/curriculum/kindergarten/alphabet";

export function normalizeKindergartenLetter(value: string) {
  return value.trim().toUpperCase();
}

export function isValidKindergartenLetter(value: string) {
  return /^[A-Z]$/.test(normalizeKindergartenLetter(value));
}

export function isKindergartenAlphabetVowel(value: string) {
  return isValidKindergartenLetter(value) && isKindergartenVowel(value);
}

export function isKindergartenAlphabetConsonant(value: string) {
  return isValidKindergartenLetter(value) && isKindergartenConsonant(value);
}

export function resolveKindergartenLetterFoundation(value: string) {
  const normalized = normalizeKindergartenLetter(value);

  return (
    getKindergartenLetterFoundation(normalized) ?? {
      example: `${normalized} word`,
      letter: normalized,
      sound: `/${normalized.toLowerCase()}/`,
    }
  );
}
