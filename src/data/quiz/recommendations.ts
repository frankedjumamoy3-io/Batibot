import {
  VOCABULARY_ITEMS,
  isVocabularyItemViewed,
  type VocabularyItem,
} from "@/src/data/vocabulary";
import { buildHelperQuiz } from "@/src/data/quiz/helper-quizzes";
import { isQuizUnlocked } from "@/src/data/quiz/unlock";
import type { QuizCategory, QuizPreset, QuizQuestion } from "@/src/data/quiz/types";
import type { LearnerProgressState } from "@/src/domain/entities/learner-progress";

const RECOMMENDED_WORD_LIMIT = 6;
const RECOMMENDED_QUIZ_LIMIT = 2;
const STRONG_REVIEW_THRESHOLD = 70;
const LIGHT_REVIEW_THRESHOLD = 90;

export type QuizRecommendationProgress = LearnerProgressState;

export interface QuizRecommendationResponse {
  answer: string;
  correct: boolean;
  correctAnswer: string;
  prompt: string;
  questionId: string;
}

export interface PersistedQuizPracticeRecommendation {
  category: QuizCategory;
  createdAt: string;
  curriculumLevel: number;
  id: string;
  message: string;
  missedQuestionIds: string[];
  percentage: number;
  recommendedQuizIds: string[];
  reviewOnlyQuizIds: string[];
  recommendedWordIds: string[];
  sourceQuizId: string;
  sourceQuizTitle: string;
}

export interface QuizPracticeQuizRecommendation {
  helperOnly: boolean;
  quiz: QuizPreset;
  reviewOnly: boolean;
}

