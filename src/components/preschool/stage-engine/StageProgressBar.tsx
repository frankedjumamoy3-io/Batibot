import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export function StageProgressBar({ progress }: { progress: number }) {
  const width = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(width, {
      duration: 220,
      toValue: progress,
      useNativeDriver: false,
    }).start();
  }, [progress, width]);

  return (
    <View style={styles.track}>
      <Animated.View
        style={[
          styles.fill,
          {
            width: width.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    backgroundColor: "#681BF2",
    borderRadius: 999,
    height: "100%",
  },
  track: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    height: 12,
    overflow: "hidden",
    width: "100%",
  },
});
