import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import {
  DEFAULT_USER_SETTINGS,
  type UserSettings,
} from "@/constants/theme";
import { db } from "@/src/config/firebase";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import {
  getSecureJsonItem,
  setSecureJsonItem,
} from "@/src/infrastructure/storage/secure-json-storage";
import { enqueueOfflineSyncTask } from "@/src/services/offlineSyncService";

export function sanitizeUserSettings(raw: unknown): UserSettings {
  if (!raw || typeof raw !== "object") {
    return DEFAULT_USER_SETTINGS;
  }

  const candidate = raw as Partial<UserSettings>;

  return {
    theme:
      candidate.theme === "light" ||
      candidate.theme === "dark" ||
      candidate.theme === "system"
        ? candidate.theme
        : DEFAULT_USER_SETTINGS.theme,
    accentColor:
      candidate.accentColor === "blue" ||
      candidate.accentColor === "purple" ||
      candidate.accentColor === "green" ||
      candidate.accentColor === "orange"
        ? candidate.accentColor
        : DEFAULT_USER_SETTINGS.accentColor,
    fontSize:
      candidate.fontSize === "small" ||
      candidate.fontSize === "normal" ||
      candidate.fontSize === "large"
        ? candidate.fontSize
        : DEFAULT_USER_SETTINGS.fontSize,
    language:
      candidate.language === "fil" || candidate.language === "en"
        ? candidate.language
        : DEFAULT_USER_SETTINGS.language,
    soundEnabled:
      typeof candidate.soundEnabled === "boolean"
        ? candidate.soundEnabled
        : DEFAULT_USER_SETTINGS.soundEnabled,
    voiceEnabled:
      typeof candidate.voiceEnabled === "boolean"
        ? candidate.voiceEnabled
        : DEFAULT_USER_SETTINGS.voiceEnabled,
    backgroundMusicEnabled:
      typeof candidate.backgroundMusicEnabled === "boolean"
        ? candidate.backgroundMusicEnabled
        : DEFAULT_USER_SETTINGS.backgroundMusicEnabled,
    soundEffectsEnabled:
      typeof candidate.soundEffectsEnabled === "boolean"
        ? candidate.soundEffectsEnabled
        : DEFAULT_USER_SETTINGS.soundEffectsEnabled,
    musicVolume:
      typeof candidate.musicVolume === "number"
        ? Math.min(100, Math.max(0, Math.round(candidate.musicVolume)))
        : DEFAULT_USER_SETTINGS.musicVolume,
    effectsVolume:
      typeof candidate.effectsVolume === "number"
        ? Math.min(100, Math.max(0, Math.round(candidate.effectsVolume)))
        : DEFAULT_USER_SETTINGS.effectsVolume,
    voiceSpeed:
      candidate.voiceSpeed === "slow" || candidate.voiceSpeed === "normal"
        ? candidate.voiceSpeed
        : DEFAULT_USER_SETTINGS.voiceSpeed,
    showFloatingBatiBot:
      typeof candidate.showFloatingBatiBot === "boolean"
        ? candidate.showFloatingBatiBot
        : DEFAULT_USER_SETTINGS.showFloatingBatiBot,
    speechQuizEnabled:
      typeof candidate.speechQuizEnabled === "boolean"
        ? candidate.speechQuizEnabled
        : DEFAULT_USER_SETTINGS.speechQuizEnabled,
    notificationsEnabled:
      typeof candidate.notificationsEnabled === "boolean"
        ? candidate.notificationsEnabled
        : DEFAULT_USER_SETTINGS.notificationsEnabled,
    autoPlayPronunciation:
      typeof candidate.autoPlayPronunciation === "boolean"
        ? candidate.autoPlayPronunciation
        : DEFAULT_USER_SETTINGS.autoPlayPronunciation,
    replayWordAutomatically:
      typeof candidate.replayWordAutomatically === "boolean"
        ? candidate.replayWordAutomatically
        : DEFAULT_USER_SETTINGS.replayWordAutomatically,
    dailyReminderEnabled:
      typeof candidate.dailyReminderEnabled === "boolean"
        ? candidate.dailyReminderEnabled
        : DEFAULT_USER_SETTINGS.dailyReminderEnabled,
    autoAdvance:
      typeof candidate.autoAdvance === "boolean"
        ? candidate.autoAdvance
        : DEFAULT_USER_SETTINGS.autoAdvance,
    showMeanings:
      typeof candidate.showMeanings === "boolean"
        ? candidate.showMeanings
        : DEFAULT_USER_SETTINGS.showMeanings,
    showPronunciation:
      typeof candidate.showPronunciation === "boolean"
        ? candidate.showPronunciation
        : DEFAULT_USER_SETTINGS.showPronunciation,
    buttonSize:
      candidate.buttonSize === "large" || candidate.buttonSize === "normal"
        ? candidate.buttonSize
        : DEFAULT_USER_SETTINGS.buttonSize,
    touchFeedback:
      typeof candidate.touchFeedback === "boolean"
        ? candidate.touchFeedback
        : DEFAULT_USER_SETTINGS.touchFeedback,
    leftHandMode:
      typeof candidate.leftHandMode === "boolean"
        ? candidate.leftHandMode
        : DEFAULT_USER_SETTINGS.leftHandMode,
    difficulty:
      candidate.difficulty === "gentle" ||
      candidate.difficulty === "standard" ||
      candidate.difficulty === "challenge"
        ? candidate.difficulty
        : DEFAULT_USER_SETTINGS.difficulty,
    reduceMotion:
      typeof candidate.reduceMotion === "boolean"
        ? candidate.reduceMotion
        : DEFAULT_USER_SETTINGS.reduceMotion,
    highContrast:
      typeof candidate.highContrast === "boolean"
        ? candidate.highContrast
        : DEFAULT_USER_SETTINGS.highContrast,
    largerText:
      typeof candidate.largerText === "boolean"
        ? candidate.largerText
        : DEFAULT_USER_SETTINGS.largerText,
  };
}

async function getStoredUserSettings(storageKey: string) {
  const storedValue = await getSecureJsonItem<unknown>(storageKey);

  if (!storedValue) {
    return DEFAULT_USER_SETTINGS;
  }

  return sanitizeUserSettings(storedValue);
}

async function getCloudUserSettings(userId: string) {
  const userSnapshot = await getDoc(doc(db, "users", userId));

  if (!userSnapshot.exists()) {
    return null;
  }

  const settings = userSnapshot.data().settings;

  return settings ? sanitizeUserSettings(settings) : null;
}

export async function getUserSettings(storageKey: string, userId?: string | null) {
  if (userId && !USE_NODE_BACKEND) {
    try {
      const cloudSettings = await getCloudUserSettings(userId);

      if (cloudSettings) {
        await setSecureJsonItem(storageKey, cloudSettings);
        return cloudSettings;
      }
    } catch {
      // Local settings keep the app usable when Firestore is offline or blocked.
    }
  }

  return getStoredUserSettings(storageKey);
}

export async function saveUserSettings(
  storageKey: string,
  settings: UserSettings,
  userId?: string | null
) {
  await setSecureJsonItem(storageKey, settings);

  if (USE_NODE_BACKEND || !userId) {
    return;
  }

  try {
    await setDoc(
      doc(db, "users", userId),
      {
        settings,
        settingsUpdatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch {
    await enqueueOfflineSyncTask({
      payload: { settings },
      profileId: userId,
      type: "settings-update",
    });
  }
}
