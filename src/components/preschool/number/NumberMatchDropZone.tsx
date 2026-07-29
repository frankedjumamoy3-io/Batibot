import { Pressable, StyleSheet } from "react-native";

import { AppleCountGrid } from "@/src/components/preschool/number/AppleCountGrid";

type NumberMatchDropZoneProps = {
  completed: boolean;
  count: number;
  onPress?: () => void;
};

export function NumberMatchDropZone({ completed, count, onPress }: NumberMatchDropZoneProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <AppleCountGrid count={count} showNumeral={completed} size={38} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    justifyContent: "center",
    marginTop: 8,
    maxHeight: 154,
    minHeight: 108,
    padding: 8,
    width: "84%",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
