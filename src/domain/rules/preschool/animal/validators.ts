import type { AnimalPlayMission } from "./types";

export function validateAnimalPlayMission(mission: AnimalPlayMission) {
  const ids = mission.items.map((item) => item.id);

  return (
    ids.length === 4 &&
    new Set(ids).size === ids.length &&
    mission.requiredDropItemIds.length >= 1 &&
    mission.requiredDropItemIds.every((id) =>
      Boolean(mission.requiredDropTargets[id]),
    ) &&
    mission.requiredDropItemIds.every((id) => ids.includes(id)) &&
    mission.optionalDropItemIds.every((id) => ids.includes(id)) &&
    mission.distractorItemIds.every((id) => ids.includes(id)) &&
    !mission.requiredDropItemIds.some((id) =>
      mission.distractorItemIds.includes(id),
    )
  );
}

export function completeAnimalPlayMission(
  mission: AnimalPlayMission,
  droppedItemIds: string[],
  droppedTargets: Record<string, string>,
) {
  const unique = Array.from(new Set(droppedItemIds));
  const allowedCorrectIds = [
    ...mission.requiredDropItemIds,
    ...mission.optionalDropItemIds,
  ];

  return (
    mission.requiredDropItemIds.every((id) => unique.includes(id)) &&
    mission.requiredDropItemIds.every(
      (id) => droppedTargets[id] === mission.requiredDropTargets[id],
    ) &&
    !mission.distractorItemIds.some((id) => unique.includes(id)) &&
    unique.every((id) => allowedCorrectIds.includes(id))
  );
}
