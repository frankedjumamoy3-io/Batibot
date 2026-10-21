import type { ImageSourcePropType } from "react-native";

import { REUSABLE_LEARNING_ASSETS as reusable, TOPIC_IMAGES } from "@/src/data/play-assets";

type LessonConcept = {
  key: string;
  label: string;
  aliases: string[];
  source: ImageSourcePropType;
  iconName: string;
};

// Exact semantic aliases only: a world illustration must never stand in for an answer.
export const LESSON_CONCEPT_ASSETS: LessonConcept[] = [
  { key: "person.boy", label: "Boy", aliases: ["boy"], source: TOPIC_IMAGES["preschool-family-world-brother"], iconName: "mdi:human-child" },
  { key: "person.girl", label: "Girl", aliases: ["girl"], source: TOPIC_IMAGES["preschool-family-world-sister"], iconName: "mdi:human-child" },
  { key: "person.teacher", label: "Teacher", aliases: ["teacher"], source: require("../../../Batibot assets/kindergarten assets/topic-community village/topic/teacher.png"), iconName: "mdi:human-male-board" },
  { key: "place.school", label: "School", aliases: ["school"], source: require("../../../Batibot assets/grade 1 assets/school.png"), iconName: "mdi:school" },
  { key: "animal.dog", label: "Dog", aliases: ["dog", "puppy"], source: reusable.animals.dog, iconName: "mdi:dog" },
  { key: "animal.cat", label: "Cat", aliases: ["cat"], source: reusable.animals.cat, iconName: "mdi:cat" },
  { key: "animal.fish", label: "Fish", aliases: ["fish"], source: reusable.animals.fish, iconName: "mdi:fish" },
  { key: "object.ball", label: "Ball", aliases: ["ball"], source: reusable.objects.ball, iconName: "mdi:basketball" },
  { key: "object.book", label: "Book", aliases: ["book"], source: TOPIC_IMAGES["kindergarten-school-book"], iconName: "mdi:book-open-variant" },
  { key: "action.run", label: "Run", aliases: ["run", "running child", "fast", "quick"], source: reusable.actions.run, iconName: "mdi:run-fast" },
  { key: "action.jump", label: "Jump", aliases: ["jump", "jumping child"], source: reusable.actions.jump, iconName: "mdi:human-handsup" },
  { key: "action.write", label: "Write", aliases: ["write", "writing child"], source: require("../../../assets/images/lesson-concepts/writing-child.png"), iconName: "mdi:pencil" },
  { key: "action.read", label: "Read", aliases: ["read", "reading child"], source: require("../../../assets/images/lesson-concepts/reading-child.png"), iconName: "mdi:book-open-page-variant" },
  { key: "adjective.slow", label: "Slow", aliases: ["slow", "walk", "walking child"], source: require("../../../assets/images/lesson-concepts/walking-child.png"), iconName: "mdi:walk" },
  { key: "emotion.happy", label: "Happy", aliases: ["happy", "glad", "happy child", "smiling child"], source: require("../../../assets/images/lesson-concepts/happy-child.png"), iconName: "mdi:emoticon-happy-outline" },
  { key: "emotion.sad", label: "Sad", aliases: ["sad", "sad child"], source: require("../../../assets/images/lesson-concepts/sad-child.png"), iconName: "mdi:emoticon-sad-outline" },
  { key: "adjective.big", label: "Big", aliases: ["big", "large", "large elephant"], source: require("../../../Batibot assets/kindergarten assets/big and small village/big elephant.png"), iconName: "mdi:elephant" },
  { key: "adjective.small", label: "Small", aliases: ["small", "tiny", "small mouse"], source: require("../../../Batibot assets/kindergarten assets/big and small village/small mouse.png"), iconName: "mdi:rodent" },
  { key: "adjective.bright", label: "Bright", aliases: ["bright", "bright sun", "sun"], source: reusable.nature.sun, iconName: "mdi:white-balance-sunny" },
  { key: "adjective.cold", label: "Cold", aliases: ["cold", "cold drink"], source: reusable.foods.juice, iconName: "mdi:snowflake" },
];

export function findLessonConcept(label: string) {
  const normalized = label.trim().toLowerCase();
  return LESSON_CONCEPT_ASSETS.find((concept) =>
    concept.key === normalized || concept.aliases.includes(normalized)
  );
}
