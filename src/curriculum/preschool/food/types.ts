export type PreschoolFoodTopicId =
  | "rice"
  | "bread"
  | "milk"
  | "egg"
  | "meat"
  | "vegetables"
  | "juice";

export type PreschoolFoodTopicConfig = {
  assetId: string;
  category: "linguistic" | "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: string;
  title: string;
};

export type PreschoolFoodWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: PreschoolFoodTopicConfig[];
};
