import type { ImageSourcePropType } from "react-native";

import {
  ACTIVE_LEARNING_PHASES,
  CURRICULUM,
  type ActiveLearningPhase,
  type CurriculumTopic,
  type CurriculumWorld,
  type FrameworkStageLabel,
} from "@/src/data/curriculum/learning-path";
import {
  PLAY_BACKGROUNDS,
  RANK_ASSETS,
  REWARD_ASSETS,
  TOPIC_IMAGES,
  WORLD_IMAGES,
} from "@/src/data/play-assets";
import { getTopicAssetId, slugifyAssetId } from "@/src/data/assets/batibot-asset-manifest";
import type { LearnerGradeLevel } from "@/src/types/user";

export type AssetType =
  | "hero_image"
  | "topic_icon"
  | "look_image"
  | "tap_image"
  | "try_image"
  | "choose_image"
  | "play_image"
  | "play_background"
  | "story_scene"
  | "story_character"
  | "audio"
  | "animation"
  | "counter"
  | "shape_model"
  | "clock_model"
  | "badge"
  | "achievement"
  | "avatar"
  | "world_background";

export type AssetStatus =
  | "missing"
  | "planned"
  | "in_progress"
  | "uploaded"
  | "approved"
  | "live"
  | "rejected";

export type AssetPriority = "critical" | "important" | "optional";

export type AssetCenterSectionId =
  | "dashboard"
  | "missing"
  | "images"
  | "icons"
  | "audio"
  | "animations"
  | "story"
  | "backgrounds"
  | "rewards"
  | "badges"
  | "avatars"
  | "requests"
  | "validation";

export type AssetRequirement = {
  assetId: string;
  assetType: AssetType;
  label: string;
  status: AssetStatus;
  priority: AssetPriority;
  prompt: string;
  altText: string;
  firebasePath: string;
  gradeLevel: LearnerGradeLevel;
  worldId: string;
  worldTitle: string;
  topicId?: string;
  topicTitle?: string;
  stage?: ActiveLearningPhase | FrameworkStageLabel;
  source?: ImageSourcePropType;
  requestGroup: string;
};

export type AssetReadinessSummary = {
  approved: number;
  completionPercentage: number;
  live: number;
  missing: number;
  planned: number;
  required: number;
  uploaded: number;
};

export type AssetCoverageRow = AssetReadinessSummary & {
  id: string;
  label: string;
};

export type AssetRequest = {
  id: string;
  title: string;
  gradeLevel: LearnerGradeLevel;
  worldTitle: string;
  topicTitle?: string;
  missingAssets: AssetRequirement[];
  promptBundle: string[];
};

export type AssetReadinessIssue = {
  assetId: string;
  issue: string;
  severity: "critical" | "warning";
};

const STAGE_TO_ASSET_TYPE: Partial<Record<ActiveLearningPhase, AssetType>> = {
  Challenge: "play_image",
  Discover: "look_image",
  Explore: "tap_image",
  Interact: "try_image",
  Practice: "choose_image",
};

const IMAGE_ASSET_TYPES = new Set<AssetType>([
  "hero_image",
  "topic_icon",
  "look_image",
  "tap_image",
  "try_image",
  "choose_image",
  "play_image",
  "story_scene",
  "story_character",
  "play_background",
  "world_background",
]);

const SECTION_TO_TYPES: Record<AssetCenterSectionId, AssetType[] | null> = {
  animations: ["animation"],
  audio: ["audio"],
  avatars: ["avatar"],
  backgrounds: ["world_background", "play_background"],
  badges: ["badge"],
  dashboard: null,
  icons: ["topic_icon"],
  images: ["hero_image", "look_image", "tap_image", "try_image", "choose_image", "play_image", "shape_model", "clock_model", "counter"],
  missing: null,
  requests: null,
  rewards: ["badge", "achievement"],
  story: ["story_scene", "story_character", "audio"],
  validation: null,
};

function getGradePath(gradeLevel: LearnerGradeLevel) {
  return gradeLevel.toLowerCase().replace(/\s+/g, "");
}

function getWorldPath(worldId: string) {
  return worldId.replace(/^(preschool|kindergarten|grade1|grade2|grade3)-/, "");
}

function getAssetFolder(assetType: AssetType) {
  if (assetType === "audio") {
    return "audio";
  }

  if (assetType === "animation") {
    return "animation";
  }

  return "images";
}

