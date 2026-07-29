import type { ImageSourcePropType } from "react-native";

import type { PreschoolStageWorldTopic } from "@/src/data/preschoolStageWorldTypes";

export type BodyStageType = "look" | "tap" | "try" | "choose" | "play";

export type BodyTopicId =
  | "head"
  | "hair"
  | "eyes"
  | "ears"
  | "nose"
  | "mouth"
  | "teeth"
  | "hands"
  | "feet"
  | "body";

export type BodyWorldTopic = PreschoolStageWorldTopic<BodyTopicId>;

const backgroundImage = require("../../Batibot assets/preschool assets/my family world/preschool-play-tab-background.jpg");
const wrongImage = require("../../Batibot assets/preschool assets/my body world/play drop area-wrong/wrong.png");

const topicImages: Record<BodyTopicId, ImageSourcePropType> = {
  body: require("../../Batibot assets/preschool assets/my body world/topic/body.png"),
  ears: require("../../Batibot assets/preschool assets/my body world/topic/ear.png"),
  eyes: require("../../Batibot assets/preschool assets/my body world/topic/eyes.png"),
  feet: require("../../Batibot assets/preschool assets/my body world/topic/feet.png"),
  hair: require("../../Batibot assets/preschool assets/my body world/topic/hair.png"),
  hands: require("../../Batibot assets/preschool assets/my body world/topic/hands.png"),
  head: require("../../Batibot assets/preschool assets/my body world/topic/head.png"),
  mouth: require("../../Batibot assets/preschool assets/my body world/topic/mouth.png"),
  nose: require("../../Batibot assets/preschool assets/my body world/topic/nose.png"),
  teeth: require("../../Batibot assets/preschool assets/my body world/topic/teeth.png"),
};

const tapImages: Record<BodyTopicId, ImageSourcePropType> = {
  body: require("../../Batibot assets/preschool assets/my body world/body parts.png"),
  ears: require("../../Batibot assets/preschool assets/my body world/ear hear.png"),
  eyes: require("../../Batibot assets/preschool assets/my body world/eyes see.png"),
  feet: require("../../Batibot assets/preschool assets/my body world/feet step.png"),
  hair: require("../../Batibot assets/preschool assets/my body world/hair head top.png"),
  hands: require("../../Batibot assets/preschool assets/my body world/hands hold.png"),
  head: require("../../Batibot assets/preschool assets/my body world/head top.png"),
  mouth: require("../../Batibot assets/preschool assets/my body world/mouth talk.png"),
  nose: require("../../Batibot assets/preschool assets/my body world/nose smell.png"),
  teeth: require("../../Batibot assets/preschool assets/my body world/teeth eat.png"),
};

// TODO: replace these neutral drop-area images with explicit missing-body-part images when available.
const situationImages: Record<BodyTopicId, ImageSourcePropType> = {
  body: require("../../Batibot assets/preschool assets/my body world/play drop area/body.png"),
  ears: require("../../Batibot assets/preschool assets/my body world/play drop area/ear.png"),
  eyes: require("../../Batibot assets/preschool assets/my body world/play drop area/eyes.png"),
  feet: require("../../Batibot assets/preschool assets/my body world/play drop area/feet.png"),
  hair: require("../../Batibot assets/preschool assets/my body world/play drop area/hair.png"),
  hands: require("../../Batibot assets/preschool assets/my body world/play drop area/hands.png"),
  head: require("../../Batibot assets/preschool assets/my body world/play drop area/head.png"),
  mouth: require("../../Batibot assets/preschool assets/my body world/play drop area/mouth.png"),
  nose: require("../../Batibot assets/preschool assets/my body world/play drop area/nose.png"),
  teeth: require("../../Batibot assets/preschool assets/my body world/play drop area/teeth.png"),
};

const completedImages: Record<BodyTopicId, ImageSourcePropType> = {
  body: require("../../Batibot assets/preschool assets/my body world/play drop area-correct/body-correct.png"),
  ears: require("../../Batibot assets/preschool assets/my body world/play drop area-correct/ear-correct.png"),
  eyes: require("../../Batibot assets/preschool assets/my body world/play drop area-correct/eyes-correct.png"),
  feet: require("../../Batibot assets/preschool assets/my body world/play drop area-correct/feet-correct.png"),
  hair: require("../../Batibot assets/preschool assets/my body world/play drop area-correct/hair-correct.png"),
  hands: require("../../Batibot assets/preschool assets/my body world/play drop area-correct/hands-correct.png"),
  head: require("../../Batibot assets/preschool assets/my body world/play drop area-correct/head-correct.png"),
  mouth: require("../../Batibot assets/preschool assets/my body world/play drop area-correct/mouth-correct.png"),
  nose: require("../../Batibot assets/preschool assets/my body world/play drop area-correct/nose-correct.png"),
  teeth: require("../../Batibot assets/preschool assets/my body world/play drop area-correct/teeth-correct.png"),
};

const BODY_ORDER: BodyTopicId[] = [
  "head",
  "hair",
  "eyes",
  "ears",
  "nose",
  "mouth",
  "teeth",
  "hands",
  "feet",
  "body",
];

const meanings: Record<BodyTopicId, string> = {
  body: "All body parts",
  ears: "Use to hear",
  eyes: "Use to see",
  feet: "Use to walk",
  hair: "On the head",
  hands: "Use to touch",
  head: "Top of the body",
  mouth: "Use to talk",
  nose: "Use to smell",
  teeth: "Use to eat",
};

function label(id: BodyTopicId) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function distractors(topicId: BodyTopicId, count: number) {
  return BODY_ORDER.filter((id) => id !== topicId).slice(0, count);
}

function createTopic(id: BodyTopicId, order: number): BodyWorldTopic {
  const tryDistractor = distractors(id, 1)[0];
  const chooseDistractors = distractors(id, 3);
  const wrongPlayId = distractors(id, 1)[0];

  return {
    id,
    label: label(id),
    order,
    look: {
      image: topicImages[id],
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
        { id, image: topicImages[id], isCorrect: true, label: label(id) },
        { id: tryDistractor, image: topicImages[tryDistractor], isCorrect: false, label: label(tryDistractor) },
      ],
    },
    choose: {
      question: `Find ${label(id).toLowerCase()}`,
      choices: [
        ...chooseDistractors.map((choiceId) => ({
          id: choiceId,
          image: topicImages[choiceId],
          isCorrect: false,
        })),
        { id, image: topicImages[id], isCorrect: true },
      ],
    },
    play: {
      task: `Complete the ${label(id).toLowerCase()}`,
      timerSeconds: 10,
      situationImage: situationImages[id],
      completedImage: completedImages[id],
      dropLabel: `${label(id)} complete`,
      choices: [
        { id: `${id}-correct`, image: topicImages[id], isCorrect: true, label: label(id) },
        { id: `${id}-wrong`, image: topicImages[wrongPlayId], isCorrect: false, label: label(wrongPlayId) },
      ],
    },
    reward: {
      stars: 1,
      xp: 10,
    },
  };
}

export const preschoolBodyWorldTopics: BodyWorldTopic[] = BODY_ORDER.map((id, index) =>
  createTopic(id, index + 1)
);

export const preschoolBodyWorld = {
  backgroundImage,
  title: "My Body World",
  topics: preschoolBodyWorldTopics,
  worldId: "preschool-body-world",
  wrongImage,
} as const;
