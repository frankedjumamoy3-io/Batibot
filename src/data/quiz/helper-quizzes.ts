import {
  VOCABULARY_ITEMS,
  isVocabularyItemViewed,
  type VocabularyItem,
} from "@/src/data/vocabulary";
import type { QuizCategory, QuizPreset, QuizQuestion } from "@/src/data/quiz/types";
import type { LearnerProgressState } from "@/src/domain/entities/learner-progress";

const SUBCATEGORY_HELPER_LABELS: Record<string, string> = {
  adding: "addition word",
  animals: "animal word",
  comparing: "comparing word",
  counting: "counting word",
  nature: "nature word",
  plants: "plant word",
  shapes: "shape word",
  things: "everyday object word",
};

interface BuildHelperQuizOptions {
  missedQuestionIds?: string[];
  percentage?: number;
  progress?: LearnerProgressState;
}

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function answerValues(question: QuizQuestion) {
  return Array.isArray(question.answer) ? question.answer : [question.answer];
}

function getPrimaryAnswer(question: QuizQuestion) {
  return answerValues(question).find((answer) => typeof answer === "string") ?? "";
}

function getTextOptions(question: QuizQuestion) {
  return question.options ?? question.wordBank ?? [];
}

function uniqueOptions(options: string[], answer: string) {
  return Array.from(new Set([answer, ...options.filter((option) => option !== answer)])).slice(0, 4);
}

function stripPromptPrefix(prompt: string) {
  return prompt
    .replace(/^true\s+or\s+false:\s*/i, "")
    .replace(/[?.!]\s*$/, "")
    .trim();
}

function getSubcategoryLabel(item: VocabularyItem) {
  return SUBCATEGORY_HELPER_LABELS[item.subcategory] ?? `${item.subcategory} word`;
}

function getMeaningWithoutAnswer(item: VocabularyItem) {
  const escapedWord = item.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const cleanedDefinition = item.definition
    .replace(new RegExp(`^(?:an?|the)\\s+${escapedWord}\\s+is\\s+`, "i"), "")
    .replace(new RegExp(`^${escapedWord}\\s+is\\s+`, "i"), "")
    .replace(/[.?!]\s*$/, "")
    .trim();

  return cleanedDefinition || item.definition.replace(/[.?!]\s*$/, "");
}

function matchesQuizCategory(item: VocabularyItem, category: QuizCategory) {
  return category === "mixed" || item.category === category;
}

function findVocabularyAnswer(question: QuizQuestion, category: QuizCategory) {
  const answer = normalizeText(getPrimaryAnswer(question));

  if (!answer) {
    return null;
  }

  return (
    VOCABULARY_ITEMS.find(
      (item) =>
        matchesQuizCategory(item, category) &&
        [item.id, item.word, ...item.legacyIds].some(
          (candidate) => normalizeText(candidate) === answer
        )
    ) ?? null
  );
}

function getAlternativeOptions(item: VocabularyItem, category: QuizCategory) {
  return VOCABULARY_ITEMS.filter(
    (candidate) =>
      candidate.id !== item.id &&
      matchesQuizCategory(candidate, category) &&
      candidate.subcategory === item.subcategory
  )
    .slice(0, 3)
    .map((candidate) => candidate.word);
}

function getMeaningOptions(item: VocabularyItem, category: QuizCategory) {
  return VOCABULARY_ITEMS.filter(
    (candidate) =>
      candidate.id !== item.id &&
      matchesQuizCategory(candidate, category) &&
      candidate.subcategory === item.subcategory
  )
    .slice(0, 3)
    .map(getMeaningWithoutAnswer);
}

function getNumbersFromPrompt(prompt: string) {
  return (prompt.match(/\d+/g) ?? []).map(Number);
}

function isAdditionPrompt(prompt: string) {
  return /\b(add|added|more|altogether|total|sum|in all|now)\b/i.test(prompt);
}

function isSubtractionPrompt(prompt: string) {
  return /\b(left|away|taken|subtract|less|fewer)\b/i.test(prompt);
}

function createNumberOptions(answer: number) {
  return uniqueOptions(
    [
      `${Math.max(0, answer - 1)}`,
      `${answer + 1}`,
      `${answer + 2}`,
      `${Math.max(0, answer - 2)}`,
    ],
    `${answer}`
  );
}

