import type { ImageSourcePropType } from "react-native";

import type { PreschoolStageWorldTopic } from "@/src/data/preschoolStageWorldTypes";

export type FoodStageType = "look" | "tap" | "try" | "choose" | "play";

export type FoodTopicId =
  | "rice"
  | "bread"
  | "milk"
  | "egg"
  | "meat"
  | "vegetables"
  | "juice";

export type FoodTownTopic = PreschoolStageWorldTopic<FoodTopicId>;

const backgroundImage = require("../../Batibot assets/preschool assets/my family world/preschool-play-tab-background.jpg");
const wrongImage = require("../../Batibot assets/preschool assets/food town/play drop area-wrong/wrong.png");
const tableImage = require("../../Batibot assets/preschool assets/food town/play drop area/table.png");

const foodImages: Record<FoodTopicId, ImageSourcePropType> = {
  bread: require("../../Batibot assets/preschool assets/food town/topic/bread.png"),
  egg: require("../../Batibot assets/preschool assets/food town/topic/egg.png"),
  juice: require("../../Batibot assets/preschool assets/food town/topic/juice.png"),
  meat: require("../../Batibot assets/preschool assets/food town/topic/meat.png"),
  milk: require("../../Batibot assets/preschool assets/food town/topic/milk.png"),
  rice: require("../../Batibot assets/preschool assets/food town/topic/rice.png"),
  vegetables: require("../../Batibot assets/preschool assets/food town/topic/vegetable.png"),
};

const contextImages: Record<FoodTopicId, ImageSourcePropType> = {
  bread: require("../../Batibot assets/preschool assets/food town/bread.png"),
  egg: require("../../Batibot assets/preschool assets/food town/egg.png"),
  juice: require("../../Batibot assets/preschool assets/food town/juice.png"),
  meat: require("../../Batibot assets/preschool assets/food town/meat.png"),
  milk: require("../../Batibot assets/preschool assets/food town/milk.png"),
  rice: require("../../Batibot assets/preschool assets/food town/rice.png"),
  vegetables: require("../../Batibot assets/preschool assets/food town/vegetable.png"),
};

const completedImages: Record<FoodTopicId, ImageSourcePropType> = {
  bread: require("../../Batibot assets/preschool assets/food town/play drop area-correct/bread.png"),
  egg: require("../../Batibot assets/preschool assets/food town/play drop area-correct/egg.png"),
  juice: require("../../Batibot assets/preschool assets/food town/play drop area-correct/juice.png"),
  meat: require("../../Batibot assets/preschool assets/food town/play drop area-correct/meat.png"),
  milk: require("../../Batibot assets/preschool assets/food town/play drop area-correct/milk.png"),
  rice: require("../../Batibot assets/preschool assets/food town/play drop area-correct/rice.png"),
  vegetables: require("../../Batibot assets/preschool assets/food town/play drop area-correct/vegetable.png"),
};

const FOOD_ORDER: FoodTopicId[] = [
  "rice",
  "bread",
  "milk",
  "egg",
  "meat",
  "vegetables",
  "juice",
];

const meanings: Record<FoodTopicId, string> = {
  bread: "Food to eat",
  egg: "Food to eat",
  juice: "Drink to enjoy",
  meat: "Food to eat",
  milk: "Drink for strong body",
  rice: "Food to eat",
  vegetables: "Food to eat",
};

const wrongItems: Record<FoodTopicId, FoodTopicId> = {
  bread: "milk",
  egg: "juice",
  juice: "rice",
  meat: "milk",
  milk: "meat",
  rice: "egg",
  vegetables: "meat",
};

function label(id: FoodTopicId) {
  if (id === "vegetables") return "Vegetables";
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function distractors(topicId: FoodTopicId, count: number) {
  return FOOD_ORDER.filter((id) => id !== topicId).slice(0, count);
}

function createTopic(id: FoodTopicId, order: number): FoodTownTopic {
  const tryDistractor = distractors(id, 1)[0];
  const chooseDistractors = distractors(id, 3);
  const wrongItem = wrongItems[id];

  return {
    id,
    label: label(id),
    order,
    look: {
      image: foodImages[id],
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
        { id: tryDistractor, image: foodImages[tryDistractor], isCorrect: false, label: label(tryDistractor) },
        { id, image: foodImages[id], isCorrect: true, label: label(id) },
      ],
    },
    choose: {
      question: `Find ${label(id).toLowerCase()}`,
      choices: [
        ...chooseDistractors.map((choiceId) => ({
          id: choiceId,
          image: foodImages[choiceId],
          isCorrect: false,
        })),
        { id, image: foodImages[id], isCorrect: true },
      ],
    },
    play: {
      task: `Serve ${label(id).toLowerCase()}`,
      timerSeconds: 10,
      situationImage: tableImage,
      completedImage: completedImages[id],
      dropLabel: "Served",
      choices: [
        { id: `${id}-correct`, image: foodImages[id], isCorrect: true, label: label(id) },
        { id: `${id}-wrong`, image: foodImages[wrongItem], isCorrect: false, label: label(wrongItem) },
      ],
    },
    reward: {
      stars: 1,
      xp: 10,
    },
  };
}

export const preschoolFoodTownTopics: FoodTownTopic[] = FOOD_ORDER.map((id, index) =>
  createTopic(id, index + 1)
);

export const preschoolFoodTown = {
  backgroundImage,
  title: "Food Town",
  topics: preschoolFoodTownTopics,
  worldId: "preschool-food-town",
  wrongImage,
} as const;
