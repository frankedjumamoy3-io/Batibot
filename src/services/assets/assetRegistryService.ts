import * as ImagePicker from "expo-image-picker";
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { db, storage } from "@/src/config/firebase";
import { requireAdmin } from "@/src/services/adminAccessService";
import {
  clearRuntimeAssets,
  registerAssets,
} from "@/src/services/assets/assetResolver";
import type {
  BatiBotAssetManifestItem,
  BatiBotAssetStatus,
  BatiBotAssetType,
} from "@/src/data/assets/batibot-asset-manifest";
import type { LearnerGradeLevel, UserProfile } from "@/src/types/user";

type UploadableAssetRequirement = {
  altText: string;
  assetId: string;
  assetType: string;
  firebasePath: string;
  gradeLevel: LearnerGradeLevel;
  label: string;
  prompt: string;
  stage?: string;
  topicId?: string;
  topicTitle?: string;
  worldId: string;
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_ASSET_BYTES = 10 * 1024 * 1024;

function toManifestAsset(
  id: string,
  data: Record<string, unknown>
): BatiBotAssetManifestItem | null {
  const remoteUri = typeof data.remoteUri === "string" ? data.remoteUri : "";
  const worldId = typeof data.worldId === "string" ? data.worldId : "";
  const label = typeof data.label === "string" ? data.label : "";

  if (!remoteUri || !worldId || !label) return null;

  return {
    altText: typeof data.altText === "string" ? data.altText : `${label} learning illustration`,
    assetType: (typeof data.assetType === "string" ? data.assetType : "curriculum") as BatiBotAssetType,
    category: "illustration",
    firebasePath: typeof data.firebasePath === "string" ? data.firebasePath : undefined,
    gradeLevel: data.gradeLevel as LearnerGradeLevel | undefined,
    iconName: typeof data.iconName === "string" ? data.iconName : undefined,
    id,
    label,
    prompt: typeof data.prompt === "string" ? data.prompt : undefined,
    provider: "firebase",
    remoteUri,
    stage: data.stage as BatiBotAssetManifestItem["stage"],
    status: (typeof data.status === "string" ? data.status : "pending-review") as BatiBotAssetStatus,
    tags: Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    topicId: typeof data.topicId === "string" ? data.topicId : undefined,
    topicTitle: typeof data.topicTitle === "string" ? data.topicTitle : undefined,
    uri: remoteUri,
    worldId,
  };
}

export function subscribeToGlobalAssetRegistry(
  onChange?: (assets: BatiBotAssetManifestItem[]) => void
) {
  return onSnapshot(
    query(collection(db, "assetRegistry"), where("status", "==", "approved")),
    (snapshot) => {
      const assets = snapshot.docs
        .map((assetDoc) => toManifestAsset(assetDoc.id, assetDoc.data()))
        .filter((asset): asset is BatiBotAssetManifestItem => Boolean(asset));

      clearRuntimeAssets();
      registerAssets(assets);
      onChange?.(assets);
    },
    () => {
      clearRuntimeAssets();
      onChange?.([]);
    }
  );
}

export function subscribeToAdminAssetRegistry(
  onChange: (assets: BatiBotAssetManifestItem[]) => void
) {
  return onSnapshot(
    collection(db, "assetRegistry"),
    (snapshot) => {
      const assets = snapshot.docs
        .map((assetDoc) => toManifestAsset(assetDoc.id, assetDoc.data()))
        .filter((asset): asset is BatiBotAssetManifestItem => Boolean(asset));

      onChange(assets);
    },
    () => onChange([])
  );
}

export async function chooseCurriculumAssetImage() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error("Photo library access is required to choose an asset.");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    mediaTypes: ["images"],
    quality: 1,
  });

  if (result.canceled || !result.assets[0]) return null;

  const asset = result.assets[0];
  const mimeType = asset.mimeType ?? "image/png";
  const fileSize = asset.fileSize ?? 0;

  if (!ACCEPTED_IMAGE_TYPES.includes(mimeType)) {
    throw new Error("Choose a PNG, JPG, or WEBP image.");
  }

  if (fileSize <= 0 || fileSize > MAX_ASSET_BYTES) {
    throw new Error("Choose an image between 1 byte and 10MB.");
  }

  return {
    fileName: asset.fileName ?? `${Date.now()}.png`,
    mimeType,
    uri: asset.uri,
  };
}

export async function uploadCurriculumAsset(
  requirement: UploadableAssetRequirement,
  image: { fileName: string; mimeType: string; uri: string },
  profile: UserProfile | null | undefined
) {
  requireAdmin(profile);
  const response = await fetch(image.uri);
  const blob = await response.blob();
  const extension = image.fileName.split(".").pop()?.toLowerCase() ?? "png";
  const storagePath = requirement.firebasePath.replace(/\.[^.]+$/, `.${extension}`);
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, blob, { contentType: image.mimeType });
  const remoteUri = await getDownloadURL(storageRef);
  const tags = [
    requirement.gradeLevel,
    requirement.worldId,
    requirement.topicTitle ?? "",
    requirement.stage ?? "",
    requirement.assetType,
  ]
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  await setDoc(
    doc(db, "assetRegistry", requirement.assetId),
    {
      altText: requirement.altText,
      assetType: requirement.assetType,
      firebasePath: storagePath,
      gradeLevel: requirement.gradeLevel,
      label: requirement.label,
      prompt: requirement.prompt,
      remoteUri,
      stage: requirement.stage ?? null,
      status: "pending-review",
      tags,
      topicId: requirement.topicId ?? null,
      topicTitle: requirement.topicTitle ?? null,
      updatedAt: serverTimestamp(),
      worldId: requirement.worldId,
    },
    { merge: true }
  );

  return remoteUri;
}

export async function setCurriculumAssetStatus(
  assetId: string,
  status: Extract<BatiBotAssetStatus, "approved" | "rejected" | "pending-review">,
  profile: UserProfile | null | undefined
) {
  requireAdmin(profile);
  await updateDoc(doc(db, "assetRegistry", assetId), {
    status,
    updatedAt: serverTimestamp(),
  });
}
