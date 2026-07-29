import type { ImageSourcePropType } from "react-native";

import type {
  PreschoolStageChoice,
  PreschoolStageWorldConfig,
  PreschoolStageWorldTopic,
} from "@/src/data/preschoolStageWorldTypes";
import {
  KINDERGARTEN_PATTERN_ASSETS,
  PRESCHOOL_CONCEPT_ASSETS,
  TOPIC_IMAGES,
  WORLD_IMAGES,
} from "@/src/data/play-assets";
import {
  resolveKindergartenAsset,
  resolveKindergartenTopicAsset,
  resolveKindergartenWorldWrongImage,
} from "@/src/utils/kindergartenAssetResolver";

type KinderWorldId =
  | "kindergarten-alphabet"
  | "kindergarten-school"
  | "kindergarten-community-village"
  | "kindergarten-number-forest"
  | "kindergarten-big-small"
  | "kindergarten-more-less"
  | "kindergarten-patterns";

type TopicSeed = {
  id: string;
  label: string;
  image: ImageSourcePropType;
  lookVisuals?: PreschoolStageWorldTopic["look"]["visuals"];
  tapImage?: ImageSourcePropType;
  tapSlides?: PreschoolStageWorldTopic["tap"]["slides"];
  matchRows?: PreschoolStageWorldTopic["play"]["matchRows"];
  meaning: string;
  order: number;
  patternBuild?: PreschoolStageWorldTopic["play"]["patternBuild"];
  choose?: PreschoolStageWorldTopic["choose"];
  playChoiceImage?: ImageSourcePropType;
  playCompletedImage?: ImageSourcePropType;
  playSituationImage?: ImageSourcePropType;
  playTask: string;
  speech: string;
  symbol?: string;
};

const backgroundImage = resolveKindergartenAsset("background.junglePath");
const appleImage = resolveKindergartenAsset("kindergarten-alphabet-apple", "alphabet.apple");

function topicImage(key: string, fallback: ImageSourcePropType = backgroundImage) {
  return TOPIC_IMAGES[key] || fallback;
}

function worldImage(worldId: KinderWorldId) {
  return WORLD_IMAGES[worldId] || resolveKindergartenAsset(worldId);
}

function nextItems<T>(items: T[], index: number, count: number) {
  return Array.from({ length: count }, (_, offset) => items[(index + offset + 1) % items.length]);
}

function stageChoice(
  seed: TopicSeed,
  isCorrect: boolean,
  suffix = isCorrect ? "correct" : "wrong",
  image = seed.image
): PreschoolStageChoice & { label: string } {
  return {
    hideLabel: seed.id.startsWith("letter-") && Boolean(seed.symbol),
    id: `${seed.id}-${suffix}`,
    image,
    isCorrect,
    label: seed.symbol ?? seed.label,
    symbol: seed.symbol,
  };
}

function createTopic(
  seed: TopicSeed,
  seeds: TopicSeed[],
  worldImageSource: ImageSourcePropType
): PreschoolStageWorldTopic {
  const seedIndex = seeds.findIndex((item) => item.id === seed.id);
  const [tryDistractor, firstChoose, secondChoose, thirdChoose] = nextItems(seeds, seedIndex, 4);
  const playDistractor = tryDistractor;

  return {
    id: seed.id,
    label: seed.label,
    order: seed.order,
    look: {
      image: seed.image,
      speech: `${seed.label}.`,
      symbol: seed.symbol,
      visuals: seed.lookVisuals,
    },
    tap: {
      image: seed.tapImage ?? seed.image,
      meaning: seed.meaning,
      speech: seed.speech,
      slides: seed.tapSlides,
      symbol: seed.symbol,
    },
    try: {
      question: `Which one is ${seed.symbol ?? seed.label}?`,
      choices: [
        stageChoice(seed, true),
        stageChoice(tryDistractor, false),
      ],
    },
    choose: seed.choose ?? {
      question: `Find ${seed.symbol ?? seed.label}`,
      choices: [
        stageChoice(firstChoose, false, "choose-1"),
        stageChoice(seed, true, "choose-correct"),
        stageChoice(secondChoose, false, "choose-2"),
        stageChoice(thirdChoose, false, "choose-3"),
      ],
    },
    play: {
      task: seed.playTask,
      timerSeconds: 10,
      situationImage: seed.playSituationImage ?? worldImageSource,
      completedImage: seed.playCompletedImage ?? seed.image,
      dropLabel: `${seed.symbol ?? seed.label} complete`,
      matchRows: seed.matchRows,
      patternBuild: seed.patternBuild,
      choices: [
        stageChoice(seed, true, "play-correct", seed.playChoiceImage ?? seed.image),
        stageChoice(
          playDistractor,
          false,
          "play-wrong",
          playDistractor.playChoiceImage ?? playDistractor.image
        ),
      ],
    },
    reward: {
      stars: 1,
      xp: 10,
    },
  };
}

