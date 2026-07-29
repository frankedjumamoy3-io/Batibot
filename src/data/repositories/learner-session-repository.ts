import {
  getSecureJsonItem,
  removeSecureJsonItem,
  setSecureJsonItem,
} from "@/src/infrastructure/storage/secure-json-storage";
import type {
  AuthSessionUser,
  LearnerSessionInput,
} from "@/src/domain/entities/auth-session";
import {
  isLearnerGradeLevel,
  type LearnerGradeLevel,
  type UserProfile,
} from "@/src/types/user";
import { getOrCreateDeviceId } from "@/src/services/deviceService";
import { createLearnerProfileId } from "@/src/utils/idGenerator";
import {
  markLearnerProfileDeleted,
  syncLearnerProfileToCloud,
} from "@/src/services/syncService";

const LEARNER_SESSION_KEY = "batibot:learner-session";
const LEARNER_PROFILES_KEY = "batibot:learner-profiles";
export const DEVICE_PROFILE_ID_KEY = "batibot_device_profile_id";

interface StoredLearnerSession {
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
  uid: string;
  unlockAllQuizzes?: boolean;
  unlockMode?: "all_unlocked" | "normal_locked";
  username: string;
}

export interface LocalLearnerProfile {
  allowedPreviewLevels?: LearnerGradeLevel[];
  avatarCategory?: "animal" | "fruit" | "friendly" | null;
  avatarAssetKey?: string | null;
  avatarId?: string | null;
  buddyEmoji: string | null;
  createdAt: string;
  currentPreviewLevel?: LearnerGradeLevel | null;
  deviceId?: string | null;
  excludeFromAnalytics?: boolean;
  excludeFromLeaderboard?: boolean;
  gradeLevel: LearnerGradeLevel;
  isDeleted?: boolean;
  isTestAccount?: boolean;
  lastPlayedAt: string;
  profileImagePath?: string | null;
  profileImageUrl?: string | null;
  profileId: string;
  role?: "learner" | "tester";
  unlockAllQuizzes?: boolean;
  unlockMode?: "all_unlocked" | "normal_locked";
  updatedAt?: string;
  syncStatus?: "synced" | "syncing" | "offline";
  syncVersion?: number;
  username: string;
}

function normalizeUsername(username: string) {
  return username.trim().replace(/\s+/g, " ");
}

function normalizeProfileName(username: string) {
  return normalizeUsername(username).toLowerCase();
}

