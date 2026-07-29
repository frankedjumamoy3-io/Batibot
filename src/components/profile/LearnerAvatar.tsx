import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getAvatarOptionByAssetKey, getAvatarOptionById } from "@/src/data/avatarOptions";

type LearnerAvatarProfile = {
  avatarAssetKey?: string | null;
  avatarId?: string | null;
  buddyEmoji?: string | null;
  displayName?: string | null;
  name?: string | null;
  profileImageUrl?: string | null;
  profilePhotoUrl?: string | null;
};

type LearnerAvatarProps = {
  editable?: boolean;
  onPress?: () => void;
  profile?: LearnerAvatarProfile | null;
  size?: "small" | "medium" | "large";
};

const AVATAR_SIZE = {
  small: 44,
  medium: 70,
  large: 104,
};

function getInitials(profile?: LearnerAvatarProfile | null) {
  const source = profile?.displayName?.trim() || profile?.name?.trim() || "Learner";
  const parts = source.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export function LearnerAvatar({
  editable = false,
  onPress,
  profile,
  size = "medium",
}: LearnerAvatarProps) {
  const dimension = AVATAR_SIZE[size];
  const photoUrl = profile?.profilePhotoUrl ?? profile?.profileImageUrl ?? null;
  const avatarSource =
    getAvatarOptionByAssetKey(profile?.avatarAssetKey)?.localSource ??
    getAvatarOptionById(profile?.avatarId)?.localSource ??
    null;
  const content = (
    <View
      style={[
        styles.avatar,
        {
          borderRadius: dimension / 2,
          height: dimension,
          width: dimension,
        },
      ]}
    >
      {photoUrl ? (
        <Image
          accessibilityIgnoresInvertColors
          contentFit="cover"
          source={{ uri: photoUrl }}
          style={styles.image}
        />
      ) : avatarSource ? (
        <Image
          accessibilityIgnoresInvertColors
          contentFit="contain"
          source={avatarSource}
          style={styles.image}
        />
      ) : profile?.buddyEmoji ? (
        <Text style={[styles.emoji, { fontSize: dimension * 0.44 }]}>
          {profile.buddyEmoji}
        </Text>
      ) : (
        <Text style={[styles.initials, { fontSize: dimension * 0.28 }]}>
          {getInitials(profile)}
        </Text>
      )}
      {editable ? (
        <View style={styles.editBadge}>
          <Ionicons name="camera" size={13} color="#FFFFFF" />
        </View>
      ) : null}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#8B5CF6",
    borderWidth: 2,
    justifyContent: "center",
    overflow: "hidden",
  },
  editBadge: {
    alignItems: "center",
    backgroundColor: "#681BF2",
    borderColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 1,
    bottom: 2,
    height: 24,
    justifyContent: "center",
    position: "absolute",
    right: 2,
    width: 24,
  },
  emoji: {
    textAlign: "center",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  initials: {
    color: "#681BF2",
    fontWeight: "900",
    textAlign: "center",
  },
});