function getFirebasePath(
  gradeLevel: LearnerGradeLevel,
  worldId: string,
  topicTitle: string | undefined,
  assetType: AssetType,
  assetId: string
) {
  const parts = [
    "curriculum-assets",
    getGradePath(gradeLevel),
    getWorldPath(worldId),
  ];

  if (topicTitle) {
    parts.push(slugifyAssetId(topicTitle));
  }

  parts.push(getAssetFolder(assetType), `${assetId}.${assetType === "audio" ? "mp3" : assetType === "animation" ? "json" : "png"}`);

  return parts.join("/");
}

function getPrompt(label: string, gradeLevel: LearnerGradeLevel, assetType: AssetType) {
  if (assetType === "audio") {
    return `clear child-friendly pronunciation audio for ${label}, ${gradeLevel} learning app, warm voice, short duration, no background music`;
  }

  if (assetType === "animation") {
    return `short child-friendly learning animation for ${label}, ${gradeLevel} mobile app, purposeful motion, bright colors, no text`;
  }

  return `child-friendly 3D educational illustration of ${label}, transparent background, bright colors, ${gradeLevel} learning app, simple shapes, no text`;
}

function getPriority(topic: CurriculumTopic | undefined, assetType: AssetType): AssetPriority {
  const text = `${topic?.title ?? ""} ${topic?.category ?? ""} ${topic?.subcategory ?? ""}`.toLowerCase();

  if (
    assetType === "audio" ||
    assetType === "counter" ||
    assetType === "shape_model" ||
    assetType === "clock_model" ||
    text.includes("letter") ||
    text.includes("number") ||
    text.includes("animal") ||
    text.includes("shape")
  ) {
    return "critical";
  }

  if (assetType === "animation" || assetType === "world_background" || assetType === "play_background") {
    return "optional";
  }

  return "important";
}

function getStatus(assetType: AssetType, source?: ImageSourcePropType): AssetStatus {
  if (assetType === "shape_model" || assetType === "clock_model" || assetType === "counter") {
    return "live";
  }

  if (source) {
    return "approved";
  }

  if (assetType === "animation") {
    return "planned";
  }

  return "missing";
}

function getModelAssetType(worldId: string, topicTitle: string): AssetType | null {
  const value = `${worldId} ${topicTitle}`.toLowerCase();

  if (value.includes("clock") || value.includes("time")) {
    return "clock_model";
  }

  if (value.includes("shape") || value.includes("circle") || value.includes("square") || value.includes("triangle") || value.includes("rectangle")) {
    return "shape_model";
  }

  if (value.includes("number") || value.includes("count") || value.includes("more") || value.includes("less")) {
    return "counter";
  }

  return null;
}

function requirement({
  assetType,
  gradeLevel,
  label,
  requestGroup,
  source,
  topic,
  world,
  stage,
}: {
  assetType: AssetType;
  gradeLevel: LearnerGradeLevel;
  label: string;
  requestGroup: string;
  source?: ImageSourcePropType;
  topic?: CurriculumTopic;
  world: CurriculumWorld;
  stage?: ActiveLearningPhase | FrameworkStageLabel;
}): AssetRequirement {
  const topicId = topic ? getTopicAssetId(world.id, topic.title) : undefined;
  const assetId = [
    getGradePath(gradeLevel),
    world.id,
    topic ? slugifyAssetId(topic.title) : "world",
    stage ? slugifyAssetId(stage) : "",
    assetType,
  ]
    .filter(Boolean)
    .join("_");

  return {
    altText: `${label} ${assetType.replace(/_/g, " ")}`,
    assetId,
    assetType,
    firebasePath: getFirebasePath(gradeLevel, world.id, topic?.title, assetType, assetId),
    gradeLevel,
    label,
    priority: getPriority(topic, assetType),
    prompt: getPrompt(label, gradeLevel, assetType),
    requestGroup,
    source,
    stage,
    status: getStatus(assetType, source),
    topicId,
    topicTitle: topic?.title,
    worldId: world.id,
    worldTitle: world.title,
  };
}

