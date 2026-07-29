import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Fonts, type AppTheme, createThemedStyles } from "@/constants/theme";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import {
  handleProfileImageUpload,
  removeProfileImage,
  validateProfileImage,
  type ValidProfileImageAsset,
} from "@/src/services/profileImageService";
import { logoutCurrentUser } from "@/src/presentation/viewmodels/auth-actions";
import { getLevelFromXP } from "@/src/store/gameStore";
import { useLearnerProgress } from "@/src/presentation/state/learner-progress-provider";
import { useUserSettings } from "@/src/store/user-settings";

type ProfileIconName =
  | "calendar-outline"
  | "checkmark-circle-outline"
  | "chevron-down"
  | "close"
  | "cloud-done-outline"
  | "cloud-upload-outline"
  | "contrast-outline"
  | "eye-off-outline"
  | "image-outline"
  | "log-out-outline"
  | "mic-outline"
  | "moon-outline"
  | "notifications-outline"
  | "person-outline"
  | "phone-portrait-outline"
  | "play-circle-outline"
  | "refresh-circle-outline"
  | "sunny-outline"
  | "text-outline"
  | "trail-sign-outline"
  | "trash-outline"
  | "volume-high-outline";

function ProfileIcon({
  color,
  name,
  size,
}: {
  color: string;
  name: ProfileIconName;
  size: number;
}) {
  const stroke = Math.max(1.6, size / 10);
  const thinStroke = Math.max(1.2, size / 13);
  const center = size / 2;
  const styles = StyleSheet.create({
    canvas: {
      height: size,
      position: "relative",
      width: size,
    },
    box: {
      borderColor: color,
      borderRadius: size * 0.18,
      borderWidth: stroke,
      height: size * 0.72,
      left: size * 0.14,
      position: "absolute",
      top: size * 0.14,
      width: size * 0.72,
    },
    circle: {
      borderColor: color,
      borderRadius: size,
      borderWidth: stroke,
      height: size * 0.78,
      left: size * 0.11,
      position: "absolute",
      top: size * 0.11,
      width: size * 0.78,
    },
    line: {
      backgroundColor: color,
      borderRadius: 999,
      height: stroke,
      position: "absolute",
    },
    dot: {
      backgroundColor: color,
      borderRadius: size,
      height: size * 0.17,
      position: "absolute",
      width: size * 0.17,
    },
    textMark: {
      color,
      fontFamily: Fonts.sans,
      fontSize: size * 0.68,
      fontWeight: "900",
      lineHeight: size,
      textAlign: "center",
    },
  });

  const line = (
    key: string,
    width: number,
    left: number,
    top: number,
    rotate = "0deg",
    height = stroke
  ) => (
    <View
      key={key}
      style={[
        styles.line,
        {
          height,
          left,
          top,
          transform: [{ rotate }],
          width,
        },
      ]}
    />
  );

  const circle = (scale = 0.78, left = 0.11, top = 0.11) => (
    <View
      style={[
        styles.circle,
        {
          height: size * scale,
          left: size * left,
          top: size * top,
          width: size * scale,
        },
      ]}
    />
  );

  let children: ReactNode;

  switch (name) {
    case "chevron-down":
      children = [
        line("left", size * 0.36, size * 0.23, size * 0.45, "45deg"),
        line("right", size * 0.36, size * 0.43, size * 0.45, "-45deg"),
      ];
      break;
    case "close":
      children = [
        line("one", size * 0.72, size * 0.14, size * 0.48, "45deg"),
        line("two", size * 0.72, size * 0.14, size * 0.48, "-45deg"),
      ];
      break;
    case "checkmark-circle-outline":
    case "cloud-done-outline":
      children = [
        circle(),
        line("check-one", size * 0.24, size * 0.29, size * 0.53, "45deg"),
        line("check-two", size * 0.44, size * 0.42, size * 0.47, "-45deg"),
      ];
      break;
    case "cloud-upload-outline":
      children = [
        <View key="cloud" style={[styles.box, { borderRadius: size * 0.35, top: size * 0.32 }]} />,
        line("shaft", size * 0.34, size * 0.33, size * 0.42, "-90deg"),
        line("head-l", size * 0.23, size * 0.36, size * 0.33, "-45deg"),
        line("head-r", size * 0.23, size * 0.48, size * 0.33, "45deg"),
      ];
      break;
    case "image-outline":
      children = [
        <View key="frame" style={styles.box} />,
        <View key="sun" style={[styles.dot, { left: size * 0.58, top: size * 0.28 }]} />,
        line("mountain-a", size * 0.36, size * 0.22, size * 0.62, "-42deg"),
        line("mountain-b", size * 0.36, size * 0.43, size * 0.62, "42deg"),
      ];
      break;
    case "trash-outline":
      children = [
        line("lid", size * 0.62, size * 0.19, size * 0.22),
        line("handle", size * 0.28, size * 0.36, size * 0.12),
        <View
          key="can"
          style={[
            styles.box,
            {
              borderRadius: size * 0.08,
              height: size * 0.56,
              left: size * 0.23,
              top: size * 0.32,
              width: size * 0.54,
            },
          ]}
        />,
      ];
      break;
    case "phone-portrait-outline":
      children = [
        <View key="phone" style={[styles.box, { borderRadius: size * 0.16, left: size * 0.27, width: size * 0.46 }]} />,
        line("home", size * 0.16, size * 0.42, size * 0.75, "0deg", thinStroke),
      ];
      break;
    case "person-outline":
      children = [
        circle(0.28, 0.36, 0.16),
        <View
          key="body"
          style={[
            styles.circle,
            {
              borderTopLeftRadius: size * 0.32,
              borderTopRightRadius: size * 0.32,
              height: size * 0.38,
              left: size * 0.22,
              top: size * 0.53,
              width: size * 0.56,
            },
          ]}
        />,
      ];
      break;
    case "eye-off-outline":
      children = [
        <View
          key="eye"
          style={[
            styles.circle,
            {
              borderRadius: size * 0.45,
              height: size * 0.44,
              left: size * 0.1,
              top: size * 0.28,
              width: size * 0.8,
            },
          ]}
        />,
        <View key="pupil" style={[styles.dot, { height: size * 0.2, left: size * 0.4, top: size * 0.4, width: size * 0.2 }]} />,
        line("slash", size * 0.88, size * 0.06, size * 0.5, "45deg"),
      ];
      break;
    case "calendar-outline":
      children = [
        <View key="calendar" style={styles.box} />,
        line("top", size * 0.72, size * 0.14, size * 0.34, "0deg", thinStroke),
        line("ring-l", size * 0.16, size * 0.3, size * 0.12, "90deg", thinStroke),
        line("ring-r", size * 0.16, size * 0.55, size * 0.12, "90deg", thinStroke),
      ];
      break;
    case "mic-outline":
      children = [
        <View
          key="mic"
          style={[
            styles.circle,
            {
              borderRadius: size * 0.22,
              height: size * 0.5,
              left: size * 0.36,
              top: size * 0.12,
              width: size * 0.28,
            },
          ]}
        />,
        line("stem", size * 0.28, size * 0.36, size * 0.74, "90deg"),
        line("base", size * 0.42, size * 0.29, size * 0.86),
      ];
      break;
    case "volume-high-outline":
      children = [
        <View
          key="speaker"
          style={[
            styles.box,
            {
              borderRadius: size * 0.08,
              height: size * 0.36,
              left: size * 0.1,
              top: size * 0.34,
              width: size * 0.3,
            },
          ]}
        />,
        line("wave-a", size * 0.24, size * 0.48, size * 0.41, "55deg"),
        line("wave-b", size * 0.24, size * 0.48, size * 0.58, "-55deg"),
        line("wave-c", size * 0.32, size * 0.62, size * 0.38, "55deg", thinStroke),
        line("wave-d", size * 0.32, size * 0.62, size * 0.61, "-55deg", thinStroke),
      ];
      break;
    case "notifications-outline":
      children = [
        <View
          key="bell"
          style={[
            styles.circle,
            {
              borderBottomLeftRadius: size * 0.1,
              borderBottomRightRadius: size * 0.1,
              height: size * 0.58,
              left: size * 0.24,
              top: size * 0.18,
              width: size * 0.52,
            },
          ]}
        />,
        line("bell-base", size * 0.58, size * 0.21, size * 0.76),
        <View key="clapper" style={[styles.dot, { left: size * 0.43, top: size * 0.84 }]} />,
      ];
      break;
    case "play-circle-outline":
      children = [
        circle(),
        <View
          key="play"
          style={{
            borderBottomColor: "transparent",
            borderBottomWidth: size * 0.18,
            borderLeftColor: color,
            borderLeftWidth: size * 0.28,
            borderTopColor: "transparent",
            borderTopWidth: size * 0.18,
            height: 0,
            left: size * 0.42,
            position: "absolute",
            top: size * 0.32,
            width: 0,
          }}
        />,
      ];
      break;
    case "refresh-circle-outline":
      children = [
        circle(),
        line("arrow", size * 0.44, size * 0.29, size * 0.48, "-35deg"),
        line("head", size * 0.2, size * 0.52, size * 0.34, "30deg"),
      ];
      break;
    case "log-out-outline":
      children = [
        <View key="door" style={[styles.box, { left: size * 0.12, width: size * 0.42 }]} />,
        line("exit", size * 0.48, size * 0.39, size * 0.49),
        line("exit-a", size * 0.2, size * 0.62, size * 0.38, "45deg"),
        line("exit-b", size * 0.2, size * 0.62, size * 0.6, "-45deg"),
      ];
      break;
    case "sunny-outline":
      children = [
        circle(0.34, 0.33, 0.33),
        line("ray-t", size * 0.18, size * 0.41, size * 0.11, "90deg", thinStroke),
        line("ray-b", size * 0.18, size * 0.41, size * 0.79, "90deg", thinStroke),
        line("ray-l", size * 0.18, size * 0.1, size * 0.49, "0deg", thinStroke),
        line("ray-r", size * 0.18, size * 0.72, size * 0.49, "0deg", thinStroke),
      ];
      break;
    case "moon-outline":
      children = [
        circle(),
        <View
          key="cutout"
          style={{
            backgroundColor: "transparent",
            borderColor: "transparent",
            borderLeftColor: color,
            borderLeftWidth: stroke,
            borderRadius: size,
            height: size * 0.54,
            left: size * 0.41,
            position: "absolute",
            top: size * 0.2,
            width: size * 0.34,
          }}
        />,
      ];
      break;
    case "contrast-outline":
      children = [
        circle(),
        <View
          key="half"
          style={{
            backgroundColor: color,
            borderBottomRightRadius: size,
            borderTopRightRadius: size,
            height: size * 0.52,
            left: center,
            position: "absolute",
            top: size * 0.24,
            width: size * 0.24,
          }}
        />,
      ];
      break;
    case "text-outline":
      children = <Text style={styles.textMark}>T</Text>;
      break;
    case "trail-sign-outline":
      children = [
        line("a", size * 0.62, size * 0.19, size * 0.32),
        line("b", size * 0.62, size * 0.19, size * 0.5),
        line("c", size * 0.62, size * 0.19, size * 0.68),
      ];
      break;
    default:
      children = circle();
      break;
  }

  return (
    <View accessibilityElementsHidden importantForAccessibility="no" style={styles.canvas}>
      {children}
    </View>
  );
}

