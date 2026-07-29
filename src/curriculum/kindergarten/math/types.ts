export type KindergartenMathTopicId =
  | "number-names"
  | "number-matching"
  | "number-comparison"
  | "before-and-after-numbers"
  | "number-adventure-challenge";

export type KindergartenMathTopicConfig = {
  assetId: string;
  category: "numeric";
  emoji: string;
  example: string;
  interactionTypes: string[];
  subcategory: "numbers" | "comparing";
  title: string;
};

export type KindergartenMathWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: KindergartenMathTopicConfig[];
};

export type KindergartenMathTopicSupportConfig = {
  audioPrompt: string;
  competencyFocus: ("Foundational Numeracy" | "Oral Language")[];
  example: string;
  interactionTypes: string[];
  oralPrompt: string;
  pictureMatch: string[];
  stagePrompts: {
    Challenge: string;
    Discover: string;
    Explore: string;
    Interact: string;
    Practice: string;
  };
  target: string;
  wordMatch: string[];
};

export type KindergartenMathOption = {
  assetTopic: string;
  assetWorldId?: string;
  label: string;
  meaning: string;
  mission: string;
};
