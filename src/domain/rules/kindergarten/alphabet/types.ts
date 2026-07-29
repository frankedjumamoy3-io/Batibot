export type KindergartenAlphabetPlayAction = "match";

export type KindergartenAlphabetWordOption = {
  assetTopic: string;
  assetWorldId?: string;
  label: string;
  meaning: string;
  mission: string;
};

export type KindergartenAlphabetStageIntegrityInput = {
  alphabetChooseLetters: string[];
  alphabetTapLetters: string[];
  alphabetTryLetters: string[];
  letter: string;
  playChoices: KindergartenAlphabetWordOption[];
};
