import type { CountingForestLesson, CountingForestMission, CountingForestQuantityChoice } from "./types";

const FORBIDDEN_PROMPT_PATTERN =
  /\b(more|less|same|most|fewest|biggest|smallest|add|plus|subtract|minus|number|numeral)\b|[0-9]/i;

function hasSafePrompt(value: string) {
  const normalized = value.replace(/\badd one more\b/gi, "");
  return !FORBIDDEN_PROMPT_PATTERN.test(normalized);
}

function hasOneCorrectQuantityChoice(choices: CountingForestQuantityChoice[]) {
  return (
    [2, 4].includes(choices.length) &&
    choices.filter((choice) => choice.correct).length === 1 &&
    new Set(choices.map((choice) => choice.quantity)).size === choices.length &&
    choices.every(
      (choice) =>
        choice.quantity >= 1 &&
        choice.quantity <= 6 &&
        choice.objects.length === choice.quantity,
    )
  );
}

export function validateCountingForestLesson(lesson: CountingForestLesson) {
  const validMissionCount = lesson.playMode === "multi-drag-exact-quantity" ? 4 : 1;
  const safePrompts = [
    lesson.choose.prompt,
    lesson.prompt,
    lesson.tryPrompt,
    ...lesson.missions.map((missionItem) => missionItem.prompt),
  ].every(hasSafePrompt);

  return (
    lesson.missions.length === validMissionCount &&
    lesson.objectPool.length >= 4 &&
    lesson.lookObjects.length === 1 &&
    lesson.tapObjects.length === 2 &&
    lesson.tryObjects.length === lesson.tryQuantity &&
    lesson.tryQuantity === 2 &&
    lesson.choose.targetQuantity === 3 &&
    lesson.assetPool.length === lesson.objectPool.length &&
    lesson.quantityRange.min === 1 &&
    lesson.quantityRange.max === 4 &&
    hasOneCorrectQuantityChoice(lesson.tryChoices) &&
    hasOneCorrectQuantityChoice(lesson.choose.choices) &&
    safePrompts &&
    lesson.missions.every(
      (missionItem) =>
        missionItem.startingObjects.length === missionItem.targetQuantity - 1 &&
        missionItem.requiredObjects.length === 1 &&
        missionItem.targetQuantity >= 2 &&
        missionItem.targetQuantity <= 6 &&
        Boolean(missionItem.destinationId) &&
        Boolean(missionItem.destinationLabel) &&
        hasSafePrompt(missionItem.prompt) &&
        missionItem.requiredObjects.every((item) =>
          missionItem.objectPool.some((poolItem) => poolItem.id === item.id),
        ),
    )
  );
}

export function completeCountingForestMission(
  missionItem: CountingForestMission,
  droppedObjectIds: string[],
) {
  return (
    droppedObjectIds.length === missionItem.requiredObjects.length &&
    new Set(droppedObjectIds).size === droppedObjectIds.length &&
    droppedObjectIds.every((id) =>
      missionItem.requiredObjects.some((item, index) => `${item.id}-${index}` === id),
    )
  );
}
