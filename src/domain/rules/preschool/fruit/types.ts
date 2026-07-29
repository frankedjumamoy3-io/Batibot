export type FruitPlayMode =
  | "drag-fruit-to-basket"
  | "feed-monkey-fruit"
  | "drag-fruit-to-wagon"
  | "fruit-basket-challenge";

export type FruitPlayItem = {
  assetTopicTitle: string;
  assetWorldId?: string;
  id: string;
  label: string;
};

export type FruitPlayMission = {
  destinationId: string;
  destinationLabel: string;
  distractorItemIds: string[];
  items: FruitPlayItem[];
  optionalDropItemIds: string[];
  playMode: FruitPlayMode;
  prompt: string;
  requiredDropItemIds: string[];
  successText: string;
  targetFruitId?: string;
};
