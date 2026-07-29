export type Grade1WordTopicId =
  | "noun"
  | "action-words"
  | "describing-words"
  | "opposite-words"
  | "similar-words"
  | "word-challenge";

export type Grade1WordTopicConfig = {
  assetId: string;
  category: "linguistic";
  emoji: string;
  example: string;
  interactionTypes: string[];
  subcategory: "actions" | "vocabulary";
  title: string;
};

export type Grade1WordWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: Grade1WordTopicConfig[];
};

export type Grade1WordMeaning = {
  examples: string[];
  meaning: string;
  pronunciation: string;
};