function getReverseStatement(statement: string) {
  const greaterThanMatch = statement.match(/^(.+?)\s+is\s+greater\s+than\s+(.+)$/i);

  if (greaterThanMatch) {
    return `A number greater than ${greaterThanMatch[2]} is ${greaterThanMatch[1]}.`;
  }

  const lessThanMatch = statement.match(/^(.+?)\s+is\s+less\s+than\s+(.+)$/i);

  if (lessThanMatch) {
    return `A number less than ${lessThanMatch[2]} is ${lessThanMatch[1]}.`;
  }

  const definitionMatch = statement.match(/^to\s+(.+?)\s+is\s+to\s+(.+)$/i);

  if (definitionMatch) {
    return `A word for "${definitionMatch[2]}" is ${definitionMatch[1]}.`;
  }

  const categoryMatch = statement.match(/^(?:an?|the)\s+(.+?)\s+is\s+(?:an?|the)\s+(.+)$/i);

  if (categoryMatch) {
    return `An example of ${categoryMatch[2]} is ${categoryMatch[1]}.`;
  }

  return null;
}

function getHelperText({
  mode,
  sourcePrompt,
  viewed,
}: {
  mode: "bridge" | "guided";
  sourcePrompt?: string;
  viewed: boolean | null;
}) {
  if (viewed === false) {
    return "This helper reviews a missed question with a word you may not have opened yet. Read the clue slowly, then choose the answer that matches.";
  }

  if (mode === "guided") {
    return sourcePrompt
      ? `Helper for: ${sourcePrompt}`
      : "This is a simpler helper version of a missed question.";
  }

  return sourcePrompt
    ? `Review the same idea from: ${sourcePrompt}`
    : "This reviews the same missed idea in a new way.";
}

function toReverseTrueFalseQuestion({
  mode,
  question,
  sourceQuiz,
  viewed,
}: {
  mode: "bridge" | "guided";
  question: QuizQuestion;
  sourceQuiz: QuizPreset;
  viewed: boolean | null;
}): QuizQuestion | null {
  const vocabularyAnswer = findVocabularyAnswer(question, sourceQuiz.category);

  if (vocabularyAnswer) {
    return {
      ...question,
      answer: "True",
      helperText: getHelperText({ mode, sourcePrompt: question.prompt, viewed }),
      id: `${question.id}-helper-reverse`,
      options: ["True", "False"],
      prompt: `True or false: An example of ${getSubcategoryLabel(vocabularyAnswer)} is ${vocabularyAnswer.word}.`,
      type: "trueFalse",
    };
  }

  if (question.type !== "trueFalse") {
    return null;
  }

  const reverseStatement = getReverseStatement(stripPromptPrefix(question.prompt));

  if (!reverseStatement) {
    return null;
  }

  return {
    ...question,
    helperText: getHelperText({ mode, sourcePrompt: question.prompt, viewed }),
    id: `${question.id}-helper-reverse`,
    options: ["True", "False"],
    prompt: `True or false: ${reverseStatement}`,
    type: "trueFalse",
  };
}

function toMeaningBridgeQuestion({
  mode,
  question,
  sourceQuiz,
  viewed,
}: {
  mode: "bridge" | "guided";
  question: QuizQuestion;
  sourceQuiz: QuizPreset;
  viewed: boolean | null;
}): QuizQuestion | null {
  const vocabularyAnswer = findVocabularyAnswer(question, sourceQuiz.category);

  if (!vocabularyAnswer) {
    return null;
  }

  const meaning = getMeaningWithoutAnswer(vocabularyAnswer);

  if (mode === "guided") {
    return {
      ...question,
      answer: "True",
      helperText: getHelperText({ mode, sourcePrompt: question.prompt, viewed }),
      id: `${question.id}-helper-meaning-check`,
      options: ["True", "False"],
      prompt: `True or false: ${vocabularyAnswer.word} means ${meaning}.`,
      type: "trueFalse",
    };
  }

  const options = uniqueOptions(
    getMeaningOptions(vocabularyAnswer, sourceQuiz.category),
    meaning
  );

  if (options.length < 2) {
    return null;
  }

  return {
    ...question,
    answer: meaning,
    helperText: getHelperText({ mode, sourcePrompt: question.prompt, viewed }),
    id: `${question.id}-helper-word-to-meaning`,
    options,
    prompt: `What does ${vocabularyAnswer.word} mean?`,
    type: "multipleChoice",
  };
}

