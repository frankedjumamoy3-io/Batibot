import type { StageTemplate } from "@/src/domain/admin/curriculum-metadata";
import type { StageTemplateContent } from "@/src/domain/lesson/stage-render";

export type LegacyStageTemplateLike = {
  activityTypes?: string[];
  choiceLayout?: string;
  editableFields?: string[];
  emptyContent?: Record<string, unknown>;
  gradeLevel?: string;
  id?: string;
  lockedSections?: string[];
  requiresAssets?: boolean;
  requiresChoices?: boolean;
  requiresCorrectAnswer?: boolean;
  requiresFeedback?: boolean;
  requiresQuestion?: boolean;
  stageIndex?: number;
  stageType?: string;
  topicTitle?: string;
  totalStages?: number;
};

export function adaptLegacyTemplateToSharedRenderer(
  legacy: LegacyStageTemplateLike
): StageTemplate {
  const stageType = normalizeLegacyStageType(legacy.stageType);
  const choiceStage = stageType === "TRY" || stageType === "CHOOSE";

  return {
    allowedActivityTypes: normalizeActivityTypes(legacy.activityTypes, stageType),
    assetSlotRules: legacy.requiresAssets
      ? [{
          allowSharedAsset: true,
          id: `${stageType.toLowerCase()}-primary-visual`,
          maxCount: 1,
          minCount: 1,
          required: true,
          role: "primaryVisual",
          type: "image",
        }]
      : [],
    choiceRules: choiceStage
      ? {
          allowImageChoices: true,
          allowMixedChoices: true,
          allowTextChoices: true,
          correctAnswerCount: 1,
          maxChoices: stageType === "TRY" ? 3 : 4,
          minChoices: 2,
          preventDuplicateAssets: true,
          preventDuplicateLabels: true,
        }
      : undefined,
    editableFields: (legacy.editableFields ?? []) as StageTemplate["editableFields"],
    feedbackRules: {
      correctStateKey: "correct",
      defaultCorrectText: "Great!",
      defaultIncorrectText: "Try Again.",
      incorrectStateKey: "wrong",
      requiresCorrectFeedback: legacy.requiresFeedback !== false,
      requiresIncorrectFeedback: legacy.requiresFeedback !== false,
    },
    layoutKey: "standardStage",
    lockedSections: [
      "header",
      "progress",
      "contentContainer",
      "feedbackContainer",
      "primaryButton",
      "stageOrder",
      "worldTheme",
      "rendererKey",
    ],
    mobileLayoutRules: {
      contentScrollable: stageType === "CHOOSE" || stageType === "PLAY",
      fixedBottomButton: true,
      longChoiceLayout: "column",
      maxChoiceCountVisibleWithoutScroll: 4,
      maxChoiceLines: 3,
      maxInstructionLines: 2,
      maxQuestionLines: 2,
      maxTitleLines: 2,
      passageInternallyScrollable: true,
      shortChoiceLayout: legacy.choiceLayout === "single-column" ? "column" : "grid",
    },
    optionalFields: [],
    rendererKey: "standard-stage",
    requiredFields: [
      "instruction",
      ...(legacy.requiresQuestion ? ["question"] : []),
      ...(legacy.requiresChoices ? ["choices"] : []),
      ...(legacy.requiresCorrectAnswer ? ["correctAnswer"] : []),
    ],
    stageIndex: legacy.stageIndex ?? 1,
    stageType,
    totalStages: legacy.totalStages ?? 6,
  };
}

