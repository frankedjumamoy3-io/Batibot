import type {
  AuthSessionUser,
  LearnerSessionInput,
} from "@/src/domain/entities/auth-session";
import {
  LEARNER_GRADE_LEVELS,
  type LearnerGradeLevel,
  type UserProfile,
} from "@/src/types/user";

export type TestUnlockMode = "all_unlocked" | "normal_locked";

export type TestAccountProfile = {
  userId: string;
  role: "tester";
  isTestAccount: true;
  allowedLevels: LearnerGradeLevel[];
  currentPreviewLevel: LearnerGradeLevel;
  unlockMode: TestUnlockMode;
  excludeFromLeaderboard: true;
  excludeFromAnalytics: true;
};

export const TEST_ACCOUNT_ALLOWED_LEVELS = [...LEARNER_GRADE_LEVELS];
export const TEST_ACCOUNT_DISPLAY_NAME = "BatiBot Test Account";
export const TEST_ACCOUNT_PROFILE_ID_PREFIX = "batibot-test-account";

function isRuntimeDevelopment() {
  return typeof __DEV__ !== "undefined"
    ? __DEV__
    : process.env.NODE_ENV !== "production";
}

export function isQaRuntimeEnabled() {
  return (
    isRuntimeDevelopment() ||
    process.env.EXPO_PUBLIC_ENABLE_QA_MODE === "true"
  );
}

export function isTestAuthSessionTrusted(user?: AuthSessionUser | null) {
  return isQaRuntimeEnabled() || user?.isLocalLearner !== true;
}

export function isTestAccountModeAvailable(
  profile?: UserProfile | null,
  user?: AuthSessionUser | null
) {
  if (isQaRuntimeEnabled() || profile?.role === "admin") {
    return true;
  }

  if (user?.isLocalLearner === true) {
    return false;
  }

  return profile?.role === "tester" || profile?.isTestAccount === true;
}

export function getTestAccountProfileId(level: LearnerGradeLevel) {
  return `${TEST_ACCOUNT_PROFILE_ID_PREFIX}-${level
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;
}

export function buildTestAccountProfile(
  level: LearnerGradeLevel,
  unlockMode: TestUnlockMode = "all_unlocked"
): TestAccountProfile {
  return {
    userId: getTestAccountProfileId(level),
    role: "tester",
    isTestAccount: true,
    allowedLevels: TEST_ACCOUNT_ALLOWED_LEVELS,
    currentPreviewLevel: level,
    unlockMode,
    excludeFromLeaderboard: true,
    excludeFromAnalytics: true,
  };
}

export function buildTestLearnerSessionInput(
  level: LearnerGradeLevel,
  unlockMode: TestUnlockMode = "all_unlocked"
): LearnerSessionInput {
  const profile = buildTestAccountProfile(level, unlockMode);

  return {
    allowedPreviewLevels: profile.allowedLevels,
    buddyEmoji: "QA",
    currentPreviewLevel: profile.currentPreviewLevel,
    excludeFromAnalytics: profile.excludeFromAnalytics,
    excludeFromLeaderboard: profile.excludeFromLeaderboard,
    gradeLevel: level,
    isTestAccount: true,
    profileId: profile.userId,
    role: profile.role,
    unlockAllQuizzes: unlockMode === "all_unlocked",
    unlockMode,
    username: TEST_ACCOUNT_DISPLAY_NAME,
  };
}
