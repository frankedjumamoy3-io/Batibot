import {
  getNumberQuantityFromTitle,
  isNumberChallengeTopic,
  NUMBER_WORDS,
} from "@/src/curriculum/preschool/number";
import { repairChoicesForTarget } from "@/src/domain/rules/activity-integrity-rules";

import { MIXED_SHAPE_ASSETS, NUMBER_SUPPORT_WORLD_IDS } from "./constants";
import {
  getNearbyQuantities,
  getStableShuffledItems,
} from "./distractors";
import type {
  NumberChooseActivity,
  NumberChooseFormat,
  NumberDestinationId,
  NumberObjectKind,
  NumberPlayMission,
  NumberQuantityMission,
  NumberQuantityObjectAsset,
} from "./types";

function quantityMission(
  targetCount: number,
  objectKind: NumberObjectKind,
  objectLabel: string,
  availableCount: number,
  objectAssetTopicTitle: string,
  objectAssetWorldId: string | undefined,
  destinationId: NumberDestinationId,
  destinationLabel: string,
  objectAssetCycle?: NumberQuantityObjectAsset[],
): NumberQuantityMission {
  return {
    availableCount,
    destinationId,
    destinationLabel,
    objectAssetCycle,
    objectAssetTopicTitle,
    objectAssetWorldId,
    objectKind,
    objectLabel,
    prompt: `Collect ${targetCount} ${objectLabel}.`,
    targetCount,
  };
}

export function buildNumberChooseActivity(topicTitle: string): NumberChooseActivity {
  if (isNumberChallengeTopic(topicTitle)) {
    const choices = ["Count mission", "Color mission", "Shape mission", "Letter mission"];

    return {
      choices: getStableShuffledItems(choices, `${topicTitle}-number-choose`),
      correctAnswer: "Count mission",
      format: "quantity-to-word",
      quantity: 4,
    };
  }

  const quantity = getNumberQuantityFromTitle(topicTitle) || 4;
  const format: NumberChooseFormat =
    quantity % 2 === 0 ? "quantity-to-word" : "number-to-quantity";

  if (format === "number-to-quantity") {
    const quantityChoices = getNearbyQuantities(quantity);

    return {
      choices: getStableShuffledItems(
        quantityChoices.map(String),
        `${topicTitle}-number-choose`,
      ),
      correctAnswer: `${quantity}`,
      format,
      quantity,
    };
  }

  const correctAnswer = NUMBER_WORDS[quantity] ?? "Four";
  const distractors = Object.values(NUMBER_WORDS).filter(
    (word) => word !== correctAnswer,
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
    format,
    quantity,
  };
}

export function buildNumberPlayMission(topicTitle: string): NumberPlayMission {
  const quantity = getNumberQuantityFromTitle(topicTitle);
  const singleMissions: Record<number, NumberQuantityMission> = {
    1: quantityMission(1, "apple", "Apple", 4, "Apple", NUMBER_SUPPORT_WORLD_IDS.fruit, "basket", "Basket"),
    2: quantityMission(2, "star", "Stars", 5, "Star", NUMBER_SUPPORT_WORLD_IDS.shape, "basket", "Basket"),
    3: quantityMission(3, "fish", "Fish", 6, "Fish", NUMBER_SUPPORT_WORLD_IDS.animal, "pond", "Pond"),
    4: quantityMission(4, "banana", "Bananas", 7, "Banana", NUMBER_SUPPORT_WORLD_IDS.fruit, "basket", "Basket"),
    5: quantityMission(5, "ball", "Balls", 8, "Ball", undefined, "basket", "Basket"),
    6: quantityMission(6, "flower", "Flowers", 9, "Flower", undefined, "garden", "Garden"),
    7: quantityMission(7, "bird", "Birds", 10, "Bird", NUMBER_SUPPORT_WORLD_IDS.animal, "tree", "Tree"),
    8: quantityMission(8, "leaf", "Leaves", 10, "Leaf", undefined, "basket", "Basket"),
    9: quantityMission(9, "grapes", "Grapes", 10, "Grapes", NUMBER_SUPPORT_WORLD_IDS.fruit, "basket", "Basket"),
    10: quantityMission(10, "shape", "Shapes", 10, "Circle", NUMBER_SUPPORT_WORLD_IDS.shape, "shape-box", "Shape Box", MIXED_SHAPE_ASSETS),
  };

  if (isNumberChallengeTopic(topicTitle)) {
    return {
      destinationId: "basket",
      destinationLabel: "Basket",
      missions: [
        quantityMission(3, "apple", "Apples", 6, "Apple", NUMBER_SUPPORT_WORLD_IDS.fruit, "basket", "Basket"),
        quantityMission(5, "fish", "Fish", 8, "Fish", NUMBER_SUPPORT_WORLD_IDS.animal, "pond", "Pond"),
        quantityMission(2, "star", "Stars", 5, "Star", NUMBER_SUPPORT_WORLD_IDS.shape, "basket", "Basket"),
        quantityMission(7, "bird", "Birds", 10, "Bird", NUMBER_SUPPORT_WORLD_IDS.animal, "tree", "Tree"),
      ],
      playMode: "multi-count",
      successText: "Counting complete!",
    };
  }

  const mission = singleMissions[quantity] ?? singleMissions[1];

  return {
    destinationId: mission.destinationId,
    destinationLabel: mission.destinationLabel,
    missions: [mission],
    playMode: "collect-quantity",
    successText: `${NUMBER_WORDS[quantity] ?? "One"} collected!`,
  };
}
