import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/src/config/firebase";
import { withQuizContentStudyRequirements } from "@/src/data/quiz/study-requirements";
import {
  QUIZ_INTERACTION_TYPES,
  normalizeLearnerLevelValue,
} from "@/src/types/quiz";
import type {
  QuizPreset,
  QuizQuestion,
  QuizType,
} from "@/src/data/quiz/types";
import type {
  CuratedQuiz,
  CuratedQuizQuestion,
  FillInTheBlankQuestion,
  MatchingPair,
  MatchingQuestion,
  MultipleChoiceQuestion,
  QuizInteractionType,
  QuizLayoutType,
} from "@/src/types/quiz";
import type { LearnerGradeLevel } from "@/src/types/user";
import {
  normalizeActivityConcept,
  validateActivityCorrectAnswer,
} from "@/src/domain/rules/activity-integrity-rules";

type JsonRecord = Record<string, unknown>;

const CHOICE_BASED_LAYOUTS: QuizLayoutType[] = [
  "multiple-choice",
  "true-or-false",
  "word-problem",
  "text-to-speech",
  "speech-to-text",
  "image-choice",
  "timed-challenge",
  "ordering",
  "counting-objects",
  "compare-numbers",
  "picture-based",
  "scenario",
];

const FORBIDDEN_LEARNER_TEXT =
  /activity updating|image being added|coming soon|asset missing|placeholder|under construction|content unavailable|developer preview|draft content|awaiting asset|pending upload/i;

function cleanString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function cleanStringArray(value: unknown) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        .map((item) => item.trim())
    : [];
}

function hasLearnerUnsafeText(...values: string[]) {
  return values.some((value) => FORBIDDEN_LEARNER_TEXT.test(value));
}

function getInteractionTypeForLayout(type: QuizLayoutType): QuizInteractionType {
  if (type === "fill-in-the-blank") {
    return "typed-answer";
  }

  if (type === "speech-to-text") {
    return "speech-response";
  }

  if (type === "text-to-speech") {
    return "audio-choice";
  }

  if (type === "ordering") {
    return "drag-sequence";
  }

  if (type === "matching" || type === "image-to-word" || type === "word-to-image") {
    return "tap-or-drag-match";
  }

  if (
    type === "image-choice" ||
    type === "picture-based" ||
    type === "counting-objects"
  ) {
    return "image-choice";
  }

  if (type === "word-problem" || type === "scenario") {
    return "story-choice";
  }

  return "tap-choice";
}

function normalizeInteractionType(
  value: unknown,
  layoutType: QuizLayoutType
): QuizInteractionType {
  return typeof value === "string" &&
    QUIZ_INTERACTION_TYPES.includes(value as QuizInteractionType)
    ? (value as QuizInteractionType)
    : getInteractionTypeForLayout(layoutType);
}

