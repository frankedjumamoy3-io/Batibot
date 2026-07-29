import type { NumberPlayMission, NumberQuantityMission } from "./types";

export function validateNumberPlayMission(mission: NumberPlayMission) {
  const expectedMissionCount = mission.playMode === "multi-count" ? 4 : 1;

  return (
    mission.missions.length === expectedMissionCount &&
    mission.missions.every(
      (item) =>
        item.targetCount >= 1 &&
        item.availableCount >= item.targetCount &&
        (mission.playMode === "multi-count" || item.destinationId === mission.destinationId),
    ) &&
    mission.missions.every(
      (item) =>
        item.targetCount >= 1 &&
        item.availableCount >= item.targetCount &&
        Boolean(item.destinationId) &&
        Boolean(item.destinationLabel) &&
        Boolean(item.objectKind) &&
        Boolean(item.objectAssetTopicTitle) &&
        (!item.objectAssetCycle?.length ||
          item.objectAssetCycle.every(
            (asset) => Boolean(asset.objectAssetTopicTitle) && Boolean(asset.objectKind),
          ))
    )
  );
}

export function completeNumberQuantityMission(
  mission: NumberQuantityMission,
  droppedObjectIds: string[],
) {
  return new Set(droppedObjectIds).size === mission.targetCount;
}