function getSpecialRequirements(
  gradeLevel: LearnerGradeLevel,
  world: CurriculumWorld,
  topic: CurriculumTopic
) {
  const topicTitle = topic.title;
  const value = `${world.id} ${topicTitle}`.toLowerCase();
  const requirements: AssetRequirement[] = [];
  const add = (assetType: AssetType, label: string, requestGroup: string) => {
    requirements.push(requirement({ assetType, gradeLevel, label, requestGroup, topic, world }));
  };

  if (world.id === "grade1-reading") {
    const readingLabels: Record<string, string[]> = {
      i: ["Child Pointing to Self", "Audio: I", "Sentence Card", "Reading Activity Card"],
      you: ["Child Pointing to Friend", "Audio: You", "Sentence Card", "Reading Activity Card"],
      we: ["Group of Children", "Audio: We", "Sentence Card", "Reading Activity Card"],
    };
    const key = slugifyAssetId(topicTitle);
    const labels = readingLabels[key];

    labels?.forEach((label) => {
      add(label.startsWith("Audio") ? "audio" : label.includes("Activity") ? "play_image" : "look_image", label, "Reading Quest");
    });
  }

  if (world.id === "grade1-family-story-village" || value.includes("story")) {
    ["Story Characters", "Story Scenes", "Sequence Scenes", "Story Audio", "Character Portraits"].forEach((label) => {
      add(
        label.includes("Audio") ? "audio" : label.includes("Character") ? "story_character" : "story_scene",
        `${topicTitle} ${label}`,
        "Family Story Village"
      );
    });
  }

  if (value.includes("number") || value.includes("math") || value.includes("more") || value.includes("less")) {
    ["Counters", "Number Lines", "Comparison Models", "Quantity Images", "Math Objects"].forEach((label) => {
      add(label === "Counters" ? "counter" : "play_image", `${topicTitle} ${label}`, "Number System");
    });
  }

  if (value.includes("shape") || value.includes("circle") || value.includes("square") || value.includes("triangle") || value.includes("rectangle")) {
    ["Shape Models", "Real-World Shape Images", "Sides Highlights", "Corner Highlights", "Shape Hunt Assets"].forEach((label) => {
      add(label === "Shape Models" ? "shape_model" : "look_image", `${topicTitle} ${label}`, "Shape System");
    });
  }

  if (world.id === "grade1-time-town" || value.includes("clock") || value.includes("time")) {
    ["Clock Assets", "Routine Scenes", "Morning Images", "Afternoon Images", "Evening Images", "Sequence Cards"].forEach((label) => {
      add(label === "Clock Assets" ? "clock_model" : "story_scene", `${topicTitle} ${label}`, "Time Town");
    });
  }

  return requirements;
}

export function getCurriculumAssetRequirements() {
  const assets: AssetRequirement[] = [];

  CURRICULUM.forEach((grade) => {
    const playBackground = PLAY_BACKGROUNDS[grade.gradeLevel];

    grade.worlds.forEach((world) => {
      const worldSource = WORLD_IMAGES[world.id];

      assets.push(
        requirement({
          assetType: "world_background",
          gradeLevel: grade.gradeLevel,
          label: `${world.title} World Art`,
          requestGroup: "World Art",
          source: worldSource,
          world,
        }),
        requirement({
          assetType: "play_background",
          gradeLevel: grade.gradeLevel,
          label: `${grade.gradeLevel} Play Background`,
          requestGroup: "Background Assets",
          source: playBackground,
          world,
        })
      );

      world.topics.forEach((topic) => {
        const topicId = getTopicAssetId(world.id, topic.title);
        const topicSource = TOPIC_IMAGES[topicId];
        const modelType = getModelAssetType(world.id, topic.title);

        assets.push(
          requirement({
            assetType: "hero_image",
            gradeLevel: grade.gradeLevel,
            label: `${topic.title} Hero Image`,
            requestGroup: "Topic Art",
            source: topicSource,
            topic,
            world,
          }),
          requirement({
            assetType: "topic_icon",
            gradeLevel: grade.gradeLevel,
            label: `${topic.title} Topic Icon`,
            requestGroup: "Icons",
            source: topicSource,
            topic,
            world,
          }),
          requirement({
            assetType: "audio",
            gradeLevel: grade.gradeLevel,
            label: `${topic.title} Pronunciation Audio`,
            requestGroup: "Audio",
            topic,
            world,
          })
        );

        if (modelType) {
          assets.push(
            requirement({
              assetType: modelType,
              gradeLevel: grade.gradeLevel,
              label: `${topic.title} Generated Model`,
              requestGroup: "Generated Models",
              topic,
              world,
            })
          );
        }

        ACTIVE_LEARNING_PHASES.forEach((phase) => {
          const assetType = STAGE_TO_ASSET_TYPE[phase];

          if (!assetType) {
            return;
          }

          assets.push(
            requirement({
              assetType,
              gradeLevel: grade.gradeLevel,
              label: `${topic.title} ${phase} Asset`,
              requestGroup: "Stage Art",
              source: topicSource,
              topic,
              world,
              stage: phase,
            })
          );
        });

        assets.push(
          requirement({
            assetType: "animation",
            gradeLevel: grade.gradeLevel,
            label: `${topic.title} Learning Animation`,
            requestGroup: "Animations",
            topic,
            world,
          }),
          ...getSpecialRequirements(grade.gradeLevel, world, topic)
        );
      });
    });
  });

  assets.push(
    {
      ...requirement({
        assetType: "badge",
        gradeLevel: "Preschool",
        label: "Reward Badge",
        requestGroup: "Rewards",
        source: REWARD_ASSETS.badge,
        world: CURRICULUM[0].worlds[0],
      }),
      status: "approved",
    },
    {
      ...requirement({
        assetType: "achievement",
        gradeLevel: "Preschool",
        label: "Achievement Icon",
        requestGroup: "Rewards",
        source: REWARD_ASSETS.achievement,
        world: CURRICULUM[0].worlds[0],
      }),
      status: "approved",
    },
    {
      ...requirement({
        assetType: "avatar",
        gradeLevel: "Preschool",
        label: "Rank Avatar Platform",
        requestGroup: "Avatars",
        source: RANK_ASSETS.platform,
        world: CURRICULUM[0].worlds[0],
      }),
      status: "approved",
    }
  );

  return assets;
}

