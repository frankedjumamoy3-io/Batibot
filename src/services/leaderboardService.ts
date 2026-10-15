import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/src/config/firebase";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import {
  getLearnerProgressStorageKey,
  loadLocalLearnerProgress,
} from "@/src/data/repositories/learner-progress-repository";
import { getLocalLearnerProfiles } from "@/src/data/repositories/learner-session-repository";
import type { GradeLevel, RankEntry } from "@/src/types/learning";
import type { LearnerGradeLevel } from "@/src/types/user";
import { gradeLevelToLearnerGradeLabel, toGradeLevel } from "@/src/utils/gradeUtils";

type JsonRecord = Record<string, unknown>;

export interface LeaderboardEntry {
  avatar: string;
  curriculumLevel: GradeLevel | LearnerGradeLevel | "Unknown";
  displayName: string;
  entryType?: "benchmark" | "learner";
  isCurrentLearner?: boolean;
  isLocalFallback?: boolean;
  profilePhotoUrl?: string | null;
  rank: number;
  stars: number;
  uid: string;
  xp: number;
}

export interface CurrentLearnerLeaderboardInput {
  avatar?: string | null;
  curriculumLevel?: LearnerGradeLevel | null;
  displayName?: string | null;
  excludeFromLeaderboard?: boolean;
  isTestAccount?: boolean;
  profilePhotoUrl?: string | null;
  role?: string | null;
  stars: number;
  uid?: string | null;
  xp: number;
}

interface LocalGradeLeaderboardOptions {
  currentLearnerUid?: string | null;
  maxEntries?: number;
}

export interface LeaderboardSyncInput {
  avatar?: string | null;
  displayName: string;
  excludeFromAnalytics?: boolean;
  excludeFromLeaderboard?: boolean;
  gradeLevel: GradeLevel | LearnerGradeLevel;
  isLocalLearner?: boolean;
  isTestAccount?: boolean;
  profilePhotoUrl?: string | null;
  stars: number;
  uid: string;
  xp: number;
}

function cleanString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function cleanDisplayName(value: unknown, fallback = "Learner") {
  const displayName = cleanString(value, fallback);

  return displayName.includes("@") ? fallback : displayName;
}

function normalizeCurriculumLevel(
  value?: LearnerGradeLevel | "Unknown" | null
): LeaderboardEntry["curriculumLevel"] {
  return value ?? "Unknown";
}

function getStringArrayCount(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string").length
    : 0;
}

function cleanNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : 0;
}

function isExcludedLeaderboardRecord(data: JsonRecord) {
  const role = cleanString(data.role).toLowerCase();

  return (
    data.isTestAccount === true ||
    data.excludeFromLeaderboard === true ||
    data.excludeFromAnalytics === true ||
    role === "admin" ||
    role === "tester"
  );
}

function isCurrentLearnerExcluded(currentLearner: CurrentLearnerLeaderboardInput) {
  const role = currentLearner.role?.trim().toLowerCase();

  return (
    currentLearner.isTestAccount === true ||
    currentLearner.excludeFromLeaderboard === true ||
    role === "admin" ||
    role === "tester"
  );
}

function normalizeEntry(id: string, data: JsonRecord): LeaderboardEntry | null {
  if (isExcludedLeaderboardRecord(data)) {
    return null;
  }

  const stars =
    typeof data.stars === "number"
      ? cleanNumber(data.stars)
      : getStringArrayCount(data.claimedWorldRewardIds);
  const xp = cleanNumber(data.xp);

  return {
    avatar: cleanString(data.avatar, cleanString(data.buddyEmoji, "B")),
    curriculumLevel: cleanString(
      data.curriculumLevel,
      cleanString(data.gradeLevel, "Unknown")
    ) as LeaderboardEntry["curriculumLevel"],
    displayName: cleanDisplayName(
      data.nickname,
      cleanDisplayName(data.displayName, "Learner")
    ),
    entryType: "learner",
    profilePhotoUrl:
      cleanString(data.profilePhotoUrl, cleanString(data.profileImageUrl, "")) || null,
    rank: 0,
    stars,
    uid: cleanString(data.uid, id),
    xp,
  };
}

export function rankEntries(entries: LeaderboardEntry[]) {
  return [...entries]
    .sort(
      (left, right) =>
        right.stars - left.stars ||
        right.xp - left.xp ||
        left.displayName.localeCompare(right.displayName)
    )
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}

