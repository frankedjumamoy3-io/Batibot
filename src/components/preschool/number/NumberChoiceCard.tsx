import { useEffect, useRef } from "react";
import { Animated, PanResponder, Pressable, StyleSheet, Text } from "react-native";

import type { NumberChoice } from "@/src/data/preschoolNumberVillage";

type NumberChoiceCardProps = {
  choice: NumberChoice;
  disabled?: boolean;
  onPress: (choice: NumberChoice) => void;
  showLabel?: boolean;
};

export function NumberChoiceCard({
  choice,
  disabled = false,
  onPress,
  showLabel = true,
}: NumberChoiceCardProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const disabledRef = useRef(disabled);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        !disabledRef.current && Math.abs(gesture.dx) + Math.abs(gesture.dy) > 8,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        const traveled = Math.abs(gesture.dx) + Math.abs(gesture.dy);

        Animated.spring(pan, {
          friction: 6,
          tension: 80,
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();

        if (!disabledRef.current && traveled > 70) {
          onPress(choice);
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.wrap, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <Pressable
        accessibilityLabel={showLabel ? `${choice.numeral}, ${choice.label}` : `${choice.numeral}`}
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => onPress(choice)}
        style={({ pressed }) => [
          styles.card,
          disabled && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.numeral}>
          {choice.numeral}
        </Text>
        {showLabel ? (
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.label}>
            {choice.label}
          </Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    justifyContent: "center",
    minHeight: 104,
    padding: 8,
    width: "100%",
  },
  disabled: {
    opacity: 0.72,
  },
  label: {
    color: "#681BF2",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },
  numeral: {
    color: "#050505",
    fontSize: 54,
    fontWeight: "900",
    lineHeight: 62,
    textAlign: "center",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  wrap: {
    width: "44%",
  },
});
