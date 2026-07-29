import { getQuantityDestinationLabel, QUANTITY_SUCCESS_TEXT } from "./constants";
import { getQuantityDistractorItems } from "./distractors";
import type { PreschoolQuantityMissionInput, PreschoolQuantityPlayMission } from "./types";

export function buildPreschoolQuantityPlayMission({
  items,
  targetRole,
}: PreschoolQuantityMissionInput): PreschoolQuantityPlayMission {
  const required = items.filter((item) => item.role === targetRole);
  const distractors = getQuantityDistractorItems(items, targetRole);
  const destinationLabel = getQuantityDestinationLabel(targetRole);

  return {
    destinationLabel,
    distractorItemIds: distractors.map((item) => item.id),
    prompt: `Fill the ${destinationLabel.toLowerCase()}.`,
    requiredItemIds: required.map((item) => item.id),
    successText: QUANTITY_SUCCESS_TEXT,
    targetRole,
  };
}

export const buildQuantityMission = buildPreschoolQuantityPlayMission;
