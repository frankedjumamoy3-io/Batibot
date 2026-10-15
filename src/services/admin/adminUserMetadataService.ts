import { Timestamp, collection, getDocs, limit, query } from "firebase/firestore";

import { isAllowedAdminEmail } from "@/src/config/admin";
import { db } from "@/src/config/firebase";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import type { LearnerProgressState } from "@/src/domain/entities/learner-progress";
import { sanitizeLearnerProgress } from "@/src/domain/usecases/learner-progress/progress-state";
import { requireAdmin } from "@/src/services/adminAccessService";
import {
  type UserMetadata,
  type UserMetadataGradeLevel,
  type UserMetadataRole,
  type UserProfile,
} from "@/src/types/user";

type FirestoreUserData = Record<string, unknown>;

export type ListUserMetadataOptions = {
  includeDeleted?: boolean;
  maxUsers?: number;
};

export async function listUserMetadataForAdmin(
  profile: UserProfile | null | undefined,
  options: ListUserMetadataOptions = {}
): Promise<UserMetadata[]> {
  requireAdmin(profile);
  if (USE_NODE_BACKEND) return [];

  try {
    const snapshot = await getDocs(
      query(collection(db, "users"), limit(options.maxUsers ?? 500))
    );

    return snapshot.docs
      .filter((item) => options.includeDeleted || item.data().isDeleted !== true)
      .map((item) => normalizeUserMetadata(item.id, item.data()));
  } catch {
    return [];
  }
}

export function normalizeUserMetadata(
  uid: string,
  data: FirestoreUserData
): UserMetadata {
  const learnerProgress = sanitizeLearnerProgress(data.learnerProgress);
  const gradeLevel = normalizeMetadataGradeLevel(data.gradeLevel);
  const displayName = readString(data.displayName);
  const email = readString(data.email);
  const activeTopic = getLatestTopicProgress(learnerProgress);
  const isDeleted = data.isDeleted === true;
  const avatarId = readString(data.avatarId) ?? readString(data.avatarAssetKey);
  const lastActiveAt = getLastActiveAt(data, learnerProgress);
  const activeWorldId = readString(data.activeWorldId) ?? activeTopic?.worldId;
  const activeTopicId = readString(data.activeTopicId) ?? activeTopic?.topicId;

  return {
    uid: readString(data.uid) ?? uid,
    ...(displayName ? { displayName } : {}),
    ...(email ? { email } : {}),
    role: normalizeMetadataRole(data.role, email),
    ...(gradeLevel ? { gradeLevel } : {}),
    ...readTimestampField(data.createdAt, "createdAt"),
    ...readTimestampField(data.updatedAt, "updatedAt"),
    ...readTimestampField(data.lastLoginAt, "lastLoginAt"),
    ...(lastActiveAt ? { lastActiveAt } : {}),
    profileCompleted:
      data.profileCompleted === true || Boolean(displayName && gradeLevel && !isDeleted),
    ...(avatarId ? { avatarId } : {}),
    totalXP: readNumber(data.totalXP) ?? readNumber(data.totalXp) ?? learnerProgress.totalXp,
    totalStars: readNumber(data.totalStars) ?? learnerProgress.claimedWorldRewardIds.length,
    currentStreak: Math.max(learnerProgress.streak, learnerProgress.streakDays),
    completedWorlds: getCompletedWorldCount(data, learnerProgress),
    completedTopics: getCompletedTopicCount(data, learnerProgress),
    unlockedWorlds: getUnlockedWorlds(data, learnerProgress),
    ...(activeWorldId ? { activeWorldId } : {}),
    ...(activeTopicId ? { activeTopicId } : {}),
  };
}

function normalizeMetadataRole(role: unknown, email?: string): UserMetadataRole {
  if (role === "admin" || role === "administrator" || isAllowedAdminEmail(email)) {
    return "administrator";
  }

  return "learner";
}

function normalizeMetadataGradeLevel(value: unknown): UserMetadataGradeLevel | undefined {
  if (value === "preschool" || value === "Preschool") return "preschool";
  if (value === "kindergarten" || value === "Kindergarten") return "kindergarten";
  if (value === "grade1" || value === "Grade 1") return "grade1";
  if (value === "grade2" || value === "Grade 2") return "grade2";
  if (value === "grade3" || value === "Grade 3") return "grade3";

  return undefined;
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : undefined;
}

function readTimestampField(value: unknown, key: string) {
  const normalized = normalizeTimestamp(value);

  return normalized ? { [key]: normalized } : {};
}

function normalizeTimestamp(value: unknown): string | undefined {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
  }

  if (
    value &&
    typeof value === "object" &&
    "seconds" in value &&
    typeof (value as { seconds?: unknown }).seconds === "number"
  ) {
    return new Date((value as { seconds: number }).seconds * 1000).toISOString();
  }

  return undefined;
}

function getLastActiveAt(data: FirestoreUserData, progress: LearnerProgressState) {
  return (
    normalizeTimestamp(data.lastActiveAt) ??
    normalizeTimestamp(data.learnerProgressUpdatedAt) ??
    normalizeTimestamp(progress.lastActiveDate)
  );
}

function getCompletedWorldCount(
  data: FirestoreUserData,
  progress: LearnerProgressState
) {
  if (Array.isArray(data.completedWorlds)) {
    return data.completedWorlds.filter((item) => typeof item === "string").length;
  }

  return Object.values(progress.worldProgress).filter((world) => world.percent >= 100).length;
}

function getCompletedTopicCount(
  data: FirestoreUserData,
  progress: LearnerProgressState
) {
  if (Array.isArray(data.completedTopics)) {
    return data.completedTopics.filter((item) => typeof item === "string").length;
  }

  return Math.max(
    Object.keys(progress.masteredTopics).length,
    progress.completedLessons.length
  );
}

function getUnlockedWorlds(
  data: FirestoreUserData,
  progress: LearnerProgressState
) {
  if (Array.isArray(data.unlockedWorlds)) {
    return data.unlockedWorlds.filter((item): item is string => typeof item === "string");
  }

  return Object.values(progress.worldProgress)
    .filter((world) => world.percent > 0 || world.completedTopicCount > 0)
    .map((world) => world.worldId);
}

function getLatestTopicProgress(progress: LearnerProgressState) {
  return Object.values(progress.completedStagesByTopic).sort(
    (left, right) =>
      new Date(right.lastCompletedAt).getTime() - new Date(left.lastCompletedAt).getTime()
  )[0];
}
