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

import { APP_ROUTES } from "@/src/navigation/routes";
import { AUTH_ASSETS } from "@/src/data/auth-assets";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { AUTH_AVATAR_OPTIONS } from "@/src/screens/auth/auth.content";
import { onboardingAuthStyles as styles } from "@/src/screens/auth/onboarding-auth.styles";
import {
  normalizeLearnerName,
  validateLearnerProfileDraft,
} from "@/src/services/profileValidationService";
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

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const { startLearnerSession } = useCurrentUserProfile();
  const [step, setStep] = useState<"details" | "avatar">("details");
  const [username, setUsername] = useState("");
  const [yearLevel, setYearLevel] = useState<LearnerGradeLevel | "">("");
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const compact = height < 720;
  const contentWidth = Math.min(width - 40, 420);

  const selectedAvatar = useMemo(() => {
    return AUTH_AVATAR_OPTIONS.find((option) => option.id === avatarId) ?? null;
  }, [avatarId]);

  const canCreate = useMemo(() => {
    return (
      !loading &&
      validateLearnerProfileDraft({
        avatarId: AUTH_AVATAR_OPTIONS[0].id,
        displayName: username,
        gradeLevel: yearLevel || null,
      }).isValid
    );
  }, [loading, username, yearLevel]);
  const canStart = Boolean(!loading && selectedAvatar && yearLevel);

  async function startLearning() {
    if (!selectedAvatar || !yearLevel) {
      Alert.alert("Check profile", "Choose your grade and avatar.");
      return;
    }

    const validation = validateLearnerProfileDraft({
      avatarId: selectedAvatar.id,
      displayName: username,
      gradeLevel: yearLevel,
    });

    if (!validation.isValid) {
      Alert.alert("Check profile", validation.errors[0]);
      return;
    }

    setLoading(true);

    try {
      await startLearnerSession({
        avatarAssetKey: selectedAvatar.assetKey,
        avatarCategory: selectedAvatar.category,
        avatarId: selectedAvatar.id,
        buddyEmoji: selectedAvatar.emoji,
        gradeLevel: yearLevel,
        username: normalizeLearnerName(username),
      });
      router.replace(APP_ROUTES.tabs.play);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not create your profile. Try again.";
      Alert.alert("Profile not saved", message);
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
        <Image
          accessibilityLabel="BatiBot logo"
          contentFit="contain"
          source={BATIBOT_LOGO}
          style={[styles.mockupLogo, compact && styles.mockupLogoCompact]}
        />

        {step === "details" ? (
          <View style={styles.mockupContent}>
            <Text style={styles.mockupFieldLabel}>Your name</Text>
            <TextInput
              autoCapitalize="words"
              maxLength={20}
              onChangeText={setUsername}
              placeholder="Name"
              placeholderTextColor="#6C2BFF"
              style={[styles.mockupNameInput, compact && styles.mockupNameInputCompact]}
              value={username}
            />

            <Text style={styles.mockupFieldLabel}>Your Grade</Text>
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
                      option.value === "Grade 3" && styles.mockupGradeButtonCenter,
                      selected && styles.mockupGradeButtonActive,
                    ]}
                  >
                    <Text
                      adjustsFontSizeToFit
                      numberOfLines={1}
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
          <View style={styles.mockupAvatarContent}>
            <Text style={styles.mockupAvatarTitle}>Select Avatar</Text>
            <View style={styles.mockupAvatarGrid}>
              {AUTH_AVATAR_OPTIONS.map((option) => {
                const selected = selectedAvatar?.id === option.id;

                return (
                  <Pressable
                    key={option.id}
                    accessibilityLabel={`Select ${option.label} avatar`}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setAvatarId(option.id)}
                    style={[
                      styles.mockupAvatarTile,
                      selected && styles.mockupAvatarTileActive,
                    ]}
                  >
                    <Image
                      accessibilityIgnoresInvertColors
                      contentFit="contain"
                      source={option.localSource}
                      style={styles.mockupAvatarImage}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.mockupBottomActions}>
          <Pressable
            disabled={step === "details" ? !canCreate : !canStart}
            onPress={() => {
              if (step === "details") {
                setStep("avatar");
                return;
              }

              void startLearning();
            }}
            style={[
              styles.mockupPrimaryButton,
              (step === "details" ? !canCreate : !canStart) &&
                styles.mockupButtonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.mockupPrimaryText}>
                {step === "details" ? "Create" : "Start"}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
