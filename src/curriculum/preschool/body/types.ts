export type PreschoolBodyTopicId =
  | "head"
  | "hair"
  | "eyes"
  | "ears"
  | "nose"
  | "mouth"
  | "teeth"
  | "hands"
  | "feet"
  | "body";

export type PreschoolBodyTopicConfig = {
  assetId: string;
  category: "linguistic" | "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: string;
  title: string;
};

export type PreschoolBodyWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: PreschoolBodyTopicConfig[];
};
