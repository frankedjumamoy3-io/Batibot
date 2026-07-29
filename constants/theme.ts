import {
  Platform,
  StyleSheet,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedThemeMode = "light" | "dark";
export type ThemeAccentColor = "blue" | "purple" | "green" | "orange";
export type ThemeFontSize = "small" | "normal" | "large";

export interface UserSettings {
  theme: ThemeMode;
  accentColor: ThemeAccentColor;
  fontSize: ThemeFontSize;
  language: "en" | "fil";
  soundEnabled: boolean;
  voiceEnabled: boolean;
  backgroundMusicEnabled: boolean;
  soundEffectsEnabled: boolean;
  musicVolume: number;
  effectsVolume: number;
  voiceSpeed: "slow" | "normal";
  showFloatingBatiBot: boolean;
  speechQuizEnabled: boolean;
  notificationsEnabled: boolean;
  autoPlayPronunciation: boolean;
  replayWordAutomatically: boolean;
  dailyReminderEnabled: boolean;
  autoAdvance: boolean;
  showMeanings: boolean;
  showPronunciation: boolean;
  buttonSize: "normal" | "large";
  touchFeedback: boolean;
  leftHandMode: boolean;
  difficulty: "gentle" | "standard" | "challenge";
  reduceMotion: boolean;
  highContrast: boolean;
  largerText: boolean;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: "system",
  accentColor: "green",
  fontSize: "normal",
  language: "en",
  soundEnabled: true,
  voiceEnabled: true,
  backgroundMusicEnabled: true,
  soundEffectsEnabled: true,
  musicVolume: 70,
  effectsVolume: 85,
  voiceSpeed: "normal",
  showFloatingBatiBot: true,
  speechQuizEnabled: true,
  notificationsEnabled: true,
  autoPlayPronunciation: false,
  replayWordAutomatically: false,
  dailyReminderEnabled: false,
  autoAdvance: true,
  showMeanings: true,
  showPronunciation: true,
  buttonSize: "normal",
  touchFeedback: true,
  leftHandMode: false,
  difficulty: "gentle",
  reduceMotion: false,
  highContrast: false,
  largerText: false,
};

type ThemeColorTokens = {
  background: string;
  backgroundAccent: string;
  surface: string;
  surfaceSoft: string;
  surfaceMint: string;
  surfaceSky: string;
  surfaceLavender: string;
  text: string;
  textMuted: string;
  textSoft: string;
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  reward: string;
  success: string;
  border: string;
  tabMuted: string;
  danger: string;
  dangerSurface: string;
  overlay: string;
};

interface AccentTokens {
  accent: string;
  primary: string;
  primaryDark: string;
  secondary: string;
}

export interface LearningPalette {
  accent: string;
  border: string;
  deep: string;
  icon: string;
  soft: string;
  surface: string;
}

export interface AppTheme {
  colors: ThemeColorTokens;
  isDark: boolean;
  learning: {
    home: LearningPalette;
    words: LearningPalette;
    play: LearningPalette;
    progress: LearningPalette;
    rewards: LearningPalette;
    mastery: LearningPalette;
  };
  radii: {
    xl: number;
    lg: number;
    md: number;
    pill: number;
  };
  shadow: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  spacing: {
    screen: number;
    card: number;
  };
  textScale: number;
}

const LIGHT_THEME_COLORS: Omit<
  ThemeColorTokens,
  "accent" | "primary" | "primaryDark" | "secondary"
> = {
  background: "#F0FBFF",
  backgroundAccent: "#EAF8F1",
  surface: "#FFFFFF",
  surfaceSoft: "#FFF7D6",
  surfaceMint: "#E4FAEF",
  surfaceSky: "#E7F2FF",
  surfaceLavender: "#F1EAFF",
  text: "#102A43",
  textMuted: "#516A83",
  textSoft: "#7890A8",
  reward: "#F4C542",
  success: "#22B573",
  border: "#D7E8EF",
  tabMuted: "#8CA0B6",
  danger: "#C2410C",
  dangerSurface: "#FFF1EB",
  overlay: "rgba(15, 23, 42, 0.18)",
};

const DARK_THEME_COLORS: Omit<
  ThemeColorTokens,
  "accent" | "primary" | "primaryDark" | "secondary"
> = {
  background: "#0E1726",
  backgroundAccent: "#132236",
  surface: "#162335",
  surfaceSoft: "#2A1F16",
  surfaceMint: "#163126",
  surfaceSky: "#182B46",
  surfaceLavender: "#261F3B",
  text: "#E7F0FB",
  textMuted: "#B3C1D4",
  textSoft: "#8DA1BA",
  reward: "#F7C95E",
  success: "#34D399",
  border: "#22334A",
  tabMuted: "#89A0BC",
  danger: "#F97316",
  dangerSurface: "#3B2218",
  overlay: "rgba(2, 6, 23, 0.56)",
};

const ACCENT_TOKENS: Record<ThemeAccentColor, AccentTokens> = {
  blue: {
    accent: "#F59E0B",
    primary: "#2563EB",
    primaryDark: "#1D4ED8",
    secondary: "#60A5FA",
  },
  purple: {
    accent: "#F97316",
    primary: "#7C3AED",
    primaryDark: "#6D28D9",
    secondary: "#A78BFA",
  },
  green: {
    accent: "#F28C38",
    primary: "#138A7A",
    primaryDark: "#0C6E61",
    secondary: "#4C7EF3",
  },
  orange: {
    accent: "#2563EB",
    primary: "#EA580C",
    primaryDark: "#C2410C",
    secondary: "#FB923C",
  },
};

const LIGHT_LEARNING_PALETTES: AppTheme["learning"] = {
  home: {
    accent: "#138A7A",
    border: "rgba(19, 138, 122, 0.22)",
    deep: "#0F766E",
    icon: "#FFFFFF",
    soft: "#E6FFFA",
    surface: "#F5FFFC",
  },
  words: {
    accent: "#2563EB",
    border: "rgba(37, 99, 235, 0.22)",
    deep: "#1D4ED8",
    icon: "#FFFFFF",
    soft: "#EFF6FF",
    surface: "#F8FBFF",
  },
  play: {
    accent: "#F97316",
    border: "rgba(249, 115, 22, 0.24)",
    deep: "#C2410C",
    icon: "#FFFFFF",
    soft: "#FFF7ED",
    surface: "#FFFBF5",
  },
  progress: {
    accent: "#7C3AED",
    border: "rgba(124, 58, 237, 0.24)",
    deep: "#5B21B6",
    icon: "#FFFFFF",
    soft: "#F5F3FF",
    surface: "#FBFAFF",
  },
  rewards: {
    accent: "#F59E0B",
    border: "rgba(245, 158, 11, 0.26)",
    deep: "#B45309",
    icon: "#FFFFFF",
    soft: "#FFFBEB",
    surface: "#FFFDF5",
  },
  mastery: {
    accent: "#8B5CF6",
    border: "rgba(139, 92, 246, 0.22)",
    deep: "#6D28D9",
    icon: "#FFFFFF",
    soft: "#F5F3FF",
    surface: "#FBFAFF",
  },
};

const DARK_LEARNING_PALETTES: AppTheme["learning"] = {
  home: {
    accent: "#2DD4BF",
    border: "rgba(45, 212, 191, 0.28)",
    deep: "#14B8A6",
    icon: "#FFFFFF",
    soft: "#123C38",
    surface: "#102E2C",
  },
  words: {
    accent: "#60A5FA",
    border: "rgba(96, 165, 250, 0.28)",
    deep: "#2563EB",
    icon: "#FFFFFF",
    soft: "#172B4C",
    surface: "#14243F",
  },
  play: {
    accent: "#FB923C",
    border: "rgba(251, 146, 60, 0.30)",
    deep: "#EA580C",
    icon: "#FFFFFF",
    soft: "#3B2218",
    surface: "#2B211A",
  },
  progress: {
    accent: "#A78BFA",
    border: "rgba(167, 139, 250, 0.30)",
    deep: "#7C3AED",
    icon: "#FFFFFF",
    soft: "#2E2457",
    surface: "#211B3F",
  },
  rewards: {
    accent: "#FBBF24",
    border: "rgba(251, 191, 36, 0.30)",
    deep: "#D97706",
    icon: "#FFFFFF",
    soft: "#3D2B12",
    surface: "#302616",
  },
  mastery: {
    accent: "#A78BFA",
    border: "rgba(167, 139, 250, 0.28)",
    deep: "#7C3AED",
    icon: "#FFFFFF",
    soft: "#2E2450",
    surface: "#231D3D",
  },
};

function getBaseTextScale(fontSize: ThemeFontSize) {
  switch (fontSize) {
    case "small":
      return 0.92;
    case "large":
      return 1.12;
    default:
      return 1;
  }
}

export function getResolvedThemeMode(
  themeMode: ThemeMode,
  systemColorScheme?: string | null
): ResolvedThemeMode {
  if (themeMode === "light" || themeMode === "dark") {
    return themeMode;
  }

  return systemColorScheme === "dark" ? "dark" : "light";
}

export function getUserTextScale(settings: Pick<UserSettings, "fontSize" | "largerText">) {
  const baseScale = getBaseTextScale(settings.fontSize);
  return settings.largerText ? baseScale + 0.14 : baseScale;
}

function getContrastOverrides(
  colors: ThemeColorTokens,
  isDark: boolean,
  enabled: boolean
): ThemeColorTokens {
  if (!enabled) {
    return colors;
  }

  return {
    ...colors,
    background: isDark ? "#0A1321" : "#F9FCFF",
    backgroundAccent: isDark ? "#101C2F" : "#EAF4FF",
    border: isDark ? "#3A4B65" : "#BACFE5",
    surface: isDark ? "#111E30" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#0F172A",
    textMuted: isDark ? "#D5E3F5" : "#1E293B",
    textSoft: isDark ? "#BDD0E7" : "#334155",
  };
}

export function createAppTheme(
  settings: UserSettings,
  resolvedThemeMode: ResolvedThemeMode
): AppTheme {
  const isDark = resolvedThemeMode === "dark";
  const accentTokens = ACCENT_TOKENS[settings.accentColor];
  const baseColors = isDark ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;
  const colors = getContrastOverrides(
    {
      ...baseColors,
      ...accentTokens,
    },
    isDark,
    settings.highContrast
  );

  return {
    colors,
    isDark,
    learning: isDark ? DARK_LEARNING_PALETTES : LIGHT_LEARNING_PALETTES,
    radii: {
      xl: 30,
      lg: 24,
      md: 18,
      pill: 999,
    },
    shadow: {
      shadowColor: isDark ? "#020617" : "#17324D",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.24 : 0.11,
      shadowRadius: 16,
      elevation: 5,
    },
    spacing: {
      screen: 20,
      card: 18,
    },
    textScale: getUserTextScale(settings),
  };
}

export const StudyBuddyTheme = createAppTheme(
  DEFAULT_USER_SETTINGS,
  getResolvedThemeMode(DEFAULT_USER_SETTINGS.theme, "light")
);

export const StudyBuddyShadow = StudyBuddyTheme.shadow;

type NamedStyle = ViewStyle | TextStyle | ImageStyle;
type NamedStyles<T> = {
  [P in keyof T]: NamedStyle;
};

function scaleStyleValue(style: NamedStyle, textScale: number) {
  const scaledStyle = { ...(style as Record<string, unknown>) };

  if (typeof scaledStyle.fontSize === "number") {
    scaledStyle.fontSize = Math.round(scaledStyle.fontSize * textScale);
  }

  if (typeof scaledStyle.lineHeight === "number") {
    scaledStyle.lineHeight = Math.round(scaledStyle.lineHeight * textScale);
  }

  if (typeof scaledStyle.letterSpacing === "number") {
    scaledStyle.letterSpacing = Number(
      (scaledStyle.letterSpacing * textScale).toFixed(2)
    );
  }

  return scaledStyle as NamedStyle;
}

export function createThemedStyles<T extends NamedStyles<T>>(
  theme: AppTheme,
  styles: T
) {
  const scaledEntries = Object.entries(styles).map(([key, style]) => [
    key,
    scaleStyleValue(style as NamedStyle, theme.textScale),
  ]);

  return StyleSheet.create(
    Object.fromEntries(scaledEntries) as NamedStyles<T>
  ) as T;
}
