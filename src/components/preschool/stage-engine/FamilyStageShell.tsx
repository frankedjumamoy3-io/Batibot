import type { ReactNode } from "react";
import {
  ImageBackground,
  type ImageSourcePropType,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  StandardLessonShell,
  type LessonFeedbackType,
  type LessonStageLabel,
  type StandardLessonButtonLabel,
} from "@/src/components/lesson/StandardLessonShell";

type FamilyStageShellProps = {
  actionLabel: string;
  backgroundImage: ImageSourcePropType;
  buttonPulse?: boolean;
  canProceed: boolean;
  children: ReactNode;
  feedbackMessage?: string | null;
  feedbackType?: LessonFeedbackType | null;
  instruction?: string;
  onClose: () => void;
  onProceed: () => void;
  progressIndex: number;
  stageName: string;
  totalStages?: number;
};

export function FamilyStageShell({
  actionLabel,
  backgroundImage,
  buttonPulse = false,
  canProceed,
  children,
  feedbackMessage,
  feedbackType,
  instruction = "",
  onClose,
  onProceed,
  progressIndex,
  stageName,
  totalStages = 5,
}: FamilyStageShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.background}>
      <View style={[styles.page, { paddingBottom: insets.bottom + 18, paddingTop: insets.top + 18 }]}>
        <StandardLessonShell
          buttonDisabled={!canProceed}
          buttonLabel={toStandardButtonLabel(actionLabel)}
          buttonPulse={buttonPulse}
          contentScrollable
          feedbackMessage={feedbackMessage}
          feedbackType={feedbackType}
          instruction={instruction}
          onClose={onClose}
          onPrimaryAction={onProceed}
          progressIndex={progressIndex}
          stageLabel={toStageLabel(stageName)}
          totalStages={totalStages}
        >
          {children}
        </StandardLessonShell>
      </View>
    </ImageBackground>
  );
}

function toStageLabel(stageName: string): LessonStageLabel {
  const normalized = stageName.toUpperCase();

  if (normalized === "MASTERY") {
    return "MASTERY";
  }

  if (normalized === "STAR") {
    return "REWARD";
  }

  if (
    normalized === "LOOK" ||
    normalized === "TAP" ||
    normalized === "TRY" ||
    normalized === "CHOOSE" ||
    normalized === "PLAY" ||
    normalized === "CHALLENGE" ||
    normalized === "REWARD" ||
    normalized === "PROGRESS" ||
    normalized === "MASTERY" ||
    normalized === "MASTERED"
  ) {
    return normalized === "MASTERED" ? "MASTERY" : normalized;
  }

  return "LOOK";
}

function toStandardButtonLabel(actionLabel: string): StandardLessonButtonLabel {
  const normalized = actionLabel.trim().toLowerCase();

  if (normalized === "reward") {
    return "Reward";
  }

  if (normalized === "done" || normalized === "finish" || normalized === "claim" || normalized === "continue") {
    return "Done";
  }

  return "Next";
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  page: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 14,
  },
});
