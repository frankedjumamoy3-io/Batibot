import { repairChoicesForTarget } from "@/src/domain/rules/activity-integrity-rules";

import {
  FAMILY_BUILD_CARDS,
  FAMILY_HOME_DRAG_CARDS,
  FAMILY_WORLD_ID,
} from "./constants";
import { getFamilyDistractorCardIds } from "./distractors";
import type {
  FamilyChooseActivity,
  FamilyPlayAttempt,
  FamilyPlayCard,
  FamilyPlayMission,
  ScopedFamilyPlayMissionConfig,
} from "./types";
import { validateDropTarget } from "./validators";

function normalizeFamilyTopicKey(topicTitle: string) {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getScopedFamilyPlayMissionConfig(
  topicTitle: string
): ScopedFamilyPlayMissionConfig {
  const topicKey = normalizeFamilyTopicKey(topicTitle);

  switch (topicKey) {
    case "home":
      return {
        destinationAssetTopicTitle: "Home",
        destinationAssetWorldId: FAMILY_WORLD_ID,
        destinationLabel: "Home",
        dropZoneId: "home-drop-zone",
        missionTitle: "Put Family Home",
        playMode: "drag-family-home",
        prompt: "Drag family home.",
        requiredCardIds: ["baby", "friend"],
        successText: "Family is home.",
        targetConcept: "Home",
      };
    case "family":
      return {
        destinationAssetTopicTitle: "Family",
        destinationAssetWorldId: FAMILY_WORLD_ID,
        destinationLabel: "Family",
        dropZoneId: "family-build-zone",
        missionTitle: "Build Family",
        playMode: "build-home-family",
        prompt: "Build Family.",
        requiredCardIds: ["home", "mother", "father"],
        successText: "Family complete.",
        targetConcept: "Family",
      };
    case "mother":
      return {
        destinationAssetTopicTitle: "Kitchen",
        destinationAssetWorldId: "preschool-food-town",
        destinationLabel: "Kitchen",
        dropZoneId: "mother-kitchen-drop-zone",
        missionTitle: "Help Mother Cook",
        playMode: "single-family-home",
        prompt: "Help Mother cook.",
        requiredCardIds: ["mother"],
        successText: "Mother cooks food.",
        targetConcept: "Mother",
      };
    case "father":
      return {
        destinationAssetTopicTitle: "Tool Box",
        destinationAssetWorldId: FAMILY_WORLD_ID,
        destinationLabel: "Tool Box",
        dropZoneId: "father-tool-box-drop-zone",
        missionTitle: "Help Father Fix",
        playMode: "single-family-home",
        prompt: "Help Father fix.",
        requiredCardIds: ["father"],
        successText: "Father fixes things.",
        targetConcept: "Father",
      };
    case "brother":
      return {
        destinationAssetTopicTitle: "Toy Box",
        destinationAssetWorldId: FAMILY_WORLD_ID,
        destinationLabel: "Toy Box",
        dropZoneId: "brother-toy-box-drop-zone",
        missionTitle: "Help Brother Share",
        playMode: "single-family-home",
        prompt: "Help Brother share toys.",
        requiredCardIds: ["brother"],
        successText: "Brother shares toys.",
        targetConcept: "Brother",
      };
    case "sister":
      return {
        destinationAssetTopicTitle: "School Bag",
        destinationAssetWorldId: FAMILY_WORLD_ID,
        destinationLabel: "School Bag",
        dropZoneId: "sister-school-bag-drop-zone",
        missionTitle: "Help Sister Pack",
        playMode: "single-family-home",
        prompt: "Help Sister pack.",
        requiredCardIds: ["sister"],
        successText: "Sister packs her bag.",
        targetConcept: "Sister",
      };
    case "baby":
      return {
        destinationAssetTopicTitle: "Baby",
        destinationAssetWorldId: FAMILY_WORLD_ID,
        destinationLabel: "Care Mat",
        dropZoneId: "baby-care-mat-drop-zone",
        missionTitle: "Care For Baby",
        playMode: "single-family-home",
        prompt: "Care for Baby.",
        requiredCardIds: ["baby"],
        successText: "Baby is cared for.",
        targetConcept: "Baby",
      };
    case "friend":
      return {
        destinationAssetTopicTitle: "Friend",
        destinationAssetWorldId: FAMILY_WORLD_ID,
        destinationLabel: "Playground",
        dropZoneId: "friend-playground-drop-zone",
        missionTitle: "Play With Friend",
        playMode: "single-family-home",
        prompt: "Help Friend play.",
        requiredCardIds: ["friend"],
        successText: "Friend plays kindly.",
        targetConcept: "Friend",
      };
    default:
      return {
        destinationAssetTopicTitle: "Home",
        destinationAssetWorldId: FAMILY_WORLD_ID,
        destinationLabel: "Home",
        dropZoneId: `${topicKey || "family"}-home-drop-zone`,
        missionTitle: `Bring ${topicTitle} Home`,
        playMode: "single-family-home",
        prompt: `Bring ${topicTitle} home.`,
        requiredCardIds: [topicKey],
        successText: `${topicTitle} is home.`,
        targetConcept: topicTitle,
      };
  }
}

export function buildChooseActivity({
  correctAnswer,
  distractors,
  targetConcept,
}: {
  correctAnswer: string;
  distractors: string[];
  targetConcept: string;
}): FamilyChooseActivity {
  const repaired = repairChoicesForTarget({
    choiceLimit: 4,
    choices: [correctAnswer, ...distractors].slice(0, 4),
    correctAnswer,
    correctAssetConcept: targetConcept,
    distractorPool: distractors,
    targetConcept,
  });
  const choices = (repaired.activity.choices ?? []).map((choice) =>
    typeof choice === "string"
      ? choice
      : choice.label ?? choice.text ?? choice.title ?? choice.concept ?? choice.id ?? ""
  );

  return {
    choices,
    correctAnswer,
    targetConcept,
  };
}

export function buildPlayMission({
  cards,
  destinationLabel,
  destinationAssetTopicTitle,
  destinationAssetWorldId,
  distractorCardIds,
  dropZoneId,
  enforceHomeFirst = false,
  playMode,
  prompt,
  requiredCardIds,
  successText,
  targetConcept,
}: {
  cards: FamilyPlayCard[];
  destinationLabel: string;
  destinationAssetTopicTitle?: string;
  destinationAssetWorldId?: string;
  distractorCardIds: string[];
  dropZoneId: string;
  enforceHomeFirst?: boolean;
  playMode: FamilyPlayMission["playMode"];
  prompt: string;
  requiredCardIds: string[];
  successText: string;
  targetConcept: string;
}): FamilyPlayMission {
  const uniqueCards = cards.filter(
    (card, index, items) =>
      items.findIndex((candidate) => candidate.id === card.id) === index
  );

  return {
    cards: uniqueCards.slice(0, 4),
    destinationLabel,
    destinationAssetTopicTitle,
    destinationAssetWorldId,
    distractorCardIds,
    dropZoneId,
    enforceHomeFirst,
    playMode,
    prompt,
    requiredCardIds,
    successText,
    targetConcept,
  };
}

export function buildHomeDragFamilyMission() {
  const config = getScopedFamilyPlayMissionConfig("Home");

  return buildPlayMission({
    cards: FAMILY_HOME_DRAG_CARDS,
    destinationAssetTopicTitle: config.destinationAssetTopicTitle,
    destinationAssetWorldId: config.destinationAssetWorldId,
    destinationLabel: config.destinationLabel,
    distractorCardIds: ["tree", "cow"],
    dropZoneId: config.dropZoneId,
    playMode: config.playMode,
    prompt: config.prompt,
    requiredCardIds: config.requiredCardIds,
    successText: config.successText,
    targetConcept: config.targetConcept,
  });
}

export function buildFamilyBuildMission() {
  const config = getScopedFamilyPlayMissionConfig("Family");

  return buildPlayMission({
    cards: FAMILY_BUILD_CARDS,
    destinationAssetTopicTitle: config.destinationAssetTopicTitle,
    destinationAssetWorldId: config.destinationAssetWorldId,
    destinationLabel: config.destinationLabel,
    distractorCardIds: ["tree"],
    dropZoneId: config.dropZoneId,
    enforceHomeFirst: true,
    playMode: config.playMode,
    prompt: config.prompt,
    requiredCardIds: config.requiredCardIds,
    successText: config.successText,
    targetConcept: config.targetConcept,
  });
}

export function buildScopedFamilyPlayMission(
  topicTitle: string,
  cards: FamilyPlayCard[]
) {
  const config = getScopedFamilyPlayMissionConfig(topicTitle);

  if (config.playMode === "drag-family-home") {
    return buildHomeDragFamilyMission();
  }

  if (config.playMode === "build-home-family") {
    return buildFamilyBuildMission();
  }

  return buildPlayMission({
    cards,
    destinationAssetTopicTitle: config.destinationAssetTopicTitle,
    destinationAssetWorldId: config.destinationAssetWorldId,
    destinationLabel: config.destinationLabel,
    distractorCardIds: getFamilyDistractorCardIds(cards, config.requiredCardIds),
    dropZoneId: config.dropZoneId,
    playMode: config.playMode,
    prompt: config.prompt,
    requiredCardIds: config.requiredCardIds,
    successText: config.successText,
    targetConcept: config.targetConcept,
  });
}

export function recordDroppedObject(
  mission: FamilyPlayMission,
  droppedCardIds: string[],
  droppedCardId: string
) {
  return validateDropTarget(mission, droppedCardId, droppedCardIds)
    ? [...droppedCardIds, droppedCardId]
    : droppedCardIds;
}

export function recordPlayAttempt(
  mission: FamilyPlayMission,
  droppedCardIds: string[]
): FamilyPlayAttempt {
  const uniqueDroppedIds = Array.from(new Set(droppedCardIds));

  return {
    correct:
      mission.requiredCardIds.every((id) => uniqueDroppedIds.includes(id)) &&
      !mission.distractorCardIds.some((id) => uniqueDroppedIds.includes(id)) &&
      uniqueDroppedIds.length === mission.requiredCardIds.length,
    droppedCardIds: uniqueDroppedIds,
  };
}

export function completePlayMission(attempt: FamilyPlayAttempt) {
  return attempt.correct;
}
