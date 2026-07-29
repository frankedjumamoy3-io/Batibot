import type { ImageSourcePropType } from "react-native";

import type {
  ActiveLearningPhase,
  FrameworkStageLabel,
} from "@/src/data/curriculum/learning-path";
import { CURRICULUM } from "@/src/data/curriculum/learning-path";
import {
  COUNTING_FOREST_ASSETS,
  FEEDBACK_ASSETS,
  REUSABLE_LEARNING_ASSETS,
  TOPIC_IMAGES,
  WORLD_IMAGES,
} from "@/src/data/play-assets";
import type { LearnerGradeLevel } from "@/src/types/user";
import { getFallbackIconForLabel } from "@/src/data/assets/fallback-icon-map";

export type BatiBotAssetProvider =
  | "custom"
  | "firebase"
  | "iconify"
  | "lucide"
  | "phosphor"
  | "system";

export type BatiBotAssetStatus =
  | "approved"
  | "missing"
  | "placeholder"
  | "pending-review"
  | "rejected";

export type BatiBotAssetType =
  | "character"
  | "clock"
  | "counter"
  | "curriculum"
  | "scene"
  | "sequence"
  | "shape"
  | "stage"
  | "topic"
  | "world";

export type BatiBotAssetManifestItem = {
  id: string;
  assetType: BatiBotAssetType;
  altText: string;
  category: "illustration" | "background" | "icon" | "model" | "reward";
  firebasePath?: string;
  gradeLevel?: LearnerGradeLevel;
  iconName?: string;
  label: string;
  localSource?: ImageSourcePropType;
  provider?: BatiBotAssetProvider;
  prompt?: string;
  remoteUri?: string;
  stage?: ActiveLearningPhase | FrameworkStageLabel;
  status: BatiBotAssetStatus;
  topicId?: string;
  topicTitle?: string;
  tags: string[];
  uri?: string;
  worldId?: string;
};

const STAGE_TO_FRAMEWORK_STAGE: Record<ActiveLearningPhase, FrameworkStageLabel> = {
  Challenge: "PLAY",
  Discover: "LOOK",
  Explore: "TAP",
  Interact: "TRY",
  Mastery: "MASTERED",
  Practice: "CHOOSE",
  Progress: "PROGRESS",
  Reward: "STAR",
};

export function slugifyAssetId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getLevelPath(gradeLevel: LearnerGradeLevel) {
  return gradeLevel.toLowerCase().replace(/\s+/g, "");
}

function getWorldPathSegment(worldId: string) {
  return worldId.replace(/^(preschool|kindergarten|grade1|grade2|grade3)-/, "");
}

export function getTopicAssetId(worldId: string, topicTitle: string) {
  return `${worldId}-${slugifyAssetId(topicTitle)}`;
}

export function getWorldAssetId(worldId: string) {
  return `world_${worldId}`;
}

export function getStageAssetId(
  topicId: string,
  stage: ActiveLearningPhase | FrameworkStageLabel
) {
  return `stage_${topicId}_${slugifyAssetId(stage)}`;
}

function buildFirebaseAssetPath(
  gradeLevel: LearnerGradeLevel,
  worldId: string,
  fileName: string
) {
  return [
    "curriculum-assets",
    getLevelPath(gradeLevel),
    getWorldPathSegment(worldId),
    fileName,
  ].join("/");
}

function buildPrompt(label: string, gradeLevel: LearnerGradeLevel, assetType: BatiBotAssetType) {
  return [
    `child-friendly 3D cartoon ${label}`,
    `${assetType} educational illustration`,
    "transparent background",
    "centered subject",
    "bright colors",
    `safe for ${gradeLevel} learners`,
    "mobile app asset",
  ].join(", ");
}

function getAssetTypeForTopic(worldId: string, topicTitle: string): BatiBotAssetType {
  const normalized = `${worldId} ${topicTitle}`.toLowerCase();

  if (normalized.includes("clock") || normalized.includes("time")) {
    return "clock";
  }

  if (normalized.includes("circle") || normalized.includes("square") || normalized.includes("triangle") || normalized.includes("rectangle") || normalized.includes("shape")) {
    return "shape";
  }

  if (normalized.includes("story") || normalized.includes("family")) {
    return normalized.includes("scene") ? "scene" : "character";
  }

  if (normalized.includes("number") || normalized.includes("count")) {
    return "counter";
  }

  return "topic";
}