export function adaptLegacyContentToSharedRenderer(
  legacyContent: unknown,
  template: StageTemplate,
  legacyTemplate?: LegacyStageTemplateLike
): StageTemplateContent {
  const root = asRecord(legacyContent);
  const stages = Array.isArray(root.stages) ? root.stages.map(asRecord) : [];
  const stage = stages.find((item) =>
    String(item.stageType ?? item.stageLabel ?? "").toUpperCase() === template.stageType
  ) ?? root;
  const fallback = asRecord(legacyTemplate?.emptyContent);

  return {
    activityData: stage.items,
    activityPrompt: stringValue(stage.activityPrompt),
    activityType: stringValue(stage.activityType ?? fallback.activityType),
    assets: normalizeLegacyAssets(stage, root),
    body: stringValue(stage.body ?? stage.content ?? root.body ?? root.content ?? fallback.body),
    choices: normalizeChoices(stage.choices ?? root.choices),
    correctAnswerIds: normalizeAnswerIds(stage.correctAnswerIds ?? stage.correctAnswer ?? root.correctAnswer),
    example: stringValue(stage.example ?? root.example),
    feedbackCorrect: stringValue(stage.feedbackCorrect ?? root.feedbackCorrect ?? fallback.feedbackCorrect) || "Great!",
    feedbackIncorrect: stringValue(stage.feedbackIncorrect ?? root.feedbackIncorrect ?? fallback.feedbackIncorrect) || "Try Again.",
    instruction: stringValue(stage.instruction ?? root.instruction ?? fallback.instruction),
    meaning: stringValue(stage.meaning ?? root.meaning),
    passage: stringValue(stage.passage ?? root.passage),
    question: stringValue(stage.question ?? root.question),
    stageType: template.stageType,
    title: stringValue(stage.title ?? root.title ?? legacyTemplate?.topicTitle),
  };
}

function normalizeLegacyAssets(stage: Record<string, unknown>, root: Record<string, unknown>) {
  const refs = asRecord(stage.assetRefs ?? root.assetRefs);
  const images = Array.isArray(refs.images) ? refs.images.filter((value): value is string => typeof value === "string") : [];
  if (images.length) return images.map(assetId => ({ assetId, role: "primaryVisual", type: "image" as const }));
  const uri = stringValue(stage.assetUri ?? root.assetUri);
  const key = stringValue(stage.assetKey ?? root.assetKey);
  if (!uri && !key) return [];
  return [{ assetId: key || uri, role: "primaryVisual", type: "image" as const, uri: uri || undefined }];
}

function normalizeChoices(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    const choice = asRecord(item);
    const label = stringValue(choice.label ?? choice.text).trim();
    if (!label || /^choice\s+[a-d]$/i.test(label)) return [];
    return [{
      assetRef: stringValue(choice.assetRef) || undefined,
      id: stringValue(choice.id) || `choice-${index + 1}`,
      isCorrect: choice.isCorrect === true || choice.correct === true,
      label,
    }];
  });
}

function normalizeAnswerIds(value: unknown) {
  if (typeof value === "string") return [value];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizeActivityTypes(
  value: string[] | undefined,
  stageType: StageTemplate["stageType"]
): StageTemplate["allowedActivityTypes"] {
  const supported = new Set<StageTemplate["allowedActivityTypes"][number]>([
    "tapReveal", "singleChoice", "multiChoice", "dragDrop", "matching", "sorting",
    "sequence", "build", "fillBlank", "speak", "count", "equationBuilder", "highlight",
    "clockInteraction", "fractionSelect", "moneyBuilder",
  ]);
  const normalized = (value ?? []).filter(
    (item): item is StageTemplate["allowedActivityTypes"][number] => supported.has(item as never)
  );
  if (normalized.length) return normalized;
  if (stageType === "TAP") return ["tapReveal"];
  if (stageType === "TRY" || stageType === "CHOOSE") return ["singleChoice"];
  if (stageType === "PLAY") return ["matching"];
  return [];
}

function normalizeLegacyStageType(value?: string): StageTemplate["stageType"] {
  const normalized = value?.toUpperCase();
  if (normalized === "LOOK" || normalized === "TAP" || normalized === "TRY" ||
      normalized === "CHOOSE" || normalized === "PLAY" || normalized === "REWARD") {
    return normalized;
  }
  return "LOOK";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}
