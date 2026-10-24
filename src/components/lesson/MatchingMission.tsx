import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { playLessonCue } from "@/src/services/audioService";

export type MissionPair = { id: string; left: string; right: string };

export function MatchingMission({ pairs, onComplete }: { pairs: MissionPair[]; onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [message, setMessage] = useState("Tap an item, then its match.");
  const right = matched.length === pairs.length ? pairs : [...pairs.slice(1), ...pairs.slice(0, 1)];

  function match(id: string) {
    if (!selected || matched.includes(id)) return;
    if (selected !== id) { setMessage("Try another match."); playLessonCue("retry"); return; }
    const next = [...matched, id];
    setMatched(next); setSelected(null);
    setMessage(next.length === pairs.length ? "You matched them all!" : "Great match!");
    playLessonCue(next.length === pairs.length ? "complete" : "correct");
    if (next.length === pairs.length) onComplete();
  }

  return <View style={styles.wrap}>
    <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>
    <Text style={styles.message}>Matched {matched.length} of {pairs.length}</Text>
    <View style={styles.board}>
      <View style={styles.column}>{pairs.map(pair => <Pressable key={pair.id} accessibilityRole="button" accessibilityLabel={pair.left} accessibilityState={{ selected: selected === pair.id, disabled: matched.includes(pair.id) }} disabled={matched.includes(pair.id)} onPress={() => { setSelected(pair.id); playLessonCue("tap"); }} style={[styles.card, selected === pair.id && styles.selected, matched.includes(pair.id) && styles.matched]}><Text style={styles.label}>{pair.left}{matched.includes(pair.id) ? " ✓" : ""}</Text></Pressable>)}</View>
      <View style={styles.column}>{right.map(pair => <Pressable key={pair.id} accessibilityRole="button" accessibilityLabel={pair.right} disabled={!selected || matched.includes(pair.id)} onPress={() => match(pair.id)} style={[styles.card, matched.includes(pair.id) && styles.matched]}><Text style={styles.label}>{pair.right}{matched.includes(pair.id) ? " ✓" : ""}</Text></Pressable>)}</View>
    </View>
  </View>;
}
const styles = StyleSheet.create({
  wrap: { width: "100%", gap: 10 }, board: { flexDirection: "row", gap: 12 }, column: { flex: 1, gap: 10 },
  card: { backgroundColor: "#FFFFFF", borderColor: "#C4B5FD", borderWidth: 2, borderRadius: 14, minHeight: 64, padding: 12, justifyContent: "center" },
  selected: { backgroundColor: "#EDE9FE", borderColor: "#7C3AED" }, matched: { backgroundColor: "#DCFCE7", borderColor: "#16A34A" },
  label: { color: "#4C1D95", fontWeight: "800", textAlign: "center", fontSize: 16 }, message: { color: "#4C1D95", textAlign: "center", fontWeight: "700" },
});
