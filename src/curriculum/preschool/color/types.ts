export type PreschoolColorTopicId =
  | "red"
  | "blue"
  | "yellow"
  | "green"
  | "orange"
  | "purple"
  | "white"
  | "black";

export type PreschoolVisualTopicConfig = {
  assetId: string;
  category: "linguistic" | "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: string;
  title: string;
};

export type PreschoolVisualWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: PreschoolVisualTopicConfig[];
};
