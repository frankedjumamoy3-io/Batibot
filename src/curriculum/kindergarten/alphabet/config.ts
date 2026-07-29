import {
  getKindergartenAlphabetTopicId,
  getKindergartenAlphabetTopicTitle,
  KINDERGARTEN_ALPHABET_LETTERS,
} from "./letters";
import type { KindergartenAlphabetWorldConfig } from "./types";

export const KINDERGARTEN_ALPHABET_WORLD_ID = "kindergarten-alphabet";

export const KINDERGARTEN_ALPHABET_WORLD_CONFIG: KindergartenAlphabetWorldConfig = {
  id: KINDERGARTEN_ALPHABET_WORLD_ID,
  title: "Alphabet Adventure",
  emoji: "\uD83C\uDFDD\uFE0F",
  accentColor: "#7C2EF2",
  description:
    "Hear letter sounds, match letter pictures, find letters, and catch the target letter.",
  activities: [
    "Tap letter sound",
    "Match letter picture",
    "Drag into outline",
    "Find target letter",
    "Timed letter catch",
  ],
  topics: KINDERGARTEN_ALPHABET_LETTERS.map((letter) => ({
    assetId: getKindergartenAlphabetTopicId(letter),
    title: getKindergartenAlphabetTopicTitle(letter),
    emoji: letter,
    category: "linguistic",
    subcategory: "alphabet",
    interactionTypes: [
      "Tap Activity",
      "Listening Activity",
      "Match Activity",
      "Drag and Drop Activity",
      "Timed Challenge",
    ],
    example: `${letter} starts a letter-sound and picture match.`,
  })),
};
