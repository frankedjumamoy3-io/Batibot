import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface AnimatedRewardChestProps {
  coins?: number;
  stars?: number;
  xp?: number;
}

export function AnimatedRewardChest({
  coins = 10,
  stars = 3,
  xp = 50,
}: AnimatedRewardChestProps) {
  const scale = useSharedValue(0.92);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.12, { damping: 9, stiffness: 180 }),
      withSpring(1, { damping: 12, stiffness: 180 })
    );
    rotate.value = withSequence(
      withTiming(-5, { duration: 80 }),
      withTiming(5, { duration: 110 }),
      withTiming(0, { duration: 90 })
    );
  }, [rotate, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <View style={styles.wrap}>
      <Animated.Text style={[styles.chest, animatedStyle]}>🎁</Animated.Text>
      <View style={styles.rewardRow}>
        <Text style={styles.reward}>⭐ {stars}</Text>
        <Text style={styles.reward}>🪙 {coins}</Text>
        <Text style={styles.reward}>⚡ {xp} XP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chest: {
    fontSize: 58,
    textAlign: "center",
  },
  reward: {
    color: "#7C2EF2",
    fontSize: 15,
    fontWeight: "900",
  },
  rewardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 8,
  },
  wrap: {
    alignItems: "center",
    backgroundColor: "#F8F1FF",
    borderRadius: 22,
    padding: 18,
  },
});
