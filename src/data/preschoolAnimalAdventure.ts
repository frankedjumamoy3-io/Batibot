import type { ImageSourcePropType } from "react-native";

import type { PreschoolStageWorldTopic } from "@/src/data/preschoolStageWorldTypes";

export type AnimalStageType = "look" | "tap" | "try" | "choose" | "play";

export type AnimalTopicId =
  | "dog"
  | "cat"
  | "bird"
  | "fish"
  | "cow"
  | "horse"
  | "duck";

export type AnimalAdventureTopic = PreschoolStageWorldTopic<AnimalTopicId>;

const backgroundImage = require("../../Batibot assets/preschool assets/my family world/preschool-play-tab-background.jpg");
const wrongImage = require("../../Batibot assets/preschool assets/animal adventure/play drop area-wrong/wrong.png");

const animalImages: Record<AnimalTopicId, ImageSourcePropType> = {
  bird: require("../../Batibot assets/preschool assets/animal adventure/topic/bird.png"),
  cat: require("../../Batibot assets/preschool assets/animal adventure/topic/cat.png"),
  cow: require("../../Batibot assets/preschool assets/animal adventure/topic/cow.png"),
  dog: require("../../Batibot assets/preschool assets/animal adventure/topic/dog.png"),
  duck: require("../../Batibot assets/preschool assets/animal adventure/topic/duck.png"),
  fish: require("../../Batibot assets/preschool assets/animal adventure/topic/fish.png"),
  horse: require("../../Batibot assets/preschool assets/animal adventure/topic/horse.png"),
};

const contextImages: Record<AnimalTopicId, ImageSourcePropType> = {
  bird: require("../../Batibot assets/preschool assets/animal adventure/bird tweet.png"),
  cat: require("../../Batibot assets/preschool assets/animal adventure/cat meow.png"),
  cow: require("../../Batibot assets/preschool assets/animal adventure/cow moow.png"),
  dog: require("../../Batibot assets/preschool assets/animal adventure/dog woof.png"),
  duck: require("../../Batibot assets/preschool assets/animal adventure/duck-quack.png"),
  fish: require("../../Batibot assets/preschool assets/animal adventure/fish splash.png"),
  horse: require("../../Batibot assets/preschool assets/animal adventure/horse heigh.png"),
};

const situationImages: Record<AnimalTopicId, ImageSourcePropType> = {
  bird: require("../../Batibot assets/preschool assets/animal adventure/play drop area/bird.png"),
  cat: require("../../Batibot assets/preschool assets/animal adventure/play drop area/cat.png"),
  cow: require("../../Batibot assets/preschool assets/animal adventure/play drop area/cow.png"),
  dog: require("../../Batibot assets/preschool assets/animal adventure/play drop area/dog.png"),
  duck: require("../../Batibot assets/preschool assets/animal adventure/play drop area/duck.png"),
  fish: require("../../Batibot assets/preschool assets/animal adventure/play drop area/fish.png"),
  horse: require("../../Batibot assets/preschool assets/animal adventure/play drop area/horse.png"),
};

const completedImages: Record<AnimalTopicId, ImageSourcePropType> = {
  bird: require("../../Batibot assets/preschool assets/animal adventure/play drop area-correct/bird-correct.png"),
  cat: require("../../Batibot assets/preschool assets/animal adventure/play drop area-correct/cat-correct.png"),
  cow: require("../../Batibot assets/preschool assets/animal adventure/play drop area-correct/cow-correct.png"),
  dog: require("../../Batibot assets/preschool assets/animal adventure/play drop area-correct/dog-correct.png"),
  duck: require("../../Batibot assets/preschool assets/animal adventure/play drop area-correct/duck-correct.png"),
  fish: require("../../Batibot assets/preschool assets/animal adventure/play drop area-correct/fish-correct.png"),
  horse: require("../../Batibot assets/preschool assets/animal adventure/play drop area-correct/horse-correct.png"),
};

const animalSounds: Record<AnimalTopicId, number> = {
  bird: require("../../Batibot assets/preschool assets/animal adventure/animal sounds/bird-tweets.mp3"),
  cat: require("../../Batibot assets/preschool assets/animal adventure/animal sounds/cat-meow.mp3"),
  cow: require("../../Batibot assets/preschool assets/animal adventure/animal sounds/cow-moow.mp3"),
  dog: require("../../Batibot assets/preschool assets/animal adventure/animal sounds/dog-woof.mp3"),
  duck: require("../../Batibot assets/preschool assets/animal adventure/animal sounds/duck sound.wav"),
  fish: require("../../Batibot assets/preschool assets/animal adventure/animal sounds/fish-splash.mp3"),
  horse: require("../../Batibot assets/preschool assets/animal adventure/animal sounds/horse-heigh.mp3"),
};