const alphabetWords = [
  ["A", "Apple"],
  ["B", "Ball"],
  ["C", "Cat"],
  ["D", "Dog"],
  ["E", "Egg"],
  ["F", "Fish"],
  ["G", "Grapes"],
  ["H", "Hat"],
  ["I", "Ice Cream"],
  ["J", "Juice"],
  ["K", "Kite"],
  ["L", "Lion"],
  ["M", "Mango"],
  ["N", "Nose"],
  ["O", "Orange"],
  ["P", "Pencil"],
  ["Q", "Queen"],
  ["R", "Rabbit"],
  ["S", "Sun"],
  ["T", "Tree"],
  ["U", "Umbrella"],
  ["V", "Van"],
  ["W", "Water"],
  ["X", "Xylophone"],
  ["Y", "Yellow"],
  ["Z", "Zebra"],
] as const;

const alphabetSeeds: TopicSeed[] = alphabetWords.map(([letter, word], index) => ({
  id: `letter-${letter.toLowerCase()}`,
  image: topicImage(`kindergarten-alphabet-letter-${letter.toLowerCase()}`, appleImage),
  label: `Letter ${letter}`,
  meaning: `${letter} for ${word}`,
  order: index + 1,
  playSituationImage: resolveKindergartenAsset("alphabet.dropArea.default"),
  playTask: `Choose start with ${letter}`,
  speech: `${letter}. ${letter} for ${word}.`,
  symbol: letter,
}));

const schoolSeeds: TopicSeed[] = [
  ["bag", "Bag", "Put things in bag", "Bag. We put school things in the bag.", "Give bag"],
  ["book", "Book", "Read a book", "Book. We read a book.", "Give book"],
  ["chair", "Chair", "Sit on chair", "Chair. We sit on a chair.", "Give chair"],
  ["crayon", "Crayon", "Color pictures", "Crayon. We color pictures with a crayon.", "Give crayon"],
  ["desk", "Desk", "Write on desk", "Desk. We write on a desk.", "Give desk"],
  ["eraser", "Eraser", "Erase mistakes", "Eraser. We erase mistakes with an eraser.", "Give eraser"],
  ["notebook", "Notebook", "Write notes", "Notebook. We write notes in a notebook.", "Give notebook"],
  ["paper", "Paper", "Draw or write", "Paper. We draw or write on paper.", "Give paper"],
  ["pencil", "Pencil", "Write letters", "Pencil. We write letters with a pencil.", "Give pencil"],
].map(([id, label, meaning, speech, playTask], index) => ({
  id,
  image: resolveKindergartenTopicAsset("kindergarten-school", id),
  label,
  meaning,
  order: index + 1,
  playCompletedImage: resolveKindergartenTopicAsset(
    "kindergarten-school",
    id,
    "playCompletedImage"
  ),
  playSituationImage: resolveKindergartenTopicAsset(
    "kindergarten-school",
    id,
    "playSituationImage"
  ),
  playTask,
  speech,
  tapImage: resolveKindergartenTopicAsset("kindergarten-school", id, "tapContextImage"),
}));

const communitySeeds: TopicSeed[] = [
  ["doctor", "Doctor", "Helps sick people", "Doctor. Helps sick people.", "Give doctor stethoscope"],
  ["nurse", "Nurse", "Cares for patients", "Nurse. Cares for patients.", "Give nurse medicine"],
  ["teacher", "Teacher", "Teaches lesson", "Teacher. Teaches lesson.", "Give teacher book"],
  ["police-officer", "Police Officer", "Keeps people safe", "Police officer. Keeps people safe.", "Give police badge"],
  ["firefighter", "Firefighter", "Puts out fire", "Firefighter. Puts out fire.", "Give firefighter hose"],
  ["farmer", "Farmer", "Grows food", "Farmer. Grows food.", "Give farmer seeds"],
].map(([id, label, meaning, speech, playTask], index) => ({
  id,
  image: resolveKindergartenTopicAsset("kindergarten-community-village", id),
  label,
  meaning,
  order: index + 1,
  playChoiceImage: resolveKindergartenTopicAsset(
    "kindergarten-community-village",
    id,
    "playChoiceImage"
  ),
  playCompletedImage: resolveKindergartenTopicAsset(
    "kindergarten-community-village",
    id,
    "playCompletedImage"
  ),
  playSituationImage: resolveKindergartenTopicAsset(
    "kindergarten-community-village",
    id,
    "playSituationImage"
  ),
  playTask,
  speech,
  tapImage: resolveKindergartenTopicAsset(
    "kindergarten-community-village",
    id,
    "tapContextImage"
  ),
}));

