import type { ImageSourcePropType } from "react-native";

import type { PreschoolStageWorldTopic } from "@/src/data/preschoolStageWorldTypes";

export type FamilyStageType = "look" | "tap" | "try" | "choose" | "play";

export type FamilyTopicId =
  | "mother"
  | "father"
  | "brother"
  | "sister"
  | "baby"
  | "friend"
  | "home"
  | "family";

export type FamilyWorldTopic = PreschoolStageWorldTopic<FamilyTopicId>;

const backgroundImage = require("../../Batibot assets/preschool assets/my family world/preschool-play-tab-background.jpg");
const wrongImage = require("../../Batibot assets/preschool assets/my family world/play drop area-wrong/wrong.png");

const familyImages: Record<FamilyTopicId, ImageSourcePropType> = {
  baby: require("../../Batibot assets/preschool assets/my family world/topic/baby.png"),
  brother: require("../../Batibot assets/preschool assets/my family world/topic/brother.png"),
  family: require("../../Batibot assets/preschool assets/my family world/topic/family.png"),
  father: require("../../Batibot assets/preschool assets/my family world/topic/father.png"),
  friend: require("../../Batibot assets/preschool assets/my family world/topic/friend.png"),
  home: require("../../Batibot assets/preschool assets/my family world/topic/home.png"),
  mother: require("../../Batibot assets/preschool assets/my family world/topic/mother.png"),
  sister: require("../../Batibot assets/preschool assets/my family world/topic/sister.png"),
};

const contextImages: Record<FamilyTopicId, ImageSourcePropType> = {
  baby: require("../../Batibot assets/preschool assets/my family world/baby young child.png"),
  brother: require("../../Batibot assets/preschool assets/my family world/brother sibling.png"),
  family: require("../../Batibot assets/preschool assets/my family world/family together.png"),
  father: require("../../Batibot assets/preschool assets/my family world/father protect.png"),
  friend: require("../../Batibot assets/preschool assets/my family world/friend play.png"),
  home: require("../../Batibot assets/preschool assets/my family world/home place.png"),
  mother: require("../../Batibot assets/preschool assets/my family world/mother love.png"),
  sister: require("../../Batibot assets/preschool assets/my family world/sister sibling.png"),
};

const situationImages: Record<FamilyTopicId, ImageSourcePropType> = {
  baby: require("../../Batibot assets/preschool assets/my family world/play drop area/baby.png"),
  brother: require("../../Batibot assets/preschool assets/my family world/play drop area/brother.png"),
  family: require("../../Batibot assets/preschool assets/my family world/play drop area/family.png"),
  father: require("../../Batibot assets/preschool assets/my family world/play drop area/father.png"),
  friend: require("../../Batibot assets/preschool assets/my family world/play drop area/friend.png"),
  home: require("../../Batibot assets/preschool assets/my family world/play drop area/home.png"),
  mother: require("../../Batibot assets/preschool assets/my family world/play drop area/mother.png"),
  sister: require("../../Batibot assets/preschool assets/my family world/play drop area/sister.png"),
};

const completedImages: Record<FamilyTopicId, ImageSourcePropType> = {
  baby: require("../../Batibot assets/preschool assets/my family world/play drop area-correct/baby-correct.png"),
  brother: require("../../Batibot assets/preschool assets/my family world/play drop area-correct/brother-correct.png"),
  family: require("../../Batibot assets/preschool assets/my family world/play drop area-correct/family-correct.png"),
  father: require("../../Batibot assets/preschool assets/my family world/play drop area-correct/father-correct.png"),
  friend: require("../../Batibot assets/preschool assets/my family world/play drop area-correct/friend-correct.png"),
  home: require("../../Batibot assets/preschool assets/my family world/play drop area-correct/home-correct.png"),
  mother: require("../../Batibot assets/preschool assets/my family world/play drop area-correct/mother-correct.png"),
  sister: require("../../Batibot assets/preschool assets/my family world/play drop area-correct/sister-correct.png"),
};

