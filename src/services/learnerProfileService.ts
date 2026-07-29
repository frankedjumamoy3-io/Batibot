import { doc, getDoc, Timestamp } from "firebase/firestore";

import { db } from "@/src/config/firebase";
import { getAvatarOptionById } from "@/src/data/avatarOptions";
import {
  getLocalLearnerProfileId as getStoredLocalLearnerProfileId,
  getLocalLearnerProfiles,
  saveLocalLearnerProfileId as saveStoredLocalLearnerProfileId,
  saveLearnerSession,
} from "@/src/data/repositories/learner-session-repository";
import { getOrCreateDeviceId } from "@/src/services/deviceService";
import type { LearnerGradeLevel } from "@/src/types/user";

export type DeviceLearnerGradeLevel =
  | "preschool"
  | "kindergarten"
  | "grade1"
  | "grade2"
  | "grade3";

export type LearnerProfile = {
  id: string;
  deviceId: string;
  name: string;
  gradeLevel: DeviceLearnerGradeLevel;
  avatarId: string;
  avatarAssetKey: string;
  profilePhotoStoragePath?: string;
  profilePhotoUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

type CreateDeviceLearnerProfileInput = {
  avatarAssetKey: string;
  avatarId: string;
  gradeLevel: LearnerGradeLevel | DeviceLearnerGradeLevel;
  name: string;
};

const DISPLAY_TO_DEVICE_GRADE: Record<LearnerGradeLevel, DeviceLearnerGradeLevel> = {
  "Grade 1": "grade1",
  "Grade 2": "grade2",
  "Grade 3": "grade3",
  Kindergarten: "kindergarten",
  Preschool: "preschool",
};

const DEVICE_TO_DISPLAY_GRADE: Record<DeviceLearnerGradeLevel, LearnerGradeLevel> = {
  grade1: "Grade 1",
  grade2: "Grade 2",
  grade3: "Grade 3",
  kindergarten: "Kindergarten",
  preschool: "Preschool",
};

function toDeviceGradeLevel(
  gradeLevel: LearnerGradeLevel | DeviceLearnerGradeLevel
): DeviceLearnerGradeLevel {
  if (gradeLevel in DEVICE_TO_DISPLAY_GRADE) {
    return gradeLevel as DeviceLearnerGradeLevel;
  }

  return DISPLAY_TO_DEVICE_GRADE[gradeLevel as LearnerGradeLevel] ?? "preschool";
}

export function toDisplayGradeLevel(gradeLevel: DeviceLearnerGradeLevel) {
  return DEVICE_TO_DISPLAY_GRADE[gradeLevel];
}

function cleanName(name: string) {
  return name.trim().replace(/\s+/g, " ").slice(0, 20);
}

function toProfile(data: Record<string, unknown>, fallbackId: string): LearnerProfile {
  const gradeLevel =
    typeof data.gradeLevel === "string"
      ? toDeviceGradeLevel(data.gradeLevel as LearnerGradeLevel | DeviceLearnerGradeLevel)
      : "preschool";

  return {
    id: typeof data.id === "string" ? data.id : fallbackId,
    deviceId: typeof data.deviceId === "string" ? data.deviceId : "",
    name:
      typeof data.name === "string"
        ? data.name
        : typeof data.displayName === "string"
          ? data.displayName
          : "Learner",
    gradeLevel,
    avatarId: typeof data.avatarId === "string" ? data.avatarId : "apple",
    avatarAssetKey:
      typeof data.avatarAssetKey === "string" ? data.avatarAssetKey : "avatar.apple",
    profilePhotoStoragePath:
      typeof data.profilePhotoStoragePath === "string"
        ? data.profilePhotoStoragePath
        : typeof data.profileImagePath === "string"
          ? data.profileImagePath
          : undefined,
    profilePhotoUrl:
      typeof data.profilePhotoUrl === "string"
        ? data.profilePhotoUrl
        : typeof data.profileImageUrl === "string"
          ? data.profileImageUrl
          : undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.now(),
  };
}

export async function getLocalLearnerProfileId(): Promise<string | null> {
  return getStoredLocalLearnerProfileId();
}

export async function saveLocalLearnerProfileId(profileId: string): Promise<void> {
  await saveStoredLocalLearnerProfileId(profileId);
}

export async function getCurrentDeviceLearnerProfile(): Promise<LearnerProfile | null> {
  const profileId = await getLocalLearnerProfileId();

  if (!profileId) {
    return null;
  }

  const localProfiles = await getLocalLearnerProfiles();
  const localProfile = localProfiles.find(
    (profile) => profile.profileId === profileId && !profile.isDeleted
  );

  if (localProfile) {
    return {
      id: localProfile.profileId,
      deviceId: localProfile.deviceId ?? (await getOrCreateDeviceId()),
      name: localProfile.username,
      gradeLevel: toDeviceGradeLevel(localProfile.gradeLevel),
      avatarId: localProfile.avatarId ?? "apple",
      avatarAssetKey: localProfile.avatarAssetKey ?? "avatar.apple",
      profilePhotoStoragePath: localProfile.profileImagePath ?? undefined,
      profilePhotoUrl: localProfile.profileImageUrl ?? undefined,
      createdAt: Timestamp.fromDate(new Date(localProfile.createdAt)),
      updatedAt: Timestamp.fromDate(new Date(localProfile.updatedAt ?? localProfile.lastPlayedAt)),
    };
  }

  try {
    const snapshot = await getDoc(doc(db, "learnerProfiles", profileId));

    if (snapshot.exists()) {
      return toProfile(snapshot.data(), profileId);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn("[LearnerProfile] Cloud load failed", error);
    }
  }

  return null;
}

export async function createDeviceLearnerProfile(
  input: CreateDeviceLearnerProfileInput
): Promise<LearnerProfile> {
  const name = cleanName(input.name);

  if (!name) {
    throw new Error("Type your name first.");
  }

  const deviceId = await getOrCreateDeviceId();
  const existingProfileId = await getLocalLearnerProfileId();
  const now = Timestamp.now();
  const gradeLevel = toDeviceGradeLevel(input.gradeLevel);
  const displayGradeLevel = toDisplayGradeLevel(gradeLevel);
  const avatarOption = getAvatarOptionById(input.avatarId);
  const session = await saveLearnerSession({
    avatarAssetKey: input.avatarAssetKey,
    avatarCategory: avatarOption?.category,
    avatarId: input.avatarId,
    buddyEmoji: avatarOption?.emoji,
    gradeLevel: displayGradeLevel,
    profileId: existingProfileId ?? undefined,
    username: name,
  });
  const profile: LearnerProfile = {
    avatarAssetKey: input.avatarAssetKey,
    avatarId: input.avatarId,
    createdAt: now,
    deviceId,
    gradeLevel,
    id: session.user.uid,
    name,
    profilePhotoStoragePath: session.profile.profileImagePath ?? undefined,
    profilePhotoUrl: session.profile.profileImageUrl ?? undefined,
    updatedAt: now,
  };

  await saveLocalLearnerProfileId(profile.id);

  return profile;
}

export async function updateLearnerProfile(
  profileId: string,
  updates: Partial<LearnerProfile>
): Promise<void> {
  try {
    await saveLocalLearnerProfileId(profileId);

    if (__DEV__) {
      console.log("[LearnerProfile] local updated", profileId, updates);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn("[LearnerProfile] Local update failed", error);
    }
  }
}
