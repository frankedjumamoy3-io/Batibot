import {
  validateRequiredChoiceMission,
} from "@/src/domain/rules/preschool/shared";
import type { PreschoolPatternPlayMission } from "./types";

export function validatePreschoolPatternPlayMission(
  mission: PreschoolPatternPlayMission
) {
  return validateRequiredChoiceMission(mission);
}

export function completePreschoolPatternDrop(
  mission: PreschoolPatternPlayMission,
  droppedChoiceId: string | null
) {
  return droppedChoiceId === mission.requiredChoiceId;
}

export const validatePatternMission = validatePreschoolPatternPlayMission;
export const completePatternDrop = completePreschoolPatternDrop;
