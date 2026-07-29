export const USER_ROLES = ["learner", "admin", "tester"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const LEARNER_GRADE_LEVELS = [
  "Preschool",
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
] as const;

export type LearnerGradeLevel = (typeof LEARNER_GRADE_LEVELS)[number];
export type UserMetadataGradeLevel =
  | "preschool"
  | "kindergarten"
  | "grade1"
  | "grade2"
  | "grade3";
export type UserMetadataRole = "learner" | "administrator";

export type UserMetadata = {
  uid: string;
  displayName?: string;
  email?: string;
  role: UserMetadataRole;
  gradeLevel?: UserMetadataGradeLevel;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  lastActiveAt?: string;
  profileCompleted?: boolean;
  avatarId?: string;
  totalXP?: number;
  totalStars?: number;
  currentStreak?: number;
  completedWorlds?: number;
  completedTopics?: number;
  unlockedWorlds?: string[];
  activeWorldId?: string;
  activeTopicId?: string;
};

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  gradeLevel: LearnerGradeLevel | null;
  avatarCategory?: "animal" | "fruit" | "friendly" | null;
  avatarAssetKey?: string | null;
  avatarId?: string | null;
  buddyEmoji: string | null;
  deviceId?: string | null;
  initials: string;
  isDeleted?: boolean;
  profileImagePath: string | null;
  profileImageUrl: string | null;
  profilePhotoStoragePath?: string | null;
  profilePhotoUrl?: string | null;
  role: UserRole;
  syncStatus?: "synced" | "syncing" | "offline";
  syncVersion?: number;
  isTestAccount: boolean;
  unlockAllQuizzes: boolean;
  allowedPreviewLevels?: LearnerGradeLevel[];
  currentPreviewLevel?: LearnerGradeLevel | null;
  excludeFromAnalytics?: boolean;
  excludeFromLeaderboard?: boolean;
  unlockMode?: "all_unlocked" | "normal_locked";
}

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.includes(value as UserRole);
}

export function isLearnerGradeLevel(
  value: unknown
): value is LearnerGradeLevel {
  return (
    typeof value === "string" &&
    LEARNER_GRADE_LEVELS.includes(value as LearnerGradeLevel)
  );
}
