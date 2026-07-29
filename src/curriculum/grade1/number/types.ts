export type Grade1NumberTopicId =
  | "numbers-1-100"
  | "comparing-numbers"
  | "skip-counting";

export type Grade1NumberTopicConfig = {
  assetId: string;
  category: "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: "comparing" | "numbers" | "patterns";
  title: string;
};

export type Grade1NumberWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: Grade1NumberTopicConfig[];
};

export type Grade1NumberContent = {
  examples: string[];
  meaning: string;
  pronunciation: string;
};
