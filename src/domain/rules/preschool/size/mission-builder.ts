import { getSizeDestinationLabel, SIZE_SUCCESS_TEXT } from "./constants";
import { getSizeDistractorItems } from "./distractors";
import type { PreschoolSizeMissionInput, PreschoolSizePlayMission } from "./types";

export function buildPreschoolSizePlayMission({
  items,
  targetSize,
}: PreschoolSizeMissionInput): PreschoolSizePlayMission {
  const required = items.filter((item) => item.size === targetSize);
  const distractors = getSizeDistractorItems(items, targetSize);
  const targetLabel = getSizeDestinationLabel(targetSize);

  return {
    destinationLabel: targetLabel,
    distractorItemIds: distractors.map((item) => item.id),
    prompt: `Pack the ${targetLabel}.`,
    requiredItemIds: required.map((item) => item.id),
    successText: SIZE_SUCCESS_TEXT,
    targetSize,
  };
}

export const buildSizeMission = buildPreschoolSizePlayMission;
