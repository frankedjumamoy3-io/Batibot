export type ShapePlayMode =
  | "drag-circle-wheel"
  | "drag-square-window"
  | "drag-triangle-roof"
  | "drag-rectangle-door"
  | "drag-star-sky"
  | "build-house";

export type ShapePlayItem = {
  assetTopicTitle: string;
  id: string;
  label: string;
};

export type ShapePlayMission = {
  distractorItemIds: string[];
  dropZoneLabel: string;
  items: ShapePlayItem[];
  optionalDropItemIds: string[];
  playMode: ShapePlayMode;
  prompt: string;
  requiredDropItemIds: string[];
  successText: string;
};
