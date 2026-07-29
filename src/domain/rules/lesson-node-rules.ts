import type { ActiveLearningPhase } from "@/src/data/curriculum/learning-path";

export const SINGLE_STAGE_NODE_INDEX = 0;
export const SINGLE_STAGE_NODE_INDEXES = [SINGLE_STAGE_NODE_INDEX] as const;

const KINDERGARTEN_WORD_RECOGNITION_WORLD_IDS = new Set([
  "kindergarten-alphabet",
  "kindergarten-community-village",
  "kindergarten-nature",
  "kindergarten-reading-readiness",
  "kindergarten-school",
  "kindergarten-shapes",
]);

const SINGLE_NODE_PRESCHOOL_NUMERACY_WORLD_IDS = new Set([
  "preschool-number-village",
  "preschool-big-small",
  "preschool-more-less",
  "preschool-pattern-playground",
]);

export function getExploreInteractionRequirement(worldId: string) {
  if (
    worldId.startsWith("preschool-") ||
    worldId.startsWith("kindergarten-")
  ) {
    return 3;
  }

  return 1;
}

export function getStageNodeIndexes(
  worldId: string,
  topicLabel: string | undefined,
  step: ActiveLearningPhase
) {
  if (
    worldId === "preschool-family-world" &&
    step === "Challenge" &&
    [
      "Baby",
      "Brother",
      "Family Challenge",
      "Father",
      "Friend",
      "Home",
      "Mother",
      "Sister",
    ].includes(topicLabel ?? "")
  ) {
    return SINGLE_STAGE_NODE_INDEXES;
  }

  if (worldId === "preschool-body-world" && step === "Challenge") {
    return SINGLE_STAGE_NODE_INDEXES;
  }

  if (worldId === "preschool-colorful-world" && step === "Challenge") {
    return SINGLE_STAGE_NODE_INDEXES;
  }

  if (worldId === "preschool-shape-kingdom" && step === "Challenge") {
    return SINGLE_STAGE_NODE_INDEXES;
  }

  if (worldId === "preschool-animal-adventure" && step === "Challenge") {
    return SINGLE_STAGE_NODE_INDEXES;
  }

  if (worldId === "preschool-fruit-garden" && step === "Challenge") {
    return SINGLE_STAGE_NODE_INDEXES;
  }

  if (worldId === "preschool-food-town" && step === "Challenge") {
    return SINGLE_STAGE_NODE_INDEXES;
  }

  if (
    SINGLE_NODE_PRESCHOOL_NUMERACY_WORLD_IDS.has(worldId) &&
    step === "Challenge"
  ) {
    return SINGLE_STAGE_NODE_INDEXES;
  }

  if (KINDERGARTEN_WORD_RECOGNITION_WORLD_IDS.has(worldId) && step === "Challenge") {
    return SINGLE_STAGE_NODE_INDEXES;
  }

  if ((worldId.startsWith("preschool-") || worldId.startsWith("kindergarten-")) && step === "Challenge") {
    return [0, 1, 2] as const;
  }

  return SINGLE_STAGE_NODE_INDEXES;
}

export function getStageNodeCount(
  worldId: string,
  topicLabel: string | undefined,
  step: ActiveLearningPhase
) {
  return getStageNodeIndexes(worldId, topicLabel, step).length;
}
