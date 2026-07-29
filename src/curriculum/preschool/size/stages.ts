import { PRESCHOOL_SIZE_WORLD_ID } from "./config";
import type { PreschoolSizeStageCopy, PreschoolSizeStageMetadata } from "./types";

const SIZE_STAGE_COPY: Record<"LOOK" | "TAP" | "TRY" | "CHOOSE", PreschoolSizeStageCopy> = {
  CHOOSE: { audioText: "Choose the biggest.", instruction: "Choose by size.", questionText: "Which object is biggest?" },
  LOOK: { audioText: "Can you find the big one?", instruction: "Look for size.", questionText: "Which one is big?" },
  TAP: { audioText: "Tap the big object.", instruction: "Tap only the big object.", questionText: "Can you tap the big object?" },
  TRY: { audioText: "Which object was bigger?", instruction: "Remember the size.", questionText: "Which object was bigger?" },
};

const SIZE_PLAY_INSTRUCTION_BY_TOPIC: Record<string, string> = {
  Big: "Find big.",
  "Mixed Sizes": "Help the size village.",
  Short: "Find short.",
  Small: "Find small.",
  Tall: "Find tall.",
};

const SIZE_CONCEPTS = ["big", "small", "tall", "short"];

const SIZE_STAGE_METADATA_BY_TOPIC: Record<string, PreschoolSizeStageMetadata> = {
  Big: {
    sizeConcept: "physical size big",
    sizeMissionType: "big size find",
    sizeObjectLabels: ["same apple small", "same apple medium", "same apple big"],
    sizeScaleSet: [0.6, 1, 1.45],
  },
  "Mixed Sizes": {
    sizeChallengeConcepts: SIZE_CONCEPTS,
    sizeConcept: "mixed physical size concepts",
    sizeMissionType: "village size adventure",
    sizeObjectLabels: ["big fruit", "small fruit", "tall animal", "short animal"],
    sizeScaleSet: [0.6, 1, 1.45],
  },
  Short: {
    sizeConcept: "physical size short",
    sizeMissionType: "short height find",
    sizeObjectLabels: ["same horse short", "same horse medium", "same horse tall"],
    sizeScaleSet: [0.6, 1, 1.45],
  },
  Small: {
    sizeConcept: "physical size small",
    sizeMissionType: "small size find",
    sizeObjectLabels: ["same apple small", "same apple medium", "same apple big"],
    sizeScaleSet: [0.6, 1, 1.45],
  },
  Tall: {
    sizeConcept: "physical size tall",
    sizeMissionType: "tall height find",
    sizeObjectLabels: ["same horse short", "same horse medium", "same horse tall"],
    sizeScaleSet: [0.6, 1, 1.45],
  },
};

export function getSizeStageCopy(stage: "LOOK" | "TAP" | "TRY" | "CHOOSE") {
  return SIZE_STAGE_COPY[stage];
}

export function getSizePlayInstruction(topicTitle: string) {
  return SIZE_PLAY_INSTRUCTION_BY_TOPIC[topicTitle] ?? "Complete the size mission.";
}

export function getSizeStageMetadata(topicTitle: string) {
  return SIZE_STAGE_METADATA_BY_TOPIC[topicTitle] ?? {};
}

export function isScopedSizeWorldTopic(worldId: string, topicTitle: string) {
  return worldId === PRESCHOOL_SIZE_WORLD_ID && topicTitle in SIZE_STAGE_METADATA_BY_TOPIC;
}