function buildManifest() {
  const assets: BatiBotAssetManifestItem[] = [];

  assets.push({
    altText: "BatiBot app logo",
    assetType: "character",
    category: "icon",
    iconName: "robot",
    id: "ui_batibot_logo",
    label: "BatiBot",
    localSource: require("../../../Batibot assets/batibot icon.png"),
    prompt: "BatiBot friendly app logo for a child learning app",
    provider: "custom",
    status: "approved",
    tags: ["batibot", "logo", "auth", "brand", "icon"],
  });

  CURRICULUM.forEach((grade) => {
    grade.worlds.forEach((world) => {
      const worldImage = WORLD_IMAGES[world.id];

      assets.push({
        altText: `${world.title} world artwork`,
        assetType: "world",
        category: "background",
        firebasePath: buildFirebaseAssetPath(grade.gradeLevel, world.id, `${world.id}.png`),
        gradeLevel: grade.gradeLevel,
        iconName: getFallbackIconForLabel(world.title),
        id: getWorldAssetId(world.id),
        label: world.title,
        localSource: worldImage,
        prompt: buildPrompt(world.title, grade.gradeLevel, "world"),
        provider: worldImage ? "custom" : "iconify",
        status: worldImage ? "approved" : "placeholder",
        tags: [grade.gradeLevel, world.id, world.title, "world", "background"].map(slugifyAssetId),
        uri: buildFirebaseAssetPath(grade.gradeLevel, world.id, `${world.id}.png`),
        worldId: world.id,
      });

      world.topics.forEach((topic) => {
        const topicId = getTopicAssetId(world.id, topic.title);
        const topicImage = TOPIC_IMAGES[topicId];
        const assetType = getAssetTypeForTopic(world.id, topic.title);
        const prompt = topic.batibotContent?.frameworkStages.find((stage) => stage.imagePrompt)
          ?.imagePrompt ?? buildPrompt(topic.title, grade.gradeLevel, assetType);

        assets.push({
          altText: `${topic.title} topic illustration`,
          assetType,
          category: assetType === "clock" || assetType === "counter" || assetType === "shape" ? "model" : "illustration",
          firebasePath: buildFirebaseAssetPath(
            grade.gradeLevel,
            world.id,
            `${slugifyAssetId(topic.title)}.png`
          ),
          gradeLevel: grade.gradeLevel,
          iconName: getFallbackIconForLabel(`${topic.title} ${topic.category} ${topic.subcategory}`),
          id: `topic_${topicId}`,
          label: topic.title,
          localSource: topicImage,
          prompt,
          provider: topicImage ? "custom" : "iconify",
          status: topicImage ? "approved" : "placeholder",
          tags: [
            grade.gradeLevel,
            world.id,
            world.title,
            topic.title,
            topic.category,
            topic.subcategory,
            "topic",
          ].map(slugifyAssetId),
          topicId,
          topicTitle: topic.title,
          uri: buildFirebaseAssetPath(
            grade.gradeLevel,
            world.id,
            `${slugifyAssetId(topic.title)}.png`
          ),
          worldId: world.id,
        });

        topic.learningStages.forEach((stage) => {
          const frameworkStage = STAGE_TO_FRAMEWORK_STAGE[stage];

          assets.push({
            altText: `${topic.title} ${stage} activity visual`,
            assetType: "stage",
            category: "illustration",
            firebasePath: buildFirebaseAssetPath(
              grade.gradeLevel,
              world.id,
              `${slugifyAssetId(topic.title)}-${slugifyAssetId(stage)}.png`
            ),
            gradeLevel: grade.gradeLevel,
            iconName: getFallbackIconForLabel(`${topic.title} ${stage}`),
            id: getStageAssetId(topicId, stage),
            label: `${topic.title} ${frameworkStage}`,
            localSource: topicImage,
            prompt: buildPrompt(`${topic.title} ${stage}`, grade.gradeLevel, "stage"),
            provider: topicImage ? "custom" : "iconify",
            stage,
            status: topicImage ? "approved" : "placeholder",
            tags: [
              grade.gradeLevel,
              world.id,
              topic.title,
              stage,
              frameworkStage,
              "stage",
            ].map(slugifyAssetId),
            topicId,
            topicTitle: topic.title,
            uri: buildFirebaseAssetPath(
              grade.gradeLevel,
              world.id,
              `${slugifyAssetId(topic.title)}-${slugifyAssetId(stage)}.png`
            ),
            worldId: world.id,
          });
        });

        topic.batibotContent?.visualAssetRequirements.images.forEach((assetLabel) => {
          assets.push({
            altText: `${topic.title} ${assetLabel}`,
            assetType: "curriculum",
            category: "illustration",
            firebasePath: buildFirebaseAssetPath(
              grade.gradeLevel,
              world.id,
              `${slugifyAssetId(topic.title)}-${slugifyAssetId(assetLabel)}.png`
            ),
            gradeLevel: grade.gradeLevel,
            iconName: getFallbackIconForLabel(`${topic.title} ${assetLabel}`),
            id: `required_${topicId}_${slugifyAssetId(assetLabel)}`,
            label: assetLabel,
            localSource: topicImage,
            prompt: buildPrompt(assetLabel, grade.gradeLevel, "curriculum"),
            provider: topicImage ? "custom" : "iconify",
            status: topicImage ? "approved" : "placeholder",
            tags: [
              grade.gradeLevel,
              world.id,
              topic.title,
              assetLabel,
              "curriculum",
            ].map(slugifyAssetId),
            topicId,
            topicTitle: topic.title,
            uri: buildFirebaseAssetPath(
              grade.gradeLevel,
              world.id,
              `${slugifyAssetId(topic.title)}-${slugifyAssetId(assetLabel)}.png`
            ),
            worldId: world.id,
          });
        });
      });
    });
  });

  const countingForestObjectAssets: {
    group: string;
    id: string;
    label: string;
    localSource: ImageSourcePropType;
  }[] = [
    { group: "animals", id: "dog", label: "Dog", localSource: COUNTING_FOREST_ASSETS.animals.dog },
    { group: "animals", id: "cat", label: "Cat", localSource: COUNTING_FOREST_ASSETS.animals.cat },
    { group: "animals", id: "bird", label: "Bird", localSource: COUNTING_FOREST_ASSETS.animals.bird },
    { group: "animals", id: "fish", label: "Fish", localSource: COUNTING_FOREST_ASSETS.animals.fish },
    { group: "animals", id: "cow", label: "Cow", localSource: COUNTING_FOREST_ASSETS.animals.cow },
    { group: "animals", id: "horse", label: "Horse", localSource: COUNTING_FOREST_ASSETS.animals.horse },
    { group: "fruits", id: "apple", label: "Apple", localSource: COUNTING_FOREST_ASSETS.fruits.apple },
    { group: "fruits", id: "banana", label: "Banana", localSource: COUNTING_FOREST_ASSETS.fruits.banana },
    { group: "fruits", id: "orange", label: "Orange", localSource: COUNTING_FOREST_ASSETS.fruits.orange },
    { group: "fruits", id: "mango", label: "Mango", localSource: COUNTING_FOREST_ASSETS.fruits.mango },
    { group: "fruits", id: "grapes", label: "Grapes", localSource: COUNTING_FOREST_ASSETS.fruits.grapes },
    { group: "fruits", id: "watermelon", label: "Watermelon", localSource: COUNTING_FOREST_ASSETS.fruits.watermelon },
    { group: "food", id: "bread", label: "Bread", localSource: COUNTING_FOREST_ASSETS.food.bread },
    { group: "food", id: "milk", label: "Milk", localSource: COUNTING_FOREST_ASSETS.food.milk },
    { group: "food", id: "egg", label: "Egg", localSource: COUNTING_FOREST_ASSETS.food.egg },
    { group: "food", id: "rice", label: "Rice", localSource: COUNTING_FOREST_ASSETS.food.rice },
    { group: "food", id: "vegetables", label: "Vegetables", localSource: TOPIC_IMAGES["preschool-food-town-vegetables"] },
    { group: "food", id: "juice", label: "Juice", localSource: COUNTING_FOREST_ASSETS.food.juice },
    { group: "shapes", id: "circle", label: "Circle", localSource: COUNTING_FOREST_ASSETS.shapes.circle },
    { group: "shapes", id: "square", label: "Square", localSource: COUNTING_FOREST_ASSETS.shapes.square },
    { group: "shapes", id: "triangle", label: "Triangle", localSource: COUNTING_FOREST_ASSETS.shapes.triangle },
    { group: "shapes", id: "rectangle", label: "Rectangle", localSource: COUNTING_FOREST_ASSETS.shapes.rectangle },
    { group: "shapes", id: "star", label: "Star", localSource: COUNTING_FOREST_ASSETS.shapes.star },
  ];

  countingForestObjectAssets.forEach((item) => {
    assets.push({
      altText: `${item.label} counting object`,
      assetType: item.group === "shapes" ? "shape" : "counter",
      category: "illustration",
      firebasePath: buildFirebaseAssetPath(
        "Preschool",
        "preschool-counting-forest",
        `${item.group}-${item.id}.png`
      ),
      gradeLevel: "Preschool",
      iconName: getFallbackIconForLabel(`${item.label} counting object`),
      id: `counting_forest_${item.group}_${item.id}`,
      label: item.label,
      localSource: item.localSource,
      prompt: buildPrompt(`${item.label} counting object`, "Preschool", "counter"),
      provider: "custom",
      status: "approved",
      tags: [
        "Preschool",
        "preschool-counting-forest",
        "Counting Forest",
        item.group,
        item.label,
        "counting object",
      ].map(slugifyAssetId),
      uri: buildFirebaseAssetPath(
        "Preschool",
        "preschool-counting-forest",
        `${item.group}-${item.id}.png`
      ),
      worldId: "preschool-counting-forest",
    });
  });

  const kindergartenAlphabetAliasAssets: {
    id: string;
    label: string;
    localSource: ImageSourcePropType;
  }[] = [
    { id: "alphabet_ball", label: "Ball", localSource: REUSABLE_LEARNING_ASSETS.objects.ball },
    { id: "alphabet_cat", label: "Cat", localSource: REUSABLE_LEARNING_ASSETS.animals.cat },
    { id: "alphabet_dog", label: "Dog", localSource: REUSABLE_LEARNING_ASSETS.animals.dog },
    { id: "alphabet_egg", label: "Egg", localSource: REUSABLE_LEARNING_ASSETS.objects.egg },
    { id: "alphabet_fish", label: "Fish", localSource: REUSABLE_LEARNING_ASSETS.animals.fish },
    { id: "alphabet_grapes", label: "Grapes", localSource: REUSABLE_LEARNING_ASSETS.alphabet.grapes },
    { id: "alphabet_hat", label: "Hat", localSource: REUSABLE_LEARNING_ASSETS.objects.hat },
    { id: "alphabet_igloo", label: "Igloo", localSource: REUSABLE_LEARNING_ASSETS.objects.igloo },
    { id: "alphabet_juice", label: "Juice", localSource: REUSABLE_LEARNING_ASSETS.foods.juice },
    { id: "alphabet_kite", label: "Kite", localSource: REUSABLE_LEARNING_ASSETS.objects.kite },
    { id: "alphabet_leaf", label: "Leaf", localSource: REUSABLE_LEARNING_ASSETS.nature.leaf },
    { id: "alphabet_moon", label: "Moon", localSource: REUSABLE_LEARNING_ASSETS.nature.moon },
    { id: "alphabet_notebook", label: "Notebook", localSource: REUSABLE_LEARNING_ASSETS.objects.notebook },
    { id: "alphabet_pencil", label: "Pencil", localSource: REUSABLE_LEARNING_ASSETS.objects.pencil },
    { id: "alphabet_queen", label: "Queen", localSource: REUSABLE_LEARNING_ASSETS.objects.queen },
    { id: "alphabet_rain", label: "Rain", localSource: REUSABLE_LEARNING_ASSETS.nature.rain },
    { id: "alphabet_sun", label: "Sun", localSource: REUSABLE_LEARNING_ASSETS.nature.sun },
    { id: "alphabet_tree", label: "Tree", localSource: REUSABLE_LEARNING_ASSETS.nature.tree },
    { id: "alphabet_yellow", label: "Yellow", localSource: REUSABLE_LEARNING_ASSETS.colors.yellow },
  ];
  const kindergartenReadingAliasAssets: {
    id: string;
    label: string;
    localSource: ImageSourcePropType;
  }[] = [
    { id: "reading_cat", label: "Cat", localSource: TOPIC_IMAGES["kindergarten-reading-readiness-cat"] },
    { id: "reading_dog", label: "Dog", localSource: TOPIC_IMAGES["kindergarten-reading-readiness-dog"] },
    { id: "reading_hat", label: "Hat", localSource: TOPIC_IMAGES["kindergarten-reading-readiness-hat"] },
    { id: "reading_home", label: "Home", localSource: TOPIC_IMAGES["kindergarten-reading-readiness-home"] },
    { id: "reading_sun", label: "Sun", localSource: TOPIC_IMAGES["kindergarten-reading-readiness-sun"] },
    { id: "reading_toy", label: "Toy", localSource: TOPIC_IMAGES["kindergarten-reading-readiness-toy"] },
    { id: "reading_tree", label: "Tree", localSource: TOPIC_IMAGES["kindergarten-reading-readiness-tree"] },
  ];

  const reusableLearningAssets: {
    assetType: BatiBotAssetType;
    gradeLevel: LearnerGradeLevel;
    id: string;
    label: string;
    localSource: ImageSourcePropType;
    topicIds: string[];
    worldId?: string;
  }[] = [
    {
      assetType: "character",
      gradeLevel: "Grade 1",
      id: "action_run",
      label: "Run",
      localSource: REUSABLE_LEARNING_ASSETS.actions.run,
      topicIds: [
        "grade1-word-kingdom-run",
        "grade1-word-kingdom-runs",
        "grade1-word-kingdom-running-child",
        "grade1-reading-run",
        "grade1-reading-runs",
      ],
      worldId: "grade1-word-kingdom",
    },
    {
      assetType: "character",
      gradeLevel: "Grade 1",
      id: "action_jump",
      label: "Jump",
      localSource: REUSABLE_LEARNING_ASSETS.actions.jump,
      topicIds: [
        "grade1-word-kingdom-jump",
        "grade1-word-kingdom-jumping-child",
        "grade1-reading-jump",
      ],
      worldId: "grade1-word-kingdom",
    },
    {
      assetType: "character",
      gradeLevel: "Grade 1",
      id: "action_read",
      label: "Read",
      localSource: REUSABLE_LEARNING_ASSETS.actions.read,
      topicIds: [
        "grade1-word-kingdom-read",
        "grade1-word-kingdom-reading-child",
        "grade1-reading-read",
        "kindergarten-reading-readiness-read",
      ],
      worldId: "grade1-word-kingdom",
    },
    {
      assetType: "character",
      gradeLevel: "Grade 1",
      id: "action_write",
      label: "Write",
      localSource: REUSABLE_LEARNING_ASSETS.actions.write,
      topicIds: [
        "grade1-word-kingdom-write",
        "grade1-word-kingdom-writing-child",
        "grade1-reading-write",
        "kindergarten-reading-readiness-write",
      ],
      worldId: "grade1-word-kingdom",
    },
    {
      assetType: "topic",
      gradeLevel: "Kindergarten",
      id: "reusable_apple",
      label: "Apple",
      localSource: REUSABLE_LEARNING_ASSETS.alphabet.apple,
      topicIds: [
        "kindergarten-alphabet-apple",
        "kindergarten-reading-readiness-apple",
        "grade1-word-kingdom-apple",
      ],
      worldId: "kindergarten-alphabet",
    },
    {
      assetType: "topic",
      gradeLevel: "Kindergarten",
      id: "reusable_orange",
      label: "Orange",
      localSource: REUSABLE_LEARNING_ASSETS.alphabet.orange,
      topicIds: [
        "kindergarten-alphabet-orange",
        "kindergarten-reading-readiness-orange",
        "grade1-word-kingdom-orange",
      ],
      worldId: "kindergarten-alphabet",
    },
    ...kindergartenAlphabetAliasAssets.map((item) => ({
      assetType: "topic" as const,
      gradeLevel: "Kindergarten" as const,
      id: item.id,
      label: item.label,
      localSource: item.localSource,
      topicIds: [`kindergarten-alphabet-${slugifyAssetId(item.label)}`],
      worldId: "kindergarten-alphabet",
    })),
    ...kindergartenReadingAliasAssets.map((item) => ({
      assetType: "topic" as const,
      gradeLevel: "Kindergarten" as const,
      id: item.id,
      label: item.label,
      localSource: item.localSource,
      topicIds: [`kindergarten-reading-readiness-${slugifyAssetId(item.label)}`],
      worldId: "kindergarten-reading-readiness",
    })),
    {
      assetType: "topic",
      gradeLevel: "Grade 1",
      id: "reusable_book",
      label: "Book",
      localSource: TOPIC_IMAGES["kindergarten-school-book"],
      topicIds: [
        "kindergarten-reading-readiness-book",
        "grade1-reading-book",
        "grade1-word-kingdom-book",
      ],
      worldId: "kindergarten-school",
    },
    {
      assetType: "topic",
      gradeLevel: "Grade 1",
      id: "reusable_pencil",
      label: "Pencil",
      localSource: TOPIC_IMAGES["kindergarten-school-pencil"],
      topicIds: [
        "kindergarten-reading-readiness-pencil",
        "grade1-reading-pencil",
        "grade1-word-kingdom-pencil",
      ],
      worldId: "kindergarten-school",
    },
    {
      assetType: "topic",
      gradeLevel: "Grade 1",
      id: "reusable_sun",
      label: "Sun",
      localSource: REUSABLE_LEARNING_ASSETS.nature.sun,
      topicIds: ["grade1-reading-sun", "grade1-nature-sun"],
      worldId: "grade1-nature",
    },
    {
      assetType: "topic",
      gradeLevel: "Grade 1",
      id: "reusable_moon",
      label: "Moon",
      localSource: REUSABLE_LEARNING_ASSETS.nature.moon,
      topicIds: ["grade1-reading-moon", "grade1-nature-moon"],
      worldId: "grade1-nature",
    },
    {
      assetType: "topic",
      gradeLevel: "Grade 1",
      id: "reusable_rain",
      label: "Rain",
      localSource: REUSABLE_LEARNING_ASSETS.nature.rain,
      topicIds: ["grade1-reading-rain", "grade1-nature-rain"],
      worldId: "grade1-nature",
    },
    {
      assetType: "topic",
      gradeLevel: "Grade 1",
      id: "reusable_leaf",
      label: "Leaf",
      localSource: REUSABLE_LEARNING_ASSETS.nature.leaf,
      topicIds: ["grade1-reading-leaf", "grade1-nature-leaf", "kindergarten-nature-leaf"],
      worldId: "grade1-nature",
    },
  ];

  reusableLearningAssets.forEach((item) => {
    const reusableTags = [
      item.gradeLevel,
      item.worldId ?? "reusable",
      item.label,
      item.id,
      "reusable",
      "cross-grade",
    ].map(slugifyAssetId);

    assets.push({
      altText: `${item.label} reusable learning illustration`,
      assetType: item.assetType,
      category: "illustration",
      firebasePath: buildFirebaseAssetPath(
        item.gradeLevel,
        item.worldId ?? "reusable-assets",
        `${item.id}.png`
      ),
      gradeLevel: item.gradeLevel,
      iconName: getFallbackIconForLabel(item.label),
      id: `reusable_${item.id}`,
      label: item.label,
      localSource: item.localSource,
      prompt: buildPrompt(`${item.label} reusable learning asset`, item.gradeLevel, item.assetType),
      provider: "custom",
      status: "approved",
      tags: reusableTags,
      uri: buildFirebaseAssetPath(
        item.gradeLevel,
        item.worldId ?? "reusable-assets",
        `${item.id}.png`
      ),
      worldId: item.worldId,
    });

    item.topicIds.forEach((topicId) => {
      assets.push({
        altText: `${item.label} visual for ${topicId.replace(/-/g, " ")}`,
        assetType: item.assetType,
        category: "illustration",
        firebasePath: buildFirebaseAssetPath(
          item.gradeLevel,
          item.worldId ?? "reusable-assets",
          `${topicId}.png`
        ),
        gradeLevel: item.gradeLevel,
        iconName: getFallbackIconForLabel(item.label),
        id: `reusable_${topicId}`,
        label: item.label,
        localSource: item.localSource,
        prompt: buildPrompt(item.label, item.gradeLevel, item.assetType),
        provider: "custom",
        status: "approved",
        tags: [...reusableTags, topicId].map(slugifyAssetId),
        topicId,
        topicTitle: item.label,
        uri: buildFirebaseAssetPath(
          item.gradeLevel,
          item.worldId ?? "reusable-assets",
          `${topicId}.png`
        ),
        worldId: item.worldId,
      });
    });
  });

  assets.push(
    {
      altText: "Preschool correct answer feedback",
      assetType: "stage",
      category: "reward",
      iconName: "mdi:check-circle",
      id: "feedback_preschool_correct",
      label: "Preschool Correct Feedback",
      localSource: FEEDBACK_ASSETS.correct.preschool,
      provider: "custom",
      status: "approved",
      tags: ["preschool", "feedback", "correct", "success"],
    },
    {
      altText: "Kindergarten correct answer feedback",
      assetType: "stage",
      category: "reward",
      iconName: "mdi:check-circle",
      id: "feedback_kindergarten_correct",
      label: "Kindergarten Correct Feedback",
      localSource: FEEDBACK_ASSETS.correct.kindergarten,
      provider: "custom",
      status: "approved",
      tags: ["kindergarten", "feedback", "correct", "success"],
    },
    {
      altText: "Preschool try again feedback",
      assetType: "stage",
      category: "reward",
      iconName: "mdi:close-circle",
      id: "feedback_preschool_wrong",
      label: "Preschool Wrong Feedback",
      localSource: FEEDBACK_ASSETS.wrong.preschool,
      provider: "custom",
      status: "approved",
      tags: ["preschool", "feedback", "wrong", "retry"],
    },
    {
      altText: "Kindergarten try again feedback",
      assetType: "stage",
      category: "reward",
      iconName: "mdi:close-circle",
      id: "feedback_kindergarten_wrong",
      label: "Kindergarten Wrong Feedback",
      localSource: FEEDBACK_ASSETS.wrong.kindergarten,
      provider: "custom",
      status: "approved",
      tags: ["kindergarten", "feedback", "wrong", "retry"],
    },
    {
      altText: "Grade 1 try again feedback",
      assetType: "stage",
      category: "reward",
      iconName: "mdi:close-circle",
      id: "feedback_grade1_wrong",
      label: "Grade 1 Wrong Feedback",
      localSource: FEEDBACK_ASSETS.wrong.grade1,
      provider: "custom",
      status: "approved",
      tags: ["grade-1", "feedback", "wrong", "retry"],
    },
    {
      altText: "Grade 2 try again feedback",
      assetType: "stage",
      category: "reward",
      iconName: "mdi:close-circle",
      id: "feedback_grade2_wrong",
      label: "Grade 2 Wrong Feedback",
      localSource: FEEDBACK_ASSETS.wrong.grade2,
      provider: "custom",
      status: "approved",
      tags: ["grade-2", "feedback", "wrong", "retry"],
    },
    {
      altText: "Grade 3 try again feedback",
      assetType: "stage",
      category: "reward",
      iconName: "mdi:close-circle",
      id: "feedback_grade3_wrong",
      label: "Grade 3 Wrong Feedback",
      localSource: FEEDBACK_ASSETS.wrong.grade3,
      provider: "custom",
      status: "approved",
      tags: ["grade-3", "feedback", "wrong", "retry"],
    },
    {
      altText: "Reward star icon",
      assetType: "counter",
      category: "reward",
      iconName: "mdi:star",
      id: "reward_star",
      label: "Reward Star",
      localSource: FEEDBACK_ASSETS.reward.star,
      provider: "custom",
      status: "approved",
      tags: ["reward", "star", "xp", "achievement"],
    },
    {
      altText: "Reward badge icon",
      assetType: "counter",
      category: "reward",
      iconName: "mdi:medal-outline",
      id: "reward_badge",
      label: "Reward Badge",
      localSource: FEEDBACK_ASSETS.reward.badge,
      provider: "custom",
      status: "approved",
      tags: ["reward", "badge", "achievement"],
    },
    {
      altText: "Ana story character illustration",
      assetType: "character",
      category: "illustration",
      iconName: "mdi:human-child",
      id: "story_character_ana",
      label: "Ana",
      prompt: buildPrompt("Ana child story character", "Grade 1", "character"),
      provider: "iconify",
      status: "placeholder",
      tags: ["grade-1", "family-story", "ana", "character"],
      worldId: "grade1-family-story-village",
    },
    {
      altText: "Family scene illustration",
      assetType: "scene",
      category: "illustration",
      iconName: "mdi:home-heart",
      id: "story_scene_family",
      label: "Family Scene",
      prompt: buildPrompt("family story scene", "Grade 1", "scene"),
      provider: "iconify",
      status: "placeholder",
      tags: ["grade-1", "family-story", "family", "scene"],
      worldId: "grade1-family-story-village",
    },
    {
      altText: "Reusable star counter",
      assetType: "counter",
      category: "reward",
      iconName: "mdi:star",
      id: "counter_star",
      label: "Star Counter",
      prompt: buildPrompt("star counting manipulative", "Preschool", "counter"),
      provider: "iconify",
      status: "placeholder",
      tags: ["preschool", "star", "counter", "reward"],
    }
  );

  return assets;
}

export const BATIBOT_ASSET_MANIFEST = buildManifest();
