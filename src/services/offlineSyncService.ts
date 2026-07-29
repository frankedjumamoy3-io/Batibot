import {
  getSecureJsonItem,
  setSecureJsonItem,
} from "@/src/infrastructure/storage/secure-json-storage";
import { createSafeId } from "@/src/utils/idGenerator";

const OFFLINE_SYNC_QUEUE_KEY = "batibot:offline-sync-queue";

export type OfflineSyncTaskType =
  | "profile-upsert"
  | "profile-delete"
  | "settings-update";

export interface OfflineSyncTask {
  createdAt: string;
  payload: Record<string, unknown>;
  profileId: string;
  taskId: string;
  type: OfflineSyncTaskType;
}

async function loadQueue() {
  const queue = await getSecureJsonItem<OfflineSyncTask[]>(OFFLINE_SYNC_QUEUE_KEY);

  return Array.isArray(queue) ? queue : [];
}

export async function enqueueOfflineSyncTask(
  task: Omit<OfflineSyncTask, "createdAt" | "taskId">
) {
  const queue = await loadQueue();
  const nextTask: OfflineSyncTask = {
    ...task,
    createdAt: new Date().toISOString(),
    taskId: createSafeId("sync"),
  };

  await setSecureJsonItem(OFFLINE_SYNC_QUEUE_KEY, [...queue, nextTask]);
  return nextTask;
}

export async function getOfflineSyncQueue() {
  return loadQueue();
}

export async function removeOfflineSyncTasks(taskIds: string[]) {
  const taskSet = new Set(taskIds);
  const queue = await loadQueue();

  await setSecureJsonItem(
    OFFLINE_SYNC_QUEUE_KEY,
    queue.filter((task) => !taskSet.has(task.taskId))
  );
}
