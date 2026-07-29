import type { ImageSourcePropType } from "react-native";

import {
  BATIBOT_ASSET_MANIFEST,
  getStageAssetId,
  getTopicAssetId,
  getWorldAssetId,
  type BatiBotAssetManifestItem,
  type BatiBotAssetProvider,
  type BatiBotAssetStatus,
  type BatiBotAssetType,
} from "@/src/data/assets/batibot-asset-manifest";
import { fallbackIconMap, getFallbackIconForLabel } from "@/src/data/assets/fallback-icon-map";
import {
  getCurriculumPlaceholderAsset,
  getEducationalFallbackActivity,
  type EducationalFallbackActivity,
} from "@/src/data/assets/educational-fallbacks";
import type { ActiveLearningPhase, FrameworkStageLabel } from "@/src/data/curriculum/learning-path";
import type { LearnerGradeLevel } from "@/src/types/user";
import {
  ANIMAL_SOUND_ASSETS,
  COUNTING_FOREST_ASSETS,
  FAMILY_WORLD_REWARD_ASSETS,
  KINDERGARTEN_PATTERN_ASSETS,
  PRESCHOOL_CONCEPT_ASSETS,
  PRESCHOOL_WORLD_INTRO_ASSETS,
  RANK_ASSETS,
  REWARD_ASSETS,
  TIMER_ALERT_ASSETS,
  getPlayBackgroundForGrade,
  getTopicImage,
  getWorldImage,
} from "@/src/data/play-assets";

export {
  ANIMAL_SOUND_ASSETS,
  COUNTING_FOREST_ASSETS,
  FAMILY_WORLD_REWARD_ASSETS,
  KINDERGARTEN_PATTERN_ASSETS,
  PRESCHOOL_CONCEPT_ASSETS,
  PRESCHOOL_WORLD_INTRO_ASSETS,
  RANK_ASSETS,
  REWARD_ASSETS,
  TIMER_ALERT_ASSETS,
};

export enum AssetStatus {
  READY = "READY",
  PLACEHOLDER_READY = "PLACEHOLDER_READY",
  FALLBACK_READY = "FALLBACK_READY",
  MISSING = "MISSING",
}

export type ResolvedBatiBotAsset = {
  altText: string;
  assetType: BatiBotAssetType;
  firebasePath?: string;
  iconName: string;
  id: string;
  isPlaceholder: boolean;
  label: string;
  learnerStatus: AssetStatus;
  localSource?: ImageSourcePropType;
  educationalFallback: EducationalFallbackActivity;
  provider: BatiBotAssetProvider;
  prompt?: string;
  status: BatiBotAssetStatus;
  topicId?: string;
  worldId?: string;
};

export type AssetResolutionRequest = {
  assetId?: string | null;
  gradeLevel?: LearnerGradeLevel | null;
  stage?: ActiveLearningPhase | FrameworkStageLabel | null;
  tags?: string[];
  topic?: string | null;
  topicId?: string | null;
  world?: string | null;
  worldId?: string | null;
};

export type AssetHealthSummary = {
  approvedAssets: number;
  completionPercentage: number;
  missingAssets: number;
  placeholderAssets: number;
  totalAssets: number;
};

export type AssetValidationIssue = {
  assetId: string;
  issue: string;
  severity: "critical" | "warning";
};

const runtimeAssets = new Map<string, BatiBotAssetManifestItem>();
const assetCache = new Map<string, ResolvedBatiBotAsset>();
const assetById = new Map(BATIBOT_ASSET_MANIFEST.map((asset) => [asset.id, asset]));
const assetRegistryListeners = new Set<() => void>();
let assetRegistryVersion = 0;

function notifyAssetRegistryListeners() {
  assetRegistryVersion += 1;
  assetRegistryListeners.forEach((listener) => listener());
}

export function subscribeToAssetRegistryChanges(listener: () => void) {
  assetRegistryListeners.add(listener);
  return () => {
    assetRegistryListeners.delete(listener);
  };
}

export function getAssetRegistryVersion() {
  return assetRegistryVersion;
}

