import type { ImageSourcePropType } from "react-native";

import type { PreschoolStageWorldTopic } from "@/src/data/preschoolStageWorldTypes";

export type FruitStageType = "look" | "tap" | "try" | "choose" | "play";

export type FruitTopicId =
  | "apple"
  | "banana"
  | "mango"
  | "orange"
  | "grapes"
  | "watermelon";

export type FruitGardenTopic = PreschoolStageWorldTopic<FruitTopicId>;

const backgroundImage = require("../../Batibot assets/preschool assets/my family world/preschool-play-tab-background.jpg");
const wrongImage = require("../../Batibot assets/preschool assets/fruit garden/play drop area-wrong/wrong.png");
const basketImage = require("../../Batibot assets/preschool assets/fruit garden/play drop area/basket.png");

const fruitImages: Record<FruitTopicId, ImageSourcePropType> = {
  apple: require("../../Batibot assets/preschool assets/fruit garden/topic/apple.png"),
  banana: require("../../Batibot assets/preschool assets/fruit garden/topic/banana.png"),
  grapes: require("../../Batibot assets/preschool assets/fruit garden/topic/grapes.png"),
  mango: require("../../Batibot assets/preschool assets/fruit garden/topic/mango.png"),
  orange: require("../../Batibot assets/preschool assets/fruit garden/topic/orange.png"),
  watermelon: require("../../Batibot assets/preschool assets/fruit garden/topic/watermelon.png"),
};

const contextImages: Record<FruitTopicId, ImageSourcePropType> = {
  apple: require("../../Batibot assets/preschool assets/fruit garden/apple tree.png"),
  banana: require("../../Batibot assets/preschool assets/fruit garden/banana tree.png"),
  grapes: require("../../Batibot assets/preschool assets/fruit garden/grape plant.png"),
  mango: require("../../Batibot assets/preschool assets/fruit garden/mango tree.png"),
  orange: require("../../Batibot assets/preschool assets/fruit garden/orange tree.png"),
  watermelon: require("../../Batibot assets/preschool assets/fruit garden/watermelon plant.png"),
};

const completedImages: Record<FruitTopicId, ImageSourcePropType> = {
  apple: require("../../Batibot assets/preschool assets/fruit garden/play drop area-correct/apple-correct.png"),
  banana: require("../../Batibot assets/preschool assets/fruit garden/play drop area-correct/banana-correct.png"),
  grapes: require("../../Batibot assets/preschool assets/fruit garden/play drop area-correct/grapes-correct.png"),
  mango: require("../../Batibot assets/preschool assets/fruit garden/play drop area-correct/mango-correct.png"),
  orange: require("../../Batibot assets/preschool assets/fruit garden/play drop area-correct/orange-correct.png"),
  watermelon: require("../../Batibot assets/preschool assets/fruit garden/play drop area-correct/watermelon-correct.png"),
};

const FRUIT_ORDER: FruitTopicId[] = [
  "apple",
  "banana",
  "mango",
  "orange",
  "grapes",
  "watermelon",
];

const meanings: Record<FruitTopicId, string> = {
  apple: "Apple is a fruit",
  banana: "Banana is a fruit",
  grapes: "Grapes are fruits",
  mango: "Mango is a fruit",
  orange: "Orange is a fruit",
  watermelon: "Watermelon is a fruit",
};

const wrongItems: Record<FruitTopicId, FruitTopicId> = {
  apple: "mango",
  banana: "apple",
  grapes: "mango",
  mango: "apple",
  orange: "banana",
  watermelon: "apple",
};

function label(id: FruitTopicId) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function distractors(topicId: FruitTopicId, count: number) {
  return FRUIT_ORDER.filter((id) => id !== topicId).slice(0, count);
}

function createTopic(id: FruitTopicId, order: number): FruitGardenTopic {
  const tryDistractor = distractors(id, 1)[0];
  const chooseDistractors = distractors(id, 3);
  const wrongItem = wrongItems[id];

  return {
    id,
    label: label(id),
    order,
    look: {
      image: fruitImages[id],
      speech: `${label(id)}.`,
    },
    tap: {
      image: contextImages[id],
      meaning: meanings[id],
      speech: `${label(id)}. ${meanings[id]}.`,
    },
    try: {
      question: `Which one is ${label(id)}?`,
      choices: [
        { id, image: fruitImages[id], isCorrect: true, label: label(id) },
        { id: tryDistractor, image: fruitImages[tryDistractor], isCorrect: false, label: label(tryDistractor) },
      ],
    },
    choose: {
      question: `Find ${label(id).toLowerCase()}`,
      choices: [
        ...chooseDistractors.map((choiceId) => ({
          id: choiceId,
          image: fruitImages[choiceId],
          isCorrect: false,
        })),
        { id, image: fruitImages[id], isCorrect: true },
      ],
    },
    play: {
      task: `Collect ${label(id).toLowerCase()}`,
      timerSeconds: 10,
      situationImage: basketImage,
      completedImage: completedImages[id],
      dropLabel: "Collected",
      choices: [
        { id: `${id}-correct`, image: fruitImages[id], isCorrect: true, label: label(id) },
        { id: `${id}-wrong`, image: fruitImages[wrongItem], isCorrect: false, label: label(wrongItem) },
      ],
    },
    reward: {
      stars: 1,
      xp: 10,
    },
  };
}

export const preschoolFruitGardenTopics: FruitGardenTopic[] = FRUIT_ORDER.map((id, index) =>
  createTopic(id, index + 1)
);

export const preschoolFruitGarden = {
  backgroundImage,
  title: "Fruit Garden",
  topics: preschoolFruitGardenTopics,
  worldId: "preschool-fruit-garden",
  wrongImage,
} as const;
