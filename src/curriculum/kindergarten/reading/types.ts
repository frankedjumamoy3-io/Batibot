export type KindergartenReadingTopicId =
  | "picture-reading"
  | "cvc-words"
  | "sight-words"
  | "simple-sentences"
  | "story-sequencing";

export type KindergartenReadingTopicConfig = {
  assetId: string;
  category: "linguistic";
  emoji: string;
  example: string;
  interactionTypes: string[];
  subcategory: "reading";
  title: string;
};

export type KindergartenReadingWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: KindergartenReadingTopicConfig[];
};

export type KindergartenReadingLesson = {
  example: string;
  meaning: string;
  pictureMatch: string[];
  prompt: string;
  wordMatch: string[];
};

export type KindergartenReadingTopicSupportConfig = {
  audioPrompt: string;
  competencyFocus: ("Early Reading" | "Oral Language")[];
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

export type KindergartenReadingStory = {
  events: string[];
  title: string;
};
