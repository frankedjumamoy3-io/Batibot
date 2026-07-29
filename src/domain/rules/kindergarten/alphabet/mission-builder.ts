import { KINDERGARTEN_ALPHABET_LETTERS } from "@/src/curriculum/kindergarten/alphabet";
import { createKindergartenPlayActionGetter } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_ALPHABET_PLAY_ACTION } from "./constants";
import { normalizeKindergartenLetter, resolveKindergartenLetterFoundation } from "./phonics-utils";
import type { KindergartenAlphabetWordOption } from "./types";

function getStableHash(value: string) {
  return value.split("").reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0;
  }, 2166136261);
}

function getStableShuffledItems<T>(items: T[], seed: string) {
  const shuffled = [...items];
  let state = getStableHash(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function getKindergartenAlphabetExampleOption(
  letter: string
): KindergartenAlphabetWordOption {
  const support = resolveKindergartenLetterFoundation(letter);

  return {
    assetTopic: support.example,
    label: support.example,
    meaning: `${support.letter} is for ${support.example}.`,
    mission: `Put ${support.example} in the ${support.letter} box.`,
  };
}

export function buildKindergartenAlphabetOptions(): KindergartenAlphabetWordOption[] {
  return KINDERGARTEN_ALPHABET_LETTERS.map((letter) => {
    const support = resolveKindergartenLetterFoundation(letter);

    return {
      assetTopic: `Letter ${letter}`,
      label: letter,
      meaning: `${letter} says ${support.sound}. ${letter} is for ${support.example}.`,
      mission: `Place ${letter} on the letter board.`,
    };
  });
}

function uniqueKindergartenAlphabetWordOptions(
  options: KindergartenAlphabetWordOption[],
  limit: number
) {
  const seen = new Set<string>();
  const unique: KindergartenAlphabetWordOption[] = [];

  for (const option of options) {
    const key = option.label.trim().toLowerCase().replace(/\s+/g, " ");

    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(option);

    if (unique.length >= limit) {
      break;
    }
  }

  return unique;
}

export function buildKindergartenAlphabetPlayChoices(
  letter: string,
  seed: string
) {
  const upperLetter = normalizeKindergartenLetter(letter);
  const support = resolveKindergartenLetterFoundation(upperLetter);
  const correctOptions: KindergartenAlphabetWordOption[] = [
    {
      assetTopic: support.example,
      label: support.example,
      meaning: `${support.example} starts with ${upperLetter}.`,
      mission: `Drop ${support.example}.`,
    },
  ];
  const distractorLetters = KINDERGARTEN_ALPHABET_LETTERS.filter(
    (candidate) => candidate !== upperLetter
  );
  const distractorOptions = getStableShuffledItems(
    distractorLetters,
    `${seed}-letters`
  )
    .slice(0, 3)
    .map((candidate) => {
      const example = resolveKindergartenLetterFoundation(candidate).example;

      return {
        assetTopic: example,
        label: example,
        meaning: `${example} starts with ${candidate}.`,
        mission: `Leave ${example} outside the ${upperLetter} box.`,
      };
    });

  return getStableShuffledItems(
    uniqueKindergartenAlphabetWordOptions(
      [...correctOptions, ...distractorOptions],
      4
    ),
    seed
  );
}

export const getKindergartenAlphabetPlayAction =
  createKindergartenPlayActionGetter(KINDERGARTEN_ALPHABET_PLAY_ACTION);