const numberValues = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const;
const numberSeeds: TopicSeed[] = numberValues.map((value, index) => ({
  id: `number-${value}`,
  image: topicImage(`kindergarten-number-forest-number-${value}`, appleImage),
  label: `Number ${value}`,
  meaning: `${value} helps us count bigger groups.`,
  order: index + 1,
  playTask: "Count and Match",
  speech: `${value}. Count ${value}.`,
  symbol: `${value}`,
}));

const communityChallengeSeed: TopicSeed = {
  id: "community-challenge",
  image: worldImage("kindergarten-community-village"),
  label: "Community Challenge",
  meaning: "Match helpers to jobs",
  order: communitySeeds.length + 1,
  playTask: "Help the helpers",
  speech: "Community Challenge. Match helpers to jobs.",
};

const numberChallengeSeed: TopicSeed = {
  id: "number-challenge",
  image: worldImage("kindergarten-number-forest"),
  label: "Number Challenge",
  meaning: "Count numbers 11 to 20",
  order: numberSeeds.length + 1,
  playTask: "Count and Match",
  speech: "Number Challenge. Count and match.",
  symbol: "11-20",
};

const sizeAssets = PRESCHOOL_CONCEPT_ASSETS.bigSmall;
const tallShortAssets = PRESCHOOL_CONCEPT_ASSETS.tallShort;
const moreLessAssets = PRESCHOOL_CONCEPT_ASSETS.moreLess;
const patternAssets = KINDERGARTEN_PATTERN_ASSETS.color;
const bigElephantImage = require("../../Batibot assets/kindergarten assets/big and small village/big elephant.png");
const smallMouseImage = require("../../Batibot assets/kindergarten assets/big and small village/small mouse.png");
const longTrainImage = require("../../Batibot assets/kindergarten assets/big and small village/long train.png");
const shortCarImage = require("../../Batibot assets/kindergarten assets/big and small village/short car.png");
const heavyRockImage = require("../../Batibot assets/kindergarten assets/big and small village/heavy rock.png");
const lightLeafImage = require("../../Batibot assets/kindergarten assets/big and small village/light leaf.png");
const patternRedImage = require("../../Batibot assets/kindergarten assets/pattern valley/red.png");
const patternBlueImage = require("../../Batibot assets/kindergarten assets/pattern valley/blue.png");
const quantityRedImage = require("../../Batibot assets/kindergarten assets/more and less valley/red.png");
const quantityBlueImage = require("../../Batibot assets/kindergarten assets/more and less valley/blue.png");
const trainImage = longTrainImage;
const pencilImage = topicImage("kindergarten-school-pencil", worldImage("kindergarten-school"));
const rockImage = heavyRockImage;
const leafImage = lightLeafImage;

function quantityVisual(
  dotCount: number,
  color: string,
  id: string,
  label: string,
  image?: ImageSourcePropType
) {
  return { color, dotCount, id, image, label };
}

function matchRows(
  first: { image: ImageSourcePropType; label: string; targetLabel: string; symbol?: string },
  second: { image: ImageSourcePropType; label: string; targetLabel: string; symbol?: string }
) {
  return [
    { id: `${first.label}-match`, ...first },
    { id: `${second.label}-match`, ...second },
  ];
}

