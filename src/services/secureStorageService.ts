import * as SecureStore from "expo-secure-store";

const VALID_SECURE_KEY = /^[a-zA-Z0-9._-]+$/;

export function isValidSecureStoreKey(key: unknown): key is string {
  return typeof key === "string" && key.length > 0 && VALID_SECURE_KEY.test(key);
}

export async function isSecureStorageAvailable() {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function safeGetItem(key: unknown): Promise<string | null> {
  if (!isValidSecureStoreKey(key)) {
    if (__DEV__) {
      console.warn("[SecureStore] blocked invalid get key", key);
    }

    return null;
  }

  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    if (__DEV__) {
      console.warn("[SecureStore] get failed", { key, error });
    }

    return null;
  }
}

export async function safeSetItem(key: unknown, value: string): Promise<void> {
  if (!isValidSecureStoreKey(key)) {
    if (__DEV__) {
      console.warn("[SecureStore] blocked invalid set key", key);
    }

    return;
  }

  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    if (__DEV__) {
      console.warn("[SecureStore] set failed", { key, error });
    }
  }
}

export async function safeDeleteItem(key: unknown): Promise<void> {
  if (!isValidSecureStoreKey(key)) {
    if (__DEV__) {
      console.warn("[SecureStore] blocked invalid delete key", key);
    }

    return;
  }

  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    if (__DEV__) {
      console.warn("[SecureStore] delete failed", { key, error });
    }
  }
}
