import type {
  KindergartenAlphabetLetter,
  KindergartenAlphabetTopicId,
  KindergartenLetterFoundation,
} from "./types";

export const KINDERGARTEN_ALPHABET_LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const satisfies KindergartenAlphabetLetter[];

export const KINDERGARTEN_LETTER_FOUNDATIONS: Record<
  KindergartenAlphabetLetter,
  KindergartenLetterFoundation
> = {
  A: { example: "Apple", sound: "/a/" },
  B: { example: "Ball", sound: "/b/" },
  C: { example: "Cat", sound: "/c/" },
  D: { example: "Dog", sound: "/d/" },
  E: { example: "Egg", sound: "/e/" },
  F: { example: "Fish", sound: "/f/" },
  G: { example: "Grapes", sound: "/g/" },
  H: { example: "Hat", sound: "/h/" },
  I: { example: "Igloo", sound: "/i/" },
  J: { example: "Juice", sound: "/j/" },
  K: { example: "Kite", sound: "/k/" },
  L: { example: "Leaf", sound: "/l/" },
  M: { example: "Moon", sound: "/m/" },
  N: { example: "Notebook", sound: "/n/" },
  O: { example: "Orange", sound: "/o/" },
  P: { example: "Pencil", sound: "/p/" },
  Q: { example: "Queen", sound: "/q/" },
  R: { example: "Rain", sound: "/r/" },
  S: { example: "Sun", sound: "/s/" },
  T: { example: "Tree", sound: "/t/" },
  U: { example: "Umbrella", sound: "/u/" },
  V: { example: "Van", sound: "/v/" },
  W: { example: "Water", sound: "/w/" },
  X: { example: "Box", sound: "/x/" },
  Y: { example: "Yellow", sound: "/y/" },
  Z: { example: "Zebra", sound: "/z/" },
};

export const KINDERGARTEN_BEGINNING_SOUND_EXTRA_EXAMPLES: Record<
  KindergartenAlphabetLetter,
  string
> = {
  A: "Ant",
  B: "Bee",
  C: "Cup",
  D: "Duck",
  E: "Elephant",
  F: "Frog",
  G: "Goat",
  H: "House",
  I: "Insect",
  J: "Jar",
  K: "Key",
  L: "Lion",
  M: "Monkey",
  N: "Nest",
  O: "Owl",
  P: "Pig",
  Q: "Quilt",
  R: "Rabbit",
  S: "Snake",
  T: "Tiger",
  U: "Unicorn",
  V: "Violin",
  W: "Watch",
  X: "X-ray",
  Y: "Yo-yo",
  Z: "Zoo",
};

export function isKindergartenAlphabetLetter(
  value: string
): value is KindergartenAlphabetLetter {
  return KINDERGARTEN_ALPHABET_LETTERS.includes(
    value.toUpperCase() as KindergartenAlphabetLetter
  );
}

export function getKindergartenAlphabetTopicId(
  letter: KindergartenAlphabetLetter
): KindergartenAlphabetTopicId {
  return `letter-${letter.toLowerCase()}` as KindergartenAlphabetTopicId;
}

export function getKindergartenAlphabetTopicTitle(
  letter: KindergartenAlphabetLetter
) {
  return `Letter ${letter}`;
}

export function getKindergartenLetterFromTopic(
  topicTitleOrLetter: string
): KindergartenAlphabetLetter | null {
  const trimmed = topicTitleOrLetter.trim();
  const match =
    trimmed.match(/^Letter\s+([A-Z])$/i) ?? trimmed.match(/^([A-Z])$/i);

  if (!match) {
    return null;
  }

  const letter = match[1].toUpperCase();

  return isKindergartenAlphabetLetter(letter) ? letter : null;
}

export function getKindergartenLetterFoundation(
  topicTitleOrLetter: string
) {
  const letter = getKindergartenLetterFromTopic(topicTitleOrLetter);

  if (!letter) {
    return null;
  }

  return {
    letter,
    ...KINDERGARTEN_LETTER_FOUNDATIONS[letter],
  };
}

export function getKindergartenBeginningSoundExtraExample(
  topicTitleOrLetter: string
) {
  const letter = getKindergartenLetterFromTopic(topicTitleOrLetter);

  return letter ? KINDERGARTEN_BEGINNING_SOUND_EXTRA_EXAMPLES[letter] : null;
}
