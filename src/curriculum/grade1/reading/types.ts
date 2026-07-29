export type Grade1ReadingTopicId =
  | "words"
  | "sentences"
  | "reading-passage"
  | "reading-comprehension"
  | "reading-challenge";

export type Grade1ReadingTopicConfig = {
  assetId: string;
  category: "linguistic";
  emoji: string;
  example: string;
  interactionTypes: string[];
  subcategory: "reading" | "story";
  title: string;
};

export type Grade1ReadingWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: Grade1ReadingTopicConfig[];
};

export type Grade1ReadingContent = {
  examples: string[];
  meaning: string;
  pronunciation: string;
};