function normalizeCuratedQuestion(value: unknown, index: number): CuratedQuizQuestion | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const question = value as JsonRecord;
  const type = question.type;

  if (typeof type === "string" && CHOICE_BASED_LAYOUTS.includes(type as QuizLayoutType)) {
    const options =
      type === "true-or-false"
        ? cleanStringArray(question.options).length
          ? cleanStringArray(question.options)
          : ["True", "False"]
        : cleanStringArray(question.options);
    const answer = cleanString(question.answer);
    const prompt = cleanString(question.prompt, `Question ${index + 1}`);
    const needsOptions = type !== "speech-to-text";

    if (
      (needsOptions && options.length < 2) ||
      !answer ||
      hasLearnerUnsafeText(prompt, answer, ...options)
    ) {
      return null;
    }

    if (
      type !== "speech-to-text" &&
      type !== "ordering" &&
      !validateActivityCorrectAnswer({ choices: options, correctAnswer: answer }).valid
    ) {
      return null;
    }

    return {
      id: cleanString(question.id, `question-${index + 1}`),
      type: type as MultipleChoiceQuestion["type"],
      interactionType: normalizeInteractionType(question.interactionType, type as QuizLayoutType),
      prompt,
      options,
      answer,
      audioText: cleanString(question.audioText),
      explanation: cleanString(question.explanation),
      helperText: cleanString(question.helperText),
      imageLabel: cleanString(question.imageLabel),
    };
  }

  if (type === "fill-in-the-blank") {
    const answer = cleanString(question.answer);
    const sentence = cleanString(question.sentence);
    const prompt = cleanString(question.prompt, `Question ${index + 1}`);
    const wordBank = cleanStringArray(question.wordBank);

    if (
      !answer ||
      !sentence ||
      hasLearnerUnsafeText(prompt, sentence, answer, ...wordBank) ||
      !validateActivityCorrectAnswer({ choices: wordBank, correctAnswer: answer }).valid
    ) {
      return null;
    }

    return {
      id: cleanString(question.id, `question-${index + 1}`),
      type,
      interactionType: normalizeInteractionType(question.interactionType, type),
      prompt,
      sentence,
      answer,
      wordBank,
      explanation: cleanString(question.explanation),
    };
  }

  if (type === "matching" || type === "image-to-word" || type === "word-to-image") {
    const pairs = Array.isArray(question.pairs)
      ? question.pairs
          .map((pair): MatchingPair | null => {
            if (!pair || typeof pair !== "object") {
              return null;
            }

            const item = pair as JsonRecord;
            const word = cleanString(item.word);
            const imagePrompt = cleanString(item.imagePrompt);
            const altText = cleanString(item.altText);
            const left = cleanString(item.left, type === "image-to-word" ? imagePrompt || altText : word);
            const right = cleanString(item.right, type === "word-to-image" ? imagePrompt || altText : word);

            const leftType: MatchingPair["leftType"] =
              item.leftType === "image" || item.leftType === "word" || item.leftType === "text"
                ? item.leftType
                : type === "image-to-word"
                  ? "image"
                  : type === "word-to-image"
                    ? "word"
                    : "text";
            const rightType: MatchingPair["rightType"] =
              item.rightType === "image" || item.rightType === "word" || item.rightType === "text"
                ? item.rightType
                : type === "image-to-word"
                  ? "word"
                  : type === "word-to-image"
                    ? "image"
                    : "text";

            return left && right
              ? {
                  left,
                  right,
                  leftType,
                  rightType,
                  ...(word ? { word } : {}),
                  ...(imagePrompt ? { imagePrompt } : {}),
                  ...(altText ? { altText } : {}),
                  ...(cleanString(item.assetId) ? { assetId: cleanString(item.assetId) } : {}),
                }
              : null;
          })
          .filter((pair): pair is MatchingPair => !!pair)
      : [];

    if (pairs.length < 2) {
      return null;
    }

    const normalizedLeft = pairs.map((pair) => normalizeActivityConcept(pair.left));
    const normalizedRight = pairs.map((pair) => normalizeActivityConcept(pair.right));
    const prompt = cleanString(question.prompt, `Question ${index + 1}`);

    if (
      new Set(normalizedLeft).size !== normalizedLeft.length ||
      new Set(normalizedRight).size !== normalizedRight.length ||
      hasLearnerUnsafeText(
        prompt,
        ...pairs.flatMap((pair) => [
          pair.left,
          pair.right,
          pair.altText ?? "",
          pair.imagePrompt ?? "",
        ])
      )
    ) {
      return null;
    }

    return {
      id: cleanString(question.id, `question-${index + 1}`),
      type:
        type === "image-to-word" || type === "word-to-image" || type === "matching"
          ? type
          : "matching",
      interactionType: normalizeInteractionType(question.interactionType, type as QuizLayoutType),
      prompt,
      instruction: cleanString(question.instruction, "Match each item with its pair."),
      pairs,
      explanation: cleanString(question.explanation),
    };
  }

  return null;
}

