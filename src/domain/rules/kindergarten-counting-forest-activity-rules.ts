export type KindergartenCountingForestIcon =
  | "basket"
  | "git-commit"
  | "home"
  | "map"
  | "trail-sign";

export type KindergartenCountingForestLesson = {
  chooseAnswer: number;
  chooseChoices: number[];
  choosePrompt: string;
  destination: string;
  destinationIcon: KindergartenCountingForestIcon;
  lookSequence: number[];
  missionTitle: string;
  objectEmoji: string;
  tapSequence: number[];
  tryAnswer: number;
  tryChoices: number[];
  tryPrompt: string;
};

function slug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getNumberFromTopicLabel(topicTitle: string) {
  const match = topicTitle.match(/\d+/);
  return match ? Number.parseInt(match[0] ?? "", 10) : null;
}

function buildKindergartenNumberForestLesson(
  quantity: number
): KindergartenCountingForestLesson {
  const previous = Math.max(11, quantity - 1);
  const next = Math.min(20, quantity + 1);
  const extra = quantity <= 17 ? quantity + 2 : quantity - 2;
  const start = Math.min(Math.max(11, quantity - 4), 16);
  const sequence = Array.from({ length: 5 }, (_, index) => start + index);

  return {
    chooseAnswer: quantity,
    chooseChoices: Array.from(new Set([previous, quantity, next, extra])).slice(0, 4),
    choosePrompt: `Choose ${quantity}.`,
    destination: "Number path",
    destinationIcon: "trail-sign",
    lookSequence: sequence,
    missionTitle: `Build Number ${quantity}`,
    objectEmoji: "dot",
    tapSequence: sequence,
    tryAnswer: quantity,
    tryChoices: Array.from(new Set([quantity, previous])).slice(0, 2),
    tryPrompt: "What number did we meet?",
  };
}

const LESSONS: Record<string, KindergartenCountingForestLesson> = {
  "count-backward": {
    chooseAnswer: 7,
    chooseChoices: [7, 6, 5],
    choosePrompt: "10, 9, 8, __",
    destination: "Owl home",
    destinationIcon: "home",
    lookSequence: [5, 4, 3, 2, 1],
    missionTitle: "Bring Owl Home",
    objectEmoji: "leaf",
    tapSequence: [5, 4, 3, 2, 1],
    tryAnswer: 2,
    tryChoices: [2, 1],
    tryPrompt: "5, 4, 3, __",
  },
  "count-forward": {
    chooseAnswer: 8,
    chooseChoices: [8, 9, 10],
    choosePrompt: "5, 6, 7, __",
    destination: "Forest path",
    destinationIcon: "trail-sign",
    lookSequence: [1, 2, 3, 4, 5],
    missionTitle: "Cross Forest Path",
    objectEmoji: "stone",
    tapSequence: [1, 2, 3, 4, 5],
    tryAnswer: 4,
    tryChoices: [4, 5],
    tryPrompt: "1, 2, 3, __",
  },
  "count-objects": {
    chooseAnswer: 5,
    chooseChoices: [4, 5, 6],
    choosePrompt: "How many birds?",
    destination: "Number sign",
    destinationIcon: "trail-sign",
    lookSequence: [3, 4, 5],
    missionTitle: "Forest Explorer",
    objectEmoji: "bird",
    tapSequence: [1, 2, 3, 4, 5],
    tryAnswer: 3,
    tryChoices: [2, 3],
    tryPrompt: "How many rabbits?",
  },
  "forest-counting-challenge": {
    chooseAnswer: 8,
    chooseChoices: [6, 7, 8, 9],
    choosePrompt: "Choose the forest answer",
    destination: "Forest map",
    destinationIcon: "map",
    lookSequence: [1, 5, 10, 15, 20],
    missionTitle: "Forest Adventure",
    objectEmoji: "tree",
    tapSequence: [1, 5, 10, 15, 20],
    tryAnswer: 6,
    tryChoices: [5, 6, 7],
    tryPrompt: "Mixed forest count",
  },
  "missing-numbers": {
    chooseAnswer: 12,
    chooseChoices: [12, 14, 15],
    choosePrompt: "10, 11, __, 13",
    destination: "Forest bridge",
    destinationIcon: "git-commit",
    lookSequence: [1, 2, 0, 4, 5],
    missionTitle: "Repair Forest Bridge",
    objectEmoji: "wood",
    tapSequence: [6, 7, 8],
    tryAnswer: 7,
    tryChoices: [7, 9],
    tryPrompt: "6, __, 8",
  },
  "more-and-less": {
    chooseAnswer: 3,
    chooseChoices: [8, 3, 5],
    choosePrompt: "Which has less?",
    destination: "Bigger basket",
    destinationIcon: "basket",
    lookSequence: [3, 5],
    missionTitle: "Feed Bigger Basket",
    objectEmoji: "apple",
    tapSequence: [1, 2, 3, 4, 5],
    tryAnswer: 5,
    tryChoices: [2, 5],
    tryPrompt: "Which has more?",
  },
  "number-order": {
    chooseAnswer: 7,
    chooseChoices: [7, 8, 9],
    choosePrompt: "Before 8?",
    destination: "Number trail",
    destinationIcon: "trail-sign",
    lookSequence: [1, 2, 3, 4, 5],
    missionTitle: "Build Number Trail",
    objectEmoji: "number",
    tapSequence: [1, 2, 3, 4, 5],
    tryAnswer: 2,
    tryChoices: [2, 3],
    tryPrompt: "Order 1, 3, 2",
  },
  "numbers-1-20": {
    chooseAnswer: 5,
    chooseChoices: [4, 5, 6],
    choosePrompt: "How many apples?",
    destination: "Forest basket",
    destinationIcon: "basket",
    lookSequence: [1, 2, 3, 4, 5],
    missionTitle: "Forest Basket Mission",
    objectEmoji: "apple",
    tapSequence: [1, 2, 3, 4, 5],
    tryAnswer: 5,
    tryChoices: [4, 5],
    tryPrompt: "Count the apples",
  },
};

