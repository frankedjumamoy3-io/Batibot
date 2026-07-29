import type { ColorPlayMission } from "./types";

export function validateColorPlayMission(mission: ColorPlayMission) {
  const ids = mission.items.map((item) => item.id);

  return (
    ids.length === 4 &&
    new Set(ids).size === ids.length &&
    mission.requiredDropItemIds.every((id) => ids.includes(id)) &&
    mission.distractorItemIds.every((id) => ids.includes(id)) &&
    !mission.requiredDropItemIds.some((id) =>
      mission.distractorItemIds.includes(id),
    )
  );
}

export function completeColorPlayMission(
  mission: ColorPlayMission,
  droppedItemIds: string[],
) {
  const unique = Array.from(new Set(droppedItemIds));

  return (
    mission.requiredDropItemIds.every((id) => unique.includes(id)) &&
    !mission.distractorItemIds.some((id) => unique.includes(id)) &&
    unique.length === mission.requiredDropItemIds.length
  );
}
