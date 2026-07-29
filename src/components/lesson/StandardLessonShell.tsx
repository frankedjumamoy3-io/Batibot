import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";

export type LessonStageLabel =
  | "LOOK"
  | "TAP"
  | "TRY"
  | "CHOOSE"
  | "PLAY"
  | "CHALLENGE"
  | "REWARD"
  | "PROGRESS"
  | "MASTERY";

export type LessonFeedbackType =
  | "success"
  | "wrong"
  | "timeout"
  | "limit";

export type StandardLessonButtonLabel = "Next" | "Done" | "Reward";

export type StandardLessonShellProps = {
  stageLabel: LessonStageLabel;
  progressIndex: number;
  totalStages: number;
  instruction: string;
  feedbackMessage?: string | null;
  feedbackType?: LessonFeedbackType | null;
  buttonLabel?: StandardLessonButtonLabel;
  buttonDisabled?: boolean;
  buttonVisible?: boolean;
  onClose: () => void;
  onPrimaryAction: () => void;
  children: ReactNode;
  accentColor?: string;
  buttonPulse?: boolean;
  contentScrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  instructionNumberOfLines?: number;
  onInstructionPress?: () => void;
  panelStyle?: StyleProp<ViewStyle>;
  showInstructionIcon?: boolean;
};

const DEFAULT_ACCENT = "#681BF2";

export function StandardLessonShell({
  accentColor = DEFAULT_ACCENT,
  buttonDisabled = false,
  buttonLabel = "Next",
  buttonPulse = false,
  buttonVisible = true,
  children,
  contentScrollable = false,
  contentStyle,
  containerStyle,
  feedbackMessage,
  feedbackType,
  instruction,
  instructionNumberOfLines = 2,
  onClose,
  onInstructionPress,
  onPrimaryAction,
  panelStyle,
  progressIndex,
  showInstructionIcon = true,
  stageLabel,
  totalStages,
}: StandardLessonShellProps) {
  const safeTotal = Math.max(1, totalStages);
  const safeProgressIndex = Math.max(1, Math.min(progressIndex, safeTotal));
  const progressPercent = `${Math.round((safeProgressIndex / safeTotal) * 100)}%` as ViewStyle["width"];
  const feedbackColor = getFeedbackColor(feedbackType, accentColor);

  const content = contentScrollable ? (
    <ScrollView
      alwaysBounceVertical={false}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
      style={styles.contentArea}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.contentArea, styles.content, { pointerEvents: "box-none" }, contentStyle]}>{children}</View>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.stageHeader}>
        <View style={[styles.stagePill, { backgroundColor: accentColor }]}>
          <Text style={styles.stageText}>{stageLabel}</Text>
        </View>
        <Pressable
          accessibilityLabel="Close lesson"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={30} color="#FFF6C7" />
        </Pressable>
      </View>

      <View style={[styles.panel, { borderColor: accentColor }, panelStyle]}>
        <View style={styles.progressSection}>
          <Text style={[styles.progressText, { color: accentColor }]}>
            {safeProgressIndex}/{safeTotal}
          </Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: accentColor, width: progressPercent },
              ]}
            />
          </View>
        </View>

        {onInstructionPress ? (
          <Pressable
            accessibilityLabel={`Hear instruction. ${instruction}`}
            accessibilityRole="button"
            onPress={onInstructionPress}
            style={styles.instructionSection}
          >
            <Text
              adjustsFontSizeToFit
              numberOfLines={instructionNumberOfLines}
              style={[styles.instructionText, { color: accentColor }]}
            >
              {instruction}
            </Text>
            {showInstructionIcon ? (
              <View style={[styles.instructionIcon, { backgroundColor: accentColor }]}>
                <Ionicons name="volume-high" size={19} color="#FFFFFF" />
              </View>
            ) : null}
          </Pressable>
        ) : (
          <View style={styles.instructionSection}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={instructionNumberOfLines}
              style={[styles.instructionText, { color: accentColor }]}
            >
              {instruction}
            </Text>
          </View>
        )}

        {content}

        <View style={[styles.feedbackSection, { pointerEvents: "none" }]}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[styles.feedbackText, { color: feedbackColor }]}
          >
            {feedbackMessage ?? ""}
          </Text>
        </View>

        <View style={styles.buttonSection}>
          {buttonVisible ? (
            <Pressable
              accessibilityRole="button"
              disabled={buttonDisabled}
              onPress={onPrimaryAction}
              style={[
                styles.primaryButton,
                { backgroundColor: accentColor },
                buttonDisabled && styles.primaryButtonDisabled,
                buttonPulse && styles.primaryButtonPulse,
              ]}
            >
              <Text style={styles.primaryButtonText}>{buttonLabel}</Text>
            </Pressable>
          ) : (
            <View style={styles.primaryButtonSpacer} />
          )}
        </View>
      </View>
    </View>
  );
}

function getFeedbackColor(
  feedbackType: LessonFeedbackType | null | undefined,
  accentColor: string
) {
  if (feedbackType === "wrong" || feedbackType === "timeout" || feedbackType === "limit") {
    return "#D9462F";
  }

  return accentColor;
}

const styles = StyleSheet.create({
  buttonSection: {
    alignItems: "center",
    elevation: 2,
    flexShrink: 0,
    justifyContent: "center",
    minHeight: 66,
    paddingTop: 8,
    width: "100%",
    zIndex: 2,
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: "#2A114E",
    borderRadius: 999,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  container: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: 0,
    width: "100%",
  },
  contentArea: {
    flex: 1,
    minHeight: 0,
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    minHeight: 0,
    paddingBottom: 10,
    width: "100%",
  },
  feedbackSection: {
    alignItems: "center",
    flexShrink: 0,
    justifyContent: "center",
    minHeight: 32,
    paddingHorizontal: 8,
    width: "100%",
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22,
    minHeight: 22,
    textAlign: "center",
  },
  instructionIcon: {
    alignItems: "center",
    borderRadius: 999,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  instructionSection: {
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    flexShrink: 0,
    gap: 8,
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 6,
    paddingTop: 8,
  },
  instructionText: {
    flex: 1,
    flexShrink: 1,
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 23,
    textAlign: "center",
  },
  panel: {
    backgroundColor: "#DCEFD9",
    borderRadius: 14,
    borderWidth: 4,
    flex: 1,
    maxWidth: 360,
    minHeight: 0,
    padding: 14,
    width: "100%",
  },
  primaryButton: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 18,
    elevation: 3,
    justifyContent: "center",
    minHeight: 54,
    paddingHorizontal: 34,
    width: "70%",
    zIndex: 3,
  },
  primaryButtonDisabled: {
    opacity: 0.42,
  },
  primaryButtonPulse: {
    shadowColor: DEFAULT_ACCENT,
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  primaryButtonSpacer: {
    minHeight: 54,
    width: "70%",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  progressFill: {
    borderRadius: 999,
    height: "100%",
  },
  progressSection: {
    flexShrink: 0,
    marginBottom: 6,
    width: "100%",
  },
  progressText: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },
  progressTrack: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    height: 14,
    overflow: "hidden",
    width: "86%",
  },
  stageHeader: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 0,
    gap: 16,
    justifyContent: "center",
    marginBottom: 10,
    maxWidth: 360,
    width: "100%",
  },
  stagePill: {
    alignItems: "center",
    borderRadius: 16,
    flex: 1,
    height: 50,
    justifyContent: "center",
    maxWidth: 230,
  },
  stageText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});
