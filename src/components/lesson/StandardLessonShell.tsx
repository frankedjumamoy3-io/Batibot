import { Ionicons } from "@expo/vector-icons";
import { type ReactNode, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const progressValue = (safeProgressIndex / safeTotal) * 100;
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
          <PopInOnChange key={stageLabel}>
            <Text style={styles.stageText}>{stageLabel}</Text>
          </PopInOnChange>
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
            <AnimatedProgressFill color={accentColor} value={progressValue} />
          </View>
        </View>

        {onInstructionPress ? (
          <Pressable
            accessibilityLabel={`Hear instruction. ${instruction}`}
            accessibilityRole="button"
            onPress={onInstructionPress}
            style={styles.instructionSection}
          >
            <FadeInOnChange key={instruction} style={styles.instructionTextWrap}>
              <Text
                adjustsFontSizeToFit
                numberOfLines={instructionNumberOfLines}
                style={[styles.instructionText, { color: accentColor }]}
              >
                {instruction}
              </Text>
            </FadeInOnChange>
            {showInstructionIcon ? (
              <View style={[styles.instructionIcon, { backgroundColor: accentColor }]}>
                <Ionicons name="volume-high" size={19} color="#FFFFFF" />
              </View>
            ) : null}
          </Pressable>
        ) : (
          <View style={styles.instructionSection}>
            <FadeInOnChange key={instruction} style={styles.instructionTextWrap}>
              <Text
                adjustsFontSizeToFit
                numberOfLines={instructionNumberOfLines}
                style={[styles.instructionText, { color: accentColor }]}
              >
                {instruction}
              </Text>
            </FadeInOnChange>
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
            <PrimaryActionButton
              accentColor={accentColor}
              disabled={buttonDisabled}
              label={buttonLabel}
              onPress={onPrimaryAction}
              pulse={buttonPulse}
            />
          ) : (
            <View style={styles.primaryButtonSpacer} />
          )}
        </View>
      </View>
    </View>
  );
}

function AnimatedProgressFill({ color, value }: { color: string; value: number }) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(value);

  useEffect(() => {
    progress.value = reduceMotion
      ? value
      : withTiming(value, { duration: 520, easing: Easing.out(Easing.cubic) });
  }, [progress, reduceMotion, value]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${Math.max(0, Math.min(100, progress.value))}%`,
  }));

  return <Animated.View style={[styles.progressFill, { backgroundColor: color }, fillStyle]} />;
}

/** Small spring pop each time it mounts; key it by the value that changes. */
function PopInOnChange({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(reduceMotion ? 1 : 0.6);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 200 });
  }, [opacity, reduceMotion, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

/** Fade + slight slide each time it mounts; key it by the value that changes. */
function FadeInOnChange({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    progress.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) });
  }, [progress, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 6 }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

function PrimaryActionButton({
  accentColor,
  disabled,
  label,
  onPress,
  pulse,
}: {
  accentColor: string;
  disabled: boolean;
  label: StandardLessonButtonLabel;
  onPress: () => void;
  pulse: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const pressScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const enabled = useSharedValue(disabled ? 0 : 1);

  useEffect(() => {
    enabled.value = withTiming(disabled ? 0 : 1, { duration: 220 });
  }, [disabled, enabled]);

  useEffect(() => {
    if (!pulse || disabled || reduceMotion) {
      cancelAnimation(pulseScale);
      pulseScale.value = withTiming(1, { duration: 150 });
      return;
    }
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 650, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 650, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
    return () => cancelAnimation(pulseScale);
  }, [disabled, pulse, pulseScale, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.42 + enabled.value * 0.58,
    transform: [{ scale: pressScale.value * pulseScale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        pressScale.value = withSpring(0.94, { damping: 15, stiffness: 320 });
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, { damping: 10, stiffness: 260 });
      }}
      style={[
        styles.primaryButton,
        { backgroundColor: accentColor },
        pulse && !disabled && styles.primaryButtonPulse,
        animatedStyle,
      ]}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
    </AnimatedPressable>
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
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 23,
    textAlign: "center",
  },
  instructionTextWrap: {
    flex: 1,
    flexShrink: 1,
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
