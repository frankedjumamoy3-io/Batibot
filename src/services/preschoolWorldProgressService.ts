import {
  Timestamp,
  doc,
  getDoc,
  runTransaction,
  setDoc,
} from "firebase/firestore";

import { db } from "@/src/config/firebase";
import type { PreschoolInteractiveStageType } from "@/src/data/preschoolStageWorldTypes";

export type PreschoolWorldTopicProgress = {
  attempts: Partial<Record<"try" | "choose" | "play", number>>;
  completedAt?: Timestamp;
  completedStages: PreschoolInteractiveStageType[];
  isCompleted: boolean;
  lastUpdated: Timestamp;
  masteryCompleted?: boolean;
  masteryCompletedAt?: Timestamp;
  playCompleted?: boolean;
  rewardClaimed?: boolean;
  rewardClaimedAt?: Timestamp;
  starsEarned: number;
  xpEarned: number;
};

export type PreschoolWorldProgress<TTopicId extends string = string> = {
  completedTopics: TTopicId[];
  currentTopicId: TTopicId;
  gradeLevel: "preschool" | "kindergarten";
  isWorldCompleted?: boolean;
  topicProgress: Partial<Record<TTopicId, PreschoolWorldTopicProgress>>;
  totalStars: number;
  totalXP: number;
  unlockedTopics?: TTopicId[];
  updatedAt: Timestamp;
  worldId: string;
};

type WorldDefinition<TTopicId extends string> = {
  gradeLevel?: "preschool" | "kindergarten";
  topicOrder: TTopicId[];
  worldId: string;
};

function progressRef(userId: string, worldId: string) {
  return doc(db, "users", userId, "learningProgress", worldId);
}

function emptyProgress<TTopicId extends string>(
  definition: WorldDefinition<TTopicId>
): PreschoolWorldProgress<TTopicId> {
  return {
    completedTopics: [],
    currentTopicId: definition.topicOrder[0],
    gradeLevel: definition.gradeLevel ?? "preschool",
    topicProgress: {},
    totalStars: 0,
    totalXP: 0,
    updatedAt: Timestamp.now(),
    worldId: definition.worldId,
  };
}

function normalizeProgress<TTopicId extends string>(
  value: Partial<PreschoolWorldProgress<TTopicId>> | undefined,
  definition: WorldDefinition<TTopicId>
): PreschoolWorldProgress<TTopicId> {
  const fallback = emptyProgress(definition);
  const completedTopics = Array.isArray(value?.completedTopics)
    ? value.completedTopics.filter((id): id is TTopicId =>
        definition.topicOrder.includes(id as TTopicId)
      )
    : [];
  const currentTopicId =
    value?.currentTopicId && definition.topicOrder.includes(value.currentTopicId)
      ? value.currentTopicId
      : completedTopics.at(-1) ?? definition.topicOrder[0];

  return {
    ...fallback,
    ...value,
    completedTopics,
    currentTopicId,
    gradeLevel: definition.gradeLevel ?? "preschool",
    topicProgress: value?.topicProgress ?? {},
    totalStars: Number(value?.totalStars ?? 0),
    totalXP: Number(value?.totalXP ?? 0),
    worldId: definition.worldId,
  };
}

function uniqueStages(stages: PreschoolInteractiveStageType[]) {
  return Array.from(new Set(stages));
}

function getNextTopicId<TTopicId extends string>(
  topicOrder: TTopicId[],
  topicId: TTopicId
) {
  const index = topicOrder.indexOf(topicId);
  return index >= 0 ? topicOrder[index + 1] : undefined;
}

function createTopicProgress(): PreschoolWorldTopicProgress {
  return {
    attempts: {},
    completedStages: [],
    isCompleted: false,
    lastUpdated: Timestamp.now(),
    starsEarned: 0,
    xpEarned: 0,
  };
}

export async function getPreschoolWorldProgress<TTopicId extends string>(
  userId: string,
  definition: WorldDefinition<TTopicId>
) {
  const snapshot = await getDoc(progressRef(userId, definition.worldId));

  if (!snapshot.exists()) {
    return emptyProgress(definition);
  }

  return normalizeProgress(
    snapshot.data() as Partial<PreschoolWorldProgress<TTopicId>>,
    definition
  );
}

