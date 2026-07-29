import { signInAnonymously } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

import { auth, db } from "@/src/config/firebase";
import { enqueueOfflineSyncTask } from "@/src/services/offlineSyncService";
import type { LearnerGradeLevel } from "@/src/types/user";

export interface LearnerProfileCloudPayload {
  avatarCategory?: "animal" | "fruit" | "friendly" | null;
  avatarAssetKey?: string | null;
  avatarId?: string | null;
  buddyEmoji?: string | null;
  badges?: string[];
  completedLessons?: string[];
  completedTopics?: string[];
  completedWorlds?: string[];
  deviceId: string;
  displayName: string;
  gradeLevel: LearnerGradeLevel;
  isDeleted?: boolean;
  level?: number;
  profileImagePath?: string | null;
  profileImageUrl?: string | null;
  profileId: string;
  settings?: Record<string, unknown>;
  stars?: number;
  streak?: number;
  syncVersion?: number;
  xp?: number;
}

async function getOptionalCloudOwnerUid() {
  if (auth.currentUser) {
    return auth.currentUser.uid;
  }

  try {
    const credentials = await signInAnonymously(auth);

    if (__DEV__) {
      console.log("[LearnerProfile] anonymous auth uid", credentials.user.uid);
    }

    return credentials.user.uid;
  } catch (error) {
    if (__DEV__) {
      console.warn("[LearnerProfile] Anonymous auth unavailable", error);
    }

    return null;
  }
}

export async function syncLearnerProfileToCloud(
  payload: LearnerProfileCloudPayload
) {
  try {
    const ownerUid = await getOptionalCloudOwnerUid();

    if (!ownerUid) {
      throw new Error("Anonymous auth unavailable.");
    }

    const now = serverTimestamp();
    const learnerProfilePayload = {
      avatarAssetKey: payload.avatarAssetKey ?? null,
      avatarCategory: payload.avatarCategory ?? null,
      avatarId: payload.avatarId ?? null,
      buddyEmoji: payload.buddyEmoji ?? null,
      deviceId: payload.deviceId,
      displayName: payload.displayName,
      gradeLevel: payload.gradeLevel,
      id: payload.profileId,
      isDeleted: payload.isDeleted === true,
      name: payload.displayName,
      ownerUid,
      profileImagePath: payload.profileImagePath ?? null,
      profileImageUrl: payload.profileImageUrl ?? null,
      profilePhotoStoragePath: payload.profileImagePath ?? null,
      profilePhotoUrl: payload.profileImageUrl ?? null,
      profileId: payload.profileId,
      role: "learner",
      syncVersion: payload.syncVersion ?? 1,
      updatedAt: now,
    };

    await setDoc(doc(db, "learnerProfiles", payload.profileId), learnerProfilePayload, {
      merge: true,
    });

    if (ownerUid === payload.profileId) {
      await setDoc(
        doc(db, "users", payload.profileId),
        {
          avatarCategory: payload.avatarCategory ?? null,
          avatarAssetKey: payload.avatarAssetKey ?? null,
          avatarId: payload.avatarId ?? null,
          buddyEmoji: payload.buddyEmoji ?? null,
          badges: payload.badges ?? [],
          completedLessons: payload.completedLessons ?? [],
          completedTopics: payload.completedTopics ?? [],
          completedWorlds: payload.completedWorlds ?? [],
          deviceId: payload.deviceId,
          displayName: payload.displayName,
          gradeLevel: payload.gradeLevel,
          isDeleted: payload.isDeleted === true,
          lastOpened: now,
          level: payload.level ?? 1,
          profileId: payload.profileId,
          profileImagePath: payload.profileImagePath ?? null,
          profileImageUrl: payload.profileImageUrl ?? null,
          profilePhotoStoragePath: payload.profileImagePath ?? null,
          profilePhotoUrl: payload.profileImageUrl ?? null,
          role: "learner",
          settings: payload.settings ?? {},
          stars: payload.stars ?? 0,
          streak: payload.streak ?? 0,
          syncVersion: payload.syncVersion ?? 1,
          updatedAt: now,
          xp: payload.xp ?? 0,
        },
        { merge: true }
      );
    }

    return "synced" as const;
  } catch (error) {
    if (__DEV__) {
      console.warn("[LearnerProfile] Cloud sync failed", error);
    }

    await enqueueOfflineSyncTask({
      payload: payload as unknown as Record<string, unknown>,
      profileId: payload.profileId,
      type: "profile-upsert",
    });
    return "offline" as const;
  }
}

export async function loadLearnerProfileFromCloud(profileId: string) {
  try {
    const snapshot = await getDoc(doc(db, "users", profileId));

    return snapshot.exists() ? snapshot.data() : null;
  } catch {
    return null;
  }
}

export async function markLearnerProfileDeleted(profileId: string) {
  try {
    await updateDoc(doc(db, "users", profileId), {
      isDeleted: true,
      updatedAt: serverTimestamp(),
    });
    return "synced" as const;
  } catch {
    await enqueueOfflineSyncTask({
      payload: { isDeleted: true },
      profileId,
      type: "profile-delete",
    });
    return "offline" as const;
  }
}
