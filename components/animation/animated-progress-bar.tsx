import { useEffect } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type AnimatedProgressBarProps = {
  fillStyle?: StyleProp<ViewStyle>;
  progress: number;
  style?: StyleProp<ViewStyle>;
  trackStyle?: StyleProp<ViewStyle>;
};

export function AnimatedProgressBar({
  fillStyle,
  progress,
  style,
  trackStyle,
}: AnimatedProgressBarProps) {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(Math.max(0, Math.min(progress, 100)), {
      duration: 500,
    });
  }, [animatedProgress, progress]);

  const fillAnimatedStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value}%`,
  }));

  return (
    <View style={style}>
      <View style={trackStyle}>
        <Animated.View style={[fillStyle, fillAnimatedStyle]} />
      </View>
    </View>
  );
}
