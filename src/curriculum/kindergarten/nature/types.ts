export type KindergartenNatureTopicId =
  | "plants"
  | "animals-in-nature"
  | "weather"
  | "trees"
  | "flowers"
  | "nature-challenge";

export type KindergartenNatureTopicConfig = {
  assetId: string;
  category: "linguistic";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: "nature";
  title: string;
};

export type KindergartenNatureWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: KindergartenNatureTopicConfig[];
};

export type KindergartenNatureTopicSupportConfig = {
  audioPrompt: string;
  competencyFocus: ("Oral Language" | "Early Reading")[];
  example: string;
  interactionTypes: string[];
  oralPrompt: string;
  pictureMatch: string[];
  stagePrompts: {
    Challenge: string;
    Interact: string;
    Practice: string;
  };
  target: string;
  wordMatch: string[];
};
