import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { isAllowedAdminEmail } from "@/src/config/admin";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import { AUTH_ASSETS } from "@/src/data/auth-assets";
import {
  findLocalLearnerProfiles,
  type LocalLearnerProfile,
} from "@/src/data/repositories/learner-session-repository";
import { APP_ROUTES } from "@/src/navigation/routes";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import {
  loginWithEmail,
  signupWithEmail,
} from "@/src/presentation/viewmodels/auth-actions";
import {
  AUTH_SCREEN_COPY,
  AUTH_VALIDATION_MESSAGES,
  isValidEmail,
} from "@/src/screens/auth/auth.content";
import { onboardingAuthStyles as styles } from "@/src/screens/auth/onboarding-auth.styles";
import type { LearnerGradeLevel } from "@/src/types/user";

const BATIBOT_LOGO = AUTH_ASSETS.batibotLogo;

const YEAR_LEVEL_OPTIONS: {
  label: string;
  value: LearnerGradeLevel;
}[] = [
  { label: "Preschool", value: "Preschool" },
  { label: "Kindergarten", value: "Kindergarten" },
  { label: "Grade 1", value: "Grade 1" },
  { label: "Grade 2", value: "Grade 2" },
  { label: "Grade 3", value: "Grade 3" },
];

const ADMIN_EMAIL_ALIASES: Record<string, string> = {
  admin123: "admin123@gmail.com",
};

function resolveAdminLoginEmail(value: string) {
  const normalized = value.trim().toLowerCase();

  return ADMIN_EMAIL_ALIASES[normalized] ?? normalized;
}

function getAuthErrorCode(error: unknown) {
  return error && typeof error === "object" && "code" in error
    ? String((error as { code?: unknown }).code)
    : "";
}

