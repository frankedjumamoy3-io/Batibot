import type {
  Grade1ChoiceItem,
  Grade1LessonStage,
  Grade1LessonTopic,
  Grade1MatchPair,
  Grade1WordItem,
  Grade1WordPair,
} from "./lessonTypes";

export type WordKingdomTopicId =
  | "noun"
  | "action-words"
  | "describing-words"
  | "opposite-words"
  | "similar-words"
  | "word-challenge";

export const GRADE1_WORD_KINGDOM_WORLD_ID = "grade1-word-kingdom" as const;

const totalStages = 8 as const;

function stage(stage: Omit<Grade1LessonStage, "totalStages">): Grade1LessonStage {
  return { ...stage, totalStages };
}

function choice(id: string, label: string, isCorrect = false, imageKey?: string): Grade1ChoiceItem {
  return { id, imageKey, isCorrect, label };
}

const nounItems: Grade1WordItem[] = [
  { category: "Person Noun", id: "boy", imageKey: "word.noun.boy", meaning: "Boy is a person noun.", word: "boy" },
  { category: "Animal Noun", id: "dog", imageKey: "word.noun.dog", meaning: "Dog is an animal noun.", word: "dog" },
  { category: "Place Noun", id: "school", imageKey: "word.noun.school", meaning: "School is a place noun.", word: "school" },
  { category: "Thing Noun", id: "ball", imageKey: "word.noun.ball", meaning: "Ball is a thing noun.", word: "ball" },
];

const actionItems: Grade1WordItem[] = [
  { id: "run", imageKey: "word.action.run", meaning: "Run means move fast.", word: "run" },
  { id: "jump", imageKey: "word.action.jump", meaning: "Jump means move up.", word: "jump" },
  { id: "write", imageKey: "word.action.write", meaning: "Write means make words.", word: "write" },
  { id: "read", imageKey: "word.action.read", meaning: "Read means say words.", word: "read" },
];

const describingItems: Grade1WordItem[] = [
  { id: "big", imageKey: "word.describe.big", meaning: "Big means large.", word: "big" },
  { id: "bright", imageKey: "word.describe.bright", meaning: "Bright means full of light.", word: "bright" },
  { id: "happy", imageKey: "word.describe.happy", meaning: "Happy means feeling good.", word: "happy" },
  { id: "fast", imageKey: "word.describe.fast", meaning: "Fast means moving quickly.", word: "fast" },
];

const oppositePairs: Grade1WordPair[] = [
  { id: "fast-slow", left: "Fast", relation: "opposite", right: "Slow" },
  { id: "happy-sad", left: "Happy", relation: "opposite", right: "Sad" },
  { id: "big-small", left: "Big", relation: "opposite", right: "Small" },
  { id: "hot-cold", left: "Hot", relation: "opposite", right: "Cold" },
  { id: "up-down", left: "Up", relation: "opposite", right: "Down" },
];

const similarPairs: Grade1WordPair[] = [
  { id: "happy-glad", left: "Happy", relation: "similar", right: "Glad" },
  { id: "begin-start", left: "Begin", relation: "similar", right: "Start" },
  { id: "big-large", left: "Big", relation: "similar", right: "Large" },
  { id: "small-tiny", left: "Small", relation: "similar", right: "Tiny" },
  { id: "fast-quick", left: "Fast", relation: "similar", right: "Quick" },
];

const nounMatches: Grade1MatchPair[] = [
  { sourceId: "boy", targetId: "person-noun" },
  { sourceId: "dog", targetId: "animal-noun" },
  { sourceId: "school", targetId: "place-noun" },
  { sourceId: "ball", targetId: "thing-noun" },
];

const actionMatches: Grade1MatchPair[] = [
  { sourceId: "run-picture", targetId: "run" },
  { sourceId: "jump-picture", targetId: "jump" },
  { sourceId: "write-picture", targetId: "write" },
  { sourceId: "read-picture", targetId: "read" },
];

