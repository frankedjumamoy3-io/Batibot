import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type AnimatedButtonProps = PressableProps & {
  containerStyle?: StyleProp<ViewStyle>;
  pressedScale?: number;
};

export function AnimatedButton({
  children,
  containerStyle,
  onPressIn,
  onPressOut,
  pressedScale = 1.08,
  ...pressableProps
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[containerStyle, animatedStyle]}>
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
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
