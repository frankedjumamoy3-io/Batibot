import { batibotAssetRegistry } from "@/src/assets/assetRegistry";
import type {
  ActivityType,
  AssetSlotRule,
  BatiBotMetadataError as MetadataErrorType,
  ChoiceRules,
  CurriculumAuthoringRule,
  EditableStageField,
  FeedbackRules,
  GradeMetadata,
  LockedStageSection,
  MetadataDiagnostic,
  MobileLayoutRules,
  StageTemplate,
  StageType,
  TimerRules,
  TopicMetadata,
  WorldMetadata,
  WorldTopicTemplate,
} from "@/src/domain/admin/curriculum-metadata";
import { BatiBotMetadataError } from "@/src/domain/admin/curriculum-metadata";
import type { AdminStageDraft, AdminTopicDraft } from "@/src/domain/admin/topic-draft";
import { toTopicSlug } from "@/src/domain/admin/topic-draft";
import {
  CURRICULUM,
  type CurriculumTopic,
  type CurriculumWorld,
  type GradeCurriculum,
} from "@/src/data/curriculum/learning-path";

export const BATIBOT_STAGE_ORDER: StageType[] = ["LOOK", "TAP", "TRY", "CHOOSE", "PLAY", "REWARD"];

type MetadataIndex = {
  diagnostics: MetadataDiagnostic[];
  grades: GradeMetadata[];
  gradeSources: Map<string, GradeCurriculum>;
  topics: Map<string, TopicMetadata>;
  topicSources: Map<string, CurriculumTopic>;
  worlds: Map<string, WorldMetadata>;
  worldSources: Map<string, CurriculumWorld>;
};

const templateCache = new Map<string, WorldTopicTemplate>();
let indexCache: MetadataIndex | null = null;
let diagnosticsReported = false;

export function listGrades(): GradeMetadata[] {
  return getIndex().grades.map(copyGrade);
}

export function listWorldsByGrade(gradeLevel: string): WorldMetadata[] {
  const grade = getGradeMetadata(gradeLevel);
  return grade.worldIds.map((worldId) => copyWorld(getRequiredWorld(grade.id, worldId)));
}

export function listTopicsByWorld(
  gradeLevel: string,
  worldId: string,
  options: { includeChallenge?: boolean } = {}
): TopicMetadata[] {
  const world = getWorldMetadata(gradeLevel, worldId);
  return world.topicIds
    .map((topicId) => copyTopic(getRequiredTopic(world.gradeLevel, world.id, topicId)))
    .filter((topic) => options.includeChallenge || !topic.isChallenge);
}

export function getGradeMetadata(gradeLevel: string): GradeMetadata {
  const normalized = normalizeGradeLevel(gradeLevel);
  const grade = getIndex().grades.find((item) => item.id === normalized);
  if (!grade) throw metadataError("UNKNOWN_GRADE", `Unknown grade: ${gradeLevel}`);
  return copyGrade(grade);
}

export function getWorldMetadata(gradeLevel: string, worldId: string): WorldMetadata {
  const grade = normalizeGradeLevel(gradeLevel);
  const world = getRequiredWorld(grade, normalizeWorldId(worldId));
  return copyWorld(world);
}

export function getTopicMetadata(
  gradeLevel: string,
  worldId: string,
  topicId: string
): TopicMetadata {
  const world = getWorldMetadata(gradeLevel, worldId);
  return copyTopic(getRequiredTopic(world.gradeLevel, world.id, normalizeTopicId(topicId, world.gradeLevel, world.id)));
}

export function getWorldTopicTemplate(input: {
  gradeLevel: string;
  worldId: string;
}): WorldTopicTemplate {
  const world = getWorldMetadata(input.gradeLevel, input.worldId);
  const cacheKey = worldKey(world.gradeLevel, world.id);
  const cached = templateCache.get(cacheKey);
  if (cached) return cloneTemplate(cached);
  const sourceTopic = resolveTemplateSource(world);
  const source = sourceTopic ? getIndex().topicSources.get(topicKey(world.gradeLevel, world.id, sourceTopic.id)) : undefined;
  const rendererKey = source?.requiredRenderer?.trim() || `${inferWorldDomain(getWorldSource(world))}StageRenderer`;
  const stageTemplates = Object.fromEntries(
    BATIBOT_STAGE_ORDER.map((stageType, stageIndex) => [
      stageType,
      buildStageTemplate({ rendererKey, stageIndex, stageType, world }),
    ])
  ) as Record<StageType, StageTemplate>;
  const template: WorldTopicTemplate = {
    curriculumRules: getCurriculumRules(world),
    gradeLevel: world.gradeLevel,
    sourceTopicId: sourceTopic?.id,
    stageOrder: [...BATIBOT_STAGE_ORDER],
    stageTemplates,
    topicPlacementRule: { challengeTopicId: world.challengeTopicId, strategy: "beforeChallenge" },
    worldId: world.id,
    worldTheme: { ...world.theme },
  };
  templateCache.set(cacheKey, template);
  return cloneTemplate(template);
}

