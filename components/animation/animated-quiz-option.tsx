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
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type QuizOptionFeedback = "idle" | "correct" | "wrong";

type AnimatedQuizOptionProps = PropsWithChildren<
  PressableProps & {
    feedback?: QuizOptionFeedback;
    style?: StyleProp<ViewStyle>;
  }
>;

export function AnimatedQuizOption({
  children,
  feedback = "idle",
  onPressIn,
  onPressOut,
  style,
  ...pressableProps
}: AnimatedQuizOptionProps) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (feedback === "correct") {
      scale.value = withSequence(
        withSpring(1.035, { damping: 10, stiffness: 210 }),
        withSpring(1, { damping: 12, stiffness: 180 })
      );
      return;
    }

    if (feedback === "wrong") {
      translateX.value = withSequence(
        withTiming(-7, { duration: 45 }),
        withTiming(7, { duration: 70 }),
        withTiming(-5, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    }
  }, [feedback, scale, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...pressableProps}
        onPressIn={(event) => {
          scale.value = withSpring(0.975, {
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
