import type { ImageSourcePropType } from "react-native";

import type { PreschoolStageWorldTopic } from "@/src/data/preschoolStageWorldTypes";

export type ColorfulStageType = "look" | "tap" | "try" | "choose" | "play";

export type ColorTopicId =
  | "red"
  | "blue"
  | "yellow"
  | "green"
  | "orange"
  | "purple"
  | "white"
  | "black";

export type ColorfulWorldTopic = PreschoolStageWorldTopic<ColorTopicId>;

const backgroundImage = require("../../Batibot assets/preschool assets/my family world/preschool-play-tab-background.jpg");
const wrongImage = require("../../Batibot assets/preschool assets/my colorful world/play drop area-wrong/wrong.png");

const colorImages: Record<ColorTopicId, ImageSourcePropType> = {
  black: require("../../Batibot assets/preschool assets/my colorful world/topic/black.png"),
  blue: require("../../Batibot assets/preschool assets/my colorful world/topic/blue.png"),
  green: require("../../Batibot assets/preschool assets/my colorful world/topic/green.png"),
  orange: require("../../Batibot assets/preschool assets/my colorful world/topic/orange.png"),
  purple: require("../../Batibot assets/preschool assets/my colorful world/topic/purple.png"),
  red: require("../../Batibot assets/preschool assets/my colorful world/topic/red.png"),
  white: require("../../Batibot assets/preschool assets/my colorful world/topic/white.png"),
  yellow: require("../../Batibot assets/preschool assets/my colorful world/topic/yellow.png"),
};

const tapImages: Record<ColorTopicId, ImageSourcePropType> = {
  // TODO: replace with black cat asset when a dedicated black cat is available.
  black: require("../../Batibot assets/preschool assets/animal adventure/topic/cat.png"),
  // TODO: replace with sky image asset when available.
  blue: require("../../Batibot assets/preschool assets/my colorful world/color blue.png"),
  green: require("../../Batibot assets/Leaf.png"),
  orange: require("../../Batibot assets/preschool assets/fruit garden/topic/orange.png"),
  purple: require("../../Batibot assets/preschool assets/fruit garden/topic/grapes.png"),
  red: require("../../Batibot assets/preschool assets/fruit garden/topic/apple.png"),
  // TODO: replace with cloud image asset when available.
  white: require("../../Batibot assets/preschool assets/my colorful world/color white.png"),
  yellow: require("../../Batibot assets/Sun.png"),
};

// TODO: replace these colored targets with outlined/uncolored object assets when available.
const situationImages: Record<ColorTopicId, ImageSourcePropType> = {
  black: require("../../Batibot assets/preschool assets/my colorful world/play drop area/black.png"),
  blue: require("../../Batibot assets/preschool assets/my colorful world/play drop area/blue.png"),
  green: require("../../Batibot assets/preschool assets/my colorful world/play drop area/green.png"),
  orange: require("../../Batibot assets/preschool assets/my colorful world/play drop area/orange.png"),
  purple: require("../../Batibot assets/preschool assets/my colorful world/play drop area/purple.png"),
  red: require("../../Batibot assets/preschool assets/my colorful world/play drop area/red.png"),
  white: require("../../Batibot assets/preschool assets/my colorful world/play drop area/white.png"),
  yellow: require("../../Batibot assets/preschool assets/my colorful world/play drop area/yellow.png"),
};

const completedImages: Record<ColorTopicId, ImageSourcePropType> = {
  black: require("../../Batibot assets/preschool assets/my colorful world/play drop area-correct/black-correct.png"),
  blue: require("../../Batibot assets/preschool assets/my colorful world/play drop area-correct/blue-correct.png"),
  green: require("../../Batibot assets/preschool assets/my colorful world/play drop area-correct/green-correct.png"),
  orange: require("../../Batibot assets/preschool assets/my colorful world/play drop area-correct/orange-correct.png"),
  purple: require("../../Batibot assets/preschool assets/my colorful world/play drop area-correct/purple-correct.png"),
  red: require("../../Batibot assets/preschool assets/my colorful world/play drop area-correct/red-correct.png"),
  white: require("../../Batibot assets/preschool assets/my colorful world/play drop area-correct/white-correct.png"),
  yellow: require("../../Batibot assets/preschool assets/my colorful world/play drop area-correct/yellow-correct.png"),
};

const COLOR_ORDER: ColorTopicId[] = [
  "red",
  "blue",
  "yellow",
  "green",
  "orange",
  "purple",
  "white",
  "black",
];

const meanings: Record<ColorTopicId, string> = {
  black: "Cat is black",
  blue: "Sky is blue",
  green: "Leaf is green",
  orange: "Orange is orange",
  purple: "Grapes are purple",
  red: "Apple is red",
  white: "Cloud is white",
  yellow: "Sun is yellow",
};

const playTasks: Record<ColorTopicId, string> = {
  black: "Complete the cat",
  blue: "Complete the sky",
  green: "Complete the leaf",
  orange: "Complete the orange",
  purple: "Complete the grapes",
  red: "Complete the apple",
  white: "Complete the cloud",
  yellow: "Complete the sun",
};

function label(id: ColorTopicId) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function distractors(topicId: ColorTopicId, count: number) {
  return COLOR_ORDER.filter((id) => id !== topicId).slice(0, count);
}

function createTopic(id: ColorTopicId, order: number): ColorfulWorldTopic {
  const tryDistractor = distractors(id, 1)[0];
  const chooseDistractors = distractors(id, 3);
  const wrongPlayId = distractors(id, 1)[0];

  return {
    id,
    label: label(id),
    order,
    look: {
      image: colorImages[id],
      speech: `${label(id)}.`,
    },
    tap: {
      image: tapImages[id],
      meaning: meanings[id],
      speech: `${label(id)}. ${meanings[id]}.`,
    },
    try: {
      question: `Which one is ${label(id)}?`,
      choices: [
        { id: tryDistractor, image: colorImages[tryDistractor], isCorrect: false, label: label(tryDistractor) },
        { id, image: colorImages[id], isCorrect: true, label: label(id) },
      ],
    },
    choose: {
      question: `Find ${label(id).toLowerCase()}`,
      choices: [
        ...chooseDistractors.map((choiceId) => ({
          id: choiceId,
          image: colorImages[choiceId],
          isCorrect: false,
        })),
        { id, image: colorImages[id], isCorrect: true },
      ],
    },
    play: {
      task: playTasks[id],
      timerSeconds: 10,
      situationImage: situationImages[id],
      completedImage: completedImages[id],
      dropLabel: `${label(id)} complete`,
      choices: [
        { id: `${id}-correct`, image: colorImages[id], isCorrect: true, label: label(id) },
        { id: `${id}-wrong`, image: colorImages[wrongPlayId], isCorrect: false, label: label(wrongPlayId) },
      ],
    },
    reward: {
      stars: 1,
      xp: 10,
    },
  };
}

export const preschoolColorfulWorldTopics: ColorfulWorldTopic[] = COLOR_ORDER.map((id, index) =>
  createTopic(id, index + 1)
);

export const preschoolColorfulWorld = {
  backgroundImage,
  title: "My Colorful World",
  topics: preschoolColorfulWorldTopics,
  worldId: "preschool-colorful-world",
  wrongImage,
} as const;