const describingMatches: Grade1MatchPair[] = [
  { sourceId: "sun", targetId: "bright" },
  { sourceId: "smile", targetId: "happy" },
  { sourceId: "large-ball", targetId: "big" },
  { sourceId: "running-dog", targetId: "fast" },
];

function buildWordStages(topic: {
  choose: Grade1ChoiceItem[];
  challengeQuestions: Grade1LessonStage["questions"];
  definition: string;
  id: WordKingdomTopicId;
  items?: Grade1WordItem[];
  lookInstruction: string;
  matchPairs?: Grade1MatchPair[];
  objective: string;
  pairs?: Grade1WordPair[];
  playApplyInstruction: string;
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
    pairs: topic.pairs,
    shortDefinition: topic.definition,
    title: topic.title,
    worldId: GRADE1_WORD_KINGDOM_WORLD_ID,
    stages: [
      stage({
        activityType: "observe",
        id: "look",
        instruction: topic.lookInstruction,
        items: topic.items,
        pairs: topic.pairs,
        progressIndex: 1,
        stageLabel: "LOOK",
        title: topic.title,
      }),
      stage({
        activityType: "carousel",
        id: "tap",
        instruction: topic.tapInstruction,
        items: topic.items,
        pairs: topic.pairs,
        progressIndex: 2,
        stageLabel: "TAP",
        title: topic.title,
      }),
      stage({
        activityType: "singleChoice",
        choices: topic.tryChoices,
        id: "try",
        instruction: "Tap the answer.",
        progressIndex: 3,
        prompt: topic.tryPrompt,
        stageLabel: "TRY",
        title: "We learn",
      }),
      stage({
        activityType: topic.choose.filter((item) => item.isCorrect).length > 1 ? "multiSelect" : "singleChoice",
        choices: topic.choose,
        correctAnswerIds: topic.choose.filter((item) => item.isCorrect).map((item) => item.id),
        id: "choose",
        instruction: "Choose the answer.",
        progressIndex: 4,
        prompt: topic.id === "noun" ? "Find the nouns." : topic.id === "action-words" ? "Find the action words." : topic.id === "describing-words" ? "Find the describing words." : "Choose the answer.",
        stageLabel: "CHOOSE",
        title: "CHOOSE",
      }),
      stage({
        activityType: "liveArrowMatch",
        id: "play-match",
        instruction: "Match the words.",
        items: topic.items,
        matchPairs: topic.matchPairs,
        pairs: topic.pairs,
        progressIndex: 5,
        stageLabel: "PLAY",
        title: "Match",
      }),
      stage({
        activityType: topic.id === "noun" || topic.id === "word-challenge" ? "categorySort" : topic.id.includes("words") && !topic.items ? "memoryMatch" : "sentenceComplete",
        id: "play-apply",
        instruction: topic.playApplyInstruction,
        items: topic.items,
        pairs: topic.pairs,
        progressIndex: 6,
        stageLabel: "PLAY",
        title: "Use words",
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
        instruction: "Great work.",
        progressIndex: 8,
        reward: topic.reward,
        stageLabel: "REWARD",
        title: "Reward",
      }),
    ],
  };
}