function toChoiceBridgeQuestion({
  mode,
  question,
  sourceQuiz,
  viewed,
}: {
  mode: "bridge" | "guided";
  question: QuizQuestion;
  sourceQuiz: QuizPreset;
  viewed: boolean | null;
}): QuizQuestion | null {
  const vocabularyAnswer = findVocabularyAnswer(question, sourceQuiz.category);

  if (!vocabularyAnswer || mode === "guided") {
    return null;
  }

  const options = [vocabularyAnswer.word, ...getAlternativeOptions(vocabularyAnswer, sourceQuiz.category)];

  if (options.length < 2) {
    return null;
  }

  return {
    ...question,
    answer: vocabularyAnswer.word,
    helperText: getHelperText({ mode, sourcePrompt: question.prompt, viewed }),
    id: `${question.id}-helper-bridge`,
    options,
    prompt: `Which word is an example of ${getSubcategoryLabel(vocabularyAnswer)}?`,
    type: "multipleChoice",
  };
}

function toNumberBridgeQuestion({
  mode,
  question,
}: {
  mode: "bridge" | "guided";
  question: QuizQuestion;
}): QuizQuestion | null {
  const numbers = getNumbersFromPrompt(question.prompt);
  const answer = Number(getPrimaryAnswer(question));

  if (!Number.isFinite(answer) || numbers.length < 2) {
    return null;
  }

  const [first, second] = numbers;

  if (isAdditionPrompt(question.prompt)) {
    const added = Math.max(0, answer - first);

    if (mode === "guided") {
      return {
        ...question,
        answer: `${answer}`,
        helperText: "Use the same adding idea, but with a shorter story.",
        id: `${question.id}-helper-add-short`,
        options: createNumberOptions(answer),
        prompt: `${first} and ${added} more make how many?`,
        type: "wordProblem",
      };
    }

    return {
      ...question,
      answer: `${added}`,
      helperText: "Think backward from the total to find the missing added group.",
      id: `${question.id}-helper-add-reverse`,
      options: createNumberOptions(added),
      prompt: `A learner has ${first} counters. The total becomes ${answer}. How many counters were added?`,
      type: "wordProblem",
    };
  }

  if (isSubtractionPrompt(question.prompt)) {
    const start = Math.max(first, second);
    const movedAway = Math.max(0, start - answer);

    if (mode === "guided") {
      return {
        ...question,
        answer: `${answer}`,
        helperText: "Use the same take-away idea with a shorter story.",
        id: `${question.id}-helper-subtract-short`,
        options: createNumberOptions(answer),
        prompt: `${start} take away ${movedAway}. How many are left?`,
        type: "wordProblem",
      };
    }

    return {
      ...question,
      answer: `${movedAway}`,
      helperText: "Think backward: start amount minus missing amount equals what is left.",
      id: `${question.id}-helper-subtract-reverse`,
      options: createNumberOptions(movedAway),
      prompt: `There were ${start} blocks. Now ${answer} blocks are left. How many blocks moved away?`,
      type: "wordProblem",
    };
  }

  return null;
}

function toTrueFalseLogicBridgeQuestion({
  mode,
  question,
}: {
  mode: "bridge" | "guided";
  question: QuizQuestion;
}): QuizQuestion | null {
  if (question.type !== "trueFalse") {
    return null;
  }

  const numbers = getNumbersFromPrompt(question.prompt);

  if (numbers.length >= 2 && /\b(more|greater|bigger)\b/i.test(question.prompt)) {
    const left = Math.max(numbers[0], numbers[1]);
    const right = Math.min(numbers[0], numbers[1]);

    return {
      ...question,
      answer: "True",
      helperText: getHelperText({ mode, sourcePrompt: question.prompt, viewed: null }),
      id: `${question.id}-helper-less-than`,
      options: ["True", "False"],
      prompt: `True or false: ${right} is less than ${left}.`,
      type: "trueFalse",
    };
  }

  const reverseStatement = getReverseStatement(stripPromptPrefix(question.prompt));

  if (!reverseStatement) {
    return null;
  }

  return {
    ...question,
    answer: "True",
    helperText: getHelperText({ mode, sourcePrompt: question.prompt, viewed: null }),
    id: `${question.id}-helper-logic-reverse`,
    options: ["True", "False"],
    prompt: `True or false: ${reverseStatement}`,
    type: "trueFalse",
  };
}

function toMatchingBridgeQuestion({
  mode,
  question,
}: {
  mode: "bridge" | "guided";
  question: QuizQuestion;
}): QuizQuestion | null {
  const pair = question.pairs?.[0];

  if (!pair) {
    return null;
  }

  return {
    ...question,
    answer: "True",
    helperText: getHelperText({ mode, sourcePrompt: question.prompt, viewed: null }),
    id: `${question.id}-helper-match-check`,
    options: ["True", "False"],
    prompt: `True or false: ${pair.left} matches ${pair.right}.`,
    type: "trueFalse",
  };
}

