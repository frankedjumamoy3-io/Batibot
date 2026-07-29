import type {
  PreschoolChoiceMissionIds,
  PreschoolSingleDropMissionIds,
} from "./types";

export function getUniqueIds(ids: string[]) {
  return Array.from(new Set(ids));
}

export function hasNoOverlappingIds(firstIds: string[], secondIds: string[]) {
  return !firstIds.some((id) => secondIds.includes(id));
}

export function validateSingleRequiredDropMission(
  mission: PreschoolSingleDropMissionIds
) {
  return (
    mission.requiredItemIds.length >= 1 &&
    mission.distractorItemIds.length >= 1 &&
    hasNoOverlappingIds(mission.requiredItemIds, mission.distractorItemIds) &&
    Boolean(mission.destinationLabel) &&
    Boolean(mission.prompt)
  );
}

export function completeSingleRequiredDrop(
  mission: Pick<
    PreschoolSingleDropMissionIds,
    "distractorItemIds" | "requiredItemIds"
  >,
  droppedItemIds: string[]
) {
  const unique = getUniqueIds(droppedItemIds);

  return (
    unique.length === 1 &&
    mission.requiredItemIds.includes(unique[0]) &&
    !mission.distractorItemIds.includes(unique[0])
  );
}

export function validateRequiredChoiceMission(
  mission: PreschoolChoiceMissionIds
) {
  return (
    Boolean(mission.requiredChoiceId) &&
    mission.distractorChoiceIds.length >= 1 &&
    !mission.distractorChoiceIds.includes(mission.requiredChoiceId)
  );
}
