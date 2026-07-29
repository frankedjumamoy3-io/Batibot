import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import type { LessonFeedbackType } from "@/src/components/lesson/StandardLessonShell";

type StageRetryNoticeProps = {
  feedbackType?: LessonFeedbackType | null;
  message?: string | null;
};

export function StageRetryNotice({
  feedbackType,
  message,
}: StageRetryNoticeProps) {
  if (!message || feedbackType === "success") {
    return null;
  }

  const isLimit = feedbackType === "limit";

  return (
    <View style={[styles.notice, isLimit && styles.limitNotice]}>
      <Ionicons
        name={isLimit ? "refresh-circle" : "alert-circle"}
        size={24}
        color={isLimit ? "#681BF2" : "#D9462F"}
      />
      <Text style={[styles.text, isLimit && styles.limitText]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  limitNotice: {
    borderColor: "#681BF2",
  },
  limitText: {
    color: "#681BF2",
  },
  notice: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D9462F",
    borderRadius: 14,
    borderWidth: 3,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 10,
    maxWidth: 280,
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: "86%",
  },
  text: {
    color: "#D9462F",
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },
});
