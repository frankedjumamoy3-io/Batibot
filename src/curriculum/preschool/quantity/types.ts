export type PreschoolQuantityTopicId =
  | "more-animals"
  | "more-fruits"
  | "more-foods"
  | "more-shapes"
  | "more-less-challenge";

export type PreschoolQuantityTopicConfig = {
  assetId: string;
  category: "linguistic" | "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: string;
  title: string;
};

export type PreschoolQuantityWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: PreschoolQuantityTopicConfig[];
};

export type PreschoolQuantityStageCopy = {
  audioText: string;
  instruction: string;
  questionText: string;
};

export type PreschoolQuantityStageMetadata = {
  quantityChallengeConcepts?: string[];
  quantityConcept: string;
  quantityGroupCounts: number[];
  quantityMissionType: string;
  quantityObjectTypes: string[];
};
