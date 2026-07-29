import { Redirect, useLocalSearchParams } from "expo-router";

import { allTopics, allWorlds } from "@/src/data/learning-content";
import { kindergartenStageWorlds } from "@/src/data/kindergartenStageWorlds";
import { useCurrentLearner } from "@/src/hooks/useCurrentLearner";
import { APP_ROUTES } from "@/src/navigation/routes";
import { KindergartenTopicStageScreen } from "@/src/screens/kindergarten/KindergartenTopicStageScreen";
import { AnimalTopicStageScreen } from "@/src/screens/preschool/animal/AnimalTopicStageScreen";
import { BodyTopicStageScreen } from "@/src/screens/preschool/body/BodyTopicStageScreen";
import { ColorfulTopicStageScreen } from "@/src/screens/preschool/colorful/ColorfulTopicStageScreen";
import { FamilyTopicStageScreen } from "@/src/screens/preschool/family/FamilyTopicStageScreen";
import { FoodTopicStageScreen } from "@/src/screens/preschool/food/FoodTopicStageScreen";
import { FruitTopicStageScreen } from "@/src/screens/preschool/fruit/FruitTopicStageScreen";
import { NumberTopicStageScreen } from "@/src/screens/preschool/number/NumberTopicStageScreen";
import { ShapeTopicStageScreen } from "@/src/screens/preschool/shapes/ShapeTopicStageScreen";
import {
  getTopicsForWorld,
  isTopicUnlocked,
  isWorldUnlocked,
} from "@/src/utils/learningProgressUtils";

function getParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default function LessonStageRoute() {
  const params = useLocalSearchParams<{ topicId?: string | string[] }>();
  const topicId = getParamValue(params.topicId);
  const { learner, loading } = useCurrentLearner();
  const topic = allTopics.find((item) => item.id === topicId);
  const world = topic ? allWorlds.find((item) => item.id === topic.worldId) : undefined;

  if (loading) {
    return null;
  }

  if (!learner || !topic || !world) {
    return <Redirect href={APP_ROUTES.tabs.play} />;
  }

  const worldTopics = getTopicsForWorld(allTopics, world.id);

  if (
    world.gradeLevel !== learner.gradeLevel ||
    !isWorldUnlocked(world, learner) ||
    !isTopicUnlocked(topic, learner) ||
    !worldTopics.some((item) => item.id === topic.id)
  ) {
    return <Redirect href={APP_ROUTES.tabs.play} />;
  }

  if (world.gradeLevel === "preschool") {
    if (world.id === "preschool-family-world") {
      return <FamilyTopicStageScreen />;
    }

    if (world.id === "preschool-body-world") {
      return <BodyTopicStageScreen />;
    }

    if (world.id === "preschool-colorful-world") {
      return <ColorfulTopicStageScreen />;
    }

    if (world.id === "preschool-shape-kingdom") {
      return <ShapeTopicStageScreen />;
    }

    if (world.id === "preschool-animal-adventure") {
      return <AnimalTopicStageScreen />;
    }

    if (world.id === "preschool-fruit-garden") {
      return <FruitTopicStageScreen />;
    }

    if (world.id === "preschool-food-town") {
      return <FoodTopicStageScreen />;
    }

    if (world.id === "preschool-number-village") {
      return <NumberTopicStageScreen />;
    }
  }

  if (world.gradeLevel === "kindergarten") {
    const kindergartenConfig =
      kindergartenStageWorlds[world.id as keyof typeof kindergartenStageWorlds];

    if (kindergartenConfig) {
      return <KindergartenTopicStageScreen config={kindergartenConfig} />;
    }
  }

  return (
    <Redirect
      href={{
        pathname: APP_ROUTES.tabs.play,
        params: {
          worldId: world.id,
          topicId: topic.id,
        },
      }}
    />
  );
}
