import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DEFAULT_USER_SETTINGS,
  createAppTheme,
  getResolvedThemeMode,
  type AppTheme,
  type ResolvedThemeMode,
  type ThemeFontSize,
  type ThemeMode,
  type UserSettings,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  getUserSettings,
  saveUserSettings,
} from "@/src/data/repositories/user-settings-repository";
import { useAuthSession } from "@/src/store/auth-session";
import { setLearningAudioEnabled } from "@/src/services/audioService";
import { stopSpeaking } from "@/src/services/speechService";

const STORAGE_KEY_PREFIX = "batibot:user-settings";
const GUEST_STORAGE_KEY = `${STORAGE_KEY_PREFIX}:guest`;

interface UserSettingsContextValue {
  applyAccessibilitySettings: (
    settings: Partial<Pick<UserSettings, "highContrast" | "largerText" | "reduceMotion">>
  ) => void;
  applyFontSize: (fontSize: ThemeFontSize) => void;
  applyTheme: (themeMode: ThemeMode) => void;
  isHydrated: boolean;
  resolvedThemeMode: ResolvedThemeMode;
  settings: UserSettings;
  theme: AppTheme;
  toggleDarkMode: () => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
}

const UserSettingsContext = createContext<UserSettingsContextValue | null>(null);

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const { user } = useAuthSession();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [storageKey, setStorageKey] = useState(GUEST_STORAGE_KEY);
  const [userId, setUserId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setLearningAudioEnabled(settings.soundEnabled);
    if (!settings.soundEnabled) void stopSpeaking();
  }, [settings.soundEnabled]);

  useEffect(() => {
    setIsHydrated(false);
    setUserId(user?.uid ?? null);
    setStorageKey(user ? `${STORAGE_KEY_PREFIX}:${user.uid}` : GUEST_STORAGE_KEY);
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        const storedSettings = await getUserSettings(storageKey, userId);

        if (isMounted) {
          setSettings(storedSettings);
        }
      } catch {
        if (isMounted) {
          setSettings(DEFAULT_USER_SETTINGS);
        }
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    }

    void loadSettings();

    return () => {
      isMounted = false;
    };
  }, [storageKey, userId]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void saveUserSettings(storageKey, settings, userId).catch(() => undefined);
  }, [isHydrated, settings, storageKey, userId]);

  const resolvedThemeMode = getResolvedThemeMode(settings.theme, systemColorScheme);
  const theme = useMemo(
    () => createAppTheme(settings, resolvedThemeMode),
    [resolvedThemeMode, settings]
  );

  const value = useMemo<UserSettingsContextValue>(() => {
    const updateSettings = (updates: Partial<UserSettings>) => {
      setSettings((currentSettings) => ({
        ...currentSettings,
        ...updates,
      }));
    };

    return {
      applyAccessibilitySettings: (updates) => updateSettings(updates),
      applyFontSize: (fontSize) => updateSettings({ fontSize }),
      applyTheme: (themeMode) => updateSettings({ theme: themeMode }),
      isHydrated,
      resolvedThemeMode,
      settings,
      theme,
      toggleDarkMode: () => {
        updateSettings({
          theme: resolvedThemeMode === "dark" ? "light" : "dark",
        });
      },
      updateSettings,
    };
  }, [isHydrated, resolvedThemeMode, settings, theme]);

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext);

  if (!context) {
    throw new Error("useUserSettings must be used within UserSettingsProvider");
  }

  return context;
}