function toResolvedAsset(asset: BatiBotAssetManifestItem): ResolvedBatiBotAsset {
  const iconName =
    asset.iconName ??
    getFallbackIconForLabel(`${asset.label} ${asset.assetType}`) ??
    fallbackIconMap.generic;

  return {
    altText: asset.altText,
    assetType: asset.assetType,
    firebasePath: asset.firebasePath,
    iconName,
    id: asset.id,
    isPlaceholder: !asset.localSource && !asset.remoteUri,
    label: asset.label,
    learnerStatus: asset.localSource || asset.remoteUri
      ? AssetStatus.READY
      : AssetStatus.PLACEHOLDER_READY,
    localSource: asset.localSource ?? (asset.remoteUri ? { uri: asset.remoteUri } : undefined),
    educationalFallback: getEducationalFallbackActivity({
      concept: asset.topicTitle ?? asset.label,
      phase: asset.stage ?? "LOOK",
      worldId: asset.worldId,
    }),
    prompt: asset.prompt,
    provider: asset.remoteUri ? "firebase" : asset.localSource ? "custom" : asset.provider ?? "iconify",
    status: asset.status,
    topicId: asset.topicId,
    worldId: asset.worldId,
  };
}

function createFallbackAsset(
  assetId: string,
  assetType: BatiBotAssetType,
  label?: string
): ResolvedBatiBotAsset {
  const safeLabel = label || assetId.replace(/[_-]+/g, " ");
  const placeholder = getCurriculumPlaceholderAsset(undefined, safeLabel);
  const educationalFallback = getEducationalFallbackActivity({ concept: safeLabel });

  return {
    altText: `${safeLabel} learning illustration`,
    assetType,
    educationalFallback,
    iconName: placeholder.iconName || getFallbackIconForLabel(safeLabel),
    id: assetId,
    isPlaceholder: true,
    label: placeholder.label,
    learnerStatus: AssetStatus.FALLBACK_READY,
    provider: "iconify",
    status: "missing",
  };
}

function normalizeStage(stage?: ActiveLearningPhase | FrameworkStageLabel | null) {
  if (!stage) return undefined;

  const phaseToFramework: Record<ActiveLearningPhase, FrameworkStageLabel> = {
    Challenge: "PLAY",
    Discover: "LOOK",
    Explore: "TAP",
    Interact: "TRY",
    Mastery: "MASTERED",
    Practice: "CHOOSE",
    Progress: "PROGRESS",
    Reward: "STAR",
  };

  return phaseToFramework[stage as ActiveLearningPhase] ?? stage;
}

function parseAssetSlot(assetId: string): AssetResolutionRequest | null {
  const match = assetId.match(/^asset-slot:\/\/([^/]+)\/([^/]+)\/([^/]+)$/i);
  const slotToStage: Record<string, FrameworkStageLabel | undefined> = {
    choose: "CHOOSE",
    look: "LOOK",
    mastered: "MASTERED",
    play: "PLAY",
    reward: "STAR",
    tap: "TAP",
    topic: undefined,
    try: "TRY",
  };

  return match
    ? {
        stage: slotToStage[match[3].toLowerCase()],
        topicId: `${match[1]}-${match[2]}`,
        worldId: match[1],
      }
    : null;
}

function getAssetCacheKey(request: AssetResolutionRequest) {
  return JSON.stringify({
    assetId: request.assetId ?? "",
    gradeLevel: request.gradeLevel ?? "",
    stage: normalizeStage(request.stage) ?? "",
    tags: [...(request.tags ?? [])].sort(),
    topic: request.topic ?? "",
    topicId: request.topicId ?? "",
    worldId: request.worldId ?? request.world ?? "",
  });
}

function getAllRegisteredAssets() {
  return [...runtimeAssets.values(), ...BATIBOT_ASSET_MANIFEST];
}

function isLearnerUsableAsset(asset: BatiBotAssetManifestItem) {
  if (asset.remoteUri) {
    return asset.status === "approved";
  }

  return asset.status !== "rejected";
}

