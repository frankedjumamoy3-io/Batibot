export type KindergartenSchoolTopicId =
  | "bag"
  | "book"
  | "paper"
  | "chair"
  | "crayon"
  | "desk"
  | "eraser"
  | "notebook"
  | "pencil";

export type KindergartenSchoolTopicConfig = {
  assetId: string;
  category: "linguistic";
  emoji: string;
  example: string;
  interactionTypes: string[];
  subcategory: "school";
  title: string;
};

export type KindergartenSchoolWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: KindergartenSchoolTopicConfig[];
};

export type KindergartenSchoolTopicSupportConfig = {
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