const sizeSeeds: TopicSeed[] = [
  {
    id: "big-small",
    image: bigElephantImage,
    label: "Big & Small",
    lookVisuals: [
      { id: "big-elephant", image: bigElephantImage, label: "Big" },
      { id: "small-mouse", image: smallMouseImage, label: "Small" },
    ],
    matchRows: matchRows(
      { image: bigElephantImage, label: "Big object", targetLabel: "Big" },
      { image: smallMouseImage, label: "Small object", targetLabel: "Small" }
    ),
    meaning: "Elephant is big",
    order: 1,
    playTask: "Match",
    speech: "Big and small. Elephant is big.",
    symbol: "Big  Small",
    tapSlides: [
      { id: "big", speech: "Elephant is big.", text: "Elephant is big", title: "One", visuals: [{ id: "big-elephant", image: bigElephantImage, label: "Big" }] },
      { id: "small", speech: "Mouse is small.", text: "Mouse is small", title: "Two", visuals: [{ id: "small-mouse", image: smallMouseImage, label: "Small" }] },
    ],
  },
  {
    id: "tall-short",
    image: tallShortAssets.overview,
    label: "Tall & Short",
    lookVisuals: [
      { id: "tall", image: tallShortAssets.tall, label: "Tall" },
      { id: "short", image: tallShortAssets.short, label: "Short" },
    ],
    matchRows: matchRows(
      { image: tallShortAssets.tall, label: "Tall object", targetLabel: "Tall" },
      { image: tallShortAssets.short, label: "Short object", targetLabel: "Short" }
    ),
    meaning: "Tree is tall",
    order: 2,
    playTask: "Match",
    speech: "Tall and short. Tree is tall.",
    symbol: "Tall  Short",
    tapSlides: [
      { id: "tall", speech: "Tree is tall.", text: "Tree is tall", title: "One", visuals: [{ id: "tall", image: tallShortAssets.tall, label: "Tall" }] },
      { id: "short", speech: "Flower is short.", text: "Flower is short", title: "Two", visuals: [{ id: "short", image: tallShortAssets.short, label: "Short" }] },
    ],
  },
  {
    id: "long-short",
    image: trainImage,
    label: "Long & Short",
    lookVisuals: [
      { id: "long-train", image: longTrainImage, label: "Long" },
      { id: "short-car", image: shortCarImage, label: "Short" },
    ],
    matchRows: matchRows(
      { image: longTrainImage, label: "Long train", targetLabel: "Long" },
      { image: shortCarImage, label: "Short car", targetLabel: "Short" }
    ),
    meaning: "Train is long",
    order: 3,
    playTask: "Match",
    speech: "Long and short. Train is long.",
    symbol: "Long  Short",
    tapSlides: [
      { id: "long", speech: "Train is long.", text: "Train is long", title: "One", visuals: [{ id: "long-train", image: longTrainImage, label: "Long" }] },
      { id: "short", speech: "Pencil is short.", text: "Pencil is short", title: "Two", visuals: [{ id: "short-pencil", image: pencilImage, label: "Short" }] },
    ],
  },
  {
    id: "heavy-light",
    image: rockImage,
    label: "Heavy & Light",
    lookVisuals: [
      { id: "heavy-rock", image: heavyRockImage, label: "Heavy" },
      { id: "light-leaf", image: lightLeafImage, label: "Light" },
    ],
    matchRows: matchRows(
      { image: rockImage, label: "Heavy rock", targetLabel: "Heavy" },
      { image: leafImage, label: "Light leaf", targetLabel: "Light" }
    ),
    meaning: "Rock is heavy",
    order: 4,
    playTask: "Match",
    speech: "Heavy and light. Rock is heavy.",
    symbol: "Heavy  Light",
    tapSlides: [
      { id: "heavy", speech: "Rock is heavy.", text: "Rock is heavy", title: "One", visuals: [{ id: "heavy-rock", image: heavyRockImage, label: "Heavy" }] },
      { id: "light", speech: "Leaf is light.", text: "Leaf is light", title: "Two", visuals: [{ id: "light-leaf", image: lightLeafImage, label: "Light" }] },
    ],
  },
  {
    id: "size-challenge",
    image: worldImage("kindergarten-big-small"),
    label: "Size Challenge",
    lookVisuals: [
      { id: "big-elephant", image: bigElephantImage, label: "Big" },
      { id: "small-mouse", image: smallMouseImage, label: "Small" },
      { id: "long-train", image: longTrainImage, label: "Long" },
      { id: "light-leaf", image: lightLeafImage, label: "Light" },
    ],
    matchRows: matchRows(
      { image: sizeAssets.big, label: "Big object", targetLabel: "Big" },
      { image: leafImage, label: "Light object", targetLabel: "Light" }
    ),
    meaning: "Match size words",
    order: 5,
    playTask: "Match",
    speech: "Size Challenge. Match size words.",
    symbol: "Size",
    tapSlides: [
      { id: "big-small", speech: "Big and small.", text: "Big and Small", title: "One", visuals: [{ id: "big-elephant", image: bigElephantImage, label: "Big" }, { id: "small-mouse", image: smallMouseImage, label: "Small" }] },
      { id: "tall-short", speech: "Tall and short.", text: "Tall and Short", title: "Two", visuals: [{ id: "tall", image: tallShortAssets.tall, label: "Tall" }, { id: "short", image: tallShortAssets.short, label: "Short" }] },
      { id: "long-short", speech: "Long and short.", text: "Long and Short", title: "Three", visuals: [{ id: "long-train", image: longTrainImage, label: "Long" }, { id: "short-car", image: shortCarImage, label: "Short" }] },
      { id: "heavy-light", speech: "Heavy and light.", text: "Heavy and Light", title: "Four", visuals: [{ id: "heavy-rock", image: heavyRockImage, label: "Heavy" }, { id: "light-leaf", image: lightLeafImage, label: "Light" }] },
    ],
  },
];