export function getStageTemplate(input: {
  gradeLevel: string;
  stageType: StageType | string;
  worldId: string;
}): StageTemplate {
  const stageType = normalizeStageType(input.stageType);
  const template = getWorldTopicTemplate(input);
  return cloneStageTemplate(template.stageTemplates[stageType]);
}

export function getNewTopicInsertionIndex(input: {
  gradeLevel: string;
  worldId: string;
}): number {
  const world = getWorldMetadata(input.gradeLevel, input.worldId);
  return world.challengeTopicId ? world.topicIds.indexOf(world.challengeTopicId) : world.topicIds.length;
}

export function createEmptyTopicShell(input: {
  gradeLevel: string;
  objective: string;
  topicTitle: string;
  worldId: string;
}): AdminTopicDraft {
  const world = getWorldMetadata(input.gradeLevel, input.worldId);
  const template = getWorldTopicTemplate({ gradeLevel: world.gradeLevel, worldId: world.id });
  const now = new Date().toISOString();
  const topicSlug = toTopicSlug(input.topicTitle);
  const stages = template.stageOrder.map((stageType) => emptyStage(template.stageTemplates[stageType]));
  return {
    createdAt: now,
    createdBy: "system",
    difficulty: defaultDifficulty(world.gradeLevel),
    gradeLevel: world.gradeLevel,
    id: "",
    mode: "create",
    objective: input.objective.trim(),
    stages,
    status: "draft",
    templateSnapshot: template,
    topicId: topicSlug,
    topicSlug,
    topicTitle: input.topicTitle.trim(),
    updatedAt: now,
    updatedBy: "system",
    worldId: world.id,
  };
}

export function normalizeGradeLevel(value: string) {
  const token = normalizeToken(value);
  const aliases: Record<string, string> = {
    grade1: "Grade 1", grade2: "Grade 2", grade3: "Grade 3",
    kindergarten: "Kindergarten", kinder: "Kindergarten", preschool: "Preschool",
  };
  const normalized = aliases[token];
  if (!normalized || !CURRICULUM.some((grade) => grade.gradeLevel === normalized)) {
    throw metadataError("UNKNOWN_GRADE", `Unknown grade identifier: ${value}`);
  }
  return normalized;
}

export function normalizeWorldId(value: string) {
  const exact = [...getIndex().worlds.values()].find((world) => world.id.toLowerCase() === value.trim().toLowerCase());
  if (!exact) throw metadataError("UNKNOWN_WORLD", `Unknown world identifier: ${value}`);
  return exact.id;
}

export function normalizeTopicId(value: string, gradeLevel: string, worldId: string) {
  const grade = normalizeGradeLevel(gradeLevel);
  const world = normalizeWorldId(worldId);
  const candidate = toTopicSlug(value);
  if (!getIndex().topics.has(topicKey(grade, world, candidate))) {
    throw metadataError("UNKNOWN_TOPIC", `Unknown topic identifier: ${value}`);
  }
  return candidate;
}

export function normalizeStageType(value: string): StageType {
  const normalized = value.trim().toUpperCase() === "STAR" ? "REWARD" : value.trim().toUpperCase();
  if (!BATIBOT_STAGE_ORDER.includes(normalized as StageType)) {
    throw metadataError("UNKNOWN_STAGE", `Unknown stage identifier: ${value}`);
  }
  return normalized as StageType;
}

export function validateMetadataIndex(): MetadataDiagnostic[] {
  return getIndex().diagnostics.map((item) => ({ ...item }));
}

