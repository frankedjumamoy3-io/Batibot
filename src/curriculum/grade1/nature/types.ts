export type Grade1NatureTopicId =
  | "plants"
  | "animals"
  | "weather"
  | "land"
  | "water";

export type Grade1NatureTopicConfig = {
  assetId: string;
  category: "linguistic";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: "nature";
  title: string;
};

export type Grade1NatureWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: Grade1NatureTopicConfig[];
};

export type Grade1NatureMeaning = {
  examples: string[];
  meaning: string;
  pronunciation: string;
};
