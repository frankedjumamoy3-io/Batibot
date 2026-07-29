import { FOOD_CHALLENGE_OPTIONAL_IDS } from "./constants";
import type { FoodPlayMission } from "./types";

export function validateFoodPlayMission(mission: FoodPlayMission) {
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
      FOOD_CHALLENGE_OPTIONAL_IDS.includes(id),
    ) &&
    mission.distractorItemIds.every((id) => ids.includes(id)) &&
    !correctIds.some((id) => mission.distractorItemIds.includes(id)) &&
    (!mission.targetFoodId ||
      (mission.requiredDropItemIds.length === 1 &&
        mission.requiredDropItemIds[0] === mission.targetFoodId))
  );
}

export function completeFoodPlayMission(
  mission: FoodPlayMission,
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
