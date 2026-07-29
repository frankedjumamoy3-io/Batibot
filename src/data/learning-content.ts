import {
  CURRICULUM,
  getWorldLearningTopics,
} from "@/src/data/curriculum/learning-path";
import type { Achievement, Badge, GradeLevel, TopicNode, WorldNode } from "@/src/types/learning";
import { toGradeLevel } from "@/src/utils/gradeUtils";

export function getLearningTopicId(worldId: string, topicTitle: string) {
  return `${worldId}:${topicTitle}`;
}

export const allWorlds: WorldNode[] = CURRICULUM.flatMap((grade) => {
  const gradeLevel = toGradeLevel(grade.gradeLevel);

  return grade.worlds.map((world, index) => ({
    id: world.id,
    gradeLevel,
    title: world.title,
    description: world.description,
    emoji: world.emoji,
    order: index,
    ...(index > 0 ? { requiredWorldId: grade.worlds[index - 1].id } : {}),
  }));
});

export const allTopics: TopicNode[] = CURRICULUM.flatMap((grade) => {
  const gradeLevel = toGradeLevel(grade.gradeLevel);

  return grade.worlds.flatMap((world) =>
    getWorldLearningTopics(world).map((topic, index, topics) => ({
      id: getLearningTopicId(world.id, topic.title),
      worldId: world.id,
      gradeLevel,
      title: topic.title,
      instruction: topic.example ?? `Learn ${topic.title}.`,
      emoji: topic.emoji,
      order: index,
      ...(index > 0
        ? { requiredTopicId: getLearningTopicId(world.id, topics[index - 1].title) }
        : {}),
    }))
  );
});

export const preschoolBadges: Badge[] = [
  {
    id: "preschool-family-world-friend",
    gradeLevel: "preschool",
    title: "Family Friend",
    requirement: "Complete My Family World",
    worldId: "preschool-family-world",
  },
  {
    id: "preschool-body-world-explorer",
    gradeLevel: "preschool",
    title: "Body Explorer",
    requirement: "Complete My Body World",
    worldId: "preschool-body-world",
  },
  {
    id: "preschool-rainbow-master",
    gradeLevel: "preschool",
    title: "Rainbow Master",
    requirement: "Complete My Colorful World",
    worldId: "preschool-colorful-world",
  },
  {
    id: "preschool-shape-builder",
    gradeLevel: "preschool",
    title: "Shape Builder",
    requirement: "Complete Shape Kingdom",
    worldId: "preschool-shape-kingdom",
  },
  {
    id: "preschool-animal-buddy",
    gradeLevel: "preschool",
    title: "Animal Buddy",
    requirement: "Complete Animal Adventure",
    worldId: "preschool-animal-adventure",
  },
  {
    id: "preschool-fruit-picker",
    gradeLevel: "preschool",
    title: "Fruit Picker",
    requirement: "Complete Fruit Garden",
    worldId: "preschool-fruit-garden",
  },
  {
    id: "preschool-food-helper",
    gradeLevel: "preschool",
    title: "Food Helper",
    requirement: "Complete Food Town",
    worldId: "preschool-food-town",
  },
  {
    id: "preschool-tiny-counter",
    gradeLevel: "preschool",
    title: "Tiny Counter",
    requirement: "Complete Number Village",
    worldId: "preschool-number-village",
  },
  {
    id: "preschool-superstar",
    gradeLevel: "preschool",
    title: "Preschool Superstar",
    requirement: "Complete all Preschool worlds",
  },
];

const gradeBadgeByWorld = allWorlds
  .filter((world) => world.gradeLevel !== "preschool")
  .map(
    (world): Badge => ({
      id: `${world.id}-badge`,
      gradeLevel: world.gradeLevel,
      title: `${world.title} Badge`,
      requirement: `Complete ${world.title}`,
      worldId: world.id,
    })
  );

export const allBadges: Badge[] = [...preschoolBadges, ...gradeBadgeByWorld];

function gradeAchievement(gradeLevel: GradeLevel): Achievement {
  return {
    id: `${gradeLevel}-world-master`,
    gradeLevel,
    title: "World Master",
    requirement: "Complete all worlds for this grade",
    targetValue: allWorlds.filter((world) => world.gradeLevel === gradeLevel).length,
    metric: "worldsCompleted",
  };
}

export const allAchievements: Achievement[] = [
  {
    id: "global-first-star",
    gradeLevel: "global",
    title: "First Star",
    requirement: "Earn 1 star",
    targetValue: 1,
    metric: "stars",
  },
  {
    id: "global-xp-starter",
    gradeLevel: "global",
    title: "XP Starter",
    requirement: "Earn 50 XP",
    targetValue: 50,
    metric: "xp",
  },
  gradeAchievement("preschool"),
  gradeAchievement("kindergarten"),
  gradeAchievement("grade1"),
  gradeAchievement("grade2"),
  gradeAchievement("grade3"),
];
