import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { speakText } from "@/src/services/speechService";

type TappableReadingTextProps = {
  text: string;
  grade?: "grade1" | "grade2" | "grade3";
  gradeLevel?: "grade2" | "grade3";
  onWordPress?: (word: string) => void;
  highlightWord?: string | null;
  speakEnabled?: boolean;
};

export function TappableReadingText({
  grade,
  gradeLevel,
  highlightWord,
  onWordPress,
  speakEnabled = true,
  text,
}: TappableReadingTextProps) {
  const [localHighlight, setLocalHighlight] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeHighlight = highlightWord ?? localHighlight;
  const resolvedGrade = grade ?? gradeLevel ?? "grade2";
  const tokens = text.match(/\S+\s*/g) ?? [];

  return (
    <View accessibilityLabel={text} style={styles.wrap}>
      {tokens.map((token, index) => {
        const word = cleanWord(token);
        const highlighted = Boolean(word && activeHighlight === word);

        return (
          <Pressable
            accessibilityLabel={word ? `Hear ${word}` : undefined}
            accessibilityRole="button"
            disabled={!word}
            key={`${token}-${index}`}
            onPress={() => {
              if (!word) {
                return;
              }

              onWordPress?.(word);
              setLocalHighlight(word);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              timeoutRef.current = setTimeout(() => setLocalHighlight(null), 650);
              if (speakEnabled) {
                void speakText(word, { grade: resolvedGrade });
              }
            }}
            style={[styles.wordWrap, highlighted && styles.wordHighlight]}
          >
            <Text style={styles.word}>{token}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function cleanWord(value: string) {
  return value.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
}

const styles = StyleSheet.create({
  word: {
    color: "#1F2937",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 25,
  },
  wordHighlight: {
    backgroundColor: "#FDE68A",
  },
  wordWrap: {
    borderRadius: 7,
    paddingHorizontal: 2,
  },
  wrap: {
    alignContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
