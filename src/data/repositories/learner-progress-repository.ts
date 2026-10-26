import { doc, getDoc, runTransaction, serverTimestamp } from "firebase/firestore";

import { db } from "@/src/config/firebase";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import type { LearnerProgressState } from "@/src/domain/entities/learner-progress";
import { authenticatedRequest } from "@/src/infrastructure/api/session";
import { mergeLearnerProgress } from "@/src/domain/usecases/learner-progress/merge-progress";
import {
  getSecureJsonItem,
  setSecureJsonItem,
} from "@/src/infrastructure/storage/secure-json-storage";

const STORAGE_KEY_PREFIX = "batibot:learner-progress";
interface ProgressCache {
  schemaVersion: 2;
  revision: number;
  pending: boolean;
  progress: Partial<LearnerProgressState>;
}
interface CloudProgress { learnerProgress?: Partial<LearnerProgressState>; version?: number }
const writes = new Map<string, Promise<unknown>>();
const syncs = new Map<string, Promise<Partial<LearnerProgressState> | null>>();

function serialize<T>(key: string, action: () => Promise<T>): Promise<T> {
  const next = (writes.get(key) ?? Promise.resolve()).catch(() => undefined).then(action);
  writes.set(key, next);
  void next.finally(() => { if (writes.get(key) === next) writes.delete(key); }).catch(() => undefined);
  return next;
}

async function readCache(key: string): Promise<ProgressCache | null> {
  const value = await getSecureJsonItem<ProgressCache | Partial<LearnerProgressState>>(key);
  if (!value) return null;
  if ("schemaVersion" in value && value.schemaVersion === 2) return value;
  return { schemaVersion: 2, revision: 0, pending: true, progress: value as Partial<LearnerProgressState> };
}

export function getLearnerProgressStorageKey(userId: string) {
  return `${STORAGE_KEY_PREFIX}:${userId}`;
}

export async function loadLocalLearnerProgress(storageKey: string) {
  await writes.get(storageKey)?.catch(() => undefined);
  return (await readCache(storageKey))?.progress ?? null;
}

export async function saveLocalLearnerProgress(
  storageKey: string,
  progress: Partial<LearnerProgressState>
) {
  await serialize(storageKey, async () => {
    const previous = await readCache(storageKey);
    await setSecureJsonItem(storageKey, {
      schemaVersion: 2, revision: (previous?.revision ?? 0) + 1, pending: true, progress,
    } satisfies ProgressCache);
  });
}

export async function loadCloudLearnerProgress(userId: string): Promise<CloudProgress | null> {
  if (USE_NODE_BACKEND) return authenticatedRequest<CloudProgress>("/learner/progress", "GET", undefined, { expectedUserId: userId });
  const progressSnapshot = await getDoc(doc(db, "users", userId));
  return progressSnapshot.exists() ? progressSnapshot.data() : null;
}

export async function saveCloudLearnerProgress(
  userId: string,
  progress: Partial<LearnerProgressState>,
  expectedVersion = 0
) {
  if (USE_NODE_BACKEND) {
    await authenticatedRequest("/learner/progress", "PUT", { learnerProgress: progress, expectedVersion }, { expectedUserId: userId });
    return progress;
  }
  return runTransaction(db, async transaction => {
    const reference = doc(db, "users", userId);
    const snapshot = await transaction.get(reference);
    const merged = mergeLearnerProgress(progress, snapshot.data()?.learnerProgress);
    const { isTestAccount: _test, unlockAllQuizzes: _unlock, ...persistable } = merged;
    transaction.set(reference, { learnerProgress: persistable, learnerProgressUpdatedAt: serverTimestamp() }, { merge: true });
    return persistable;
  });
}

/** The durable cache is also the outbox. A failed upload never clears it. */
export function syncLearnerProgress(userId: string) {
  const existing = syncs.get(userId);
  if (existing) return existing;
  const key = getLearnerProgressStorageKey(userId);
  const task = (async () => {
    const before = await serialize(key, () => readCache(key));
    const cloud = await loadCloudLearnerProgress(userId);
    const merged = mergeLearnerProgress(before?.progress, cloud?.learnerProgress);
    const { isTestAccount: _test, unlockAllQuizzes: _unlock, ...persistable } = merged;
    const saved = await saveCloudLearnerProgress(userId, persistable, cloud?.version ?? 0);
    return serialize(key, async () => {
      const latest = await readCache(key);
      const changedDuringUpload = latest?.revision !== before?.revision;
      const progress = changedDuringUpload ? mergeLearnerProgress(latest?.progress, saved) : saved;
      await setSecureJsonItem(key, {
        schemaVersion: 2, revision: latest?.revision ?? 0, pending: changedDuringUpload, progress,
      } satisfies ProgressCache);
      return progress;
    });
  })().finally(() => { syncs.delete(userId); });
  syncs.set(userId, task);
  return task;
}
