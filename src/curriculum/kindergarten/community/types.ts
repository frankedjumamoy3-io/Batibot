export type KindergartenCommunityTopicId =
  | "teacher"
  | "doctor"
  | "police-officer"
  | "firefighter"
  | "farmer"
  | "community-challenge";

export type KindergartenCommunityTopicConfig = {
  assetId: string;
  category: "linguistic";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: "community";
  title: string;
};

export type KindergartenCommunityWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: KindergartenCommunityTopicConfig[];
};

export type KindergartenCommunityRolePrompt = {
  object: string;
  prompt: string;
};

export type KindergartenCommunityTopicSupportConfig = {
  audioPrompt: string;
  competencyFocus: ("Oral Language" | "Early Reading")[];
  example: string;
  interactionTypes: string[];
  objectMatch: string;
  oralPrompt: string;
  pictureMatch: string[];
  stagePrompts: {
    Challenge: string;
    Practice: string;
  };
  target: string;
  wordMatch: string[];
};
