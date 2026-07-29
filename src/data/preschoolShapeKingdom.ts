import type { ImageSourcePropType } from "react-native";

import type { PreschoolStageWorldTopic } from "@/src/data/preschoolStageWorldTypes";

export type ShapeStageType = "look" | "tap" | "try" | "choose" | "play";

export type ShapeTopicId = "circle" | "square" | "triangle" | "rectangle" | "star";

export type ShapeKingdomTopic = PreschoolStageWorldTopic<ShapeTopicId>;

const backgroundImage = require("../../Batibot assets/preschool assets/my family world/preschool-play-tab-background.jpg");
const wrongImage = require("../../Batibot assets/preschool assets/shape kingdom/play drop area-wrong/wrong.png");
const boxImage = require("../../Batibot assets/preschool assets/shape kingdom/play drop area/box.png");

const shapeImages: Record<ShapeTopicId, ImageSourcePropType> = {
  circle: require("../../Batibot assets/preschool assets/shape kingdom/topic/circle.png"),
  rectangle: require("../../Batibot assets/preschool assets/shape kingdom/topic/rectangle.png"),
  square: require("../../Batibot assets/preschool assets/shape kingdom/topic/square.png"),
  star: require("../../Batibot assets/preschool assets/shape kingdom/topic/star.png"),
  triangle: require("../../Batibot assets/preschool assets/shape kingdom/topic/triangle.png"),
};

const objectImages: Record<ShapeTopicId, ImageSourcePropType> = {
  circle: require("../../Batibot assets/preschool assets/shape kingdom/play choices/ball.png"),
  rectangle: require("../../Batibot assets/preschool assets/shape kingdom/play choices/door.png"),
  square: require("../../Batibot assets/preschool assets/shape kingdom/play choices/window.png"),
  star: require("../../Batibot assets/preschool assets/shape kingdom/play choices/starfish.png"),
  // TODO: replace triangle fallback with a roof or triangle sign asset when available.
  triangle: require("../../Batibot assets/preschool assets/shape kingdom/topic/triangle.png"),
};

const SHAPE_ORDER: ShapeTopicId[] = [
  "circle",
  "square",
  "triangle",
  "rectangle",
  "star",
];

const meanings: Record<ShapeTopicId, string> = {
  circle: "Ball is circle",
  rectangle: "Door is rectangle",
  square: "Window is square",
  star: "Star is star",
  triangle: "Roof is triangle",
};

function label(id: ShapeTopicId) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function distractors(topicId: ShapeTopicId, count: number) {
  return SHAPE_ORDER.filter((id) => id !== topicId).slice(0, count);
}

function createTopic(id: ShapeTopicId, order: number): ShapeKingdomTopic {
  const tryDistractor = distractors(id, 1)[0];
  const chooseDistractors = distractors(id, 3);
  const wrongObjectId = distractors(id, 1)[0];

  return {
    id,
    label: label(id),
    order,
    look: {
      image: shapeImages[id],
      speech: `${label(id)}.`,
    },
    tap: {
      image: objectImages[id],
      meaning: meanings[id],
      speech: `${label(id)}. ${meanings[id]}.`,
    },
    try: {
      question: `Which one is ${label(id)}?`,
      choices: [
        { id, image: shapeImages[id], isCorrect: true, label: label(id) },
        { id: tryDistractor, image: shapeImages[tryDistractor], isCorrect: false, label: label(tryDistractor) },
      ],
    },
    choose: {
      question: `Find ${label(id).toLowerCase()}`,
      choices: [
        ...chooseDistractors.map((choiceId) => ({
          id: choiceId,
          image: shapeImages[choiceId],
          isCorrect: false,
        })),
        { id, image: shapeImages[id], isCorrect: true },
      ],
    },
    play: {
      task: `Collect ${label(id).toLowerCase()}`,
      timerSeconds: 10,
      situationImage: boxImage,
      // TODO: replace object fallback with box-with-object completed image when available.
      completedImage: objectImages[id],
      dropLabel: "Completed",
      choices: [
        { id: `${id}-correct`, image: objectImages[id], isCorrect: true, label: label(id) },
        { id: `${id}-wrong`, image: objectImages[wrongObjectId], isCorrect: false, label: label(wrongObjectId) },
      ],
    },
    reward: {
      stars: 1,
      xp: 10,
    },
  };
}

export const preschoolShapeKingdomTopics: ShapeKingdomTopic[] = SHAPE_ORDER.map((id, index) =>
  createTopic(id, index + 1)
);

export const preschoolShapeKingdom = {
  backgroundImage,
  title: "Shape Kingdom",
  topics: preschoolShapeKingdomTopics,
  worldId: "preschool-shape-kingdom",
  wrongImage,
} as const;
