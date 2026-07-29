import { StudyBuddyTheme } from "@/constants/theme";
import type {
  CurriculumQuizLevel,
  QuizCategoryMeta,
  QuizPreset,
  QuizQuestionInteractionType,
} from "@/src/data/quiz/types";
import { withQuizContentStudyRequirements } from "@/src/data/quiz/study-requirements";
import { VOCABULARY_ITEMS, type VocabularyItem } from "@/src/data/vocabulary";

const MAX_CURRICULUM_LEVEL = 15;
const QUESTIONS_PER_QUIZ = 10;
const MAX_SUPPLEMENTAL_QUESTION_ATTEMPTS = 8;

const LEVEL_2_WORDS = [
  "apple",
  "ant",
  "ball",
  "book",
  "cat",
  "dog",
  "fish",
  "bird",
  "cow",
  "goat",
];
const LEVEL_3_WORDS = [
  "dog",
  "fish",
  "bird",
  "cow",
  "goat",
  "horse",
  "cat",
  "rabbit",
  "duck",
  "sheep",
];
const LEVEL_4_WORDS = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];
const LEVEL_5_WORDS = [
  "school",
  "teacher",
  "pencil",
  "paper",
  "table",
  "chair",
  "crayon",
  "book",
  "backpack",
  "glue",
];
const LEVEL_6_WORDS = [
  "hello",
  "goodbye",
  "please",
  "thank you",
  "yes",
  "no",
  "speak",
  "tell",
  "share",
  "question",
];
const LEVEL_7_WORDS = [
  "run",
  "walk",
  "eat",
  "drink",
  "read",
  "write",
  "listen",
  "repeat",
  "respond",
  "answer",
];
const LEVEL_8_WORDS = [
  "red",
  "blue",
  "green",
  "big",
  "small",
  "fast",
  "slow",
  "faster",
  "slower",
  "same speed",
];
const LEVEL_9_WORDS = [
  "more",
  "less",
  "total",
  "count",
  "add",
  "subtract",
  "left",
  "compare",
  "sum",
  "one less",
];
const LEVEL_10_WORDS = [
  "compare",
  "describe",
  "explain",
  "identify",
  "classify",
  "sort",
  "match",
  "estimate",
  "exact",
  "detail",
];
const LEVEL_11_WORDS = [
  "whisper",
  "echo",
  "sound",
  "listen",
  "repeat",
  "speak",
  "tell",
  "respond",
  "question",
  "share",
];
const LEVEL_12_WORDS = [
  "speak",
  "tell",
  "share",
  "question",
  "respond",
  "whisper",
  "echo",
  "listen",
  "repeat",
  "sound",
];
const LEVEL_13_WORDS = [
  "because",
  "before",
  "after",
  "under",
  "over",
  "around",
  "through",
  "across",
  "above",
  "below",
];
const LEVEL_14_WORDS = [
  "story",
  "title",
  "sentence",
  "answer",
  "detail",
  "because",
  "before",
  "after",
  "explain",
  "describe",
];
const LEVEL_2_NUMERIC_WORDS = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];
const LEVEL_3_NUMERIC_WORDS = [
  "circle",
  "square",
  "triangle",
  "rectangle",
  "oval",
  "star",
  "heart",
  "diamond",
  "cube",
  "cone",
];
const LEVEL_5_NUMERIC_WORDS = [
  "add",
  "plus",
  "sum",
  "total",
  "count on",
  "altogether",
  "combine",
  "addend",
  "equation",
  "number sentence",
];
const LEVEL_6_NUMERIC_WORDS = [
  "subtract",
  "one less",
  "left",
  "less than",
  "compare",
  "minus sign",
  "difference",
  "take away",
  "fewer",
  "more",
];
const LEVEL_7_NUMERIC_WORDS = [
  "shape pattern",
  "next",
  "order",
  "before",
  "after",
  "between",
  "first",
  "last",
  "middle",
  "repeat",
];
const LEVEL_8_NUMERIC_WORDS = [
  "equal group",
  "row",
  "column",
  "count by twos",
  "pair",
  "set",
  "group",
  "each",
  "every",
  "array",
];
const LEVEL_9_NUMERIC_WORDS = [
  "more",
  "less",
  "total",
  "add",
  "subtract",
  "sum",
  "left",
  "difference",
  "compare",
  "equation",
];
const LEVEL_10_NUMERIC_WORDS = [
  "compare",
  "estimate",
  "exact count",
  "same number",
  "more than",
  "less than",
  "equal to",
  "closest guess",
  "farthest guess",
  "order by amount",
];
const LEVEL_11_NUMERIC_WORDS = [
  "longer",
  "shorter",
  "taller",
  "wider",
  "exact measure",
  "length",
  "height",
  "width",
  "measure",
  "measurement",
];
const LEVEL_12_NUMERIC_WORDS = [
  "ones",
  "tens",
  "bundle of ten",
  "teen number",
  "digit",
  "numeral",
  "place value",
  "ten frame",
  "twenty",
  "zero",
];
const LEVEL_13_NUMERIC_WORDS = [
  "half full",
  "whole",
  "part of set",
  "equal to",
  "half",
  "part",
  "balance",
  "same amount",
  "equal group",
  "pair",
];
const LEVEL_14_NUMERIC_WORDS = [
  "start time",
  "end time",
  "data row",
  "data column",
  "tally compare",
  "earlier",
  "later",
  "tally",
  "more votes",
  "fewer votes",
];

function getTargetQuizCountForLevel(level: number) {
  return level * 2;
}

function withSequentialLevelGate(level: CurriculumQuizLevel): CurriculumQuizLevel {
  if (level.id <= 1) {
    return level;
  }

  const previousLevel = level.id - 1;
  const existingLevelRequirements =
    level.unlockRequirements?.requiredCompletedQuizCountByLevel ?? {};
  const existingRequiredCount = existingLevelRequirements[previousLevel] ?? 0;

  return {
    ...level,
    unlockRequirements: {
      ...level.unlockRequirements,
      requiredCompletedQuizCountByLevel: {
        ...existingLevelRequirements,
        [previousLevel]: Math.max(
          existingRequiredCount,
          getTargetQuizCountForLevel(previousLevel)
        ),
      },
    },
  };
}

export const CURRICULUM_QUIZ_LEVELS: CurriculumQuizLevel[] = ([
  {
    id: 1,
    title: "Basic Word Recognition",
    focus: "Simple vocabulary, image-to-word recognition, and easy multiple choice",
    summary: "The first curriculum step is open by default so learners can begin exploring.",
  },
  {
    id: 2,
    title: "Letter-Based Vocabulary",
    focus: "Letter recognition and familiar Play words",
    summary: "Learners use early letter clues to connect words, images, and meanings.",
    unlockRequirements: {
      requiredViewedSpecificWords: LEVEL_2_WORDS,
      requiredCompletedQuizIds: ["level-1-starter-quiz"],
      requiredMinimumScores: {
        "level-1-starter-quiz": 70,
      },
    },
  },
  {
    id: 3,
    title: "Category Vocabulary",
    focus: "Animals and grouped vocabulary sets",
    summary: "Learners sort and recognize words by category after stronger letter practice.",
    unlockRequirements: {
      requiredViewedSpecificWords: LEVEL_3_WORDS,
      requiredCompletedQuizCountByLevel: {
        2: 2,
      },
      requiredAverageScoreByLevel: {
        2: 75,
      },
    },
  },
  {
    id: 4,
    title: "Numeric Vocabulary",
    focus: "Number words, matching, and early quantity language",
    summary: "Learners unlock number-word practice by viewing exact counting vocabulary.",
    unlockRequirements: {
      requiredViewedSpecificWords: LEVEL_4_WORDS,
      requiredCompletedQuizIds: ["number-match-1-10"],
      requiredMinimumScores: {
        "number-match-1-10": 75,
      },
    },
  },
  {
    id: 5,
    title: "Spelling and Recall",
    focus: "School words, memory, and stronger recall",
    summary: "Learners build recall with school vocabulary, spelling, and repeated language practice.",
    unlockRequirements: {
      requiredViewedSpecificWords: LEVEL_5_WORDS,
      requiredCompletedQuizCountByCategory: {
        linguistic: 3,
      },
      requiredQuizTypeMinimumScores: {
        spelling: 80,
      },
    },
  },
  {
    id: 6,
    title: "Listening and Speaking",
    focus: "Audio recognition, listening, and speech practice",
    summary: "Learners move into speaking after finishing one listening quiz and one speech quiz.",
    unlockRequirements: {
      requiredViewedSpecificWords: LEVEL_6_WORDS,
      requiredCompletedQuizCountByType: {
        "text-to-speech": 1,
        "speech-to-text": 1,
      },
      requiredMinimumScores: {
        "speech-echo-1": 75,
      },
    },
  },
  {
    id: 7,
    title: "Sentence Building",
    focus: "Simple action words and early sentence creation",
    summary: "Learners combine familiar verbs into meaningful beginner sentences.",
    unlockRequirements: {
      requiredViewedSpecificWords: LEVEL_7_WORDS,
      requiredCompletedQuizIds: ["sentence-builder-beginner"],
      requiredMasteryByCategory: {
        linguistic: 80,
      },
    },
  },
  {
    id: 8,
    title: "Mixed Comprehension",
    focus: "Color, size, speed, and mixed-domain understanding",
    summary: "Learners combine vocabulary and number thinking after strong progress in both areas.",
    unlockRequirements: {
      requiredLevel: 7,
      requiredViewedSpecificWords: LEVEL_8_WORDS,
      requiredCompletedQuizCountByCategory: {
        numeric: 2,
        linguistic: 2,
      },
    },
  },
  {
    id: 9,
    title: "Applied Word Problems",
    focus: "Math language inside short stories and applied tasks",
    summary: "Learners solve small word problems after building mixed comprehension.",
    unlockRequirements: {
      requiredViewedSpecificWords: LEVEL_9_WORDS,
      requiredCompletedQuizIds: ["mixed-challenge-1"],
      requiredAverageScoreByCategory: {
        mixed: 80,
      },
    },
  },
  {
    id: 10,
    title: "Mastery Level",
    focus: "Explanation, comparison, and full curriculum confidence",
    summary: "Learners unlock mastery after finishing Level 9 work, earning badges, and showing strong overall mastery.",
    unlockRequirements: {
      requiredViewedSpecificWords: LEVEL_10_WORDS,
      requiredCompletedQuizIds: ["word-problem-1", "word-problem-2"],
      requiredOverallMastery: 85,
      requiredBadgeCount: 10,
    },
  },
  {
    id: 11,
    title: "Advanced Listening",
    focus: "Longer listening prompts and careful audio attention",
    summary: "Optional advanced listening content for learners who want a deeper challenge.",
    isAdvanced: true,
    unlockRequirements: {
      requiredLevel: 10,
      requiredViewedSpecificWords: LEVEL_11_WORDS,
      requiredCompletedQuizCountByType: {
        "text-to-speech": 2,
      },
      requiredAverageScoreByType: {
        "text-to-speech": 80,
      },
    },
  },
  {
    id: 12,
    title: "Advanced Speaking",
    focus: "Clear oral responses and expressive language",
    summary: "Optional advanced speaking content built on repeated speech practice.",
    isAdvanced: true,
    unlockRequirements: {
      requiredLevel: 11,
      requiredViewedSpecificWords: LEVEL_12_WORDS,
      requiredCompletedQuizCountByType: {
        "speech-to-text": 2,
      },
      requiredAverageScoreByType: {
        "speech-to-text": 80,
      },
    },
  },
  {
    id: 13,
    title: "Grammar and Context",
    focus: "Cause, order, and position words in context",
    summary: "Optional grammar practice helps learners read and build more precise sentences.",
    isAdvanced: true,
    unlockRequirements: {
      requiredLevel: 12,
      requiredViewedSpecificWords: LEVEL_13_WORDS,
      requiredCompletedQuizIds: ["sentence-builder-beginner", "sentence-context-1"],
      requiredMasteryByCategory: {
        linguistic: 82,
      },
    },
  },
  {
    id: 14,
    title: "Reading Comprehension",
    focus: "Stories, details, and reading-for-meaning",
    summary: "Optional reading practice turns sentence work into short comprehension tasks.",
    isAdvanced: true,
    unlockRequirements: {
      requiredLevel: 13,
      requiredViewedSpecificWords: LEVEL_14_WORDS,
      requiredCompletedQuizIds: ["grammar-context-1", "word-problem-2"],
      requiredMasteryByCategory: {
        mixed: 82,
      },
    },
  },
  {
    id: 15,
    title: "Final Boss Mastery",
    focus: "Boss-level review across listening, speaking, grammar, and comprehension",
    summary: "Optional final boss content rewards deep practice across the full learning path.",
    isAdvanced: true,
    unlockRequirements: {
      requiredLevel: 14,
      requiredViewedSpecificWords: LEVEL_10_WORDS,
      requiredCompletedQuizIds: [
        "advanced-listening-1",
        "advanced-speaking-1",
        "grammar-context-1",
        "reading-comprehension-1",
      ],
      requiredOverallMastery: 90,
      requiredBadgeCount: 15,
      requiredStreakDays: 7,
    },
  },
] as CurriculumQuizLevel[]).map(withSequentialLevelGate);

export const QUIZ_CATEGORY_META: Record<
  "numeric" | "linguistic" | "mixed",
  QuizCategoryMeta
> = {
  linguistic: {
    label: "Linguistic",
    description:
      "Vocabulary, spelling, pronunciation, sentence building, grammar, and meaning.",
    accentColor: StudyBuddyTheme.colors.secondary,
    icon: "library-outline",
  },
  numeric: {
    label: "Numeric",
    description:
      "Number recognition, counting, sequence, quantity, operations, and reasoning.",
    accentColor: StudyBuddyTheme.colors.accent,
    icon: "calculator-outline",
  },
  mixed: {
    label: "Mixed",
    description:
      "Combined word, number, story, image, and multi-step comprehension.",
    accentColor: StudyBuddyTheme.colors.primary,
    icon: "sparkles-outline",
  },
};

