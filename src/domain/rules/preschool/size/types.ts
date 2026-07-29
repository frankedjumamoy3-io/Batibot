export type PreschoolSizeRole = "big" | "small" | "tall" | "short";

export type PreschoolSizeMissionItem = {
  id: string;
  label: string;
  size: PreschoolSizeRole;
};

export type PreschoolSizePlayMission = {
  destinationLabel: string;
  distractorItemIds: string[];
  prompt: string;
  requiredItemIds: string[];
  successText: string;
  targetSize: PreschoolSizeRole;
};

export type PreschoolSizeMissionInput = {
  items: PreschoolSizeMissionItem[];
  targetSize: PreschoolSizeRole;
};