function rankGradeEntries(entries: RankEntry[], maxEntries: number) {
  return [...entries]
    .sort(
      (left, right) =>
        right.stars - left.stars ||
        right.xp - left.xp ||
        left.displayName.localeCompare(right.displayName)
    )
    .slice(0, maxEntries);
}

function toRankEntry(entry: LeaderboardEntry, gradeLevel: GradeLevel): RankEntry {
  return {
    uid: entry.uid,
    displayName: entry.displayName,
    gradeLevel,
    xp: entry.xp,
    stars: entry.stars,
  };
}

export function getLeaderboardLevelId(
  gradeLevel: GradeLevel | LearnerGradeLevel | string | null | undefined
) {
  return toGradeLevel(gradeLevel)
    .replace(/([a-z])([0-9])/g, "$1-$2")
    .toLowerCase();
}

export function normalizeLeaderboardEntry(
  id: string,
  data: JsonRecord,
  gradeLevel: GradeLevel
): LeaderboardEntry | null {
  const entry = normalizeEntry(id, data);

  if (!entry) {
    return null;
  }

  return {
    ...entry,
    curriculumLevel:
      entry.curriculumLevel === "Unknown"
        ? gradeLevelToLearnerGradeLabel(gradeLevel)
        : entry.curriculumLevel,
  };
}

export async function getGradeLeaderboardFromSnapshots(
  gradeLevel: GradeLevel,
  maxEntries = 10
): Promise<LeaderboardEntry[]> {
  if (USE_NODE_BACKEND) return getLocalGradeLeaderboard(gradeLevel, { maxEntries });
  const fetchLimit = Math.max(maxEntries * 3, maxEntries);
  const leaderboardRef = collection(
    db,
    "leaderboards",
    "levels",
    getLeaderboardLevelId(gradeLevel),
    "entries"
  );

  const leaderboardQuery = query(
    leaderboardRef,
    orderBy("stars", "desc"),
    orderBy("xp", "desc"),
    limit(fetchLimit)
  );

  const snapshot = await getDocs(leaderboardQuery);
  const entries = snapshot.docs
    .map((entryDoc) =>
      normalizeLeaderboardEntry(entryDoc.id, entryDoc.data() as JsonRecord, gradeLevel)
    )
    .filter((entry): entry is LeaderboardEntry => entry !== null)
    .filter(
      (entry) =>
        entry.curriculumLevel !== "Unknown" &&
        toGradeLevel(entry.curriculumLevel) === gradeLevel
    );

  return rankEntries(entries).slice(0, maxEntries);
}

export async function getGradeLeaderboard(
  gradeLevel: GradeLevel,
  maxEntries = 10
): Promise<RankEntry[]> {
  const entries = await getGradeLeaderboardFromSnapshots(gradeLevel, maxEntries);

  return rankGradeEntries(
    entries.map((entry) => toRankEntry(entry, gradeLevel)),
    maxEntries
  );
}

export function buildLocalLeaderboard(
  currentLearner: CurrentLearnerLeaderboardInput,
  scope: "global" | "level"
) {
  if (isCurrentLearnerExcluded(currentLearner)) {
    return [];
  }

  const currentLevel = currentLearner.curriculumLevel ?? "Unknown";
  const currentEntry: LeaderboardEntry = {
    avatar: currentLearner.avatar || "B",
    curriculumLevel: currentLevel,
    displayName: currentLearner.displayName?.trim() || "You",
    entryType: "learner",
    isCurrentLearner: true,
    isLocalFallback: true,
    profilePhotoUrl: currentLearner.profilePhotoUrl ?? null,
    rank: 0,
    stars: cleanNumber(currentLearner.stars),
    uid: currentLearner.uid || "current-learner",
    xp: cleanNumber(currentLearner.xp),
  };

  return rankEntries(scope === "level" && currentLevel === "Unknown" ? [] : [currentEntry]);
}

