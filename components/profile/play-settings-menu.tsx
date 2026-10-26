import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { APP_ROUTES } from "@/src/navigation/routes";
import { SIMPLE_COLORS } from "@/src/screens/simple/simple-batibot.styles";
import { AUTH_AVATAR_OPTIONS } from "@/src/screens/auth/auth.content";
import {
  deleteLocalLearnerProfile,
} from "@/src/data/repositories/learner-session-repository";
import { getLevelFromXP } from "@/src/store/gameStore";
import { useLearnerProgress } from "@/src/presentation/state/learner-progress-provider";
import { getAppVersion, getDeviceName } from "@/src/services/deviceService";
import { getOfflineSyncQueue } from "@/src/services/offlineSyncService";
import {
  getGradePreview,
  normalizeLearnerName,
  validateLearnerProfileDraft,
} from "@/src/services/profileValidationService";
import {
  TEST_ACCOUNT_ALLOWED_LEVELS,
  buildTestLearnerSessionInput,
  isTestAccountModeAvailable,
  type TestUnlockMode,
} from "@/src/services/testAccountService";
import type { LearnerGradeLevel } from "@/src/types/user";
import { useUserSettings } from "@/src/store/user-settings";
import { LearnerAvatar } from "@/src/components/profile/LearnerAvatar";
import {
  pickProfilePhoto,
  uploadProfilePhoto,
} from "@/src/services/profileImageService";

const PROFILE_GRADE_OPTIONS: LearnerGradeLevel[] = [
  "Preschool",
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
];

function getFirstName(name?: string | null, email?: string | null) {
  return name?.trim().split(" ")[0] || email?.split("@")[0] || "Learner";
}