function findRegisteredAsset(request: AssetResolutionRequest) {
  const worldId = request.worldId ?? request.world ?? undefined;
  const topicId =
    request.topicId ??
    (worldId && request.topic ? getTopicAssetId(worldId, request.topic) : undefined);
  const stage = normalizeStage(request.stage);
  const assets = getAllRegisteredAssets();

  if (request.assetId) {
    const slotRequest = parseAssetSlot(request.assetId);
    if (slotRequest) return findRegisteredAsset({ ...request, ...slotRequest, assetId: undefined });

    const runtimeExact =
      runtimeAssets.get(request.assetId) ??
      runtimeAssets.get(`topic_${request.assetId}`);
    const localExact =
      assetById.get(request.assetId) ??
      assetById.get(`topic_${request.assetId}`);
    const exact =
      runtimeExact && isLearnerUsableAsset(runtimeExact)
        ? runtimeExact
        : localExact && isLearnerUsableAsset(localExact)
          ? localExact
          : undefined;
    if (exact) return exact;
  }

  if (topicId && stage) {
    const exactStage = assets.find(
      (asset) =>
        asset.topicId === topicId &&
        normalizeStage(asset.stage) === stage &&
        isLearnerUsableAsset(asset) &&
        (asset.status === "approved" || asset.localSource)
    );
    if (exactStage) return exactStage;
  }

  if (topicId) {
    const exactTopic = assets.find(
      (asset) =>
        asset.topicId === topicId &&
        asset.id.startsWith("topic_") &&
        isLearnerUsableAsset(asset) &&
        (asset.status === "approved" || asset.localSource)
    );
    if (exactTopic) return exactTopic;

    const topicPlaceholder = assets.find(
      (asset) => asset.topicId === topicId && isLearnerUsableAsset(asset) && Boolean(asset.iconName)
    );
    if (topicPlaceholder) return topicPlaceholder;
  }

  if (worldId) {
    const worldAsset = assets.find(
      (asset) => asset.assetType === "world" && asset.worldId === worldId && isLearnerUsableAsset(asset)
    );
    if (worldAsset) return worldAsset;
  }

  if (request.gradeLevel) {
    const gradeAsset = assets.find(
      (asset) => asset.assetType === "world" && asset.gradeLevel === request.gradeLevel && isLearnerUsableAsset(asset)
    );
    if (gradeAsset) return gradeAsset;
  }

  if (request.tags?.length) {
    const normalizedTags = request.tags.map((tag) => tag.trim().toLowerCase());
    const taggedAsset = assets.find((asset) =>
      isLearnerUsableAsset(asset) &&
      normalizedTags.every((tag) => asset.tags.some((candidate) => candidate.includes(tag)))
    );
    if (taggedAsset) return taggedAsset;
  }

  return undefined;
}

export function resolveAsset(
  requestOrId?: AssetResolutionRequest | string | null
): ResolvedBatiBotAsset {
  const request =
    typeof requestOrId === "string" || requestOrId == null
      ? { assetId: requestOrId }
      : requestOrId;
  const cacheKey = getAssetCacheKey(request);
  const cached = assetCache.get(cacheKey);

  if (cached) return cached;

  if (
    !request.assetId &&
    !request.topicId &&
    !request.topic &&
    !request.worldId &&
    !request.world &&
    !request.gradeLevel &&
    !request.tags?.length
  ) {
    return createFallbackAsset("missing_curriculum_asset", "curriculum", "Learning picture");
  }

  const asset = findRegisteredAsset(request);
  const result = asset
    ? toResolvedAsset(asset)
    : createFallbackAsset(
        request.assetId ?? request.topicId ?? request.topic ?? request.worldId ?? "curriculum",
        request.worldId && !request.topic && !request.topicId ? "world" : "curriculum",
        request.topic ?? request.topicId ?? "Learning picture"
      );

  assetCache.set(cacheKey, result);
  return result;
}

export function resolveWorldAsset(worldId: string): ResolvedBatiBotAsset {
  return resolveAsset({ assetId: getWorldAssetId(worldId), worldId });
}

export function resolveTopicAsset(topicId: string): ResolvedBatiBotAsset {
  return resolveAsset({ topicId });
}

export function resolveTopicAssetForTitle(worldId: string, topicTitle?: string | null) {
  if (!topicTitle) {
    return resolveWorldAsset(worldId);
  }

  return resolveTopicAsset(getTopicAssetId(worldId, topicTitle));
}