export async function markPreschoolStageComplete<TTopicId extends string>(
  userId: string,
  definition: WorldDefinition<TTopicId>,
  topicId: TTopicId,
  stage: PreschoolInteractiveStageType
) {
  const ref = progressRef(userId, definition.worldId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    const current = normalizeProgress(
      snapshot.exists()
        ? (snapshot.data() as Partial<PreschoolWorldProgress<TTopicId>>)
        : undefined,
      definition
    );
    const topicProgress = current.topicProgress[topicId] ?? createTopicProgress();
    const updatedTopicProgress = {
      ...topicProgress,
      completedStages: uniqueStages([...topicProgress.completedStages, stage]),
      lastUpdated: Timestamp.now(),
    };

    transaction.set(
      ref,
      {
        ...current,
        currentTopicId: topicId,
        topicProgress: {
          ...current.topicProgress,
          [topicId]: updatedTopicProgress,
        },
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  });
}

export async function recordPreschoolAttempt<TTopicId extends string>(
  userId: string,
  definition: WorldDefinition<TTopicId>,
  topicId: TTopicId,
  stage: "try" | "choose" | "play"
) {
  const ref = progressRef(userId, definition.worldId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    const current = normalizeProgress(
      snapshot.exists()
        ? (snapshot.data() as Partial<PreschoolWorldProgress<TTopicId>>)
        : undefined,
      definition
    );
    const topicProgress = current.topicProgress[topicId] ?? createTopicProgress();

    transaction.set(
      ref,
      {
        ...current,
        currentTopicId: topicId,
        topicProgress: {
          ...current.topicProgress,
          [topicId]: {
            ...topicProgress,
            attempts: {
              ...topicProgress.attempts,
              [stage]: Number(topicProgress.attempts[stage] ?? 0) + 1,
            },
            lastUpdated: Timestamp.now(),
          },
        },
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  });
}

export async function markPreschoolTopicComplete<TTopicId extends string>(
  userId: string,
  definition: WorldDefinition<TTopicId>,
  topicId: TTopicId
) {
  const ref = progressRef(userId, definition.worldId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    const current = normalizeProgress(
      snapshot.exists()
        ? (snapshot.data() as Partial<PreschoolWorldProgress<TTopicId>>)
        : undefined,
      definition
    );
    const completedTopics = Array.from(new Set([...current.completedTopics, topicId]));
    const nextTopicId = getNextTopicId(definition.topicOrder, topicId);
    const now = Timestamp.now();

    transaction.set(
      ref,
      {
        ...current,
        completedTopics,
        unlockedTopics: Array.from(
          new Set([
            ...(current.unlockedTopics ?? [definition.topicOrder[0]]),
            ...(nextTopicId ? [nextTopicId] : []),
          ])
        ),
        currentTopicId: nextTopicId ?? topicId,
        isWorldCompleted: !nextTopicId && completedTopics.length === definition.topicOrder.length,
        topicProgress: {
          ...current.topicProgress,
          [topicId]: {
            ...(current.topicProgress[topicId] ?? {}),
            completedStages: uniqueStages([
              ...((current.topicProgress[topicId]?.completedStages ?? []) as PreschoolInteractiveStageType[]),
              "play",
            ]),
            completedAt: current.topicProgress[topicId]?.completedAt ?? now,
            isCompleted: true,
            lastUpdated: now,
            playCompleted: true,
          },
        },
        updatedAt: now,
      },
      { merge: true }
    );
  });
}

export async function awardPreschoolTopicReward<TTopicId extends string>(
  userId: string,
  definition: WorldDefinition<TTopicId>,
  topicId: TTopicId,
  stars: number,
  xp: number
) {
  const ref = progressRef(userId, definition.worldId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    const current = normalizeProgress(
      snapshot.exists()
        ? (snapshot.data() as Partial<PreschoolWorldProgress<TTopicId>>)
        : undefined,
      definition
    );
    const topicProgress = current.topicProgress[topicId];

    if (
      topicProgress?.rewardClaimed ||
      (topicProgress?.starsEarned || topicProgress?.xpEarned)
    ) {
      return;
    }
    const now = Timestamp.now();
    const nextTopicId = getNextTopicId(definition.topicOrder, topicId);
    const completedTopics = Array.from(new Set([...current.completedTopics, topicId]));

    transaction.set(
      ref,
      {
        ...current,
        completedTopics,
        currentTopicId: nextTopicId ?? topicId,
        isWorldCompleted: !nextTopicId && completedTopics.length === definition.topicOrder.length,
        unlockedTopics: Array.from(
          new Set([
            ...(current.unlockedTopics ?? [definition.topicOrder[0]]),
            ...(nextTopicId ? [nextTopicId] : []),
          ])
        ),
        topicProgress: {
          ...current.topicProgress,
          [topicId]: {
            ...(topicProgress ?? createTopicProgress()),
            completedStages: uniqueStages([
              ...((topicProgress?.completedStages ?? []) as PreschoolInteractiveStageType[]),
              "play",
            ]),
            completedAt: topicProgress?.completedAt ?? now,
            isCompleted: true,
            lastUpdated: now,
            playCompleted: true,
            rewardClaimed: true,
            rewardClaimedAt: now,
            starsEarned: Math.max(0, Math.floor(stars)),
            xpEarned: Math.max(0, Math.floor(xp)),
          },
        },
        totalStars: current.totalStars + Math.max(0, Math.floor(stars)),
        totalXP: current.totalXP + Math.max(0, Math.floor(xp)),
        updatedAt: now,
      },
      { merge: true }
    );
  });
}

