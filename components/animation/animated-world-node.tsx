import { useEffect, type PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type AnimatedWorldNodeProps = PropsWithChildren<
  PressableProps & {
    accentColor: string;
    emoji: string;
    isCurrent?: boolean;
    isLocked?: boolean;
    label: string;
    style?: StyleProp<ViewStyle>;
  }
>;

export function AnimatedWorldNode({
  accentColor,
  emoji,
  isCurrent = false,
  isLocked = false,
  label,
  onPressIn,
  onPressOut,
  style,
  ...pressableProps
}: AnimatedWorldNodeProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!isCurrent) {
      translateY.value = withTiming(0, { duration: 180 });
      return;
    }

    translateY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 620 }),
        withTiming(0, { duration: 620 })
      ),
      -1,
      true
    );
  }, [isCurrent, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: isLocked ? 0.55 : 1,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        {...pressableProps}
        onPressIn={(event) => {
          scale.value = withSpring(1.08, { damping: 12, stiffness: 220 });
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.value = withSpring(1, { damping: 12, stiffness: 220 });
          onPressOut?.(event);
        }}
        style={[styles.node, { backgroundColor: accentColor }]}
      >
        <Text style={styles.emoji}>{isLocked ? "🔒" : emoji}</Text>
        <Text numberOfLines={2} style={styles.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  emoji: {
    fontSize: 32,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 15,
    marginTop: 6,
    textAlign: "center",
  },
  node: {
    alignItems: "center",
    borderRadius: 22,
    height: 96,
    justifyContent: "center",
    padding: 10,
    width: 96,
  },
});