function buildIndex(): MetadataIndex {
  const diagnostics: MetadataDiagnostic[] = [];
  const grades: GradeMetadata[] = [];
  const gradeSources = new Map<string, GradeCurriculum>();
  const worlds = new Map<string, WorldMetadata>();
  const worldSources = new Map<string, CurriculumWorld>();
  const topics = new Map<string, TopicMetadata>();
  const topicSources = new Map<string, CurriculumTopic>();
  CURRICULUM.forEach((gradeSource, gradeOrder) => {
    const gradeId = gradeSource.gradeLevel;
    if (gradeSources.has(gradeId)) diagnostics.push(issue("DUPLICATE_GRADE", `Duplicate grade ID ${gradeId}.`, "error"));
    gradeSources.set(gradeId, gradeSource);
    const worldIds: string[] = [];
    gradeSource.worlds.forEach((worldSource, worldOrder) => {
      const key = worldKey(gradeId, worldSource.id);
      if (worlds.has(key)) diagnostics.push(issue("DUPLICATE_WORLD", `Duplicate world ID ${worldSource.id} in ${gradeId}.`, "error"));
      worldIds.push(worldSource.id);
      const topicIds: string[] = [];
      let challengeTopicId: string | undefined;
      worldSource.topics.forEach((topicSource, topicOrder) => {
        const id = toTopicSlug(topicSource.title);
        const keyValue = topicKey(gradeId, worldSource.id, id);
        if (topics.has(keyValue)) diagnostics.push(issue("DUPLICATE_TOPIC", `Duplicate topic ID ${id} in ${worldSource.id}.`, "error"));
        const isChallenge = /challenge/i.test(topicSource.title);
        if (isChallenge) challengeTopicId = id;
        topicIds.push(id);
        const assetRefs = Object.values(batibotAssetRegistry).filter((asset) => asset.world === worldSource.id && (asset.topic === id || asset.topic === topicSource.title)).map((asset) => asset.key);
        topics.set(keyValue, { assetRefs, difficulty: defaultDifficulty(gradeId), gradeLevel: gradeId, id, isChallenge, isPublishedStatic: true, objective: topicSource.batibotContent?.learningObjective ?? topicSource.competencyObjective, order: topicOrder, slug: id, stageTypes: [...BATIBOT_STAGE_ORDER], title: topicSource.title, worldId: worldSource.id });
        topicSources.set(keyValue, topicSource);
      });
      if (!challengeTopicId) diagnostics.push(issue("MISSING_CHALLENGE", `${worldSource.id} has no challenge topic; new topics will append.`, "warning"));
      else if (topicIds.at(-1) !== challengeTopicId) diagnostics.push(issue("CHALLENGE_NOT_LAST", `${worldSource.id} challenge topic is not last.`, "warning"));
      const worldAssets = Object.values(batibotAssetRegistry).filter((asset) => asset.world === worldSource.id);
      const metadata: WorldMetadata = { challengeTopicId, defaultStageOrder: [...BATIBOT_STAGE_ORDER], description: worldSource.description, gradeLevel: gradeId, id: worldSource.id, order: worldOrder, templateSourceTopicId: topicIds.find((id) => id !== challengeTopicId), theme: { accentColorToken: worldSource.accentColor, backgroundRef: worldAssets.find((asset) => asset.tags?.includes("background"))?.key, cardStyleKey: "standardLessonCard", primaryColorToken: "batibotPurple", worldIconRef: worldAssets.find((asset) => !asset.tags?.includes("background"))?.key }, title: worldSource.title, topicIds };
      worlds.set(key, metadata);
      worldSources.set(key, worldSource);
    });
    grades.push({ curriculumFocus: gradeFocus(gradeId), id: gradeId, order: gradeOrder, targetLearnerDescription: learnerDescription(gradeId), title: gradeSource.title, worldIds });
  });
  return { diagnostics, grades, gradeSources, topics, topicSources, worlds, worldSources };
}

function buildStageTemplate(input: { rendererKey: string; stageIndex: number; stageType: StageType; world: WorldMetadata }): StageTemplate {
  const { stageType, world } = input;
  return { allowedActivityTypes: allowedActivities(stageType, getWorldSource(world)), assetSlotRules: assetSlots(stageType, world.gradeLevel), choiceRules: stageType === "TRY" || stageType === "CHOOSE" ? choiceRules(stageType, world.gradeLevel) : undefined, editableFields: editableFields(stageType), feedbackRules: feedbackRules(stageType), layoutKey: "standardStage", lockedSections: lockedSections(), mobileLayoutRules: mobileRules(stageType, world.gradeLevel), optionalFields: optionalFields(stageType), rendererKey: input.rendererKey, requiredFields: requiredFields(stageType), stageIndex: input.stageIndex + 1, stageType, timerRules: timerRules(stageType), totalStages: BATIBOT_STAGE_ORDER.length };
}

