import {
  completeSingleRequiredDrop,
  validateSingleRequiredDropMission,
} from "@/src/domain/rules/preschool/shared";
import type { PreschoolSizePlayMission } from "./types";

export function validatePreschoolSizePlayMission(mission: PreschoolSizePlayMission) {
  return validateSingleRequiredDropMission(mission);
}

export function completePreschoolSizeDrop(
  mission: PreschoolSizePlayMission,
  droppedItemIds: string[]
) {
  return completeSingleRequiredDrop(mission, droppedItemIds);
}

export const validateSizeMission = validatePreschoolSizePlayMission;
export const completeSizeDrop = completePreschoolSizeDrop;
