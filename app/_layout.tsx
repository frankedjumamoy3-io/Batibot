import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect } from "react";
import { STACK_ROUTE_NAMES } from "@/src/navigation/routes";
import { LearnerProgressProvider } from "@/src/presentation/state/learner-progress-provider";
import { AuthSessionProvider, useAuthSession } from "@/src/store/auth-session";
import {
  UserSettingsProvider,
  useUserSettings,
} from "@/src/store/user-settings";
import { subscribeToGlobalAssetRegistry } from "@/src/services/assets/assetRegistryService";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppShell() {
  const { user } = useAuthSession();
  const { resolvedThemeMode, theme } = useUserSettings();
  const navigationTheme = resolvedThemeMode === "dark" ? DarkTheme : DefaultTheme;

  useEffect(() => {
    Font.loadAsync(Ionicons.font)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!user) return;
    return subscribeToGlobalAssetRegistry();
  }, [user]);

  return (
    <ThemeProvider
      value={{
        ...navigationTheme,
        colors: {
          ...navigationTheme.colors,
          background: theme.colors.background,
          border: theme.colors.border,
          card: theme.colors.surface,
          notification: theme.colors.accent,
          primary: theme.colors.primary,
          text: theme.colors.text,
        },
      }}
    >
      <Stack screenOptions={{ animation: "fade_from_bottom", animationDuration: 280 }}>
        <Stack.Screen name={STACK_ROUTE_NAMES.admin} options={{ headerShown: false }} />
        <Stack.Screen name={STACK_ROUTE_NAMES.auth} options={{ headerShown: false }} />
        <Stack.Screen name={STACK_ROUTE_NAMES.tabs} options={{ headerShown: false }} />
        <Stack.Screen
          name={STACK_ROUTE_NAMES.lessonTopic}
          options={{ animation: "slide_from_right", headerShown: false }}
        />
        <Stack.Screen
          name={STACK_ROUTE_NAMES.modal}
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar
        backgroundColor="transparent"
        translucent
        style={resolvedThemeMode === "dark" ? "light" : "dark"}
      />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthSessionProvider>
      <UserSettingsProvider>
        <LearnerProgressProvider>
          <AppShell />
        </LearnerProgressProvider>
      </UserSettingsProvider>
    </AuthSessionProvider>
  );
}
