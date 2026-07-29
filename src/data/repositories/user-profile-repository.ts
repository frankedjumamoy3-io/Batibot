import { User } from "firebase/auth";
import {
  DocumentData,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { isAllowedAdminEmail } from "@/src/config/admin";
import { db } from "@/src/config/firebase";
import {
  type LearnerGradeLevel,
  UserProfile,
  UserRole,
  isLearnerGradeLevel,
  isUserRole,
} from "@/src/types/user";

const DEFAULT_ROLE: UserRole = "learner";

function getRoleForEmail(email?: string | null): UserRole {
  return isAllowedAdminEmail(email) ? "admin" : DEFAULT_ROLE;
}

function sanitizeAllowedPreviewLevels(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const levels = value.filter(isLearnerGradeLevel);

  return levels.length ? levels : undefined;
}

export function getUserInitials(
  displayName?: string | null,
  email?: string | null
) {
  const source = displayName?.trim() || email?.split("@")[0] || "Learner";
  const parts = source.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export function createFallbackUserProfile(
  user: Pick<User, "uid" | "email" | "displayName">
): UserProfile {
  return {
    uid: user.uid,
    email: user.email ?? "",
    displayName: user.displayName ?? "",
    gradeLevel: null,
    avatarCategory: null,
    avatarAssetKey: null,
    avatarId: null,
    buddyEmoji: null,
    deviceId: null,
    initials: getUserInitials(user.displayName, user.email),
    isDeleted: false,
    profileImagePath: null,
    profileImageUrl: null,
    profilePhotoStoragePath: null,
    profilePhotoUrl: null,
    role: getRoleForEmail(user.email),
    syncStatus: "synced",
    syncVersion: 1,
    isTestAccount: false,
    unlockAllQuizzes: false,
    allowedPreviewLevels: undefined,
    currentPreviewLevel: null,
    excludeFromAnalytics: false,
    excludeFromLeaderboard: false,
    unlockMode: "normal_locked",
  };
}

export function mapUserProfile(
  user: Pick<User, "uid" | "email" | "displayName">,
  data?: DocumentData
): UserProfile {
  const fallback = createFallbackUserProfile(user);
  const email = typeof data?.email === "string" ? data.email : fallback.email;
  const role = isAllowedAdminEmail(email)
    ? "admin"
    : isUserRole(data?.role) && data.role !== "admin"
      ? data.role
      : DEFAULT_ROLE;

  return {
    uid: user.uid,
    email,
    displayName:
      typeof data?.displayName === "string"
        ? data.displayName
        : fallback.displayName,
    gradeLevel: isLearnerGradeLevel(data?.gradeLevel)
      ? data.gradeLevel
      : fallback.gradeLevel,
    avatarCategory:
      data?.avatarCategory === "animal" ||
      data?.avatarCategory === "fruit" ||
      data?.avatarCategory === "friendly"
        ? data.avatarCategory
        : fallback.avatarCategory,
    avatarId:
      typeof data?.avatarId === "string" ? data.avatarId : fallback.avatarId,
    avatarAssetKey:
      typeof data?.avatarAssetKey === "string"
        ? data.avatarAssetKey
        : fallback.avatarAssetKey,
    buddyEmoji:
      typeof data?.buddyEmoji === "string" ? data.buddyEmoji : fallback.buddyEmoji,
    deviceId:
      typeof data?.deviceId === "string" ? data.deviceId : fallback.deviceId,
    initials:
      typeof data?.initials === "string"
        ? data.initials
        : getUserInitials(
            typeof data?.displayName === "string"
              ? data.displayName
              : fallback.displayName,
            typeof data?.email === "string" ? data.email : fallback.email
          ),
    isDeleted: data?.isDeleted === true,
    profileImagePath:
      typeof data?.profileImagePath === "string"
        ? data.profileImagePath
        : typeof data?.profilePhotoStoragePath === "string"
          ? data.profilePhotoStoragePath
          : null,
    profileImageUrl:
      typeof data?.profileImageUrl === "string"
        ? data.profileImageUrl
        : typeof data?.profilePhotoUrl === "string"
          ? data.profilePhotoUrl
          : null,
    profilePhotoStoragePath:
      typeof data?.profilePhotoStoragePath === "string"
        ? data.profilePhotoStoragePath
        : typeof data?.profileImagePath === "string"
          ? data.profileImagePath
          : null,
    profilePhotoUrl:
      typeof data?.profilePhotoUrl === "string"
        ? data.profilePhotoUrl
        : typeof data?.profileImageUrl === "string"
          ? data.profileImageUrl
          : null,
    role,
    syncStatus: "synced",
    syncVersion:
      typeof data?.syncVersion === "number" && data.syncVersion > 0
        ? data.syncVersion
        : 1,
    isTestAccount: data?.isTestAccount === true,
    unlockAllQuizzes: data?.unlockAllQuizzes === true,
    allowedPreviewLevels: sanitizeAllowedPreviewLevels(data?.allowedPreviewLevels),
    currentPreviewLevel: isLearnerGradeLevel(data?.currentPreviewLevel)
      ? data.currentPreviewLevel
      : null,
    excludeFromAnalytics: data?.excludeFromAnalytics === true,
    excludeFromLeaderboard: data?.excludeFromLeaderboard === true,
    unlockMode: data?.unlockMode === "all_unlocked" ? "all_unlocked" : "normal_locked",
  };
}

interface EnsureUserProfileOptions {
  avatarAssetKey?: string | null;
  buddyEmoji?: string | null;
  gradeLevel?: LearnerGradeLevel | null;
  profileImagePath?: string | null;
  profileImageUrl?: string | null;
  trackLogin?: boolean;
}

export async function ensureUserProfile(
  user: Pick<User, "uid" | "email" | "displayName">,
  options: EnsureUserProfileOptions = {}
) {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  const nextData: Record<string, unknown> = {
    uid: user.uid,
    email: user.email ?? "",
    displayName: user.displayName ?? "",
    initials: getUserInitials(user.displayName, user.email),
    updatedAt: serverTimestamp(),
  };

  if (!snapshot.exists()) {
    nextData.createdAt = serverTimestamp();
  }

  nextData.role = getRoleForEmail(user.email);

  if (options.trackLogin) {
    nextData.lastLoginAt = serverTimestamp();
  }

  if (options.gradeLevel !== undefined) {
    nextData.gradeLevel = options.gradeLevel;
  }

  if (options.buddyEmoji !== undefined) {
    nextData.buddyEmoji = options.buddyEmoji;
  }

  if (options.avatarAssetKey !== undefined) {
    nextData.avatarAssetKey = options.avatarAssetKey;
  }

  if (options.profileImagePath !== undefined) {
    nextData.profileImagePath = options.profileImagePath;
    nextData.profilePhotoStoragePath = options.profileImagePath;
  }

  if (options.profileImageUrl !== undefined) {
    nextData.profileImageUrl = options.profileImageUrl;
    nextData.profilePhotoUrl = options.profileImageUrl;
  }

  await setDoc(
    userRef,
    nextData,
    { merge: true }
  );
}

export function isAdminProfile(profile: UserProfile | null | undefined) {
  return profile?.role === "admin";
}
