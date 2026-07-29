import Constants from "expo-constants";

import {
  getSecureJsonItem,
  setSecureJsonItem,
} from "@/src/infrastructure/storage/secure-json-storage";
import { createDeviceId } from "@/src/utils/idGenerator";

const DEVICE_ID_KEY = "batibot_device_id";
const LEGACY_DEVICE_ID_KEY = "batibot:device-id";

export async function getOrCreateDeviceId() {
  const existing = await getSecureJsonItem<string>(DEVICE_ID_KEY);

  if (existing) {
    return existing;
  }

  const legacyExisting = await getSecureJsonItem<string>(LEGACY_DEVICE_ID_KEY);

  if (legacyExisting) {
    await setSecureJsonItem(DEVICE_ID_KEY, legacyExisting);
    return legacyExisting;
  }

  const nextDeviceId = createDeviceId();
  await setSecureJsonItem(DEVICE_ID_KEY, nextDeviceId);
  return nextDeviceId;
}

export function getDeviceName() {
  return Constants.deviceName || "This device";
}

export function getAppVersion() {
  return Constants.expoConfig?.version ?? "1.0.0";
}
