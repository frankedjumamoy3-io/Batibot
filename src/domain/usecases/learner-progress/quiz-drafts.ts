import type {
  ActiveQuizProgressDraft,
  LearnerProgressState,
  SaveQuizDraftInput,
} from "@/src/domain/entities/learner-progress";

export function clearQuizDraftUseCase(
  progress: LearnerProgressState,
  quizId: string
): LearnerProgressState {
  if (!progress.activeQuizDrafts[quizId]) {
    return progress;
  }

  const nextDrafts = { ...progress.activeQuizDrafts };
  delete nextDrafts[quizId];

  return {
    ...progress,
    activeQuizDrafts: nextDrafts,
  };
}

export function saveQuizDraftUseCase(
  progress: LearnerProgressState,
  input: SaveQuizDraftInput
): LearnerProgressState {
  const nextDraft: ActiveQuizProgressDraft = {
    answerInput: input.answerInput,
    isReviewOnly: input.isReviewOnly,
    mistakes: input.mistakes,
    questionIndex: input.questionIndex,
    quizId: input.quizId,
    responses: input.responses,
    savedAt: new Date().toISOString(),
    score: input.score,
    total: input.total,
  };
  const currentDraft = progress.activeQuizDrafts[input.quizId];

  if (
    currentDraft &&
    currentDraft.answerInput === nextDraft.answerInput &&
    currentDraft.isReviewOnly === nextDraft.isReviewOnly &&
    currentDraft.questionIndex === nextDraft.questionIndex &&
    currentDraft.score === nextDraft.score &&
    currentDraft.total === nextDraft.total &&
    currentDraft.mistakes.length === nextDraft.mistakes.length &&
    currentDraft.responses.length === nextDraft.responses.length
  ) {
    return progress;
  }

  return {
    ...progress,
    activeQuizDrafts: {
      ...progress.activeQuizDrafts,
      [input.quizId]: nextDraft,
    },
  };
}
