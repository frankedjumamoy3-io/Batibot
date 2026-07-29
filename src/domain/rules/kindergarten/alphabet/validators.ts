import type {
  KindergartenAlphabetStageIntegrityInput,
  KindergartenAlphabetWordOption,
} from "./types";

export function isKindergartenAlphabetCorrectChoice(
  letter: string,
  choiceLabel: string
) {
  return choiceLabel.trim().toUpperCase().startsWith(letter.toUpperCase());
}

export { isKindergartenAlphabetCorrectChoice as isKindergartenAlphabetCorrectPlayChoice };

export function validateKindergartenAlphabetStageIntegrity({
  alphabetChooseLetters,
  alphabetTapLetters,
  alphabetTryLetters,
  letter,
  playChoices,
}: KindergartenAlphabetStageIntegrityInput) {
  return (
    alphabetTapLetters.length === 4 &&
    alphabetTryLetters.length === 2 &&
    alphabetChooseLetters.length === 4 &&
    playChoices.length === 4 &&
    playChoices.filter((choice) =>
      isKindergartenAlphabetCorrectChoice(letter, choice.label)
    ).length === 1
  );
}

export function validateKindergartenAlphabetPlayChoices(
  letter: string,
  playChoices: KindergartenAlphabetWordOption[]
) {
  return (
    playChoices.length === 4 &&
    playChoices.filter((choice) =>
      isKindergartenAlphabetCorrectChoice(letter, choice.label)
    ).length === 1
  );
}
