import { useEffect } from "react";
import { type PropsWithChildren } from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type AnimatedScreenWrapperProps = PropsWithChildren<{
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
}>;

/**
 * Entrance transition for screens and lesson stages: fade, slide up and a subtle
 * spring scale. Remount (e.g. change `key`) to replay it on stage changes.
 */
export function AnimatedScreenWrapper({
  children,
  delay = 0,
  distance = 14,
  style,
}: AnimatedScreenWrapperProps) {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : distance);
  const scale = useSharedValue(reduceMotion ? 1 : 0.97);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = withTiming(1, { duration: 120 });
      translateY.value = 0;
      scale.value = 1;
      return;
    }
    opacity.value = withDelay(delay, withTiming(1, { duration: 280, easing: Easing.out(Easing.quad) }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 360, easing: Easing.out(Easing.cubic) }));
    scale.value = withDelay(delay, withSpring(1, { damping: 16, mass: 0.8, stiffness: 170 }));
    return () => {
      cancelAnimation(opacity);
      cancelAnimation(translateY);
      cancelAnimation(scale);
    };
  }, [delay, opacity, reduceMotion, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
