export type PreschoolAnimalTopicId =
  | "dog"
  | "cat"
  | "bird"
  | "fish"
  | "cow"
  | "horse"
  | "duck";

export type PreschoolAnimalTopicConfig = {
  assetId: string;
  category: "linguistic" | "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: string;
  title: string;
};

export type PreschoolAnimalWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: PreschoolAnimalTopicConfig[];
};
