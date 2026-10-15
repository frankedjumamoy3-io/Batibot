import * as ImagePicker from "expo-image-picker";
import { signInAnonymously, updateProfile } from "firebase/auth";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { auth, storage } from "@/src/config/firebase";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import { Directory, File, Paths } from "expo-file-system";
import type { Directory as NativeDirectory, File as NativeFile } from "expo-file-system/build/ExpoFileSystem.types";
import { Platform } from "react-native";
import { ensureUserProfile } from "@/src/data/repositories/user-profile-repository";
import {
  saveLearnerSession,
  type LearnerSessionInput,
} from "@/src/services/learnerSessionService";

const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;

export interface ValidProfileImageAsset {
  fileName: string;
  fileSize: number;
  mimeType: string;
  uri: string;
}

function normalizeMimeType(asset: ImagePicker.ImagePickerAsset) {
  if (asset.mimeType && ACCEPTED_IMAGE_MIME_TYPES.includes(asset.mimeType as never)) {
    return asset.mimeType;
  }

  const normalizedName = asset.fileName?.toLowerCase() ?? asset.uri.toLowerCase();

  if (normalizedName.endsWith(".png")) {
    return "image/png";
  }

  if (normalizedName.endsWith(".webp")) {
    return "image/webp";
  }

  return "image/jpeg";
}

export function validateProfileImage(
  asset: ImagePicker.ImagePickerAsset
): ValidProfileImageAsset {
  const mimeType = normalizeMimeType(asset);
  const fileSize = asset.fileSize ?? 0;

  if (!ACCEPTED_IMAGE_MIME_TYPES.includes(mimeType as never)) {
    throw new Error("Please choose a JPG, PNG, or WEBP image.");
  }

  if (fileSize > MAX_PROFILE_IMAGE_BYTES) {
    throw new Error("Please choose an image smaller than 5MB.");
  }

  return {
    fileName: asset.fileName ?? `profile-${Date.now()}.jpg`,
    fileSize,
    mimeType,
    uri: asset.uri,
  };
}

function assertSafeProfileId(profileId: string) {
  const safeProfileId = profileId.trim();

  if (!/^[A-Za-z0-9._-]+$/.test(safeProfileId)) {
    throw new Error("We could not update this profile photo right now.");
  }

  return safeProfileId;
}

async function ensureUploadAuth() {
  if (auth.currentUser) {
    return;
  }

  try {
    await signInAnonymously(auth);
  } catch (error) {
    if (__DEV__) {
      console.warn("[ProfilePhoto] Anonymous auth unavailable", error);
    }
  }
}

async function saveDevicePhoto(uri: string, profileId: string) {
  if (Platform.OS === "web") return uri;
  // This project checks web and native suffixes together; the web shim omits
  // native methods. This branch runs only on devices and uses the SDK types.
  const directory = new Directory(Paths.document, "profile-photos") as unknown as NativeDirectory;
  directory.create({ intermediates: true, idempotent: true });
  const destination = new File(directory.uri, `${assertSafeProfileId(profileId)}-${Date.now()}.jpg`) as unknown as NativeFile;
  (new File(uri) as unknown as NativeFile).copy(destination);
  return destination.uri;
}

export async function pickProfilePhoto(): Promise<{
  height?: number;
  uri: string;
  width?: number;
} | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error("Please allow photo access to choose a profile picture.");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.82,
  });

  if (result.canceled || !result.assets[0]?.uri) {
    return null;
  }

  const asset = result.assets[0];
  validateProfileImage(asset);

  return {
    height: asset.height,
    uri: asset.uri,
    width: asset.width,
  };
}

export async function uploadProfilePhoto({
  localUri,
  profileId,
}: {
  localUri: string;
  profileId: string;
}) {
  const safeProfileId = assertSafeProfileId(profileId);
  if (USE_NODE_BACKEND) return { downloadUrl: await saveDevicePhoto(localUri, safeProfileId), storagePath: "" };
  await ensureUploadAuth();
  const response = await fetch(localUri);
  const blob = await response.blob();
  const storagePath = `learnerProfilePhotos/${safeProfileId}/${Date.now()}.jpg`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, blob, {
    contentType: "image/jpeg",
  });

  return {
    downloadUrl: await getDownloadURL(storageRef),
    storagePath,
  };
}

export async function updateLearnerProfilePhoto({
  currentSession,
  localUri,
  profileId,
}: {
  currentSession: Omit<LearnerSessionInput, "profileImagePath" | "profileImageUrl">;
  localUri: string;
  profileId: string;
}) {
  const { downloadUrl, storagePath } = await uploadProfilePhoto({
    localUri,
    profileId,
  });

  await saveLearnerSession({
    ...currentSession,
    profileId,
    profileImagePath: storagePath,
    profileImageUrl: downloadUrl,
  });

  return {
    downloadUrl,
    storagePath,
  };
}

export async function handleProfileImageUpload(
  userId: string,
  asset: ValidProfileImageAsset,
  previousImagePath?: string | null
) {
  if (USE_NODE_BACKEND) return { profileImagePath: "", profileImageUrl: await saveDevicePhoto(asset.uri, userId) };
  const response = await fetch(asset.uri);
  const blob = await response.blob();
  const extension = asset.fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const storagePath = `profile-images/${userId}/${Date.now()}.${extension}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, blob, {
    contentType: asset.mimeType,
  });

  const downloadUrl = await getDownloadURL(storageRef);

  if (previousImagePath && previousImagePath !== storagePath) {
    try {
      await deleteObject(ref(storage, previousImagePath));
    } catch {
      // Ignore stale cleanup failures so the new avatar still saves.
    }
  }

  if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
      photoURL: downloadUrl,
    });
    await ensureUserProfile(auth.currentUser, {
      profileImagePath: storagePath,
      profileImageUrl: downloadUrl,
    });
  }

  return {
    profileImagePath: storagePath,
    profileImageUrl: downloadUrl,
  };
}

export async function removeProfileImage(profileImagePath?: string | null) {
  if (USE_NODE_BACKEND) return;
  if (!auth.currentUser) {
    return;
  }

  if (profileImagePath) {
    try {
      await deleteObject(ref(storage, profileImagePath));
    } catch {
      // Ignore missing files so profile cleanup can finish.
    }
  }

  await updateProfile(auth.currentUser, {
    photoURL: null,
  });
  await ensureUserProfile(auth.currentUser, {
    profileImagePath: null,
    profileImageUrl: null,
  });
}
