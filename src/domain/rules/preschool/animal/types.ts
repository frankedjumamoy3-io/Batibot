export type AnimalPlayMode =
  | "give-dog-bone"
  | "give-cat-yarn"
  | "drag-bird-to-nest"
  | "drag-duck-to-pond"
  | "drag-fish-to-water"
  | "feed-cow-grass"
  | "feed-horse-hay"
  | "match-animals-to-homes";

export type AnimalPlayItem = {
  assetTopicTitle: string;
  assetWorldId?: string;
  id: string;
  label: string;
};

export type AnimalPlayMission = {
  distractorItemIds: string[];
  dropZoneLabel: string;
  items: AnimalPlayItem[];
  optionalDropItemIds: string[];
  playMode: AnimalPlayMode;
  prompt: string;
  requiredDropItemIds: string[];
  requiredDropTargets: Record<string, string>;
  successText: string;
};