function getInitials(username: string) {
  const source = normalizeUsername(username) || "Learner";
  const parts = source.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export function buildLearnerSession({
  allowedPreviewLevels,
  avatarCategory,
  avatarAssetKey,
  avatarId,
  buddyEmoji = null,
  currentPreviewLevel,
  deviceId,
  excludeFromAnalytics = false,
  excludeFromLeaderboard = false,
  gradeLevel,
  isTestAccount = false,
  profileId,
  profileImagePath = null,
  profileImageUrl = null,
  role = "learner",
  syncStatus = "synced",
  syncVersion = 1,
  unlockAllQuizzes = false,
  unlockMode = "normal_locked",
  username,
}: LearnerSessionInput): {
  profile: UserProfile;
  user: AuthSessionUser;
} {
  const displayName = normalizeUsername(username);
  const uid = profileId ?? createLearnerProfileId();

  return {
    profile: {
      uid,
      email: "",
      displayName,
      gradeLevel,
      avatarCategory: avatarCategory ?? null,
      avatarAssetKey: avatarAssetKey ?? null,
      avatarId: avatarId ?? null,
      buddyEmoji,
      deviceId: deviceId ?? null,
      initials: getInitials(displayName),
      isDeleted: false,
      profileImagePath,
      profileImageUrl,
      profilePhotoStoragePath: profileImagePath,
      profilePhotoUrl: profileImageUrl,
      role,
      syncStatus,
      syncVersion,
      isTestAccount,
      unlockAllQuizzes,
      allowedPreviewLevels,
      currentPreviewLevel: currentPreviewLevel ?? (isTestAccount ? gradeLevel : null),
      excludeFromAnalytics,
      excludeFromLeaderboard,
      unlockMode,
    },
    user: {
      uid,
      email: "",
      displayName,
      getIdToken: async () => "",
      photoURL: profileImageUrl,
      isLocalLearner: true,
      isTestAccount,
      unlockAllQuizzes,
      excludeFromAnalytics,
      excludeFromLeaderboard,
    },
  };
}

function sanitizeAllowedPreviewLevels(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const levels = value.filter(isLearnerGradeLevel);

  return levels.length ? levels : undefined;
}

async function loadLearnerProfiles(): Promise<LocalLearnerProfile[]> {
  try {
    const parsed =
      await getSecureJsonItem<Partial<LocalLearnerProfile>[]>(LEARNER_PROFILES_KEY);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (profile): profile is LocalLearnerProfile =>
          typeof profile.profileId === "string" &&
          typeof profile.username === "string" &&
          isLearnerGradeLevel(profile.gradeLevel) &&
          typeof profile.createdAt === "string" &&
          typeof profile.lastPlayedAt === "string"
      )
      .map((profile): LocalLearnerProfile => ({
        ...profile,
        allowedPreviewLevels: sanitizeAllowedPreviewLevels(profile.allowedPreviewLevels),
        buddyEmoji: typeof profile.buddyEmoji === "string" ? profile.buddyEmoji : null,
        currentPreviewLevel: isLearnerGradeLevel(profile.currentPreviewLevel)
          ? profile.currentPreviewLevel
          : null,
        excludeFromAnalytics: profile.excludeFromAnalytics === true,
        excludeFromLeaderboard: profile.excludeFromLeaderboard === true,
        avatarCategory:
          profile.avatarCategory === "animal" ||
          profile.avatarCategory === "fruit" ||
          profile.avatarCategory === "friendly"
            ? profile.avatarCategory
            : null,
        avatarAssetKey:
          typeof profile.avatarAssetKey === "string" ? profile.avatarAssetKey : null,
        avatarId: typeof profile.avatarId === "string" ? profile.avatarId : null,
        isTestAccount: profile.isTestAccount === true,
        isDeleted: profile.isDeleted === true,
        profileImagePath:
          typeof profile.profileImagePath === "string" ? profile.profileImagePath : null,
        profileImageUrl:
          typeof profile.profileImageUrl === "string" ? profile.profileImageUrl : null,
        role: profile.role === "tester" ? "tester" : "learner",
        syncStatus:
          profile.syncStatus === "syncing" || profile.syncStatus === "offline"
            ? profile.syncStatus
            : "synced",
        syncVersion:
          typeof profile.syncVersion === "number" && profile.syncVersion > 0
            ? profile.syncVersion
            : 1,
        unlockAllQuizzes: profile.unlockAllQuizzes === true,
        unlockMode: profile.unlockMode === "all_unlocked" ? "all_unlocked" : "normal_locked",
        updatedAt:
          typeof profile.updatedAt === "string"
            ? profile.updatedAt
            : profile.lastPlayedAt,
      }));
  } catch {
    return [];
  }
}

async function saveLearnerProfiles(profiles: LocalLearnerProfile[]) {
  await setSecureJsonItem(LEARNER_PROFILES_KEY, profiles);
}

export async function getLocalLearnerProfileId() {
  try {
    return await getSecureJsonItem<string>(DEVICE_PROFILE_ID_KEY);
  } catch {
    return null;
  }
}

export async function saveLocalLearnerProfileId(profileId: string) {
  const safeProfileId = profileId.trim();

  if (!safeProfileId) {
    return;
  }

  await setSecureJsonItem(DEVICE_PROFILE_ID_KEY, safeProfileId);
}

export async function getLocalLearnerProfiles() {
  return loadLearnerProfiles();
}

export async function findLocalLearnerProfiles({
  gradeLevel,
  username,
}: {
  gradeLevel: LearnerGradeLevel;
  username: string;
}) {
  const normalizedName = normalizeProfileName(username);
  const profiles = await loadLearnerProfiles();

  return profiles
    .filter(
      (profile) =>
        normalizeProfileName(profile.username) === normalizedName &&
        profile.gradeLevel === gradeLevel
    )
    .sort((left, right) => right.lastPlayedAt.localeCompare(left.lastPlayedAt));
}