function isMissingAdminAuthAccount(error: unknown) {
  const code = getAuthErrorCode(error);

  return (
    code === "auth/user-not-found" ||
    code === "auth/invalid-credential" ||
    code === "auth/invalid-login-credentials"
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const { startLearnerSession } = useCurrentUserProfile();
  const [username, setUsername] = useState("");
  const [yearLevel, setYearLevel] = useState<LearnerGradeLevel | "">("");
  const [adminMode, setAdminMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const compact = height < 720;
  const contentWidth = Math.min(width - 40, 420);

  const learnerDisabled = useMemo(() => {
    return !username.trim() || !yearLevel || loading;
  }, [loading, username, yearLevel]);

  const adminDisabled = useMemo(() => {
    return !email.trim() || !password || loading;
  }, [email, loading, password]);

  async function startLearnerProfile(profile: LocalLearnerProfile) {
    await startLearnerSession({
      allowedPreviewLevels: profile.allowedPreviewLevels,
      buddyEmoji: profile.buddyEmoji,
      currentPreviewLevel: profile.currentPreviewLevel,
      excludeFromAnalytics: profile.excludeFromAnalytics,
      excludeFromLeaderboard: profile.excludeFromLeaderboard,
      gradeLevel: profile.gradeLevel,
      isTestAccount: profile.isTestAccount,
      profileId: profile.profileId,
      role: profile.role,
      unlockAllQuizzes: profile.unlockAllQuizzes,
      unlockMode: profile.unlockMode,
      username: profile.username,
    });
  }

  async function continueLearner() {
    if (!username.trim()) {
      Alert.alert("Missing name", "Please type your name.");
      return;
    }

    if (!yearLevel) {
      Alert.alert("Pick a grade", "Please pick your grade level.");
      return;
    }

    setLoading(true);

    try {
      const matches = await findLocalLearnerProfiles({
        gradeLevel: yearLevel,
        username: username.trim(),
      });

      if (matches[0]) {
        await startLearnerProfile(matches[0]);
      } else {
        Alert.alert(
          "No saved journey yet",
          "Create an account to get started.",
          [
            { style: "cancel", text: "Stay here" },
            {
              text: "Create Account",
              onPress: () => router.push(APP_ROUTES.auth.signup),
            },
          ],
        );
        return;
      }

      router.replace(APP_ROUTES.tabs.play);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdminLogin() {
    const resolvedEmail = resolveAdminLoginEmail(email);

    if (!isValidEmail(resolvedEmail)) {
      Alert.alert(
        AUTH_VALIDATION_MESSAGES.invalidEmail.title,
        "Use the full admin email, or type admin123.",
      );
      return;
    }

    if (!USE_NODE_BACKEND && !isAllowedAdminEmail(resolvedEmail)) {
      Alert.alert(
        AUTH_VALIDATION_MESSAGES.restrictedAdminEmail.title,
        AUTH_VALIDATION_MESSAGES.restrictedAdminEmail.message,
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        AUTH_VALIDATION_MESSAGES.invalidPassword.title,
        AUTH_VALIDATION_MESSAGES.invalidPassword.message,
      );
      return;
    }

    setLoading(true);

    try {
      await loginWithEmail({ email: resolvedEmail, password });
      router.replace(APP_ROUTES.admin.dashboard as never);
    } catch (error) {
      if (!USE_NODE_BACKEND && isMissingAdminAuthAccount(error)) {
        try {
          await signupWithEmail({
            displayName: "BatiBot Admin",
            email: resolvedEmail,
            gradeLevel: "Kindergarten",
            password,
          });
          router.replace(APP_ROUTES.admin.dashboard as never);
          return;
        } catch (signupError) {
          const message =
            signupError instanceof Error
              ? signupError.message
              : AUTH_VALIDATION_MESSAGES.loginFallbackError;

          Alert.alert(AUTH_SCREEN_COPY.login.loginFailedTitle, message);
          return;
        }
      }

      const message =
        error instanceof Error
          ? error.message
          : AUTH_VALIDATION_MESSAGES.loginFallbackError;
      Alert.alert(AUTH_SCREEN_COPY.login.loginFailedTitle, message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.mockupRoot}
    >
      <View
        style={[
          styles.mockupScreenPanel,
          {
            height: height - insets.top - insets.bottom,
            marginTop: insets.top,
            width: contentWidth,
          },
        ]}
      >
        <Pressable
          accessibilityLabel={
            adminMode ? "Close admin menu" : "Open admin menu"
          }
          onPress={() => setAdminMode((current) => !current)}
          style={styles.mockupMenuButton}
        >
          <Ionicons
            name={adminMode ? "close" : "menu"}
            size={22}
            color="#FFFFFF"
          />
        </Pressable>

        <Image
          accessibilityLabel="BatiBot logo"
          contentFit="contain"
          source={BATIBOT_LOGO}
          style={[styles.mockupLogo, compact && styles.mockupLogoCompact]}
        />

        {!adminMode ? (
          <View style={styles.mockupContent}>
            <TextInput
              autoCapitalize="words"
              onChangeText={setUsername}
              placeholder="Name"
              placeholderTextColor="#6C2BFF"
              style={[
                styles.mockupNameInput,
                compact && styles.mockupNameInputCompact,
              ]}
              value={username}
            />

            <View style={styles.mockupGradeGrid}>
              {YEAR_LEVEL_OPTIONS.map((option) => {
                const selected = yearLevel === option.value;

                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setYearLevel(option.value)}
                    style={[
                      styles.mockupGradeButton,
                      option.value === "Grade 3" &&
                        styles.mockupGradeButtonCenter,
                      selected && styles.mockupGradeButtonActive,
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={[
                        styles.mockupGradeText,
                        selected && styles.mockupGradeTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.mockupAdminPanel}>
            <Text style={styles.mockupAdminTitle}>Admin</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Email or admin123"
              placeholderTextColor="#6C2BFF"
              style={[styles.mockupNameInput, styles.mockupAdminInput]}
              value={email}
            />
            <View
              style={[styles.mockupNameInput, styles.mockupAdminPasswordRow]}
            >
              <TextInput
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#6C2BFF"
                secureTextEntry={!showPassword}
                style={styles.mockupAdminPasswordInput}
                value={password}
              />
              <Pressable onPress={() => setShowPassword((current) => !current)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6C2BFF"
                />
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.mockupBottomActions}>
          <Pressable accessibilityRole="button" disabled={loading} style={{ minHeight: 48, justifyContent: "center", alignItems: "center" }}
            onPress={() => router.push({ pathname: APP_ROUTES.auth.online, params: { mode: "login" } })}>
            <Text style={styles.mockupSecondaryText}>Sign in with email</Text>
          </Pressable>
          <Pressable
            disabled={adminMode ? adminDisabled : learnerDisabled}
            onPress={() => {
              if (adminMode) {
                void handleAdminLogin();
                return;
              }

              void continueLearner();
            }}
            style={[
              styles.mockupPrimaryButton,
              (adminMode ? adminDisabled : learnerDisabled) &&
                styles.mockupButtonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.mockupPrimaryText}>
                {adminMode ? "Log In" : "Continue Journey"}
              </Text>
            )}
          </Pressable>
          <Text style={styles.mockupOrText}>or</Text>
          <Pressable
            disabled={loading}
            onPress={() =>
              adminMode
                ? setAdminMode(false)
                : router.push(APP_ROUTES.auth.signup)
            }
            style={styles.mockupSecondaryPill}
          >
            <Text style={styles.mockupSecondaryText}>
              {adminMode ? "Back" : "Start Adventure"}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
