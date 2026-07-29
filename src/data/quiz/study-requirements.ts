import type { QuizPreset, QuizQuestion, QuizType } from "@/src/data/quiz/types";
import {
  getVocabularyItemByWord,
  type VocabularyCategory,
} from "@/src/data/vocabulary";

const NUMBER_WORDS_BY_DIGIT: Record<string, string> = {
  "0": "Zero",
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "5": "Five",
  "6": "Six",
  "7": "Seven",
  "8": "Eight",
  "9": "Nine",
  "10": "Ten",
  "11": "Eleven",
  "12": "Twelve",
  "13": "Thirteen",
  "14": "Fourteen",
  "15": "Fifteen",
  "16": "Sixteen",
  "17": "Seventeen",
  "18": "Eighteen",
  "19": "Nineteen",
  "20": "Twenty",
};

const QUIZ_TYPE_STUDY_TERMS: Partial<Record<QuizType, string[]>> = {
  "audio-number-recognition": ["Number", "Listen"],
  "counting-objects": ["Count", "How Many"],
  "drag-and-drop-sentence": ["Sentence", "Order"],
  "image-to-number": ["Number", "Numeral"],
  "missing-word-number": ["Missing Number", "Number"],
  "number-matching": ["Match", "Number"],
  "number-to-word": ["Number", "Read the Number"],
  "ordering-numbers": ["Order", "Number"],
  "read-and-count": ["Read the Number", "Count"],
  "word-problem": ["Add", "Subtract", "Total"],
  "word-quantity-matching": ["Quantity", "Match"],
};

function normalizeStudyTerm(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function toStudyTerms(answer: QuizQuestion["answer"]) {
  return Array.isArray(answer) ? answer : [answer];
}

function cleanCandidateTerm(value: string) {
  return value
    .replace(/^picture\s+(?:clue\s+)?(?:of|for)\s+/i, "")
    .replace(/^which\s+word\s+(?:matches|is)\s+/i, "")
    .trim();
}

function resolveVocabularyWord(
  value: string,
  category: QuizPreset["category"]
) {
  const cleanedValue = cleanCandidateTerm(value);
  const digitWord = NUMBER_WORDS_BY_DIGIT[cleanedValue];
  const candidate = digitWord ?? cleanedValue;
  const vocabularyCategory: VocabularyCategory | undefined =
    category === "mixed" ? undefined : category;

  return getVocabularyItemByWord(candidate, vocabularyCategory)?.word;
}

function addCandidateWord(
  words: string[],
  seenWords: Set<string>,
  value: string | undefined,
  category: QuizPreset["category"]
) {
  if (!value?.trim()) {
    return;
  }

  const word = resolveVocabularyWord(value, category);

  if (!word) {
    return;
  }

  const normalizedWord = normalizeStudyTerm(word);

  if (seenWords.has(normalizedWord)) {
    return;
  }

  seenWords.add(normalizedWord);
  words.push(word);
}

function addQuestionStudyWords(
  question: QuizQuestion,
  category: QuizPreset["category"],
  words: string[],
  seenWords: Set<string>
) {
  question.wordBank?.forEach((word) =>
    addCandidateWord(words, seenWords, word, category)
  );
  question.options?.forEach((option) =>
    addCandidateWord(words, seenWords, option, category)
  );
  toStudyTerms(question.answer).forEach((answer) =>
    addCandidateWord(words, seenWords, answer, category)
  );

  if (question.audioText) {
    addCandidateWord(words, seenWords, question.audioText, category);
  }

  if (question.imageLabel) {
    addCandidateWord(words, seenWords, question.imageLabel, category);
  }

  question.pairs?.forEach((pair) => {
    addCandidateWord(words, seenWords, pair.word, category);

    if (pair.leftType === "word") {
      addCandidateWord(words, seenWords, pair.left, category);
    }

    if (pair.rightType === "word") {
      addCandidateWord(words, seenWords, pair.right, category);
    }
  });
}

export function getQuizContentStudyWords(quiz: Pick<QuizPreset, "category" | "questions" | "quizType">) {
  const words: string[] = [];
  const seenWords = new Set<string>();

  (QUIZ_TYPE_STUDY_TERMS[quiz.quizType] ?? []).forEach((term) =>
    addCandidateWord(words, seenWords, term, quiz.category)
  );

  quiz.questions.forEach((question) =>
    addQuestionStudyWords(question, quiz.category, words, seenWords)
  );

  return words;
}

export function withQuizContentStudyRequirements<T extends QuizPreset>(quiz: T): T {
  const requiredViewedSpecificWords = getQuizContentStudyWords(quiz);

  if (!requiredViewedSpecificWords.length) {
    return quiz;
  }

  return {
    ...quiz,
    unlockRequirements: {
      ...quiz.unlockRequirements,
      requiredViewedSpecificWords,
    },
  };
}