function normalizeCuratedQuiz(id: string, data: JsonRecord): CuratedQuiz | null {
  const questions = Array.isArray(data.questions)
    ? data.questions
        .map(normalizeCuratedQuestion)
        .filter((question): question is CuratedQuizQuestion => !!question)
    : [];

  if (!questions.length || data.status !== "published") {
    return null;
  }

  return {
    id,
    ageGroup: cleanString(data.ageGroup, "Preschool to Grade 3"),
    category:
      data.category === "numeric" || data.category === "mixed"
        ? data.category
        : "linguistic",
    createdAt: null,
    createdByEmail: cleanString(data.createdByEmail),
    createdByUid: cleanString(data.createdByUid),
    createdWith: "gemini",
    curriculumLevel:
      typeof data.curriculumLevel === "number" && data.curriculumLevel >= 1
        ? data.curriculumLevel
        : 1,
    difficulty:
      data.difficulty === "easy" ||
      data.difficulty === "medium" ||
      data.difficulty === "advanced" ||
      data.difficulty === "mastery"
        ? data.difficulty
        : "beginner",
    learnerLevel: normalizeLearnerLevelValue(data.learnerLevel),
    gradeLevel: normalizeLearnerLevelValue(data.gradeLevel || data.learnerLevel),
    worldId: cleanString(data.worldId),
    topicId: cleanString(data.topicId),
    phase:
      data.phase === "Discover" ||
      data.phase === "Explore" ||
      data.phase === "Interact" ||
      data.phase === "Practice" ||
      data.phase === "Challenge" ||
      data.phase === "Reward" ||
      data.phase === "Progress" ||
      data.phase === "Mastery"
        ? data.phase
        : undefined,
    node:
      typeof data.node === "number" && Number.isFinite(data.node)
        ? Math.max(1, Math.round(data.node))
        : 1,
    assetId: cleanString(data.assetId),
    unlockRewardMapping: cleanString(data.unlockRewardMapping),
    mobilePreviewChecked: data.mobilePreviewChecked === true,
    previewCheckedAt:
      typeof data.previewCheckedAt === "string" ? data.previewCheckedAt : null,
    previewCheckedByUid:
      typeof data.previewCheckedByUid === "string" ? data.previewCheckedByUid : null,
    instructions: cleanString(data.instructions, "Answer each question."),
    notes: cleanString(data.notes),
    objective: cleanString(data.objective, "Practice a curated learning skill."),
    publishedAt: null,
    archivedAt: null,
    questionTypes: Array.from(new Set(questions.map((question) => question.type))),
    questions,
    reviewChecklist: data.reviewChecklist as CuratedQuiz["reviewChecklist"],
    rewards:
      data.rewards && typeof data.rewards === "object"
        ? {
            xp:
              typeof (data.rewards as JsonRecord).xp === "number"
                ? ((data.rewards as JsonRecord).xp as number)
                : 20,
            ...(typeof (data.rewards as JsonRecord).badge === "string"
              ? { badge: (data.rewards as JsonRecord).badge as string }
              : {}),
            ...(typeof (data.rewards as JsonRecord).mastery === "boolean"
              ? { mastery: (data.rewards as JsonRecord).mastery as boolean }
              : {}),
            ...(typeof (data.rewards as JsonRecord).nextUnlockId === "string"
              ? { nextUnlockId: (data.rewards as JsonRecord).nextUnlockId as string }
              : {}),
            ...(typeof (data.rewards as JsonRecord).rankProgress === "number"
              ? { rankProgress: (data.rewards as JsonRecord).rankProgress as number }
              : {}),
            ...(typeof (data.rewards as JsonRecord).rewardProgress === "number"
              ? { rewardProgress: (data.rewards as JsonRecord).rewardProgress as number }
              : {}),
            ...(typeof (data.rewards as JsonRecord).stars === "number"
              ? { stars: (data.rewards as JsonRecord).stars as number }
              : {}),
            ...(typeof (data.rewards as JsonRecord).unlockMessage === "string"
              ? {
                  unlockMessage: (data.rewards as JsonRecord).unlockMessage as string,
                }
              : {}),
          }
        : { xp: 20 },
    sourcePrompt: cleanString(data.sourcePrompt),
    status: "published",
    title: cleanString(data.title, "Curated Quiz"),
    topic: cleanString(data.topic, "Curated learning"),
    unlockRequirements:
      data.unlockRequirements && typeof data.unlockRequirements === "object"
        ? (data.unlockRequirements as CuratedQuiz["unlockRequirements"])
        : {
            requiredLevel:
              typeof data.curriculumLevel === "number" && data.curriculumLevel >= 1
                ? data.curriculumLevel
                : 1,
          },
    updatedAt: null,
  };
}

function getQuizType(quiz: CuratedQuiz): QuizType {
  if (quiz.questionTypes.includes("image-to-word")) {
    return "image-to-word";
  }

  if (quiz.questionTypes.includes("word-to-image")) {
    return "word-to-image";
  }

  if (quiz.questionTypes.includes("counting-objects")) {
    return "counting-objects";
  }

  if (quiz.questionTypes.includes("word-problem")) {
    return "word-problem";
  }

  if (quiz.questionTypes.includes("scenario")) {
    return "word-problem";
  }

  if (quiz.questionTypes.includes("text-to-speech")) {
    return "text-to-speech";
  }

  if (quiz.questionTypes.includes("speech-to-text")) {
    return "speech-to-text";
  }

  if (quiz.questionTypes.includes("image-choice")) {
    return "image-to-word";
  }

  if (quiz.questionTypes.includes("picture-based")) {
    return "image-based-question";
  }

  if (quiz.questionTypes.includes("ordering")) {
    return "ordering-numbers";
  }

  if (quiz.questionTypes.includes("timed-challenge")) {
    return "timed-mastery-challenge";
  }

  if (quiz.questionTypes.includes("true-or-false")) {
    return "true-or-false";
  }

  if (quiz.questionTypes.includes("matching")) {
    return "matching-type";
  }

  if (quiz.questionTypes.includes("fill-in-the-blank")) {
    return "fill-in-the-blank";
  }

  return "multiple-choice";
}