const quantitySeeds: TopicSeed[] = [
  {
    id: "more",
    image: moreLessAssets.more,
    label: "More",
    lookVisuals: [
      quantityVisual(4, "#FF1717", "a-more", "More", quantityRedImage),
      quantityVisual(2, "#1D1BC9", "b-less", "Less", quantityBlueImage),
    ],
    matchRows: matchRows(
      { image: moreLessAssets.more, label: "Five dots", targetLabel: "More" },
      { image: moreLessAssets.less, label: "Two dots", targetLabel: "Less" }
    ),
    meaning: "A has more than B",
    order: 1,
    playTask: "Match",
    speech: "More. A has more than B.",
    symbol: "More",
    tapSlides: [
      { id: "more-a", speech: "A has more than B.", text: "A has more than B", title: "One", visuals: [quantityVisual(4, "#FF1717", "a", "A", quantityRedImage), quantityVisual(2, "#1D1BC9", "b", "B", quantityBlueImage)] },
      { id: "more-meaning", speech: "More means bigger amount.", text: "More means bigger amount", title: "Two", visuals: [quantityVisual(4, "#FF1717", "more", "More", quantityRedImage)] },
    ],
  },
  {
    id: "less",
    image: moreLessAssets.less,
    label: "Less",
    lookVisuals: [
      quantityVisual(2, "#FF1717", "a-less", "Less", quantityRedImage),
      quantityVisual(4, "#1D1BC9", "b-more", "More", quantityBlueImage),
    ],
    matchRows: matchRows(
      { image: moreLessAssets.less, label: "Two dots", targetLabel: "Less" },
      { image: moreLessAssets.more, label: "Five dots", targetLabel: "More" }
    ),
    meaning: "A has less than B",
    order: 2,
    playTask: "Match",
    speech: "Less. A has less than B.",
    symbol: "Less",
    tapSlides: [
      { id: "less-a", speech: "A has less than B.", text: "A has less than B", title: "One", visuals: [quantityVisual(2, "#FF1717", "a", "A", quantityRedImage), quantityVisual(4, "#1D1BC9", "b", "B", quantityBlueImage)] },
      { id: "less-meaning", speech: "Less means smaller amount.", text: "Less means smaller amount", title: "Two", visuals: [quantityVisual(2, "#FF1717", "less", "Less", quantityRedImage)] },
    ],
  },
  {
    id: "equal",
    image: moreLessAssets.equal,
    label: "Equal",
    lookVisuals: [
      quantityVisual(3, "#FF1717", "a-equal", "Equal", quantityRedImage),
      quantityVisual(3, "#1D1BC9", "b-equal", "Equal", quantityBlueImage),
    ],
    matchRows: matchRows(
      { image: moreLessAssets.equal, label: "Equal groups", targetLabel: "Equal" },
      { image: moreLessAssets.more, label: "Not equal groups", targetLabel: "Not Equal" }
    ),
    meaning: "A and B are equal",
    order: 3,
    playTask: "Match",
    speech: "Equal. A and B are equal.",
    symbol: "Equal",
    tapSlides: [
      { id: "equal-a", speech: "A and B are equal.", text: "A and B are equal", title: "One", visuals: [quantityVisual(3, "#FF1717", "a", "A", quantityRedImage), quantityVisual(3, "#1D1BC9", "b", "B", quantityBlueImage)] },
      { id: "equal-meaning", speech: "Equal means same amount.", text: "Equal means same amount", title: "Two", visuals: [quantityVisual(3, "#FF1717", "same-a", "A", quantityRedImage), quantityVisual(3, "#1D1BC9", "same-b", "B", quantityBlueImage)] },
    ],
  },
  {
    id: "compare-groups",
    image: worldImage("kindergarten-more-less"),
    label: "Compare Groups",
    lookVisuals: [
      quantityVisual(5, "#FF1717", "a", "A", quantityRedImage),
      quantityVisual(3, "#1D1BC9", "b", "B", quantityBlueImage),
    ],
    matchRows: matchRows(
      { image: moreLessAssets.more, label: "A has more", targetLabel: "A More" },
      { image: moreLessAssets.less, label: "A has less", targetLabel: "A Less" }
    ),
    meaning: "Compare A and B",
    order: 4,
    playTask: "Match",
    speech: "Compare groups. Compare A and B.",
    symbol: "A/B",
    tapSlides: [
      { id: "group-a", speech: "Look at group A.", text: "Look at group A", title: "One", visuals: [quantityVisual(5, "#FF1717", "a", "A", quantityRedImage)] },
      { id: "group-b", speech: "Look at group B.", text: "Look at group B", title: "Two", visuals: [quantityVisual(3, "#1D1BC9", "b", "B", quantityBlueImage)] },
      { id: "compare", speech: "A has more than B.", text: "A has more than B", title: "Three", visuals: [quantityVisual(5, "#FF1717", "a-more", "A", quantityRedImage), quantityVisual(3, "#1D1BC9", "b-less", "B", quantityBlueImage)] },
    ],
  },
  {
    id: "comparison-challenge",
    image: worldImage("kindergarten-more-less"),
    label: "Comparison Challenge",
    lookVisuals: [
      quantityVisual(4, "#FF1717", "more", "More", quantityRedImage),
      quantityVisual(2, "#1D1BC9", "less", "Less", quantityBlueImage),
      quantityVisual(3, "#10B981", "equal", "Equal"),
    ],
    matchRows: matchRows(
      { image: moreLessAssets.more, label: "More group", targetLabel: "More" },
      { image: moreLessAssets.equal, label: "Equal group", targetLabel: "Equal" }
    ),
    meaning: "Match comparison words",
    order: 5,
    playTask: "Match",
    speech: "Comparison Challenge. Match comparison words.",
    symbol: "Compare",
    tapSlides: [
      { id: "more", speech: "More means bigger amount.", text: "More", title: "One", visuals: [quantityVisual(4, "#FF1717", "more", "More", quantityRedImage)] },
      { id: "less", speech: "Less means smaller amount.", text: "Less", title: "Two", visuals: [quantityVisual(2, "#1D1BC9", "less", "Less", quantityBlueImage)] },
      { id: "equal", speech: "Equal means same amount.", text: "Equal", title: "Three", visuals: [quantityVisual(3, "#10B981", "equal-a", "A"), quantityVisual(3, "#10B981", "equal-b", "B")] },
    ],
  },
];

