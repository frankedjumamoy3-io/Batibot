import { useEffect, type PropsWithChildren } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type AnimatedLessonCardProps = PropsWithChildren<
  PressableProps & {
    delay?: number;
    entranceDistance?: number;
    pressedScale?: number;
    style?: StyleProp<ViewStyle>;
  }
>;

export function AnimatedLessonCard({
  children,
  delay = 0,
  entranceDistance = 12,
  onPressIn,
  onPressOut,
  pressedScale = 0.975,
  style,
  ...pressableProps
}: AnimatedLessonCardProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(entranceDistance);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 220 }));
    translateY.value = withDelay(
      delay,
      withSpring(0, { damping: 16, stiffness: 170 })
    );
  }, [delay, entranceDistance, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...pressableProps}
        onPressIn={(event) => {
          scale.value = withSpring(pressedScale, {
            damping: 14,
            stiffness: 220,
          });
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.value = withSpring(1, {
            damping: 14,
            stiffness: 220,
          });
          onPressOut?.(event);
        }}
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