export const grade1WordKingdomTopics: Grade1LessonTopic[] = [
  buildWordStages({
    id: "noun",
    title: "Noun",
    definition: "A noun is a name.",
    objective: "Name a person, animal, place, or thing.",
    items: nounItems,
    lookInstruction: "Look at the nouns.",
    tapInstruction: "Tap each noun.",
    tryPrompt: "A noun is a name of a...",
    tryChoices: [
      choice("person-animal-place-thing", "person, animal, place, or thing", true),
      choice("action-word", "word that shows action"),
    ],
    choose: [
      choice("run", "run"),
      choice("dog", "dog", true, "word.noun.dog"),
      choice("school", "school", true, "word.noun.school"),
      choice("read", "read"),
    ],
    matchPairs: nounMatches,
    playApplyInstruction: "Sort each noun.",
    challengeQuestions: [
      { activityType: "singleChoice", choices: [choice("dog", "dog", true), choice("run", "run")], correctAnswerIds: ["dog"], id: "noun-q1", prompt: "Which word is a noun?" },
      { activityType: "singleChoice", choices: [choice("school", "school", true), choice("jump", "jump")], correctAnswerIds: ["school"], id: "noun-q2", prompt: "Which picture shows a place?" },
      { activityType: "multiSelect", choices: [choice("boy", "boy", true), choice("dog", "dog", true), choice("run", "run"), choice("read", "read")], correctAnswerIds: ["boy", "dog"], id: "noun-q3", prompt: "Tap all nouns." },
      { activityType: "liveArrowMatch", id: "noun-q4", matchPairs: [{ sourceId: "dog", targetId: "animal-noun" }], prompt: "Match dog to Animal Noun." },
      { activityType: "sentenceComplete", choices: [choice("ball", "ball", true), choice("run", "run")], correctAnswerIds: ["ball"], id: "noun-q5", prompt: "The ___ is a thing." },
    ],
    reward: { badgeName: "Noun Finder", stars: 3, xp: 20 },
  }),
  buildWordStages({
    id: "action-words",
    title: "Action Words",
    definition: "Action words tell what we do.",
    objective: "Recognize run, jump, write, and read as actions.",
    items: actionItems,
    lookInstruction: "Look at action words.",
    tapInstruction: "Tap each action.",
    tryPrompt: "An action word tells...",
    tryChoices: [choice("does", "what someone does", true), choice("thing-name", "the name of a thing")],
    choose: [choice("run", "run", true), choice("dog", "dog"), choice("read", "read", true), choice("ball", "ball")],
    matchPairs: actionMatches,
    playApplyInstruction: "Complete the sentence.",
    challengeQuestions: [
      { activityType: "singleChoice", choices: [choice("jump", "jump", true), choice("dog", "dog")], correctAnswerIds: ["jump"], id: "action-q1", prompt: "Which word shows action?" },
      { activityType: "singleChoice", choices: [choice("read", "read", true), choice("book", "book")], correctAnswerIds: ["read"], id: "action-q2", prompt: "Choose the action word." },
      { activityType: "liveArrowMatch", id: "action-q3", matchPairs: [{ sourceId: "run-picture", targetId: "run" }], prompt: "Match picture to action." },
      { activityType: "sentenceComplete", choices: [choice("read", "read", true), choice("dog", "dog")], correctAnswerIds: ["read"], id: "action-q4", prompt: "I can ___ a book." },
      { activityType: "multiSelect", choices: [choice("run", "run", true), choice("write", "write", true), choice("dog", "dog"), choice("ball", "ball")], correctAnswerIds: ["run", "write"], id: "action-q5", prompt: "Tap all action words." },
    ],
    reward: { badgeName: "Action Hero", stars: 3, xp: 20 },
  }),
  buildWordStages({
    id: "describing-words",
    title: "Describing Words",
    definition: "Describing words tell what something is like.",
    objective: "Use simple describing words with pictures.",
    items: describingItems,
    lookInstruction: "Look at describing words.",
    tapInstruction: "Tap each describing word.",
    tryPrompt: "A describing word tells...",
    tryChoices: [choice("like", "what something is like", true), choice("person-name", "only a person's name")],
    choose: [choice("happy", "happy", true), choice("dog", "dog"), choice("run", "run"), choice("big", "big", true)],
    matchPairs: describingMatches,
    playApplyInstruction: "Complete the sentence.",
    challengeQuestions: [
      { activityType: "singleChoice", choices: [choice("big", "big", true), choice("run", "run")], correctAnswerIds: ["big"], id: "describe-q1", prompt: "Which word describes the ball?" },
      { activityType: "singleChoice", choices: [choice("happy", "happy", true), choice("dog", "dog")], correctAnswerIds: ["happy"], id: "describe-q2", prompt: "Choose the describing word." },
      { activityType: "sentenceComplete", choices: [choice("bright", "bright", true), choice("jump", "jump")], correctAnswerIds: ["bright"], id: "describe-q3", prompt: "The sun is ___." },
      { activityType: "liveArrowMatch", id: "describe-q4", matchPairs: [{ sourceId: "smile", targetId: "happy" }], prompt: "Match happy to smiling child." },
      { activityType: "multiSelect", choices: [choice("big", "big", true), choice("bright", "bright", true), choice("dog", "dog"), choice("run", "run")], correctAnswerIds: ["big", "bright"], id: "describe-q5", prompt: "Tap all describing words." },
    ],
    reward: { badgeName: "Describing Star", stars: 3, xp: 20 },
  }),
  buildWordStages({
    id: "opposite-words",
    title: "Opposite Words",
    definition: "Opposite words are different.",
    objective: "Match words with different meanings.",
    pairs: oppositePairs,
    lookInstruction: "Look at opposite pairs.",
    tapInstruction: "Tap each pair.",
    tryPrompt: "Big and Small are...",
    tryChoices: [choice("opposites", "opposites", true), choice("same", "the same")],
    choose: [choice("slow", "slow", true), choice("quick", "quick"), choice("happy", "happy")],
    matchPairs: oppositePairs.map((pair) => ({ sourceId: pair.left.toLowerCase(), targetId: pair.right.toLowerCase() })),
    playApplyInstruction: "Find the matching opposite.",
    challengeQuestions: [
      { activityType: "singleChoice", choices: [choice("sad", "sad", true), choice("glad", "glad")], correctAnswerIds: ["sad"], id: "opposite-q1", prompt: "What is the opposite of Happy?" },
      { activityType: "singleChoice", choices: [choice("cold", "cold", true), choice("warm", "warm")], correctAnswerIds: ["cold"], id: "opposite-q2", prompt: "What is the opposite of Hot?" },
      { activityType: "liveArrowMatch", id: "opposite-q3", matchPairs: [{ sourceId: "fast", targetId: "slow" }], prompt: "Match Fast to Slow." },
      { activityType: "singleChoice", choices: [choice("down", "down", true), choice("start", "start")], correctAnswerIds: ["down"], id: "opposite-q4", prompt: "Choose the opposite of Up." },
      { activityType: "sentenceComplete", choices: [choice("opposite", "opposite", true), choice("similar", "similar")], correctAnswerIds: ["opposite"], id: "opposite-q5", prompt: "Big and Small are ___ words." },
    ],
    reward: { badgeName: "Opposite Master", stars: 4, xp: 25 },
  }),
  buildWordStages({
    id: "similar-words",
    title: "Similar Words",
    definition: "Similar words are almost the same.",
    objective: "Match words that mean almost the same.",
    pairs: similarPairs,
    lookInstruction: "Look at similar word pairs.",
    tapInstruction: "Tap each pair.",
    tryPrompt: "Big and Large are...",
    tryChoices: [choice("similar", "similar words", true), choice("opposite", "opposite words")],
    choose: [choice("tiny", "tiny", true), choice("hot", "hot"), choice("sad", "sad")],
    matchPairs: similarPairs.map((pair) => ({ sourceId: pair.left.toLowerCase(), targetId: pair.right.toLowerCase() })),
    playApplyInstruction: "Find the matching similar word.",
    challengeQuestions: [
      { activityType: "singleChoice", choices: [choice("start", "start", true), choice("stop", "stop")], correctAnswerIds: ["start"], id: "similar-q1", prompt: "Which word means almost the same as Begin?" },
      { activityType: "singleChoice", choices: [choice("glad", "glad", true), choice("sad", "sad")], correctAnswerIds: ["glad"], id: "similar-q2", prompt: "Which word means almost the same as Happy?" },
      { activityType: "liveArrowMatch", id: "similar-q3", matchPairs: [{ sourceId: "big", targetId: "large" }], prompt: "Match Big to Large." },
      { activityType: "singleChoice", choices: [choice("quick", "quick", true), choice("slow", "slow")], correctAnswerIds: ["quick"], id: "similar-q4", prompt: "Choose the similar word for Fast." },
      { activityType: "sentenceComplete", choices: [choice("same", "same", true), choice("opposite", "opposite")], correctAnswerIds: ["same"], id: "similar-q5", prompt: "Similar words mean almost the ___." },
    ],
    reward: { badgeName: "Similar Word Buddy", stars: 4, xp: 25 },
  }),
  buildWordStages({
    id: "word-challenge",
    title: "Word Challenge",
    definition: "Review Word Kingdom words.",
    objective: "Review nouns, actions, descriptions, opposites, and similar words.",
    items: [...nounItems, ...actionItems, ...describingItems],
    pairs: [...oppositePairs, ...similarPairs],
    lookInstruction: "Let's review Word Kingdom.",
    tapInstruction: "Tap each review card.",
    tryPrompt: "Run is a...",
    tryChoices: [choice("noun", "noun"), choice("action-word", "action word", true), choice("describing-word", "describing word")],
    choose: [choice("boy", "boy", true), choice("dog", "dog", true), choice("run", "run"), choice("happy", "happy")],
    matchPairs: [
      { sourceId: "big", targetId: "small" },
      { sourceId: "happy", targetId: "glad" },
      { sourceId: "fast", targetId: "slow" },
      { sourceId: "begin", targetId: "start" },
    ],
    playApplyInstruction: "Sort the words.",
    challengeQuestions: [
      { activityType: "singleChoice", choices: [choice("dog", "dog", true), choice("run", "run")], correctAnswerIds: ["dog"], id: "challenge-q1", prompt: "Which word is a noun?" },
      { activityType: "singleChoice", choices: [choice("jump", "jump", true), choice("ball", "ball")], correctAnswerIds: ["jump"], id: "challenge-q2", prompt: "Which word is an action word?" },
      { activityType: "singleChoice", choices: [choice("bright", "bright", true), choice("school", "school")], correctAnswerIds: ["bright"], id: "challenge-q3", prompt: "Which word describes something?" },
      { activityType: "singleChoice", choices: [choice("cold", "cold", true), choice("large", "large")], correctAnswerIds: ["cold"], id: "challenge-q4", prompt: "What is the opposite of Hot?" },
      { activityType: "singleChoice", choices: [choice("large", "large", true), choice("small", "small")], correctAnswerIds: ["large"], id: "challenge-q5", prompt: "What is similar to Big?" },
      { activityType: "categorySort", correctAnswerIds: ["noun"], id: "challenge-q6", prompt: "Sort dog." },
      { activityType: "categorySort", correctAnswerIds: ["action-word"], id: "challenge-q7", prompt: "Sort jump." },
      { activityType: "sentenceComplete", choices: [choice("bright", "bright", true), choice("slow", "slow")], correctAnswerIds: ["bright"], id: "challenge-q8", prompt: "The sun is ___." },
      { activityType: "liveArrowMatch", id: "challenge-q9", matchPairs: [{ sourceId: "happy", targetId: "sad" }], prompt: "Match Happy to Sad." },
      { activityType: "liveArrowMatch", id: "challenge-q10", matchPairs: [{ sourceId: "begin", targetId: "start" }], prompt: "Match Begin to Start." },
    ],
    reward: { badgeName: "Word Kingdom Champion", stars: 10, unlocksWorldId: "grade1-reading", xp: 50 },
  }),
];

export const wordKingdomTopicSummaries = grade1WordKingdomTopics.map((topic) => ({
  id: topic.id as WordKingdomTopicId,
  objective: topic.objective,
  shortDefinition: topic.shortDefinition,
  title: topic.title,
}));

export function getWordKingdomTopic(topicIdOrTitle: string) {
  const normalized = topicIdOrTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return grade1WordKingdomTopics.find((topic) => topic.id === normalized || topic.title.toLowerCase() === topicIdOrTitle.trim().toLowerCase());
}

export function getWordKingdomStages(topicIdOrTitle: string) {
  return getWordKingdomTopic(topicIdOrTitle)?.stages ?? [];
}
