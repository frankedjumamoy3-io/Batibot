import type { LearnerProgressState } from "@/src/domain/entities/learner-progress";
import { sanitizeLearnerProgress } from "./progress-state";

/** Merge achievements monotonically; a deliberate reset starts a new progress epoch. */
export function mergeLearnerProgress(localRaw: unknown, cloudRaw: unknown): LearnerProgressState {
  const local = sanitizeLearnerProgress(localRaw);
  const cloud = sanitizeLearnerProgress(cloudRaw);
  if (local.resetAt !== cloud.resetAt) {
    return (local.resetAt ?? "") > (cloud.resetAt ?? "") ? local : cloud;
  }
  const merged = { ...cloud, ...local } as unknown as Record<string, unknown>;
  for (const key of Object.keys(local) as (keyof LearnerProgressState)[]) {
    const left = local[key];
    const right = cloud[key];
    if (typeof left === "number" && typeof right === "number") merged[key] = Math.max(left, right);
    else if (Array.isArray(left) && Array.isArray(right)) {
      const items = new Map<string, unknown>();
      for (const item of [...right, ...left]) {
        const identity = typeof item === "object" && item !== null
          ? String((item as { id?: string }).id ?? JSON.stringify(item)) : String(item);
        items.set(identity, item);
      }
      merged[key] = [...items.values()];
    } else if (left && right && typeof left === "object" && typeof right === "object") {
      const records: Record<string, unknown> = { ...right, ...left };
      for (const id of Object.keys(left)) {
        const a = (left as Record<string, unknown>)[id];
        const b = (right as Record<string, unknown>)[id];
        if (typeof a === "number" && typeof b === "number") records[id] = Math.max(a, b);
        else if (a && b && typeof a === "object" && typeof b === "object") {
          const x = a as Record<string, unknown>, y = b as Record<string, unknown>;
          const time = (v: Record<string, unknown>) => String(v.savedAt ?? v.lastCompletedAt ?? v.masteredAt ?? v.updatedAt ?? v.lastAttemptAt ?? "");
          records[id] = time(x) >= time(y) ? a : b;
          if (key === "completedStagesByTopic") records[id] = {
            ...(records[id] as object),
            completedStages: [...new Set([...(x.completedStages as string[]), ...(y.completedStages as string[])])],
            topicMasteryPercent: Math.max(Number(x.topicMasteryPercent), Number(y.topicMasteryPercent)),
          };
        }
      }
      merged[key] = records;
    }
  }
  // Access is owned by the authenticated session, never a saved progress payload.
  merged.isTestAccount = local.isTestAccount;
  merged.unlockAllQuizzes = local.unlockAllQuizzes;
  return sanitizeLearnerProgress(merged);
}
