export type Grade1MathTopicId =
  | "addition"
  | "subtraction"
  | "number-sentences"
  | "math-challenge";

export type Grade1MathTopicConfig = {
  assetId: string;
  category: "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: "adding" | "numbers" | "problem-solving";
  title: string;
};

export type Grade1MathWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: Grade1MathTopicConfig[];
};

export type Grade1MathContent = {
  examples: string[];
  meaning: string;
  pronunciation: string;
};
