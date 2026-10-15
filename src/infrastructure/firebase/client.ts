import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth, inMemoryPersistence } from "firebase/auth";
import { getFirestore, initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";
import { USE_NODE_BACKEND } from "@/src/config/backend";

import {
  getSecureJsonItem,
  removeSecureJsonItem,
  setSecureJsonItem,
} from "@/src/infrastructure/storage/secure-json-storage";

const FIREBASE_STORAGE_AVAILABLE_KEY = "firebase-auth-storage-check";

const firebaseConfig = {
  apiKey: "AIzaSyCss0GMCNpkVvM6ca6gOIVbbmUfKpkPGc0",
  authDomain: "batibot-app-e3cc9.firebaseapp.com",
  projectId: "batibot-app-e3cc9",
  storageBucket: "batibot-app-e3cc9.firebasestorage.app",
  messagingSenderId: "563453830210",
  appId: "1:563453830210:web:e14d0564cb71ca2d9339db",
};

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
  if (USE_NODE_BACKEND) {
    try { return initializeAuth(app, { persistence: inMemoryPersistence }); }
    catch { return getAuth(app); }
  }
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
