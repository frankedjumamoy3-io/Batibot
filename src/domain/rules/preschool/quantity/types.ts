export type PreschoolQuantityRole = "more" | "less";

export type PreschoolQuantityMissionItem = {
  id: string;
  label: string;
  role: PreschoolQuantityRole;
};

export type PreschoolQuantityPlayMission = {
  destinationLabel: string;
  distractorItemIds: string[];
  prompt: string;
  requiredItemIds: string[];
  successText: string;
  targetRole: PreschoolQuantityRole;
};

export type PreschoolQuantityMissionInput = {
  items: PreschoolQuantityMissionItem[];
  targetRole: PreschoolQuantityRole;
};
