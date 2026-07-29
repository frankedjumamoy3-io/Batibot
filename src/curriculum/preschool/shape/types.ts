export type PreschoolShapeTopicId =
  | "circle"
  | "square"
  | "triangle"
  | "rectangle"
  | "star";

export type PreschoolShapeTopicConfig = {
  assetId: string;
  category: "linguistic" | "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: string;
  title: string;
};

export type PreschoolShapeWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: PreschoolShapeTopicConfig[];
};
