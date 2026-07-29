import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BatibotAssetCard } from "@/components/common/BatibotAssetCard";
import { MultiSectionTapStage } from "@/src/components/kinder/common/MultiSectionTapStage";
import type { PreschoolStageWorldTopic } from "@/src/data/preschoolStageWorldTypes";
import { playLearningSound } from "@/src/services/audioService";
import {
  getCurriculumMeaning,
  getCurriculumMeaningSpeech,
} from "@/src/services/curriculumMeaningService";
import { speak } from "@/src/services/speechService";

type TapStageProps = {
  grade?: string;
  onTapped: () => void;
  topic: PreschoolStageWorldTopic;
  worldId?: string;
};

export function TapStage({ grade, onTapped, topic, worldId }: TapStageProps) {
  const [revealed, setRevealed] = useState(false);
  const soundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealedText = getCurriculumMeaning({
    gradeLevel: grade,
    topicLabel: topic.label,
    worldId: worldId ?? "",
  });

  useEffect(() => {
    return () => {
      if (soundTimeoutRef.current) {
        clearTimeout(soundTimeoutRef.current);
      }
    };
  }, []);

  if (topic.tap.slides?.length) {
    return (
      <MultiSectionTapStage
        minimumDelayMs={0}
        onComplete={onTapped}
        slides={topic.tap.slides}
        topicLabel={topic.label}
        grade={grade}
        worldId={worldId}
      />
    );
  }

  function handleTap() {
    if (soundTimeoutRef.current) {
      clearTimeout(soundTimeoutRef.current);
    }

    speak(getCurriculumMeaningSpeech({
      gradeLevel: grade,
      topicLabel: topic.label,
      worldId: worldId ?? "",
    }));
    setRevealed(true);
    onTapped();

    if (topic.tap.sound) {
      const estimatedSpeechMs = Math.min(
        2200,
        Math.max(900, topic.tap.speech.split(/\s+/).length * 360)
      );

      soundTimeoutRef.current = setTimeout(
        () => playLearningSound(topic.tap.sound),
        estimatedSpeechMs
      );
    }
  }

  return (
    <View style={styles.wrap}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.title}>
        {topic.label}
      </Text>
      <Pressable
        accessibilityLabel={`Hear about ${topic.label}`}
        accessibilityRole="imagebutton"
        onPress={handleTap}
        style={({ pressed }) => [styles.imageCard, pressed && styles.pressed]}
      >
        {topic.tap.symbol ? (
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.heroSymbol}>
            {topic.tap.symbol}
          </Text>
        ) : null}
        <BatibotAssetCard
          fallbackMode="iconLabel"
          grade={grade}
          label={topic.label}
          showLabel={false}
          size={topic.tap.symbol ? "medium" : "large"}
          source={topic.tap.image}
          tags={[topic.id, topic.label, revealedText]}
          topic={topic.label}
          world={worldId}
        />
      </Pressable>
      {revealed ? (
        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.meaning}>
          {revealedText}
        </Text>
      ) : (
        <View style={styles.meaningSpace} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heroSymbol: {
    color: "#681BF2",
    fontSize: 42,
    fontWeight: "900",
    marginBottom: 4,
    textAlign: "center",
    width: "100%",
  },
  imageCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 210,
    padding: 12,
    width: "92%",
  },
  meaning: {
    color: "#681BF2",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 14,
    textAlign: "center",
  },
  meaningSpace: {
    height: 42,
    marginTop: 14,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  title: {
    color: "#681BF2",
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 12,
    maxWidth: "100%",
    textAlign: "center",
  },
  wrap: {
    alignItems: "center",
    width: "100%",
  },
});
