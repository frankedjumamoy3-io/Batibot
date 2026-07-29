export type KindergartenNumberTopicId =
  | "number-11"
  | "number-12"
  | "number-13"
  | "number-14"
  | "number-15"
  | "number-16"
  | "number-17"
  | "number-18"
  | "number-19"
  | "number-20"
  | "number-challenge";

export type KindergartenNumberTopicConfig = {
  assetId: string;
  category: "numeric";
  emoji: string;
  example: string;
  interactionTypes: string[];
  subcategory: "counting";
  title: string;
};

export type KindergartenNumberWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: KindergartenNumberTopicConfig[];
};

export type KindergartenNumberTopicSupportConfig = {
  audioPrompt: string;
  competencyFocus: ("Foundational Numeracy" | "Oral Language")[];
  example: string;
  interactionTypes: string[];
  moreLess: boolean;
  oralPrompt: string;
  pictureMatch: string[];
  stagePrompts: {
    Challenge: string;
    Discover: string;
    Interact: string;
    Practice: string;
  };
  target: string;
  wordMatch: string[];
};

export type KindergartenNumberForestStageMetadata = {
  countingRange: string;
  countingSkill: string;
  forestChallengeSkills?: string[];
  forestMissionType: string;
  forestObjectTypes: string[];
};

export type KindergartenNumberOption = {
  assetTopic: string;
  assetWorldId?: string;
  label: string;
  meaning: string;
  mission: string;
};
