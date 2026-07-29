import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import {
  Timestamp,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { batibotAssetRegistry } from "@/src/assets/assetRegistry";
import type { AssetSlotRule, StageType } from "@/src/domain/admin/curriculum-metadata";
import type { AdminStageAssetReference } from "@/src/domain/admin/topic-draft";
import { db, storage } from "@/src/config/firebase";
import { ADMIN_FIRESTORE_COLLECTIONS } from "@/src/infrastructure/admin/admin-firestore-collections";
import { requireAdmin } from "@/src/services/adminAccessService";
import type { UserProfile } from "@/src/types/user";

export type AdminAssetType = "image" | "audio" | "background" | "icon";
export type AdminAssetStatus = "uploading" | "ready" | "failed" | "archived";

export type AdminAsset = {
  createdAt: string;
  createdBy: string;
  durationMs?: number;
  gradeLevel?: string;
  height?: number;
  id: string;
  mimeType?: string;
  name: string;
  originalFilename?: string;
  sizeBytes?: number;
  stageType?: StageType;
  status: AdminAssetStatus;
  storagePath?: string;
  tags: string[];
  topicId?: string;
  type: AdminAssetType;
  updatedAt: string;
  uri: string;
  width?: number;
  worldId?: string;
};

export type AdminAssetFilters = {
  cursor?: string;
  gradeLevel?: string;
  limit?: number;
  search?: string;
  tags?: string[];
  topicId?: string;
  type?: AdminAssetType;
  worldId?: string;
};

export type UploadAdminAssetInput = {
  fileUri: string;
  filename: string;
  gradeLevel?: string;
  mimeType: string;
  name?: string;
  sizeBytes?: number;
  stageType?: StageType;
  tags?: string[];
  topicId?: string;
  type: AdminAssetType;
  worldId?: string;
};

export type PickedAdminFile = Pick<UploadAdminAssetInput, "fileUri" | "filename" | "mimeType" | "sizeBytes">;

const COLLECTION = ADMIN_FIRESTORE_COLLECTIONS.assets;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AUDIO_TYPES = ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/wav", "audio/wave"];
const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const AUDIO_MAX_BYTES = 10 * 1024 * 1024;

export async function chooseAndUploadAdminImageAsset(
  input: Omit<UploadAdminAssetInput, "fileUri" | "filename" | "mimeType" | "sizeBytes" | "type">,
  profile: UserProfile | null | undefined
): Promise<AdminAsset | null> {
  requireAdmin(profile);
  const file = await selectLocalAdminAssetFile("image");
  if (!file) return null;
  return uploadAdminAsset({ ...input, ...file, type: "image" }, profile);
}

export async function chooseAndUploadAdminAudioAsset(
  input: Omit<UploadAdminAssetInput, "fileUri" | "filename" | "mimeType" | "sizeBytes" | "type">,
  profile: UserProfile | null | undefined
): Promise<AdminAsset | null> {
  requireAdmin(profile);
  const file = await selectLocalAdminAssetFile("audio");
  if (!file) return null;
  return uploadAdminAsset({ ...input, ...file, type: "audio" }, profile);
}

export async function uploadAdminAsset(
  input: UploadAdminAssetInput,
  profile: UserProfile | null | undefined
): Promise<AdminAsset> {
  requireAdmin(profile);
  validateUpload(input);

  const assetId = `admin-asset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const filename = sanitizeFilename(input.filename);
  const scope = input.gradeLevel && input.worldId && input.topicId
    ? `${sanitizeSegment(input.gradeLevel)}/${sanitizeSegment(input.worldId)}/${sanitizeSegment(input.topicId)}`
    : "shared";
  const storagePath = `admin-assets/${scope}/${assetId}/${filename}`;
  const now = new Date().toISOString();

  let uri: string;
  try {
    const response = await fetch(input.fileUri);
    if (!response.ok && !input.fileUri.startsWith("blob:") && !input.fileUri.startsWith("data:")) {
      throw new Error("Selected file could not be read.");
    }
    const blob = await response.blob();
    if (!blob.size) throw new Error("Selected file is empty.");
    await uploadBytes(ref(storage, storagePath), blob, { contentType: input.mimeType });
    uri = await getDownloadURL(ref(storage, storagePath));
  } catch (error) {
    if (__DEV__) console.warn("[AdminAsset] Storage upload failed", error);
    throw new Error("Unable to upload the selected asset. Check Firebase Storage and try again.");
  }

  const asset: AdminAsset = {
    createdAt: now,
    createdBy: profile?.uid ?? "unknown-admin",
    gradeLevel: input.gradeLevel,
    id: assetId,
    mimeType: input.mimeType,
    name: input.name?.trim() || filename,
    originalFilename: input.filename,
    sizeBytes: input.sizeBytes,
    stageType: input.stageType,
    status: "ready",
    storagePath,
    tags: normalizeTags(input.tags),
    topicId: input.topicId,
    type: input.type,
    updatedAt: now,
    uri,
    worldId: input.worldId,
  };

  try {
    await setDoc(doc(db, COLLECTION, assetId), {
      ...asset,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    if (__DEV__) console.warn("[AdminAsset] Metadata write failed; uploaded path may be orphaned", { error, storagePath });
    throw new Error("The file uploaded, but its asset record could not be saved. Contact an administrator before retrying.");
  }

  return asset;
}

export async function listAdminAssets(
  filters: AdminAssetFilters,
  profile: UserProfile | null | undefined
): Promise<{ assets: AdminAsset[]; nextCursor?: string }> {
  requireAdmin(profile);
  const pageSize = Math.max(1, Math.min(filters.limit ?? 48, 100));

  try {
    const constraints = [orderBy(documentId()), ...(filters.cursor ? [startAfter(filters.cursor)] : []), firestoreLimit(pageSize + 1)];
    const snapshot = await getDocs(query(collection(db, COLLECTION), ...constraints));
    const records = snapshot.docs.map((item) => toAdminAsset(item.id, item.data()));
    const hasMore = records.length > pageSize;
    const page = records.slice(0, pageSize).filter((asset) => matchesFilters(asset, filters));
    return { assets: page, nextCursor: hasMore ? records[pageSize - 1]?.id : undefined };
  } catch (error) {
    if (__DEV__) console.warn("[AdminAsset] List failed", error);
    throw new Error("Unable to load admin assets.");
  }
}

export async function getAdminAsset(assetId: string, profile: UserProfile | null | undefined) {
  requireAdmin(profile);
  try {
    const snapshot = await getDoc(doc(db, COLLECTION, assetId));
    if (!snapshot.exists()) throw new Error("not-found");
    return toAdminAsset(snapshot.id, snapshot.data());
  } catch (error) {
    if (__DEV__) console.warn("[AdminAsset] Read failed", error);
    throw new Error("The selected admin asset could not be found.");
  }
}

export async function updateAdminAssetMetadata(
  assetId: string,
  patch: Pick<Partial<AdminAsset>, "name" | "tags" | "gradeLevel" | "worldId" | "topicId" | "stageType">,
  profile: UserProfile | null | undefined
) {
  requireAdmin(profile);
  await updateDoc(doc(db, COLLECTION, assetId), {
    ...patch,
    ...(patch.tags ? { tags: normalizeTags(patch.tags) } : {}),
    updatedAt: serverTimestamp(),
  });
  return getAdminAsset(assetId, profile);
}

export async function archiveAdminAsset(assetId: string, profile: UserProfile | null | undefined) {
  requireAdmin(profile);
  await updateDoc(doc(db, COLLECTION, assetId), {
    status: "archived",
    updatedAt: serverTimestamp(),
  });
}

export function validateAdminAssetForSlot(asset: AdminAsset, slot: { type: AdminAssetType; role: string }) {
  const errors: string[] = [];
  if (asset.status !== "ready") errors.push("Asset is not ready.");
  if (!asset.uri.trim()) errors.push("Asset URI is missing.");
  if (asset.type !== slot.type && !(slot.type === "image" && asset.type === "background")) {
    errors.push(`Asset type ${asset.type} does not match ${slot.type}.`);
  }
  return errors;
}

export async function validateDraftStageAssets(
  references: AdminStageAssetReference[],
  rules: AssetSlotRule[],
  profile: UserProfile | null | undefined
) {
  requireAdmin(profile);
  const results: { id: string; message: string; severity: "error" | "pass" | "warning" }[] = [];

  for (const rule of rules) {
    const assigned = references.filter((reference) => reference.role === rule.role);
    if (assigned.length < rule.minCount) {
      results.push({ id: `${rule.id}:minimum`, message: `${rule.role} requires at least ${rule.minCount} ${rule.type} asset.`, severity: "error" });
    } else if (assigned.length > rule.maxCount) {
      results.push({ id: `${rule.id}:maximum`, message: `${rule.role} allows at most ${rule.maxCount} assets.`, severity: "error" });
    } else {
      results.push({ id: `${rule.id}:count`, message: `${rule.role} slot count is valid.`, severity: "pass" });
    }
  }

  const seen = new Set<string>();
  for (const reference of references) {
    const assetId = reference.assetId ?? reference.id;
    const identity = `${reference.role}:${assetId}`;
    if (seen.has(identity)) {
      results.push({ id: `${identity}:duplicate`, message: `${assetId} is duplicated in ${reference.role}.`, severity: "error" });
      continue;
    }
    seen.add(identity);

    const rule = rules.find((item) => item.role === reference.role);
    if (!rule) {
      results.push({ id: `${identity}:slot`, message: `${reference.role} is not an allowed slot for this stage.`, severity: "warning" });
      continue;
    }

    const bundled = batibotAssetRegistry[assetId];
    if (bundled?.source) {
      if (rule.type !== "image" && rule.type !== "background") {
        results.push({ id: `${identity}:type`, message: `${assetId} does not match the ${rule.type} slot.`, severity: "error" });
      } else {
        results.push({ id: `${identity}:ready`, message: `${assetId} is available from the bundled registry.`, severity: "pass" });
      }
      continue;
    }

    try {
      const asset = await getAdminAsset(assetId, profile);
      const errors = validateAdminAssetForSlot(asset, rule);
      results.push(...(errors.length
        ? errors.map((message, index) => ({ id: `${identity}:asset-${index}`, message, severity: "error" as const }))
        : [{ id: `${identity}:ready`, message: `${asset.name} is ready for ${reference.role}.`, severity: "pass" as const }]));
    } catch {
      results.push({ id: `${identity}:missing`, message: `${assetId} is missing or unavailable.`, severity: "error" });
    }
  }

  return results;
}

export async function selectLocalAdminAssetFile(type: "image" | "audio"): Promise<PickedAdminFile | null> {
  if (Platform.OS === "web" && typeof document !== "undefined") {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = type === "image" ? IMAGE_TYPES.join(",") : AUDIO_TYPES.join(",");
      input.onchange = () => {
        const file = input.files?.[0];
        resolve(file ? { fileUri: URL.createObjectURL(file), filename: file.name, mimeType: file.type, sizeBytes: file.size } : null);
      };
      input.click();
    });
  }

  if (type === "audio") {
    throw new Error("Audio upload is currently available in the web admin. No native document picker is installed.");
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new Error("Photo library access is required to upload an image.");
  const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: false, mediaTypes: ["images"], quality: 1 });
  if (result.canceled || !result.assets[0]) return null;
  const asset = result.assets[0];
  return {
    fileUri: asset.uri,
    filename: asset.fileName ?? `${Date.now()}.png`,
    mimeType: asset.mimeType ?? "image/png",
    sizeBytes: asset.fileSize,
  };
}

function validateUpload(input: UploadAdminAssetInput) {
  const allowed = input.type === "audio" ? AUDIO_TYPES : IMAGE_TYPES;
  const maximum = input.type === "audio" ? AUDIO_MAX_BYTES : IMAGE_MAX_BYTES;
  if (!allowed.includes(input.mimeType)) throw new Error(`Unsupported ${input.type} file type.`);
  if (input.sizeBytes !== undefined && (input.sizeBytes <= 0 || input.sizeBytes > maximum)) {
    throw new Error(`${input.type === "audio" ? "Audio" : "Image"} must be smaller than ${maximum / 1024 / 1024}MB.`);
  }
  if (!input.fileUri.trim() || !input.filename.trim()) throw new Error("A readable local file is required.");
}

function matchesFilters(asset: AdminAsset, filters: AdminAssetFilters) {
  if (asset.status === "archived") return false;
  if (filters.type && asset.type !== filters.type) return false;
  if (filters.gradeLevel && asset.gradeLevel !== filters.gradeLevel) return false;
  if (filters.worldId && asset.worldId !== filters.worldId) return false;
  if (filters.topicId && asset.topicId !== filters.topicId) return false;
  if (filters.tags?.length && !filters.tags.every((tag) => asset.tags.includes(tag))) return false;
  if (filters.search) {
    const queryText = filters.search.trim().toLowerCase();
    const haystack = [asset.name, asset.originalFilename, ...asset.tags].filter(Boolean).join(" ").toLowerCase();
    if (!haystack.includes(queryText)) return false;
  }
  return true;
}

function toAdminAsset(id: string, data: Record<string, unknown>): AdminAsset {
  const createdAt = toIsoString(data.createdAt);
  return {
    createdAt,
    createdBy: String(data.createdBy ?? ""),
    durationMs: numberValue(data.durationMs),
    gradeLevel: optionalString(data.gradeLevel),
    height: numberValue(data.height),
    id,
    mimeType: optionalString(data.mimeType),
    name: String(data.name ?? id),
    originalFilename: optionalString(data.originalFilename),
    sizeBytes: numberValue(data.sizeBytes),
    stageType: isStageType(data.stageType) ? data.stageType : undefined,
    status: isAssetStatus(data.status) ? data.status : "ready",
    storagePath: optionalString(data.storagePath),
    tags: normalizeTags(data.tags),
    topicId: optionalString(data.topicId),
    type: isAssetType(data.type) ? data.type : "image",
    updatedAt: toIsoString(data.updatedAt) || createdAt,
    uri: String(data.uri ?? ""),
    width: numberValue(data.width),
    worldId: optionalString(data.worldId),
  };
}

function normalizeTags(value: unknown) { return Array.isArray(value) ? [...new Set(value.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim().toLowerCase()).filter(Boolean))] : []; }
function sanitizeSegment(value: string) { return value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "item"; }
function sanitizeFilename(value: string) { const cleaned = value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, ""); return cleaned || `asset-${Date.now()}`; }
function optionalString(value: unknown) { return typeof value === "string" && value ? value : undefined; }
function numberValue(value: unknown) { return typeof value === "number" && Number.isFinite(value) ? value : undefined; }
function toIsoString(value: unknown) { return value instanceof Timestamp ? value.toDate().toISOString() : typeof value === "string" ? value : ""; }
function isAssetType(value: unknown): value is AdminAssetType { return value === "image" || value === "audio" || value === "background" || value === "icon"; }
function isAssetStatus(value: unknown): value is AdminAssetStatus { return value === "uploading" || value === "ready" || value === "failed" || value === "archived"; }
function isStageType(value: unknown): value is StageType { return value === "LOOK" || value === "TAP" || value === "TRY" || value === "CHOOSE" || value === "PLAY" || value === "REWARD"; }