export interface QuizPracticeRecommendation {
  category: QuizCategory;
  curriculumLevel: number;
  missedQuestionIds: string[];
  message: string;
  missedPrompts: string[];
  percentage: number;
  recommendedQuizzes: QuizPracticeQuizRecommendation[];
  recommendedWords: VocabularyItem[];
  sourceQuiz: QuizPreset;
}

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasWordPhrase(text: string, word: string) {
  const normalizedText = normalizeText(text);
  const normalizedWord = normalizeText(word);

  if (!normalizedText || !normalizedWord) {
    return false;
  }

  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizedWord)}([^a-z0-9]|$)`).test(
    normalizedText
  );
}

function answerValues(answer: QuizQuestion["answer"]) {
  return Array.isArray(answer) ? answer : [answer];
}

function matchesQuizCategory(item: VocabularyItem, category: QuizCategory) {
  return category === "mixed" || item.category === category;
}

function uniqueById(items: VocabularyItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

function findVocabularyFromText(text: string, category: QuizCategory) {
  return VOCABULARY_ITEMS.filter(
    (item) => matchesQuizCategory(item, category) && hasWordPhrase(text, item.word)
  );
}

function findVocabularyFromAnswer(answer: string, category: QuizCategory) {
  const normalizedAnswer = normalizeText(answer);

  return VOCABULARY_ITEMS.filter(
    (item) =>
      matchesQuizCategory(item, category) &&
      [item.word, item.id, ...item.legacyIds].some(
        (candidate) => normalizeText(candidate) === normalizedAnswer
      )
  );
}

function getQuestionTextSources(question: QuizQuestion | undefined, response: QuizRecommendationResponse) {
  if (!question) {
    return [response.correctAnswer, response.prompt];
  }

  return [
    response.correctAnswer,
    response.prompt,
    question.prompt,
    question.helperText,
    question.imageLabel,
    question.audioText,
    ...(question.options ?? []),
    ...(question.wordBank ?? []),
    ...answerValues(question.answer),
  ].filter((value): value is string => typeof value === "string" && value.length > 0);
}

function getRecommendedWords({
  category,
  missedResponses,
  questionsById,
  progress,
}: {
  category: QuizCategory;
  missedResponses: QuizRecommendationResponse[];
  questionsById: Map<string, QuizQuestion>;
  progress: QuizRecommendationProgress;
}) {
  const directWords = missedResponses.flatMap((response) =>
    response.correctAnswer
      .split(",")
      .flatMap((answer) => findVocabularyFromAnswer(answer, category))
  );
  const contextualWords = missedResponses.flatMap((response) =>
    findVocabularyFromText(
      getQuestionTextSources(questionsById.get(response.questionId), response).join(" "),
      category
    )
  );
  const seedWords = uniqueById([...directWords, ...contextualWords]);
  const seedSubcategories = new Set(seedWords.map((word) => word.subcategory));
  const viewedWordIds = [...progress.viewedWordIds, ...progress.viewedWords];
  const relatedWords = VOCABULARY_ITEMS.filter(
    (item) =>
      matchesQuizCategory(item, category) &&
      seedSubcategories.has(item.subcategory) &&
      !seedWords.some((seedWord) => seedWord.id === item.id)
  ).sort((left, right) => {
    const leftViewed = isVocabularyItemViewed(left, viewedWordIds);
    const rightViewed = isVocabularyItemViewed(right, viewedWordIds);

    if (leftViewed === rightViewed) {
      return left.word.localeCompare(right.word);
    }

    return leftViewed ? 1 : -1;
  });

  return uniqueById([...seedWords, ...relatedWords]).slice(0, RECOMMENDED_WORD_LIMIT);
}

function getRecommendedQuizzes({
  missedQuestionIds,
  percentage,
  progress,
  quiz,
  quizPresets,
}: {
  missedQuestionIds: string[];
  percentage: number;
  progress: QuizRecommendationProgress;
  quiz: QuizPreset;
  quizPresets: QuizPreset[];
}) {
  const levelLimit =
    percentage < STRONG_REVIEW_THRESHOLD
      ? quiz.curriculumLevel
      : quiz.curriculumLevel + 1;
  const dedicatedHelperQuiz =
    missedQuestionIds.length > 0
      ? [
          {
            helperOnly: true,
            quiz: buildHelperQuiz(quiz, {
              missedQuestionIds,
              percentage,
              progress,
            }),
            reviewOnly: true,
          },
        ]
      : [];

  const relatedQuizzes = quizPresets
    .filter(
      (candidate) =>
        candidate.id !== quiz.id &&
        candidate.curriculumLevel <= levelLimit &&
        (quiz.category === "mixed" ||
          candidate.category === quiz.category ||
          candidate.category === "mixed")
    )
    .map((candidate) => ({
      helperOnly: false,
      quiz: candidate,
      reviewOnly: !isQuizUnlocked(candidate, progress),
    }))
    .sort((leftRecommendation, rightRecommendation) => {
      const left = leftRecommendation.quiz;
      const right = rightRecommendation.quiz;
      const leftSameCategory = left.category === quiz.category ? 1 : 0;
      const rightSameCategory = right.category === quiz.category ? 1 : 0;
      const leftCompleted =
        progress.completedQuizIds.includes(left.id) ||
        progress.completedQuizzes.includes(left.id);
      const rightCompleted =
        progress.completedQuizIds.includes(right.id) ||
        progress.completedQuizzes.includes(right.id);

      if (leftRecommendation.reviewOnly !== rightRecommendation.reviewOnly) {
        return leftRecommendation.reviewOnly ? 1 : -1;
      }

      if (leftSameCategory !== rightSameCategory) {
        return rightSameCategory - leftSameCategory;
      }

      if (leftCompleted !== rightCompleted) {
        return leftCompleted ? 1 : -1;
      }

      return Math.abs(left.curriculumLevel - quiz.curriculumLevel) -
        Math.abs(right.curriculumLevel - quiz.curriculumLevel);
    })
    .slice(0, Math.max(0, RECOMMENDED_QUIZ_LIMIT - dedicatedHelperQuiz.length));

  return [...dedicatedHelperQuiz, ...relatedQuizzes];
}

function getPracticeMessage(percentage: number) {
  if (percentage < STRONG_REVIEW_THRESHOLD) {
    return "Let's practice these first, then try again.";
  }

  if (percentage < LIGHT_REVIEW_THRESHOLD) {
    return "You're close. A quick review can make the next try smoother.";
  }

  return "Strong work. These can help you keep the skill fresh.";
}

export function buildQuizPracticeRecommendation({
  progress,
  quiz,
  quizPresets,
  responses,
  score,
}: {
  progress: QuizRecommendationProgress;
  quiz: QuizPreset;
  quizPresets: QuizPreset[];
  responses: QuizRecommendationResponse[];
  score: number;
}) {
  const missedResponses = responses.filter((response) => !response.correct);
  const percentage = quiz.questions.length
    ? Math.round((score / quiz.questions.length) * 100)
    : 0;

  if (!missedResponses.length && percentage >= LIGHT_REVIEW_THRESHOLD) {
    return null;
  }

  const questionsById = new Map(quiz.questions.map((question) => [question.id, question]));
  const recommendedWords = getRecommendedWords({
    category: quiz.category,
    missedResponses,
    questionsById,
    progress,
  });
  const recommendedQuizzes = getRecommendedQuizzes({
    missedQuestionIds: missedResponses.map((response) => response.questionId),
    percentage,
    progress,
    quiz,
    quizPresets,
  });

  if (!recommendedWords.length && !recommendedQuizzes.length) {
    return null;
  }

  return {
    category: quiz.category,
    curriculumLevel: quiz.curriculumLevel,
    missedQuestionIds: missedResponses.map((response) => response.questionId),
    message: getPracticeMessage(percentage),
    missedPrompts: missedResponses.map((response) => response.prompt),
    percentage,
    recommendedQuizzes,
    recommendedWords,
    sourceQuiz: quiz,
  } satisfies QuizPracticeRecommendation;
}

export function toPersistedQuizPracticeRecommendation(
  recommendation: QuizPracticeRecommendation
): PersistedQuizPracticeRecommendation {
  const now = new Date().toISOString();

  return {
    category: recommendation.category,
    createdAt: now,
    curriculumLevel: recommendation.curriculumLevel,
    id: `${recommendation.sourceQuiz.id}-${Date.now()}`,
    message: recommendation.message,
    missedQuestionIds: recommendation.missedQuestionIds,
    percentage: recommendation.percentage,
    recommendedQuizIds: recommendation.recommendedQuizzes.map(({ quiz }) => quiz.id),
    reviewOnlyQuizIds: recommendation.recommendedQuizzes
      .filter((item) => item.reviewOnly || item.helperOnly)
      .map(({ quiz }) => quiz.id),
    recommendedWordIds: recommendation.recommendedWords.map((word) => word.id),
    sourceQuizId: recommendation.sourceQuiz.id,
    sourceQuizTitle: recommendation.sourceQuiz.title,
  };
}
