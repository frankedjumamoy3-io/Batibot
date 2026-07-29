export type NumberStageType = "look" | "tap" | "try" | "choose" | "play";

export type NumberTopicId =
  | "number-1"
  | "number-2"
  | "number-3"
  | "number-4"
  | "number-5"
  | "number-6"
  | "number-7"
  | "number-8"
  | "number-9"
  | "number-10"
  | "number-challenge";

export type NumberChoice = {
  id: string;
  isCorrect: boolean;
  label: string;
  numeral: number;
};

export type NumberVillageTopic = {
  choose: {
    choices: NumberChoice[];
    question: string;
  };
  id: NumberTopicId;
  label: string;
  look: {
    numeral: string;
    speech: string;
  };
  order: number;
  play: {
    choices: NumberChoice[];
    correctNumeral: number;
    targetAppleCount: number;
    task: "Count and Match";
    timerSeconds: number;
  };
  reward: {
    stars: number;
    xp: number;
  };
  tap: {
    appleCount: number;
    sentence: string;
    speech: string;
  };
  try: {
    choices: NumberChoice[];
    question: string;
  };
  value: number;
  word: string;
};

export const numberVillageAssets = {
  apple: require("../../Batibot assets/preschool assets/number village/apple.png"),
  backgroundImage: require("../../Batibot assets/preschool assets/my family world/preschool-play-tab-background.jpg"),
  topicImage: require("../../Batibot assets/preschool assets/number village/topic/number.png"),
  worldImage: require("../../Batibot assets/preschool assets/number village/number village.png"),
  wrongImage: require("../../Batibot assets/preschool assets/number village/play drop area-wrong/wrong.png"),
} as const;

const NUMBER_WORDS: Record<number, string> = {
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  10: "Ten",
};

const NUMBER_ORDER: NumberTopicId[] = [
  ...Array.from({ length: 10 }, (_, index) => `number-${index + 1}` as NumberTopicId),
  "number-challenge",
];

function appleSentence(value: number) {
  return `${NUMBER_WORDS[value]} ${value === 1 ? "apple" : "apples"}`;
}

function choice(value: number, correctNumeral: number): NumberChoice {
  return {
    id: `number-${value}`,
    isCorrect: value === correctNumeral,
    label: NUMBER_WORDS[value],
    numeral: value,
  };
}

function nearbyWrong(value: number) {
  return value === 10 ? 9 : value + 1;
}

function chooseValues(value: number) {
  const values = [value - 2, value - 1, value + 1, value + 2]
    .filter((item) => item >= 1 && item <= 10);

  for (let item = 1; values.length < 3 && item <= 10; item += 1) {
    if (item !== value && !values.includes(item)) {
      values.push(item);
    }
  }

  return [...values.slice(0, 3), value];
}

function createNumberTopic(value: number, order: number): NumberVillageTopic {
  const word = NUMBER_WORDS[value];
  const wrong = nearbyWrong(value);

  return {
    id: `number-${value}` as NumberTopicId,
    label: `Number ${value}`,
    value,
    word,
    order,
    look: {
      numeral: String(value),
      speech: `${word}.`,
    },
    tap: {
      appleCount: value,
      sentence: appleSentence(value),
      speech: `${appleSentence(value)}.`,
    },
    try: {
      question: `Which one is ${value}?`,
      choices: [choice(value, value), choice(wrong, value)],
    },
    choose: {
      question: `Choose ${value}.`,
      choices: chooseValues(value).map((item) => choice(item, value)),
    },
    play: {
      task: "Count and Match",
      timerSeconds: 10,
      targetAppleCount: value,
      choices: [choice(value, value), choice(wrong, value)],
      correctNumeral: value,
    },
    reward: {
      stars: 1,
      xp: 10,
    },
  };
}

const numberTopics = Array.from({ length: 10 }, (_, index) =>
  createNumberTopic(index + 1, index + 1)
);

const numberChallenge: NumberVillageTopic = {
  id: "number-challenge",
  label: "Number Challenge",
  value: 0,
  word: "Challenge",
  order: 11,
  look: {
    numeral: "1 2 3",
    speech: "Number Challenge.",
  },
  tap: {
    appleCount: 5,
    sentence: "Count numbers 1 to 10",
    speech: "Count numbers one to ten.",
  },
  try: {
    question: "Which number?",
    choices: [choice(5, 5), choice(8, 5)],
  },
  choose: {
    question: "Find the number",
    choices: [3, 6, 9, 5].map((item) => choice(item, 5)),
  },
  play: {
    task: "Count and Match",
    timerSeconds: 10,
    targetAppleCount: 5,
    choices: [choice(5, 5), choice(8, 5)],
    correctNumeral: 5,
  },
  reward: {
    stars: 2,
    xp: 20,
  },
};

export const preschoolNumberVillageTopics: NumberVillageTopic[] = [
  ...numberTopics,
  numberChallenge,
];

export const preschoolNumberVillage = {
  backgroundImage: numberVillageAssets.backgroundImage,
  title: "Number Village",
  topics: preschoolNumberVillageTopics,
  topicOrder: NUMBER_ORDER,
  worldId: "preschool-number-village",
  wrongImage: numberVillageAssets.wrongImage,
} as const;
