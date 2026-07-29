import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

type AnimatedTopicProgressTrackProps = {
  completedTopics: number;
  duration?: number;
  previousCompletedTopics: number;
  totalTopics: number;
};

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function AnimatedTopicProgressTrack({
  completedTopics,
  duration = 760,
  previousCompletedTopics,
  totalTopics,
}: AnimatedTopicProgressTrackProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const safeTotal = Math.max(1, totalTopics);
  const fromRatio = clamp(previousCompletedTopics / safeTotal);
  const toRatio = clamp(completedTopics / safeTotal);
  const progress = useRef(new Animated.Value(fromRatio)).current;

  useEffect(() => {
    progress.setValue(fromRatio);
    Animated.timing(progress, {
      duration,
      easing: Easing.out(Easing.cubic),
      toValue: toRatio,
      useNativeDriver: false,
    }).start();
  }, [duration, fromRatio, progress, toRatio]);

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, trackWidth],
  });
  const markerLeft = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(0, trackWidth - 24)],
  });

  return (
    <View style={styles.wrap}>
      <View
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        style={styles.track}
      >
        <Animated.View style={[styles.fill, { width: fillWidth }]} />
        <Animated.View style={[styles.marker, { left: markerLeft }]} />
        <View style={styles.flag}>
          <Ionicons name="flag" size={28} color="#EF1F3B" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    backgroundColor: "#681BF2",
    borderRadius: 999,
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
  },
  flag: {
    bottom: 10,
    position: "absolute",
    right: -2,
  },
  marker: {
    backgroundColor: "#681BF2",
    borderColor: "#681BF2",
    borderRadius: 999,
    borderWidth: 3,
    height: 28,
    position: "absolute",
    top: -8,
    width: 28,
  },
  track: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    height: 13,
    justifyContent: "center",
    overflow: "visible",
    width: "100%",
  },
  wrap: {
    paddingRight: 12,
    width: "82%",
  },
});
