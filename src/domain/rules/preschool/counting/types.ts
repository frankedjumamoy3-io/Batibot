export type CountingForestTopicKey =
  | "counting-animals"
  | "counting-challenge"
  | "counting-foods"
  | "counting-fruits"
  | "counting-shapes";

export type CountingForestObjectKind =
  | "animal"
  | "food"
  | "fruit"
  | "shape";

export type CountingForestDestinationId =
  | "animal-home"
  | "basket"
  | "picnic-basket"
  | "shape-box";

export type CountingForestAsset = {
  assetId: string;
  id: string;
  kind: CountingForestObjectKind;
  label: string;
  topicTitle: string;
  worldId: string;
};

export type CountingForestQuantityChoice = {
  correct: boolean;
  id: string;
  objects: CountingForestAsset[];
  quantity: number;
};

export type CountingForestChooseActivity = {
  choices: CountingForestQuantityChoice[];
  prompt: string;
  targetQuantity: number;
};

export type CountingForestMission = {
  startingObjects: CountingForestAsset[];
  destinationId: CountingForestDestinationId;
  destinationLabel: string;
  objectPool: CountingForestAsset[];
  prompt: string;
  requiredObjects: CountingForestAsset[];
  targetQuantity: number;
};

export type CountingForestLesson = {
  assetPool: string[];
  category: CountingForestObjectKind | "mixed";
  choose: CountingForestChooseActivity;
  destinationId: CountingForestDestinationId;
  destinationLabel: string;
  lookObjects: CountingForestAsset[];
  objectPool: CountingForestAsset[];
  playMode: "drag-exact-quantity" | "multi-drag-exact-quantity";
  prompt: string;
  quantityRange: { max: number; min: number };
  tapObjects: CountingForestAsset[];
  tryChoices: CountingForestQuantityChoice[];
  tryObjects: CountingForestAsset[];
  tryPrompt: string;
  tryQuantity: number;
  missions: CountingForestMission[];
};
