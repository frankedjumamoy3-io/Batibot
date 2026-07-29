import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TryAgainSectionProps = {
  message?: string;
  onTryAgain: () => void;
};

export function TryAgainSection({
  message = "Try Again",
  onTryAgain,
}: TryAgainSectionProps) {
  return (
    <Pressable
      accessibilityLabel={message}
      accessibilityRole="button"
      onPress={onTryAgain}
      style={styles.card}
    >
      <Text style={styles.title}>{message}</Text>
      <View style={styles.iconButton}>
        <Ionicons name="return-down-back" size={42} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#681BF2",
    borderRadius: 14,
    borderWidth: 4,
    gap: 20,
    justifyContent: "center",
    marginTop: 12,
    maxWidth: 280,
    minHeight: 170,
    paddingHorizontal: 24,
    paddingVertical: 22,
    width: "86%",
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "#32105F",
    borderRadius: 12,
    justifyContent: "center",
    minHeight: 58,
    minWidth: 76,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    color: "#681BF2",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
});
