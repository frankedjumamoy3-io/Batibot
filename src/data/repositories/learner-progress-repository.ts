import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/src/config/firebase";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import type { LearnerProgressState } from "@/src/domain/entities/learner-progress";
import {
  getSecureJsonItem,
  setSecureJsonItem,
} from "@/src/infrastructure/storage/secure-json-storage";

const STORAGE_KEY_PREFIX = "batibot:learner-progress";

export function getLearnerProgressStorageKey(userId: string) {
  return `${STORAGE_KEY_PREFIX}:${userId}`;
}

export async function loadLocalLearnerProgress(storageKey: string) {
  return getSecureJsonItem<Partial<LearnerProgressState>>(storageKey);
}

export async function saveLocalLearnerProgress(
  storageKey: string,
  progress: Partial<LearnerProgressState>
) {
  await setSecureJsonItem(storageKey, progress);
}

export async function loadCloudLearnerProgress(userId: string) {
  if (USE_NODE_BACKEND) return null;
  const progressSnapshot = await getDoc(doc(db, "users", userId));
  return progressSnapshot.exists() ? progressSnapshot.data() : null;
}

export async function saveCloudLearnerProgress(
  userId: string,
  progress: Partial<LearnerProgressState>
) {
  if (USE_NODE_BACKEND) return;
  await setDoc(
    doc(db, "users", userId),
    {
      learnerProgress: progress,
      learnerProgressUpdatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