function editableFields(stage: StageType): EditableStageField[] {
  const map: Record<StageType, EditableStageField[]> = {
    LOOK: ["instruction", "title", "word", "meaning", "body", "example", "assetRefs"],
    TAP: ["instruction", "meaning", "example", "body", "pronunciationText", "assetRefs"],
    TRY: ["instruction", "question", "choices", "correctAnswer", "feedbackCorrect", "feedbackIncorrect", "assetRefs"],
    CHOOSE: ["instruction", "passage", "question", "choices", "correctAnswer", "feedbackCorrect", "feedbackIncorrect", "assetRefs"],
    PLAY: ["instruction", "activityType", "activityPrompt", "correctAnswer", "feedbackCorrect", "feedbackIncorrect", "timerSeconds", "assetRefs"],
    REWARD: ["instruction", "title", "body", "example", "assetRefs"],
  };
  return map[stage];
}

function requiredFields(stage: StageType) { const map: Record<StageType, string[]> = { LOOK: ["instruction", "title"], TAP: ["instruction", "meaning"], TRY: ["instruction", "question", "choices", "correctAnswer"], CHOOSE: ["instruction", "question", "choices", "correctAnswer"], PLAY: ["instruction", "activityType", "activityPrompt", "correctAnswer"], REWARD: ["instruction", "title", "body"] }; return map[stage]; }
function optionalFields(stage: StageType) { return editableFields(stage).filter((field) => !requiredFields(stage).includes(field)); }
function lockedSections(): LockedStageSection[] { return ["header", "progress", "contentContainer", "feedbackContainer", "primaryButton", "stageOrder", "worldTheme", "rendererKey"]; }
function choiceRules(stage: "TRY" | "CHOOSE", grade: string): ChoiceRules { const early = grade === "Preschool" || grade === "Kindergarten" || grade === "Grade 1"; return { allowImageChoices: early, allowMixedChoices: early, allowTextChoices: true, correctAnswerCount: 1, maxChoices: stage === "TRY" ? 3 : 4, minChoices: 2, preventDuplicateAssets: true, preventDuplicateLabels: true }; }
function feedbackRules(stage: StageType): FeedbackRules { const assessed = stage === "TRY" || stage === "CHOOSE" || stage === "PLAY"; return { correctStateKey: "correct", defaultCorrectText: "Great!", defaultIncorrectText: "Try Again.", incorrectStateKey: "wrong", requiresCorrectFeedback: assessed, requiresIncorrectFeedback: assessed }; }
function timerRules(stage: StageType): TimerRules | undefined { return stage === "PLAY" ? { defaultSeconds: 20, editableByAdmin: true, enabled: true, maximumSeconds: 90, minimumSeconds: 10 } : undefined; }
function mobileRules(stage: StageType, grade: string): MobileLayoutRules { const upper = grade === "Grade 2" || grade === "Grade 3"; return { contentScrollable: stage === "CHOOSE" || stage === "PLAY" || upper, fixedBottomButton: true, longChoiceLayout: "column", maxChoiceCountVisibleWithoutScroll: 4, maxChoiceLines: upper ? 3 : 2, maxInstructionLines: 2, maxQuestionLines: 2, maxTitleLines: 2, passageInternallyScrollable: upper && (stage === "CHOOSE" || stage === "PLAY"), shortChoiceLayout: stage === "TRY" ? "row" : "grid" }; }

function assetSlots(stage: StageType, grade: string): AssetSlotRule[] {
  const early = grade === "Preschool" || grade === "Kindergarten";
  if (stage === "LOOK") return [slot("look-primary", "primaryVisual", "image", early, early ? 1 : 0, 1)];
  if (stage === "TAP") return [slot("tap-primary", "primaryVisual", "image", early, early ? 1 : 0, 4), slot("tap-audio", "audio", "audio", false, 0, 4)];
  if (stage === "TRY" || stage === "CHOOSE") return [slot(`${stage.toLowerCase()}-choices`, "choiceVisual", "image", false, 0, stage === "TRY" ? 3 : 4)];
  if (stage === "PLAY") return [slot("play-items", "draggable", "image", false, 0, 6), slot("play-zone", "dropZone", "image", false, 0, 2)];
  return [slot("reward-visual", "rewardVisual", "icon", false, 0, 1)];
}

