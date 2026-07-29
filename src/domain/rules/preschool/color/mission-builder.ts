import { getColorTopicKey } from "@/src/curriculum/preschool/color";
import { repairChoicesForTarget } from "@/src/domain/rules/activity-integrity-rules";

import { COLOR_HEX, COLOR_WORLD_ID } from "./constants";
import type { ColorPlayItem, ColorPlayMission, ColorPlayMode } from "./types";

function colorItem(id: string, label: string): ColorPlayItem {
  return {
    assetTopicTitle: label,
    assetWorldId: COLOR_WORLD_ID,
    color: COLOR_HEX[id] ?? COLOR_HEX.rainbow,
    id,
    label,
  };
}

export function getColorHex(topicTitle: string) {
  return (
    COLOR_HEX[getColorTopicKey(topicTitle).replace("-color-challenge", "")] ??
    COLOR_HEX.rainbow
  );
}

export function buildColorChooseActivity(
  topicTitle: string,
  colorTopicTitles: string[],
) {
  const correctAnswer =
    topicTitle === "Rainbow Color Challenge" ? "Rainbow" : topicTitle;
  const distractors = colorTopicTitles
    .filter((candidate) => candidate !== topicTitle)
    .map((candidate) =>
      candidate === "Rainbow Color Challenge" ? "Rainbow" : candidate,
    );
  const repaired = repairChoicesForTarget({
    choiceLimit: 4,
    choices: [correctAnswer, ...distractors].slice(0, 4),
    correctAnswer,
    distractorPool: distractors,
    targetConcept: correctAnswer,
  });

  return {
    choices: (repaired.activity.choices ?? []).map((choice) =>
      typeof choice === "string"
        ? choice
        : (choice.label ??
          choice.text ??
          choice.title ??
          choice.concept ??
          choice.id ??
          ""),
    ),
    correctAnswer,
  };
}

export function buildColorPlayMission(topicTitle: string): ColorPlayMission {
  const key = getColorTopicKey(topicTitle);
  const mission = (
    playMode: ColorPlayMode,
    prompt: string,
    required: string[],
    distractors: string[],
    dropZoneLabel: string,
    successText: string,
    optional: string[] = [],
  ): ColorPlayMission => ({
    distractorItemIds: distractors,
    dropZoneLabel,
    items: [...required, ...distractors]
      .slice(0, 4)
      .map((id) => colorItem(id, id.charAt(0).toUpperCase() + id.slice(1))),
    optionalDropItemIds: optional,
    playMode,
    prompt,
    requiredDropItemIds: required,
    successText,
  });

  const missions: Record<string, ColorPlayMission> = {
    red: mission(
      "drag-red-paint",
      "Paint Red.",
      ["red"],
      ["blue", "yellow", "green"],
      "Apple",
      "Apple is red.",
    ),
    blue: mission(
      "drag-blue-object",
      "Paint Blue.",
      ["blue"],
      ["red", "yellow", "green"],
      "Basket",
      "Caught blue.",
    ),
    yellow: mission(
      "drag-yellow-object",
      "Paint Yellow.",
      ["yellow"],
      ["red", "blue", "green"],
      "Box",
      "Yellow collected.",
    ),
    green: mission(
      "drag-green-object",
      "Paint Green.",
      ["green"],
      ["red", "yellow", "blue"],
      "Garden",
      "Green is growing.",
    ),
    orange: mission(
      "drag-orange-object",
      "Paint Orange.",
      ["orange"],
      ["apple", "grapes", "banana"],
      "Basket",
      "Orange picked.",
    ),
    purple: mission(
      "drag-purple-object",
      "Find Purple.",
      ["purple"],
      ["yellow", "green", "red"],
      "Purple box",
      "Purple found.",
    ),
    black: mission(
      "drag-black-object",
      "Find Black.",
      ["black"],
      ["white", "red", "yellow"],
      "Black box",
      "Black found.",
    ),
    white: mission(
      "drag-white-object",
      "Find White.",
      ["white"],
      ["black", "green", "blue"],
      "White box",
      "White found.",
    ),
    "rainbow-color-challenge": mission(
      "build-rainbow",
      "Build Rainbow.",
      ["red", "yellow", "blue"],
      ["black"],
      "Rainbow",
      "Rainbow complete.",
      ["orange", "green", "purple"],
    ),
  };

  const result = missions[key] ?? missions.red;

  if (key === "orange") {
    result.items = [
      colorItem("orange", "Orange"),
      {
        ...colorItem("apple", "Apple"),
        assetTopicTitle: "Apple",
        assetWorldId: "preschool-fruit-garden",
      },
      {
        ...colorItem("grapes", "Grapes"),
        assetTopicTitle: "Grapes",
        assetWorldId: "preschool-fruit-garden",
      },
      {
        ...colorItem("banana", "Banana"),
        assetTopicTitle: "Banana",
        assetWorldId: "preschool-fruit-garden",
      },
    ];
  }

  return result;
}

export function recordColorDrop(current: string[], itemId: string) {
  return current.includes(itemId) ? current : [...current, itemId];
}
