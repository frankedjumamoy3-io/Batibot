import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface AnimatedAchievementCardProps {
  description: string;
  icon?: string;
  title: string;
}

export function AnimatedAchievementCard({
  description,
  icon = "🏅",
  title,
}: AnimatedAchievementCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(14);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 240 });
    translateY.value = withSpring(0, { damping: 14, stiffness: 180 });
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EAF1",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    padding: 18,
  },
  description: {
    color: "#9AA3B8",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 3,
  },
  icon: {
    fontSize: 30,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#F3EAFE",
    borderRadius: 18,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  title: {
    color: "#132033",
    fontSize: 18,
    fontWeight: "900",
  },
});
