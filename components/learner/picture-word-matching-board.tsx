import { Ionicons } from "@expo/vector-icons";
import { useMemo, useRef, useState } from "react";
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";

import { BatiBotAssetImage } from "@/components/assets/batibot-asset-image";
import { resolveAsset } from "@/src/services/assets/assetResolver";
import { playLessonCue } from "@/src/services/audioService";
import { speakText } from "@/src/services/speechService";

type Pair = { imageLabel: string; word: string };
type Props = {
  pairs: Pair[];
  words: string[];
  matched: Record<string, string>;
  disabled: boolean;
  onMatch: (picture: string, word: string) => boolean;
};

function PictureCard({ pair, done, selected, disabled, onSelect, onDrop }: {
  pair: Pair; done: boolean; selected: boolean; disabled: boolean;
  onSelect: () => void; onDrop: (x: number, y: number) => void;
}) {
  const position = useRef(new Animated.ValueXY()).current;
  const [dragging, setDragging] = useState(false);
  const latest = useRef({ disabled, done, onSelect, onDrop });
  latest.current = { disabled, done, onSelect, onDrop };
  // Keep one responder throughout a drag; selection rerenders must not reset
  // its gesture coordinates before the release event.
  const responder = useMemo(() => {
    const reset = () => {
      setDragging(false);
      Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    };
    return PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        !latest.current.disabled && !latest.current.done && (Math.abs(gesture.dx) > 8 || Math.abs(gesture.dy) > 8),
      onPanResponderGrant: () => { setDragging(true); latest.current.onSelect(); },
      onPanResponderMove: (_, gesture) => position.setValue({ x: gesture.dx, y: gesture.dy }),
      onPanResponderRelease: (_, gesture) => { latest.current.onDrop(gesture.moveX, gesture.moveY); reset(); },
      onPanResponderTerminate: reset,
      // Keep the board's scroll container from stealing an active drag.
      onPanResponderTerminationRequest: () => false,
    });
  }, [position]);

  return (
    <Animated.View {...responder.panHandlers} style={[
      styles.pictureSlot,
      { transform: position.getTranslateTransform(), zIndex: dragging ? 10 : 0 },
    ]}>
      <Pressable
        accessibilityLabel={`${pair.imageLabel}${done ? ", matched" : " picture"}`}
        accessibilityHint="Tap to select, then tap its word. You can also drag the picture."
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || done, selected }}
        disabled={disabled || done}
        onPress={onSelect}
        style={[styles.picture, selected && styles.selected, done && styles.matched]}
      >
        <View pointerEvents="none" style={styles.image}>
          <BatiBotAssetImage
            asset={resolveAsset({ topic: pair.imageLabel, worldId: "grade1-word-kingdom", stage: "PLAY" })}
            hideLabel
            style={styles.imageContent}
            imageStyle={styles.imageContent}
          />
        </View>
        {done ? <Ionicons style={styles.check} name="checkmark-circle" size={24} color="#15803D" /> : null}
      </Pressable>
    </Animated.View>
  );
}

export function PictureWordMatchingBoard({ pairs, words, matched, disabled, onMatch }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const targetRefs = useRef<Record<string, View | null>>({});
  const busy = useRef(false);
  const count = Object.keys(matched).length;
  const instruction = "Tap a picture, then its word. You can drag it too.";

  function attempt(picture: string, word: string) {
    if (disabled || matched[picture] || Object.values(matched).includes(word) || busy.current) return;
    busy.current = true;
    try {
      const correct = onMatch(picture, word);
      playLessonCue(correct ? "correct" : "retry");
      if (correct) setSelected(null);
    } finally {
      busy.current = false;
    }
  }

  function drop(picture: string, x: number, y: number) {
    // Measure at release: scrolling and rotation can invalidate onLayout bounds.
    words.forEach((word) => targetRefs.current[word]?.measureInWindow((left, top, width, height) => {
      if (x >= left && x <= left + width && y >= top && y <= top + height) attempt(picture, word);
    }));
  }

  return (
    <View style={styles.board}>
      <View style={styles.heading}>
        <Text accessibilityLiveRegion="polite" style={styles.progress}>{count} of {pairs.length} matched</Text>
        <Pressable
          accessibilityRole="button" accessibilityLabel="Hear matching instructions"
          onPress={() => void speakText(instruction, { grade: "grade1" })} style={styles.speaker}
        >
          <Ionicons name="volume-high" size={25} color="#6D28D9" />
        </Pressable>
      </View>
      <Text style={styles.instruction}>{selected ? "Now tap the matching word." : "Tap a picture, then its word."}</Text>
      <View style={styles.grid}>
        {pairs.map((pair) => <PictureCard
          key={pair.imageLabel} pair={pair} done={Boolean(matched[pair.imageLabel])}
          selected={selected === pair.imageLabel} disabled={disabled}
          onSelect={() => { setSelected(pair.imageLabel); playLessonCue("tap"); void speakText(pair.imageLabel, { grade: "grade1" }); }}
          onDrop={(x, y) => drop(pair.imageLabel, x, y)}
        />)}
      </View>
      <View style={styles.grid}>
        {words.map((word) => {
          const filled = Object.values(matched).includes(word);
          return (
            <View key={word} ref={(node) => { targetRefs.current[word] = node; }} collapsable={false} style={styles.wordSlot}>
              <Pressable
                accessibilityLabel={`${word}${filled ? ", matched" : ""}`}
                accessibilityRole="button" accessibilityState={{ disabled: disabled || filled }}
                disabled={disabled || filled}
                onPress={() => { if (selected) attempt(selected, word); else void speakText(word, { grade: "grade1" }); }}
                style={[styles.word, filled && styles.matched]}
              >
                <Text style={styles.wordText}>{word}</Text>
                {filled ? <Ionicons name="checkmark-circle" size={20} color="#15803D" /> : null}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: { width: "100%", maxWidth: 420, alignSelf: "center", gap: 10, padding: 4 },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  progress: { color: "#6D28D9", fontSize: 16, fontWeight: "800", flexShrink: 1 },
  speaker: { minWidth: 48, minHeight: 48, alignItems: "center", justifyContent: "center", borderRadius: 24, backgroundColor: "#EDE9FE" },
  instruction: { color: "#5B21B6", textAlign: "center", fontSize: 15, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10 },
  pictureSlot: { width: "48%" },
  picture: { height: 92, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: "#C4B5FD", borderRadius: 18 },
  image: { width: "90%", height: 80 },
  imageContent: { width: "100%", height: "100%" },
  selected: { borderColor: "#7C3AED", backgroundColor: "#EDE9FE", borderWidth: 3 },
  matched: { borderColor: "#22C55E", backgroundColor: "#F0FDF4", borderStyle: "solid" },
  check: { position: "absolute", top: 6, right: 6 },
  wordSlot: { width: "48%" },
  word: { minHeight: 52, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center", padding: 8, borderRadius: 16, borderWidth: 2, borderStyle: "dashed", borderColor: "#8B5CF6", backgroundColor: "#FFFFFF" },
  wordText: { color: "#5B21B6", fontSize: 17, fontWeight: "800", flexShrink: 1, textAlign: "center" },
});
