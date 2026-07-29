export type FamilyChooseActivity = {
  choices: string[];
  correctAnswer: string;
  targetConcept: string;
};

export type FamilyPlayCard = {
  assetTopicTitle: string;
  assetWorldId: string;
  id: string;
  label: string;
  topicTitle: string;
};

export type FamilyPlayMission = {
  cards: FamilyPlayCard[];
  destinationLabel: string;
  destinationAssetTopicTitle?: string;
  destinationAssetWorldId?: string;
  distractorCardIds: string[];
  dropZoneId: string;
  enforceHomeFirst: boolean;
  playMode: "single-family-home" | "drag-family-home" | "build-home-family";
  prompt: string;
  requiredCardIds: string[];
  successText: string;
  targetConcept: string;
};

export type FamilyPlayAttempt = {
  correct: boolean;
  droppedCardIds: string[];
};

export type ScopedFamilyPlayMissionConfig = {
  destinationAssetTopicTitle?: string;
  destinationAssetWorldId?: string;
  destinationLabel: string;
  dropZoneId: string;
  missionTitle: string;
  playMode: FamilyPlayMission["playMode"];
  prompt: string;
  requiredCardIds: string[];
  successText: string;
  targetConcept: string;
};