function slot(id: string, role: AssetSlotRule["role"], type: AssetSlotRule["type"], required: boolean, minCount: number, maxCount: number): AssetSlotRule { return { allowSharedAsset: true, id, maxCount, minCount, required, role, type }; }

function allowedActivities(stage: StageType, world: CurriculumWorld): ActivityType[] {
  if (stage === "LOOK") return ["tapReveal"];
  if (stage === "TAP") return inferWorldDomain(world) === "reading" ? ["tapReveal", "speak"] : ["tapReveal"];
  if (stage === "TRY" || stage === "CHOOSE") return ["singleChoice"];
  if (stage === "REWARD") return [];
  const id = world.id.toLowerCase();
  if (id.includes("money")) return ["moneyBuilder", "matching", "count"];
  if (id.includes("fraction")) return ["fractionSelect", "sorting", "matching"];
  if (id.includes("time")) return ["clockInteraction", "matching", "sequence"];
  if (id.includes("number") || id.includes("math") || id.includes("multiplication") || id.includes("division") || id.includes("place-value")) return ["equationBuilder", "build", "matching", "sorting", "count"];
  if (inferWorldDomain(world) === "reading") return ["highlight", "sequence", "matching", "speak"];
  return ["dragDrop", "matching", "sorting", "sequence", "speak"];
}

function getCurriculumRules(world: WorldMetadata): CurriculumAuthoringRule[] { return [
  { id: "topic-match", severity: "error", description: "Content must match the selected topic." },
  { id: "one-objective", severity: "error", description: "Each stage must support one primary objective." },
  { id: "concise-instruction", severity: "error", description: "Instructions must fit two mobile lines." },
  { id: "age-appropriate", severity: "error", description: "Examples must fit the selected grade." },
  { id: "no-placeholder", severity: "error", description: "Placeholder or developer content is not allowed." },
  { id: "valid-choices", severity: "error", description: "Choice stages need unique choices and a visible correct answer.", appliesToStages: ["TRY", "CHOOSE"] },
  { id: "interactive-play", severity: "error", description: "PLAY must use a meaningful interaction.", appliesToStages: ["PLAY"] },
  { id: "registered-assets", severity: "error", description: "Assets must come from registered or uploaded admin assets." },
  { id: "mobile-fit", severity: "error", description: "Content must fit the standard mobile shell." },
  { id: "template-not-challenge", severity: "error", description: "Challenge topics cannot be template sources." },
  { id: "insert-before-challenge", severity: world.challengeTopicId ? "error" : "warning", description: "Published new topics are inserted immediately before the world challenge." },
]; }

