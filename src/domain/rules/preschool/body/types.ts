import type { BodyPlayMode } from "./play-modes";

export type BodyPlayItem = {
  assetTopicTitle: string;
  assetWorldId: string;
  id: string;
  label: string;
};

export type BodyPlayMission = {
  distractorItemIds: string[];
  dropZoneLabel: string;
  items: BodyPlayItem[];
  optionalDropItemIds: string[];
  playMode: BodyPlayMode;
  prompt: string;
  requiredDropItemIds: string[];
  successText: string;
};
