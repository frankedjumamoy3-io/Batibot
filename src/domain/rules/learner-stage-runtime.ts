import type { LearnerGradeLevel } from "@/src/types/user";

export const MAX_LESSON_STAGE_ATTEMPTS = 3;

const ADAPTIVE_CHALLENGE_SECONDS: Record<LearnerGradeLevel, number> = {
  Preschool: 20,
  Kindergarten: 20,
  "Grade 1": 15,
  "Grade 2": 15,
  "Grade 3": 15,
};

const DEFAULT_GRADE: LearnerGradeLevel = "Preschool";

export type StageFeedbackKind =
  | "correct"
  | "wrong"
  | "timeout"
  | "remediate"
  | "passed";

export function getAdaptiveChallengeTimeLimitForGrade(
  gradeLevel?: LearnerGradeLevel | null
) {
  return ADAPTIVE_CHALLENGE_SECONDS[gradeLevel ?? DEFAULT_GRADE];
}

export function getLessonStageAttemptLimit() {
  return MAX_LESSON_STAGE_ATTEMPTS;
}

export function shouldShowTryAgainSection(attempts: number) {
  return attempts >= MAX_LESSON_STAGE_ATTEMPTS;
}

export function getStageFeedbackCopy(
  kind: StageFeedbackKind,
  attempts = 0
) {
  if (kind === "correct" || kind === "passed") {
    return {
      actionLabel: "Next",
      message: "You got it.",
      title: "Great!",
    };
  }

  if (kind === "timeout") {
    return {
      actionLabel: "Try Again",
      message: "Time is up. Try again slowly.",
      title: "Time is up.",
    };
  }

  if (kind === "remediate" || shouldShowTryAgainSection(attempts)) {
    return {
      actionLabel: "Practice First",
      message: "Let's practice first, then try again.",
      title: "Try again.",
    };
  }

  if (attempts >= MAX_LESSON_STAGE_ATTEMPTS - 1) {
    return {
      actionLabel: "Try Again",
      message: "One more try. Look, tap, then answer.",
      title: "Almost there.",
    };
  }

  return {
    actionLabel: "Try Again",
    message: "Look closely and try again.",
    title: "Try again.",
  };
}
