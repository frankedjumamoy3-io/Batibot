export type PreschoolNumberTopicId =
  | "number-1"
  | "number-2"
  | "number-3"
  | "number-4"
  | "number-5"
  | "number-6"
  | "number-7"
  | "number-8"
  | "number-9"
  | "number-10"
  | "number-challenge";

export type PreschoolNumberTopicConfig = {
  assetId: string;
  category: "linguistic" | "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  quantity?: number;
  subcategory: string;
  title: string;
};

export type PreschoolNumberWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: PreschoolNumberTopicConfig[];
};