export async function getLocalGradeLeaderboard(
  gradeLevel: GradeLevel,
  { currentLearnerUid, maxEntries = 10 }: LocalGradeLeaderboardOptions = {}
) {
  const profiles = await getLocalLearnerProfiles();
  const entries = await Promise.all(
    profiles
      .filter(
        (profile) =>
          !profile.isDeleted &&
          profile.isTestAccount !== true &&
          profile.excludeFromLeaderboard !== true &&
          toGradeLevel(profile.gradeLevel) === gradeLevel
      )
      .map(async (profile): Promise<LeaderboardEntry> => {
        const progress = await loadLocalLearnerProgress(
          getLearnerProgressStorageKey(profile.profileId)
        );
        const stars = Array.isArray(progress?.claimedWorldRewardIds)
          ? progress.claimedWorldRewardIds.length
          : 0;

        return {
          avatar: profile.avatarAssetKey || profile.avatarId || profile.buddyEmoji || "B",
          curriculumLevel: profile.gradeLevel,
          displayName: cleanDisplayName(profile.username, "Learner"),
          entryType: "learner",
          isCurrentLearner: profile.profileId === currentLearnerUid,
          isLocalFallback: true,
          profilePhotoUrl: profile.profileImageUrl ?? null,
          rank: 0,
          stars,
          uid: profile.profileId,
          xp: cleanNumber(progress?.totalXp),
        };
      })
  );

  return rankEntries(entries).slice(0, maxEntries);
}

export async function syncCurrentLearnerLeaderboardEntry(
  input: LeaderboardSyncInput
) {
  if (USE_NODE_BACKEND) return;
  if (
    !input.uid ||
    input.isLocalLearner === true ||
    input.isTestAccount === true ||
    input.excludeFromAnalytics === true ||
    input.excludeFromLeaderboard === true
  ) {
    return;
  }

  const gradeLevel = toGradeLevel(input.gradeLevel);
  const entry = {
    avatar: input.avatar || "B",
    curriculumLevel: gradeLevelToLearnerGradeLabel(gradeLevel),
    displayName: cleanDisplayName(input.displayName, "Learner"),
    gradeLevel,
    profileImageUrl: input.profilePhotoUrl ?? null,
    profilePhotoUrl: input.profilePhotoUrl ?? null,
    stars: cleanNumber(input.stars),
    uid: input.uid,
    updatedAt: serverTimestamp(),
    xp: cleanNumber(input.xp),
  };

  await setDoc(
    doc(
      db,
      "leaderboards",
      "levels",
      getLeaderboardLevelId(gradeLevel),
      "entries",
      input.uid
    ),
    entry,
    { merge: true }
  );
}

function getLeaderboardCollectionRef(
  scope: "global" | "level",
  currentLearner: CurrentLearnerLeaderboardInput
) {
  if (scope === "global") {
    return collection(db, "leaderboards", "global", "entries");
  }

  return collection(
    db,
    "leaderboards",
    "levels",
    getLeaderboardLevelId(currentLearner.curriculumLevel),
    "entries"
  );
}

export async function getLeaderboardEntries({
  currentLearner,
  maxCount = 50,
  scope,
}: {
  currentLearner: CurrentLearnerLeaderboardInput;
  maxCount?: number;
  scope: "global" | "level";
}) {
  if (USE_NODE_BACKEND) return buildLocalLeaderboard(currentLearner, scope);
  if (isCurrentLearnerExcluded(currentLearner)) {
    return [];
  }

  const leaderboardCollection = getLeaderboardCollectionRef(scope, currentLearner);
  const snapshot = await getDocs(
    query(
      leaderboardCollection,
      orderBy("stars", "desc"),
      orderBy("xp", "desc"),
      limit(maxCount)
    )
  );
  const entries = snapshot.docs
    .map((userDoc) => normalizeEntry(userDoc.id, userDoc.data() as JsonRecord))
    .filter((entry): entry is LeaderboardEntry => entry !== null)
    .filter(
      (entry) =>
        scope === "global" ||
        entry.curriculumLevel === (currentLearner.curriculumLevel ?? "Unknown")
    );
  const currentUid = currentLearner.uid || "current-learner";
  const currentCurriculumLevel = normalizeCurriculumLevel(
    currentLearner.curriculumLevel
  );
  const hasCurrentLearner = entries.some((entry) => entry.uid === currentUid);
  const withCurrentLearner = hasCurrentLearner
    ? entries.map((entry) =>
        entry.uid === currentUid ? { ...entry, isCurrentLearner: true } : entry
      )
    : [
        ...entries,
        {
          avatar: currentLearner.avatar || "B",
          curriculumLevel: currentCurriculumLevel,
          entryType: "learner" as const,
          displayName: currentLearner.displayName?.trim() || "You",
          isCurrentLearner: true,
          profilePhotoUrl: currentLearner.profilePhotoUrl ?? null,
          rank: 0,
          stars: cleanNumber(currentLearner.stars),
          uid: currentUid,
          xp: cleanNumber(currentLearner.xp),
        },
      ];

  return rankEntries(withCurrentLearner).slice(0, maxCount);
}
