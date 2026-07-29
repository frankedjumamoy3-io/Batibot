export type KindergartenAlphabetLetter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

export type KindergartenAlphabetTopicId =
  `letter-${Lowercase<KindergartenAlphabetLetter>}`;

export type KindergartenLetterFoundation = {
  example: string;
  sound: string;
};

export type KindergartenAlphabetTopicConfig = {
  assetId: KindergartenAlphabetTopicId;
  category: "linguistic";
  emoji: string;
  example: string;
  interactionTypes: string[];
  subcategory: "alphabet";
  title: string;
};

export type KindergartenAlphabetWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: KindergartenAlphabetTopicConfig[];
};

export type KindergartenAlphabetTopicSupportConfig = {
  audioPrompt: string;
  beginningSound: string;
  competencyFocus: (
    | "Letter Recognition"
    | "Phonological Awareness"
    | "Oral Language"
    | "Early Reading"
  )[];
  example: string;
  interactionTypes: string[];
  lowercase: string;
  oralPrompt: string;
  pictureMatch: string[];
  soundExamples: string[];
  stagePrompts: {
    Challenge: string;
    Practice: string;
  };
  target: string;
  uppercase: KindergartenAlphabetLetter;
  wordMatch: string[];
};
