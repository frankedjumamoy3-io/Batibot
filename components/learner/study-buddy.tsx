import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Fonts, StudyBuddyShadow, StudyBuddyTheme } from "@/constants/theme";

type BuddyMood = "encourage" | "celebrate" | "think";

interface StudyBuddyProps {
  title: string;
  message: string;
  accentColor?: string;
  bubbleColor?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  mood?: BuddyMood;
  compact?: boolean;
}

function getMoodIcon(mood: BuddyMood): keyof typeof Ionicons.glyphMap {
  switch (mood) {
    case "celebrate":
      return "star";
    case "think":
      return "bulb";
    default:
      return "heart";
  }
}

export function StudyBuddy({
  title,
  message,
  accentColor = StudyBuddyTheme.colors.primary,
  bubbleColor = StudyBuddyTheme.colors.surface,
  actionLabel,
  onActionPress,
  mood = "encourage",
  compact = false,
}: StudyBuddyProps) {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: -7,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => {
      loop.stop();
    };
  }, [bob]);

  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <View style={[styles.bubble, { backgroundColor: bubbleColor }]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        {actionLabel && onActionPress ? (
          <Pressable style={styles.action} onPress={onActionPress}>
            <Text style={styles.actionText}>{actionLabel}</Text>
            <Ionicons name="arrow-forward" size={14} color={accentColor} />
          </Pressable>
        ) : null}
        <View style={[styles.tail, { backgroundColor: bubbleColor }]} />
      </View>

      <Animated.View
        style={[
          styles.mascotWrap,
          compact && styles.mascotWrapCompact,
          { transform: [{ translateY: bob }] },
        ]}
      >
        <View style={[styles.ear, styles.earLeft, { backgroundColor: accentColor }]} />
        <View style={[styles.ear, styles.earRight, { backgroundColor: accentColor }]} />
        <View style={[styles.head, { backgroundColor: accentColor }]}>
          <View style={styles.eyeRow}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
          <View style={styles.smile} />
        </View>
        <View style={styles.body}>
          <Ionicons
            name={getMoodIcon(mood)}
            size={compact ? 18 : 22}
            color={accentColor}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 14,
  },
  rowCompact: {
    gap: 10,
  },
  bubble: {
    ...StudyBuddyShadow,
    borderRadius: StudyBuddyTheme.radii.lg,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: "relative",
  },
  title: {
    color: StudyBuddyTheme.colors.primaryDark,
    fontFamily: Fonts.rounded,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  message: {
    color: StudyBuddyTheme.colors.text,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
    marginTop: 6,
  },
  action: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },
  actionText: {
    color: StudyBuddyTheme.colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  tail: {
    borderBottomLeftRadius: 6,
    height: 16,
    position: "absolute",
    right: -6,
    top: "62%",
    transform: [{ rotate: "28deg" }],
    width: 16,
  },
  mascotWrap: {
    alignItems: "center",
    width: 96,
  },
  mascotWrapCompact: {
    width: 78,
  },
  ear: {
    borderRadius: 999,
    height: 16,
    position: "absolute",
    top: 2,
    width: 16,
  },
  earLeft: {
    left: 16,
  },
  earRight: {
    right: 16,
  },
  head: {
    alignItems: "center",
    borderRadius: 999,
    height: 68,
    justifyContent: "center",
    marginTop: 10,
    width: 68,
  },
  eyeRow: {
    flexDirection: "row",
    gap: 12,
  },
  eye: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  smile: {
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: 3,
    borderLeftColor: "transparent",
    borderLeftWidth: 2,
    borderRadius: 999,
    borderRightColor: "transparent",
    borderRightWidth: 2,
    height: 10,
    marginTop: 8,
    width: 24,
  },
  body: {
    ...StudyBuddyShadow,
    alignItems: "center",
    backgroundColor: StudyBuddyTheme.colors.surface,
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    marginTop: -8,
    width: 52,
  },
});