export function getAssetReadinessSummary(assets: AssetRequirement[] = getCurriculumAssetRequirements()): AssetReadinessSummary {
  const required = assets.length;
  const approved = assets.filter((asset) => asset.status === "approved").length;
  const live = assets.filter((asset) => asset.status === "live").length;
  const uploaded = assets.filter((asset) => asset.status === "uploaded").length;
  const planned = assets.filter((asset) => asset.status === "planned" || asset.status === "in_progress").length;
  const ready = approved + live;
  const missing = assets.filter((asset) => asset.status === "missing" || asset.status === "planned").length;

  return {
    approved,
    completionPercentage: required ? Math.round((ready / required) * 1000) / 10 : 0,
    live,
    missing,
    planned,
    required,
    uploaded,
  };
}

function toCoverageRow(id: string, label: string, assets: AssetRequirement[]): AssetCoverageRow {
  return {
    id,
    label,
    ...getAssetReadinessSummary(assets),
  };
}

export function getGradeAssetCoverage(assets: AssetRequirement[] = getCurriculumAssetRequirements()) {
  return CURRICULUM.map((grade) =>
    toCoverageRow(
      grade.gradeLevel,
      grade.gradeLevel,
      assets.filter((asset) => asset.gradeLevel === grade.gradeLevel)
    )
  );
}

export function getWorldAssetCoverage(assets: AssetRequirement[] = getCurriculumAssetRequirements()) {
  return CURRICULUM.flatMap((grade) =>
    grade.worlds.map((world) =>
      toCoverageRow(
        world.id,
        world.title,
        assets.filter((asset) => asset.worldId === world.id)
      )
    )
  );
}

export function getTopicAssetCoverage(assets: AssetRequirement[] = getCurriculumAssetRequirements()) {
  const topicRows = new Map<string, { label: string; assets: AssetRequirement[] }>();

  assets.forEach((asset) => {
    if (!asset.topicId || !asset.topicTitle) {
      return;
    }

    const current = topicRows.get(asset.topicId) ?? { label: asset.topicTitle, assets: [] };
    current.assets.push(asset);
    topicRows.set(asset.topicId, current);
  });

  return Array.from(topicRows.entries()).map(([id, row]) => toCoverageRow(id, row.label, row.assets));
}

export function getAssetTypeCoverage(assets: AssetRequirement[] = getCurriculumAssetRequirements()) {
  const types = Array.from(new Set(assets.map((asset) => asset.assetType))).sort();

  return types.map((type) =>
    toCoverageRow(
      type,
      type.replace(/_/g, " "),
      assets.filter((asset) => asset.assetType === type)
    )
  );
}

