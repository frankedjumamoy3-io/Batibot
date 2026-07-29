import type { LearnerGradeLevel } from "@/src/types/user";

export interface AuthSessionUser {
  displayName: string | null;
  email: string | null;
  excludeFromAnalytics?: boolean;
  excludeFromLeaderboard?: boolean;
  getIdToken: () => Promise<string>;
  isLocalLearner?: boolean;
  isTestAccount?: boolean;
  photoURL: string | null;
  uid: string;
  unlockAllQuizzes?: boolean;
}

export interface LearnerSessionInput {
  allowedPreviewLevels?: LearnerGradeLevel[];
  avatarCategory?: "animal" | "fruit" | "friendly" | null;
  avatarAssetKey?: string | null;
  avatarId?: string | null;
  buddyEmoji?: string | null;
  currentPreviewLevel?: LearnerGradeLevel | null;
  deviceId?: string | null;
  excludeFromAnalytics?: boolean;
  excludeFromLeaderboard?: boolean;
  gradeLevel: LearnerGradeLevel;
  isTestAccount?: boolean;
  profileId?: string;
  profileImagePath?: string | null;
  profileImageUrl?: string | null;
  role?: "learner" | "tester";
  syncStatus?: "synced" | "syncing" | "offline";
  syncVersion?: number;
  unlockAllQuizzes?: boolean;
  unlockMode?: "all_unlocked" | "normal_locked";
  username: string;
}
