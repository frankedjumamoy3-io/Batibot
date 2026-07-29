import { useEffect } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface AnimatedMascotProps {
  message?: string;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedMascot({
  message = "Ready for a quest?",
  style,
}: AnimatedMascotProps) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 700 }),
        withTiming(0, { duration: 700 })
      ),
      -1,
      true
    );
  }, [translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={[styles.wrap, style]}>
      <Animated.Text style={[styles.face, animatedStyle]}>🤖</Animated.Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  face: {
    fontSize: 48,
  },
  message: {
    color: "#132033",
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 22,
  },
  wrap: {
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 22,
    flexDirection: "row",
    gap: 12,
    padding: 16,
  },
});
