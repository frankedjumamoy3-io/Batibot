import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { StageVisualSet } from "@/src/components/kinder/common/StageVisualSet";
import type { PreschoolTapLessonSlide } from "@/src/data/preschoolStageWorldTypes";
import {
  getCurriculumMeaning,
  getCurriculumMeaningSpeech,
} from "@/src/services/curriculumMeaningService";
import { speak } from "@/src/services/speechService";

type MultiSectionTapStageProps = {
  grade?: string;
  minimumDelayMs?: number;
  onComplete: () => void;
  slides: PreschoolTapLessonSlide[];
  topicLabel: string;
  worldId?: string;
};

export function MultiSectionTapStage({
  grade,
  minimumDelayMs = 5000,
  onComplete,
  slides,
  topicLabel,
  worldId,
}: MultiSectionTapStageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tappedSlideIds, setTappedSlideIds] = useState<string[]>([]);
  const [completeNotified, setCompleteNotified] = useState(false);
  const currentSlide = slides[currentIndex] ?? slides[0];
  const currentTapped = tappedSlideIds.includes(currentSlide.id);
  const allSlidesTapped = slides.every((slide) => tappedSlideIds.includes(slide.id));
  const currentMeaning = getCurriculumMeaning({
    gradeLevel: grade,
    topicLabel: currentSlide?.title ?? topicLabel,
    worldId: worldId ?? "",
  });

  useEffect(() => {
    setCurrentIndex(0);
    setTappedSlideIds([]);
    setCompleteNotified(false);
  }, [slides]);

  useEffect(() => {
    if (!allSlidesTapped || completeNotified) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setCompleteNotified(true);
      onComplete();
    }, minimumDelayMs);

    return () => clearTimeout(timeout);
  }, [allSlidesTapped, completeNotified, minimumDelayMs, onComplete]);

  if (!currentSlide) {
    return null;
  }

  function handleTap() {
    speak(getCurriculumMeaningSpeech({
      gradeLevel: grade,
      topicLabel: currentSlide.title,
      worldId: worldId ?? "",
    }));
    setTappedSlideIds((current) =>
      current.includes(currentSlide.id) ? current : [...current, currentSlide.id]
    );
  }

  function goNext() {
    if (!currentTapped) {
      return;
    }

    setCurrentIndex((current) => Math.min(slides.length - 1, current + 1));
  }

  function goPrevious() {
    setCurrentIndex((current) => Math.max(0, current - 1));
  }

  return (
    <View style={styles.wrap}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.title}>
        {currentSlide.title}
      </Text>
      <View style={styles.dots}>
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
              tappedSlideIds.includes(slide.id) && styles.dotSeen,
            ]}
          />
        ))}
      </View>
      <View style={styles.cardRow}>
        {currentIndex > 0 ? (
          <ArrowButton direction="back" onPress={goPrevious} />
        ) : (
          <View style={styles.arrowSpace} />
        )}
        <Pressable
          accessibilityLabel={`Hear ${topicLabel}`}
          accessibilityRole="imagebutton"
          onPress={handleTap}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <StageVisualSet
            compact={currentSlide.visuals.length > 4}
            grade={grade}
            topic={topicLabel}
            visuals={currentSlide.visuals}
            world={worldId}
          />
        </Pressable>
        {currentIndex < slides.length - 1 ? (
          <ArrowButton disabled={!currentTapped} direction="forward" onPress={goNext} />
        ) : (
          <View style={styles.arrowSpace} />
        )}
      </View>
      {currentTapped ? (
        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.text}>
          {currentMeaning}
        </Text>
      ) : (
        <View style={styles.textSpace} />
      )}
    </View>
  );
}

function ArrowButton({
  direction,
  disabled = false,
  onPress,
}: {
  direction: "back" | "forward";
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.arrow, disabled && styles.arrowDisabled]}
    >
      <Ionicons
        color="#FFFFFF"
        name={direction === "forward" ? "chevron-forward" : "chevron-back"}
        size={21}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  arrow: {
    alignItems: "center",
    backgroundColor: "#681BF2",
    borderRadius: 999,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  arrowDisabled: {
    opacity: 0.35,
  },
  arrowSpace: {
    width: 34,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 156,
    padding: 12,
    width: "70%",
  },
  cardRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
  },
  dot: {
    backgroundColor: "#9CA3AF",
    borderRadius: 999,
    height: 11,
    width: 11,
  },
  dotActive: {
    backgroundColor: "#10B981",
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  dotSeen: {
    borderColor: "#10B981",
    borderWidth: 2,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: "#681BF2",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 12,
    textAlign: "center",
  },
  textSpace: {
    height: 42,
    marginTop: 12,
  },
  title: {
    color: "#681BF2",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "center",
  },
  wrap: {
    alignItems: "center",
    width: "100%",
  },
});