const patternPieces = {
  blue: { color: "#1D1BC9", id: "blue", image: patternBlueImage, label: "Blue", symbol: "B" },
  red: { color: "#FF1717", id: "red", image: patternRedImage, label: "Red", symbol: "A" },
  yellow: { color: "#FACC15", id: "yellow", image: patternAssets.yellow, label: "Yellow", symbol: "C" },
};

function patternBuild(pattern: ("red" | "blue" | "yellow")[], labels: string[]) {
  const uniquePieceIds = Array.from(new Set(pattern));

  return {
    pieces: uniquePieceIds.map((id) => ({
      ...patternPieces[id],
      label: patternPieces[id].label,
    })),
    slots: pattern.map((id, index) => ({
      expectedPieceId: id,
      id: `slot-${index + 1}`,
      label: labels[index] ?? patternPieces[id].symbol,
    })),
  };
}

function patternVisual(id: "red" | "blue" | "yellow", index: number, label?: string) {
  return {
    color: patternPieces[id].color,
    id: `${id}-${index}`,
    label: label ?? patternPieces[id].symbol,
    shape: "circle" as const,
    size: "small" as const,
  };
}

function patternVisuals(pattern: ("red" | "blue" | "yellow")[], labels: string[]) {
  return pattern.map((id, index) => patternVisual(id, index, labels[index]));
}

function patternChoice(id: "red" | "blue" | "yellow", isCorrect: boolean) {
  return {
    id: `${id}-choice`,
    image: patternPieces[id].image,
    isCorrect,
    label: patternPieces[id].label,
  };
}

function patternChoose(
  promptPattern: ("red" | "blue" | "yellow")[],
  correct: "red" | "blue" | "yellow",
  distractor: "red" | "blue" | "yellow"
): PreschoolStageWorldTopic["choose"] {
  return {
    question: "Find next",
    revealPattern: {
      completionText: "Completed",
      prompt: [...patternVisuals(promptPattern, promptPattern.map((id) => patternPieces[id].symbol)), null],
      revealVisual: patternVisual(correct, promptPattern.length, patternPieces[correct].symbol),
    },
    choices: [patternChoice(correct, true), patternChoice(distractor, false)],
  };
}

