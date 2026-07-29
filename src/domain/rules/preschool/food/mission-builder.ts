import { getFoodTopicKey } from "@/src/curriculum/preschool/food";
import { repairChoicesForTarget } from "@/src/domain/rules/activity-integrity-rules";

import { FOOD_WORLD_ID } from "./constants";
import type { FoodPlayItem, FoodPlayMission, FoodPlayMode } from "./types";

function foodItem(id: string, label?: string): FoodPlayItem {
  const itemLabel = label ?? id.charAt(0).toUpperCase() + id.slice(1);

  return {
    assetTopicTitle: itemLabel,
    assetWorldId: FOOD_WORLD_ID,
    id,
    label: itemLabel,
  };
}

function genericItem(id: string, label?: string): FoodPlayItem {
  const itemLabel = label ?? id.charAt(0).toUpperCase() + id.slice(1);

  return {
    assetTopicTitle: itemLabel,
    id,
    label: itemLabel,
  };
}

export function buildFoodChooseActivity(
  topicTitle: string,
  foodTopicTitles: string[],
) {
  const correctAnswer = topicTitle === "Food Challenge" ? "Meal" : topicTitle;
  const distractors = foodTopicTitles
    .filter((candidate) => candidate !== topicTitle)
    .map((candidate) => candidate === "Food Challenge" ? "Meal" : candidate);
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

export function buildFoodPlayMission(topicTitle: string): FoodPlayMission {
  const mission = (
    playMode: FoodPlayMode,
    prompt: string,
    targetFoodId: string,
    distractorItemIds: string[],
    destinationId: string,
    destinationLabel: string,
    successText: string,
  ): FoodPlayMission => ({
    destinationId,
    destinationLabel,
    distractorItemIds,
    items: [targetFoodId, ...distractorItemIds].map((id) =>
      ["toy"].includes(id) ? genericItem(id) : foodItem(id),
    ),
    optionalDropItemIds: [],
    playMode,
    prompt,
    requiredDropItemIds: [targetFoodId],
    successText,
    targetFoodId,
  });
  const missions: Record<string, FoodPlayMission> = {
    rice: mission(
      "serve-food-to-plate",
      "Serve Rice.",
      "rice",
      ["juice", "bread", "toy"],
      "plate",
      "Plate",
      "Rice served!",
    ),
    bread: mission(
      "serve-food-to-plate",
      "Make Sandwich.",
      "bread",
      ["rice", "juice", "milk"],
      "plate",
      "Plate",
      "Sandwich ready!",
    ),
    milk: mission(
      "give-drink-to-child",
      "Give Milk.",
      "milk",
      ["egg", "bread", "toy"],
      "child",
      "Child",
      "Milk given!",
    ),
    egg: mission(
      "collect-food-to-basket",
      "Collect Egg.",
      "egg",
      ["bread", "milk", "juice"],
      "basket",
      "Basket",
      "Egg collected!",
    ),
    vegetables: mission(
      "collect-food-to-basket",
      "Pick Vegetables.",
      "vegetables",
      ["meat", "juice", "toy"],
      "basket",
      "Basket",
      "Vegetables picked!",
    ),
    meat: mission(
      "serve-food-to-plate",
      "Serve Meat.",
      "meat",
      ["vegetables", "juice", "milk"],
      "plate",
      "Plate",
      "Meat served!",
    ),
    juice: mission(
      "serve-drink-to-cup",
      "Serve Juice.",
      "juice",
      ["rice", "egg", "bread"],
      "cup-table",
      "Cup",
      "Juice served!",
    ),
    "food-challenge": {
      destinationId: "meal-tray",
      destinationLabel: "Meal Tray",
      distractorItemIds: ["toy"],
      items: [
        foodItem("rice"),
        foodItem("vegetables"),
        foodItem("juice"),
        genericItem("toy"),
      ],
      optionalDropItemIds: ["bread", "egg", "milk"],
      playMode: "make-meal",
      prompt: "Make Meal.",
      requiredDropItemIds: ["rice", "vegetables", "juice"],
      successText: "Meal is ready!",
    },
  };

  return missions[getFoodTopicKey(topicTitle)] ?? missions.rice;
}

export function recordFoodDrop(current: string[], itemId: string) {
  return current.includes(itemId) ? current : [...current, itemId];
}
