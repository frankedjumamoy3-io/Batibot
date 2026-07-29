export type PreschoolFruitTopicId =
  | "apple"
  | "banana"
  | "mango"
  | "orange"
  | "grapes"
  | "watermelon";

export type PreschoolFruitTopicConfig = {
  assetId: string;
  category: "linguistic" | "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: string;
  title: string;
};

export type PreschoolFruitWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: PreschoolFruitTopicConfig[];
};
