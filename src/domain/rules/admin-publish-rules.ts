import type { ActiveLearningPhase } from "@/src/data/curriculum/learning-path";
import { validateActivityCorrectAnswer } from "@/src/domain/rules/activity-integrity-rules";
import { BATIBOT_PHASE_CONTRACTS } from "@/src/domain/rules/gemini-draft-rules";
import { resolveAsset } from "@/src/services/assets/assetResolver";
import type { CuratedQuizDraft, CuratedQuizQuestion } from "@/src/types/quiz";

export interface AdminPublishIssue {
  code:
    | "challenge-new-content"
    | "correct-answer-integrity"
    | "missing-asset"
    | "missing-mobile-preview"
    | "missing-phase"
    | "missing-play-map"
    | "practice-not-supported"
    | "reward-mapping"
    | "xp-range";
  message: string;
  severity: "blocker" | "warning";
}

function normalize(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function getQuestionVocabulary(question: CuratedQuizQuestion) {
  return new Set(
    [
      question.sourceVocabularyWord,
      ...(question.vocabularyUsed ?? []),
      ...(question.type === "matching" ||
      question.type === "image-to-word" ||
      question.type === "word-to-image"
        ? question.pairs.flatMap((pair) => [pair.word, pair.left, pair.right])
        : []),
    ]
      .map(normalize)
      .filter(Boolean)
  );
}

function hasImageRequirement(question: CuratedQuizQuestion) {
  if (
    question.type === "image-choice" ||
    question.type === "picture-based" ||
    question.type === "counting-objects"
  ) {
    return true;
  }

  if (question.type === "image-to-word" || question.type === "word-to-image") {
    return question.pairs.some(
      (pair) => pair.leftType === "image" || pair.rightType === "image" || Boolean(pair.imagePrompt)
    );
  }

  return false;
}

function getExpectedXpRange(phase: ActiveLearningPhase | undefined) {
  if (phase === "Challenge" || phase === "Mastery") {
    return { max: 60, min: 25 };
  }

  if (phase === "Reward") {
    return { max: 30, min: 10 };
  }

  return { max: 45, min: 15 };
}

export function validateAdminPlayContentForPublish(
  draft: Pick<
    CuratedQuizDraft,
    | "assetId"
    | "gradeLevel"
    | "phase"
    | "questions"
    | "rewards"
    | "topicId"
    | "unlockRewardMapping"
    | "worldId"
  > & {
    mobilePreviewChecked?: boolean;
  }
): AdminPublishIssue[] {
  const issues: AdminPublishIssue[] = [];

  if (!draft.gradeLevel || !draft.worldId || !draft.topicId) {
    issues.push({
      code: "missing-play-map",
      message: "Map this content to Grade > World > Topic before publishing.",
      severity: "blocker",
    });
  }

  if (!draft.phase) {
    issues.push({
      code: "missing-phase",
      message: "Choose the Play phase before publishing.",
      severity: "blocker",
    });
  }

  if (draft.questions.some(hasImageRequirement) && !draft.assetId?.trim()) {
    const fallbackAsset = resolveAsset(draft.topicId);

    issues.push({
      code: "missing-asset",
      message: fallbackAsset.iconName
        ? "Final artwork is not mapped; learners will receive the curriculum-safe visual fallback."
        : "Image-based Play content needs a final asset or educational fallback.",
      severity: fallbackAsset.iconName ? "warning" : "blocker",
    });
  }

  draft.questions.forEach((question, index) => {
    const activity =
      "options" in question
        ? {
            choices: question.options,
            correctAnswer: question.answer,
          }
        : question.type === "fill-in-the-blank"
          ? {
              choices: question.wordBank,
              correctAnswer: question.answer,
            }
          : null;

    if (!activity) {
      return;
    }

    const integrity = validateActivityCorrectAnswer(activity);

    integrity.issues.forEach((message) => {
      issues.push({
        code: "correct-answer-integrity",
        message: `Question ${index + 1}: ${message}`,
        severity: "blocker",
      });
    });
  });

  if (!draft.mobilePreviewChecked) {
    issues.push({
      code: "missing-mobile-preview",
      message: "Check the mobile Play preview before publishing.",
      severity: "blocker",
    });
  }

  if (draft.phase === "Practice") {
    const unsupportedQuestions = draft.questions.filter(
      (question) => !question.sourceVocabularyWord && !(question.vocabularyUsed ?? []).length
    );

    if (unsupportedQuestions.length) {
      issues.push({
        code: "practice-not-supported",
        message: "Practice content must repeat known source vocabulary or known topic content.",
        severity: "blocker",
      });
    }
  }

  if (draft.phase === "Challenge") {
    const seenVocabulary = new Set<string>();
    let introducesNewContent = false;

    draft.questions.forEach((question, index) => {
      const vocabulary = getQuestionVocabulary(question);

      if (index > 0 && vocabulary.size) {
        introducesNewContent = [...vocabulary].some((word) => !seenVocabulary.has(word));
      }

      vocabulary.forEach((word) => seenVocabulary.add(word));
    });

    if (introducesNewContent) {
      issues.push({
        code: "challenge-new-content",
        message: BATIBOT_PHASE_CONTRACTS.Challenge.mustNot[0],
        severity: "warning",
      });
    }
  }

  const range = getExpectedXpRange(draft.phase);

  if (draft.rewards.xp < range.min || draft.rewards.xp > range.max) {
    issues.push({
      code: "xp-range",
      message: `XP should usually stay between ${range.min} and ${range.max} for this phase.`,
      severity: "warning",
    });
  }

  if (!draft.unlockRewardMapping?.trim()) {
    issues.push({
      code: "reward-mapping",
      message: "Describe how this affects Rank XP, Reward progress, stars, badges, or mastery.",
      severity: "warning",
    });
  }

  return issues;
}

export function getBlockingPublishIssues(issues: AdminPublishIssue[]) {
  return issues.filter((issue) => issue.severity === "blocker");
}
