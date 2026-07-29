import { getAnimalTopicKey } from "@/src/curriculum/preschool/animal";
import { repairChoicesForTarget } from "@/src/domain/rules/activity-integrity-rules";

import { ANIMAL_ASSET_TOPIC_TITLES, ANIMAL_WORLD_ID } from "./constants";
import type { AnimalPlayItem, AnimalPlayMission, AnimalPlayMode } from "./types";

function slug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

function animalItem(
  id: string,
  label?: string,
  assetTopicTitle?: string,
  assetWorldId?: string,
): AnimalPlayItem {
  const itemLabel =
    label ?? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ");
  const topicAssetTitle = assetTopicTitle ?? itemLabel;

  return {
    assetTopicTitle: topicAssetTitle,
    assetWorldId:
      assetWorldId ??
      (ANIMAL_ASSET_TOPIC_TITLES.has(topicAssetTitle)
        ? ANIMAL_WORLD_ID
        : undefined),
    id,
    label: itemLabel,
  };
}

export function buildAnimalChooseActivity(
  topicTitle: string,
  animalTopicTitles: string[],
) {
  const correctAnswer =
    topicTitle === "Animal Challenge" ? "Animals" : topicTitle;
  const distractors = animalTopicTitles
    .filter((candidate) => candidate !== topicTitle)
    .map((candidate) =>
      candidate === "Animal Challenge" ? "Animals" : candidate,
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
  };
}

export function buildAnimalPlayMission(topicTitle: string): AnimalPlayMission {
  const mission = (
    playMode: AnimalPlayMode,
    prompt: string,
    required: AnimalPlayItem,
    distractors: AnimalPlayItem[],
    dropZoneLabel: string,
    successText: string,
  ): AnimalPlayMission => ({
    distractorItemIds: distractors.map((item) => item.id),
    dropZoneLabel,
    items: [required, ...distractors],
    optionalDropItemIds: [],
    playMode,
    prompt,
    requiredDropItemIds: [required.id],
    requiredDropTargets: { [required.id]: slug(dropZoneLabel) },
    successText,
  });
  const missions: Record<string, AnimalPlayMission> = {
    dog: mission(
      "give-dog-bone",
      "Give Dog bone.",
      animalItem("bone"),
      [
        animalItem("seed"),
        animalItem("grass"),
        animalItem("fish", "Fish", "Fish"),
      ],
      "Dog",
      "Dog is happy!",
    ),
    cat: mission(
      "give-cat-yarn",
      "Give Cat yarn.",
      animalItem("yarn", "Yarn"),
      [
        animalItem("bone"),
        animalItem("grass"),
        animalItem("fish", "Fish", "Fish"),
      ],
      "Cat",
      "Cat can play!",
    ),
    bird: mission(
      "drag-bird-to-nest",
      "Bird to home.",
      animalItem("bird", "Bird", "Bird"),
      [
        animalItem("fish", "Fish", "Fish"),
        animalItem("cow", "Cow", "Cow"),
        animalItem("horse", "Horse", "Horse"),
      ],
      "Nest",
      "Bird is home!",
    ),
    fish: mission(
      "drag-fish-to-water",
      "Fish in water.",
      animalItem("fish", "Fish", "Fish"),
      [
        animalItem("bird", "Bird", "Bird"),
        animalItem("cow", "Cow", "Cow"),
        animalItem("dog", "Dog", "Dog"),
      ],
      "Water",
      "Fish can swim!",
    ),
    cow: mission(
      "feed-cow-grass",
      "Feed Cow.",
      animalItem("grass"),
      [
        animalItem("bone"),
        animalItem("seed"),
        animalItem("fish", "Fish", "Fish"),
      ],
      "Cow",
      "Cow is fed!",
    ),
    horse: mission(
      "feed-horse-hay",
      "Feed Horse.",
      animalItem("hay"),
      [
        animalItem("bone"),
        animalItem("fish", "Fish", "Fish"),
        animalItem("seed"),
      ],
      "Horse",
      "Horse is fed!",
    ),
    duck: mission(
      "drag-duck-to-pond",
      "Duck to water.",
      animalItem("duck", "Duck", "Duck"),
      [
        animalItem("cat", "Cat", "Cat"),
        animalItem("cow", "Cow", "Cow"),
        animalItem("dog", "Dog", "Dog"),
      ],
      "Pond",
      "Duck can swim!",
    ),
    "animal-challenge": {
      distractorItemIds: ["ball"],
      dropZoneLabel: "Animal Homes",
      items: [
        animalItem("dog", "Dog", "Dog"),
        animalItem("bird", "Bird", "Bird"),
        animalItem("fish", "Fish", "Fish"),
        animalItem("ball"),
      ],
      optionalDropItemIds: [],
      playMode: "match-animals-to-homes",
      prompt: "Animals to home.",
      requiredDropItemIds: ["dog", "bird", "fish"],
      requiredDropTargets: {
        bird: "nest",
        dog: "dog-house",
        fish: "water",
      },
      successText: "Animals are home!",
    },
  };

  return missions[getAnimalTopicKey(topicTitle)] ?? missions.dog;
}

export function recordAnimalDrop(current: string[], itemId: string) {
  return current.includes(itemId) ? current : [...current, itemId];
}
