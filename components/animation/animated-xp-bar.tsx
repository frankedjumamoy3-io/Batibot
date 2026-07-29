import { useEffect } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface AnimatedXPBarProps {
  label?: string;
  progress: number;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedXPBar({ label, progress, style }: AnimatedXPBarProps) {
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(Math.max(0, Math.min(progress, 100)), {
      duration: 520,
    });
  }, [fill, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fill.value}%`,
  }));

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    backgroundColor: "#7C2EF2",
    borderRadius: 999,
    height: "100%",
  },
  label: {
    color: "#132033",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
  },
  track: {
    backgroundColor: "#E8DDFE",
    borderRadius: 999,
    height: 12,
    overflow: "hidden",
  },
  wrap: {
    width: "100%",
  },
});
