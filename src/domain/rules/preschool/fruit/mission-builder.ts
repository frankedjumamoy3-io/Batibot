import { getFruitTopicKey } from "@/src/curriculum/preschool/fruit";
import { repairChoicesForTarget } from "@/src/domain/rules/activity-integrity-rules";

import { FRUIT_WORLD_ID } from "./constants";
import type { FruitPlayItem, FruitPlayMission, FruitPlayMode } from "./types";

function fruitItem(id: string, label?: string): FruitPlayItem {
  const itemLabel = label ?? id.charAt(0).toUpperCase() + id.slice(1);

  return {
    assetTopicTitle: itemLabel,
    assetWorldId: FRUIT_WORLD_ID,
    id,
    label: itemLabel,
  };
}

function genericItem(id: string, label?: string): FruitPlayItem {
  const itemLabel = label ?? id.charAt(0).toUpperCase() + id.slice(1);

  return {
    assetTopicTitle: itemLabel,
    id,
    label: itemLabel,
  };
}

export function buildFruitChooseActivity(
  topicTitle: string,
  fruitTopicTitles: string[],
) {
  const correctAnswer = topicTitle === "Fruit Challenge" ? "Fruits" : topicTitle;
  const distractors = fruitTopicTitles
    .filter((candidate) => candidate !== topicTitle)
    .map((candidate) => candidate === "Fruit Challenge" ? "Fruits" : candidate);
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

export function buildFruitPlayMission(topicTitle: string): FruitPlayMission {
  const mission = (
    playMode: FruitPlayMode,
    prompt: string,
    targetFruitId: string,
    distractorItemIds: string[],
    destinationId: string,
    destinationLabel: string,
    successText: string,
  ): FruitPlayMission => ({
    destinationId,
    destinationLabel,
    distractorItemIds,
    items: [targetFruitId, ...distractorItemIds].map((id) => fruitItem(id)),
    optionalDropItemIds: [],
    playMode,
    prompt,
    requiredDropItemIds: [targetFruitId],
    successText,
    targetFruitId,
  });
  const missions: Record<string, FruitPlayMission> = {
    apple: mission(
      "drag-fruit-to-basket",
      "Pick Apple.",
      "apple",
      ["banana", "mango", "orange"],
      "basket",
      "Basket",
      "Apple picked!",
    ),
    banana: mission(
      "feed-monkey-fruit",
      "Feed Monkey.",
      "banana",
      ["apple", "orange", "grapes"],
      "monkey",
      "Monkey",
      "Monkey is fed!",
    ),
    mango: mission(
      "drag-fruit-to-basket",
      "Pick Mango.",
      "mango",
      ["apple", "banana", "orange"],
      "basket",
      "Basket",
      "Mango picked!",
    ),
    orange: mission(
      "drag-fruit-to-basket",
      "Pick Orange.",
      "orange",
      ["apple", "mango", "grapes"],
      "basket",
      "Basket",
      "Orange picked!",
    ),
    grapes: mission(
      "drag-fruit-to-basket",
      "Pick Grapes.",
      "grapes",
      ["banana", "orange", "watermelon"],
      "basket",
      "Basket",
      "Grapes picked!",
    ),
    watermelon: mission(
      "drag-fruit-to-wagon",
      "Move Watermelon.",
      "watermelon",
      ["apple", "grapes", "orange"],
      "wagon",
      "Wagon",
      "Watermelon moved!",
    ),
    "fruit-challenge": {
      destinationId: "basket",
      destinationLabel: "Basket",
      distractorItemIds: ["toy"],
      items: [
        fruitItem("apple"),
        fruitItem("banana"),
        fruitItem("mango"),
        genericItem("toy"),
      ],
      optionalDropItemIds: ["orange", "grapes", "watermelon"],
      playMode: "fruit-basket-challenge",
      prompt: "Fill Basket.",
      requiredDropItemIds: ["apple", "banana", "mango"],
      successText: "Basket is full!",
    },
  };

  return missions[getFruitTopicKey(topicTitle)] ?? missions.apple;
}

export function recordFruitDrop(current: string[], itemId: string) {
  return current.includes(itemId) ? current : [...current, itemId];
}