const patternSeeds: TopicSeed[] = [
  {
    id: "ab-pattern",
    image: patternAssets.red,
    label: "AB Pattern",
    choose: patternChoose(["red", "blue", "red"], "blue", "red"),
    lookVisuals: patternVisuals(["red", "blue", "red", "blue"], ["A", "B", "A", "B"]),
    meaning: "Red-Blue-Red-Blue",
    order: 1,
    patternBuild: patternBuild(["red", "blue", "red", "blue"], ["A", "B", "A", "B"]),
    playTask: "Build AB pattern",
    speech: "AB pattern. Red blue red blue.",
    symbol: "A B A B",
    tapSlides: [
      { id: "a-red", speech: "A is red.", text: "A is red", title: "One", visuals: [patternVisual("red", 1, "A")] },
      { id: "b-blue", speech: "B is blue.", text: "B is blue", title: "Two", visuals: [patternVisual("blue", 2, "B")] },
      { id: "sequence", speech: "Red, Blue, Red, Blue.", text: "Red-Blue-Red-Blue", title: "Three", visuals: patternVisuals(["red", "blue", "red", "blue"], ["A", "B", "A", "B"]) },
    ],
  },
  {
    id: "aab-pattern",
    image: patternAssets.red,
    label: "AAB Pattern",
    choose: patternChoose(["red", "red", "blue", "red", "red"], "blue", "red"),
    lookVisuals: patternVisuals(["red", "red", "blue", "red", "red", "blue"], ["A", "A", "B", "A", "A", "B"]),
    meaning: "Red-Red-Blue",
    order: 2,
    patternBuild: patternBuild(["red", "red", "blue", "red", "red", "blue"], ["A", "A", "B", "A", "A", "B"]),
    playTask: "Build AAB pattern",
    speech: "AAB pattern. Red red blue.",
    symbol: "A A B",
    tapSlides: [
      { id: "a-red", speech: "A is red.", text: "A is red", title: "One", visuals: [patternVisual("red", 1, "A")] },
      { id: "a-red-again", speech: "A again is red.", text: "A again is red", title: "Two", visuals: [patternVisual("red", 2, "A")] },
      { id: "b-blue", speech: "B is blue.", text: "B is blue", title: "Three", visuals: [patternVisual("blue", 3, "B")] },
      { id: "sequence", speech: "Red, Red, Blue.", text: "Red-Red-Blue", title: "Four", visuals: patternVisuals(["red", "red", "blue", "red", "red", "blue"], ["A", "A", "B", "A", "A", "B"]) },
    ],
  },
  {
    id: "abb-pattern",
    image: patternAssets.blue,
    label: "ABB Pattern",
    choose: patternChoose(["red", "blue", "blue", "red"], "blue", "red"),
    lookVisuals: patternVisuals(["red", "blue", "blue", "red", "blue", "blue"], ["A", "B", "B", "A", "B", "B"]),
    meaning: "Red-Blue-Blue",
    order: 3,
    patternBuild: patternBuild(["red", "blue", "blue", "red", "blue", "blue"], ["A", "B", "B", "A", "B", "B"]),
    playTask: "Build ABB pattern",
    speech: "ABB pattern. Red blue blue.",
    symbol: "A B B",
    tapSlides: [
      { id: "a-red", speech: "A is red.", text: "A is red", title: "One", visuals: [patternVisual("red", 1, "A")] },
      { id: "b-blue", speech: "B is blue.", text: "B is blue", title: "Two", visuals: [patternVisual("blue", 2, "B")] },
      { id: "b-blue-again", speech: "B again is blue.", text: "B again is blue", title: "Three", visuals: [patternVisual("blue", 3, "B")] },
      { id: "sequence", speech: "Red, Blue, Blue.", text: "Red-Blue-Blue", title: "Four", visuals: patternVisuals(["red", "blue", "blue", "red", "blue", "blue"], ["A", "B", "B", "A", "B", "B"]) },
    ],
  },
  {
    id: "abc-pattern",
    image: patternAssets.yellow,
    label: "ABC Pattern",
    choose: patternChoose(["red", "blue", "yellow", "red", "blue"], "yellow", "red"),
    lookVisuals: patternVisuals(["red", "blue", "yellow", "red", "blue", "yellow"], ["A", "B", "C", "A", "B", "C"]),
    meaning: "Red-Blue-Yellow",
    order: 4,
    patternBuild: patternBuild(["red", "blue", "yellow", "red", "blue", "yellow"], ["A", "B", "C", "A", "B", "C"]),
    playTask: "Build ABC pattern",
    speech: "ABC pattern. Red blue yellow.",
    symbol: "A B C",
    tapSlides: [
      { id: "a-red", speech: "A is red.", text: "A is red", title: "One", visuals: [patternVisual("red", 1, "A")] },
      { id: "b-blue", speech: "B is blue.", text: "B is blue", title: "Two", visuals: [patternVisual("blue", 2, "B")] },
      { id: "c-yellow", speech: "C is yellow.", text: "C is yellow", title: "Three", visuals: [patternVisual("yellow", 3, "C")] },
      { id: "sequence", speech: "Red, Blue, Yellow.", text: "Red-Blue-Yellow", title: "Four", visuals: patternVisuals(["red", "blue", "yellow", "red", "blue", "yellow"], ["A", "B", "C", "A", "B", "C"]) },
    ],
  },
  {
    id: "pattern-challenge",
    image: worldImage("kindergarten-patterns"),
    label: "Pattern Challenge",
    choose: patternChoose(["red", "blue", "red"], "blue", "red"),
    lookVisuals: [
      ...patternVisuals(["red", "blue", "red", "blue"], ["A", "B", "A", "B"]),
      ...patternVisuals(["red", "red", "blue"], ["A", "A", "B"]),
    ],
    meaning: "Build a learned pattern",
    order: 5,
    patternBuild: patternBuild(["red", "blue", "yellow", "red", "blue", "yellow"], ["A", "B", "C", "A", "B", "C"]),
    playTask: "Build pattern",
    speech: "Pattern Challenge. Build a learned pattern.",
    symbol: "Pattern",
    tapSlides: [
      { id: "ab", speech: "AB pattern.", text: "AB Pattern", title: "One", visuals: patternVisuals(["red", "blue", "red", "blue"], ["A", "B", "A", "B"]) },
      { id: "aab", speech: "AAB pattern.", text: "AAB Pattern", title: "Two", visuals: patternVisuals(["red", "red", "blue", "red", "red", "blue"], ["A", "A", "B", "A", "A", "B"]) },
      { id: "abb", speech: "ABB pattern.", text: "ABB Pattern", title: "Three", visuals: patternVisuals(["red", "blue", "blue", "red", "blue", "blue"], ["A", "B", "B", "A", "B", "B"]) },
      { id: "abc", speech: "ABC pattern.", text: "ABC Pattern", title: "Four", visuals: patternVisuals(["red", "blue", "yellow", "red", "blue", "yellow"], ["A", "B", "C", "A", "B", "C"]) },
    ],
  },
];

