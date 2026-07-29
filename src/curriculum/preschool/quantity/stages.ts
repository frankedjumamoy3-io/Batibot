import { PRESCHOOL_QUANTITY_WORLD_ID } from "./config";
import type { PreschoolQuantityStageCopy, PreschoolQuantityStageMetadata } from "./types";

const QUANTITY_STAGE_COPY: Record<"LOOK" | "TAP" | "TRY" | "CHOOSE", PreschoolQuantityStageCopy> = {
  CHOOSE: { audioText: "Which has more?", instruction: "Choose more or less.", questionText: "Which group has more?" },
  LOOK: { audioText: "Look at both groups.", instruction: "Observe both groups.", questionText: "What do you notice about the groups?" },
  TAP: { audioText: "Count each group.", instruction: "Tap and count each group.", questionText: "Can you count each group?" },
  TRY: { audioText: "Remember each quantity.", instruction: "Remember the two counts.", questionText: "How many were in each group?" },
};

const QUANTITY_PLAY_INSTRUCTION_BY_TOPIC: Record<string, string> = {
  "More & Less Challenge": "Complete the valley adventure.",
  "More Animals": "Count animal groups.",
  "More Foods": "Count food groups.",
  "More Fruits": "Count fruit groups.",
  "More Shapes": "Count shape groups.",
};

const QUANTITY_CONCEPTS = [
  "more animals",
  "more fruits",
  "more foods",
  "more shapes",
  "less animals",
  "less fruits",
  "less foods",
  "less shapes",
];

const QUANTITY_STAGE_METADATA_BY_TOPIC: Record<string, PreschoolQuantityStageMetadata> = {
  "More & Less Challenge": {
    quantityChallengeConcepts: QUANTITY_CONCEPTS,
    quantityConcept: "mixed count then compare",
    quantityGroupCounts: [5, 2, 6, 3],
    quantityMissionType: "valley compare adventure",
    quantityObjectTypes: ["animals", "fruits", "foods", "shapes"],
  },
  "More Animals": {
    quantityConcept: "count animals then compare",
    quantityGroupCounts: [5, 2, 4, 1],
    quantityMissionType: "animal group compare",
    quantityObjectTypes: ["dogs", "cats", "birds"],
  },
  "More Foods": {
    quantityConcept: "count foods then compare",
    quantityGroupCounts: [4, 2, 5, 1],
    quantityMissionType: "food group compare",
    quantityObjectTypes: ["rice bowls", "eggs", "bread"],
  },
  "More Fruits": {
    quantityConcept: "count fruits then compare",
    quantityGroupCounts: [5, 3, 6, 2],
    quantityMissionType: "fruit group compare",
    quantityObjectTypes: ["apples", "bananas", "grapes"],
  },
  "More Shapes": {
    quantityConcept: "count shapes then compare",
    quantityGroupCounts: [3, 5, 2, 6],
    quantityMissionType: "shape group compare",
    quantityObjectTypes: ["circles", "squares", "stars"],
  },
};

export function getQuantityStageCopy(stage: "LOOK" | "TAP" | "TRY" | "CHOOSE") {
  return QUANTITY_STAGE_COPY[stage];
}

export function getQuantityPlayInstruction(topicTitle: string) {
  return QUANTITY_PLAY_INSTRUCTION_BY_TOPIC[topicTitle] ?? "Complete the quantity mission.";
}

export function getQuantityStageMetadata(topicTitle: string) {
  return QUANTITY_STAGE_METADATA_BY_TOPIC[topicTitle] ?? {};
}

export function isScopedQuantityWorldTopic(worldId: string, topicTitle: string) {
  return worldId === PRESCHOOL_QUANTITY_WORLD_ID && topicTitle in QUANTITY_STAGE_METADATA_BY_TOPIC;
}