async function upsertLearnerProfile(input: LearnerSessionInput) {
  const now = new Date().toISOString();
  const deviceId = input.deviceId ?? (await getOrCreateDeviceId());
  const profiles = await loadLearnerProfiles();
  const activeDeviceProfileId = await getLocalLearnerProfileId();
  const profileId = input.profileId ?? activeDeviceProfileId ?? undefined;
  const existingIndex = profileId
    ? profiles.findIndex((profile) => profile.profileId === profileId)
    : -1;

  if (existingIndex >= 0) {
    const existingProfile = profiles[existingIndex];
    const updatedProfile: LocalLearnerProfile = {
      ...existingProfile,
      allowedPreviewLevels:
        input.allowedPreviewLevels ?? existingProfile.allowedPreviewLevels,
      avatarCategory:
        input.avatarCategory ?? existingProfile.avatarCategory ?? null,
      avatarAssetKey: input.avatarAssetKey ?? existingProfile.avatarAssetKey ?? null,
      avatarId: input.avatarId ?? existingProfile.avatarId ?? null,
      buddyEmoji: input.buddyEmoji ?? existingProfile.buddyEmoji ?? null,
      currentPreviewLevel:
        input.currentPreviewLevel ?? existingProfile.currentPreviewLevel ?? null,
      deviceId: existingProfile.deviceId ?? deviceId,
      excludeFromAnalytics:
        input.excludeFromAnalytics ?? existingProfile.excludeFromAnalytics,
      excludeFromLeaderboard:
        input.excludeFromLeaderboard ?? existingProfile.excludeFromLeaderboard,
      gradeLevel: input.gradeLevel,
      isTestAccount: input.isTestAccount ?? existingProfile.isTestAccount,
      lastPlayedAt: now,
      profileImagePath:
        input.profileImagePath ?? existingProfile.profileImagePath ?? null,
      profileImageUrl:
        input.profileImageUrl ?? existingProfile.profileImageUrl ?? null,
      role: input.role ?? existingProfile.role,
      syncStatus: input.syncStatus ?? "syncing",
      syncVersion: input.syncVersion ?? (existingProfile.syncVersion ?? 1) + 1,
      unlockAllQuizzes: input.unlockAllQuizzes ?? existingProfile.unlockAllQuizzes,
      unlockMode: input.unlockMode ?? existingProfile.unlockMode,
      updatedAt: now,
      username: normalizeUsername(input.username),
    };

    const nextProfiles = [...profiles];

    nextProfiles[existingIndex] = updatedProfile;
    await saveLearnerProfiles(nextProfiles);
    return updatedProfile;
  }

  const profile: LocalLearnerProfile = {
    allowedPreviewLevels: input.allowedPreviewLevels,
    avatarCategory: input.avatarCategory ?? null,
    avatarAssetKey: input.avatarAssetKey ?? null,
    avatarId: input.avatarId ?? null,
    buddyEmoji: input.buddyEmoji ?? null,
    createdAt: now,
    currentPreviewLevel: input.currentPreviewLevel ?? null,
    deviceId,
    excludeFromAnalytics: input.excludeFromAnalytics,
    excludeFromLeaderboard: input.excludeFromLeaderboard,
    gradeLevel: input.gradeLevel,
    isTestAccount: input.isTestAccount,
    lastPlayedAt: now,
    profileImagePath: input.profileImagePath ?? null,
    profileImageUrl: input.profileImageUrl ?? null,
    profileId: profileId ?? createLearnerProfileId(),
    role: input.role,
    syncStatus: input.syncStatus ?? "syncing",
    syncVersion: input.syncVersion ?? 1,
    unlockAllQuizzes: input.unlockAllQuizzes,
    unlockMode: input.unlockMode,
    updatedAt: now,
    username: normalizeUsername(input.username),
  };

  await saveLearnerProfiles([...profiles, profile]);
  return profile;
}

async function updateLearnerProfileSyncStatus(
  profileId: string,
  syncStatus: LocalLearnerProfile["syncStatus"]
) {
  const profiles = await loadLearnerProfiles();

  await saveLearnerProfiles(
    profiles.map((profile) =>
      profile.profileId === profileId
        ? { ...profile, syncStatus, updatedAt: new Date().toISOString() }
        : profile
    )
  );
}

function scheduleLearnerProfileCloudSync(localProfile: LocalLearnerProfile) {
  if (
    localProfile.isTestAccount === true ||
    localProfile.excludeFromAnalytics === true
  ) {
    void updateLearnerProfileSyncStatus(localProfile.profileId, "synced").catch(
      () => undefined
    );
    return;
  }

  if (__DEV__) {
    console.log("[LearnerProfile] cloud sync start", localProfile.profileId);
  }

  void syncLearnerProfileToCloud({
    avatarCategory: localProfile.avatarCategory,
    avatarAssetKey: localProfile.avatarAssetKey,
    avatarId: localProfile.avatarId,
    buddyEmoji: localProfile.buddyEmoji,
    deviceId: localProfile.deviceId ?? "",
    displayName: localProfile.username,
    gradeLevel: localProfile.gradeLevel,
    profileImagePath: localProfile.profileImagePath ?? null,
    profileImageUrl: localProfile.profileImageUrl ?? null,
    profileId: localProfile.profileId,
    syncVersion: localProfile.syncVersion,
  })
    .then((syncStatus) =>
      updateLearnerProfileSyncStatus(localProfile.profileId, syncStatus)
    )
    .catch((error) => {
      if (__DEV__) {
        console.warn("[LearnerProfile] Cloud sync failed", error);
      }

      return updateLearnerProfileSyncStatus(localProfile.profileId, "offline");
    })
    .catch(() => undefined);
}

