import type { PreschoolAnimalTopicId, PreschoolAnimalWorldConfig } from "./types";

export const PRESCHOOL_ANIMAL_WORLD_ID = "preschool-animal-adventure";

export const PRESCHOOL_ANIMAL_WORLD_CONFIG: PreschoolAnimalWorldConfig = {
  id: PRESCHOOL_ANIMAL_WORLD_ID,
  title: "Animal Adventure",
  emoji: "ANIMAL",
  accentColor: "#22C55E",
  description:
    "A mini safari for animal sounds, homes, food, movement, and care.",
  activities: [
    "Explore animal clues",
    "Match animals",
    "Feed animals",
    "Help animals home",
  ],
  topics: [
    {
      assetId: "dog",
      title: "Dog",
      emoji: "D",
      category: "linguistic",
      subcategory: "animals",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Woof woof!",
    },
    {
      assetId: "cat",
      title: "Cat",
      emoji: "C",
      category: "linguistic",
      subcategory: "animals",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Meow!",
    },
    {
      assetId: "bird",
      title: "Bird",
      emoji: "B",
      category: "linguistic",
      subcategory: "animals",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Tweet tweet!",
    },
    {
      assetId: "fish",
      title: "Fish",
      emoji: "F",
      category: "linguistic",
      subcategory: "animals",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Blub blub!",
    },
    {
      assetId: "cow",
      title: "Cow",
      emoji: "C",
      category: "linguistic",
      subcategory: "animals",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Moo!",
    },
    {
      assetId: "horse",
      title: "Horse",
      emoji: "H",
      category: "linguistic",
      subcategory: "animals",
      interactionTypes: ["Tap Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Neigh!",
    },
    {
      assetId: "duck",
      title: "Duck",
      emoji: "D",
      category: "linguistic",
      subcategory: "animals",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Quack quack!",
    },
  ],
};

export const PRESCHOOL_ANIMAL_TOPIC_ORDER = PRESCHOOL_ANIMAL_WORLD_CONFIG.topics.map(
  (topic) => topic.title
);

export const SCOPED_ANIMAL_TOPIC_IDS = new Set<PreschoolAnimalTopicId>([
  "dog",
  "cat",
  "bird",
  "fish",
  "cow",
  "horse",
  "duck",
]);