export async function markPreschoolMasteryComplete<TTopicId extends string>(
  userId: string,
  definition: WorldDefinition<TTopicId>,
  topicId: TTopicId
) {
  const ref = progressRef(userId, definition.worldId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    const current = normalizeProgress(
      snapshot.exists()
        ? (snapshot.data() as Partial<PreschoolWorldProgress<TTopicId>>)
        : undefined,
      definition
    );
    const topicProgress = current.topicProgress[topicId] ?? createTopicProgress();
    const completedTopics = Array.from(new Set([...current.completedTopics, topicId]));
    const nextTopicId = getNextTopicId(definition.topicOrder, topicId);
    const now = Timestamp.now();

    transaction.set(
      ref,
      {
        ...current,
        completedTopics,
        currentTopicId: nextTopicId ?? topicId,
        isWorldCompleted: !nextTopicId && completedTopics.length === definition.topicOrder.length,
        unlockedTopics: Array.from(
          new Set([
            ...(current.unlockedTopics ?? [definition.topicOrder[0]]),
            ...(nextTopicId ? [nextTopicId] : []),
          ])
        ),
        topicProgress: {
          ...current.topicProgress,
          [topicId]: {
            ...topicProgress,
            completedStages: uniqueStages([
              ...topicProgress.completedStages,
              "play",
            ]),
            completedAt: topicProgress.completedAt ?? now,
            isCompleted: true,
            lastUpdated: now,
            masteryCompleted: true,
            masteryCompletedAt: now,
            playCompleted: true,
          },
        },
        updatedAt: now,
      },
      { merge: true }
    );
  });
}

export async function getNextUnlockedPreschoolTopic<TTopicId extends string>(
  userId: string,
  definition: WorldDefinition<TTopicId>
) {
  const progress = await getPreschoolWorldProgress(userId, definition);

  return (
    definition.topicOrder.find((topicId, index) => {
      if (index === 0) return true;
      const previousTopicId = definition.topicOrder[index - 1];
      return progress.completedTopics.includes(previousTopicId);
    }) ?? definition.topicOrder[0]
  );
}

export async function isPreschoolTopicUnlocked<TTopicId extends string>(
  userId: string,
  definition: WorldDefinition<TTopicId>,
  topicId: TTopicId
) {
  const index = definition.topicOrder.indexOf(topicId);

  if (index <= 0) {
    return index === 0;
  }

  const progress = await getPreschoolWorldProgress(userId, definition);
  return progress.completedTopics.includes(definition.topicOrder[index - 1]);
}

export async function ensurePreschoolWorldProgress<TTopicId extends string>(
  userId: string,
  definition: WorldDefinition<TTopicId>
) {
  await setDoc(progressRef(userId, definition.worldId), emptyProgress(definition), {
    merge: true,
  });
}