function SettingSwitch({
  icon,
  label,
  onValueChange,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
}) {
  return (
    <View style={settingsStyles.settingRow}>
      <View style={settingsStyles.settingIcon}>
        <Ionicons name={icon} size={22} color={SIMPLE_COLORS.purple} />
      </View>
      <Text style={settingsStyles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor="#FFFFFF"
        trackColor={{ false: "#CBD5E1", true: SIMPLE_COLORS.purple }}
      />
    </View>
  );
}

function SettingsSection({
  children,
  expanded,
  icon,
  onToggle,
  title,
}: {
  children: ReactNode;
  expanded: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  onToggle: () => void;
  title: string;
}) {
  return (
    <View style={settingsStyles.section}>
      <Pressable
        accessibilityLabel={`${expanded ? "Collapse" : "Open"} ${title} settings`}
        accessibilityRole="button"
        onPress={onToggle}
        style={settingsStyles.sectionHeader}
      >
        <View style={settingsStyles.sectionHeaderTitle}>
          <View style={settingsStyles.settingIcon}>
            <Ionicons name={icon} size={22} color={SIMPLE_COLORS.purple} />
          </View>
          <Text style={settingsStyles.sectionTitle}>{title}</Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={22}
          color={SIMPLE_COLORS.purple}
        />
      </Pressable>
      {expanded ? <View style={settingsStyles.sectionBody}>{children}</View> : null}
    </View>
  );
}

export function PlaySettingsMenu() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { endSession, profile, startLearnerSession, user } = useCurrentUserProfile();
  const { progress, resetProgress } = useLearnerProgress();
  const {
    applyAccessibilitySettings,
    applyFontSize,
    settings,
    updateSettings,
  } = useUserSettings();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [switchingPreview, setSwitchingPreview] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    accessibility: false,
    account: false,
    audio: false,
    device: false,
    learning: false,
    profile: true,
    qa: false,
    progress: false,
    about: false,
  });
  const [profileDraftName, setProfileDraftName] = useState("");
  const [profileDraftGrade, setProfileDraftGrade] =
    useState<LearnerGradeLevel>("Preschool");
  const [profileDraftAvatar, setProfileDraftAvatar] = useState<string>(
    AUTH_AVATAR_OPTIONS[0].id
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingProfilePhoto, setSavingProfilePhoto] = useState(false);
  const [resetSheetOpen, setResetSheetOpen] = useState(false);
  const [deletingProfile, setDeletingProfile] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const firstName = getFirstName(profile?.displayName, profile?.email);
  const level = getLevelFromXP(progress.totalXp);
  const selectedDraftAvatar = useMemo(
    () =>
      AUTH_AVATAR_OPTIONS.find((avatar) => avatar.id === profileDraftAvatar) ??
      AUTH_AVATAR_OPTIONS[0],
    [profileDraftAvatar]
  );
  const syncStatus = profile?.syncStatus ?? (pendingSyncCount > 0 ? "offline" : "synced");
  const deviceName = getDeviceName();
  const appVersion = getAppVersion();
  const testModeEnabled =
    profile?.isTestAccount === true && isTestAccountModeAvailable(profile, user);
  const testUnlockMode: TestUnlockMode =
    profile?.unlockMode === "normal_locked" ? "normal_locked" : "all_unlocked";

  useEffect(() => {
    if (!open || !profile) {
      return;
    }

    setProfileDraftName(profile.displayName || firstName);
    setProfileDraftGrade(profile.gradeLevel ?? "Preschool");
    setProfileDraftAvatar(profile.avatarId ?? AUTH_AVATAR_OPTIONS[0].id);
    void getOfflineSyncQueue()
      .then((queue) => setPendingSyncCount(queue.length))
      .catch(() => setPendingSyncCount(0));
  }, [firstName, open, profile]);

  function toggleSection(sectionId: string) {
    setExpandedSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
  }

  async function signOut() {
    try {
      setSigningOut(true);
      await endSession();
      setOpen(false);
      router.replace(APP_ROUTES.auth.login);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We could not sign you out right now.";
      Alert.alert("Sign out failed", message);
    } finally {
      setSigningOut(false);
    }
  }

  async function saveProfileChanges() {
    if (!profile) {
      return;
    }

    const validation = validateLearnerProfileDraft({
      avatarId: selectedDraftAvatar.id,
      displayName: profileDraftName,
      gradeLevel: profileDraftGrade,
    });

    if (!validation.isValid) {
      Alert.alert("Check profile", validation.errors[0]);
      return;
    }

    try {
      setSavingProfile(true);
      await startLearnerSession({
        avatarCategory: selectedDraftAvatar.category,
        avatarAssetKey: selectedDraftAvatar.assetKey,
        avatarId: selectedDraftAvatar.id,
        buddyEmoji: selectedDraftAvatar.emoji,
        gradeLevel: profileDraftGrade,
        profileId: profile.uid,
        profileImagePath: profile.profileImagePath,
        profileImageUrl: profile.profileImageUrl,
        username: normalizeLearnerName(profileDraftName),
      });
      Alert.alert("Profile saved", "Your profile is updated.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We could not save your profile.";
      Alert.alert("Save failed", message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function changeProfilePhoto() {
    if (!profile) {
      Alert.alert("Profile needed", "Create a profile before changing the photo.");
      return;
    }

    try {
      setSavingProfilePhoto(true);
      const picked = await pickProfilePhoto();

      if (!picked) {
        return;
      }

      const uploaded = await uploadProfilePhoto({
        localUri: picked.uri,
        profileId: profile.uid,
      });

      await startLearnerSession({
        avatarCategory: profile.avatarCategory ?? selectedDraftAvatar.category,
        avatarAssetKey: profile.avatarAssetKey ?? selectedDraftAvatar.assetKey,
        avatarId: profile.avatarId ?? selectedDraftAvatar.id,
        buddyEmoji: profile.buddyEmoji ?? selectedDraftAvatar.emoji,
        gradeLevel: profile.gradeLevel ?? profileDraftGrade,
        profileId: profile.uid,
        profileImagePath: uploaded.storagePath,
        profileImageUrl: uploaded.downloadUrl,
        username: normalizeLearnerName(profile.displayName || profileDraftName),
      });
      Alert.alert("Photo updated", "Your profile photo is ready.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We could not update your photo.";
      Alert.alert("Photo update failed", message);
    } finally {
      setSavingProfilePhoto(false);
    }
  }

  function confirmSignOut() {
    if (Platform.OS === "web") {
      const confirmed = globalThis.confirm(
        "Sign out of BatiBot?\n\nYou will return to the Login or Sign Up screen."
      );

      if (confirmed) {
        void signOut();
      }
      return;
    }

    Alert.alert(
      "Sign out of BatiBot?",
      "You will return to the Login or Sign Up screen.",
      [
        { style: "cancel", text: "Stay" },
        { onPress: () => void signOut(), style: "destructive", text: "Sign out" },
      ]
    );
  }

  function confirmResetProgress() {
    setResetSheetOpen(true);
  }

  function performResetProgress() {
    resetProgress();
    setResetSheetOpen(false);
    Alert.alert("Progress reset", "Name, avatar, and grade were kept.");
  }

  function confirmDeleteProfile() {
    if (!profile) {
      return;
    }

    Alert.alert(
      "Delete profile?",
      "This removes this learner profile from this device.",
      [
        { style: "cancel", text: "Cancel" },
        {
          onPress: () => {
            Alert.alert(
              "Delete forever?",
              "This returns BatiBot to onboarding. Progress cannot be restored from this device.",
              [
                { style: "cancel", text: "Keep profile" },
                {
                  onPress: () => void deleteProfile(),
                  style: "destructive",
                  text: "Delete",
                },
              ]
            );
          },
          style: "destructive",
          text: "Delete",
        },
      ]
    );
  }

  async function deleteProfile() {
    if (!profile) {
      return;
    }

    try {
      setDeletingProfile(true);
      resetProgress();
      await deleteLocalLearnerProfile(profile.uid);
      await endSession();
      setOpen(false);
      router.replace(APP_ROUTES.auth.signup);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We could not delete this profile.";
      Alert.alert("Delete failed", message);
    } finally {
      setDeletingProfile(false);
    }
  }

  async function switchTestPreview(
    gradeLevel: LearnerGradeLevel,
    unlockMode = testUnlockMode
  ) {
    try {
      setSwitchingPreview(true);
      await startLearnerSession(buildTestLearnerSessionInput(gradeLevel, unlockMode));
      setOpen(false);
      router.replace(APP_ROUTES.tabs.play);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We could not change the test preview.";
      Alert.alert("Preview switch failed", message);
    } finally {
      setSwitchingPreview(false);
    }
  }

  return (
    <>
      <Pressable
        accessibilityLabel="Open user settings"
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={settingsStyles.trigger}
      >
        <LearnerAvatar
          profile={{
            avatarAssetKey: profile?.avatarAssetKey,
            avatarId: profile?.avatarId,
            buddyEmoji: profile?.buddyEmoji,
            displayName: profile?.displayName,
            profileImageUrl: profile?.profileImageUrl,
          }}
          size="small"
        />
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        transparent
        visible={open}
      >
        <View style={settingsStyles.modalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={[settingsStyles.panel, { paddingTop: insets.top + 18 }]}>
            <View style={settingsStyles.headerRow}>
              <View>
                <Text style={settingsStyles.kicker}>My Settings</Text>
                <Text style={settingsStyles.title}>Hi, {firstName}</Text>
              </View>
              <Pressable
                accessibilityLabel="Close user settings"
                onPress={() => setOpen(false)}
                style={settingsStyles.closeButton}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={settingsStyles.content}
              showsVerticalScrollIndicator={false}
            >
              <View style={settingsStyles.summaryCard}>
                <LearnerAvatar
                  profile={{
                    avatarAssetKey: profile?.avatarAssetKey ?? selectedDraftAvatar.assetKey,
                    avatarId: profile?.avatarId ?? selectedDraftAvatar.id,
                    buddyEmoji: profile?.buddyEmoji ?? selectedDraftAvatar.emoji,
                    displayName: profile?.displayName,
                    profileImageUrl: profile?.profileImageUrl,
                  }}
                  size="medium"
                />
                <View style={{ flex: 1 }}>
                  <Text style={settingsStyles.summaryName}>
                    {profile?.displayName || firstName}
                  </Text>
                  <Text style={settingsStyles.summaryMeta}>
                    {profile?.gradeLevel ?? "Early Learner"} | Level {level}
                  </Text>
                  <Text style={settingsStyles.syncMeta}>
                    {syncStatus === "synced"
                      ? "Synced"
                      : syncStatus === "syncing"
                        ? "Syncing"
                        : `Offline${pendingSyncCount ? ` | ${pendingSyncCount} pending` : ""}`}
                  </Text>
                  {testModeEnabled ? (
                    <Text style={settingsStyles.summaryTestMeta}>
                      TEST MODE | {testUnlockMode === "all_unlocked" ? "All unlocked" : "Locked preview"}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={settingsStyles.quickStats}>
                <View style={settingsStyles.statBox}>
                  <Text style={settingsStyles.statValue}>{progress.totalXp}</Text>
                  <Text style={settingsStyles.statLabel}>XP</Text>
                </View>
                <View style={settingsStyles.statBox}>
                  <Text style={settingsStyles.statValue}>{progress.completedQuizIds.length}</Text>
                  <Text style={settingsStyles.statLabel}>Lessons</Text>
                </View>
                <View style={settingsStyles.statBox}>
                  <Text style={settingsStyles.statValue}>{progress.badges.length}</Text>
                  <Text style={settingsStyles.statLabel}>Badges</Text>
                </View>
              </View>

              <SettingsSection
                expanded={expandedSections.profile}
                icon="person-circle"
                onToggle={() => toggleSection("profile")}
                title="Profile"
              >
                <Text style={settingsStyles.inputLabel}>Name</Text>
                <TextInput
                  autoCapitalize="words"
                  onChangeText={setProfileDraftName}
                  placeholder="Name"
                  placeholderTextColor="#8B5CF6"
                  style={settingsStyles.profileInput}
                  value={profileDraftName}
                />
                <Text style={settingsStyles.inputLabel}>Grade</Text>
                <View style={settingsStyles.profileGradeGrid}>
                  {PROFILE_GRADE_OPTIONS.map((gradeLevel) => {
                    const selected = profileDraftGrade === gradeLevel;

                    return (
                      <Pressable
                        key={gradeLevel}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        onPress={() => setProfileDraftGrade(gradeLevel)}
                        style={[
                          settingsStyles.profileGradeButton,
                          selected && settingsStyles.profileGradeButtonActive,
                        ]}
                      >
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={[
                            settingsStyles.profileGradeText,
                            selected && settingsStyles.profileGradeTextActive,
                          ]}
                        >
                          {gradeLevel}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Text style={settingsStyles.previewText}>
                  {getGradePreview(profileDraftGrade)}
                </Text>
                <Text style={settingsStyles.inputLabel}>Profile Photo</Text>
                <View style={settingsStyles.photoRow}>
                  <LearnerAvatar
                    editable
                    onPress={() => void changeProfilePhoto()}
                    profile={{
                      avatarAssetKey: selectedDraftAvatar.assetKey,
                      avatarId: selectedDraftAvatar.id,
                      buddyEmoji: selectedDraftAvatar.emoji,
                      displayName: profileDraftName,
                      profileImageUrl: profile?.profileImageUrl,
                    }}
                    size="large"
                  />
                  <Pressable
                    disabled={savingProfilePhoto}
                    onPress={() => void changeProfilePhoto()}
                    style={settingsStyles.changePhotoButton}
                  >
                    {savingProfilePhoto ? (
                      <ActivityIndicator color="#681BF2" />
                    ) : (
                      <>
                        <Ionicons name="image" size={20} color="#681BF2" />
                        <Text style={settingsStyles.changePhotoText}>
                          Change Photo
                        </Text>
                      </>
                    )}
                  </Pressable>
                </View>
                <Text style={settingsStyles.inputLabel}>Avatar</Text>
                <View style={settingsStyles.avatarGrid}>
                  {AUTH_AVATAR_OPTIONS.map((avatar) => {
                    const selected = selectedDraftAvatar.id === avatar.id;

                    return (
                      <Pressable
                        key={avatar.id}
                        accessibilityLabel={`Choose ${avatar.label} avatar`}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        onPress={() => setProfileDraftAvatar(avatar.id)}
                        style={[
                          settingsStyles.avatarTile,
                          selected && settingsStyles.avatarTileActive,
                        ]}
                      >
                        <Image
                          accessibilityIgnoresInvertColors
                          contentFit="contain"
                          source={avatar.localSource}
                          style={settingsStyles.avatarTileImage}
                        />
                      </Pressable>
                    );
                  })}
                </View>
                <Pressable
                  disabled={savingProfile}
                  onPress={() => void saveProfileChanges()}
                  style={settingsStyles.saveProfileButton}
                >
                  {savingProfile ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="save" size={21} color="#FFFFFF" />
                      <Text style={settingsStyles.saveProfileText}>Save Profile</Text>
                    </>
                  )}
                </Pressable>
              </SettingsSection>

              {testModeEnabled ? (
                <SettingsSection
                  expanded={expandedSections.qa}
                  icon="flask"
                  onToggle={() => toggleSection("qa")}
                  title="QA Preview"
                >
                  <View style={settingsStyles.testHeaderRow}>
                    <View style={settingsStyles.testBadge}>
                      <Text style={settingsStyles.testBadgeText}>TEST MODE</Text>
                    </View>
                  </View>
                  <Text style={settingsStyles.testHint}>
                    Switch levels without touching real learner progress.
                  </Text>
                  <View style={settingsStyles.levelGrid}>
                    {TEST_ACCOUNT_ALLOWED_LEVELS.map((gradeLevel) => {
                      const selected = profile?.gradeLevel === gradeLevel;

                      return (
                        <Pressable
                          key={gradeLevel}
                          disabled={switchingPreview}
                          onPress={() => void switchTestPreview(gradeLevel)}
                          style={[
                            settingsStyles.levelChoice,
                            selected && settingsStyles.levelChoiceActive,
                          ]}
                        >
                          <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            style={[
                              settingsStyles.levelChoiceText,
                              selected && settingsStyles.levelChoiceTextActive,
                            ]}
                          >
                            {gradeLevel}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <View style={settingsStyles.settingRow}>
                    <View style={settingsStyles.settingIcon}>
                      <Ionicons name="lock-open" size={22} color={SIMPLE_COLORS.purple} />
                    </View>
                    <Text style={settingsStyles.settingLabel}>Unlock all content</Text>
                    <Switch
                      disabled={switchingPreview}
                      value={testUnlockMode === "all_unlocked"}
                      onValueChange={(enabled) =>
                        void switchTestPreview(
                          profile?.gradeLevel ?? "Preschool",
                          enabled ? "all_unlocked" : "normal_locked"
                        )
                      }
                      thumbColor="#FFFFFF"
                      trackColor={{ false: "#CBD5E1", true: SIMPLE_COLORS.purple }}
                    />
                  </View>
                  <Pressable
                    onPress={confirmResetProgress}
                    style={settingsStyles.secondaryAction}
                  >
                    <Ionicons name="refresh-circle" size={24} color={SIMPLE_COLORS.purple} />
                    <Text style={settingsStyles.secondaryActionText}>
                      Reset test progress
                    </Text>
                  </Pressable>
                </SettingsSection>
              ) : null}

              <SettingsSection
                expanded={expandedSections.audio}
                icon="volume-high"
                onToggle={() => toggleSection("audio")}
                title="Audio"
              >
                <SettingSwitch
                  icon="volume-high"
                  label="Sound"
                  onValueChange={(soundEnabled) => updateSettings({ soundEnabled })}
                  value={settings.soundEnabled}
                />
                <SettingSwitch
                  icon="play-circle"
                  label="Say words"
                  onValueChange={(autoPlayPronunciation) =>
                    updateSettings({ autoPlayPronunciation })
                  }
                  value={settings.autoPlayPronunciation}
                />
                <SettingSwitch
                  icon="chatbox-ellipses"
                  label="Voice"
                  onValueChange={(voiceEnabled) => updateSettings({ voiceEnabled })}
                  value={settings.voiceEnabled}
                />
                <SettingSwitch
                  icon="musical-notes"
                  label="Music"
                  onValueChange={(backgroundMusicEnabled) =>
                    updateSettings({ backgroundMusicEnabled })
                  }
                  value={settings.backgroundMusicEnabled}
                />
                <SettingSwitch
                  icon="mic"
                  label="Speech games"
                  onValueChange={(speechQuizEnabled) =>
                    updateSettings({ speechQuizEnabled })
                  }
                  value={settings.speechQuizEnabled}
                />
              </SettingsSection>

              <SettingsSection
                expanded={expandedSections.accessibility}
                icon="accessibility"
                onToggle={() => toggleSection("accessibility")}
                title="Accessibility"
              >
                <SettingSwitch
                  icon="text"
                  label="Big words"
                  onValueChange={(largerText) =>
                    applyAccessibilitySettings({ largerText })
                  }
                  value={settings.largerText}
                />
                <SettingSwitch
                  icon="sparkles"
                  label="Calm moves"
                  onValueChange={(reduceMotion) =>
                    applyAccessibilitySettings({ reduceMotion })
                  }
                  value={settings.reduceMotion}
                />
                <View style={settingsStyles.sizeRow}>
                  <Pressable
                    onPress={() => applyFontSize("normal")}
                    style={[
                      settingsStyles.sizeButton,
                      settings.fontSize !== "large" && settingsStyles.sizeButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        settingsStyles.sizeButtonText,
                        settings.fontSize !== "large" && settingsStyles.sizeButtonTextActive,
                      ]}
                    >
                      Normal
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => applyFontSize("large")}
                    style={[
                      settingsStyles.sizeButton,
                      settings.fontSize === "large" && settingsStyles.sizeButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        settingsStyles.sizeButtonText,
                        settings.fontSize === "large" && settingsStyles.sizeButtonTextActive,
                      ]}
                    >
                      Bigger
                    </Text>
                  </Pressable>
                </View>
                <SettingSwitch
                  icon="contrast"
                  label="High contrast"
                  onValueChange={(highContrast) =>
                    applyAccessibilitySettings({ highContrast })
                  }
                  value={settings.highContrast}
                />
              </SettingsSection>

              <SettingsSection
                expanded={expandedSections.learning}
                icon="school"
                onToggle={() => toggleSection("learning")}
                title="Learning"
              >
                <SettingSwitch
                  icon="alarm"
                  label="Daily reminder"
                  onValueChange={(dailyReminderEnabled) =>
                    updateSettings({ dailyReminderEnabled })
                  }
                  value={settings.dailyReminderEnabled}
                />
                <SettingSwitch
                  icon="chatbubble-ellipses"
                  label="Floating helper"
                  onValueChange={(showFloatingBatiBot) =>
                    updateSettings({ showFloatingBatiBot })
                  }
                  value={settings.showFloatingBatiBot}
                />
                <SettingSwitch
                  icon="play-forward"
                  label="Auto advance"
                  onValueChange={(autoAdvance) => updateSettings({ autoAdvance })}
                  value={settings.autoAdvance}
                />
                <SettingSwitch
                  icon="book"
                  label="Show meanings"
                  onValueChange={(showMeanings) => updateSettings({ showMeanings })}
                  value={settings.showMeanings}
                />
                <SettingSwitch
                  icon="text"
                  label="Show pronunciation"
                  onValueChange={(showPronunciation) =>
                    updateSettings({ showPronunciation })
                  }
                  value={settings.showPronunciation}
                />
              </SettingsSection>

              <SettingsSection
                expanded={expandedSections.progress}
                icon="bar-chart"
                onToggle={() => toggleSection("progress")}
                title="Progress"
              >
                <View style={settingsStyles.progressGrid}>
                  <View style={settingsStyles.progressTile}>
                    <Text style={settingsStyles.progressTileValue}>
                      {Object.keys(progress.masteredTopics).length}
                    </Text>
                    <Text style={settingsStyles.progressTileLabel}>Mastered</Text>
                  </View>
                  <View style={settingsStyles.progressTile}>
                    <Text style={settingsStyles.progressTileValue}>
                      {progress.claimedWorldRewardIds.length}
                    </Text>
                    <Text style={settingsStyles.progressTileLabel}>Worlds</Text>
                  </View>
                </View>
                <Text style={settingsStyles.previewText}>
                  Last sync: {syncStatus === "synced" ? "cloud ready" : "waiting to sync"}
                </Text>
              </SettingsSection>

              <SettingsSection
                expanded={expandedSections.device}
                icon="phone-portrait"
                onToggle={() => toggleSection("device")}
                title="Device"
              >
                <Text style={settingsStyles.deviceLine}>{deviceName}</Text>
                <Text style={settingsStyles.previewText}>App version {appVersion}</Text>
                <Text style={settingsStyles.previewText}>
                  Offline queue: {pendingSyncCount}
                </Text>
              </SettingsSection>

              <SettingsSection
                expanded={expandedSections.account}
                icon="shield-checkmark"
                onToggle={() => toggleSection("account")}
                title="Account"
              >
                {!testModeEnabled ? (
                  <Pressable
                    onPress={confirmResetProgress}
                    style={settingsStyles.secondaryAction}
                  >
                    <Ionicons name="refresh-circle" size={24} color={SIMPLE_COLORS.purple} />
                    <Text style={settingsStyles.secondaryActionText}>Start over</Text>
                  </Pressable>
                ) : null}
                <Pressable
                  disabled={deletingProfile}
                  onPress={confirmDeleteProfile}
                  style={settingsStyles.deleteProfileButton}
                >
                  {deletingProfile ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="trash" size={23} color="#FFFFFF" />
                      <Text style={settingsStyles.signOutText}>Delete profile</Text>
                    </>
                  )}
                </Pressable>
                {user?.isLocalLearner && !user.isTestAccount ? (
                  <Pressable accessibilityRole="button" style={settingsStyles.secondaryAction}
                    onPress={() => { setOpen(false); router.push({ pathname: APP_ROUTES.auth.online, params: { mode: "signup" } }); }}>
                    <Ionicons name="cloud-upload" size={24} color={SIMPLE_COLORS.purple} />
                    <Text style={settingsStyles.secondaryActionText}>Back up my journey</Text>
                  </Pressable>
                ) : null}
                <Pressable
                  disabled={signingOut}
                  onPress={confirmSignOut}
                  style={settingsStyles.signOutButton}
                >
                  {signingOut ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="log-out" size={23} color="#FFFFFF" />
                      <Text style={settingsStyles.signOutText}>Sign out</Text>
                    </>
                  )}
                </Pressable>
              </SettingsSection>

              <SettingsSection
                expanded={expandedSections.about}
                icon="information-circle"
                onToggle={() => toggleSection("about")}
                title="About"
              >
                <Text style={settingsStyles.previewText}>
                  BatiBot helps Preschool to Grade 3 learners practice reading and numeracy.
                </Text>
                <Text style={settingsStyles.previewText}>
                  Privacy, terms, credits, and licenses are ready for future document links.
                </Text>
              </SettingsSection>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        onRequestClose={() => setResetSheetOpen(false)}
        transparent
        visible={resetSheetOpen}
      >
        <View style={settingsStyles.confirmRoot}>
          <View style={settingsStyles.confirmSheet}>
            <Text style={settingsStyles.confirmTitle}>
              Reset all learning progress?
            </Text>
            <Text style={settingsStyles.confirmBody}>
              Keep name, avatar, and grade. Lose XP, stars, badges, lessons,
              topics, worlds, and streak.
            </Text>
            <Pressable
              accessibilityLabel="Hold to reset progress"
              delayLongPress={2000}
              onLongPress={performResetProgress}
              style={settingsStyles.holdResetButton}
            >
              <Ionicons name="refresh" size={24} color="#FFFFFF" />
              <Text style={settingsStyles.signOutText}>Hold 2s to Reset</Text>
            </Pressable>
            <Pressable
              onPress={() => setResetSheetOpen(false)}
              style={settingsStyles.cancelButton}
            >
              <Text style={settingsStyles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const settingsStyles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    height: 62,
    justifyContent: "center",
    width: 62,
  },
  avatarEmoji: {
    fontSize: 27,
  },
  avatarImage: {
    height: 48,
    width: 48,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  avatarTile: {
    alignItems: "center",
    backgroundColor: "#F8F5FF",
    borderColor: "#E9D5FF",
    borderRadius: 16,
    borderWidth: 2,
    height: 56,
    justifyContent: "center",
    width: "30%",
  },
  avatarTileActive: {
    backgroundColor: SIMPLE_COLORS.purple,
    borderColor: SIMPLE_COLORS.purple,
    transform: [{ scale: 1.03 }],
  },
  avatarTileImage: {
    height: 44,
    width: 44,
  },
  buddyEmoji: {
    fontSize: 34,
  },
  changePhotoButton: {
    alignItems: "center",
    backgroundColor: "#F8F5FF",
    borderColor: "#C4B5FD",
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    color: "#681BF2",
    fontSize: 15,
    fontWeight: "900",
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: SIMPLE_COLORS.purple,
    borderRadius: 999,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: "#EEF0F5",
    borderRadius: 16,
    minHeight: 52,
    justifyContent: "center",
  },
  cancelButtonText: {
    color: SIMPLE_COLORS.text,
    fontSize: 16,
    fontWeight: "900",
  },
  confirmBody: {
    color: SIMPLE_COLORS.muted,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 22,
    textAlign: "center",
  },
  confirmRoot: {
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.42)",
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
  },
  confirmSheet: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    gap: 14,
    padding: 20,
    width: "100%",
  },
  confirmTitle: {
    color: SIMPLE_COLORS.text,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  content: {
    gap: 16,
    paddingBottom: 28,
  },
  deleteProfileButton: {
    alignItems: "center",
    backgroundColor: "#B91C1C",
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    minHeight: 58,
  },
  deviceLine: {
    color: SIMPLE_COLORS.text,
    fontSize: 17,
    fontWeight: "900",
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  kicker: {
    color: SIMPLE_COLORS.purple,
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  modalRoot: {
    backgroundColor: "rgba(15,23,42,0.30)",
    flex: 1,
  },
  panel: {
    backgroundColor: "#F8F8FB",
    borderBottomLeftRadius: 30,
    borderTopLeftRadius: 30,
    bottom: 0,
    paddingHorizontal: 20,
    position: "absolute",
    right: 0,
    top: 0,
    width: "86%",
  },
  quickStats: {
    flexDirection: "row",
    gap: 10,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EAF1",
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  sectionBody: {
    gap: 10,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 46,
  },
  sectionHeaderTitle: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  sectionTitle: {
    color: SIMPLE_COLORS.text,
    fontSize: 20,
    fontWeight: "900",
  },
  holdResetButton: {
    alignItems: "center",
    backgroundColor: "#EF4444",
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    minHeight: 58,
  },
  inputLabel: {
    color: SIMPLE_COLORS.text,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  previewText: {
    color: SIMPLE_COLORS.muted,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
  },
  photoRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
  profileGradeButton: {
    alignItems: "center",
    backgroundColor: "#EEF0F5",
    borderColor: "#CBD5E1",
    borderRadius: 14,
    borderWidth: 1,
    flexBasis: "47%",
    flexGrow: 1,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  profileGradeButtonActive: {
    backgroundColor: SIMPLE_COLORS.purple,
    borderColor: SIMPLE_COLORS.purple,
  },
  profileGradeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  profileGradeText: {
    color: SIMPLE_COLORS.text,
    fontSize: 13,
    fontWeight: "900",
  },
  profileGradeTextActive: {
    color: "#FFFFFF",
  },
  profileInput: {
    backgroundColor: "#F8F5FF",
    borderColor: "#DDD6FE",
    borderRadius: 16,
    borderWidth: 2,
    color: SIMPLE_COLORS.text,
    fontSize: 17,
    fontWeight: "900",
    minHeight: 52,
    paddingHorizontal: 14,
  },
  progressGrid: {
    flexDirection: "row",
    gap: 10,
  },
  progressTile: {
    alignItems: "center",
    backgroundColor: "#F8F5FF",
    borderRadius: 16,
    flex: 1,
    padding: 12,
  },
  progressTileLabel: {
    color: SIMPLE_COLORS.muted,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 3,
  },
  progressTileValue: {
    color: SIMPLE_COLORS.purple,
    fontSize: 23,
    fontWeight: "900",
  },
  saveProfileButton: {
    alignItems: "center",
    backgroundColor: SIMPLE_COLORS.purple,
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    minHeight: 56,
  },
  saveProfileText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  secondaryAction: {
    alignItems: "center",
    backgroundColor: SIMPLE_COLORS.purpleLight,
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 14,
  },
  secondaryActionText: {
    color: SIMPLE_COLORS.purple,
    fontSize: 16,
    fontWeight: "900",
  },
  settingIcon: {
    alignItems: "center",
    backgroundColor: SIMPLE_COLORS.purpleLight,
    borderRadius: 14,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  settingLabel: {
    color: SIMPLE_COLORS.text,
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
  },
  settingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    minHeight: 52,
  },
  signOutButton: {
    alignItems: "center",
    backgroundColor: "#EF4444",
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    minHeight: 58,
  },
  signOutText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  sizeButton: {
    alignItems: "center",
    backgroundColor: "#EEF0F5",
    borderRadius: 16,
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
  },
  sizeButtonActive: {
    backgroundColor: SIMPLE_COLORS.purple,
  },
  sizeButtonText: {
    color: SIMPLE_COLORS.muted,
    fontSize: 15,
    fontWeight: "900",
  },
  sizeButtonTextActive: {
    color: "#FFFFFF",
  },
  sizeRow: {
    flexDirection: "row",
    gap: 10,
  },
  statBox: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EAF1",
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    padding: 12,
  },
  statLabel: {
    color: SIMPLE_COLORS.muted,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 3,
  },
  statValue: {
    color: SIMPLE_COLORS.purple,
    fontSize: 22,
    fontWeight: "900",
  },
  levelChoice: {
    alignItems: "center",
    backgroundColor: "#EEF0F5",
    borderColor: "#CBD5E1",
    borderRadius: 14,
    borderWidth: 1,
    flexBasis: "47%",
    flexGrow: 1,
    minHeight: 46,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  levelChoiceActive: {
    backgroundColor: SIMPLE_COLORS.purple,
    borderColor: SIMPLE_COLORS.purple,
  },
  levelChoiceText: {
    color: SIMPLE_COLORS.text,
    fontSize: 13,
    fontWeight: "900",
  },
  levelChoiceTextActive: {
    color: "#FFFFFF",
  },
  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  summaryCard: {
    alignItems: "center",
    backgroundColor: SIMPLE_COLORS.purple,
    borderRadius: 24,
    flexDirection: "row",
    gap: 14,
    padding: 16,
  },
  summaryMeta: {
    color: "#E9D8FF",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
  },
  summaryTestMeta: {
    color: "#FDE68A",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 5,
  },
  syncMeta: {
    color: "#C4B5FD",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 5,
  },
  summaryName: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
  },
  testBadge: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  testBadgeText: {
    color: "#92400E",
    fontSize: 11,
    fontWeight: "900",
  },
  testHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  testHint: {
    color: SIMPLE_COLORS.muted,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
  },
  title: {
    color: SIMPLE_COLORS.text,
    fontSize: 28,
    fontWeight: "900",
  },
  trigger: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
});
