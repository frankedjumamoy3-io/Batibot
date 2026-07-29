import {
  completeSingleRequiredDrop,
  validateSingleRequiredDropMission,
} from "@/src/domain/rules/preschool/shared";
import type { PreschoolQuantityPlayMission } from "./types";

export function validatePreschoolQuantityPlayMission(
  mission: PreschoolQuantityPlayMission
) {
  return validateSingleRequiredDropMission(mission);
}

export function completePreschoolQuantityDrop(
  mission: PreschoolQuantityPlayMission,
  droppedItemIds: string[]
) {
  return completeSingleRequiredDrop(mission, droppedItemIds);
}

export const validateQuantityMission = validatePreschoolQuantityPlayMission;
export const completeQuantityDrop = completePreschoolQuantityDrop;
