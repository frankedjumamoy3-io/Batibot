import { getBodyTopicKey } from "@/src/curriculum/preschool/body";
import { repairChoicesForTarget } from "@/src/domain/rules/activity-integrity-rules";

import { BODY_SUPPORT_WORLD_IDS, BODY_WORLD_ID } from "./constants";
import type { BodyPlayItem, BodyPlayMission } from "./types";

function item(
  id: string,
  label: string,
  assetWorldId: string,
  assetTopicTitle: string,
): BodyPlayItem {
  return { assetTopicTitle, assetWorldId, id, label };
}

function body(id: string, label = id) {
  return item(
    id,
    label,
    BODY_WORLD_ID,
    label,
  );
}

function generic(id: string, label: string) {
  return item(id, label, BODY_WORLD_ID, label);
}

export function buildBodyChooseActivity(
  topicTitle: string,
  bodyTopicTitles: string[],
) {
  const correctAnswer = topicTitle;
  const distractors = bodyTopicTitles
    .filter((candidate) => candidate !== topicTitle)
    .map((candidate) => candidate);
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

export function buildBodyPlayMission(topicTitle: string): BodyPlayMission {
  const missions: Record<string, BodyPlayMission> = {
    head: {
      distractorItemIds: ["hands", "feet", "ball"],
      dropZoneLabel: "Body",
      items: [
        body("head", "Head"),
        body("hands", "Hands"),
        body("feet", "Feet"),
        generic("ball", "Ball"),
      ],
      optionalDropItemIds: [],
      playMode: "drag-head-to-body",
      prompt: "Head on Body.",
      requiredDropItemIds: ["head"],
      successText: "Head is on Body.",
    },
    hair: {
      distractorItemIds: ["eyes", "mouth", "feet"],
      dropZoneLabel: "Head",
      items: [
        body("hair", "Hair"),
        body("eyes", "Eyes"),
        body("mouth", "Mouth"),
        body("feet", "Feet"),
      ],
      optionalDropItemIds: [],
      playMode: "drag-head-to-body",
      prompt: "Hair on Head.",
      requiredDropItemIds: ["hair"],
      successText: "Hair is on Head.",
    },
    eyes: {
      distractorItemIds: ["nose", "mouth", "ears"],
      dropZoneLabel: "Face",
      items: [
        body("eyes", "Eyes"),
        body("nose", "Nose"),
        body("mouth", "Mouth"),
        body("ears", "Ears"),
      ],
      optionalDropItemIds: [],
      playMode: "drag-eyes-to-face",
      prompt: "Eyes to face.",
      requiredDropItemIds: ["eyes"],
      successText: "Eyes can see.",
    },
    ears: {
      distractorItemIds: ["apple", "flower", "shoe"],
      dropZoneLabel: "Ears",
      items: [
        generic("sound", "Sound"),
        item("apple", "Apple", BODY_SUPPORT_WORLD_IDS.fruit, "Apple"),
        item("flower", "Flower", BODY_SUPPORT_WORLD_IDS.nature, "Flowers"),
        generic("shoe", "Shoe"),
      ],
      optionalDropItemIds: [],
      playMode: "drag-sound-to-ears",
      prompt: "Ears hear.",
      requiredDropItemIds: ["sound"],
      successText: "Ears hear sound.",
    },
    nose: {
      distractorItemIds: ["ball", "shoe", "book"],
      dropZoneLabel: "Nose",
      items: [
        item("flower", "Flower", BODY_SUPPORT_WORLD_IDS.nature, "Flowers"),
        generic("ball", "Ball"),
        generic("shoe", "Shoe"),
        generic("book", "Book"),
      ],
      optionalDropItemIds: [],
      playMode: "drag-flower-to-nose",
      prompt: "Nose smell.",
      requiredDropItemIds: ["flower"],
      successText: "Nose smells flower.",
    },
    mouth: {
      distractorItemIds: ["shoe", "toy", "rock"],
      dropZoneLabel: "Mouth",
      items: [
        item("food", "Apple", BODY_SUPPORT_WORLD_IDS.fruit, "Apple"),
        generic("shoe", "Shoe"),
        generic("toy", "Toy"),
        generic("rock", "Rock"),
      ],
      optionalDropItemIds: [],
      playMode: "drag-food-to-mouth",
      prompt: "Feed Mouth.",
      requiredDropItemIds: ["food"],
      successText: "Mouth eats food.",
    },
    teeth: {
      distractorItemIds: ["hands", "feet", "eyes"],
      dropZoneLabel: "Mouth",
      items: [
        body("teeth", "Teeth"),
        body("hands", "Hands"),
        body("feet", "Feet"),
        body("eyes", "Eyes"),
      ],
      optionalDropItemIds: [],
      playMode: "drag-food-to-mouth",
      prompt: "Teeth in Mouth.",
      requiredDropItemIds: ["teeth"],
      successText: "Teeth help chew.",
    },
    hands: {
      distractorItemIds: ["flower", "shoe", "book"],
      dropZoneLabel: "Hands",
      items: [
        generic("toy", "Toy"),
        item("flower", "Flower", BODY_SUPPORT_WORLD_IDS.nature, "Flowers"),
        generic("shoe", "Shoe"),
        generic("book", "Book"),
      ],
      optionalDropItemIds: [],
      playMode: "drag-toy-to-hands",
      prompt: "Pick toy.",
      requiredDropItemIds: ["toy"],
      successText: "Hands hold toy.",
    },
    feet: {
      distractorItemIds: ["hands", "eyes", "nose"],
      dropZoneLabel: "Footprints",
      items: [
        body("feet", "Feet"),
        body("hands", "Hands"),
        body("eyes", "Eyes"),
        body("nose", "Nose"),
      ],
      optionalDropItemIds: [],
      playMode: "drag-feet-to-footprints",
      prompt: "Walk to goal.",
      requiredDropItemIds: ["feet"],
      successText: "Feet reached goal.",
    },
    body: {
      distractorItemIds: ["ball"],
      dropZoneLabel: "Body",
      items: [
        body("head", "Head"),
        body("hands", "Hands"),
        body("feet", "Feet"),
        generic("ball", "Ball"),
      ],
      optionalDropItemIds: ["eyes", "nose", "mouth", "ears"],
      playMode: "build-body",
      prompt: "Build Body.",
      requiredDropItemIds: ["head", "hands", "feet"],
      successText: "Body complete.",
    },
  };

  return missions[getBodyTopicKey(topicTitle)] ?? missions.head;
}

export function recordBodyDrop(current: string[], itemId: string) {
  return current.includes(itemId) ? current : [...current, itemId];
}