function convertQuestion(question: CuratedQuizQuestion): QuizQuestion {
  if (question.type === "fill-in-the-blank") {
    const fillQuestion = question as FillInTheBlankQuestion;

    return {
      id: fillQuestion.id,
      type: "fillBlank",
      interactionType: "typed-answer",
      prompt: `${fillQuestion.prompt} ${fillQuestion.sentence}`,
      answer: fillQuestion.answer,
      options: fillQuestion.wordBank,
      helperText: fillQuestion.explanation,
      wordBank: fillQuestion.wordBank,
    };
  }

  if (
    question.type === "matching" ||
    question.type === "image-to-word" ||
    question.type === "word-to-image"
  ) {
    const matchingQuestion = question as MatchingQuestion;

    return {
      id: matchingQuestion.id,
      type: "matching",
      interactionType: "tap-or-drag-match",
      prompt: matchingQuestion.prompt,
      answer: matchingQuestion.pairs
        .map((pair) => `${pair.left}=>${pair.right}`)
        .join("|"),
      helperText: matchingQuestion.explanation || matchingQuestion.instruction,
      pairs: matchingQuestion.pairs.map((pair) => ({
        left: pair.left,
        leftType: pair.leftType,
        right: pair.right,
        rightType: pair.rightType,
        word: pair.word,
        imagePrompt: pair.imagePrompt,
        altText: pair.altText,
        assetId: pair.assetId,
      })),
    };
  }

  const multipleChoiceQuestion = question as MultipleChoiceQuestion;
  const typeMap: Record<MultipleChoiceQuestion["type"], QuizQuestion["type"]> = {
    "compare-numbers": "multipleChoice",
    "counting-objects": "imageChoice",
    "image-choice": "imageChoice",
    "multiple-choice": "multipleChoice",
    ordering: "ordering",
    "picture-based": "imageChoice",
    scenario: "wordProblem",
    "speech-to-text": "speechToText",
    "text-to-speech": "textToSpeech",
    "timed-challenge": "timedChallenge",
    "true-or-false": "trueFalse",
    "word-problem": "wordProblem",
  };

  return {
    id: multipleChoiceQuestion.id,
    type: typeMap[multipleChoiceQuestion.type],
    interactionType:
      multipleChoiceQuestion.interactionType ??
      getInteractionTypeForLayout(multipleChoiceQuestion.type),
    prompt: multipleChoiceQuestion.prompt,
    answer: multipleChoiceQuestion.answer,
    options: multipleChoiceQuestion.options,
    audioText: multipleChoiceQuestion.audioText,
    helperText: multipleChoiceQuestion.helperText || multipleChoiceQuestion.explanation,
    imageLabel: multipleChoiceQuestion.imageLabel,
  };
}

export function convertCuratedQuizToPreset(quiz: CuratedQuiz): QuizPreset {
  return withQuizContentStudyRequirements({
    id: `curated-${quiz.id}`,
    title: quiz.title,
    description: quiz.objective || quiz.instructions,
    category: quiz.category,
    quizType: getQuizType(quiz),
    curriculumLevel: quiz.curriculumLevel,
    difficulty: quiz.difficulty,
    learnerLevel: quiz.gradeLevel ?? quiz.learnerLevel,
    playMap: {
      assetId: quiz.assetId,
      gradeLevel: quiz.gradeLevel ?? quiz.learnerLevel,
      node: quiz.node ?? 1,
      phase: quiz.phase,
      topicId: quiz.topicId,
      worldId: quiz.worldId,
    },
    unlockRequirements:
      quiz.unlockRequirements ?? { requiredLevel: quiz.curriculumLevel },
    rewards: quiz.rewards,
    questions: quiz.questions.map(convertQuestion),
  });
}

export function subscribeToPublishedCuratedQuizPresets(
  onChange: (quizzes: QuizPreset[]) => void,
  filters: {
    gradeLevel?: LearnerGradeLevel | null;
    phase?: CuratedQuiz["phase"];
    topicId?: string;
    worldId?: string;
  } = {},
  onError?: (error: Error) => void
) {
  return onSnapshot(
    query(collection(db, "curatedQuizzes"), where("status", "==", "published")),
    (snapshot) => {
      const quizzes = snapshot.docs
        .map((quizDoc) => normalizeCuratedQuiz(quizDoc.id, quizDoc.data() as JsonRecord))
        .filter((quiz): quiz is CuratedQuiz => !!quiz)
        .filter((quiz) => {
          const gradeMatches =
            !filters.gradeLevel || quiz.gradeLevel === filters.gradeLevel;
          const worldMatches = !filters.worldId || quiz.worldId === filters.worldId;
          const topicMatches = !filters.topicId || quiz.topicId === filters.topicId;
          const phaseMatches = !filters.phase || quiz.phase === filters.phase;

          return gradeMatches && worldMatches && topicMatches && phaseMatches;
        })
        .map(convertCuratedQuizToPreset)
        .sort((first, second) => {
          if (first.curriculumLevel !== second.curriculumLevel) {
            return first.curriculumLevel - second.curriculumLevel;
          }

          return first.title.localeCompare(second.title);
        });

      onChange(quizzes);
    },
    (error) => onError?.(error)
  );
}