const BASE_QUIZ_PRESETS: QuizPreset[] = [
  {
    id: "level-1-starter-quiz",
    title: "Preschool Picture Word Practice",
    description: "Practice picture-supported word recognition for the current Play path.",
    category: "linguistic",
    quizType: "image-to-word",
    curriculumLevel: 1,
    difficulty: "beginner",
    unlockRequirements: {
      requiredLevel: 1,
      requiredViewedSpecificWords: LEVEL_2_WORDS,
    },
    rewards: { xp: 18, unlockMessage: "Picture word practice is ready." },
    questions: [
      {
        id: "level-1-starter-1",
        type: "multipleChoice",
        prompt: "Which word names something you can read?",
        options: ["book", "cat", "ant", "apple"],
        answer: "book",
      },
      {
        id: "level-1-starter-2",
        type: "imageChoice",
        prompt: "Tap the word for a round toy.",
        imageLabel: "A child holding a ball",
        options: ["book", "ball", "apple", "cat"],
        answer: "ball",
      },
      {
        id: "level-1-starter-3",
        type: "trueFalse",
        prompt: "True or false: An ant is an animal.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: "number-match-1-10",
    title: "Number Match 1-10 Quiz",
    description: "Practice matching number words, numerals, and small groups up to ten.",
    category: "numeric",
    quizType: "number-matching",
    curriculumLevel: 1,
    difficulty: "beginner",
    unlockRequirements: {
      requiredLevel: 1,
      requiredViewedSpecificWords: LEVEL_4_WORDS,
    },
    rewards: { xp: 18, unlockMessage: "Level 1 number practice is ready." },
    questions: [
      {
        id: "number-match-1",
        type: "multipleChoice",
        prompt: "Which number word matches 4?",
        options: ["three", "four", "five", "six"],
        answer: "four",
      },
      {
        id: "number-match-2",
        type: "imageChoice",
        prompt: "How many stars are shown? * * * * *",
        options: ["three", "four", "five", "six"],
        answer: "five",
      },
      {
        id: "number-match-3",
        type: "trueFalse",
        prompt: "True or false: Ten is greater than seven.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: "letter-vocabulary-1",
    title: "Letter Vocabulary 1",
    description: "Use beginning letters to match simple words with meaning and pictures.",
    category: "linguistic",
    quizType: "matching-type",
    curriculumLevel: 2,
    difficulty: "easy",
    unlockRequirements: {
      requiredLevel: 2,
      requiredViewedSpecificWords: LEVEL_2_WORDS,
      requiredCompletedQuizIds: ["level-1-starter-quiz"],
      requiredMinimumScores: {
        "level-1-starter-quiz": 70,
      },
    },
    rewards: { xp: 22 },
    questions: [
      {
        id: "letter-vocabulary-1-a",
        type: "multipleChoice",
        prompt: "Which word starts with the same letter as apple?",
        options: ["ant", "ball", "cat", "book"],
        answer: "ant",
      },
      {
        id: "letter-vocabulary-1-b",
        type: "matching",
        prompt: "Match each Play word to its clue.",
        answer: "apple=>fruit|ant=>tiny animal|book=>something to read",
        pairs: [
          { left: "apple", right: "fruit" },
          { left: "ant", right: "tiny animal" },
          { left: "book", right: "something to read" },
        ],
      },
      {
        id: "letter-vocabulary-1-c",
        type: "multipleChoice",
        prompt: "Which word names an animal with the letter C?",
        options: ["cat", "book", "ball", "apple"],
        answer: "cat",
      },
    ],
  },
  {
    id: "letter-vocabulary-2",
    title: "Letter Vocabulary 2",
    description: "Keep practicing early letter clues with familiar Play words.",
    category: "linguistic",
    quizType: "fill-in-the-blank",
    curriculumLevel: 2,
    difficulty: "easy",
    unlockRequirements: {
      requiredLevel: 2,
      requiredViewedSpecificWords: LEVEL_2_WORDS,
      requiredCompletedQuizIds: ["level-1-starter-quiz"],
      requiredMinimumScores: {
        "level-1-starter-quiz": 70,
      },
    },
    rewards: { xp: 22 },
    questions: [
      {
        id: "letter-vocabulary-2-a",
        type: "fillBlank",
        prompt: "Fill the missing letter: b_ll",
        options: ["a", "e", "i", "o"],
        answer: "a",
      },
      {
        id: "letter-vocabulary-2-b",
        type: "multipleChoice",
        prompt: "Which word starts with A?",
        options: ["ball", "apple", "cat", "book"],
        answer: "apple",
      },
      {
        id: "letter-vocabulary-2-c",
        type: "trueFalse",
        prompt: "True or false: Book starts with B.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: "animal-match-1",
    title: "Animal Match 1",
    description: "Recognize and sort familiar animal words by category.",
    category: "linguistic",
    quizType: "matching-type",
    curriculumLevel: 3,
    difficulty: "medium",
    unlockRequirements: {
      requiredLevel: 3,
      requiredViewedSpecificWords: ["dog", "cat", "bird", "fish", "cow"],
      requiredCompletedQuizIds: ["letter-vocabulary-1"],
      requiredMinimumScores: {
        "letter-vocabulary-1": 75,
      },
    },
    rewards: { xp: 24 },
    questions: [
      {
        id: "animal-match-1-a",
        type: "multipleChoice",
        prompt: "Which word names something that can swim?",
        options: ["cow", "fish", "goat", "horse"],
        answer: "fish",
      },
      {
        id: "animal-match-1-b",
        type: "matching",
        prompt: "Match each animal to its clue.",
        answer: "fish=>can swim|cow=>farm animal|bird=>has wings",
        pairs: [
          { left: "fish", right: "can swim" },
          { left: "cow", right: "farm animal" },
          { left: "bird", right: "has wings" },
        ],
      },
      {
        id: "animal-match-1-c",
        type: "trueFalse",
        prompt: "True or false: A bird can have wings.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: "category-vocabulary-1",
    title: "Category Vocabulary 1",
    description: "Use animal categories and clues to deepen vocabulary grouping skills.",
    category: "linguistic",
    quizType: "definition-matching",
    curriculumLevel: 3,
    difficulty: "medium",
    unlockRequirements: {
      requiredLevel: 3,
      requiredViewedSpecificWords: LEVEL_3_WORDS,
      requiredCompletedQuizCountByLevel: {
        2: 2,
      },
      requiredAverageScoreByLevel: {
        2: 75,
      },
    },
    rewards: { xp: 24 },
    questions: [
      {
        id: "category-vocabulary-1-a",
        type: "multipleChoice",
        prompt: "Which word belongs with farm animals?",
        options: ["horse", "book", "apple", "paper"],
        answer: "horse",
      },
      {
        id: "category-vocabulary-1-b",
        type: "fillBlank",
        prompt: "A ___ can jump and say baa.",
        options: ["sheep", "goat", "chair", "ant"],
        answer: "goat",
      },
      {
        id: "category-vocabulary-1-c",
        type: "multipleChoice",
        prompt: "Which word names something with feathers?",
        options: ["cow", "bird", "dog", "horse"],
        answer: "bird",
      },
    ],
  },
  {
    id: "number-word-1-10",
    title: "Number Word 1-10",
    description: "Convert small numerals into number words with confidence.",
    category: "numeric",
    quizType: "number-to-word",
    curriculumLevel: 4,
    difficulty: "medium",
    unlockRequirements: {
      requiredLevel: 4,
      requiredViewedSpecificWords: LEVEL_4_WORDS,
      requiredCompletedQuizIds: ["number-match-1-10"],
      requiredMinimumScores: {
        "number-match-1-10": 75,
      },
    },
    rewards: { xp: 26 },
    questions: [
      {
        id: "number-word-1-10-a",
        type: "multipleChoice",
        prompt: "Which word matches 8?",
        options: ["six", "seven", "eight", "nine"],
        answer: "eight",
      },
      {
        id: "number-word-1-10-b",
        type: "fillBlank",
        prompt: "Choose the word for 2.",
        options: ["one", "two", "three", "four"],
        answer: "two",
      },
      {
        id: "number-word-1-10-c",
        type: "trueFalse",
        prompt: "True or false: Nine comes before ten.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: "spelling-recall-1",
    title: "Spelling Recall 1",
    description: "Practice spelling and recalling school and classroom vocabulary.",
    category: "linguistic",
    quizType: "spelling",
    curriculumLevel: 4,
    difficulty: "medium",
    unlockRequirements: {
      requiredLevel: 4,
      requiredViewedSpecificWords: LEVEL_5_WORDS,
      requiredCompletedQuizIds: ["category-vocabulary-1"],
      requiredCompletedQuizCountByCategory: {
        linguistic: 3,
      },
    },
    rewards: { xp: 26 },
    questions: [
      {
        id: "spelling-recall-1-a",
        type: "fillBlank",
        prompt: "Fill the missing letter: p_per",
        options: ["a", "e", "i", "o"],
        answer: "a",
      },
      {
        id: "spelling-recall-1-b",
        type: "multipleChoice",
        prompt: "Which word names the person who helps in class?",
        options: ["teacher", "table", "paper", "chair"],
        answer: "teacher",
      },
      {
        id: "spelling-recall-1-c",
        type: "fillBlank",
        prompt: "Choose the correct word: I write with a ___.",
        options: ["pencil", "school", "chair", "paper"],
        answer: "pencil",
      },
    ],
  },
  {
    id: "listening-warmup-1",
    title: "Listening Warmup 1",
    description: "Listen to short polite words and pick the word you hear.",
    category: "linguistic",
    quizType: "text-to-speech",
    curriculumLevel: 5,
    difficulty: "medium",
    unlockRequirements: {
      requiredLevel: 5,
      requiredViewedSpecificWords: LEVEL_6_WORDS,
      requiredCompletedQuizIds: ["spelling-recall-1"],
      requiredQuizTypeMinimumScores: {
        spelling: 80,
      },
    },
    rewards: { xp: 28 },
    questions: [
      {
        id: "listening-warmup-1-a",
        type: "textToSpeech",
        prompt: "Listen, then choose the greeting you heard.",
        audioText: "hello",
        options: ["hello", "goodbye", "please", "yes"],
        answer: "hello",
      },
      {
        id: "listening-warmup-1-b",
        type: "textToSpeech",
        prompt: "Listen, then choose the polite phrase.",
        audioText: "thank you",
        options: ["thank you", "no", "goodbye", "walk"],
        answer: "thank you",
      },
      {
        id: "listening-warmup-1-c",
        type: "multipleChoice",
        prompt: "Which word can answer a yes-or-no question?",
        options: ["please", "yes", "teacher", "paper"],
        answer: "yes",
      },
    ],
  },
  {
    id: "speech-echo-1",
    title: "Speech Echo 1",
    description: "Say short greeting words and simple polite expressions.",
    category: "linguistic",
    quizType: "speech-to-text",
    curriculumLevel: 5,
    difficulty: "medium",
    unlockRequirements: {
      requiredLevel: 5,
      requiredViewedSpecificWords: LEVEL_6_WORDS,
      requiredCompletedQuizIds: ["listening-warmup-1"],
    },
    rewards: { xp: 28, badge: "speech-beginner" },
    questions: [
      {
        id: "speech-echo-1-a",
        type: "speechToText",
        prompt: "Say the word: please",
        answer: "please",
        audioText: "please",
        helperText: "You can type the answer if speech input is unavailable.",
      },
      {
        id: "speech-echo-1-b",
        type: "speechToText",
        prompt: "Say the phrase: thank you",
        answer: "thank you",
        audioText: "thank you",
        helperText: "Speak clearly or type the phrase.",
      },
      {
        id: "speech-echo-1-c",
        type: "multipleChoice",
        prompt: "Which word is a greeting?",
        options: ["hello", "paper", "count", "green"],
        answer: "hello",
      },
    ],
  },
  {
    id: "sentence-builder-beginner",
    title: "Sentence Builder Beginner Quiz",
    description: "Use action words to build short and meaningful beginner sentences.",
    category: "linguistic",
    quizType: "drag-and-drop-sentence",
    curriculumLevel: 6,
    difficulty: "advanced",
    unlockRequirements: {
      requiredLevel: 6,
      requiredViewedSpecificWords: LEVEL_7_WORDS,
      requiredCompletedQuizIds: ["speech-echo-1"],
      requiredMinimumScores: {
        "speech-echo-1": 75,
      },
    },
    rewards: { xp: 30, badge: "sentence-builder" },
    questions: [
      {
        id: "sentence-builder-beginner-a",
        type: "fillBlank",
        prompt: "Choose the action word: I ___ a book.",
        options: ["read", "drink", "walk", "green"],
        answer: "read",
      },
      {
        id: "sentence-builder-beginner-b",
        type: "multipleChoice",
        prompt: "Which word shows an action?",
        options: ["table", "eat", "teacher", "story"],
        answer: "eat",
      },
      {
        id: "sentence-builder-beginner-c",
        type: "fillBlank",
        prompt: "Choose the best word: We ___ to school.",
        options: ["walk", "paper", "please", "cow"],
        answer: "walk",
      },
    ],
  },
  {
    id: "pronunciation-check-1",
    title: "Pronunciation Check 1",
    description: "Repeat familiar action and greeting words with stronger recall.",
    category: "linguistic",
    quizType: "speech-to-text",
    curriculumLevel: 6,
    difficulty: "advanced",
    unlockRequirements: {
      requiredLevel: 6,
      requiredViewedSpecificWords: [...LEVEL_6_WORDS, ...LEVEL_7_WORDS],
      requiredCompletedQuizCountByType: {
        "text-to-speech": 1,
        "speech-to-text": 1,
      },
    },
    rewards: { xp: 30 },
    questions: [
      {
        id: "pronunciation-check-1-a",
        type: "speechToText",
        prompt: "Say the word: read",
        answer: "read",
        audioText: "read",
      },
      {
        id: "pronunciation-check-1-b",
        type: "speechToText",
        prompt: "Say the word: hello",
        answer: "hello",
        audioText: "hello",
      },
      {
        id: "pronunciation-check-1-c",
        type: "multipleChoice",
        prompt: "Which word can you say before leaving?",
        options: ["goodbye", "count", "horse", "green"],
        answer: "goodbye",
      },
    ],
  },
  {
    id: "sentence-context-1",
    title: "Sentence Context 1",
    description: "Choose words that best complete short action sentences.",
    category: "linguistic",
    quizType: "context-sentence",
    curriculumLevel: 7,
    difficulty: "advanced",
    unlockRequirements: {
      requiredLevel: 7,
      requiredViewedSpecificWords: LEVEL_7_WORDS,
      requiredCompletedQuizIds: ["sentence-builder-beginner"],
      requiredMasteryByCategory: {
        linguistic: 80,
      },
    },
    rewards: { xp: 32 },
    questions: [
      {
        id: "sentence-context-1-a",
        type: "multipleChoice",
        prompt: "Choose the best word: We ___ water after we run.",
        options: ["drink", "chair", "green", "horse"],
        answer: "drink",
      },
      {
        id: "sentence-context-1-b",
        type: "fillBlank",
        prompt: "Choose the word that fits: I ___ my name on paper.",
        options: ["write", "walk", "eat", "blue"],
        answer: "write",
      },
      {
        id: "sentence-context-1-c",
        type: "multipleChoice",
        prompt: "Which sentence action belongs in a library?",
        options: ["read", "drink", "run", "slow"],
        answer: "read",
      },
    ],
  },
  {
    id: "mixed-colors-and-size",
    title: "Mixed Colors and Size",
    description: "Mix vocabulary clues with quantity and comparison ideas.",
    category: "mixed",
    quizType: "read-and-count",
    curriculumLevel: 7,
    difficulty: "advanced",
    unlockRequirements: {
      requiredLevel: 7,
      requiredViewedSpecificWords: LEVEL_8_WORDS,
      requiredCompletedQuizCountByCategory: {
        numeric: 2,
        linguistic: 2,
      },
    },
    rewards: { xp: 32, badge: "mixed-thinker" },
    questions: [
      {
        id: "mixed-colors-and-size-a",
        type: "multipleChoice",
        prompt: "Which word means not little?",
        options: ["big", "slow", "blue", "read"],
        answer: "big",
      },
      {
        id: "mixed-colors-and-size-b",
        type: "wordProblem",
        prompt: "There are 2 red balls and 1 blue ball. How many balls are there?",
        options: ["2", "3", "4", "5"],
        answer: "3",
      },
      {
        id: "mixed-colors-and-size-c",
        type: "multipleChoice",
        prompt: "Which word means moving quickly?",
        options: ["fast", "small", "green", "count"],
        answer: "fast",
      },
    ],
  },
  {
    id: "mixed-challenge-1",
    title: "Mixed Challenge 1",
    description: "Combine color, size, and number understanding in short mixed tasks.",
    category: "mixed",
    quizType: "multi-step-challenge",
    curriculumLevel: 8,
    difficulty: "advanced",
    unlockRequirements: {
      requiredLevel: 8,
      requiredViewedSpecificWords: LEVEL_8_WORDS,
      requiredCompletedQuizIds: ["mixed-colors-and-size"],
    },
    rewards: { xp: 36, unlockMessage: "Applied mixed learning is ready." },
    questions: [
      {
        id: "mixed-challenge-1-a",
        type: "wordProblem",
        prompt: "A big box has 4 books. A small box has 2 books. How many books are there in all?",
        options: ["4", "5", "6", "7"],
        answer: "6",
      },
      {
        id: "mixed-challenge-1-b",
        type: "multipleChoice",
        prompt: "Which phrase matches the picture clue '3 red apples'?",
        options: ["three red apples", "one green apple", "five blue balls", "two small books"],
        answer: "three red apples",
      },
      {
        id: "mixed-challenge-1-c",
        type: "trueFalse",
        prompt: "True or false: A fast rabbit can move quicker than a slow turtle.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: "mixed-challenge-2",
    title: "Mixed Challenge 2",
    description: "Use math-language words inside short comparison and counting stories.",
    category: "mixed",
    quizType: "story-comprehension",
    curriculumLevel: 8,
    difficulty: "advanced",
    unlockRequirements: {
      requiredLevel: 8,
      requiredViewedSpecificWords: LEVEL_9_WORDS,
      requiredCompletedQuizIds: ["mixed-challenge-1"],
    },
    rewards: { xp: 36 },
    questions: [
      {
        id: "mixed-challenge-2-a",
        type: "wordProblem",
        prompt: "Lia has 5 beads. She adds 2 more. What is the total?",
        options: ["5", "6", "7", "8"],
        answer: "7",
      },
      {
        id: "mixed-challenge-2-b",
        type: "multipleChoice",
        prompt: "Which word means not as much?",
        options: ["more", "less", "count", "add"],
        answer: "less",
      },
      {
        id: "mixed-challenge-2-c",
        type: "trueFalse",
        prompt: "True or false: To count is to tell how many.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: "word-problem-1",
    title: "Word Problem 1",
    description: "Solve short number stories with exact math-language clues.",
    category: "mixed",
    quizType: "word-problem",
    curriculumLevel: 9,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 9,
      requiredViewedSpecificWords: LEVEL_9_WORDS,
      requiredCompletedQuizIds: ["mixed-challenge-1"],
      requiredAverageScoreByCategory: {
        mixed: 80,
      },
    },
    rewards: { xp: 40 },
    questions: [
      {
        id: "word-problem-1-a",
        type: "wordProblem",
        prompt: "A class has 6 pencils. 2 are taken away. How many pencils are left?",
        options: ["2", "3", "4", "5"],
        answer: "4",
      },
      {
        id: "word-problem-1-b",
        type: "multipleChoice",
        prompt: "Which word tells you to put groups together?",
        options: ["subtract", "add", "less", "slow"],
        answer: "add",
      },
      {
        id: "word-problem-1-c",
        type: "trueFalse",
        prompt: "True or false: Total means the full amount in all.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: "word-problem-2",
    title: "Word Problem 2",
    description: "Apply more, less, add, and subtract in slightly deeper story problems.",
    category: "mixed",
    quizType: "word-problem",
    curriculumLevel: 9,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 9,
      requiredViewedSpecificWords: LEVEL_9_WORDS,
      requiredCompletedQuizIds: ["word-problem-1"],
      requiredAverageScoreByCategory: {
        mixed: 80,
      },
    },
    rewards: { xp: 40 },
    questions: [
      {
        id: "word-problem-2-a",
        type: "wordProblem",
        prompt: "There are 8 crayons. 3 are used. How many are left?",
        options: ["3", "4", "5", "6"],
        answer: "5",
      },
      {
        id: "word-problem-2-b",
        type: "multipleChoice",
        prompt: "Which word means to take away?",
        options: ["count", "more", "subtract", "compare"],
        answer: "subtract",
      },
      {
        id: "word-problem-2-c",
        type: "multipleChoice",
        prompt: "If one pile has 2 blocks and another has 5, which pile has more?",
        options: ["the pile with 2", "the pile with 5", "both are equal", "neither pile"],
        answer: "the pile with 5",
      },
    ],
  },
  {
    id: "mastery-showcase-1",
    title: "Mastery Showcase 1",
    description: "Explain, compare, and identify ideas under timed mastery pressure.",
    category: "mixed",
    quizType: "timed-mastery-challenge",
    curriculumLevel: 10,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 10,
      requiredViewedSpecificWords: LEVEL_10_WORDS,
      requiredCompletedQuizIds: ["word-problem-1", "word-problem-2"],
      requiredOverallMastery: 85,
      requiredBadgeCount: 10,
    },
    rewards: { xp: 45, badge: "fast-learner" },
    questions: [
      {
        id: "mastery-showcase-1-a",
        type: "timedChallenge",
        prompt: "Quick answer: Which word means to tell how two things are alike or different?",
        options: ["compare", "classify", "count", "answer"],
        answer: "compare",
      },
      {
        id: "mastery-showcase-1-b",
        type: "multipleChoice",
        prompt: "Which word means to tell details about something?",
        options: ["describe", "subtract", "slow", "read"],
        answer: "describe",
      },
      {
        id: "mastery-showcase-1-c",
        type: "multipleChoice",
        prompt: "Which word means to sort things into groups?",
        options: ["identify", "classify", "explain", "thank you"],
        answer: "classify",
      },
    ],
  },
  {
    id: "boss-quiz-foundation",
    title: "Boss Quiz: Curriculum Champion",
    description: "A boss quiz that reviews the core curriculum path through Level 10.",
    category: "mixed",
    quizType: "review-boss",
    curriculumLevel: 10,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 10,
      requiredViewedSpecificWords: LEVEL_10_WORDS,
      requiredCompletedQuizIds: ["mastery-showcase-1"],
      requiredBadgeCount: 10,
    },
    rewards: { xp: 55, badge: "curriculum-champion" },
    questions: [
      {
        id: "boss-quiz-foundation-a",
        type: "multipleChoice",
        prompt: "Which word means to point out the correct thing?",
        options: ["identify", "subtract", "school", "slow"],
        answer: "identify",
      },
      {
        id: "boss-quiz-foundation-b",
        type: "wordProblem",
        prompt: "A learner has 4 red beads and 4 blue beads. What is the total number of beads?",
        options: ["6", "7", "8", "9"],
        answer: "8",
      },
      {
        id: "boss-quiz-foundation-c",
        type: "trueFalse",
        prompt: "True or false: To explain is to tell how or why something happens.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: "advanced-listening-1",
    title: "Advanced Listening 1",
    description: "Listen carefully to longer prompts and pick the best match.",
    category: "linguistic",
    quizType: "text-to-speech",
    curriculumLevel: 11,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 11,
      requiredViewedSpecificWords: LEVEL_11_WORDS,
      requiredCompletedQuizCountByType: {
        "text-to-speech": 2,
      },
      requiredAverageScoreByType: {
        "text-to-speech": 80,
      },
    },
    rewards: { xp: 42, badge: "listening-learner" },
    questions: [
      {
        id: "advanced-listening-1-a",
        type: "textToSpeech",
        prompt: "Listen, then choose the word you heard.",
        audioText: "repeat",
        options: ["repeat", "respond", "story", "green"],
        answer: "repeat",
      },
      {
        id: "advanced-listening-1-b",
        type: "textToSpeech",
        prompt: "Listen, then choose the sound word.",
        audioText: "echo",
        options: ["echo", "school", "count", "title"],
        answer: "echo",
      },
      {
        id: "advanced-listening-1-c",
        type: "multipleChoice",
        prompt: "Which word means to hear with care?",
        options: ["listen", "compare", "paper", "slow"],
        answer: "listen",
      },
    ],
  },
  {
    id: "advanced-speaking-1",
    title: "Advanced Speaking 1",
    description: "Use spoken responses to show stronger expressive language.",
    category: "linguistic",
    quizType: "speech-to-text",
    curriculumLevel: 12,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 12,
      requiredViewedSpecificWords: LEVEL_12_WORDS,
      requiredCompletedQuizCountByType: {
        "speech-to-text": 2,
      },
      requiredAverageScoreByType: {
        "speech-to-text": 80,
      },
    },
    rewards: { xp: 42 },
    questions: [
      {
        id: "advanced-speaking-1-a",
        type: "speechToText",
        prompt: "Say the word: share",
        answer: "share",
        audioText: "share",
      },
      {
        id: "advanced-speaking-1-b",
        type: "speechToText",
        prompt: "Say the word: respond",
        answer: "respond",
        audioText: "respond",
      },
      {
        id: "advanced-speaking-1-c",
        type: "multipleChoice",
        prompt: "Which word means to ask something?",
        options: ["question", "answer", "blue", "subtract"],
        answer: "question",
      },
    ],
  },
  {
    id: "grammar-context-1",
    title: "Grammar and Context 1",
    description: "Practice cause, order, and position words inside short sentences.",
    category: "linguistic",
    quizType: "context-sentence",
    curriculumLevel: 13,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 13,
      requiredViewedSpecificWords: LEVEL_13_WORDS,
      requiredCompletedQuizIds: ["sentence-context-1"],
      requiredMasteryByCategory: {
        linguistic: 82,
      },
    },
    rewards: { xp: 44 },
    questions: [
      {
        id: "grammar-context-1-a",
        type: "fillBlank",
        prompt: "Choose the best word: We stayed inside ___ it rained.",
        options: ["because", "under", "after", "over"],
        answer: "because",
      },
      {
        id: "grammar-context-1-b",
        type: "multipleChoice",
        prompt: "Which word tells about time order?",
        options: ["before", "under", "green", "classify"],
        answer: "before",
      },
      {
        id: "grammar-context-1-c",
        type: "multipleChoice",
        prompt: "Which word means above something?",
        options: ["after", "under", "over", "because"],
        answer: "over",
      },
    ],
  },
  {
    id: "reading-comprehension-1",
    title: "Reading Comprehension 1",
    description: "Read a short situation and choose the detail that best answers the question.",
    category: "mixed",
    quizType: "story-comprehension",
    curriculumLevel: 14,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 14,
      requiredViewedSpecificWords: LEVEL_14_WORDS,
      requiredCompletedQuizIds: ["grammar-context-1"],
      requiredMasteryByCategory: {
        mixed: 82,
      },
    },
    rewards: { xp: 46 },
    questions: [
      {
        id: "reading-comprehension-1-a",
        type: "multipleChoice",
        prompt: "A story title tells us mostly about the story's...",
        options: ["name", "color", "speed", "teacher"],
        answer: "name",
      },
      {
        id: "reading-comprehension-1-b",
        type: "multipleChoice",
        prompt: "Which word means one line of words that tells an idea?",
        options: ["sentence", "answer", "title", "detail"],
        answer: "sentence",
      },
      {
        id: "reading-comprehension-1-c",
        type: "wordProblem",
        prompt: "A story says Ana read 2 books on Monday and 3 books on Tuesday. What detail answers how many books she read in all?",
        options: ["2", "3", "4", "5"],
        answer: "5",
      },
    ],
  },
  {
    id: "final-boss-mastery",
    title: "Final Boss Mastery",
    description: "The final optional boss challenge across advanced listening, speaking, grammar, and comprehension.",
    category: "mixed",
    quizType: "review-boss",
    curriculumLevel: 15,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 15,
      requiredViewedSpecificWords: LEVEL_10_WORDS,
      requiredCompletedQuizIds: [
        "advanced-listening-1",
        "advanced-speaking-1",
        "grammar-context-1",
        "reading-comprehension-1",
      ],
      requiredOverallMastery: 90,
      requiredBadgeCount: 15,
      requiredStreakDays: 7,
    },
    rewards: { xp: 60, badge: "final-boss-mastery" },
    questions: [
      {
        id: "final-boss-mastery-a",
        type: "timedChallenge",
        prompt: "Quick answer: Which word means to sort into groups?",
        options: ["classify", "describe", "answer", "repeat"],
        answer: "classify",
      },
      {
        id: "final-boss-mastery-b",
        type: "multipleChoice",
        prompt: "Which word means to tell the reason or steps clearly?",
        options: ["identify", "explain", "story", "green"],
        answer: "explain",
      },
      {
        id: "final-boss-mastery-c",
        type: "wordProblem",
        prompt: "A learner compares two groups: 6 shells and 9 shells. Which group has more?",
        options: ["the group with 6", "the group with 9", "both groups", "neither group"],
        answer: "the group with 9",
      },
    ],
  },
  {
    id: "counting-order-1-5",
    title: "Counting Order 1-5",
    description: "Practice early number order and one-to-one counting from one to five.",
    category: "numeric",
    quizType: "ordering-numbers",
    curriculumLevel: 2,
    difficulty: "easy",
    unlockRequirements: {
      requiredLevel: 2,
      requiredViewedSpecificWords: LEVEL_2_NUMERIC_WORDS,
      requiredCompletedQuizIds: ["number-match-1-10"],
      requiredMinimumScores: {
        "number-match-1-10": 70,
      },
    },
    rewards: { xp: 22 },
    questions: [
      {
        id: "counting-order-1-5-a",
        type: "ordering",
        prompt: "Put the numbers in order from 1 to 5.",
        options: ["1", "2", "3", "4", "5"],
        answer: "1, 2, 3, 4, 5",
      },
      {
        id: "counting-order-1-5-b",
        type: "multipleChoice",
        prompt: "What number comes after 3?",
        options: ["2", "3", "4", "5"],
        answer: "4",
      },
      {
        id: "counting-order-1-5-c",
        type: "trueFalse",
        prompt: "True or false: Five comes after four.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: "shape-finder-1",
    title: "Shape Finder 1",
    description: "Recognize common flat shapes and connect them to everyday objects.",
    category: "numeric",
    quizType: "image-based-question",
    curriculumLevel: 3,
    difficulty: "medium",
    unlockRequirements: {
      requiredLevel: 3,
      requiredViewedSpecificWords: LEVEL_3_NUMERIC_WORDS,
      requiredCompletedQuizIds: ["counting-order-1-5"],
      requiredMinimumScores: {
        "counting-order-1-5": 75,
      },
    },
    rewards: { xp: 24 },
    questions: [
      {
        id: "shape-finder-1-a",
        type: "imageChoice",
        prompt: "Which shape is round like a coin?",
        imageLabel: "A round coin",
        options: ["circle", "square", "triangle", "rectangle"],
        answer: "circle",
      },
      {
        id: "shape-finder-1-b",
        type: "multipleChoice",
        prompt: "Which shape has three sides?",
        options: ["oval", "triangle", "square", "circle"],
        answer: "triangle",
      },
      {
        id: "shape-finder-1-c",
        type: "trueFalse",
        prompt: "True or false: A rectangle can look like a door.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: "addition-within-10",
    title: "Addition Within 10",
    description: "Build early addition skill with plus, sum, and total clues.",
    category: "numeric",
    quizType: "counting-objects",
    curriculumLevel: 5,
    difficulty: "medium",
    unlockRequirements: {
      requiredLevel: 5,
      requiredViewedSpecificWords: LEVEL_5_NUMERIC_WORDS,
      requiredCompletedQuizIds: ["number-word-1-10"],
      requiredMinimumScores: {
        "number-word-1-10": 75,
      },
    },
    rewards: { xp: 28 },
    questions: [
      {
        id: "addition-within-10-a",
        type: "wordProblem",
        prompt: "You have 3 blocks and add 2 more. What is the total?",
        options: ["4", "5", "6", "7"],
        answer: "5",
      },
      {
        id: "addition-within-10-b",
        type: "multipleChoice",
        prompt: "Which word means the answer when we add?",
        options: ["sum", "less", "before", "oval"],
        answer: "sum",
      },
      {
        id: "addition-within-10-c",
        type: "trueFalse",
        prompt: "True or false: Plus means to put groups together.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: "subtract-and-compare-1",
    title: "Subtract and Compare 1",
    description: "Practice taking away, one less, and simple comparison language.",
    category: "numeric",
    quizType: "true-or-false",
    curriculumLevel: 6,
    difficulty: "advanced",
    unlockRequirements: {
      requiredLevel: 6,
      requiredViewedSpecificWords: LEVEL_6_NUMERIC_WORDS,
      requiredCompletedQuizIds: ["addition-within-10"],
      requiredMinimumScores: {
        "addition-within-10": 75,
      },
    },
    rewards: { xp: 30 },
    questions: [
      {
        id: "subtract-and-compare-1-a",
        type: "wordProblem",
        prompt: "There are 6 apples. 2 are taken away. How many are left?",
        options: ["2", "3", "4", "5"],
        answer: "4",
      },
      {
        id: "subtract-and-compare-1-b",
        type: "multipleChoice",
        prompt: "Which number is one less than 8?",
        options: ["6", "7", "8", "9"],
        answer: "7",
      },
      {
        id: "subtract-and-compare-1-c",
        type: "multipleChoice",
        prompt: "Which group has less: 3 stars or 5 stars?",
        options: ["3 stars", "5 stars", "both", "neither"],
        answer: "3 stars",
      },
    ],
  },
  {
    id: "pattern-order-1",
    title: "Pattern and Order 1",
    description: "Use before, after, next, and simple patterns to reason with order.",
    category: "numeric",
    quizType: "ordering-numbers",
    curriculumLevel: 7,
    difficulty: "advanced",
    unlockRequirements: {
      requiredLevel: 7,
      requiredViewedSpecificWords: LEVEL_7_NUMERIC_WORDS,
      requiredCompletedQuizIds: ["subtract-and-compare-1"],
      requiredMinimumScores: {
        "subtract-and-compare-1": 75,
      },
    },
    rewards: { xp: 32 },
    questions: [
      {
        id: "pattern-order-1-a",
        type: "multipleChoice",
        prompt: "What comes next: circle, square, circle, square, ___?",
        options: ["circle", "square", "triangle", "oval"],
        answer: "circle",
      },
      {
        id: "pattern-order-1-b",
        type: "multipleChoice",
        prompt: "Which number comes before 10?",
        options: ["8", "9", "10", "11"],
        answer: "9",
      },
      {
        id: "pattern-order-1-c",
        type: "ordering",
        prompt: "Put the numbers in order.",
        options: ["6", "7", "8", "9"],
        answer: "6, 7, 8, 9",
      },
    ],
  },
  {
    id: "equal-groups-1",
    title: "Equal Groups 1",
    description: "Count rows, columns, and equal groups with visual number thinking.",
    category: "numeric",
    quizType: "word-quantity-matching",
    curriculumLevel: 8,
    difficulty: "advanced",
    unlockRequirements: {
      requiredLevel: 8,
      requiredViewedSpecificWords: LEVEL_8_NUMERIC_WORDS,
      requiredCompletedQuizIds: ["pattern-order-1"],
      requiredMinimumScores: {
        "pattern-order-1": 75,
      },
    },
    rewards: { xp: 36 },
    questions: [
      {
        id: "equal-groups-1-a",
        type: "wordProblem",
        prompt: "There are 2 rows with 3 dots in each row. How many dots are there?",
        options: ["5", "6", "7", "8"],
        answer: "6",
      },
      {
        id: "equal-groups-1-b",
        type: "multipleChoice",
        prompt: "Which phrase means groups with the same number?",
        options: ["equal group", "one less", "shorter", "before"],
        answer: "equal group",
      },
      {
        id: "equal-groups-1-c",
        type: "multipleChoice",
        prompt: "Count by twos: 2, 4, 6, ___",
        options: ["7", "8", "9", "10"],
        answer: "8",
      },
    ],
  },
  {
    id: "operation-word-problems-1",
    title: "Operation Word Problems 1",
    description: "Solve addition and subtraction stories using more, less, and total clues.",
    category: "numeric",
    quizType: "word-problem",
    curriculumLevel: 9,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 9,
      requiredViewedSpecificWords: LEVEL_9_NUMERIC_WORDS,
      requiredCompletedQuizIds: ["equal-groups-1"],
      requiredMinimumScores: {
        "equal-groups-1": 80,
      },
    },
    rewards: { xp: 40 },
    questions: [
      {
        id: "operation-word-problems-1-a",
        type: "wordProblem",
        prompt: "Mia has 9 shells. She gives away 4. How many shells are left?",
        options: ["4", "5", "6", "7"],
        answer: "5",
      },
      {
        id: "operation-word-problems-1-b",
        type: "wordProblem",
        prompt: "Leo has 5 cards and gets 3 more. What is the total?",
        options: ["7", "8", "9", "10"],
        answer: "8",
      },
      {
        id: "operation-word-problems-1-c",
        type: "multipleChoice",
        prompt: "Which word often means take away?",
        options: ["add", "subtract", "total", "same"],
        answer: "subtract",
      },
    ],
  },
  {
    id: "number-mastery-1",
    title: "Number Mastery 1",
    description: "Review estimate, compare, exact count, and same-number reasoning.",
    category: "numeric",
    quizType: "timed-mastery-challenge",
    curriculumLevel: 10,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 10,
      requiredViewedSpecificWords: LEVEL_10_NUMERIC_WORDS,
      requiredCompletedQuizIds: ["operation-word-problems-1"],
      requiredMinimumScores: {
        "operation-word-problems-1": 80,
      },
    },
    rewards: { xp: 45 },
    questions: [
      {
        id: "number-mastery-1-a",
        type: "timedChallenge",
        prompt: "Quick answer: Which word means a careful guess?",
        options: ["estimate", "exact count", "same number", "subtract"],
        answer: "estimate",
      },
      {
        id: "number-mastery-1-b",
        type: "multipleChoice",
        prompt: "Which phrase means the real number after counting every item?",
        options: ["same number", "exact count", "less than", "circle"],
        answer: "exact count",
      },
      {
        id: "number-mastery-1-c",
        type: "trueFalse",
        prompt: "True or false: Compare means to look at how numbers are alike or different.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: "measure-compare-1",
    title: "Measure and Compare 1",
    description: "Use length, height, width, and measure words in simple comparisons.",
    category: "numeric",
    quizType: "definition-matching",
    curriculumLevel: 11,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 11,
      requiredViewedSpecificWords: LEVEL_11_NUMERIC_WORDS,
      requiredCompletedQuizIds: ["number-mastery-1"],
      requiredMinimumScores: {
        "number-mastery-1": 80,
      },
    },
    rewards: { xp: 42 },
    questions: [
      {
        id: "measure-compare-1-a",
        type: "multipleChoice",
        prompt: "Which word means having more length?",
        options: ["longer", "shorter", "same number", "sum"],
        answer: "longer",
      },
      {
        id: "measure-compare-1-b",
        type: "multipleChoice",
        prompt: "Which object is taller?",
        options: ["a tree", "a pencil", "a button", "a coin"],
        answer: "a tree",
      },
      {
        id: "measure-compare-1-c",
        type: "trueFalse",
        prompt: "True or false: Wider means taking more space side to side.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: "place-value-1",
    title: "Place Value 1",
    description: "Practice ones, tens, teen numbers, and bundles of ten.",
    category: "numeric",
    quizType: "number-to-word",
    curriculumLevel: 12,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 12,
      requiredViewedSpecificWords: LEVEL_12_NUMERIC_WORDS,
      requiredCompletedQuizIds: ["measure-compare-1"],
      requiredMinimumScores: {
        "measure-compare-1": 80,
      },
    },
    rewards: { xp: 42 },
    questions: [
      {
        id: "place-value-1-a",
        type: "multipleChoice",
        prompt: "Which number has 1 ten and 4 ones?",
        options: ["10", "14", "41", "4"],
        answer: "14",
      },
      {
        id: "place-value-1-b",
        type: "multipleChoice",
        prompt: "What is a bundle of ten?",
        options: ["10 ones together", "1 object", "5 shapes", "2 rows"],
        answer: "10 ones together",
      },
      {
        id: "place-value-1-c",
        type: "trueFalse",
        prompt: "True or false: Twelve is a teen number.",
        options: ["True", "False"],
        answer: "False",
      },
    ],
  },
  {
    id: "equal-parts-1",
    title: "Equal Parts 1",
    description: "Introduce whole, half, and fair-share language for early fractions.",
    category: "numeric",
    quizType: "image-based-question",
    curriculumLevel: 13,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 13,
      requiredViewedSpecificWords: LEVEL_13_NUMERIC_WORDS,
      requiredCompletedQuizIds: ["place-value-1"],
      requiredMinimumScores: {
        "place-value-1": 80,
      },
    },
    rewards: { xp: 44 },
    questions: [
      {
        id: "equal-parts-1-a",
        type: "multipleChoice",
        prompt: "If a sandwich is cut into 2 equal parts, each part is a...",
        options: ["half", "whole", "ten", "row"],
        answer: "half",
      },
      {
        id: "equal-parts-1-b",
        type: "trueFalse",
        prompt: "True or false: A whole means the complete thing.",
        options: ["True", "False"],
        answer: "True",
      },
      {
        id: "equal-parts-1-c",
        type: "multipleChoice",
        prompt: "Which phrase means a fair share?",
        options: ["equal to", "less than", "before", "estimate"],
        answer: "equal to",
      },
    ],
  },
  {
    id: "data-and-time-1",
    title: "Data and Time 1",
    description: "Practice start time, end time, and simple data-table language.",
    category: "numeric",
    quizType: "story-comprehension",
    curriculumLevel: 14,
    difficulty: "mastery",
    unlockRequirements: {
      requiredLevel: 14,
      requiredViewedSpecificWords: LEVEL_14_NUMERIC_WORDS,
      requiredCompletedQuizIds: ["equal-parts-1"],
      requiredMinimumScores: {
        "equal-parts-1": 80,
      },
    },
    rewards: { xp: 46 },
    questions: [
      {
        id: "data-and-time-1-a",
        type: "multipleChoice",
        prompt: "A game begins at 9:00. Which phrase names 9:00?",
        options: ["start time", "end time", "data row", "half full"],
        answer: "start time",
      },
      {
        id: "data-and-time-1-b",
        type: "multipleChoice",
        prompt: "Which phrase can name one line of information in a table?",
        options: ["data row", "plus sign", "teen number", "circle ring"],
        answer: "data row",
      },
      {
        id: "data-and-time-1-c",
        type: "wordProblem",
        prompt: "A tally chart shows 4 votes for apples and 6 votes for bananas. Which has more votes?",
        options: ["apples", "bananas", "both", "neither"],
        answer: "bananas",
      },
    ],
  },
  ...createSupplementalQuizPresets(),
];

function createSupplementalQuizPresets(): QuizPreset[] {
  return [
    {
      id: "starter-sound-quiz-1",
      title: "Beginning Sound Practice",
      description: "Practice simple beginning sounds from the current Play path.",
      category: "linguistic",
      quizType: "listen-and-choose",
      curriculumLevel: 1,
      difficulty: "beginner",
      unlockRequirements: {
        requiredLevel: 1,
        requiredViewedSpecificWords: ["apple", "ant", "ball", "book"],
      },
      rewards: { xp: 18 },
      questions: [
        {
          id: "starter-sound-quiz-1-a",
          type: "multipleChoice",
          prompt: "Which word starts with A?",
          options: ["apple", "ball", "book", "cat"],
          answer: "apple",
        },
        {
          id: "starter-sound-quiz-1-b",
          type: "multipleChoice",
          prompt: "Which word starts with B?",
          options: ["ant", "cat", "book", "one"],
          answer: "book",
        },
        {
          id: "starter-sound-quiz-1-c",
          type: "trueFalse",
          prompt: "True or false: Ball starts with B.",
          options: ["True", "False"],
          answer: "True",
        },
      ],
    },
    {
      id: "counting-pictures-1",
      title: "Counting Pictures 1",
      description: "Count small picture groups and match them to number words.",
      category: "numeric",
      quizType: "counting-objects",
      curriculumLevel: 1,
      difficulty: "beginner",
      unlockRequirements: {
        requiredLevel: 1,
        requiredViewedSpecificWords: ["one", "two", "three", "four"],
      },
      rewards: { xp: 18 },
      questions: [
        {
          id: "counting-pictures-1-a",
          type: "imageChoice",
          prompt: "How many dots are shown? * *",
          options: ["one", "two", "three", "four"],
          answer: "two",
        },
        {
          id: "counting-pictures-1-b",
          type: "imageChoice",
          prompt: "How many stars are shown? * * *",
          options: ["one", "two", "three", "four"],
          answer: "three",
        },
        {
          id: "counting-pictures-1-c",
          type: "trueFalse",
          prompt: "True or false: Four is more than one.",
          options: ["True", "False"],
          answer: "True",
        },
      ],
    },
    {
      id: "number-picture-count-1",
      title: "Number Picture Count 1",
      description: "Use pictures and numerals to strengthen counting through five.",
      category: "numeric",
      quizType: "image-to-number",
      curriculumLevel: 2,
      difficulty: "easy",
      unlockRequirements: {
        requiredLevel: 2,
        requiredViewedSpecificWords: LEVEL_2_NUMERIC_WORDS,
        requiredCompletedQuizIds: ["number-match-1-10"],
      },
      rewards: { xp: 22 },
      questions: [
        {
          id: "number-picture-count-1-a",
          type: "imageChoice",
          prompt: "How many apples are shown? apple apple apple",
          options: ["2", "3", "4", "5"],
          answer: "3",
        },
        {
          id: "number-picture-count-1-b",
          type: "multipleChoice",
          prompt: "Which number word matches 5?",
          options: ["three", "four", "five", "six"],
          answer: "five",
        },
        {
          id: "number-picture-count-1-c",
          type: "multipleChoice",
          prompt: "What number comes before 4?",
          options: ["2", "3", "4", "5"],
          answer: "3",
        },
      ],
    },
    {
      id: "shape-sort-1",
      title: "Shape Sort 1",
      description: "Sort and name familiar shapes in early geometry practice.",
      category: "numeric",
      quizType: "definition-matching",
      curriculumLevel: 3,
      difficulty: "medium",
      unlockRequirements: {
        requiredLevel: 3,
        requiredViewedSpecificWords: LEVEL_3_NUMERIC_WORDS,
        requiredCompletedQuizIds: ["shape-finder-1"],
      },
      rewards: { xp: 24 },
      questions: [
        {
          id: "shape-sort-1-a",
          type: "multipleChoice",
          prompt: "Which shape has four equal sides?",
          options: ["square", "circle", "oval", "triangle"],
          answer: "square",
        },
        {
          id: "shape-sort-1-b",
          type: "multipleChoice",
          prompt: "Which shape is long like a door?",
          options: ["rectangle", "circle", "triangle", "oval"],
          answer: "rectangle",
        },
        {
          id: "shape-sort-1-c",
          type: "trueFalse",
          prompt: "True or false: An oval is round and stretched.",
          options: ["True", "False"],
          answer: "True",
        },
      ],
    },
    {
      id: "school-word-meaning-1",
      title: "School Word Meaning 1",
      description: "Review classroom words and their simple meanings.",
      category: "linguistic",
      quizType: "definition-matching",
      curriculumLevel: 4,
      difficulty: "medium",
      unlockRequirements: {
        requiredLevel: 4,
        requiredViewedSpecificWords: LEVEL_5_WORDS,
        requiredCompletedQuizIds: ["category-vocabulary-1"],
      },
      rewards: { xp: 26 },
      questions: [
        {
          id: "school-word-meaning-1-a",
          type: "multipleChoice",
          prompt: "Which word names something you sit on?",
          options: ["chair", "paper", "pencil", "teacher"],
          answer: "chair",
        },
        {
          id: "school-word-meaning-1-b",
          type: "multipleChoice",
          prompt: "Which word names something you write with?",
          options: ["table", "school", "pencil", "chair"],
          answer: "pencil",
        },
        {
          id: "school-word-meaning-1-c",
          type: "trueFalse",
          prompt: "True or false: A teacher helps learners in class.",
          options: ["True", "False"],
          answer: "True",
        },
      ],
    },
    {
      id: "number-line-1",
      title: "Number Line 1",
      description: "Practice before, after, and order on a simple number line.",
      category: "numeric",
      quizType: "ordering-numbers",
      curriculumLevel: 4,
      difficulty: "medium",
      unlockRequirements: {
        requiredLevel: 4,
        requiredViewedSpecificWords: LEVEL_4_WORDS,
        requiredCompletedQuizIds: ["counting-order-1-5"],
      },
      rewards: { xp: 26 },
      questions: [
        {
          id: "number-line-1-a",
          type: "multipleChoice",
          prompt: "What number comes after 7?",
          options: ["6", "7", "8", "9"],
          answer: "8",
        },
        {
          id: "number-line-1-b",
          type: "multipleChoice",
          prompt: "What number comes before 6?",
          options: ["4", "5", "6", "7"],
          answer: "5",
        },
        {
          id: "number-line-1-c",
          type: "ordering",
          prompt: "Put these numbers in order.",
          options: ["3", "4", "5", "6"],
          answer: "3, 4, 5, 6",
        },
      ],
    },
    {
      id: "add-story-1",
      title: "Add Story 1",
      description: "Solve short addition stories using objects learners can picture.",
      category: "numeric",
      quizType: "word-problem",
      curriculumLevel: 5,
      difficulty: "medium",
      unlockRequirements: {
        requiredLevel: 5,
        requiredViewedSpecificWords: LEVEL_5_NUMERIC_WORDS,
        requiredCompletedQuizIds: ["addition-within-10"],
      },
      rewards: { xp: 28 },
      questions: [
        {
          id: "add-story-1-a",
          type: "wordProblem",
          prompt: "Ana has 4 crayons. Ben gives her 3 more. How many crayons now?",
          options: ["6", "7", "8", "9"],
          answer: "7",
        },
        {
          id: "add-story-1-b",
          type: "wordProblem",
          prompt: "There are 5 birds. 2 more birds come. How many birds in all?",
          options: ["6", "7", "8", "9"],
          answer: "7",
        },
        {
          id: "add-story-1-c",
          type: "multipleChoice",
          prompt: "Which word means the full amount after adding?",
          options: ["total", "less", "before", "oval"],
          answer: "total",
        },
      ],
    },
    {
      id: "take-away-story-1",
      title: "Take Away Story 1",
      description: "Solve short subtraction stories with left and one-less clues.",
      category: "numeric",
      quizType: "word-problem",
      curriculumLevel: 6,
      difficulty: "advanced",
      unlockRequirements: {
        requiredLevel: 6,
        requiredViewedSpecificWords: LEVEL_6_NUMERIC_WORDS,
        requiredCompletedQuizIds: ["subtract-and-compare-1"],
      },
      rewards: { xp: 30 },
      questions: [
        {
          id: "take-away-story-1-a",
          type: "wordProblem",
          prompt: "There are 9 bananas. 3 are eaten. How many are left?",
          options: ["5", "6", "7", "8"],
          answer: "6",
        },
        {
          id: "take-away-story-1-b",
          type: "multipleChoice",
          prompt: "Which number is one less than 5?",
          options: ["3", "4", "5", "6"],
          answer: "4",
        },
        {
          id: "take-away-story-1-c",
          type: "trueFalse",
          prompt: "True or false: Subtract can mean take away.",
          options: ["True", "False"],
          answer: "True",
        },
      ],
    },
    {
      id: "action-sentence-practice-2",
      title: "Action Sentence Practice 2",
      description: "Use familiar verbs to complete short learner-friendly sentences.",
      category: "linguistic",
      quizType: "context-sentence",
      curriculumLevel: 7,
      difficulty: "advanced",
      unlockRequirements: {
        requiredLevel: 7,
        requiredViewedSpecificWords: LEVEL_7_WORDS,
        requiredCompletedQuizIds: ["sentence-context-1"],
      },
      rewards: { xp: 32 },
      questions: [
        {
          id: "action-sentence-practice-2-a",
          type: "fillBlank",
          prompt: "Choose the action: I ___ lunch.",
          options: ["eat", "blue", "table", "more"],
          answer: "eat",
        },
        {
          id: "action-sentence-practice-2-b",
          type: "fillBlank",
          prompt: "Choose the action: We ___ a book.",
          options: ["read", "five", "under", "circle"],
          answer: "read",
        },
        {
          id: "action-sentence-practice-2-c",
          type: "multipleChoice",
          prompt: "Which word is an action?",
          options: ["write", "green", "chair", "ten"],
          answer: "write",
        },
      ],
    },
    {
      id: "descriptive-words-1",
      title: "Descriptive Words 1",
      description: "Practice color, size, and speed words that describe objects.",
      category: "linguistic",
      quizType: "context-sentence",
      curriculumLevel: 8,
      difficulty: "advanced",
      unlockRequirements: {
        requiredLevel: 8,
        requiredViewedSpecificWords: LEVEL_8_WORDS,
        requiredCompletedQuizIds: ["mixed-colors-and-size"],
      },
      rewards: { xp: 36 },
      questions: [
        {
          id: "descriptive-words-1-a",
          type: "multipleChoice",
          prompt: "Which word names a color?",
          options: ["red", "run", "total", "count"],
          answer: "red",
        },
        {
          id: "descriptive-words-1-b",
          type: "fillBlank",
          prompt: "Choose the describing word: The box is ___.",
          options: ["big", "read", "add", "teacher"],
          answer: "big",
        },
        {
          id: "descriptive-words-1-c",
          type: "multipleChoice",
          prompt: "Which word means not fast?",
          options: ["slow", "green", "write", "total"],
          answer: "slow",
        },
      ],
    },
    {
      id: "compare-problems-2",
      title: "Compare Problems 2",
      description: "Compare amounts and decide which group has more or less.",
      category: "numeric",
      quizType: "word-problem",
      curriculumLevel: 9,
      difficulty: "mastery",
      unlockRequirements: {
        requiredLevel: 9,
        requiredViewedSpecificWords: LEVEL_9_NUMERIC_WORDS,
        requiredCompletedQuizIds: ["operation-word-problems-1"],
      },
      rewards: { xp: 40 },
      questions: [
        {
          id: "compare-problems-2-a",
          type: "multipleChoice",
          prompt: "Which is more: 8 beads or 5 beads?",
          options: ["8 beads", "5 beads", "same", "not enough"],
          answer: "8 beads",
        },
        {
          id: "compare-problems-2-b",
          type: "multipleChoice",
          prompt: "Which is less: 2 shells or 6 shells?",
          options: ["2 shells", "6 shells", "same", "both"],
          answer: "2 shells",
        },
        {
          id: "compare-problems-2-c",
          type: "wordProblem",
          prompt: "A jar has 7 stones. Another jar has 4 stones. How many more stones are in the first jar?",
          options: ["2", "3", "4", "5"],
          answer: "3",
        },
      ],
    },
    {
      id: "explain-compare-language-1",
      title: "Explain and Compare Language 1",
      description: "Practice words used for explaining, comparing, and classifying.",
      category: "linguistic",
      quizType: "definition-matching",
      curriculumLevel: 10,
      difficulty: "mastery",
      unlockRequirements: {
        requiredLevel: 10,
        requiredViewedSpecificWords: LEVEL_10_WORDS,
        requiredCompletedQuizIds: ["mastery-showcase-1"],
      },
      rewards: { xp: 45 },
      questions: [
        {
          id: "explain-compare-language-1-a",
          type: "multipleChoice",
          prompt: "Which word means to tell how or why?",
          options: ["explain", "count", "circle", "after"],
          answer: "explain",
        },
        {
          id: "explain-compare-language-1-b",
          type: "multipleChoice",
          prompt: "Which word means to tell what something is?",
          options: ["identify", "subtract", "slow", "share"],
          answer: "identify",
        },
        {
          id: "explain-compare-language-1-c",
          type: "trueFalse",
          prompt: "True or false: Classify means sort into groups.",
          options: ["True", "False"],
          answer: "True",
        },
      ],
    },
    {
      id: "listening-detail-2",
      title: "Listening Detail 2",
      description: "Listen for precise words and connect them to meaning.",
      category: "linguistic",
      quizType: "text-to-speech",
      curriculumLevel: 11,
      difficulty: "mastery",
      unlockRequirements: {
        requiredLevel: 11,
        requiredViewedSpecificWords: LEVEL_11_WORDS,
        requiredCompletedQuizIds: ["advanced-listening-1"],
      },
      rewards: { xp: 42 },
      questions: [
        {
          id: "listening-detail-2-a",
          type: "textToSpeech",
          prompt: "Listen and choose the word.",
          audioText: "whisper",
          options: ["whisper", "repeat", "measure", "square"],
          answer: "whisper",
        },
        {
          id: "listening-detail-2-b",
          type: "textToSpeech",
          prompt: "Listen and choose the word.",
          audioText: "sound",
          options: ["sound", "sum", "shorter", "whole"],
          answer: "sound",
        },
        {
          id: "listening-detail-2-c",
          type: "multipleChoice",
          prompt: "Which word can mean say again?",
          options: ["repeat", "compare", "wide", "title"],
          answer: "repeat",
        },
      ],
    },
    {
      id: "measurement-story-2",
      title: "Measurement Story 2",
      description: "Use measuring and comparison words in short situations.",
      category: "numeric",
      quizType: "word-problem",
      curriculumLevel: 11,
      difficulty: "mastery",
      unlockRequirements: {
        requiredLevel: 11,
        requiredViewedSpecificWords: LEVEL_11_NUMERIC_WORDS,
        requiredCompletedQuizIds: ["measure-compare-1"],
      },
      rewards: { xp: 42 },
      questions: [
        {
          id: "measurement-story-2-a",
          type: "multipleChoice",
          prompt: "A rope is 9 steps long. Another is 6 steps long. Which is longer?",
          options: ["9-step rope", "6-step rope", "same", "neither"],
          answer: "9-step rope",
        },
        {
          id: "measurement-story-2-b",
          type: "multipleChoice",
          prompt: "Which word means not as tall?",
          options: ["shorter", "wider", "sum", "repeat"],
          answer: "shorter",
        },
        {
          id: "measurement-story-2-c",
          type: "trueFalse",
          prompt: "True or false: Exact measure is a careful measured amount.",
          options: ["True", "False"],
          answer: "True",
        },
      ],
    },
    {
      id: "speaking-question-2",
      title: "Speaking Question 2",
      description: "Practice clear spoken words for questions and responses.",
      category: "linguistic",
      quizType: "speech-to-text",
      curriculumLevel: 12,
      difficulty: "mastery",
      unlockRequirements: {
        requiredLevel: 12,
        requiredViewedSpecificWords: LEVEL_12_WORDS,
        requiredCompletedQuizIds: ["advanced-speaking-1"],
      },
      rewards: { xp: 42 },
      questions: [
        {
          id: "speaking-question-2-a",
          type: "speechToText",
          prompt: "Say the word: question",
          answer: "question",
          audioText: "question",
        },
        {
          id: "speaking-question-2-b",
          type: "speechToText",
          prompt: "Say the word: tell",
          answer: "tell",
          audioText: "tell",
        },
        {
          id: "speaking-question-2-c",
          type: "multipleChoice",
          prompt: "Which word means to give an answer back?",
          options: ["respond", "circle", "sum", "under"],
          answer: "respond",
        },
      ],
    },
    {
      id: "place-value-story-2",
      title: "Place Value Story 2",
      description: "Use ones, tens, and teen-number clues in short problems.",
      category: "numeric",
      quizType: "number-to-word",
      curriculumLevel: 12,
      difficulty: "mastery",
      unlockRequirements: {
        requiredLevel: 12,
        requiredViewedSpecificWords: LEVEL_12_NUMERIC_WORDS,
        requiredCompletedQuizIds: ["place-value-1"],
      },
      rewards: { xp: 42 },
      questions: [
        {
          id: "place-value-story-2-a",
          type: "multipleChoice",
          prompt: "Which number has 2 tens and 3 ones?",
          options: ["23", "32", "13", "20"],
          answer: "23",
        },
        {
          id: "place-value-story-2-b",
          type: "multipleChoice",
          prompt: "Which place tells how many single ones?",
          options: ["ones", "tens", "row", "half"],
          answer: "ones",
        },
        {
          id: "place-value-story-2-c",
          type: "trueFalse",
          prompt: "True or false: A teen number can be one ten and some ones.",
          options: ["True", "False"],
          answer: "True",
        },
      ],
    },
    {
      id: "position-context-2",
      title: "Position Context 2",
      description: "Use before, after, under, and over in sentence context.",
      category: "linguistic",
      quizType: "context-sentence",
      curriculumLevel: 13,
      difficulty: "mastery",
      unlockRequirements: {
        requiredLevel: 13,
        requiredViewedSpecificWords: LEVEL_13_WORDS,
        requiredCompletedQuizIds: ["grammar-context-1"],
      },
      rewards: { xp: 44 },
      questions: [
        {
          id: "position-context-2-a",
          type: "fillBlank",
          prompt: "Choose the best word: The ball is ___ the table.",
          options: ["under", "because", "sum", "whole"],
          answer: "under",
        },
        {
          id: "position-context-2-b",
          type: "fillBlank",
          prompt: "Choose the best word: We wash hands ___ eating.",
          options: ["before", "over", "circle", "tens"],
          answer: "before",
        },
        {
          id: "position-context-2-c",
          type: "multipleChoice",
          prompt: "Which word can tell what happens later?",
          options: ["after", "under", "plus", "wide"],
          answer: "after",
        },
      ],
    },
    {
      id: "fair-share-story-2",
      title: "Fair Share Story 2",
      description: "Practice whole, half, and equal-part reasoning in stories.",
      category: "numeric",
      quizType: "word-problem",
      curriculumLevel: 13,
      difficulty: "mastery",
      unlockRequirements: {
        requiredLevel: 13,
        requiredViewedSpecificWords: LEVEL_13_NUMERIC_WORDS,
        requiredCompletedQuizIds: ["equal-parts-1"],
      },
      rewards: { xp: 44 },
      questions: [
        {
          id: "fair-share-story-2-a",
          type: "multipleChoice",
          prompt: "A pizza is cut into 2 equal pieces. One piece is a...",
          options: ["half", "whole", "teen number", "row"],
          answer: "half",
        },
        {
          id: "fair-share-story-2-b",
          type: "trueFalse",
          prompt: "True or false: Two equal halves make one whole.",
          options: ["True", "False"],
          answer: "True",
        },
        {
          id: "fair-share-story-2-c",
          type: "multipleChoice",
          prompt: "Which phrase means a piece from a group?",
          options: ["part of set", "data row", "after lunch", "plus sign"],
          answer: "part of set",
        },
      ],
    },
    {
      id: "detail-sentence-2",
      title: "Detail Sentence 2",
      description: "Read short sentences and identify titles, details, and answers.",
      category: "linguistic",
      quizType: "story-comprehension",
      curriculumLevel: 14,
      difficulty: "mastery",
      unlockRequirements: {
        requiredLevel: 14,
        requiredViewedSpecificWords: LEVEL_14_WORDS,
        requiredCompletedQuizIds: ["reading-comprehension-1"],
      },
      rewards: { xp: 46 },
      questions: [
        {
          id: "detail-sentence-2-a",
          type: "multipleChoice",
          prompt: "Which word names the name of a story?",
          options: ["title", "detail", "answer", "sum"],
          answer: "title",
        },
        {
          id: "detail-sentence-2-b",
          type: "multipleChoice",
          prompt: "Which word can mean a small fact in a story?",
          options: ["detail", "circle", "tens", "over"],
          answer: "detail",
        },
        {
          id: "detail-sentence-2-c",
          type: "trueFalse",
          prompt: "True or false: A sentence tells a complete idea.",
          options: ["True", "False"],
          answer: "True",
        },
      ],
    },
    {
      id: "chart-reading-2",
      title: "Chart Reading 2",
      description: "Use rows, columns, and tallies to read simple data.",
      category: "numeric",
      quizType: "story-comprehension",
      curriculumLevel: 14,
      difficulty: "mastery",
      unlockRequirements: {
        requiredLevel: 14,
        requiredViewedSpecificWords: LEVEL_14_NUMERIC_WORDS,
        requiredCompletedQuizIds: ["data-and-time-1"],
      },
      rewards: { xp: 46 },
      questions: [
        {
          id: "chart-reading-2-a",
          type: "multipleChoice",
          prompt: "Which phrase names one up-and-down part of a table?",
          options: ["data column", "data row", "half full", "story title"],
          answer: "data column",
        },
        {
          id: "chart-reading-2-b",
          type: "wordProblem",
          prompt: "A tally chart shows 5 votes for cats and 3 votes for dogs. Which has fewer votes?",
          options: ["cats", "dogs", "both", "neither"],
          answer: "dogs",
        },
        {
          id: "chart-reading-2-c",
          type: "trueFalse",
          prompt: "True or false: Tally compare means looking at tally amounts.",
          options: ["True", "False"],
          answer: "True",
        },
      ],
    },
    {
      id: "final-language-boss",
      title: "Final Language Boss",
      description: "Review advanced vocabulary, grammar, speaking, and comprehension skills.",
      category: "linguistic",
      quizType: "review-boss",
      curriculumLevel: 15,
      difficulty: "mastery",
      unlockRequirements: {
        requiredLevel: 15,
        requiredCompletedQuizIds: ["advanced-speaking-1", "grammar-context-1", "detail-sentence-2"],
        requiredMasteryByCategory: {
          linguistic: 85,
        },
      },
      rewards: { xp: 60 },
      questions: [
        {
          id: "final-language-boss-a",
          type: "multipleChoice",
          prompt: "Which word tells why something happened?",
          options: ["because", "under", "half", "tens"],
          answer: "because",
        },
        {
          id: "final-language-boss-b",
          type: "multipleChoice",
          prompt: "Which word names the name of a story?",
          options: ["title", "sum", "circle", "equal"],
          answer: "title",
        },
        {
          id: "final-language-boss-c",
          type: "trueFalse",
          prompt: "True or false: To respond is to answer back.",
          options: ["True", "False"],
          answer: "True",
        },
      ],
    },
    {
      id: "final-number-boss",
      title: "Final Number Boss",
      description: "Review advanced counting, data, measurement, and number reasoning.",
      category: "numeric",
      quizType: "review-boss",
      curriculumLevel: 15,
      difficulty: "mastery",
      unlockRequirements: {
        requiredLevel: 15,
        requiredCompletedQuizIds: ["number-mastery-1", "place-value-story-2", "chart-reading-2"],
        requiredMasteryByCategory: {
          numeric: 85,
        },
      },
      rewards: { xp: 60 },
      questions: [
        {
          id: "final-number-boss-a",
          type: "multipleChoice",
          prompt: "Which number has 3 tens and 2 ones?",
          options: ["23", "32", "13", "30"],
          answer: "32",
        },
        {
          id: "final-number-boss-b",
          type: "wordProblem",
          prompt: "A chart shows 8 red votes and 5 blue votes. How many more red votes are there?",
          options: ["2", "3", "4", "5"],
          answer: "3",
        },
        {
          id: "final-number-boss-c",
          type: "trueFalse",
          prompt: "True or false: An estimate is a careful guess.",
          options: ["True", "False"],
          answer: "True",
        },
      ],
    },
    {
      id: "final-integrated-boss-2",
      title: "Final Integrated Boss 2",
      description: "A second final review that combines words, numbers, and story reasoning.",
      category: "mixed",
      quizType: "multi-step-challenge",
      curriculumLevel: 15,
      difficulty: "mastery",
      unlockRequirements: {
        requiredLevel: 15,
        requiredCompletedQuizIds: ["final-language-boss", "final-number-boss"],
        requiredOverallMastery: 88,
      },
      rewards: { xp: 65 },
      questions: [
        {
          id: "final-integrated-boss-2-a",
          type: "wordProblem",
          prompt: "A story says 6 learners read books and 4 learners draw pictures. How many learners are there in all?",
          options: ["8", "9", "10", "11"],
          answer: "10",
        },
        {
          id: "final-integrated-boss-2-b",
          type: "multipleChoice",
          prompt: "Which word best tells what a story is called?",
          options: ["title", "total", "tens", "estimate"],
          answer: "title",
        },
        {
          id: "final-integrated-boss-2-c",
          type: "multipleChoice",
          prompt: "Which phrase means the full answer after counting both groups?",
          options: ["total", "under", "before", "detail"],
          answer: "total",
        },
      ],
    },
  ];
}

function getGeneratedCategory(
  level: number,
  categoryCounts: Record<QuizPreset["category"], number>
): QuizPreset["category"] {
  if (level <= 6) {
    return categoryCounts.linguistic <= categoryCounts.numeric
      ? "linguistic"
      : "numeric";
  }

  if (level >= 15) {
    const orderedCategories: QuizPreset["category"][] = ["mixed", "linguistic", "numeric"];
    return orderedCategories[
      (categoryCounts.mixed + categoryCounts.linguistic + categoryCounts.numeric) %
        orderedCategories.length
    ];
  }

  if (level === 14) {
    const orderedCategories: QuizPreset["category"][] = ["mixed", "linguistic", "numeric"];
    return orderedCategories[
      (categoryCounts.mixed + categoryCounts.linguistic + categoryCounts.numeric) %
        orderedCategories.length
    ];
  }

  if (categoryCounts.numeric <= categoryCounts.linguistic) {
    return "numeric";
  }

  return categoryCounts.mixed < Math.floor(level / 3) ? "mixed" : "linguistic";
}

function getGeneratedDifficulty(level: number): QuizPreset["difficulty"] {
  if (level <= 1) {
    return "beginner";
  }

  if (level <= 3) {
    return "easy";
  }

  if (level <= 5) {
    return "medium";
  }

  if (level <= 9) {
    return "advanced";
  }

  return "mastery";
}

function getGeneratedQuizType(
  level: number,
  category: QuizPreset["category"]
): QuizPreset["quizType"] {
  if (level === 1) {
    return category === "numeric" ? "counting-objects" : "image-to-word";
  }

  if (level === 2) {
    return category === "numeric" ? "ordering-numbers" : "fill-in-the-blank";
  }

  if (level === 3) {
    return category === "numeric" ? "image-based-question" : "matching-type";
  }

  if (level === 4) {
    return category === "numeric" ? "number-to-word" : "number-matching";
  }

  if (level === 5) {
    return category === "numeric" ? "counting-objects" : "spelling";
  }

  if (level === 6) {
    return category === "numeric" ? "text-to-speech" : "speech-to-text";
  }

  if (level === 7) {
    return "drag-and-drop-sentence";
  }

  if (level === 8) {
    return "multi-step-challenge";
  }

  if (level === 9) {
    return "word-problem";
  }

  if (level === 10) {
    return "timed-mastery-challenge";
  }

  if (level === 11) {
    return "text-to-speech";
  }

  if (level === 12) {
    return "speech-to-text";
  }

  if (level === 13) {
    return "context-sentence";
  }

  if (level === 14) {
    return "story-comprehension";
  }

  if (level === 15) {
    return "review-boss";
  }

  if (category === "numeric") {
    return "word-problem";
  }

  if (category === "mixed") {
    return "multi-step-challenge";
  }

  return "definition-matching";
}

function normalizeQuestionWord(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function hashString(value: string) {
  return value.split("").reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0;
  }, 2166136261);
}

function uniqueVocabularyItemsByWord(items: VocabularyItem[]) {
  const seenWords = new Set<string>();

  return items.filter((item) => {
    const normalizedWord = normalizeQuestionWord(item.word);

    if (seenWords.has(normalizedWord)) {
      return false;
    }

    seenWords.add(normalizedWord);
    return true;
  });
}

function getStableVocabularyPool(items: VocabularyItem[]) {
  return uniqueVocabularyItemsByWord(items).sort((left, right) => {
    const leftHash = hashString(`${left.id}:quiz-bank`);
    const rightHash = hashString(`${right.id}:quiz-bank`);

    if (leftHash !== rightHash) {
      return leftHash - rightHash;
    }

    return left.id.localeCompare(right.id);
  });
}

const QUIZ_VOCABULARY_POOLS = {
  linguistic: getStableVocabularyPool(
    VOCABULARY_ITEMS.filter((item) => item.category === "linguistic")
  ),
  numeric: getStableVocabularyPool(
    VOCABULARY_ITEMS.filter((item) => item.category === "numeric")
  ),
  mixed: getStableVocabularyPool(VOCABULARY_ITEMS),
};

function getLevelAlignedVocabularyPool(quiz: QuizPreset) {
  const basePool = QUIZ_VOCABULARY_POOLS[quiz.category];

  if (quiz.curriculumLevel >= 15) {
    return basePool;
  }

  if (quiz.curriculumLevel >= 14) {
    return basePool.filter((item) => {
      if (quiz.category === "mixed") {
        return true;
      }

      return quiz.category === "numeric"
        ? ["counting", "shapes", "adding", "comparing"].includes(item.subcategory)
        : ["reading", "things", "nature", "animals", "plants"].includes(item.subcategory);
    });
  }

  if (quiz.category === "numeric") {
    const earlyNumericSubcategories =
      quiz.curriculumLevel <= 4 ? ["counting", "shapes"] : ["counting", "shapes", "adding"];
    const allowedSubcategories =
      quiz.curriculumLevel >= 9
        ? ["counting", "shapes", "adding", "comparing"]
        : earlyNumericSubcategories;
    const levelPool = basePool.filter((item) =>
      allowedSubcategories.includes(item.subcategory)
    );

    return levelPool.length >= QUESTIONS_PER_QUIZ ? levelPool : basePool;
  }

  if (quiz.category === "linguistic") {
    const allowedSubcategories =
      quiz.curriculumLevel <= 3
        ? ["reading", "things", "animals"]
        : quiz.curriculumLevel <= 8
          ? ["reading", "things", "animals", "plants"]
          : ["reading", "things", "animals", "plants", "nature"];
    const levelPool = basePool.filter((item) =>
      allowedSubcategories.includes(item.subcategory)
    );

    return levelPool.length >= QUESTIONS_PER_QUIZ ? levelPool : basePool;
  }

  const levelPool =
    quiz.curriculumLevel <= 8
      ? basePool.filter((item) =>
          ["reading", "things", "animals", "counting", "shapes"].includes(
            item.subcategory
          )
        )
      : basePool;

  return levelPool.length >= QUESTIONS_PER_QUIZ ? levelPool : basePool;
}

function takeVocabularyBank(pool: VocabularyItem[], cursor: number) {
  const bank: string[] = [];
  const seenWords = new Set<string>();
  let offset = 0;

  while (bank.length < QUESTIONS_PER_QUIZ && offset < pool.length * 2) {
    const item = pool[(cursor + offset) % pool.length];
    const normalizedWord = normalizeQuestionWord(item.word);

    if (!seenWords.has(normalizedWord)) {
      seenWords.add(normalizedWord);
      bank.push(item.word);
    }

    offset += 1;
  }

  return bank;
}

function assignVocabularyBanksToQuizzes(quizzes: QuizPreset[]) {
  const cursors: Record<QuizPreset["category"], number> = {
    linguistic: 0,
    mixed: 0,
    numeric: 0,
  };

  return quizzes.map((quiz) => {
    const pool = getLevelAlignedVocabularyPool(quiz);
    const bank = takeVocabularyBank(pool, cursors[quiz.category]);

    cursors[quiz.category] += QUESTIONS_PER_QUIZ;

    return {
      ...quiz,
      unlockRequirements: {
        ...quiz.unlockRequirements,
        requiredViewedSpecificWords: bank,
      },
    };
  });
}

function getLevelWordBank(level: number, category: QuizPreset["category"]) {
  const linguisticWordsByLevel: Record<number, string[]> = {
    1: LEVEL_2_WORDS,
    2: LEVEL_2_WORDS,
    3: LEVEL_3_WORDS,
    4: LEVEL_4_WORDS,
    5: LEVEL_5_WORDS,
    6: LEVEL_6_WORDS,
    7: LEVEL_7_WORDS,
    8: LEVEL_8_WORDS,
    9: LEVEL_9_WORDS,
    10: LEVEL_10_WORDS,
    11: LEVEL_11_WORDS,
    12: LEVEL_12_WORDS,
    13: LEVEL_13_WORDS,
    14: LEVEL_14_WORDS,
    15: [...LEVEL_10_WORDS, ...LEVEL_14_WORDS],
  };
  const numericWordsByLevel: Record<number, string[]> = {
    1: LEVEL_4_WORDS,
    2: LEVEL_2_NUMERIC_WORDS,
    3: LEVEL_3_NUMERIC_WORDS,
    4: LEVEL_4_WORDS,
    5: LEVEL_5_NUMERIC_WORDS,
    6: LEVEL_6_NUMERIC_WORDS,
    7: LEVEL_7_NUMERIC_WORDS,
    8: LEVEL_8_NUMERIC_WORDS,
    9: LEVEL_9_NUMERIC_WORDS,
    10: LEVEL_10_NUMERIC_WORDS,
    11: LEVEL_11_NUMERIC_WORDS,
    12: LEVEL_12_NUMERIC_WORDS,
    13: LEVEL_13_NUMERIC_WORDS,
    14: LEVEL_14_NUMERIC_WORDS,
    15: [...LEVEL_10_NUMERIC_WORDS, ...LEVEL_14_NUMERIC_WORDS],
  };

  if (category === "numeric") {
    return numericWordsByLevel[level] ?? LEVEL_4_WORDS;
  }

  if (category === "mixed") {
    return [
      ...(linguisticWordsByLevel[level] ?? LEVEL_10_WORDS),
      ...(numericWordsByLevel[level] ?? LEVEL_10_NUMERIC_WORDS),
    ];
  }

  return linguisticWordsByLevel[level] ?? LEVEL_10_WORDS;
}

function getQuizWordBank(quiz: QuizPreset) {
  const unlockWords = quiz.unlockRequirements?.requiredViewedSpecificWords ?? [];
  const levelWords = getLevelWordBank(quiz.curriculumLevel, quiz.category);

  if (unlockWords.length >= QUESTIONS_PER_QUIZ) {
    return Array.from(new Set(unlockWords)).slice(0, QUESTIONS_PER_QUIZ);
  }

  return Array.from(new Set([...unlockWords, ...levelWords])).slice(
    0,
    QUESTIONS_PER_QUIZ
  );
}

function withExpandedUnlockWords(quiz: QuizPreset): QuizPreset {
  const unlockWords = quiz.unlockRequirements?.requiredViewedSpecificWords;

  if (!unlockWords?.length) {
    return quiz;
  }

  return {
    ...quiz,
    unlockRequirements: {
      ...quiz.unlockRequirements,
      requiredViewedSpecificWords: getQuizWordBank(quiz),
    },
  };
}

function uniqueOptions(options: string[], answer: string) {
  return Array.from(new Set([answer, ...options])).slice(0, 4);
}

const VOCABULARY_ITEMS_BY_WORD = VOCABULARY_ITEMS.reduce(
  (itemsByWord, item) => {
    [item.word, item.id, ...item.legacyIds].forEach((candidate) => {
      const normalizedCandidate = normalizeQuestionWord(candidate);
      const existingItems = itemsByWord.get(normalizedCandidate) ?? [];

      existingItems.push(item);
      itemsByWord.set(normalizedCandidate, existingItems);
    });

    return itemsByWord;
  },
  new Map<string, VocabularyItem[]>()
);
const VOCABULARY_ITEMS_BY_SUBCATEGORY = VOCABULARY_ITEMS.reduce(
  (itemsBySubcategory, item) => {
    const existingItems = itemsBySubcategory.get(item.subcategory) ?? [];

    existingItems.push(item);
    itemsBySubcategory.set(item.subcategory, existingItems);

    return itemsBySubcategory;
  },
  new Map<VocabularyItem["subcategory"], VocabularyItem[]>()
);
const QUIZ_VOCABULARY_ITEM_CACHE = new Map<string, VocabularyItem[]>();

function getVocabularyItemForWord(word: string, category: QuizPreset["category"]) {
  const normalizedWord = normalizeQuestionWord(word);
  const matchingItems = VOCABULARY_ITEMS_BY_WORD.get(normalizedWord) ?? [];

  return (
    matchingItems.find((item) => category === "mixed" || item.category === category) ??
    null
  );
}

function getVocabularyItemsForQuiz(
  level: number,
  category: QuizPreset["category"],
  wordBank = getLevelWordBank(level, category)
) {
  const cacheKey = `${level}:${category}:${wordBank.join("|")}`;
  const cachedItems = QUIZ_VOCABULARY_ITEM_CACHE.get(cacheKey);

  if (cachedItems) {
    return cachedItems;
  }

  const primaryItems = wordBank
    .map((word) => getVocabularyItemForWord(word, category))
    .filter((item): item is VocabularyItem => item !== null);
  const primaryIds = new Set(primaryItems.map((item) => item.id));
  const primarySubcategories = new Set(primaryItems.map((item) => item.subcategory));
  const relatedItems = Array.from(primarySubcategories)
    .flatMap((subcategory) => VOCABULARY_ITEMS_BY_SUBCATEGORY.get(subcategory) ?? [])
    .filter(
      (item) =>
        !primaryIds.has(item.id) &&
        (category === "mixed" || item.category === category)
    );
  const relatedIds = new Set(relatedItems.map((item) => item.id));
  const fallbackItems = VOCABULARY_ITEMS.filter(
    (item) =>
      !primaryIds.has(item.id) &&
      !relatedIds.has(item.id) &&
      (category === "mixed" || item.category === category)
  );

  const nextItems = [...primaryItems, ...relatedItems, ...fallbackItems];
  QUIZ_VOCABULARY_ITEM_CACHE.set(cacheKey, nextItems);

  return nextItems;
}

function getMeaningWithoutAnswer(item: VocabularyItem) {
  const escapedWord = item.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const cleanedDefinition = item.definition
    .replace(new RegExp(`^(?:an?|the)\\s+${escapedWord}\\s+is\\s+`, "i"), "")
    .replace(new RegExp(`^${escapedWord}\\s+is\\s+`, "i"), "")
    .trim();

  if (!cleanedDefinition) {
    return item.definition;
  }

  return `${cleanedDefinition.charAt(0).toUpperCase()}${cleanedDefinition.slice(1)}`;
}

function getMeaningOptions(
  item: VocabularyItem,
  category: QuizPreset["category"],
  fallbackWords: string[]
) {
  const relatedOptions = (
    VOCABULARY_ITEMS_BY_SUBCATEGORY.get(item.subcategory) ?? []
  )
    .filter(
      (candidate) =>
        candidate.id !== item.id &&
        (category === "mixed" || candidate.category === item.category)
    )
    .map((candidate) => candidate.word);

  return uniqueOptions([...relatedOptions, ...fallbackWords], item.word);
}

function createMeaningQuestionFromItem({
  id,
  item,
  options,
  variant,
}: {
  id: string;
  item: VocabularyItem;
  options: string[];
  variant: number;
}): QuizPreset["questions"][number] {
  const meaning = getMeaningWithoutAnswer(item).replace(/[.?!]\s*$/, "");
  const letterCount = item.word.replace(/\s+/g, "").length;
  const wordPartCount = item.word.trim().split(/\s+/).length;
  const letterClue = `It starts with ${item.word.charAt(0).toUpperCase()} and has ${letterCount} letter${letterCount === 1 ? "" : "s"}${wordPartCount > 1 ? ` in ${wordPartCount} word parts` : ""}.`;
  const prompts = [
    `Clue: ${meaning}. ${letterClue} Which word is it?`,
    `This word means: ${meaning}. ${letterClue} Which word matches?`,
    `Read the clue: ${meaning}. ${letterClue} Pick the word.`,
  ];

  return {
    id,
    type: "multipleChoice",
    prompt: prompts[variant % prompts.length],
    options,
    answer: item.word,
    helperText: "Think about what the clue describes, then choose the matching word.",
  };
}

function createNumberOptions(answer: number) {
  return uniqueOptions(
    [`${Math.max(0, answer - 1)}`, `${answer + 1}`, `${answer + 2}`, `${Math.max(0, answer - 2)}`],
    `${answer}`
  );
}

function createLinguisticReviewQuestion(
  quiz: QuizPreset,
  index: number,
  idIndex = index
): QuizPreset["questions"][number] {
  const wordBank = getQuizWordBank(quiz);
  const wordItems = getVocabularyItemsForQuiz(
    quiz.curriculumLevel,
    quiz.category,
    wordBank
  );
  const answerItem = wordItems[index % wordItems.length];

  if (answerItem) {
    return createMeaningQuestionFromItem({
      id: `${quiz.id}-extra-${idIndex + 1}`,
      item: answerItem,
      options: getMeaningOptions(answerItem, quiz.category, wordBank),
      variant: index,
    });
  }

  const answer = wordBank[index % wordBank.length];

  return createMeaningQuestionFromItem({
    id: `${quiz.id}-extra-${idIndex + 1}`,
    item: {
      id: answer,
      legacyIds: [],
      word: answer,
      pronunciation: answer,
      definition: `${answer} is an important word for this level.`,
      example: "",
      imageUri: "",
      emoji: "",
      accentColor: "",
      category: "linguistic",
      subcategory: "things",
      curriculumBand: "",
      learningGoal: "",
      recognitionPrompt: "",
      searchTerms: [],
    },
    options: uniqueOptions(wordBank.filter((word) => word !== answer), answer),
    variant: index,
  });
}

function createNumericReviewQuestion(
  quiz: QuizPreset,
  index: number,
  idIndex = index
): QuizPreset["questions"][number] {
  const wordBank = getQuizWordBank(quiz);
  const wordItems = getVocabularyItemsForQuiz(
    quiz.curriculumLevel,
    quiz.category,
    wordBank
  );
  const answerItem = wordItems[index % wordItems.length];

  if (answerItem) {
    return createMeaningQuestionFromItem({
      id: `${quiz.id}-extra-${idIndex + 1}`,
      item: answerItem,
      options: getMeaningOptions(answerItem, quiz.category, wordBank),
      variant: index,
    });
  }

  const first = Math.min(quiz.curriculumLevel + index + 1, 20);
  const second = Math.max(1, ((index + quiz.curriculumLevel) % 5) + 1);
  const total = first + second;
  const difference = Math.max(first, second) - Math.min(first, second);

  if (index % 3 === 0) {
    return {
      id: `${quiz.id}-extra-${idIndex + 1}`,
      type: "wordProblem",
      prompt: `There are ${first} counters. We add ${second} more. How many counters are there now?`,
      options: createNumberOptions(total),
      answer: `${total}`,
    };
  }

  if (index % 3 === 1) {
    return {
      id: `${quiz.id}-extra-${idIndex + 1}`,
      type: "wordProblem",
      prompt: `Start with ${Math.max(first, second)} blocks. Move away ${Math.min(first, second)} blocks. How many are left?`,
      options: createNumberOptions(difference),
      answer: `${difference}`,
    };
  }

  return {
    id: `${quiz.id}-extra-${idIndex + 1}`,
    type: "trueFalse",
    prompt: `True or false: ${Math.max(first, second)} is more than ${Math.min(first, second)}.`,
    options: ["True", "False"],
    answer: "True",
  };
}

function createMixedReviewQuestion(
  quiz: QuizPreset,
  index: number,
  idIndex = index
): QuizPreset["questions"][number] {
  const wordBank = getQuizWordBank(quiz);
  const wordItems = getVocabularyItemsForQuiz(
    quiz.curriculumLevel,
    "mixed",
    wordBank
  );
  const answerItem = wordItems[index % wordItems.length];

  if (answerItem) {
    return createMeaningQuestionFromItem({
      id: `${quiz.id}-extra-${idIndex + 1}`,
      item: answerItem,
      options: getMeaningOptions(answerItem, "mixed", wordBank),
      variant: index,
    });
  }

  const answer = wordBank[index % wordBank.length];

  return {
    id: `${quiz.id}-extra-${idIndex + 1}`,
    type: "multipleChoice",
    prompt: `Clue: ${answer} is a useful word for this mixed practice. Which word is it?`,
    options: uniqueOptions(
      wordBank.filter((word) => word !== answer),
      answer
    ),
    answer,
  };
}

function createTypedVocabularyQuestion(
  quiz: QuizPreset,
  index: number,
  idIndex = index
): QuizPreset["questions"][number] {
  const wordBank = getQuizWordBank(quiz);
  const answer = wordBank[index % wordBank.length] ?? "word";
  const answerItem = getVocabularyItemForWord(answer, quiz.category);
  const clue = answerItem
    ? getMeaningWithoutAnswer(answerItem).replace(/[.?!]\s*$/, "")
    : `${answer} is a useful word for this level`;

  return {
    id: `${quiz.id}-interactive-${idIndex + 1}`,
    type: "fillBlank",
    prompt:
      quiz.quizType === "spelling"
        ? `Type the word that starts with ${answer.charAt(0).toUpperCase()}: ${clue}.`
        : `Clue: ${clue}. Type the word that fits.`,
    answer,
    wordBank: uniqueOptions(
      wordBank.filter((word) => normalizeQuestionWord(word) !== normalizeQuestionWord(answer)),
      answer
    ),
    helperText: "Use the hints if you need them, but type the answer yourself.",
  };
}

function createListeningQuestion(
  quiz: QuizPreset,
  index: number,
  idIndex = index
): QuizPreset["questions"][number] {
  const wordBank = getQuizWordBank(quiz);
  const answer = wordBank[index % wordBank.length] ?? "listen";

  return {
    id: `${quiz.id}-interactive-${idIndex + 1}`,
    type: "textToSpeech",
    prompt: "Tap play. Which word did you hear?",
    answer,
    audioText: answer,
    options: uniqueOptions(
      wordBank.filter((word) => normalizeQuestionWord(word) !== normalizeQuestionWord(answer)),
      answer
    ),
    helperText: "Listen first, then choose the word that matches the sound.",
  };
}

function createSpeakingQuestion(
  quiz: QuizPreset,
  index: number,
  idIndex = index
): QuizPreset["questions"][number] {
  const wordBank = getQuizWordBank(quiz);
  const answer = wordBank[index % wordBank.length] ?? "hello";

  return {
    id: `${quiz.id}-interactive-${idIndex + 1}`,
    type: "speechToText",
    prompt: `Listen to the word, then say it clearly: ${answer}.`,
    answer,
    audioText: answer,
    helperText: "Tap Speak and say the word. You can type it if speech is unavailable.",
  };
}

function createOrderingQuestion(
  quiz: QuizPreset,
  index: number,
  idIndex = index
): QuizPreset["questions"][number] {
  if (quiz.quizType === "drag-and-drop-sentence") {
    const sentences = [
      ["The", "child", "reads", "a", "book"],
      ["I", "walk", "to", "school"],
      ["We", "listen", "and", "repeat"],
    ];
    const sequence = sentences[index % sentences.length];

    return {
      id: `${quiz.id}-interactive-${idIndex + 1}`,
      type: "ordering",
      prompt: "Build a sentence that makes sense.",
      options: sequence,
      answer: sequence.join(", "),
      helperText: "Drag the words into a sentence order.",
    };
  }

  const start = Math.max(1, Math.min(quiz.curriculumLevel + index, 18));
  const sequence = [`${start}`, `${start + 1}`, `${start + 2}`, `${start + 3}`];

  return {
    id: `${quiz.id}-interactive-${idIndex + 1}`,
    type: "ordering",
    prompt:
      quiz.category === "numeric"
        ? "Put the numbers in order from smallest to biggest."
        : "Put these ideas in a clear order.",
    options: sequence,
    answer: sequence.join(", "),
    helperText: "Drag the tiles until the order makes sense.",
  };
}

function createMatchingQuestion(
  quiz: QuizPreset,
  index: number,
  idIndex = index
): QuizPreset["questions"][number] {
  const wordBank = getQuizWordBank(quiz);
  const wordItems = getVocabularyItemsForQuiz(quiz.curriculumLevel, quiz.category, wordBank);
  const selectedItems = wordItems.slice(index, index + 4).length >= 4
    ? wordItems.slice(index, index + 4)
    : wordItems.slice(0, 4);
  const pairs = selectedItems.map((item) => {
    if (quiz.quizType === "image-to-word") {
      const imagePrompt = `${item.emoji ? `${item.emoji} ` : ""}${
        item.recognitionPrompt || `Picture of ${item.word}`
      }`;

      return {
        left: `Picture of ${item.word}`,
        leftType: "image" as const,
        right: item.word,
        rightType: "word" as const,
        word: item.word,
        imagePrompt,
        altText: item.word,
      };
    }

    if (quiz.quizType === "word-to-image") {
      const imagePrompt = `${item.emoji ? `${item.emoji} ` : ""}${
        item.recognitionPrompt || `Picture of ${item.word}`
      }`;

      return {
        left: item.word,
        leftType: "word" as const,
        right: `Picture of ${item.word}`,
        rightType: "image" as const,
        word: item.word,
        imagePrompt,
        altText: item.word,
      };
    }

    return {
      left: item.word,
      right: getMeaningWithoutAnswer(item).replace(/[.?!]\s*$/, ""),
      leftType: "word" as const,
      rightType: "text" as const,
      word: item.word,
    };
  });

  return {
    id: `${quiz.id}-interactive-${idIndex + 1}`,
    type: "matching",
    prompt:
      quiz.quizType === "image-to-word"
        ? "Match each picture clue to the correct word."
        : quiz.quizType === "word-to-image"
          ? "Match each word to its picture clue."
          : "Match each word to what it means.",
    pairs,
    answer: pairs.map((pair) => `${pair.left}=>${pair.right}`).join("|"),
    helperText: "Tap or drag each item to its best match.",
  };
}

function createImageQuestion(
  quiz: QuizPreset,
  index: number,
  idIndex = index
): QuizPreset["questions"][number] {
  const wordBank = getQuizWordBank(quiz);
  const answer = wordBank[index % wordBank.length] ?? "one";
  const item = getVocabularyItemForWord(answer, quiz.category);
  const imageLabel = `${item?.emoji ? `${item.emoji} ` : ""}${
    item?.recognitionPrompt || `Picture clue for ${answer}`
  }`;

  return {
    id: `${quiz.id}-interactive-${idIndex + 1}`,
    type: "imageChoice",
    prompt:
      quiz.quizType === "counting-objects" || quiz.quizType === "image-to-number"
        ? "Look at the picture clue. How many are there?"
        : "Look at the picture clue. Which word matches it?",
    imageLabel,
    options: uniqueOptions(
      wordBank.filter((word) => normalizeQuestionWord(word) !== normalizeQuestionWord(answer)),
      answer
    ),
    answer,
    helperText: "Study the picture clue before you answer.",
  };
}

function createStoryQuestion(
  quiz: QuizPreset,
  index: number,
  idIndex = index
): QuizPreset["questions"][number] {
  if (quiz.category === "numeric") {
    return createNumericReviewQuestion(quiz, index, idIndex);
  }

  const wordBank = getQuizWordBank(quiz);
  const answer = wordBank[index % wordBank.length] ?? "detail";

  return {
    id: `${quiz.id}-interactive-${idIndex + 1}`,
    type: "wordProblem",
    prompt: `Lina reads a short story. One important ${answer} helps her understand it. Which word completes the idea?`,
    options: uniqueOptions(
      wordBank.filter((word) => normalizeQuestionWord(word) !== normalizeQuestionWord(answer)),
      answer
    ),
    answer,
    helperText: "Read the short situation, then choose the word that fits.",
  };
}

function createSupplementalQuestion(
  quiz: QuizPreset,
  index: number,
  idIndex = index
): QuizPreset["questions"][number] {
  if (quiz.quizType === "speech-to-text") {
    return createSpeakingQuestion(quiz, index, idIndex);
  }

  if (
    quiz.quizType === "text-to-speech" ||
    quiz.quizType === "listen-and-choose" ||
    quiz.quizType === "audio-number-recognition"
  ) {
    return createListeningQuestion(quiz, index, idIndex);
  }

  if (
    quiz.quizType === "ordering-numbers" ||
    quiz.quizType === "drag-and-drop-sentence"
  ) {
    return createOrderingQuestion(quiz, index, idIndex);
  }

  if (
    quiz.quizType === "matching-type" ||
    quiz.quizType === "definition-matching" ||
    quiz.quizType === "image-to-word" ||
    quiz.quizType === "word-to-image" ||
    quiz.quizType === "word-quantity-matching" ||
    quiz.quizType === "number-matching"
  ) {
    return createMatchingQuestion(quiz, index, idIndex);
  }

  if (
    quiz.quizType === "fill-in-the-blank" ||
    quiz.quizType === "spelling" ||
    quiz.quizType === "context-sentence" ||
    quiz.quizType === "missing-word-number" ||
    quiz.quizType === "number-to-word"
  ) {
    return createTypedVocabularyQuestion(quiz, index, idIndex);
  }

  if (
    quiz.quizType === "counting-objects" ||
    quiz.quizType === "image-to-number" ||
    quiz.quizType === "image-based-question" ||
    quiz.quizType === "read-and-count"
  ) {
    return createImageQuestion(quiz, index, idIndex);
  }

  if (
    quiz.quizType === "word-problem" ||
    quiz.quizType === "story-comprehension" ||
    quiz.quizType === "multi-step-challenge"
  ) {
    return createStoryQuestion(quiz, index, idIndex);
  }

  if (quiz.quizType === "review-boss" || quiz.quizType === "timed-mastery-challenge") {
    const bossFactories = [
      createListeningQuestion,
      createSpeakingQuestion,
      createMatchingQuestion,
      createOrderingQuestion,
      createTypedVocabularyQuestion,
      createStoryQuestion,
    ];
    const factory = bossFactories[index % bossFactories.length];

    return factory(quiz, index, idIndex);
  }

  if (quiz.category === "numeric") {
    return createNumericReviewQuestion(quiz, index, idIndex);
  }

  if (quiz.category === "mixed") {
    return createMixedReviewQuestion(quiz, index, idIndex);
  }

  return createLinguisticReviewQuestion(quiz, index, idIndex);
}

function normalizeQuestionPrompt(prompt: string) {
  return prompt.trim().toLowerCase().replace(/\s+/g, " ");
}

function hasRepeatedPrompt(
  questions: QuizPreset["questions"],
  candidate: QuizPreset["questions"][number]
) {
  const candidatePrompt = normalizeQuestionPrompt(candidate.prompt);

  return questions.some(
    (question) => normalizeQuestionPrompt(question.prompt) === candidatePrompt
  );
}

function withStandardQuestionCount(quiz: QuizPreset): QuizPreset {
  const quizWithUnlockWords = withExpandedUnlockWords(quiz);
  const seenPrompts = new Set<string>();
  const questions: QuizPreset["questions"] = [];

  quizWithUnlockWords.questions.forEach((question) => {
    const normalizedPrompt = normalizeQuestionPrompt(question.prompt);

    if (seenPrompts.has(normalizedPrompt) || questions.length >= QUESTIONS_PER_QUIZ) {
      return;
    }

    seenPrompts.add(normalizedPrompt);
    questions.push(question);
  });

  let supplementalIndex = 0;
  while (questions.length < QUESTIONS_PER_QUIZ) {
    const idIndex = questions.length;
    let attempt = 0;
    let candidate = createSupplementalQuestion(
      quizWithUnlockWords,
      supplementalIndex,
      idIndex
    );

    while (
      hasRepeatedPrompt(questions, candidate) &&
      attempt < MAX_SUPPLEMENTAL_QUESTION_ATTEMPTS
    ) {
      attempt += 1;
      candidate = createSupplementalQuestion(
        quizWithUnlockWords,
        supplementalIndex + attempt,
        idIndex
      );
    }

    seenPrompts.add(normalizeQuestionPrompt(candidate.prompt));
    questions.push(candidate);
    supplementalIndex += attempt + 1;
  }

  return {
    ...quizWithUnlockWords,
    questions,
  };
}

function createGeneratedQuestions(
  level: number,
  category: QuizPreset["category"],
  ordinal: number
): QuizPreset["questions"] {
  if (category === "numeric") {
    const first = Math.min(level + ordinal, 20);
    const second = Math.max(1, Math.min(level, 10));
    const total = first + second;
    const difference = Math.max(first, second) - Math.min(first, second);

    return [
      {
        id: `level-${level}-numeric-auto-${ordinal}-a`,
        type: "wordProblem",
        prompt: `A learner has ${first} counters and gets ${second} more. What is the total?`,
        options: [`${total - 1}`, `${total}`, `${total + 1}`, `${total + 2}`],
        answer: `${total}`,
      },
      {
        id: `level-${level}-numeric-auto-${ordinal}-b`,
        type: "wordProblem",
        prompt: `There are ${Math.max(first, second)} shells. ${Math.min(first, second)} shells are taken away. How many are left?`,
        options: [`${Math.max(0, difference - 1)}`, `${difference}`, `${difference + 1}`, `${difference + 2}`],
        answer: `${difference}`,
      },
      {
        id: `level-${level}-numeric-auto-${ordinal}-c`,
        type: "multipleChoice",
        prompt: "Which word means the full amount after counting?",
        options: ["total", "before", "under", "title"],
        answer: "total",
      },
    ];
  }

  if (category === "mixed") {
    const count = Math.min(level + ordinal, 30);

    return [
      {
        id: `level-${level}-mixed-auto-${ordinal}-a`,
        type: "wordProblem",
        prompt: `A story has ${count} stars and 2 more stars are added. How many stars are in the story now?`,
        options: [`${count + 1}`, `${count + 2}`, `${count + 3}`, `${count + 4}`],
        answer: `${count + 2}`,
      },
      {
        id: `level-${level}-mixed-auto-${ordinal}-b`,
        type: "multipleChoice",
        prompt: "Which word helps describe the name of a story?",
        options: ["title", "sum", "circle", "tens"],
        answer: "title",
      },
      {
        id: `level-${level}-mixed-auto-${ordinal}-c`,
        type: "trueFalse",
        prompt: "True or false: A detail can tell a small fact in a story.",
        options: ["True", "False"],
        answer: "True",
      },
    ];
  }

  return [
    {
      id: `level-${level}-linguistic-auto-${ordinal}-a`,
      type: "multipleChoice",
      prompt: "Which word names a person who helps learners in class?",
      options: ["teacher", "circle", "total", "before"],
      answer: "teacher",
    },
    {
      id: `level-${level}-linguistic-auto-${ordinal}-b`,
      type: "fillBlank",
      prompt: "Choose the best word: I ___ a book.",
      options: ["read", "add", "ten", "under"],
      answer: "read",
    },
    {
      id: `level-${level}-linguistic-auto-${ordinal}-c`,
      type: "trueFalse",
      prompt: "True or false: Explain means to tell how or why.",
      options: ["True", "False"],
      answer: "True",
    },
  ];
}

function createGeneratedLevelQuiz(
  level: number,
  ordinal: number,
  category: QuizPreset["category"]
): QuizPreset {
  const categoryLabel =
    category === "numeric" ? "Number" : category === "mixed" ? "Mixed" : "Word";

  return {
    id: `level-${level}-${category}-practice-${ordinal}`,
    title: `Level ${level} ${categoryLabel} Practice ${ordinal}`,
    description: `Extra ${categoryLabel.toLowerCase()} practice aligned with Level ${level} curriculum skills.`,
    category,
    quizType: getGeneratedQuizType(level, category),
    curriculumLevel: level,
    difficulty: getGeneratedDifficulty(level),
    unlockRequirements: {
      requiredLevel: level,
    },
    rewards: { xp: Math.min(18 + level * 2, 60) },
    questions: createGeneratedQuestions(level, category, ordinal),
  };
}

function buildLeveledQuizPresets(basePresets: QuizPreset[]) {
  const selectedPresets: QuizPreset[] = [];
  const countsByLevel = new Map<number, number>();
  const categoryCountsByLevel = new Map<
    number,
    Record<QuizPreset["category"], number>
  >();

  function getCategoryCounts(level: number) {
    const existing = categoryCountsByLevel.get(level);

    if (existing) {
      return existing;
    }

    const nextCounts = { linguistic: 0, mixed: 0, numeric: 0 };
    categoryCountsByLevel.set(level, nextCounts);
    return nextCounts;
  }

  basePresets.forEach((quiz) => {
    const targetCount = getTargetQuizCountForLevel(quiz.curriculumLevel);
    const currentCount = countsByLevel.get(quiz.curriculumLevel) ?? 0;

    if (quiz.curriculumLevel > MAX_CURRICULUM_LEVEL || currentCount >= targetCount) {
      return;
    }

    selectedPresets.push(quiz);
    countsByLevel.set(quiz.curriculumLevel, currentCount + 1);
    getCategoryCounts(quiz.curriculumLevel)[quiz.category] += 1;
  });

  for (let level = 1; level <= MAX_CURRICULUM_LEVEL; level += 1) {
    const targetCount = getTargetQuizCountForLevel(level);
    let currentCount = countsByLevel.get(level) ?? 0;

    while (currentCount < targetCount) {
      const categoryCounts = getCategoryCounts(level);
      const category = getGeneratedCategory(level, categoryCounts);
      const ordinal = currentCount + 1;
      const generatedQuiz = createGeneratedLevelQuiz(level, ordinal, category);

      selectedPresets.push(generatedQuiz);
      categoryCounts[category] += 1;
      currentCount += 1;
      countsByLevel.set(level, currentCount);
    }
  }

  return assignVocabularyBanksToQuizzes(selectedPresets).map(withStandardQuestionCount);
}

function getQuestionInteractionType(
  question: QuizPreset["questions"][number]
): QuizQuestionInteractionType {
  if (question.type === "fillBlank") {
    return "typed-answer";
  }

  if (question.type === "speechToText") {
    return "speech-response";
  }

  if (question.type === "textToSpeech" || question.type === "audioChoice") {
    return "audio-choice";
  }

  if (question.type === "ordering" || question.type === "dragDrop") {
    return "drag-sequence";
  }

  if (question.type === "matching") {
    return "tap-or-drag-match";
  }

  if (question.type === "imageChoice") {
    return "image-choice";
  }

  if (question.type === "wordProblem") {
    return "story-choice";
  }

  return "tap-choice";
}

function withQuestionInteractionTypes(quiz: QuizPreset): QuizPreset {
  return {
    ...quiz,
    questions: quiz.questions.map((question) => {
      const fillBlankWordBank =
        question.type === "fillBlank" &&
        !question.wordBank?.length &&
        question.options?.length
          ? { wordBank: question.options }
          : {};

      return {
        ...question,
        ...fillBlankWordBank,
        interactionType: question.interactionType ?? getQuestionInteractionType(question),
      };
    }),
  };
}

export const QUIZ_PRESETS: QuizPreset[] = buildLeveledQuizPresets(BASE_QUIZ_PRESETS)
  .map(withQuestionInteractionTypes)
  .map(withQuizContentStudyRequirements);
