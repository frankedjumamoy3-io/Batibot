import { useEffect, useState } from "react";

interface UseLessonChallengeTimerInput {
  isActive: boolean;
  nodeDone: boolean;
  nodeIndex: number;
  onTimeout: () => void;
  resetKey?: number;
  timeLimitSeconds: number;
}

export function useLessonChallengeTimer({
  isActive,
  nodeDone,
  nodeIndex,
  onTimeout,
  resetKey = 0,
  timeLimitSeconds,
}: UseLessonChallengeTimerInput) {
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(timeLimitSeconds);
      return;
    }

    if (nodeDone) {
      return;
    }

    setTimeLeft(timeLimitSeconds);

    const timerId = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timerId);
          onTimeout();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isActive, nodeDone, nodeIndex, onTimeout, resetKey, timeLimitSeconds]);

  return timeLeft;
}
