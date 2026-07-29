import type {
  Grade1ChoiceItem,
  Grade1LessonStage,
  Grade1LessonTopic,
  Grade1MatchPair,
  Grade1WordItem,
} from "./lessonTypes";

export type ReadingQuestTopicId =
  | "words"
  | "sentences"
  | "reading-passage"
  | "reading-comprehension"
  | "reading-challenge";

export const GRADE1_READING_QUEST_WORLD_ID = "grade1-reading" as const;

export const BEN_PUPPY_PASSAGE = {
  title: "The Boy in the Park",
  sentences: [
    "The boy runs in the park.",
    "The boy runs in the park in the morning.",
  ],
};

const totalStages = 8 as const;

function stage(stage: Omit<Grade1LessonStage, "totalStages">): Grade1LessonStage {
  return { ...stage, totalStages };
}

function choice(id: string, label: string, isCorrect = false, imageKey?: string): Grade1ChoiceItem {
  return { id, imageKey, isCorrect, label };
}

function item(id: string, word: string, imageKey?: string, meaning?: string): Grade1WordItem {
  return { id, imageKey, meaning, word };
}

const sightWords = [
  item("i", "I", "reading.word.I"),
  item("a", "a", "reading.word.a"),
  item("the", "the", "reading.word.the"),
  item("is", "is", "reading.word.is"),
];

const sentenceItems = [
  item("i-run-fast", "I run fast.", "reading.sentence.runFast"),
  item("dog-jumps", "The dog jumps.", "reading.sentence.dogJumps"),
];

const questionWords = [
  item("who", "Who", undefined, "asks about a person"),
  item("what", "What", undefined, "asks about a thing or action"),
  item("where", "Where", undefined, "asks about a place"),
  item("when", "When", undefined, "asks about time"),
];

function buildReadingTopic(topic: {
  challengeQuestions: Grade1LessonStage["questions"];
  chooseChoices: Grade1ChoiceItem[];
  choosePrompt: string;
  definition: string;
  id: ReadingQuestTopicId;
  items?: Grade1WordItem[];
  lookInstruction: string;
  matchPairs?: Grade1MatchPair[];
  objective: string;
  playApplyInstruction: string;
  playMatchInstruction: string;
  reward: { badgeName: string; stars: number; unlocksWorldId?: string; xp: number };
  tapInstruction: string;
  title: string;
  tryChoices: Grade1ChoiceItem[];
  tryPrompt: string;
}): Grade1LessonTopic {
  return {
    id: topic.id,
    items: topic.items,
    objective: topic.objective,
    shortDefinition: topic.definition,
    stages: [
      stage({
        activityType: "carousel",
        id: "look",
        instruction: topic.lookInstruction,
        items: topic.items,
        progressIndex: 1,
        stageLabel: "LOOK",
        title: topic.title,
      }),
      stage({
        activityType: "carousel",
        id: "tap",
        instruction: topic.tapInstruction,
        items: topic.items,
        progressIndex: 2,
        stageLabel: "TAP",
        title: "Tap to hear",
      }),
      stage({
        activityType: "singleChoice",
        choices: topic.tryChoices,
        id: "try",
        instruction: "Tap the answer.",
        progressIndex: 3,
        prompt: topic.tryPrompt,
        stageLabel: "TRY",
        title: topic.id === "sentences" || topic.id === "reading-passage" ? "Read" : "We learn",
      }),
      stage({
        activityType: topic.chooseChoices.filter((item) => item.isCorrect).length > 1 ? "multiSelect" : "singleChoice",
        choices: topic.chooseChoices,
        correctAnswerIds: topic.chooseChoices.filter((item) => item.isCorrect).map((item) => item.id),
        id: "choose",
        instruction: "Choose the answer.",
        progressIndex: 4,
        prompt: topic.choosePrompt,
        stageLabel: "CHOOSE",
        title: "CHOOSE",
      }),
      stage({
        activityType: "liveArrowMatch",
        id: "play-match",
        instruction: topic.playMatchInstruction,
        items: topic.items,
        matchPairs: topic.matchPairs,
        progressIndex: 5,
        stageLabel: "PLAY",
        title: "Match",
      }),
      stage({
        activityType:
          topic.id === "sentences"
            ? "sentenceComplete"
            : topic.id === "reading-passage"
              ? "categorySort"
              : topic.id === "reading-challenge"
                ? "categorySort"
                : "sentenceComplete",
        id: "play-apply",
        instruction: topic.playApplyInstruction,
        items: topic.items,
        progressIndex: 6,
        stageLabel: "PLAY",
        title: "Use it",
      }),
      stage({
        activityType: "mixedQuiz",
        id: "challenge",
        instruction: "Answer the review.",
        progressIndex: 7,
        questions: topic.challengeQuestions,
        stageLabel: "CHALLENGE",
        title: "Challenge",
      }),
      stage({
        activityType: "reward",
        id: "reward",
        instruction: "Great reading.",
        progressIndex: 8,
        reward: topic.reward,
        stageLabel: "REWARD",
        title: "Reward",
      }),
    ],
    title: topic.title,
    worldId: GRADE1_READING_QUEST_WORLD_ID,
  };
}