export function resolveStageAsset(
  topicId: string,
  stage: ActiveLearningPhase | FrameworkStageLabel
): ResolvedBatiBotAsset {
  return resolveAsset({ assetId: getStageAssetId(topicId, stage), stage, topicId });
}

export function registerAsset(asset: BatiBotAssetManifestItem) {
  runtimeAssets.set(asset.id, asset);
  assetCache.clear();
  notifyAssetRegistryListeners();
  return toResolvedAsset(asset);
}

export function registerAssets(assets: BatiBotAssetManifestItem[]) {
  assets.forEach((asset) => runtimeAssets.set(asset.id, asset));
  assetCache.clear();
  notifyAssetRegistryListeners();
}

export function clearRuntimeAssets() {
  runtimeAssets.clear();
  assetCache.clear();
  notifyAssetRegistryListeners();
}

export function resolveTopicAssetSource(worldId: string, topicTitle?: string | null) {
  return resolveAsset({ topic: topicTitle, worldId }).localSource ?? getTopicImage(worldId, topicTitle ?? undefined);
}

export function resolveWorldAssetSource(worldId: string) {
  return resolveWorldAsset(worldId).localSource ?? getWorldImage(worldId);
}

export function resolvePlayBackgroundSource(gradeLevel?: LearnerGradeLevel | null) {
  return getPlayBackgroundForGrade(gradeLevel);
}

export function resolveFallbackIcon(assetType: BatiBotAssetType) {
  return fallbackIconMap[assetType] ?? fallbackIconMap.generic;
}

export function hasApprovedAsset(assetId?: string | null) {
  const asset = assetId ? assetById.get(assetId) ?? assetById.get(`topic_${assetId}`) : null;

  return Boolean(asset?.localSource && asset.status === "approved");
}

export function isAssetMissing(assetId?: string | null) {
  if (!assetId) {
    return true;
  }

  const asset = assetById.get(assetId) ?? assetById.get(`topic_${assetId}`);

  return !asset?.localSource;
}

export function getAssetHealthSummary(
  assets: BatiBotAssetManifestItem[] = BATIBOT_ASSET_MANIFEST
): AssetHealthSummary {
  const totalAssets = assets.length;
  const approvedAssets = assets.filter((asset) => asset.status === "approved" && asset.localSource).length;
  const placeholderAssets = assets.filter((asset) => asset.status === "placeholder").length;
  const missingAssets = assets.filter((asset) => asset.status === "missing" || !asset.localSource).length;

  return {
    approvedAssets,
    completionPercentage: totalAssets ? Math.round((approvedAssets / totalAssets) * 100) : 0,
    missingAssets,
    placeholderAssets,
    totalAssets,
  };
}

export function validateAssetManifest(
  assets: BatiBotAssetManifestItem[] = BATIBOT_ASSET_MANIFEST
) {
  const issues: AssetValidationIssue[] = [];
  const ids = new Set<string>();

  assets.forEach((asset) => {
    if (ids.has(asset.id)) {
      issues.push({
        assetId: asset.id,
        issue: "Asset id must be unique.",
        severity: "critical",
      });
    }
    ids.add(asset.id);

    if (!asset.altText?.trim()) {
      issues.push({
        assetId: asset.id,
        issue: "Asset needs learner-safe alt text.",
        severity: "critical",
      });
    }

    if (!asset.prompt?.trim()) {
      issues.push({
        assetId: asset.id,
        issue: "Asset needs prompt metadata for future AI generation.",
        severity: "warning",
      });
    }

    if (!asset.localSource && !asset.iconName) {
      issues.push({
        assetId: asset.id,
        issue: "Missing assets must define a fallback icon.",
        severity: "critical",
      });
    }

    if ((asset.assetType === "topic" || asset.assetType === "stage") && !asset.topicId) {
      issues.push({
        assetId: asset.id,
        issue: "Topic and stage assets must keep a topic mapping.",
        severity: "critical",
      });
    }

    if (asset.assetType === "stage" && !asset.stage) {
      issues.push({
        assetId: asset.id,
        issue: "Stage assets must keep a stage mapping.",
        severity: "critical",
      });
    }
  });

  return {
    issueCount: issues.length,
    issues,
    valid: issues.every((issue) => issue.severity !== "critical"),
  };
}