function toOrderingBridgeQuestion({
  mode,
  question,
}: {
  mode: "bridge" | "guided";
  question: QuizQuestion;
}): QuizQuestion | null {
  const orderedAnswer = Array.isArray(question.answer)
    ? question.answer
    : question.answer.split(",").map((item) => item.trim());

  if (orderedAnswer.length < 2) {
    return null;
  }

  const firstAnswer = orderedAnswer[0];
  const lastAnswer = orderedAnswer[orderedAnswer.length - 1];

  return {
    ...question,
    answer: firstAnswer,
    helperText: getHelperText({ mode, sourcePrompt: question.prompt, viewed: null }),
    id: `${question.id}-helper-order-first`,
    options: uniqueOptions([lastAnswer, ...getTextOptions(question)], firstAnswer),
    prompt: `When these are in order, which one comes first?`,
    type: "multipleChoice",
  };
}

function toHelperQuestion(
  question: QuizQuestion,
  sourceQuiz: QuizPreset,
  options: BuildHelperQuizOptions
): QuizQuestion {
  const priorBest = options.progress?.quizScores[sourceQuiz.id]?.bestPercentage ?? 0;
  const needsGuidedSupport =
    sourceQuiz.curriculumLevel <= 2 ||
    (options.percentage ?? 100) < 50 ||
    priorBest < 50;
  const mode = needsGuidedSupport ? "guided" : "bridge";
  const vocabularyAnswer = findVocabularyAnswer(question, sourceQuiz.category);
  const viewedWordIds = [
    ...(options.progress?.viewedWordIds ?? []),
    ...(options.progress?.viewedWords ?? []),
  ];
  const viewed = vocabularyAnswer
    ? isVocabularyItemViewed(vocabularyAnswer, viewedWordIds)
    : null;
  const bridgeQuestion =
    toMeaningBridgeQuestion({ mode, question, sourceQuiz, viewed }) ??
    toNumberBridgeQuestion({ mode, question }) ??
    toMatchingBridgeQuestion({ mode, question }) ??
    toOrderingBridgeQuestion({ mode, question }) ??
    toTrueFalseLogicBridgeQuestion({ mode, question }) ??
    toChoiceBridgeQuestion({ mode, question, sourceQuiz, viewed }) ??
    toReverseTrueFalseQuestion({ mode, question, sourceQuiz, viewed });

  if (bridgeQuestion) {
    return bridgeQuestion;
  }

  return {
    ...question,
    helperText: getHelperText({ mode, sourcePrompt: question.prompt, viewed }),
    id: `${question.id}-helper`,
  };
}

export function getHelperQuizId(sourceQuizId: string) {
  return `${sourceQuizId}-helper-review`;
}

export function isHelperQuizId(quizId: string) {
  return quizId.endsWith("-helper-review");
}

export function getSourceQuizIdFromHelperQuizId(helperQuizId: string) {
  return isHelperQuizId(helperQuizId)
    ? helperQuizId.replace(/-helper-review$/, "")
    : helperQuizId;
}

function getHelperQuestions(sourceQuiz: QuizPreset, options: BuildHelperQuizOptions) {
  const missedQuestions = (options.missedQuestionIds ?? [])
    .map((questionId) =>
      sourceQuiz.questions.find((question) => question.id === questionId)
    )
    .filter((question): question is QuizQuestion => Boolean(question));
  const selectedQuestions = (
    missedQuestions.length ? missedQuestions : sourceQuiz.questions
  ).filter(
    (question, index, questions) =>
      questions.findIndex((candidate) => candidate.id === question.id) === index
  );

  return selectedQuestions.map((question) => toHelperQuestion(question, sourceQuiz, options));
}

export function buildHelperQuiz(
  sourceQuiz: QuizPreset,
  options: BuildHelperQuizOptions = {}
): QuizPreset {
  return {
    ...sourceQuiz,
    description: `A gentle review for ${sourceQuiz.title}. Helper questions are built from the exact questions the learner missed.`,
    difficulty: sourceQuiz.difficulty === "beginner" ? "beginner" : "easy",
    id: getHelperQuizId(sourceQuiz.id),
    questions: getHelperQuestions(sourceQuiz, options),
    rewards: {
      xp: 0,
      unlockMessage: "Review-only helper quiz.",
    },
    title: `Helper: ${sourceQuiz.title}`,
    unlockRequirements: undefined,
  };
}