export const grade1ReadingQuestTopics: Grade1LessonTopic[] = [
  buildReadingTopic({
    id: "words",
    title: "Words",
    definition: "Sight words are words we see often.",
    objective: "Recognize basic sight words.",
    items: sightWords,
    lookInstruction: "Look and listen.",
    tapInstruction: "Tap each word.",
    tryPrompt: "Read the word: the",
    tryChoices: [choice("the", "the", true), choice("a", "a")],
    choosePrompt: 'Find the word "is".',
    chooseChoices: [choice("i", "I"), choice("a", "a"), choice("the", "the"), choice("is", "is", true)],
    matchPairs: sightWords.map((word) => ({ sourceId: `audio-${word.id}`, targetId: word.id })),
    playMatchInstruction: "Match spoken word to printed word.",
    playApplyInstruction: "Put the word in the sentence.",
    challengeQuestions: [
      { activityType: "singleChoice", choices: [choice("i", "I", true), choice("the", "the")], correctAnswerIds: ["i"], id: "words-q1", prompt: 'Tap "I".' },
      { activityType: "singleChoice", choices: [choice("the", "the", true), choice("a", "a")], correctAnswerIds: ["the"], id: "words-q2", prompt: 'Tap "the".' },
      { activityType: "sentenceComplete", choices: [choice("the", "the", true), choice("is", "is")], correctAnswerIds: ["the"], id: "words-q3", prompt: "___ dog is big." },
      { activityType: "singleChoice", choices: [choice("is", "is", true), choice("a", "a")], correctAnswerIds: ["is"], id: "words-q4", prompt: 'Choose the word "is".' },
      { activityType: "singleChoice", choices: [choice("a", "a", true), choice("boy", "boy")], correctAnswerIds: ["a"], id: "words-q5", prompt: 'Tap "a".' },
    ],
    reward: { badgeName: "Sight Word Starter", stars: 3, xp: 20 },
  }),
  buildReadingTopic({
    id: "sentences",
    title: "Sentences",
    definition: "A sentence tells a complete idea.",
    objective: "Read simple sentences.",
    items: sentenceItems,
    lookInstruction: "Look at the sentences.",
    tapInstruction: "Tap each sentence.",
    tryPrompt: "Read: I run fast.",
    tryChoices: [choice("speak", "Speak", true), choice("skip", "Skip")],
    choosePrompt: "Find the sentence: I run fast.",
    chooseChoices: [
      choice("i-run-fast", "I run fast.", true),
      choice("dog-jumps", "The dog jumps."),
      choice("ball-big", "The ball is big."),
      choice("i-read", "I read."),
    ],
    matchPairs: [
      { sourceId: "child-running", targetId: "i-run-fast" },
      { sourceId: "dog-jumping", targetId: "dog-jumps" },
    ],
    playMatchInstruction: "Match sentence to picture.",
    playApplyInstruction: "Arrange the words.",
    challengeQuestions: [
      { activityType: "singleChoice", choices: [choice("done", "Done", true), choice("try", "Try")], correctAnswerIds: ["done"], id: "sentences-q1", prompt: "Read: I run fast." },
      { activityType: "singleChoice", choices: [choice("run-picture", "running child", true), choice("dog-picture", "dog jumping")], correctAnswerIds: ["run-picture"], id: "sentences-q2", prompt: "Choose the matching picture." },
      { activityType: "sentenceComplete", choices: [choice("jumps", "jumps", true), choice("jump", "jump")], correctAnswerIds: ["jumps"], id: "sentences-q3", prompt: "The dog ___." },
      { activityType: "singleChoice", choices: [choice("dog", "dog", true), choice("run", "run")], correctAnswerIds: ["dog"], id: "sentences-q4", prompt: 'Tap the word "dog".' },
      { activityType: "singleChoice", choices: [choice("complete", "The dog jumps.", true), choice("words", "dog jumps the")], correctAnswerIds: ["complete"], id: "sentences-q5", prompt: "Choose the complete sentence." },
    ],
    reward: { badgeName: "Sentence Reader", stars: 3, xp: 20 },
  }),
  buildReadingTopic({
    id: "reading-passage",
    title: "Reading Passage",
    definition: "A passage tells a short story.",
    objective: "Read a short passage and find story parts.",
    items: [
      item("boy", "boy", "reading.character.ben", "Character"),
      item("park", "Park", "reading.setting.park", "Setting"),
      item("runs", "runs", "reading.sentence.runFast", "Event"),
    ],
    lookInstruction: "Look at the boy in the park.",
    tapInstruction: "Tap to hear the passage.",
    tryPrompt: "Read: The boy runs in the park.",
    tryChoices: [choice("speak", "Speak", true), choice("skip", "Skip")],
    choosePrompt: "Find the character.",
    chooseChoices: [choice("boy", "boy", true), choice("park", "park"), choice("runs", "runs"), choice("morning", "morning")],
    matchPairs: [
      { sourceId: "boy", targetId: "character" },
      { sourceId: "park", targetId: "setting" },
      { sourceId: "runs", targetId: "event" },
    ],
    playMatchInstruction: "Match story parts.",
    playApplyInstruction: "Put the story in order.",
    challengeQuestions: [
      { activityType: "singleChoice", choices: [choice("boy", "boy", true), choice("dog", "dog")], correctAnswerIds: ["boy"], id: "passage-q1", prompt: "Who is the character?" },
      { activityType: "singleChoice", choices: [choice("park", "park", true), choice("school", "school")], correctAnswerIds: ["park"], id: "passage-q2", prompt: "Where does the boy run?" },
      { activityType: "singleChoice", choices: [choice("runs", "runs", true), choice("sleeps", "sleeps")], correctAnswerIds: ["runs"], id: "passage-q3", prompt: "What does the boy do?" },
      { activityType: "singleChoice", choices: [choice("morning", "morning", true), choice("night", "night")], correctAnswerIds: ["morning"], id: "passage-q4", prompt: "When does the boy run?" },
      { activityType: "singleChoice", choices: [choice("sentence", "The boy runs in the park.", true), choice("word", "park boy the")], correctAnswerIds: ["sentence"], id: "passage-q5", prompt: "Choose the sentence." },
    ],
    reward: { badgeName: "Passage Explorer", stars: 4, xp: 25 },
  }),
  buildReadingTopic({
    id: "reading-comprehension",
    title: "Reading Comprehension",
    definition: "Questions help us understand.",
    objective: "Answer Who, What, Where, and When questions.",
    items: questionWords,
    lookInstruction: "Look at question words.",
    tapInstruction: "Tap each question word.",
    tryPrompt: '"Who" asks about...',
    tryChoices: [choice("person", "a person", true), choice("place", "a place"), choice("time", "a time")],
    choosePrompt: "Who runs?",
    chooseChoices: [choice("boy", "boy", true), choice("run", "run"), choice("park", "park"), choice("morning", "morning")],
    matchPairs: [
      { sourceId: "who", targetId: "person" },
      { sourceId: "what", targetId: "thing-action" },
      { sourceId: "where", targetId: "place" },
      { sourceId: "when", targetId: "time" },
    ],
    playMatchInstruction: "Match question words.",
    playApplyInstruction: "Answer from the passage.",
    challengeQuestions: [
      { activityType: "singleChoice", choices: [choice("boy", "boy", true), choice("dog", "dog")], correctAnswerIds: ["boy"], id: "comp-q1", prompt: "Who runs?" },
      { activityType: "singleChoice", choices: [choice("run", "run", true), choice("jump", "jump")], correctAnswerIds: ["run"], id: "comp-q2", prompt: "What does the boy do?" },
      { activityType: "singleChoice", choices: [choice("park", "park", true), choice("school", "school")], correctAnswerIds: ["park"], id: "comp-q3", prompt: "Where does the boy run?" },
      { activityType: "singleChoice", choices: [choice("morning", "morning", true), choice("evening", "evening")], correctAnswerIds: ["morning"], id: "comp-q4", prompt: "When does the boy run?" },
      { activityType: "singleChoice", choices: [choice("sentence", "The boy runs in the park.", true), choice("word", "park runs boy")], correctAnswerIds: ["sentence"], id: "comp-q5", prompt: "Choose the sentence." },
    ],
    reward: { badgeName: "Question Answerer", stars: 4, xp: 25 },
  }),
  buildReadingTopic({
    id: "reading-challenge",
    title: "Reading Challenge",
    definition: "Review Reading Quest.",
    objective: "Review words, sentences, passage, and questions.",
    items: [...sightWords, ...sentenceItems, ...questionWords],
    lookInstruction: "Let's review Reading Quest.",
    tapInstruction: "Tap each review card.",
    tryPrompt: "Who asks about...",
    tryChoices: [choice("person", "a person", true), choice("place", "a place"), choice("action", "an action")],
    choosePrompt: "Find the sight words.",
    chooseChoices: [choice("i", "I", true), choice("the", "the", true), choice("boy", "boy"), choice("park", "park")],
    matchPairs: [
      { sourceId: "boy", targetId: "character" },
      { sourceId: "park", targetId: "setting" },
      { sourceId: "runs", targetId: "event" },
      { sourceId: "who", targetId: "person" },
      { sourceId: "where", targetId: "place" },
    ],
    playMatchInstruction: "Match the review cards.",
    playApplyInstruction: "Sort the reading cards.",
    challengeQuestions: [
      { activityType: "singleChoice", choices: [choice("the", "the", true), choice("boy", "boy")], correctAnswerIds: ["the"], id: "reading-challenge-q1", prompt: 'Tap the word "the".' },
      { activityType: "singleChoice", choices: [choice("run", "I run fast.", true), choice("dog", "dog jumps the")], correctAnswerIds: ["run"], id: "reading-challenge-q2", prompt: "Choose the sentence." },
      { activityType: "sentenceComplete", choices: [choice("jumps", "jumps", true), choice("jump", "jump")], correctAnswerIds: ["jumps"], id: "reading-challenge-q3", prompt: "The dog ___." },
      { activityType: "singleChoice", choices: [choice("boy", "boy", true), choice("girl", "girl")], correctAnswerIds: ["boy"], id: "reading-challenge-q4", prompt: "Who runs?" },
      { activityType: "singleChoice", choices: [choice("park", "park", true), choice("tree", "tree")], correctAnswerIds: ["park"], id: "reading-challenge-q5", prompt: "Where does the boy run?" },
      { activityType: "singleChoice", choices: [choice("run", "run", true), choice("sleep", "sleep")], correctAnswerIds: ["run"], id: "reading-challenge-q6", prompt: "What does the boy do?" },
      { activityType: "liveArrowMatch", id: "reading-challenge-q7", matchPairs: [{ sourceId: "boy", targetId: "character" }], prompt: "Match boy to Character." },
      { activityType: "liveArrowMatch", id: "reading-challenge-q8", matchPairs: [{ sourceId: "park", targetId: "setting" }], prompt: "Match park to Setting." },
      { activityType: "singleChoice", choices: [choice("person", "person", true), choice("place", "place")], correctAnswerIds: ["person"], id: "reading-challenge-q9", prompt: "Who asks about..." },
      { activityType: "singleChoice", choices: [choice("place", "place", true), choice("person", "person")], correctAnswerIds: ["place"], id: "reading-challenge-q10", prompt: "Where asks about..." },
    ],
    reward: { badgeName: "Reading Quest Champion", stars: 10, xp: 50 },
  }),
];

export const readingQuestTopicSummaries = grade1ReadingQuestTopics.map((topic) => ({
  id: topic.id as ReadingQuestTopicId,
  objective: topic.objective,
  shortDefinition: topic.shortDefinition,
  title: topic.title,
}));

export function getReadingQuestTopic(topicIdOrTitle: string) {
  const normalized = topicIdOrTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return grade1ReadingQuestTopics.find(
    (topic) => topic.id === normalized || topic.title.toLowerCase() === topicIdOrTitle.trim().toLowerCase()
  );
}

export function getReadingQuestStages(topicIdOrTitle: string) {
  return getReadingQuestTopic(topicIdOrTitle)?.stages ?? [];
}
