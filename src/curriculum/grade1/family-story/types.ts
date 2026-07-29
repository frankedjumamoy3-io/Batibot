export type Grade1FamilyStoryTopicId =
  | "family-stories"
  | "family-sentences"
  | "story-characters"
  | "family-story-challenge";

export type Grade1FamilyStoryTopicConfig = {
  assetId: string;
  category: "linguistic";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: "reading" | "story";
  title: string;
};

export type Grade1FamilyStoryWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: Grade1FamilyStoryTopicConfig[];
};

export type Grade1FamilyStoryContent = {
  examples: string[];
  meaning: string;
  pronunciation: string;
};
