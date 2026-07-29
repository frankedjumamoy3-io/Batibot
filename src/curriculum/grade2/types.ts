export type Grade2TopicCategory = "linguistic" | "numeric";

export type Grade2WorldTopicConfig = {
  assetId: string;
  category: Grade2TopicCategory;
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: string;
  title: string;
};

export type Grade2WorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: Grade2WorldTopicConfig[];
};
