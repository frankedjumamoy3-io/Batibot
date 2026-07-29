export type Grade3TopicCategory = "linguistic" | "numeric";

export type Grade3WorldTopicConfig = {
  assetId: string;
  category: Grade3TopicCategory;
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: string;
  title: string;
};

export type Grade3WorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: Grade3WorldTopicConfig[];
};

export type Grade3LiteracyBlueprint = {
  behavior: string;
  chooseAnswer: string;
  chooseChoices: string[];
  chooseQuestion: string;
  competency: string;
  evidence: string[];
  knowledge: string;
  model: string[];
  passage: string;
  playAction: string;
  playInstruction: string;
  requiredAction: string;
  renderer: string;
  skill: string;
  tapFacts: string[];
  tryAnswer: string;
  tryChoices: string[];
  tryQuestion: string;
  visualAnchors: string[];
};
