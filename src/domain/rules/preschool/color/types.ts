export type ColorPlayMode =
  | "drag-red-paint"
  | "drag-blue-object"
  | "drag-yellow-object"
  | "drag-green-object"
  | "drag-orange-object"
  | "drag-purple-object"
  | "drag-black-object"
  | "drag-white-object"
  | "build-rainbow";

export type ColorPlayItem = {
  assetTopicTitle: string;
  assetWorldId: string;
  color: string;
  id: string;
  label: string;
};

export type ColorPlayMission = {
  distractorItemIds: string[];
  dropZoneLabel: string;
  items: ColorPlayItem[];
  optionalDropItemIds: string[];
  playMode: ColorPlayMode;
  prompt: string;
  requiredDropItemIds: string[];
  successText: string;
};
