import type { ShapePlayMission } from "./types";

export function validateShapePlayMission(mission: ShapePlayMission) {
  const ids = mission.items.map((item) => item.id);

  return (
    ids.length >= 4 &&
    new Set(ids).size === ids.length &&
    mission.requiredDropItemIds.every((id) => ids.includes(id)) &&
    mission.optionalDropItemIds.every((id) => ids.includes(id)) &&
    mission.distractorItemIds.every((id) => ids.includes(id)) &&
    !mission.requiredDropItemIds.some((id) =>
      mission.distractorItemIds.includes(id),
    )
  );
}

export function completeShapePlayMission(
  mission: ShapePlayMission,
  droppedItemIds: string[],
) {
  const unique = Array.from(new Set(droppedItemIds));
  const allowedCorrectIds = [
    ...mission.requiredDropItemIds,
    ...mission.optionalDropItemIds,
  ];

  return (
    mission.requiredDropItemIds.every((id) => unique.includes(id)) &&
    !mission.distractorItemIds.some((id) => unique.includes(id)) &&
    unique.every((id) => allowedCorrectIds.includes(id))
  );
}
