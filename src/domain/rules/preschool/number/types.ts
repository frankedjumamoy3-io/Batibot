export type NumberPlayMode = "collect-quantity" | "multi-count";

export type NumberObjectKind =
  | "apple"
  | "banana"
  | "ball"
  | "bird"
  | "fish"
  | "flower"
  | "grapes"
  | "leaf"
  | "shape"
  | "star";

export type NumberDestinationId = "basket" | "garden" | "pond" | "shape-box" | "tree";

export type NumberQuantityObjectAsset = {
  objectAssetTopicTitle: string;
  objectAssetWorldId?: string;
  objectKind: NumberObjectKind;
  objectLabel: string;
};

export type NumberQuantityMission = {
  availableCount: number;
  destinationId: NumberDestinationId;
  destinationLabel: string;
  objectAssetCycle?: NumberQuantityObjectAsset[];
  objectAssetTopicTitle: string;
  objectAssetWorldId?: string;
  objectKind: NumberObjectKind;
  objectLabel: string;
  prompt: string;
  targetCount: number;
};

export type NumberPlayMission = {
  destinationId: NumberDestinationId;
  destinationLabel: string;
  missions: NumberQuantityMission[];
  playMode: NumberPlayMode;
  successText: string;
};

export type NumberChooseFormat = "number-to-quantity" | "quantity-to-word";

export type NumberChooseActivity = {
  choices: string[];
  correctAnswer: string;
  format: NumberChooseFormat;
  quantity: number;
};
