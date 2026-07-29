export type PreschoolCountingTopicId =
  | "counting-animals"
  | "counting-fruits"
  | "counting-foods"
  | "counting-shapes"
  | "counting-challenge";

export type PreschoolCountingTopicConfig = {
  assetId: string;
  category: "linguistic" | "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: string;
  title: string;
};

export type PreschoolCountingWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: PreschoolCountingTopicConfig[];
};