function SettingToggleRow({
  description,
  icon,
  label,
  onValueChange,
  theme,
  value,
}: {
  description?: string;
  icon: ProfileIconName;
  label: string;
  onValueChange: (value: boolean) => void;
  theme: AppTheme;
  value: boolean;
}) {
  const styles = createProfileMenuStyles(theme);

  return (
    <View style={styles.settingRow}>
      <View style={styles.settingIconWrap}>
        <ProfileIcon name={icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.settingBody}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description ? <Text style={styles.settingDescription}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? "#FFFFFF" : undefined}
        trackColor={{
          false: theme.isDark ? "#334155" : "#CBD5E1",
          true: theme.colors.primary,
        }}
      />
    </View>
  );
}

function SettingChoiceGroup({
  choices,
  description,
  label,
  theme,
}: {
  choices: {
    active: boolean;
    icon?: ProfileIconName;
    id: string;
    label: string;
    onPress: () => void;
  }[];
  description?: string;
  label: string;
  theme: AppTheme;
}) {
  const styles = createProfileMenuStyles(theme);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{label}</Text>
      {description ? <Text style={styles.sectionDescription}>{description}</Text> : null}
      <View style={styles.choiceWrap}>
        {choices.map((choice) => (
          <Pressable
            key={choice.id}
            onPress={choice.onPress}
            style={[styles.choiceChip, choice.active && styles.choiceChipActive]}
          >
            {choice.icon ? (
              <ProfileIcon
                name={choice.icon}
                size={20}
                color={choice.active ? "#FFFFFF" : theme.colors.textMuted}
              />
            ) : null}
            <Text
              style={[
                styles.choiceChipText,
                choice.active && styles.choiceChipTextActive,
              ]}
            >
              {choice.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function ProfileMenu({
  compact = false,
  variant = "default",
}: {
  compact?: boolean;
  variant?: "default" | "playIcon";
}) {
  const router = useRouter();
  const { profile, user } = useCurrentUserProfile();
  const { progress, resetProgress } = useLearnerProgress();
  const {
    applyAccessibilitySettings,
    applyFontSize,
    applyTheme,
    settings,
    theme,
    updateSettings,
  } = useUserSettings();
  const insets = useSafeAreaInsets();
  const styles = createProfileMenuStyles(theme);
  const [isOpen, setIsOpen] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [pendingImageAsset, setPendingImageAsset] = useState<ValidProfileImageAsset | null>(
    null
  );
  const [profileImageBusy, setProfileImageBusy] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const displayName =
    profile?.displayName?.trim() || user?.displayName?.trim() || user?.email || "Learner";
  const initials = profile?.initials || "LE";
  const currentAvatarUri = pendingImageAsset?.uri || profile?.profileImageUrl || user?.photoURL;
  const progressResetScope = user
    ? "this signed-in account across devices"
    : "this device";
  const learningLevel = getLevelFromXP(progress.totalXp);

  useEffect(() => {
    if (!logoutPending || user) {
      return;
    }

    closeMenu();
    setLogoutPending(false);
    router.replace("/");
  }, [logoutPending, router, user]);

  useEffect(() => {
    if (!isOpen) {
      if (settings.reduceMotion) {
        animation.setValue(0);
        return;
      }

      Animated.timing(animation, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }).start();
      return;
    }

    if (settings.reduceMotion) {
      animation.setValue(1);
      return;
    }

    Animated.spring(animation, {
      damping: 18,
      mass: 0.9,
      stiffness: 210,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [animation, isOpen, settings.reduceMotion]);

  const panelAnimatedStyle = useMemo(
    () => ({
      opacity: animation,
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [-12, 0],
          }),
        },
        {
          scale: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.98, 1],
          }),
        },
      ],
    }),
    [animation]
  );

  function closeMenu() {
    setIsOpen(false);
    setPendingImageAsset(null);
  }

  function confirmResetProgress() {
    Alert.alert(
      "Reset learning progress?",
      `This will clear vocabulary views, quiz progress, badges, achievements, and notifications for ${progressResetScope}.`,
      [
        { style: "cancel", text: "Cancel" },
        {
          style: "destructive",
          text: "Reset progress",
          onPress: () => {
            resetProgress();
            closeMenu();
          },
        },
      ]
    );
  }

  async function pickProfileImage() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Photo access needed",
          "Allow photo library access so you can choose a profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
      });

      if (result.canceled || !result.assets[0]) {
        return;
      }

      setPendingImageAsset(validateProfileImage(result.assets[0]));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We could not open your photo library.";
      Alert.alert("Could not choose image", message);
    }
  }

  async function savePendingProfileImage() {
    if (!user || !pendingImageAsset) {
      return;
    }

    try {
      setProfileImageBusy(true);
      await handleProfileImageUpload(user.uid, pendingImageAsset, profile?.profileImagePath);
      setPendingImageAsset(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We could not save that profile picture.";
      Alert.alert("Upload failed", message);
    } finally {
      setProfileImageBusy(false);
    }
  }

  async function handleRemoveProfileImage() {
    try {
      setProfileImageBusy(true);
      await removeProfileImage(profile?.profileImagePath);
      setPendingImageAsset(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We could not remove that profile picture.";
      Alert.alert("Remove failed", message);
    } finally {
      setProfileImageBusy(false);
    }
  }

  function confirmRemoveProfileImage() {
    if (!profile?.profileImageUrl && !pendingImageAsset) {
      return;
    }

    if (!profile?.profileImageUrl && pendingImageAsset) {
      setPendingImageAsset(null);
      return;
    }

    Alert.alert(
      "Remove profile picture?",
      "Your avatar will switch back to your chosen learner avatar or initials.",
      [
        { style: "cancel", text: "Cancel" },
        {
          style: "destructive",
          text: "Remove",
          onPress: () => void handleRemoveProfileImage(),
        },
      ]
    );
  }

  async function handleLogout() {
    try {
      setLogoutPending(true);
      await logoutCurrentUser();
    } catch (error) {
      setLogoutPending(false);
      const message =
        error instanceof Error ? error.message : "We could not sign you out right now.";
      Alert.alert("Logout failed", message);
    } finally {
      if (!user) {
        setLogoutPending(false);
      }
    }
  }

  function confirmLogout() {
    if (Platform.OS === "web") {
      const confirmed = globalThis.confirm(
        "Are you sure you want to log out?\n\nYou will go back to the Login or Sign Up page. Your learning progress will stay saved."
      );

      if (confirmed) {
        void handleLogout();
      }

      return;
    }

    Alert.alert(
      "Are you sure you want to log out?",
      "You will go back to the Login or Sign Up page. Your learning progress will stay saved.",
      [
        { style: "cancel", text: "Cancel" },
        {
          style: "destructive",
          text: "Sign out",
          onPress: () => void handleLogout(),
        },
      ]
    );
  }

  function renderAvatar(size: "small" | "large") {
    const wrapperStyle = size === "large" ? styles.avatarLarge : styles.avatarCircle;
    const imageStyle = size === "large" ? styles.avatarLargeImage : styles.avatarSmallImage;
    const textStyle = size === "large" ? styles.avatarLargeText : styles.avatarText;
    const emojiStyle = size === "large" ? styles.avatarLargeEmoji : styles.avatarEmoji;

    if (currentAvatarUri) {
      return (
        <View style={wrapperStyle}>
          <Image contentFit="cover" source={{ uri: currentAvatarUri }} style={imageStyle} />
        </View>
      );
    }

    return (
      <View style={wrapperStyle}>
        <Text style={profile?.buddyEmoji ? emojiStyle : textStyle}>
          {profile?.buddyEmoji ?? initials}
        </Text>
      </View>
    );
  }

  return (
    <>
      <Pressable
        accessibilityLabel="Open profile settings"
        onPress={() => setIsOpen(true)}
        style={[
          styles.triggerButton,
          compact && styles.triggerButtonCompact,
          variant === "playIcon" && styles.triggerButtonPlayIcon,
        ]}
      >
        {variant === "playIcon" ? (
          <ProfileIcon name="person-outline" size={34} color="#050505" />
        ) : (
          renderAvatar("small")
        )}
        {!compact ? (
          <View style={styles.triggerCopy}>
            <Text numberOfLines={1} style={styles.triggerName}>
              {displayName}
            </Text>
            <Text style={styles.triggerMeta}>Profile</Text>
          </View>
        ) : null}
        <ProfileIcon name="chevron-down" size={16} color={theme.colors.textMuted} />
      </Pressable>

      <Modal animationType="none" onRequestClose={closeMenu} transparent visible={isOpen}>
        <View style={styles.modalRoot}>
          <Pressable onPress={closeMenu} style={styles.backdrop} />
          <Animated.View style={[styles.panel, panelAnimatedStyle]}>
            <View style={styles.panelInner}>
              <ScrollView
                contentContainerStyle={[
                  styles.panelContent,
                  {
                    paddingBottom: Math.max(24, insets.bottom + 24),
                    paddingTop: Math.max(18, insets.top + 4),
                  },
                ]}
                showsVerticalScrollIndicator
                style={styles.panelScroll}
              >
                <View style={styles.panelTopRow}>
                  <View style={styles.panelTitleGroup}>
                    <Text style={styles.panelTitle}>My Settings</Text>
                    <Text style={styles.panelSubtitle}>Big choices for easier learning.</Text>
                  </View>
                  <Pressable onPress={closeMenu} style={styles.iconButton}>
                    <ProfileIcon name="close" size={18} color={theme.colors.text} />
                  </Pressable>
                </View>

                <View style={styles.profileCard}>
                  <View style={styles.profileTopRow}>
                    {renderAvatar("large")}
                    <View style={styles.profileMeta}>
                      <Text style={styles.profileName}>{displayName}</Text>
                      <Text style={styles.profileRole}>Level {learningLevel} learner</Text>
                    </View>
                  </View>

                  <View style={styles.avatarActionRow}>
                    <Pressable onPress={() => void pickProfileImage()} style={styles.secondaryAction}>
                      <ProfileIcon
                        name={currentAvatarUri ? "image-outline" : "cloud-upload-outline"}
                        size={16}
                        color={theme.colors.secondary}
                      />
                      <Text style={styles.secondaryActionText}>
                        {currentAvatarUri ? "Change picture" : "Choose picture"}
                      </Text>
                    </Pressable>
                    {currentAvatarUri || pendingImageAsset ? (
                      <Pressable onPress={confirmRemoveProfileImage} style={styles.secondaryAction}>
                        <ProfileIcon
                          name="trash-outline"
                          size={16}
                          color={theme.colors.danger}
                        />
                        <Text style={styles.destructiveActionText}>Remove photo</Text>
                      </Pressable>
                    ) : null}
                  </View>

                  {pendingImageAsset ? (
                    <View style={styles.previewCard}>
                      <Text style={styles.previewTitle}>Selected image preview</Text>
                      <Text style={styles.previewMeta}>
                        {pendingImageAsset.fileName} • {Math.round(pendingImageAsset.fileSize / 1024)} KB
                      </Text>
                      <View style={styles.previewActionsRow}>
                        <Pressable
                          disabled={profileImageBusy}
                          onPress={() => void savePendingProfileImage()}
                          style={styles.previewSaveButton}
                        >
                          {profileImageBusy ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                          ) : (
                            <>
                              <ProfileIcon
                                name="checkmark-circle-outline"
                                size={16}
                                color="#FFFFFF"
                              />
                              <Text style={styles.previewSaveText}>Save photo</Text>
                            </>
                          )}
                        </Pressable>
                        <Pressable
                          disabled={profileImageBusy}
                          onPress={() => setPendingImageAsset(null)}
                          style={styles.previewCancelButton}
                        >
                          <Text style={styles.previewCancelText}>Cancel</Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : null}

                  <View style={styles.statRow}>
                    <View style={styles.statPill}>
                      <Text style={styles.statValue}>{learningLevel}</Text>
                      <Text numberOfLines={1} style={styles.statLabel}>
                        Level
                      </Text>
                    </View>
                    <View style={styles.statPill}>
                      <Text style={styles.statValue}>{progress.badges.length}</Text>
                      <Text numberOfLines={1} style={styles.statLabel}>
                        Badges
                      </Text>
                    </View>
                    <View style={styles.statPill}>
                      <Text style={styles.statValue}>{progress.achievements.length}</Text>
                      <Text numberOfLines={1} style={styles.statLabel}>
                        Wins
                      </Text>
                    </View>
                  </View>
                </View>

                <SettingChoiceGroup
                  choices={[
                    {
                      active: settings.theme === "light",
                      icon: "sunny-outline",
                      id: "theme-light",
                      label: "Day",
                      onPress: () => applyTheme("light"),
                    },
                    {
                      active: settings.theme === "dark",
                      icon: "moon-outline",
                      id: "theme-dark",
                      label: "Night",
                      onPress: () => applyTheme("dark"),
                    },
                    {
                      active: settings.theme === "system",
                      icon: "phone-portrait-outline",
                      id: "theme-system",
                      label: "Auto",
                      onPress: () => applyTheme("system"),
                    },
                  ]}
                  label="Screen style"
                  theme={theme}
                />

                <SettingChoiceGroup
                  choices={[
                    {
                      active: settings.accentColor === "blue",
                      id: "accent-blue",
                      label: "Blue",
                      onPress: () => updateSettings({ accentColor: "blue" }),
                    },
                    {
                      active: settings.accentColor === "purple",
                      id: "accent-purple",
                      label: "Berry",
                      onPress: () => updateSettings({ accentColor: "purple" }),
                    },
                    {
                      active: settings.accentColor === "green",
                      id: "accent-green",
                      label: "Leaf",
                      onPress: () => updateSettings({ accentColor: "green" }),
                    },
                    {
                      active: settings.accentColor === "orange",
                      id: "accent-orange",
                      label: "Sun",
                      onPress: () => updateSettings({ accentColor: "orange" }),
                    },
                  ]}
                  label="My color"
                  theme={theme}
                />

                <SettingChoiceGroup
                  choices={[
                    {
                      active: settings.fontSize !== "large",
                      id: "font-normal",
                      label: "Good",
                      onPress: () => applyFontSize("normal"),
                    },
                    {
                      active: settings.fontSize === "large",
                      id: "font-large",
                      label: "Bigger",
                      onPress: () => applyFontSize("large"),
                    },
                  ]}
                  label="Word size"
                  theme={theme}
                />

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Learning Help</Text>
                  <SettingToggleRow
                    icon="volume-high-outline"
                    label="Sounds"
                    onValueChange={(soundEnabled) => updateSettings({ soundEnabled })}
                    theme={theme}
                    value={settings.soundEnabled}
                  />
                  <SettingToggleRow
                    description="Answer by talking when a quiz allows it."
                    icon="mic-outline"
                    label="Talk answers"
                    onValueChange={(speechQuizEnabled) => updateSettings({ speechQuizEnabled })}
                    theme={theme}
                    value={settings.speechQuizEnabled}
                  />
                  <SettingToggleRow
                    description="Hear a word when its word card opens."
                    icon="play-circle-outline"
                    label="Say the word"
                    onValueChange={(autoPlayPronunciation) =>
                      updateSettings({ autoPlayPronunciation })
                    }
                    theme={theme}
                    value={settings.autoPlayPronunciation}
                  />
                  <SettingToggleRow
                    description="Show or hide the helper on learning screens."
                    icon="person-outline"
                    label="BatiBot helper"
                    onValueChange={(showFloatingBatiBot) =>
                      updateSettings({ showFloatingBatiBot })
                    }
                    theme={theme}
                    value={settings.showFloatingBatiBot}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Make It Easy</Text>
                  <SettingToggleRow
                    description="Make words extra large everywhere."
                    icon="text-outline"
                    label="Big words"
                    onValueChange={(largerText) =>
                      applyAccessibilitySettings({ largerText })
                    }
                    theme={theme}
                    value={settings.largerText}
                  />
                  <SettingToggleRow
                    description="Use fewer moving effects."
                    icon="trail-sign-outline"
                    label="Calm moves"
                    onValueChange={(reduceMotion) =>
                      applyAccessibilitySettings({ reduceMotion })
                    }
                    theme={theme}
                    value={settings.reduceMotion}
                  />
                  <SettingToggleRow
                    description="Make text and buttons stand out more."
                    icon="contrast-outline"
                    label="Strong colors"
                    onValueChange={(highContrast) =>
                      applyAccessibilitySettings({ highContrast })
                    }
                    theme={theme}
                    value={settings.highContrast}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Grown-up Actions</Text>
                  <Text style={styles.sectionDescription}>These need an extra check before they happen.</Text>
                  <Pressable onPress={confirmResetProgress} style={styles.actionRow}>
                    <ProfileIcon
                      name="refresh-circle-outline"
                      size={24}
                      color={theme.colors.danger}
                    />
                    <View style={styles.settingBody}>
                      <Text style={styles.settingLabel}>Reset progress</Text>
                      <Text style={styles.settingDescription}>
                        Clear learning records for {progressResetScope}.
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable
                    disabled={logoutPending}
                    onPress={confirmLogout}
                    style={[styles.actionRow, styles.logoutRow]}
                  >
                    <ProfileIcon
                      name="log-out-outline"
                      size={24}
                      color={theme.colors.danger}
                    />
                    <View style={styles.settingBody}>
                      <Text style={styles.settingLabel}>Sign out</Text>
                      <Text style={styles.settingDescription}>
                        Go back to Login or Sign Up.
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

function createProfileMenuStyles(theme: AppTheme) {
  return createThemedStyles(theme, {
    actionRow: {
      alignItems: "center",
      backgroundColor: theme.colors.backgroundAccent,
      borderRadius: 20,
      flexDirection: "row",
      gap: 12,
      minHeight: 74,
      padding: 16,
    },
    avatarActionRow: {
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 14,
    },
    avatarCircle: {
      alignItems: "center",
      backgroundColor: theme.colors.surfaceSky,
      borderRadius: 999,
      height: 36,
      justifyContent: "center",
      overflow: "hidden",
      width: 36,
    },
    avatarEmoji: {
      fontSize: 24,
      lineHeight: 28,
    },
    avatarLarge: {
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: 30,
      height: 68,
      justifyContent: "center",
      overflow: "hidden",
      width: 68,
    },
    avatarLargeImage: {
      height: "100%",
      width: "100%",
    },
    avatarLargeEmoji: {
      fontSize: 42,
      lineHeight: 50,
    },
    avatarLargeText: {
      color: "#FFFFFF",
      fontFamily: Fonts.rounded,
      fontSize: 26,
      fontWeight: "900",
    },
    avatarSmallImage: {
      height: "100%",
      width: "100%",
    },
    avatarText: {
      color: theme.colors.secondary,
      fontFamily: Fonts.rounded,
      fontSize: 14,
      fontWeight: "900",
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    choiceChip: {
      alignItems: "center",
      backgroundColor: theme.colors.backgroundAccent,
      borderColor: theme.colors.border,
      borderRadius: 20,
      borderWidth: 1,
      flexGrow: 1,
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      minHeight: 58,
      minWidth: 102,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    choiceChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    choiceChipText: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "800",
    },
    choiceChipTextActive: {
      color: "#FFFFFF",
    },
    choiceWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 12,
    },
    destructiveActionText: {
      color: theme.colors.danger,
      fontSize: 13,
      fontWeight: "800",
    },
    detailLine: {
      color: theme.colors.textMuted,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 18,
    },
    iconButton: {
      alignItems: "center",
      backgroundColor: theme.colors.backgroundAccent,
      borderRadius: 999,
      height: 44,
      justifyContent: "center",
      width: 44,
    },
    inlineProfileDetails: {
      backgroundColor: theme.colors.backgroundAccent,
      borderRadius: 16,
      gap: 6,
      marginTop: 12,
      padding: 12,
    },
    logoutRow: {
      backgroundColor: theme.colors.dangerSurface,
    },
    modalRoot: {
      backgroundColor: theme.colors.overlay,
      flex: 1,
    },
    panel: {
      backgroundColor: theme.colors.surface,
      borderRadius: 26,
      bottom: 16,
      left: 16,
      maxWidth: 430,
      overflow: "hidden",
      position: "absolute",
      right: 16,
      top: 16,
    },
    panelInner: {
      flex: 1,
    },
    panelContent: {
      gap: 22,
      paddingHorizontal: 20,
    },
    panelScroll: {
      flex: 1,
    },
    panelTitle: {
      color: theme.colors.text,
      fontFamily: Fonts.rounded,
      fontSize: 28,
      fontWeight: "900",
    },
    panelSubtitle: {
      color: theme.colors.textMuted,
      fontSize: 15,
      fontWeight: "700",
      lineHeight: 20,
      marginTop: 3,
    },
    panelTitleGroup: {
      flex: 1,
      paddingRight: 12,
    },
    panelTopRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    previewActionsRow: {
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 12,
    },
    previewCancelButton: {
      backgroundColor: theme.colors.surfaceSky,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    previewCancelText: {
      color: theme.colors.secondary,
      fontSize: 13,
      fontWeight: "800",
    },
    previewCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 18,
      marginTop: 14,
      padding: 14,
    },
    previewMeta: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 4,
    },
    previewSaveButton: {
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: 999,
      flexDirection: "row",
      gap: 8,
      justifyContent: "center",
      minWidth: 112,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    previewSaveText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "800",
    },
    previewTitle: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: "800",
    },
    profileCard: {
      ...theme.shadow,
      backgroundColor: theme.colors.backgroundAccent,
      borderRadius: 24,
      padding: 18,
    },
    profileEmail: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 6,
    },
    profileMeta: {
      flex: 1,
    },
    profileName: {
      color: theme.colors.text,
      fontFamily: Fonts.rounded,
      fontSize: 24,
      fontWeight: "900",
    },
    profileRole: {
      color: theme.colors.primary,
      fontSize: 15,
      fontWeight: "800",
      marginTop: 4,
    },
    profileTopRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
    },
    secondaryAction: {
      alignItems: "center",
      alignSelf: "flex-start",
      flexDirection: "row",
      gap: 10,
      marginTop: 14,
    },
    secondaryActionText: {
      color: theme.colors.secondary,
      fontSize: 15,
      fontWeight: "800",
    },
    section: {
      gap: 12,
    },
    sectionDescription: {
      color: theme.colors.textMuted,
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 20,
      marginTop: -2,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontFamily: Fonts.rounded,
      fontSize: 22,
      fontWeight: "900",
    },
    settingBody: {
      flex: 1,
    },
    settingDescription: {
      color: theme.colors.textMuted,
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 20,
      marginTop: 4,
    },
    settingIconWrap: {
      alignItems: "center",
      backgroundColor: theme.colors.surfaceMint,
      borderRadius: 18,
      height: 50,
      justifyContent: "center",
      width: 50,
    },
    settingLabel: {
      color: theme.colors.text,
      fontSize: 17,
      fontWeight: "800",
    },
    settingRow: {
      alignItems: "center",
      backgroundColor: theme.colors.backgroundAccent,
      borderRadius: 20,
      flexDirection: "row",
      gap: 12,
      minHeight: 74,
      padding: 16,
    },
    statLabel: {
      color: theme.colors.textSoft,
      fontSize: 12,
      fontWeight: "800",
      marginTop: 4,
      textAlign: "center",
      textTransform: "uppercase",
    },
    statPill: {
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      flex: 1,
      justifyContent: "center",
      minHeight: 82,
      minWidth: 96,
      paddingHorizontal: 10,
      paddingVertical: 12,
    },
    statRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 16,
    },
    statValue: {
      color: theme.colors.text,
      fontFamily: Fonts.rounded,
      fontSize: 22,
      fontWeight: "900",
      textAlign: "center",
    },
    syncNotice: {
      alignItems: "flex-start",
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: "row",
      gap: 9,
      marginTop: 14,
      padding: 12,
    },
    syncNoticeText: {
      color: theme.colors.textMuted,
      flex: 1,
      fontSize: 12,
      fontWeight: "700",
      lineHeight: 17,
    },
    triggerButton: {
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 999,
      borderWidth: 1,
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    triggerButtonCompact: {
      paddingHorizontal: 8,
      paddingVertical: 8,
    },
    triggerButtonPlayIcon: {
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderColor: "rgba(255,255,255,0.72)",
      borderRadius: 999,
      borderWidth: 0,
      height: 48,
      justifyContent: "center",
      paddingHorizontal: 0,
      paddingVertical: 0,
      width: 48,
    },
    triggerCopy: {
      maxWidth: 118,
    },
    triggerMeta: {
      color: theme.colors.textSoft,
      fontSize: 11,
      fontWeight: "700",
      marginTop: 2,
    },
    triggerName: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: "800",
    },
  });
}