export async function saveLearnerSession(input: LearnerSessionInput) {
  const localProfile = await upsertLearnerProfile(input);
  const syncedProfile = {
    ...localProfile,
    syncStatus:
      localProfile.isTestAccount === true || localProfile.excludeFromAnalytics === true
        ? "synced" as const
        : "syncing" as const,
  };
  const profiles = await loadLearnerProfiles();
  await saveLearnerProfiles(
    profiles.map((profile) =>
      profile.profileId === syncedProfile.profileId ? syncedProfile : profile
    )
  );
  await saveLocalLearnerProfileId(syncedProfile.profileId);
  const session = buildLearnerSession({
    allowedPreviewLevels: syncedProfile.allowedPreviewLevels,
    avatarCategory: syncedProfile.avatarCategory,
    avatarAssetKey: syncedProfile.avatarAssetKey,
    avatarId: syncedProfile.avatarId,
    buddyEmoji: syncedProfile.buddyEmoji,
    currentPreviewLevel: syncedProfile.currentPreviewLevel,
    deviceId: syncedProfile.deviceId,
    excludeFromAnalytics: syncedProfile.excludeFromAnalytics,
    excludeFromLeaderboard: syncedProfile.excludeFromLeaderboard,
    gradeLevel: syncedProfile.gradeLevel,
    isTestAccount: syncedProfile.isTestAccount,
    profileId: syncedProfile.profileId,
    profileImagePath: syncedProfile.profileImagePath,
    profileImageUrl: syncedProfile.profileImageUrl,
    role: syncedProfile.role,
    syncStatus: syncedProfile.syncStatus,
    syncVersion: syncedProfile.syncVersion,
    unlockAllQuizzes: syncedProfile.unlockAllQuizzes,
    unlockMode: syncedProfile.unlockMode,
    username: syncedProfile.username,
  });
  const stored: StoredLearnerSession = {
    allowedPreviewLevels: syncedProfile.allowedPreviewLevels,
    avatarCategory: syncedProfile.avatarCategory,
    avatarAssetKey: syncedProfile.avatarAssetKey,
    avatarId: syncedProfile.avatarId,
    buddyEmoji: syncedProfile.buddyEmoji,
    currentPreviewLevel: syncedProfile.currentPreviewLevel,
    deviceId: syncedProfile.deviceId,
    excludeFromAnalytics: syncedProfile.excludeFromAnalytics,
    excludeFromLeaderboard: syncedProfile.excludeFromLeaderboard,
    gradeLevel: syncedProfile.gradeLevel,
    isTestAccount: syncedProfile.isTestAccount,
    profileId: syncedProfile.profileId,
    profileImagePath: syncedProfile.profileImagePath,
    profileImageUrl: syncedProfile.profileImageUrl,
    role: syncedProfile.role,
    syncStatus: syncedProfile.syncStatus,
    syncVersion: syncedProfile.syncVersion,
    uid: session.user.uid,
    unlockAllQuizzes: syncedProfile.unlockAllQuizzes,
    unlockMode: syncedProfile.unlockMode,
    username: syncedProfile.username,
  };

  await setSecureJsonItem(LEARNER_SESSION_KEY, stored);
  scheduleLearnerProfileCloudSync(syncedProfile);
  return session;
}

