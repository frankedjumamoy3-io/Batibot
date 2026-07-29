import {
  CONTENT_CURATION_STAGE_TYPES,
  type ContentCurationStageType,
} from "@/src/domain/admin/content-curation";
import type { WorldTopicTemplate } from "@/src/domain/admin/curriculum-metadata";

export type AdminTopicDraftStatus =
  | "draft"
  | "inReview"
  | "approved"
  | "rejected"
  | "published";

export type AdminTopicDraftMode = "create" | "editExisting";
export type AdminTopicDifficulty = "easy" | "medium" | "hard";
export type AdminStageType = ContentCurationStageType;

export type AdminStageAssetReference = {
  assetId?: string;
  id: string;
  role: string;
  type: "image" | "audio" | "background" | "icon";
  uri?: string;
};

export type AdminStageChoice = {
  assetRef?: string;
  id: string;
  isCorrect: boolean;
  label: string;
};

export type AdminStageDraft = {
  activityPrompt?: string;
  activityType?: string;
  assetRefs: AdminStageAssetReference[];
  body?: string;
  choices?: AdminStageChoice[];
  correctAnswerIds?: string[];
  example?: string;
  feedbackCorrect?: string;
  feedbackIncorrect?: string;
  instruction: string;
  isComplete: boolean;
  meaning?: string;
  passage?: string;
  pronunciation?: string;
  question?: string;
  stageType: AdminStageType;
  timerSeconds?: number;
  title?: string;
  word?: string;
};

export type AdminTopicDraft = {
  adminNotes?: string;
  createdAt: string;
  createdBy: string;
  description?: string;
  difficulty: AdminTopicDifficulty;
  gradeLevel: string;
  id: string;
  mode: AdminTopicDraftMode;
  objective: string;
  sourceTopicId?: string;
  stages: AdminStageDraft[];
  status: AdminTopicDraftStatus;
  submittedAt?: string;
  templateSnapshot?: WorldTopicTemplate;
  topicId: string;
  topicSlug: string;
  topicTitle: string;
  updatedAt: string;
  updatedBy: string;
  worldId: string;
};

export type CreateTopicDraftInput = {
  adminNotes?: string;
  description?: string;
  difficulty: AdminTopicDifficulty;
  gradeLevel: string;
  mode: AdminTopicDraftMode;
  objective: string;
  sourceTopicId?: string;
  sourceTopicTitle?: string;
  topicTitle: string;
  worldId: string;
};

export type TopicDraftFilters = {
  gradeLevel?: string;
  mode?: AdminTopicDraftMode;
  status?: AdminTopicDraftStatus;
  worldId?: string;
};

export type DraftCompleteness = {
  canSubmitForReview: boolean;
  completeStages: number;
  missingFields: string[];
  totalStages: number;
};

export const PROVISIONAL_PLAY_ACTIVITY_TYPES = [
  "dragDrop",
  "matching",
  "sorting",
  "sequence",
  "build",
  "fillBlank",
  "speak",
  "select",
  "count",
  "equationBuilder",
] as const;

export function createEmptyAdminStages(topicTitle: string): AdminStageDraft[] {
  return CONTENT_CURATION_STAGE_TYPES.map((stageType) => ({
    activityType: stageType === "PLAY" ? "matching" : undefined,
    assetRefs: [],
    choices: stageType === "TRY" || stageType === "CHOOSE" ? [] : undefined,
    correctAnswerIds: stageType === "TRY" || stageType === "CHOOSE" ? [] : undefined,
    feedbackCorrect: stageType === "TRY" || stageType === "CHOOSE" || stageType === "PLAY" ? "Great!" : undefined,
    feedbackIncorrect: stageType === "TRY" || stageType === "CHOOSE" || stageType === "PLAY" ? "Try Again." : undefined,
    instruction: "",
    isComplete: false,
    stageType,
    title: stageType === "REWARD" ? `${topicTitle} Complete` : topicTitle,
  }));
}

export function getDraftCompleteness(draft: AdminTopicDraft): DraftCompleteness {
  const missing = new Set<string>();
  if (!draft.gradeLevel.trim()) missing.add("Grade is required.");
  if (!draft.worldId.trim()) missing.add("World is required.");
  if (!draft.topicTitle.trim()) missing.add("Topic title is required.");
  if (!draft.objective.trim()) missing.add("Learning objective is required.");

  const completeStages = CONTENT_CURATION_STAGE_TYPES.reduce((count, stageType) => {
    const stage = draft.stages.find((item) => item.stageType === stageType);
    if (!stage) {
      missing.add(`${stageType} stage is missing.`);
      return count;
    }

    const stageMissing = getStageMissingFields(stage);
    stageMissing.forEach((field) => missing.add(`${stageType}: ${field}`));
    return count + (stageMissing.length === 0 ? 1 : 0);
  }, 0);

  return {
    canSubmitForReview: missing.size === 0,
    completeStages,
    missingFields: [...missing],
    totalStages: CONTENT_CURATION_STAGE_TYPES.length,
  };
}

export function refreshStageCompleteness(stages: AdminStageDraft[]) {
  return CONTENT_CURATION_STAGE_TYPES.map((stageType) => {
    const stage = stages.find((item) => item.stageType === stageType) ?? createEmptyAdminStages("").find((item) => item.stageType === stageType)!;
    return { ...stage, isComplete: getStageMissingFields(stage).length === 0 };
  });
}

function getStageMissingFields(stage: AdminStageDraft) {
  const missing: string[] = [];
  if (!stage.instruction.trim()) missing.push("instruction is required.");

  if (stage.stageType === "TRY" || stage.stageType === "CHOOSE") {
    const min = stage.stageType === "TRY" ? 2 : 2;
    const max = stage.stageType === "TRY" ? 3 : 4;
    const choices = stage.choices ?? [];
    const labels = choices.map((choice) => choice.label.trim().toLowerCase());
    if (!stage.question?.trim()) missing.push("question is required.");
    if (choices.length < min || choices.length > max) missing.push(`${min}-${max} choices are required.`);
    if (labels.some((label) => !label)) missing.push("choice labels cannot be empty.");
    if (new Set(labels).size !== labels.length) missing.push("choice labels must be unique.");
    if (choices.filter((choice) => choice.isCorrect).length !== 1) missing.push("exactly one correct choice is required.");
  }

  if (stage.stageType === "PLAY") {
    if (!stage.activityType?.trim()) missing.push("activity type is required.");
    if (!stage.activityPrompt?.trim()) missing.push("activity prompt is required.");
  }

  if (stage.stageType === "REWARD" && !stage.body?.trim()) {
    missing.push("summary is required.");
  }

  return missing;
}

export function toTopicSlug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
