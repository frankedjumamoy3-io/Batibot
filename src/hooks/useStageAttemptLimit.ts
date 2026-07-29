import { useCallback, useEffect, useRef, useState } from "react";

export type StageAttemptFailReason = "wrong" | "timeout";

export type StageAttemptFeedbackType = "wrong" | "timeout" | "limit";

type UseStageAttemptLimitParams = {
  enabled: boolean;
  maxAttempts?: number;
  onFeedback: (
    message: string,
    type: StageAttemptFeedbackType
  ) => void;
  onLimitReached: () => void;
};

type UseStageAttemptLimitReturn = {
  attemptsRemaining: number;
  attemptsUsed: number;
  registerFailure: (reason: StageAttemptFailReason) => void;
  resetAttempts: () => void;
};

const DEFAULT_MAX_ATTEMPTS = 3;
const RESTART_DELAY_MS = 950;
export const STANDARD_STAGE_FEEDBACK = {
  limit: "Let's start again.",
  success: "Great!",
  timeout: "Time is up. Try again.",
  wrong: "Try Again.",
} as const;

export function useStageAttemptLimit({
  enabled,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  onFeedback,
  onLimitReached,
}: UseStageAttemptLimitParams): UseStageAttemptLimitReturn {
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const attemptsUsedRef = useRef(0);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onFeedbackRef = useRef(onFeedback);
  const onLimitReachedRef = useRef(onLimitReached);

  useEffect(() => {
    onFeedbackRef.current = onFeedback;
  }, [onFeedback]);

  useEffect(() => {
    onLimitReachedRef.current = onLimitReached;
  }, [onLimitReached]);

  const clearRestartTimer = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  const resetAttempts = useCallback(() => {
    clearRestartTimer();
    attemptsUsedRef.current = 0;
    setAttemptsUsed(0);
  }, [clearRestartTimer]);

  const registerFailure = useCallback(
    (reason: StageAttemptFailReason) => {
      if (!enabled) {
        return;
      }

      clearRestartTimer();
      const safeMaxAttempts = Math.max(1, maxAttempts);
      const nextAttempts = Math.min(safeMaxAttempts, attemptsUsedRef.current + 1);
      attemptsUsedRef.current = nextAttempts;
      setAttemptsUsed(nextAttempts);

      if (nextAttempts >= safeMaxAttempts) {
        onFeedbackRef.current(STANDARD_STAGE_FEEDBACK.limit, "limit");
        restartTimerRef.current = setTimeout(() => {
          restartTimerRef.current = null;
          onLimitReachedRef.current();
        }, RESTART_DELAY_MS);
      } else if (reason === "timeout") {
        onFeedbackRef.current(STANDARD_STAGE_FEEDBACK.timeout, "timeout");
      } else {
        onFeedbackRef.current(STANDARD_STAGE_FEEDBACK.wrong, "wrong");
      }
    },
    [clearRestartTimer, enabled, maxAttempts]
  );

  useEffect(() => clearRestartTimer, [clearRestartTimer]);

  return {
    attemptsRemaining: Math.max(0, Math.max(1, maxAttempts) - attemptsUsed),
    attemptsUsed,
    registerFailure,
    resetAttempts,
  };
}