export async function loadLearnerSession() {
  try {
    const parsed =
      await getSecureJsonItem<Partial<StoredLearnerSession>>(LEARNER_SESSION_KEY);

    if (
      parsed &&
      typeof parsed.username === "string" &&
      typeof parsed.gradeLevel === "string" &&
      typeof parsed.uid === "string"
    ) {
      const profileId =
        typeof parsed.profileId === "string" ? parsed.profileId : parsed.uid;
      const sessionInput = {
        allowedPreviewLevels: sanitizeAllowedPreviewLevels(parsed.allowedPreviewLevels),
        avatarCategory:
          parsed.avatarCategory === "animal" ||
          parsed.avatarCategory === "fruit" ||
          parsed.avatarCategory === "friendly"
            ? parsed.avatarCategory
            : null,
        avatarAssetKey:
          typeof parsed.avatarAssetKey === "string" ? parsed.avatarAssetKey : null,
        avatarId: typeof parsed.avatarId === "string" ? parsed.avatarId : null,
        buddyEmoji:
          typeof parsed.buddyEmoji === "string" ? parsed.buddyEmoji : null,
        currentPreviewLevel: isLearnerGradeLevel(parsed.currentPreviewLevel)
          ? parsed.currentPreviewLevel
          : null,
        deviceId: typeof parsed.deviceId === "string" ? parsed.deviceId : null,
        excludeFromAnalytics: parsed.excludeFromAnalytics === true,
        excludeFromLeaderboard: parsed.excludeFromLeaderboard === true,
        gradeLevel: parsed.gradeLevel as LearnerGradeLevel,
        isTestAccount: parsed.isTestAccount === true,
        profileId,
        profileImagePath:
          typeof parsed.profileImagePath === "string" ? parsed.profileImagePath : null,
        profileImageUrl:
          typeof parsed.profileImageUrl === "string" ? parsed.profileImageUrl : null,
        role: parsed.role === "tester" ? "tester" as const : "learner" as const,
        syncStatus:
          parsed.syncStatus === "offline" || parsed.syncStatus === "syncing"
            ? parsed.syncStatus
            : "synced" as const,
        syncVersion:
          typeof parsed.syncVersion === "number" && parsed.syncVersion > 0
            ? parsed.syncVersion
            : 1,
        unlockAllQuizzes: parsed.unlockAllQuizzes === true,
        unlockMode: parsed.unlockMode === "all_unlocked" ? "all_unlocked" as const : "normal_locked" as const,
        username: parsed.username,
      };

      await upsertLearnerProfile(sessionInput);
      await saveLocalLearnerProfileId(profileId);
      return buildLearnerSession(sessionInput);
    }

    const activeProfileId = await getLocalLearnerProfileId();
    const profiles = await loadLearnerProfiles();
    const localProfile = activeProfileId
      ? profiles.find(
          (profile) => profile.profileId === activeProfileId && !profile.isDeleted
        )
      : profiles.find((profile) => !profile.isDeleted);

    if (localProfile) {
      return saveLearnerSession({
        allowedPreviewLevels: localProfile.allowedPreviewLevels,
        avatarCategory: localProfile.avatarCategory,
        avatarAssetKey: localProfile.avatarAssetKey,
        avatarId: localProfile.avatarId,
        buddyEmoji: localProfile.buddyEmoji,
        currentPreviewLevel: localProfile.currentPreviewLevel,
        deviceId: localProfile.deviceId,
        excludeFromAnalytics: localProfile.excludeFromAnalytics,
        excludeFromLeaderboard: localProfile.excludeFromLeaderboard,
        gradeLevel: localProfile.gradeLevel,
        isTestAccount: localProfile.isTestAccount,
        profileId: localProfile.profileId,
        profileImagePath: localProfile.profileImagePath ?? null,
        profileImageUrl: localProfile.profileImageUrl ?? null,
        role: localProfile.role,
        syncStatus: localProfile.syncStatus,
        syncVersion: localProfile.syncVersion,
        unlockAllQuizzes: localProfile.unlockAllQuizzes,
        unlockMode: localProfile.unlockMode,
        username: localProfile.username,
      });
    }
  } catch {
    return null;
  }

  return null;
}

export async function clearLearnerSession() {
  await removeSecureJsonItem(LEARNER_SESSION_KEY);
}

export async function updateCurrentLearnerProfile(input: {
  avatarCategory?: "animal" | "fruit" | "friendly" | null;
  avatarAssetKey?: string | null;
  avatarId?: string | null;
  buddyEmoji?: string | null;
  gradeLevel: LearnerGradeLevel;
  profileId: string;
  username: string;
}) {
  return saveLearnerSession({
    avatarCategory: input.avatarCategory,
    avatarAssetKey: input.avatarAssetKey,
    avatarId: input.avatarId,
    buddyEmoji: input.buddyEmoji,
    gradeLevel: input.gradeLevel,
    profileId: input.profileId,
    username: input.username,
  });
}

export async function deleteLocalLearnerProfile(profileId: string) {
  const profiles = await loadLearnerProfiles();
  const now = new Date().toISOString();
  const syncStatus = await markLearnerProfileDeleted(profileId);
  await saveLearnerProfiles(
    profiles
      .filter((profile) => profile.profileId !== profileId)
      .map((profile) => ({
        ...profile,
        isDeleted: profile.profileId === profileId || profile.isDeleted,
        syncStatus,
        updatedAt: now,
      }))
  );
  const activeProfileId = await getLocalLearnerProfileId();

  if (activeProfileId === profileId) {
    await removeSecureJsonItem(DEVICE_PROFILE_ID_KEY);
  }
  await clearLearnerSession();
}
