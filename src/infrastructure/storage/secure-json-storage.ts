import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";

import {
  isSecureStorageAvailable,
  safeGetItem,
  safeSetItem,
} from "@/src/services/secureStorageService";

const ENCRYPTION_KEY_STORAGE_KEY = "batibot_secure_json_key";
const FALLBACK_KEY_STORAGE_KEY = "batibot_secure_json_key_fallback";
const ENCRYPTED_PREFIX = "batibot-secure-json:v1:";

async function getFallbackEncryptionKey() {
  return AsyncStorage.getItem(FALLBACK_KEY_STORAGE_KEY);
}

async function getEncryptionKey() {
  if (!(await isSecureStorageAvailable())) {
    return getFallbackEncryptionKey();
  }

  const existingKey = await safeGetItem(ENCRYPTION_KEY_STORAGE_KEY);

  if (existingKey) {
    return existingKey;
  }

  const fallbackKey = await AsyncStorage.getItem(FALLBACK_KEY_STORAGE_KEY);

  if (fallbackKey) {
    await safeSetItem(ENCRYPTION_KEY_STORAGE_KEY, fallbackKey);
    return fallbackKey;
  }

  return null;
}

function decryptPayload(value: string, key: string) {
  const encryptedPayload = value.slice(ENCRYPTED_PREFIX.length);
  const bytes = CryptoJS.AES.decrypt(encryptedPayload, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export async function getSecureJsonItem<T>(storageKey: string): Promise<T | null> {
  const storedValue = await AsyncStorage.getItem(storageKey);

  if (!storedValue) {
    return null;
  }

  if (!storedValue.startsWith(ENCRYPTED_PREFIX)) {
    return JSON.parse(storedValue) as T;
  }

  const encryptionKey = await getEncryptionKey();

  if (!encryptionKey) {
    return null;
  }

  const decryptedValue = decryptPayload(storedValue, encryptionKey);

  if (!decryptedValue) {
    return null;
  }

  return JSON.parse(decryptedValue) as T;
}

export async function setSecureJsonItem(storageKey: string, value: unknown) {
  await AsyncStorage.setItem(storageKey, JSON.stringify(value));
}

export async function removeSecureJsonItem(storageKey: string) {
  await AsyncStorage.removeItem(storageKey);
}
