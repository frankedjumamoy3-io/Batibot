export const CONTENT_CURATION_STAGE_TYPES = [
  "LOOK",
  "TAP",
  "TRY",
  "CHOOSE",
  "PLAY",
  "REWARD",
] as const;

export type ContentCurationStageType = (typeof CONTENT_CURATION_STAGE_TYPES)[number];

export const ADMIN_DRAFT_STATUSES = [
  "draft",
  "ai_generated",
  "needs_review",
  "validation_failed",
  "approved",
  "published",
  "rejected",
] as const;

export type AdminDraftStatus = (typeof ADMIN_DRAFT_STATUSES)[number];

export type AdminWorkflowPhase =
  | "draft"
  | "review"
  | "approved"
  | "rejected"
  | "published";

export type ContentDraftKind =
  | "meaning"
  | "example"
  | "readingPassage"
  | "story"
  | "instruction"
  | "activity"
  | "question"
  | "assessment"
  | "playActivity";

export interface CurriculumMetadataGateway {
  resolveTopicMetadata(input: {
    gradeLevel: string;
    stageType: ContentCurationStageType;
    topicId: string;
    worldId: string;
  }): Promise<unknown>;
}

export interface ContentGenerationGateway {
  generateContent(input: unknown): Promise<unknown>;
}

export interface ContentValidationGateway {
  validateDraft(input: unknown): Promise<unknown>;
}

export interface ContentPublishingGateway {
  publishDraft(draftId: string): Promise<unknown>;
}

export interface AdminAssetGateway {
  listAssets(): Promise<unknown[]>;
}

export const DEFAULT_TOPIC_PLACEMENT_RULE = {
  fallback: "append",
  strategy: "before-world-challenge",
} as const;

export function getAdminWorkflowPhase(status: AdminDraftStatus): AdminWorkflowPhase {
  if (status === "approved") return "approved";
  if (status === "published") return "published";
  if (status === "rejected") return "rejected";
  if (status === "needs_review") return "review";
  return "draft";
}

export function canTransitionAdminDraft(
  from: AdminDraftStatus,
  to: AdminDraftStatus
) {
  const allowed: Record<AdminDraftStatus, AdminDraftStatus[]> = {
    ai_generated: ["draft", "needs_review", "validation_failed", "rejected"],
    approved: ["draft", "published", "rejected"],
    draft: ["ai_generated", "needs_review", "validation_failed", "rejected"],
    needs_review: ["approved", "draft", "validation_failed", "rejected"],
    published: [],
    rejected: ["draft"],
    validation_failed: ["draft", "needs_review", "rejected"],
  };

  return from === to || allowed[from].includes(to);
}
