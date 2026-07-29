import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";

import {
  getSecureJsonItem,
  removeSecureJsonItem,
  setSecureJsonItem,
} from "@/src/infrastructure/storage/secure-json-storage";

const FIREBASE_STORAGE_AVAILABLE_KEY = "firebase-auth-storage-check";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const missingFirebaseConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingFirebaseConfig.length > 0) {
  throw new Error(
    `Missing Firebase environment configuration: ${missingFirebaseConfig.join(", ")}. Copy .env.example to .env and fill in the Firebase web app values.`,
  );
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

function createReactNativePersistence() {
  return class {
    static type = "LOCAL" as const;
    readonly type = "LOCAL" as const;

    async _isAvailable() {
      try {
        await setSecureJsonItem(FIREBASE_STORAGE_AVAILABLE_KEY, "1");
        await removeSecureJsonItem(FIREBASE_STORAGE_AVAILABLE_KEY);
        return true;
      } catch {
        return false;
      }
    }

    _set(key: string, value: unknown) {
      return setSecureJsonItem(key, value);
    }

    async _get<T>(key: string): Promise<T | null> {
      return getSecureJsonItem<T>(key);
    }

    _remove(key: string) {
      return removeSecureJsonItem(key);
    }

    _addListener() {}

    _removeListener() {}
  };
}

function createAuth() {
  if (Platform.OS === "web") {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: createReactNativePersistence(),
    });
  } catch {
    return getAuth(app);
  }
}

export const auth = createAuth();

function createFirestore() {
  try {
    return initializeFirestore(app, {
      localCache: memoryLocalCache(),
    });
  } catch {
    return getFirestore(app);
  }
}

export const db = createFirestore();
export const storage = getStorage(app);
