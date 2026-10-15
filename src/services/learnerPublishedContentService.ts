import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/src/config/firebase";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import type {
  ContentDraftStageType,
  CurriculumContentMetadata,
} from "@/src/services/admin/batibotCurriculumApi";

export type PublishedLearnerStageContent = {
  assetRefs?: CurriculumContentMetadata["existingAssetRefs"];
  content: unknown;
  id: string;
  metadata: CurriculumContentMetadata;
};

const PUBLISHED_CONTENT_COLLECTION = "publishedContent";

export async function getPublishedLearnerStageContent(input: {
  gradeLevel?: string | null;
  stageIndex: number;
  stageType: ContentDraftStageType;
  topicId?: string;
  topicTitle: string;
  totalStages: number;
  worldId: string;
}): Promise<PublishedLearnerStageContent | null> {
  if (USE_NODE_BACKEND || !input.gradeLevel || !input.worldId || !input.topicTitle) {
    return null;
  }

  try {
    const snapshot = await getDocs(
      query(
        collection(db, PUBLISHED_CONTENT_COLLECTION),
        where("status", "==", "published"),
        where("worldId", "==", input.worldId),
        limit(50)
      )
    );

    const topicKeys = new Set([
      normalizeKey(input.topicTitle),
      normalizeKey(input.topicId),
    ].filter(Boolean));

    for (const item of snapshot.docs) {
      const data = item.data();
      const metadata = toCurriculumContentMetadata(data.metadata);

      if (!metadata) continue;
      if (String(data.gradeLevel ?? metadata.gradeLevel) !== input.gradeLevel) continue;
      if (String(data.worldId ?? metadata.worldId) !== input.worldId) continue;
      if (!matchesTopic(topicKeys, data.topicTitle, metadata)) continue;
      if (!hasStageContent(data.content, input.stageType, metadata.stageType)) continue;

      return {
        assetRefs: toAssetRefs(data.assetRefs),
        content: data.content ?? null,
        id: item.id,
        metadata: {
          ...metadata,
          stageIndex: input.stageIndex,
          stageType: input.stageType,
          totalStages: input.totalStages,
        },
      };
    }
  } catch {
    return null;
  }

  return null;
}

function hasStageContent(
  content: unknown,
  requestedStage: ContentDraftStageType,
  metadataStage: ContentDraftStageType
) {
  if (metadataStage === requestedStage) return true;

  const stages = asRecord(content).stages;
  if (!Array.isArray(stages)) return false;

  return stages.some((stage) => {
    const record = asRecord(stage);
    return String(record.stageType ?? record.stageLabel ?? "") === requestedStage;
  });
}

function matchesTopic(
  topicKeys: Set<string>,
  recordTopicTitle: unknown,
  metadata: CurriculumContentMetadata
) {
  return [
    recordTopicTitle,
    metadata.topicId,
    metadata.topicTitle,
  ].some((value) => topicKeys.has(normalizeKey(value)));
}

function toCurriculumContentMetadata(value: unknown): CurriculumContentMetadata | null {
  const record = asRecord(value);
  const stageType = record.stageType;

  if (
    !record.gradeLevel ||
    !record.worldId ||
    !record.topicId ||
    !isContentDraftStageType(stageType)
  ) {
    return null;
  }

  return value as CurriculumContentMetadata;
}

function toAssetRefs(value: unknown): CurriculumContentMetadata["existingAssetRefs"] | undefined {
  const record = asRecord(value);

  if (!Object.keys(record).length) return undefined;

  return {
    audio: toStringArray(record.audio),
    backgrounds: toStringArray(record.backgrounds),
    icons: toStringArray(record.icons),
    images: toStringArray(record.images),
  };
}

function isContentDraftStageType(value: unknown): value is ContentDraftStageType {
  return value === "LOOK" ||
    value === "TAP" ||
    value === "TRY" ||
    value === "CHOOSE" ||
    value === "PLAY" ||
    value === "REWARD";
}

function normalizeKey(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
