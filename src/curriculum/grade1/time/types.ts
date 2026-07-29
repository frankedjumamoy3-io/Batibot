export type Grade1TimeTopicId =
  | "hour"
  | "half-hour"
  | "morning"
  | "afternoon"
  | "evening";

export type Grade1TimeTopicConfig = {
  assetId: string;
  category: "linguistic" | "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: "measurement" | "things";
  title: string;
};

export type Grade1TimeWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: Grade1TimeTopicConfig[];
};

export type Grade1TimeMeaning = {
  examples: string[];
  meaning: string;
  pronunciation: string;
};
