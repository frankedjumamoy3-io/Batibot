import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/src/config/firebase";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import { apiRequest } from "@/src/infrastructure/api/client";
import type { QuizCategory } from "@/src/data/quiz/types";

type JsonRecord = Record<string, unknown>;

export interface LearnerQuestionResponse {
  answer: string;
  correct: boolean;
  correctAnswer: string;
  prompt: string;
  questionId: string;
}

export interface LearnerQuizAttemptInput {
  activityType?: "practice" | "challenge" | "quiz";
  attempts?: number;
  learnerUid: string;
  learnerEmail: string;
  learnerName: string;
  excludeFromAnalytics?: boolean;
  excludeFromLeaderboard?: boolean;
  isTestAccount?: boolean;
  quizId: string;
  quizTitle: string;
  category: QuizCategory;
  curriculumLevel: number;
  completed?: boolean;
  score: number;
  total: number;
  percentage: number;
  timeSpentSeconds?: number;
  topicId?: string;
  worldId?: string;
  responses: LearnerQuestionResponse[];
}

export interface LearnerQuizAttempt extends LearnerQuizAttemptInput {
  id: string;
  completedAt: string | null;
}

function toIsoDate(value: unknown) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toISOString();
  }

  return null;
}

function cleanString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeAttempt(id: string, data: JsonRecord): LearnerQuizAttempt {
  const responses = Array.isArray(data.responses)
    ? data.responses
        .filter((item): item is JsonRecord => !!item && typeof item === "object")
        .map((response) => ({
          answer: cleanString(response.answer),
          correct: response.correct === true,
          correctAnswer: cleanString(response.correctAnswer),
          prompt: cleanString(response.prompt),
          questionId: cleanString(response.questionId),
        }))
    : [];

  return {
    id,
    learnerUid: cleanString(data.learnerUid),
    learnerEmail: cleanString(data.learnerEmail),
    learnerName: cleanString(data.learnerName),
    excludeFromAnalytics: data.excludeFromAnalytics === true,
    excludeFromLeaderboard: data.excludeFromLeaderboard === true,
    isTestAccount: data.isTestAccount === true,
    activityType:
      data.activityType === "practice" || data.activityType === "challenge"
        ? data.activityType
        : "quiz",
    attempts: typeof data.attempts === "number" ? data.attempts : 1,
    quizId: cleanString(data.quizId),
    quizTitle: cleanString(data.quizTitle),
    category:
      data.category === "numeric" || data.category === "mixed"
        ? data.category
        : "linguistic",
    curriculumLevel:
      typeof data.curriculumLevel === "number" ? data.curriculumLevel : 1,
    completed: data.completed !== false,
    score: typeof data.score === "number" ? data.score : 0,
    total: typeof data.total === "number" ? data.total : 0,
    percentage: typeof data.percentage === "number" ? data.percentage : 0,
    timeSpentSeconds:
      typeof data.timeSpentSeconds === "number" ? data.timeSpentSeconds : undefined,
    topicId: cleanString(data.topicId),
    worldId: cleanString(data.worldId),
    responses,
    completedAt: toIsoDate(data.completedAt),
  };
}

export async function recordLearnerQuizAttempt(input: LearnerQuizAttemptInput) {
  if (USE_NODE_BACKEND) {
    if (input.quizId.startsWith("curated-")) {
      await apiRequest("/quiz-attempts", { method: "POST", body: { quizId: input.quizId.slice(8), score: input.score, totalQuestions: input.total } }).catch(() => undefined);
    }
    return;
  }
  if (input.excludeFromAnalytics === true || input.isTestAccount === true) {
    return;
  }

  await addDoc(collection(db, "quizAttempts"), {
    ...input,
    completedAt: serverTimestamp(),
  });
}

export async function getLearnerQuizAttempts(
  maxCount = 200,
  options: { includeTestAccounts?: boolean } = {}
) {
  if (USE_NODE_BACKEND) return [];
  const snapshot = await getDocs(
    query(
      collection(db, "quizAttempts"),
      orderBy("completedAt", "desc"),
      limit(maxCount)
    )
  );

  return snapshot.docs
    .map((attemptDoc) =>
      normalizeAttempt(attemptDoc.id, attemptDoc.data() as JsonRecord)
    )
    .filter(
      (attempt) =>
        options.includeTestAccounts === true ||
        (attempt.isTestAccount !== true &&
          attempt.excludeFromAnalytics !== true &&
          attempt.excludeFromLeaderboard !== true)
    );
}