export function filterAssetRequirementsForSection(
  section: AssetCenterSectionId,
  assets: AssetRequirement[] = getCurriculumAssetRequirements()
) {
  if (section === "missing" || section === "requests") {
    return assets.filter((asset) => asset.status === "missing" || asset.status === "planned");
  }

  const sectionTypes = SECTION_TO_TYPES[section];

  if (!sectionTypes) {
    return assets;
  }

  return assets.filter((asset) => sectionTypes.includes(asset.assetType));
}

export function generateAssetRequests(assets: AssetRequirement[] = getCurriculumAssetRequirements()): AssetRequest[] {
  const missingAssets = assets.filter((asset) => asset.status === "missing" || asset.status === "planned");
  const groups = new Map<string, AssetRequest>();

  missingAssets.forEach((asset) => {
    const groupId = `${asset.gradeLevel}:${asset.worldId}:${asset.topicId ?? "world"}:${asset.requestGroup}`;
    const current = groups.get(groupId) ?? {
      gradeLevel: asset.gradeLevel,
      id: groupId,
      missingAssets: [],
      promptBundle: [],
      title: `${asset.worldTitle}${asset.topicTitle ? ` / ${asset.topicTitle}` : ""} / ${asset.requestGroup}`,
      topicTitle: asset.topicTitle,
      worldTitle: asset.worldTitle,
    };

    current.missingAssets.push(asset);
    current.promptBundle.push(`${asset.label}: ${asset.prompt}`);
    groups.set(groupId, current);
  });

  return Array.from(groups.values()).sort((first, second) => second.missingAssets.length - first.missingAssets.length);
}

export function validateAssetReadiness(assets: AssetRequirement[] = getCurriculumAssetRequirements()) {
  const issues: AssetReadinessIssue[] = [];
  const ids = new Set<string>();
  const topics = new Set(
    CURRICULUM.flatMap((grade) =>
      grade.worlds.flatMap((world) =>
        world.topics.map((topic) => getTopicAssetId(world.id, topic.title))
      )
    )
  );
  const topicAssetCounts = new Map<string, number>();

  assets.forEach((asset) => {
    ids.add(asset.assetId);

    if (!asset.status) {
      issues.push({ assetId: asset.assetId, issue: "Asset must have a status.", severity: "critical" });
    }

    if (!asset.prompt) {
      issues.push({ assetId: asset.assetId, issue: "Asset must have prompt metadata.", severity: "critical" });
    }

    if (!asset.gradeLevel || !asset.worldId) {
      issues.push({ assetId: asset.assetId, issue: "Asset must have grade and world mapping.", severity: "critical" });
    }

    if (asset.topicId) {
      topicAssetCounts.set(asset.topicId, (topicAssetCounts.get(asset.topicId) ?? 0) + 1);
    }

    if (IMAGE_ASSET_TYPES.has(asset.assetType) && !asset.source && asset.status === "approved") {
      issues.push({ assetId: asset.assetId, issue: "Approved image assets must resolve to a source.", severity: "critical" });
    }
  });

  if (ids.size !== assets.length) {
    issues.push({ assetId: "asset-registry", issue: "Asset IDs must be unique.", severity: "critical" });
  }

  topics.forEach((topicId) => {
    if (!topicAssetCounts.get(topicId)) {
      issues.push({ assetId: topicId, issue: "Every topic must have asset requirements.", severity: "critical" });
    }
  });

  return {
    issueCount: issues.length,
    issues,
    valid: issues.every((issue) => issue.severity !== "critical"),
  };
}

export function getFirebaseAssetFolderPlan() {
  return CURRICULUM.map((grade) => ({
    gradeLevel: grade.gradeLevel,
    root: `curriculum-assets/${getGradePath(grade.gradeLevel)}/`,
    worlds: grade.worlds.map((world) => ({
      path: `curriculum-assets/${getGradePath(grade.gradeLevel)}/${getWorldPath(world.id)}/`,
      topics: world.topics.map((topic) => ({
        audio: `curriculum-assets/${getGradePath(grade.gradeLevel)}/${getWorldPath(world.id)}/${slugifyAssetId(topic.title)}/audio/`,
        images: `curriculum-assets/${getGradePath(grade.gradeLevel)}/${getWorldPath(world.id)}/${slugifyAssetId(topic.title)}/images/`,
        animation: `curriculum-assets/${getGradePath(grade.gradeLevel)}/${getWorldPath(world.id)}/${slugifyAssetId(topic.title)}/animation/`,
        topic: topic.title,
      })),
      worldId: world.id,
      worldTitle: world.title,
    })),
  }));
}
