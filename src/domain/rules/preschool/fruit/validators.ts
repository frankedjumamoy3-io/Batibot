import { FRUIT_CHALLENGE_OPTIONAL_IDS } from "./constants";
import type { FruitPlayMission } from "./types";

export function validateFruitPlayMission(mission: FruitPlayMission) {
  const ids = mission.items.map((item) => item.id);
  const correctIds = [
    ...mission.requiredDropItemIds,
    ...mission.optionalDropItemIds,
  ];

  return (
    ids.length >= 4 &&
    new Set(ids).size === ids.length &&
    Boolean(mission.destinationId) &&
    mission.requiredDropItemIds.length >= 1 &&
    mission.requiredDropItemIds.every((id) => ids.includes(id)) &&
    mission.optionalDropItemIds.every((id) =>
      FRUIT_CHALLENGE_OPTIONAL_IDS.includes(id),
    ) &&
    mission.distractorItemIds.every((id) => ids.includes(id)) &&
    !correctIds.some((id) => mission.distractorItemIds.includes(id)) &&
    (!mission.targetFruitId ||
      (mission.requiredDropItemIds.length === 1 &&
        mission.requiredDropItemIds[0] === mission.targetFruitId))
  );
}

export function completeFruitPlayMission(
  mission: FruitPlayMission,
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
