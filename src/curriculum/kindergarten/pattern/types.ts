export type KindergartenPatternTopicId =
  | "ab-pattern"
  | "aab-pattern"
  | "abb-pattern"
  | "abc-pattern"
  | "pattern-challenge";

export type KindergartenPatternType = "AB" | "AAB" | "ABB" | "ABC";

export type KindergartenPatternTile = {
  assetId: string;
  color: string;
  id: string;
  label: string;
  shape: "circle" | "square" | "triangle";
};

export type KindergartenPatternSequence = {
  answerId: string;
  choices: KindergartenPatternTile[];
  patternType: KindergartenPatternType;
  tiles: KindergartenPatternTile[];
};

export type KindergartenPatternTopicConfig = {
  assetId: string;
  category: "numeric";
  emoji: string;
  example: string;
  interactionTypes: string[];
  patternKey: string;
  patternType: KindergartenPatternType;
  subcategory: "patterns";
  title: string;
};

export type KindergartenPatternWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: KindergartenPatternTopicConfig[];
};

export type KindergartenPatternTopicSupportConfig = {
  audioPrompt: string;
  competencyFocus: ("Foundational Numeracy" | "Oral Language")[];
  example: string;
  interactionTypes: string[];
  oralPrompt: string;
  patternType: KindergartenPatternType;
  stagePrompts: {
    Challenge: string;
    Discover: string;
    Interact: string;
    Practice: string;
  };
  target: string;
  wordMatch: string[];
};

export type KindergartenPatternStageMetadata = {
  patternChallengeTypes?: KindergartenPatternType[];
  patternObjectTypes: string[];
  patternType: KindergartenPatternType;
};
