import { KINDERGARTEN_ALPHABET_WORLD_ID } from "./config";
import {
  getKindergartenLetterFoundation,
  getKindergartenLetterFromTopic,
} from "./letters";
import type { KindergartenAlphabetTopicSupportConfig } from "./types";

export const KINDERGARTEN_ALPHABET_TOPIC_ORDER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  .split("")
  .map((letter) => `Letter ${letter}`);

export function isScopedKindergartenAlphabetTopic(topicTitle: string) {
  return Boolean(getKindergartenLetterFromTopic(topicTitle));
}

export function isScopedKindergartenAlphabetWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return (
    worldId === KINDERGARTEN_ALPHABET_WORLD_ID &&
    isScopedKindergartenAlphabetTopic(topicTitle)
  );
}

export function getKindergartenAlphabetTopicSupport(
  topicTitle: string
): KindergartenAlphabetTopicSupportConfig | null {
  const foundation = getKindergartenLetterFoundation(topicTitle);

  if (!foundation) {
    return null;
  }

  const lowercase = foundation.letter.toLowerCase();

  return {
    audioPrompt: `${foundation.letter} says ${foundation.sound}. ${foundation.letter} is for ${foundation.example}.`,
    beginningSound: foundation.sound,
    competencyFocus: [
      "Letter Recognition",
      "Phonological Awareness",
      "Oral Language",
      "Early Reading",
    ],
    lowercase,
    oralPrompt: `Say ${foundation.letter}.`,
    pictureMatch: [foundation.example],
    soundExamples: [foundation.example],
    target: `Letter ${foundation.letter}`,
    uppercase: foundation.letter,
    wordMatch: [foundation.letter, lowercase, foundation.example],
    stagePrompts: {
      Practice: `Match ${foundation.letter} to ${lowercase}.`,
      Challenge: `Find ${foundation.letter}.`,
    },
    example: `${foundation.letter} says ${foundation.sound}. ${foundation.letter} is for ${foundation.example}. Match ${foundation.letter} to ${lowercase}.`,
    interactionTypes: [
      "Listening Activity",
      "Tap Activity",
      "Match Activity",
      "Drag and Drop Activity",
      "Timed Challenge",
    ],
  };
}