export function buildKindergartenCountingForestLesson(
  topicTitle: string
): KindergartenCountingForestLesson {
  const key = slug(topicTitle);
  const number = getNumberFromTopicLabel(topicTitle);

  if (/^number-\d+$/i.test(key) && number && number >= 11 && number <= 20) {
    return buildKindergartenNumberForestLesson(number);
  }

  if (key === "number-challenge") {
    return {
      chooseAnswer: 20,
      chooseChoices: [17, 18, 19, 20],
      choosePrompt: "Choose 20.",
      destination: "Forest map",
      destinationIcon: "map",
      lookSequence: [11, 12, 13, 14, 15],
      missionTitle: "Number Challenge",
      objectEmoji: "dot",
      tapSequence: [16, 17, 18, 19, 20],
      tryAnswer: 15,
      tryChoices: [14, 15],
      tryPrompt: "What number did we meet?",
    };
  }

  return LESSONS[key] ?? LESSONS["numbers-1-20"];
}

export function getKindergartenNumberChoiceSet(
  answer: number,
  choices: number[],
  targetCount: 2 | 4
) {
  const candidates = [
    answer,
    ...choices,
    answer - 1,
    answer + 1,
    answer - 2,
    answer + 2,
    answer - 3,
    answer + 3,
  ];
  const unique = Array.from(new Set(candidates)).filter(
    (choice) => Number.isFinite(choice) && choice > 0 && choice <= 20
  );

  return unique.includes(answer)
    ? unique.slice(0, targetCount)
    : [answer, ...unique].slice(0, targetCount);
}

export function validateKindergartenCountingForestLesson(
  lesson: KindergartenCountingForestLesson
) {
  const tryChoices = getKindergartenNumberChoiceSet(
    lesson.tryAnswer,
    lesson.tryChoices,
    2
  );
  const chooseChoices = getKindergartenNumberChoiceSet(
    lesson.chooseAnswer,
    lesson.chooseChoices,
    4
  );

  return (
    tryChoices.length === 2 &&
    chooseChoices.length === 4 &&
    new Set(tryChoices).size === 2 &&
    new Set(chooseChoices).size === 4 &&
    tryChoices.includes(lesson.tryAnswer) &&
    chooseChoices.includes(lesson.chooseAnswer) &&
    lesson.lookSequence.length >= 2 &&
    lesson.tapSequence.length >= 2 &&
    lesson.missionTitle.trim().length > 0 &&
    lesson.destination.trim().length > 0
  );
}
