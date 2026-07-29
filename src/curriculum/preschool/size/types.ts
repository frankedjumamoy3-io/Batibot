export type PreschoolSizeTopicId =
  | "big"
  | "small"
  | "tall"
  | "short"
  | "mixed-sizes";

export type PreschoolSizeTopicConfig = {
  assetId: string;
  category: "linguistic" | "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: string;
  title: string;
};

export type PreschoolSizeWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: PreschoolSizeTopicConfig[];
};

export type PreschoolSizeStageCopy = {
  audioText: string;
  instruction: string;
  questionText: string;
};

export type PreschoolSizeStageMetadata = {
  sizeChallengeConcepts?: string[];
  sizeConcept: string;
  sizeMissionType: string;
  sizeObjectLabels: string[];
  sizeScaleSet: number[];
};
