import { PRESCHOOL_PATTERN_WORLD_ID } from "./config";
import type { PreschoolPatternStageCopy, PreschoolPatternStageMetadata } from "./types";

const PATTERN_STAGE_COPY: Record<"LOOK" | "TAP" | "TRY" | "CHOOSE", PreschoolPatternStageCopy> = {
  CHOOSE: { audioText: "Choose the missing object.", instruction: "Choose what comes next.", questionText: "Which picture comes next?" },
  LOOK: { audioText: "Look at the pattern.", instruction: "Observe the sequence.", questionText: "What repeats in the pattern?" },
  TAP: { audioText: "Tap the repeating unit.", instruction: "Tap the part that repeats.", questionText: "Which part repeats?" },
  TRY: { audioText: "What comes next?", instruction: "Remember the pattern.", questionText: "What comes next?" },
};

const PATTERN_STAGE_METADATA_BY_TOPIC: Record<string, PreschoolPatternStageMetadata> = {
  "Animal Patterns": { patternObjectTypes: ["cat", "dog", "bird"], patternType: "AB" },
  "Food Patterns": { patternObjectTypes: ["rice", "egg", "bread"], patternType: "ABB" },
  "Fruit Patterns": { patternObjectTypes: ["apple", "banana", "mango"], patternType: "AAB" },
  "Pattern Challenge": {
    patternChallengeTypes: ["AB", "AAB", "ABB", "ABC"],
    patternObjectTypes: ["animals", "fruits", "foods", "shapes"],
    patternType: "ABC",
  },
  "Shape Patterns": { patternObjectTypes: ["circle", "square", "triangle"], patternType: "ABC" },
};

export function getPatternStageCopy(stage: "LOOK" | "TAP" | "TRY" | "CHOOSE") {
  return PATTERN_STAGE_COPY[stage];
}

export function getPatternPlayInstruction() {
  return "Build the pattern.";
}

export function getPatternStageMetadata(topicTitle: string) {
  return PATTERN_STAGE_METADATA_BY_TOPIC[topicTitle] ?? {};
}

export function isScopedPatternWorldTopic(worldId: string, topicTitle: string) {
  return worldId === PRESCHOOL_PATTERN_WORLD_ID && topicTitle in PATTERN_STAGE_METADATA_BY_TOPIC;
}