const cookingTool = require("../../Batibot assets/preschool assets/my family world/play choices/mother tool.png");
const repairTool = require("../../Batibot assets/preschool assets/my family world/play choices/father tool.png");
const babyToy = require("../../Batibot assets/preschool assets/my family world/play choices/baby toy.png");
const brotherToy = require("../../Batibot assets/preschool assets/my family world/play choices/brother toy.png");
const sisterToy = require("../../Batibot assets/preschool assets/my family world/play choices/sister toy.png");
const familyMember = require("../../Batibot assets/preschool assets/my family world/play choices/mother.png");

const FAMILY_ORDER: FamilyTopicId[] = [
  "mother",
  "father",
  "brother",
  "sister",
  "baby",
  "friend",
  "home",
  "family",
];

const meanings: Record<FamilyTopicId, string> = {
  baby: "Needs care",
  brother: "Plays with family",
  family: "Stays together",
  father: "Helps family",
  friend: "Plays with you",
  home: "Family lives here",
  mother: "Loves family",
  sister: "Cares for family",
};

const playTasks: Record<FamilyTopicId, { task: string; correct: ImageSourcePropType; correctLabel: string; wrong: ImageSourcePropType; wrongLabel: string }> = {
  baby: { task: "Help baby drink", correct: babyToy, correctLabel: "Bottle", wrong: repairTool, wrongLabel: "Tool" },
  brother: { task: "Help brother play", correct: brotherToy, correctLabel: "Toy", wrong: cookingTool, wrongLabel: "Spoon" },
  family: { task: "Complete family", correct: familyMember, correctLabel: "Mother", wrong: repairTool, wrongLabel: "Tool" },
  father: { task: "Help father fix", correct: repairTool, correctLabel: "Tool", wrong: cookingTool, wrongLabel: "Spoon" },
  // TODO: replace brother toy with a dedicated friend toy asset when available.
  friend: { task: "Help friend play", correct: brotherToy, correctLabel: "Toy", wrong: repairTool, wrongLabel: "Tool" },
  // TODO: replace mother tool with a broom or cleaning tool asset when available.
  home: { task: "Help clean home", correct: cookingTool, correctLabel: "Clean", wrong: repairTool, wrongLabel: "Tool" },
  mother: { task: "Help mother cook", correct: cookingTool, correctLabel: "Spoon", wrong: repairTool, wrongLabel: "Tool" },
  sister: { task: "Help sister study", correct: sisterToy, correctLabel: "Book", wrong: repairTool, wrongLabel: "Tool" },
};

function label(id: FamilyTopicId) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function choiceIds(topicId: FamilyTopicId, count: number) {
  return FAMILY_ORDER.filter((id) => id !== topicId).slice(0, count);
}

function createTopic(id: FamilyTopicId, order: number): FamilyWorldTopic {
  const distractor = choiceIds(id, 1)[0];
  const chooseDistractors = choiceIds(id, 3);
  const play = playTasks[id];

  return {
    id,
    label: label(id),
    order,
    look: {
      image: familyImages[id],
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
        { id: distractor, image: familyImages[distractor], isCorrect: false, label: label(distractor) },
        { id, image: familyImages[id], isCorrect: true, label: label(id) },
      ],
    },
    choose: {
      question: `Find ${label(id).toLowerCase()}`,
      choices: [
        ...chooseDistractors.map((choiceId) => ({
          id: choiceId,
          image: familyImages[choiceId],
          isCorrect: false,
        })),
        { id, image: familyImages[id], isCorrect: true },
      ],
    },
    play: {
      task: play.task,
      timerSeconds: 10,
      situationImage: situationImages[id],
      completedImage: completedImages[id],
      dropLabel: `${label(id)} complete`,
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

export const preschoolFamilyWorldTopics: FamilyWorldTopic[] = FAMILY_ORDER.map((id, index) =>
  createTopic(id, index + 1)
);

export const preschoolFamilyWorld = {
  backgroundImage,
  title: "My Family World",
  topics: preschoolFamilyWorldTopics,
  worldId: "preschool-family-world",
  wrongImage,
} as const;
