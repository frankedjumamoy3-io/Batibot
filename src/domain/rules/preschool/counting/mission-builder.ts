import { getCountingTopicKey } from "@/src/curriculum/preschool/counting";

import {
  ANIMAL_POOL,
  FOOD_POOL,
  FRUIT_POOL,
  MIXED_POOL,
  SHAPE_POOL,
} from "./constants";
import type {
  CountingForestAsset,
  CountingForestDestinationId,
  CountingForestLesson,
  CountingForestMission,
  CountingForestQuantityChoice,
  CountingForestTopicKey,
} from "./types";

function repeatPool(pool: CountingForestAsset[], count: number) {
  return Array.from({ length: count }, () => pool[0]);
}

function quantityChoice(
  id: string,
  pool: CountingForestAsset[],
  quantity: number,
  targetQuantity: number,
): CountingForestQuantityChoice {
  return {
    correct: quantity === targetQuantity,
    id,
    objects: repeatPool(pool, quantity),
    quantity,
  };
}

function quantityChoices(
  pool: CountingForestAsset[],
  targetQuantity: number,
  quantities: number[],
) {
  return quantities.map((quantity) =>
    quantityChoice(`quantity-${quantity}`, pool, quantity, targetQuantity),
  );
}

function mission(
  prompt: string,
  objectPool: CountingForestAsset[],
  baseCount: number,
  destinationId: CountingForestDestinationId,
  destinationLabel: string,
): CountingForestMission {
  return {
    startingObjects: repeatPool(objectPool, baseCount),
    destinationId,
    destinationLabel,
    objectPool,
    prompt,
    requiredObjects: repeatPool(objectPool, 1),
    targetQuantity: baseCount + 1,
  };
}

function lesson({
  chooseTargetQuantity,
  category,
  choosePrompt,
  chooseQuantities,
  destinationId,
  destinationLabel,
  lookCount,
  objectPool,
  playCount,
  playMode = "drag-exact-quantity",
  prompt,
  tapCount,
  tryCount,
  tryQuantities,
}: {
  category: CountingForestLesson["category"];
  chooseTargetQuantity?: number;
  choosePrompt: string;
  chooseQuantities: number[];
  destinationId: CountingForestDestinationId;
  destinationLabel: string;
  lookCount: number;
  objectPool: CountingForestAsset[];
  playCount: number;
  playMode?: CountingForestLesson["playMode"];
  prompt: string;
  tapCount: number;
  tryCount: number;
  tryQuantities: number[];
}): Omit<CountingForestLesson, "missions"> {
  return {
    assetPool: objectPool.map((item) => item.id),
    category,
    choose: {
      choices: quantityChoices(objectPool, chooseTargetQuantity ?? tryCount, chooseQuantities),
      prompt: choosePrompt,
      targetQuantity: chooseTargetQuantity ?? tryCount,
    },
    destinationId,
    destinationLabel,
    lookObjects: repeatPool(objectPool, lookCount),
    objectPool,
    playMode,
    prompt,
    quantityRange: { max: 4, min: 1 },
    tapObjects: repeatPool(objectPool, tapCount),
    tryChoices: quantityChoices(objectPool, tryCount, tryQuantities),
    tryObjects: repeatPool(objectPool, tryCount),
    tryPrompt: "How many did we count?",
    tryQuantity: tryCount,
  };
}

const LESSONS: Record<CountingForestTopicKey, Omit<CountingForestLesson, "missions">> = {
  "counting-animals": lesson({
    category: "animal",
    chooseTargetQuantity: 3,
    choosePrompt: "Find this many.",
    chooseQuantities: [1, 2, 3, 4],
    destinationId: "animal-home",
    destinationLabel: "Animal Home",
    lookCount: 1,
    objectPool: ANIMAL_POOL,
    playCount: 3,
    prompt: "Add one more.",
    tapCount: 2,
    tryCount: 2,
    tryQuantities: [2, 3],
  }),
  "counting-fruits": lesson({
    category: "fruit",
    chooseTargetQuantity: 3,
    choosePrompt: "Find this many.",
    chooseQuantities: [1, 2, 3, 4],
    destinationId: "basket",
    destinationLabel: "Basket",
    lookCount: 1,
    objectPool: FRUIT_POOL,
    playCount: 3,
    prompt: "Add one more.",
    tapCount: 2,
    tryCount: 2,
    tryQuantities: [2, 3],
  }),
  "counting-foods": lesson({
    category: "food",
    chooseTargetQuantity: 3,
    choosePrompt: "Find this many.",
    chooseQuantities: [1, 2, 3, 4],
    destinationId: "picnic-basket",
    destinationLabel: "Picnic Basket",
    lookCount: 1,
    objectPool: FOOD_POOL,
    playCount: 3,
    prompt: "Add one more.",
    tapCount: 2,
    tryCount: 2,
    tryQuantities: [2, 3],
  }),
  "counting-shapes": lesson({
    category: "shape",
    chooseTargetQuantity: 3,
    choosePrompt: "Find this many.",
    chooseQuantities: [1, 2, 3, 4],
    destinationId: "shape-box",
    destinationLabel: "Shape Box",
    lookCount: 1,
    objectPool: SHAPE_POOL,
    playCount: 3,
    prompt: "Add one more.",
    tapCount: 2,
    tryCount: 2,
    tryQuantities: [2, 3],
  }),
  "counting-challenge": lesson({
    category: "mixed",
    chooseTargetQuantity: 3,
    choosePrompt: "Find this many.",
    chooseQuantities: [1, 2, 3, 4],
    destinationId: "animal-home",
    destinationLabel: "Animal Home",
    lookCount: 1,
    objectPool: MIXED_POOL,
    playCount: 3,
    playMode: "multi-drag-exact-quantity",
    prompt: "Add one more.",
    tapCount: 2,
    tryCount: 2,
    tryQuantities: [2, 3],
  }),
};

export function buildCountingForestLesson(topicTitle: string): CountingForestLesson {
  const key = getCountingTopicKey(topicTitle) as CountingForestTopicKey;
  const base = LESSONS[key] ?? LESSONS["counting-animals"];
  const missions =
    key === "counting-challenge"
      ? [
          mission("Add one more.", ANIMAL_POOL, 3, "animal-home", "Animal Home"),
          mission("Add one more.", FRUIT_POOL, 3, "basket", "Basket"),
          mission("Add one more.", FOOD_POOL, 3, "picnic-basket", "Picnic Basket"),
          mission("Add one more.", SHAPE_POOL, 3, "shape-box", "Shape Box"),
        ]
      : [
          mission(
            base.prompt,
            base.objectPool,
            base.choose.targetQuantity,
            base.destinationId,
            base.destinationLabel,
          ),
        ];

  return { ...base, missions };
}
