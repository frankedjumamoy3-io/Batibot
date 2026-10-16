import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BatiBotAssetImage } from "@/components/assets/batibot-asset-image";
import { kindergartenStageWorlds } from "@/src/data/kindergartenStageWorlds";
import { allTopics, allWorlds } from "@/src/data/learning-content";
import { useCurrentLearner } from "@/src/hooks/useCurrentLearner";
import { APP_ROUTES } from "@/src/navigation/routes";
import { KindergartenStageWorldScreen } from "@/src/screens/kindergarten/KindergartenStageWorldScreen";
import { AnimalAdventureScreen } from "@/src/screens/preschool/animal/AnimalAdventureScreen";
import { BodyWorldScreen } from "@/src/screens/preschool/body/BodyWorldScreen";
import { ColorfulWorldScreen } from "@/src/screens/preschool/colorful/ColorfulWorldScreen";
import { FamilyWorldScreen } from "@/src/screens/preschool/family/FamilyWorldScreen";
import { FoodTownScreen } from "@/src/screens/preschool/food/FoodTownScreen";
import { FruitGardenScreen } from "@/src/screens/preschool/fruit/FruitGardenScreen";
import { NumberVillageScreen } from "@/src/screens/preschool/number/NumberVillageScreen";
import { ShapeKingdomScreen } from "@/src/screens/preschool/shapes/ShapeKingdomScreen";
import { simpleStyles as baseStyles } from "@/src/screens/simple/simple-batibot.styles";
import { resolvePlayBackgroundSource, resolveTopicAssetForTitle } from "@/src/services/assets/assetResolver";
import { gradeLevelToLearnerGradeLabel } from "@/src/utils/gradeUtils";
import {
  getTopicsForWorld,
  isTopicUnlocked,
  isWorldUnlocked,
} from "@/src/utils/learningProgressUtils";
import { playTapFeedback } from "@/src/services/soundEffectsService";

function getParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default function WorldTopicsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ worldId?: string | string[] }>();
  const worldId = getParamValue(params.worldId);
  const { learner, loading, error } = useCurrentLearner();

  if (loading) {
    return <StateScreen message="Loading topics..." />;
  }

  if (error || !learner) {
    console.error(error);
    return <StateScreen message="We could not load this page. Please try again." />;
  }

  const world = allWorlds.find((item) => item.id === worldId);
  const background = resolvePlayBackgroundSource(
    gradeLevelToLearnerGradeLabel(learner.gradeLevel)
  );

  if (!world || world.gradeLevel !== learner.gradeLevel) {
    return (
      <StateScreen
        background={background}
        message="This world is not available for your grade."
      />
    );
  }

  if (!isWorldUnlocked(world, learner)) {
    return (
      <StateScreen
        background={background}
        message="This world is locked. Finish the world before it first."
      />
    );
  }

  if (world.gradeLevel === "preschool") {
    if (world.id === "preschool-family-world") {
      return <FamilyWorldScreen />;
    }

    if (world.id === "preschool-body-world") {
      return <BodyWorldScreen />;
    }

    if (world.id === "preschool-colorful-world") {
      return <ColorfulWorldScreen />;
    }

    if (world.id === "preschool-shape-kingdom") {
      return <ShapeKingdomScreen />;
    }

    if (world.id === "preschool-animal-adventure") {
      return <AnimalAdventureScreen />;
    }

    if (world.id === "preschool-fruit-garden") {
      return <FruitGardenScreen />;
    }

    if (world.id === "preschool-food-town") {
      return <FoodTownScreen />;
    }

    if (world.id === "preschool-number-village") {
      return <NumberVillageScreen />;
    }
  }

  if (world.gradeLevel === "kindergarten") {
    const kindergartenConfig =
      kindergartenStageWorlds[world.id as keyof typeof kindergartenStageWorlds];

    if (kindergartenConfig) {
      return <KindergartenStageWorldScreen config={kindergartenConfig} />;
    }
  }

  const topics = getTopicsForWorld(allTopics, world.id);

  return (
    <View style={baseStyles.page}>
      <ImageBackground source={background} resizeMode="cover" style={styles.background}>
        <ScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 132, paddingTop: insets.top + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Back to Play"
              accessibilityRole="button"
              onPress={() => {
                void playTapFeedback();
                router.replace(APP_ROUTES.tabs.play);
              }}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
            <View style={styles.headerText}>
              <Text numberOfLines={2} style={styles.title}>
                {world.title}
              </Text>
              <Text numberOfLines={2} style={styles.subtitle}>
                Choose a topic to play.
              </Text>
            </View>
          </View>

          {topics.length ? (
            <View style={styles.topicList}>
              {topics.map((topic) => {
                const unlocked = isTopicUnlocked(topic, learner);
                const asset = resolveTopicAssetForTitle(world.id, topic.title);

                return (
                  <Pressable
                    key={topic.id}
                    accessibilityLabel={`${topic.title}${unlocked ? "" : ", locked"}`}
                    accessibilityRole="button"
                    disabled={!unlocked}
                    onPress={() => {
                      void playTapFeedback();
                      router.push({
                        pathname: APP_ROUTES.lesson.topic as never,
                        params: { topicId: topic.id },
                      });
                    }}
                    style={[styles.topicCard, !unlocked && styles.topicCardLocked]}
                  >
                    <BatiBotAssetImage
                      asset={asset}
                      hideComingSoonLabel
                      hideLabel
                      placeholderStyle={styles.topicImage}
                      style={styles.topicImage}
                    />
                    <View style={styles.topicCopy}>
                      <Text numberOfLines={2} style={styles.topicTitle}>
                        {topic.title}
                      </Text>
                      <Text numberOfLines={2} style={styles.topicInstruction}>
                        {topic.instruction}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, unlocked && styles.statusBadgeUnlocked]}>
                      <Ionicons
                        name={unlocked ? "play" : "lock-closed"}
                        size={17}
                        color={unlocked ? "#FFFFFF" : "#6B21F2"}
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyPanel}>
              <Text style={styles.emptyText}>No topics found for this world yet.</Text>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

function StateScreen({
  background,
  message,
}: {
  background?: ReturnType<typeof resolvePlayBackgroundSource>;
  message: string;
}) {
  const stateBackground = background ?? resolvePlayBackgroundSource("Preschool");

  return (
    <View style={baseStyles.page}>
      <ImageBackground source={stateBackground} resizeMode="cover" style={styles.background}>
        <View style={styles.stateWrap}>
          <Text style={styles.stateText}>{message}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#6B21F2",
    borderColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 3,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 18,
  },
  emptyPanel: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderColor: "#D6CAFF",
    borderRadius: 18,
    borderWidth: 3,
    marginTop: 16,
    maxWidth: 340,
    padding: 16,
    width: "100%",
  },
  emptyText: {
    color: "#44239A",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderColor: "#D6CAFF",
    borderRadius: 18,
    borderWidth: 3,
    flexDirection: "row",
    gap: 12,
    maxWidth: 340,
    minHeight: 92,
    padding: 12,
    width: "100%",
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  stateText: {
    color: "#44239A",
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 22,
    textAlign: "center",
  },
  stateWrap: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderColor: "#D6CAFF",
    borderRadius: 18,
    borderWidth: 3,
    margin: 24,
    padding: 18,
  },
  statusBadge: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D6CAFF",
    borderRadius: 999,
    borderWidth: 2,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  statusBadgeUnlocked: {
    backgroundColor: "#22C55E",
    borderColor: "#16A34A",
  },
  subtitle: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "900",
  },
  title: {
    color: "#44239A",
    fontSize: 23,
    fontWeight: "900",
  },
  topicCard: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.97)",
    borderColor: "#D6CAFF",
    borderRadius: 18,
    borderWidth: 3,
    flexDirection: "row",
    gap: 10,
    minHeight: 96,
    padding: 10,
    width: "100%",
  },
  topicCardLocked: {
    opacity: 0.68,
  },
  topicCopy: {
    flex: 1,
    minWidth: 0,
  },
  topicImage: {
    height: 64,
    width: 64,
  },
  topicInstruction: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16,
  },
  topicList: {
    gap: 10,
    marginTop: 16,
    maxWidth: 340,
    width: "100%",
  },
  topicTitle: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "900",
  },
});
