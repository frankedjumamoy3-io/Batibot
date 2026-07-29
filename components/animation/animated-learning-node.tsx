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
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type AnimatedLearningNodeProps = PropsWithChildren<
  PressableProps & {
    active?: boolean;
    locked?: boolean;
    style?: StyleProp<ViewStyle>;
  }
>;

export function AnimatedLearningNode({
  active = false,
  children,
  locked = false,
  onPress,
  onPressIn,
  onPressOut,
  style,
  ...pressableProps
}: AnimatedLearningNodeProps) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!active || locked) {
      translateY.value = withTiming(0, { duration: 160 });
      return;
    }

    translateY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 900 }),
        withTiming(0, { duration: 900 })
      ),
      -1,
      false
    );
  }, [active, locked, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...pressableProps}
        onPress={(event) => {
          if (locked) {
            translateX.value = withSequence(
              withTiming(-6, { duration: 45 }),
              withTiming(6, { duration: 70 }),
              withTiming(0, { duration: 60 })
            );
          }

          onPress?.(event);
        }}
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
