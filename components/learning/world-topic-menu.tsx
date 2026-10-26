import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedButton } from "@/components/animation/animated-button";
import { BatiBotAssetImage } from "@/components/assets/batibot-asset-image";
import { resolveTopicAssetForTitle } from "@/src/services/assets/assetResolver";

export interface WorldTopicMenuItem {
  title: string;
  label: string;
  completed: boolean;
  unlocked: boolean;
  completedSteps: number;
  started: boolean;
}

export function WorldTopicMenu({ title, worldId, topics, onChooseTopic, onClose }: {
  title: string; worldId: string; topics: WorldTopicMenuItem[];
  onChooseTopic: (index: number) => void; onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Choose your next adventure</Text>
        </View>
        <AnimatedButton accessibilityRole="button" accessibilityLabel="Close topic list" onPress={onClose} style={styles.close}>
          <Ionicons name="close" size={28} color="#FFF" />
        </AnimatedButton>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}>
        {topics.map((topic, index) => {
          const status = !topic.unlocked ? "Locked" : topic.completed ? "Play again" : topic.started ? "Continue" : "Let's play";
          return (
            <AnimatedButton key={topic.title} accessibilityRole="button" accessibilityLabel={`${topic.label}. ${status}`}
              accessibilityState={{ disabled: !topic.unlocked }} disabled={!topic.unlocked}
              containerStyle={styles.cardContainer} pressedScale={0.98}
              style={[styles.card, !topic.unlocked && styles.locked, topic.completed && styles.completed]}
              onPress={() => onChooseTopic(index)}>
              <BatiBotAssetImage asset={resolveTopicAssetForTitle(worldId, topic.title)} hideLabel hideComingSoonLabel
                style={styles.art} placeholderStyle={styles.art} />
              <View style={styles.copy}>
                <Text style={styles.label}>{topic.label}</Text>
                <Text style={styles.status}>{status}</Text>
                <View accessibilityLabel={`${topic.completedSteps} of 8 steps completed`} style={styles.track}>
                  <View style={[styles.fill, { width: `${Math.min(100, topic.completedSteps / 8 * 100)}%` }]} />
                </View>
              </View>
              <Ionicons name={!topic.unlocked ? "lock-closed" : topic.completed ? "checkmark-circle" : "play-circle"} size={28} color="#FFF" />
            </AnimatedButton>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", paddingHorizontal: 16 },
  header: { width: "100%", maxWidth: 480, flexDirection: "row", alignItems: "center", gap: 12, padding: 16, marginBottom: 16, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.94)" },
  heading: { flex: 1 }, title: { color: "#24134B", fontSize: 26, fontWeight: "900" },
  subtitle: { color: "#37235A", fontSize: 15, fontWeight: "600", marginTop: 4 },
  close: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#32135C", alignItems: "center", justifyContent: "center" },
  scroll: { flex: 1, width: "100%", maxWidth: 480 }, list: { gap: 16, paddingTop: 4, paddingHorizontal: 4 },
  cardContainer: { width: "100%", flexShrink: 0 },
  card: { minHeight: 116, borderRadius: 24, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#6B21F2", borderWidth: 3, borderColor: "#A887FF" },
  completed: { borderColor: "#12D68A" }, locked: { backgroundColor: "#75628F", borderColor: "#A69AB9" },
  art: { width: 76, height: 76 }, copy: { flex: 1, minWidth: 0 },
  label: { color: "#FFF", fontSize: 20, fontWeight: "800" }, status: { color: "#F0E7FF", fontSize: 14, fontWeight: "600", marginTop: 4 },
  track: { height: 6, borderRadius: 3, backgroundColor: "#4D18AF", marginTop: 10, overflow: "hidden" },
  fill: { height: 6, borderRadius: 3, backgroundColor: "#FFD761" },
});
