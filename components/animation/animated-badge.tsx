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
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type AnimatedBadgeProps = PropsWithChildren<
  PressableProps & {
    delay?: number;
    focused?: boolean;
    unlocked?: boolean;
    style?: StyleProp<ViewStyle>;
  }
>;

export function AnimatedBadge({
  children,
  delay = 0,
  focused = false,
  onPressIn,
  onPressOut,
  style,
  unlocked = false,
  ...pressableProps
}: AnimatedBadgeProps) {
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0.94);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 220 }));
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 14, stiffness: 170 })
    );

    if (focused || unlocked) {
      rotate.value = withDelay(
        delay + 120,
        withSequence(
          withTiming(-2, { duration: 80 }),
          withTiming(2, { duration: 110 }),
          withTiming(0, { duration: 90 })
        )
      );
    }
  }, [delay, focused, opacity, rotate, scale, unlocked]);

  useEffect(() => {
    if (!focused) {
      return;
    }

    scale.value = withRepeat(
      withSequence(
        withSpring(1.03, { damping: 12, stiffness: 150 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      ),
      4,
      false
    );
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...pressableProps}
        onPressIn={(event) => {
          scale.value = withSpring(0.96, { damping: 14, stiffness: 220 });
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.value = withSpring(1, { damping: 14, stiffness: 220 });
          onPressOut?.(event);
        }}
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
