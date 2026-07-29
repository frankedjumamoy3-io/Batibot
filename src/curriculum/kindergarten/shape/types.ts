export type KindergartenShapeTopicId =
  | "circle"
  | "oval"
  | "square"
  | "rectangle"
  | "triangle"
  | "shape-challenge";

export type KindergartenShapeTopicConfig = {
  assetId: string;
  category: "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: "shapes";
  title: string;
};

export type KindergartenShapeWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: KindergartenShapeTopicConfig[];
};

export type KindergartenShapeTopicSupportConfig = {
  audioPrompt: string;
  competencyFocus: ("Foundational Numeracy" | "Oral Language")[];
  example: string;
  interactionTypes: string[];
  objectMatch?: string;
  oralPrompt: string;
  patternType?: undefined;
  pictureMatch: string[];
  stagePrompts: {
    Challenge: string;
    Interact: string;
    Practice: string;
  };
  target: string;
  wordMatch: string[];
};