function createWorldConfig(
  worldId: KinderWorldId,
  title: string,
  seeds: TopicSeed[]
): PreschoolStageWorldConfig {
  const worldImageSource = worldImage(worldId);

  return {
    backgroundImage,
    gradeLevel: "kindergarten",
    title,
    topics: seeds.map((seed) => createTopic(seed, seeds, worldImageSource)),
    worldId,
    wrongImage: resolveKindergartenWorldWrongImage(worldId),
  };
}

export const kindergartenAlphabetStageWorld = createWorldConfig(
  "kindergarten-alphabet",
  "Alphabet Adventure",
  alphabetSeeds
);

export const kindergartenSchoolStageWorld = createWorldConfig(
  "kindergarten-school",
  "School World",
  schoolSeeds
);

export const kindergartenCommunityStageWorld = createWorldConfig(
  "kindergarten-community-village",
  "Community Helpers",
  [...communitySeeds, communityChallengeSeed]
);

export const kindergartenCountingStageWorld = createWorldConfig(
  "kindergarten-number-forest",
  "Counting Forest",
  [...numberSeeds, numberChallengeSeed]
);

export const kindergartenBigSmallStageWorld = createWorldConfig(
  "kindergarten-big-small",
  "Big & Small Village",
  sizeSeeds
);

export const kindergartenMoreLessStageWorld = createWorldConfig(
  "kindergarten-more-less",
  "More & Less Valley",
  quantitySeeds
);

export const kindergartenPatternStageWorld = createWorldConfig(
  "kindergarten-patterns",
  "Pattern Playground",
  patternSeeds
);

export const kindergartenStageWorlds: Partial<
  Record<KinderWorldId, PreschoolStageWorldConfig>
> = {
  "kindergarten-alphabet": kindergartenAlphabetStageWorld,
  "kindergarten-big-small": kindergartenBigSmallStageWorld,
  "kindergarten-community-village": kindergartenCommunityStageWorld,
  "kindergarten-more-less": kindergartenMoreLessStageWorld,
  "kindergarten-number-forest": kindergartenCountingStageWorld,
  "kindergarten-patterns": kindergartenPatternStageWorld,
  "kindergarten-school": kindergartenSchoolStageWorld,
};