function emptyStage(template: StageTemplate): AdminStageDraft { return { activityType: template.allowedActivityTypes[0], assetRefs: [], choices: template.choiceRules ? [] : undefined, correctAnswerIds: template.choiceRules ? [] : undefined, feedbackCorrect: template.feedbackRules.requiresCorrectFeedback ? "" : undefined, feedbackIncorrect: template.feedbackRules.requiresIncorrectFeedback ? "" : undefined, instruction: "", isComplete: false, stageType: template.stageType }; }
function resolveTemplateSource(world: WorldMetadata) { const topics = listTopicsByWorld(world.gradeLevel, world.id); return topics.find((topic) => hasCompleteStages(topic)) ?? topics[0]; }
function hasCompleteStages(topic: TopicMetadata) { const source = getIndex().topicSources.get(topicKey(topic.gradeLevel, topic.worldId, topic.id)); const labels = new Set((source?.frameworkStages ?? []).map((stage) => stage.stage === "STAR" ? "REWARD" : stage.stage)); return BATIBOT_STAGE_ORDER.every((stage) => labels.has(stage)); }
function getRequiredWorld(grade: string, world: string) { const value = getIndex().worlds.get(worldKey(grade, world)); if (!value) throw metadataError("UNKNOWN_WORLD", `World ${world} does not belong to ${grade}.`); return value; }
function getRequiredTopic(grade: string, world: string, topic: string) { const value = getIndex().topics.get(topicKey(grade, world, topic)); if (!value) throw metadataError("UNKNOWN_TOPIC", `Topic ${topic} does not belong to ${world}.`); return value; }
function getWorldSource(world: WorldMetadata) { const source = getIndex().worldSources.get(worldKey(world.gradeLevel, world.id)); if (!source) throw metadataError("UNKNOWN_WORLD", `World source ${world.id} is unavailable.`); return source; }
function getIndex() { if (!indexCache) indexCache = buildIndex(); if (__DEV__ && !diagnosticsReported) { diagnosticsReported = true; indexCache.diagnostics.slice(0, 20).forEach((item) => console.warn(`[BatiBotMetadata:${item.code}] ${item.message}`)); } return indexCache; }
function metadataError(code: MetadataErrorType["code"], message: string) { return new BatiBotMetadataError(code, message); }
function issue(code: string, message: string, severity: MetadataDiagnostic["severity"]): MetadataDiagnostic { return { code, message, severity }; }
function worldKey(grade: string, world: string) { return `${grade}::${world}`; }
function topicKey(grade: string, world: string, topic: string) { return `${grade}::${world}::${topic}`; }
function normalizeToken(value: string) { return value.trim().toLowerCase().replace(/[^a-z0-9]/g, ""); }
function inferWorldDomain(world: CurriculumWorld) { const text = `${world.id} ${world.title} ${world.description}`.toLowerCase(); if (/reading|story|context|word|vocabulary|alphabet|family|animal|food|nature|community/.test(text)) return "reading"; if (/number|math|count|shape|fraction|money|division|multiplication|measure|time|pattern|size|less/.test(text)) return "math"; return "mixed"; }
function defaultDifficulty(grade: string): "easy" | "medium" | "hard" { return grade === "Grade 3" ? "hard" : grade === "Grade 2" ? "medium" : "easy"; }
function gradeFocus(grade: string) { if (grade === "Preschool") return ["visual vocabulary", "concrete numeracy"]; if (grade === "Kindergarten") return ["early literacy", "counting", "patterns"]; if (grade === "Grade 1") return ["foundational reading", "basic operations"]; if (grade === "Grade 2") return ["fluency", "place value", "problem solving"]; return ["reading evidence", "multi-step mathematics", "fractions and money"]; }
function learnerDescription(grade: string) { return grade === "Preschool" ? "Image-first early learner" : grade === "Kindergarten" ? "Early reader and concrete numeracy learner" : `${grade} primary learner`; }
function copyGrade(value: GradeMetadata): GradeMetadata { return { ...value, curriculumFocus: [...value.curriculumFocus], worldIds: [...value.worldIds] }; }
function copyWorld(value: WorldMetadata): WorldMetadata { return { ...value, defaultStageOrder: [...value.defaultStageOrder], theme: { ...value.theme }, topicIds: [...value.topicIds] }; }
function copyTopic(value: TopicMetadata): TopicMetadata { return { ...value, assetRefs: value.assetRefs ? [...value.assetRefs] : undefined, stageTypes: [...value.stageTypes] }; }
function cloneStageTemplate(value: StageTemplate): StageTemplate { return { ...value, allowedActivityTypes: [...value.allowedActivityTypes], assetSlotRules: value.assetSlotRules.map((item) => ({ ...item })), choiceRules: value.choiceRules ? { ...value.choiceRules } : undefined, editableFields: [...value.editableFields], feedbackRules: { ...value.feedbackRules }, lockedSections: [...value.lockedSections], mobileLayoutRules: { ...value.mobileLayoutRules }, optionalFields: [...value.optionalFields], requiredFields: [...value.requiredFields], timerRules: value.timerRules ? { ...value.timerRules } : undefined }; }
function cloneTemplate(value: WorldTopicTemplate): WorldTopicTemplate { return { ...value, curriculumRules: value.curriculumRules.map((item) => ({ ...item, appliesToStages: item.appliesToStages ? [...item.appliesToStages] : undefined })), stageOrder: [...value.stageOrder], stageTemplates: Object.fromEntries(BATIBOT_STAGE_ORDER.map((stage) => [stage, cloneStageTemplate(value.stageTemplates[stage])])) as Record<StageType, StageTemplate>, topicPlacementRule: { ...value.topicPlacementRule }, worldTheme: { ...value.worldTheme } }; }
