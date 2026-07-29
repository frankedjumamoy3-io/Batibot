import { PRESCHOOL_COUNTING_WORLD_ID } from "@/src/curriculum/preschool/counting";

import type { CountingForestAsset, CountingForestObjectKind } from "./types";

function asset(
  id: string,
  label: string,
  kind: CountingForestObjectKind,
  assetGroup: "animals" | "food" | "fruits" | "shapes",
  topicTitle: string,
  worldId: string,
): CountingForestAsset {
  return {
    assetId: `counting_forest_${assetGroup}_${id}`,
    id,
    kind,
    label,
    topicTitle,
    worldId,
  };
}

export const ANIMAL_POOL = [
  asset("dog", "Dog", "animal", "animals", "Dog", PRESCHOOL_COUNTING_WORLD_ID),
  asset("cat", "Cat", "animal", "animals", "Cat", PRESCHOOL_COUNTING_WORLD_ID),
  asset("bird", "Bird", "animal", "animals", "Bird", PRESCHOOL_COUNTING_WORLD_ID),
  asset("fish", "Fish", "animal", "animals", "Fish", PRESCHOOL_COUNTING_WORLD_ID),
  asset("cow", "Cow", "animal", "animals", "Cow", PRESCHOOL_COUNTING_WORLD_ID),
  asset("horse", "Horse", "animal", "animals", "Horse", PRESCHOOL_COUNTING_WORLD_ID),
];

export const FRUIT_POOL = [
  asset("apple", "Apple", "fruit", "fruits", "Apple", PRESCHOOL_COUNTING_WORLD_ID),
  asset("banana", "Banana", "fruit", "fruits", "Banana", PRESCHOOL_COUNTING_WORLD_ID),
  asset("orange", "Orange", "fruit", "fruits", "Orange", PRESCHOOL_COUNTING_WORLD_ID),
  asset("mango", "Mango", "fruit", "fruits", "Mango", PRESCHOOL_COUNTING_WORLD_ID),
  asset("grapes", "Grapes", "fruit", "fruits", "Grapes", PRESCHOOL_COUNTING_WORLD_ID),
  asset("watermelon", "Watermelon", "fruit", "fruits", "Watermelon", PRESCHOOL_COUNTING_WORLD_ID),
];

export const FOOD_POOL = [
  asset("bread", "Bread", "food", "food", "Bread", PRESCHOOL_COUNTING_WORLD_ID),
  asset("milk", "Milk", "food", "food", "Milk", PRESCHOOL_COUNTING_WORLD_ID),
  asset("egg", "Egg", "food", "food", "Egg", PRESCHOOL_COUNTING_WORLD_ID),
  asset("rice", "Rice", "food", "food", "Rice", PRESCHOOL_COUNTING_WORLD_ID),
  asset("fish", "Fish", "food", "food", "Fish", PRESCHOOL_COUNTING_WORLD_ID),
  asset("juice", "Juice", "food", "food", "Juice", PRESCHOOL_COUNTING_WORLD_ID),
];

export const SHAPE_POOL = [
  asset("circle", "Circle", "shape", "shapes", "Circle", PRESCHOOL_COUNTING_WORLD_ID),
  asset("square", "Square", "shape", "shapes", "Square", PRESCHOOL_COUNTING_WORLD_ID),
  asset("triangle", "Triangle", "shape", "shapes", "Triangle", PRESCHOOL_COUNTING_WORLD_ID),
  asset("rectangle", "Rectangle", "shape", "shapes", "Rectangle", PRESCHOOL_COUNTING_WORLD_ID),
  asset("star", "Star", "shape", "shapes", "Star", PRESCHOOL_COUNTING_WORLD_ID),
];

export const MIXED_POOL = [
  ANIMAL_POOL[2],
  FRUIT_POOL[0],
  FOOD_POOL[0],
  SHAPE_POOL[0],
  ANIMAL_POOL[0],
  FRUIT_POOL[1],
];
