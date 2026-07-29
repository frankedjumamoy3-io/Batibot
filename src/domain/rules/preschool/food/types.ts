export type FoodPlayMode =
  | "serve-food-to-plate"
  | "give-drink-to-child"
  | "collect-food-to-basket"
  | "serve-drink-to-cup"
  | "make-meal";

export type FoodPlayItem = {
  assetTopicTitle: string;
  assetWorldId?: string;
  id: string;
  label: string;
};

export type FoodPlayMission = {
  destinationId: string;
  destinationLabel: string;
  distractorItemIds: string[];
  items: FoodPlayItem[];
  optionalDropItemIds: string[];
  playMode: FoodPlayMode;
  prompt: string;
  requiredDropItemIds: string[];
  successText: string;
  targetFoodId?: string;
};