const dogBone = require("../../Batibot assets/preschool assets/animal adventure/play choices/dog bone.png");
const catYarn = require("../../Batibot assets/preschool assets/animal adventure/play choices/cat yarn.png");
const birdNest = require("../../Batibot assets/preschool assets/animal adventure/play choices/bird nest.png");
const cowGrass = require("../../Batibot assets/preschool assets/animal adventure/play choices/cow grass.png");
const duckFeed = require("../../Batibot assets/preschool assets/animal adventure/play choices/duck feed.png");
// TODO: rename source asset to fish ball.png when the asset pack is cleaned up.
const fishBall = require("../../Batibot assets/preschool assets/animal adventure/play choices/fist ball.png");
// TODO: rename source asset to horse grass.png when the asset pack is cleaned up.
const horseGrass = require("../../Batibot assets/preschool assets/animal adventure/play choices/hore grass.png");

const ANIMAL_ORDER: AnimalTopicId[] = [
  "dog",
  "cat",
  "bird",
  "fish",
  "cow",
  "horse",
  "duck",
];

const meanings: Record<AnimalTopicId, string> = {
  bird: "Bird tweets",
  cat: "Cat meows",
  cow: "Cow moos",
  dog: "Dog barks",
  duck: "Duck quacks",
  fish: "Fish splashes",
  horse: "Horse neighs",
};

const playTasks: Record<AnimalTopicId, { task: string; correct: ImageSourcePropType; correctLabel: string; wrong: ImageSourcePropType; wrongLabel: string }> = {
  bird: { task: "Give bird a nest", correct: birdNest, correctLabel: "Nest", wrong: catYarn, wrongLabel: "Yarn" },
  cat: { task: "Give cat yarn", correct: catYarn, correctLabel: "Yarn", wrong: dogBone, wrongLabel: "Bone" },
  cow: { task: "Give cow grass", correct: cowGrass, correctLabel: "Grass", wrong: dogBone, wrongLabel: "Bone" },
  dog: { task: "Give dog a bone", correct: dogBone, correctLabel: "Bone", wrong: catYarn, wrongLabel: "Yarn" },
  duck: { task: "Give duck food", correct: duckFeed, correctLabel: "Food", wrong: fishBall, wrongLabel: "Ball" },
  fish: { task: "Help fish play", correct: fishBall, correctLabel: "Ball", wrong: birdNest, wrongLabel: "Nest" },
  horse: { task: "Give horse grass", correct: horseGrass, correctLabel: "Grass", wrong: duckFeed, wrongLabel: "Food" },
};

function label(id: AnimalTopicId) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function distractors(topicId: AnimalTopicId, count: number) {
  return ANIMAL_ORDER.filter((id) => id !== topicId).slice(0, count);
}

function createTopic(id: AnimalTopicId, order: number): AnimalAdventureTopic {
  const tryDistractor = distractors(id, 1)[0];
  const chooseDistractors = distractors(id, 3);
  const play = playTasks[id];

  return {
    id,
    label: label(id),
    order,
    look: {
      image: animalImages[id],
      speech: `${label(id)}.`,
    },
    tap: {
      image: contextImages[id],
      meaning: meanings[id],
      sound: animalSounds[id],
      speech: `${label(id)}. ${meanings[id]}.`,
    },
    try: {
      question: `Which one is ${label(id)}?`,
      choices: [
        { id: tryDistractor, image: animalImages[tryDistractor], isCorrect: false, label: label(tryDistractor) },
        { id, image: animalImages[id], isCorrect: true, label: label(id) },
      ],
    },
    choose: {
      question: `Find ${label(id).toLowerCase()}`,
      choices: [
        ...chooseDistractors.map((choiceId) => ({
          id: choiceId,
          image: animalImages[choiceId],
          isCorrect: false,
        })),
        { id, image: animalImages[id], isCorrect: true },
      ],
    },
    play: {
      task: play.task,
      timerSeconds: 10,
      situationImage: situationImages[id],
      completedImage: completedImages[id],
      dropLabel: "Completed",
      choices: [
        { id: `${id}-correct`, image: play.correct, isCorrect: true, label: play.correctLabel },
        { id: `${id}-wrong`, image: play.wrong, isCorrect: false, label: play.wrongLabel },
      ],
    },
    reward: {
      stars: 1,
      xp: 10,
    },
  };
}

export const preschoolAnimalAdventureTopics: AnimalAdventureTopic[] = ANIMAL_ORDER.map((id, index) =>
  createTopic(id, index + 1)
);

export const preschoolAnimalAdventure = {
  backgroundImage,
  title: "Animal Adventure",
  topics: preschoolAnimalAdventureTopics,
  worldId: "preschool-animal-adventure",
  wrongImage,
} as const;
