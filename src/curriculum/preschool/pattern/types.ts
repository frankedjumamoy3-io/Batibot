export type PreschoolPatternTopicId =
  | "animal-patterns"
  | "fruit-patterns"
  | "food-patterns"
  | "shape-patterns"
  | "pattern-challenge";

export type PreschoolPatternType = "AB" | "AAB" | "ABB" | "ABC";

export type PreschoolPatternTopicConfig = {
  assetId: string;
  category: "linguistic" | "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  patternType: PreschoolPatternType;
  subcategory: string;
  title: string;
};

export type PreschoolPatternWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: PreschoolPatternTopicConfig[];
};

export type PreschoolPatternStageCopy = {
  audioText: string;
  instruction: string;
  questionText: string;
};

export type PreschoolPatternStageMetadata = {
  patternChallengeTypes?: PreschoolPatternType[];
  patternObjectTypes: string[];
  patternType: PreschoolPatternType;
};
