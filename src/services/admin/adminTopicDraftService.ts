import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/src/config/firebase";
import {
  CONTENT_CURATION_STAGE_TYPES,
  type ContentCurationStageType,
} from "@/src/domain/admin/content-curation";
import {
  createEmptyAdminStages,
  getDraftCompleteness,
  refreshStageCompleteness,
  toTopicSlug,
  type AdminStageChoice,
  type AdminStageDraft,
  type AdminTopicDifficulty,
  type AdminTopicDraft,
  type AdminTopicDraftStatus,
  type CreateTopicDraftInput,
  type TopicDraftFilters,
} from "@/src/domain/admin/topic-draft";
import { ADMIN_FIRESTORE_COLLECTIONS } from "@/src/infrastructure/admin/admin-firestore-collections";
import {
  createEmptyTopicShell,
  getWorldTopicTemplate,
} from "@/src/services/admin/batibotMetadataApi";
import { getCurriculumMetadataForContentDraft } from "@/src/services/admin/batibotCurriculumApi";
import { requireAdmin } from "@/src/services/adminAccessService";
import type { UserProfile } from "@/src/types/user";

const localTopicDrafts = new Map<string, AdminTopicDraft>();
const COLLECTION = ADMIN_FIRESTORE_COLLECTIONS.contentDrafts;
const RECORD_TYPE = "topicDraft";

export async function createTopicDraft(
  input: CreateTopicDraftInput,
  adminProfile: UserProfile | null | undefined
): Promise<AdminTopicDraft> {
  requireAdmin(adminProfile);
  validateCreateInput(input);
  const now = new Date().toISOString();
  const topicTitle = input.topicTitle.trim();
  const sourceTopicId = input.mode === "editExisting" ? input.sourceTopicId : undefined;
  const shell = createEmptyTopicShell({
    gradeLevel: input.gradeLevel,
    objective: input.objective,
    topicTitle,
    worldId: input.worldId,
  });
  const topicSlug = sourceTopicId || shell.topicSlug || toTopicSlug(topicTitle);
  const stages = input.mode === "editExisting"
    ? await buildExistingTopicStages(input, topicSlug)
    : shell.stages;
  const base: Omit<AdminTopicDraft, "id"> = {
    adminNotes: input.adminNotes?.trim(),
    createdAt: now,
    createdBy: adminProfile?.uid ?? "admin",
    description: input.description?.trim(),
    difficulty: input.difficulty,
    gradeLevel: input.gradeLevel,
    mode: input.mode,
    objective: input.objective.trim(),
    sourceTopicId,
    stages: refreshStageCompleteness(stages),
    status: "draft",
    templateSnapshot: getWorldTopicTemplate({
      gradeLevel: input.gradeLevel,
      worldId: input.worldId,
    }),
    topicId: topicSlug,
    topicSlug,
    topicTitle,
    updatedAt: now,
    updatedBy: adminProfile?.uid ?? "admin",
    worldId: input.worldId,
  };

  try {
    const reference = await addDoc(collection(db, COLLECTION), {
      ...base,
      createdAt: serverTimestamp(),
      recordType: RECORD_TYPE,
      updatedAt: serverTimestamp(),
    });
    const draft = { ...base, id: reference.id };
    localTopicDrafts.set(draft.id, draft);
    return draft;
  } catch (error) {
    logAdminDraftError("create", error);
    const draft = { ...base, id: `local-topic-${Date.now()}` };
    localTopicDrafts.set(draft.id, draft);
    return draft;
  }
}

export async function getTopicDraft(
  draftId: string,
  adminProfile: UserProfile | null | undefined
): Promise<AdminTopicDraft> {
  requireAdmin(adminProfile);
  const local = localTopicDrafts.get(draftId);
  if (local) return local;

  try {
    const snapshot = await getDoc(doc(db, COLLECTION, draftId));
    if (!snapshot.exists() || snapshot.data().recordType !== RECORD_TYPE) {
      throw new Error("Draft not found.");
    }
    return fromFirestoreDraft(snapshot.id, snapshot.data());
  } catch (error) {
    logAdminDraftError("load", error);
    throw new Error("This topic draft could not be loaded.");
  }
}

export async function updateTopicDraft(
  draftId: string,
  patch: Partial<AdminTopicDraft>,
  adminProfile: UserProfile | null | undefined
): Promise<AdminTopicDraft> {
  requireAdmin(adminProfile);
  const current = await getTopicDraft(draftId, adminProfile);
  if (current.status === "published" && patch.status !== "draft") {
    throw new Error("Unpublish the topic draft before editing.");
  }
  assertValidTopicTransition(current.status, patch.status);
  const now = new Date().toISOString();
  const next: AdminTopicDraft = {
    ...current,
    ...patch,
    createdAt: current.createdAt,
    createdBy: current.createdBy,
    gradeLevel: current.gradeLevel,
    id: current.id,
    sourceTopicId: current.sourceTopicId,
    stages: refreshStageCompleteness(patch.stages ?? current.stages),
    topicId: current.topicId,
    topicSlug: current.topicSlug,
    updatedAt: now,
    updatedBy: adminProfile?.uid ?? current.updatedBy,
    worldId: current.worldId,
  };

  try {
    if (!draftId.startsWith("local-topic-")) {
      await updateDoc(doc(db, COLLECTION, draftId), {
        ...next,
        recordType: RECORD_TYPE,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    logAdminDraftError("save", error);
    if (!draftId.startsWith("local-topic-")) throw new Error("The topic draft could not be saved.");
  }

  localTopicDrafts.set(draftId, next);
  return next;
}

export async function listTopicDrafts(
  filters: TopicDraftFilters,
  adminProfile: UserProfile | null | undefined
): Promise<AdminTopicDraft[]> {
  requireAdmin(adminProfile);
  let drafts = [...localTopicDrafts.values()];

  try {
    const snapshot = await getDocs(query(collection(db, COLLECTION), orderBy("updatedAt", "desc")));
    drafts = [
      ...snapshot.docs
        .filter((item) => item.data().recordType === RECORD_TYPE)
        .map((item) => fromFirestoreDraft(item.id, item.data())),
      ...drafts.filter((item) => item.id.startsWith("local-topic-")),
    ];
  } catch (error) {
    logAdminDraftError("list", error);
  }

  return drafts
    .filter((draft) => !filters.status || draft.status === filters.status)
    .filter((draft) => !filters.gradeLevel || draft.gradeLevel === filters.gradeLevel)
    .filter((draft) => !filters.worldId || draft.worldId === filters.worldId)
    .filter((draft) => !filters.mode || draft.mode === filters.mode)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function submitTopicDraftForReview(
  draftId: string,
  adminProfile: UserProfile | null | undefined
) {
  requireAdmin(adminProfile);
  const draft = await getTopicDraft(draftId, adminProfile);
  const completeness = getDraftCompleteness(draft);
  if (!completeness.canSubmitForReview) {
    throw new Error("Complete all required topic and stage fields before submitting for review.");
  }
  if (draft.status !== "draft") throw new Error("Only draft content can be submitted for review.");
  return updateTopicDraft(draftId, { status: "inReview", submittedAt: new Date().toISOString() }, adminProfile);
}

export async function approveTopicDraft(
  draftId: string,
  adminProfile: UserProfile | null | undefined
): Promise<AdminTopicDraft> {
  requireAdmin(adminProfile);
  const draft = await getTopicDraft(draftId, adminProfile);
  if (draft.status !== "inReview") {
    throw new Error("Only drafts awaiting review can be approved.");
  }
  return updateTopicDraft(
    draftId,
    { approvedAt: new Date().toISOString(), status: "approved" },
    adminProfile
  );
}

export async function rejectTopicDraft(
  draftId: string,
  rejectionNotes: string,
  adminProfile: UserProfile | null | undefined
): Promise<AdminTopicDraft> {
  requireAdmin(adminProfile);
  const draft = await getTopicDraft(draftId, adminProfile);
  if (draft.status !== "inReview") {
    throw new Error("Only drafts awaiting review can be rejected.");
  }
  if (!rejectionNotes.trim()) {
    throw new Error("Rejection notes are required.");
  }
  return updateTopicDraft(
    draftId,
    {
      adminNotes: rejectionNotes.trim(),
      status: "rejected",
    },
    adminProfile
  );
}

export async function publishTopicDraft(
  draftId: string,
  adminProfile: UserProfile | null | undefined
): Promise<AdminTopicDraft> {
  requireAdmin(adminProfile);
  const draft = await getTopicDraft(draftId, adminProfile);
  if (draft.status !== "approved") {
    throw new Error("Only approved drafts can be published.");
  }
  return updateTopicDraft(
    draftId,
    {
      publishedAt: new Date().toISOString(),
      status: "published",
    },
    adminProfile
  );
}

export async function unpublishTopicDraft(
  draftId: string,
  adminProfile: UserProfile | null | undefined
): Promise<AdminTopicDraft> {
  requireAdmin(adminProfile);
  const draft = await getTopicDraft(draftId, adminProfile);
  if (draft.status !== "published") {
    throw new Error("Only published topics can be unpublished.");
  }
  return updateTopicDraft(
    draftId,
    {
      status: "draft",
    },
    adminProfile
  );
}

async function buildExistingTopicStages(input: CreateTopicDraftInput, topicId: string) {
  const metadata = await Promise.all(
    CONTENT_CURATION_STAGE_TYPES.map((stageType) =>
      getCurriculumMetadataForContentDraft({ gradeLevel: input.gradeLevel, stageType, topicId, worldId: input.worldId })
    )
  );
  return metadata.map((item) => ({
    ...createEmptyAdminStages(input.topicTitle).find((stage) => stage.stageType === item.stageType)!,
    body: item.currentContent?.meaning,
    choices: toChoices(item.currentContent?.choices, item.currentContent?.correctAnswer),
    correctAnswerIds: toCorrectAnswerIds(item.currentContent?.choices, item.currentContent?.correctAnswer),
    example: item.currentContent?.example,
    feedbackCorrect: item.currentContent?.feedbackCorrect ?? "Great!",
    feedbackIncorrect: item.currentContent?.feedbackIncorrect ?? "Try Again.",
    instruction: item.currentContent?.instruction ?? "",
    passage: item.currentContent?.passage,
    question: item.currentContent?.question,
    title: item.currentContent?.title ?? input.topicTitle,
  } satisfies AdminStageDraft));
}

function toChoices(labels?: string[], correct?: string | string[]): AdminStageChoice[] | undefined {
  if (!labels?.length) return undefined;
  const correctValues = new Set(Array.isArray(correct) ? correct : correct ? [correct] : []);
  return labels.map((label, index) => ({ id: `choice-${index + 1}`, isCorrect: correctValues.has(label), label }));
}

function toCorrectAnswerIds(labels?: string[], correct?: string | string[]) {
  const choices = toChoices(labels, correct);
  return choices?.filter((choice) => choice.isCorrect).map((choice) => choice.id);
}

function validateCreateInput(input: CreateTopicDraftInput) {
  if (!input.gradeLevel.trim() || !input.worldId.trim()) throw new Error("Choose a grade and world.");
  if (!input.topicTitle.trim() || !input.objective.trim()) throw new Error("Topic title and learning objective are required.");
  if (input.mode === "editExisting" && !input.sourceTopicId?.trim()) throw new Error("Choose an existing topic.");
}

function assertValidTopicTransition(from: AdminTopicDraftStatus, to?: AdminTopicDraftStatus) {
  if (!to || to === from) return;
  const allowedTransitions: Record<AdminTopicDraftStatus, AdminTopicDraftStatus[]> = {
    approved: ["published", "draft"],
    draft: ["inReview"],
    inReview: ["approved", "rejected", "draft"],
    published: ["draft"],
    rejected: ["draft"],
  };
  const valid = allowedTransitions[from]?.includes(to);
  if (!valid) throw new Error(`Cannot transition topic draft from ${from} to ${to}.`);
}

function fromFirestoreDraft(id: string, data: Record<string, unknown>): AdminTopicDraft {
  return {
    adminNotes: stringOrUndefined(data.adminNotes),
    createdAt: toIso(data.createdAt),
    createdBy: String(data.createdBy ?? ""),
    description: stringOrUndefined(data.description),
    difficulty: toDifficulty(data.difficulty),
    gradeLevel: String(data.gradeLevel ?? ""),
    id,
    mode: data.mode === "editExisting" ? "editExisting" : "create",
    objective: String(data.objective ?? ""),
    sourceTopicId: stringOrUndefined(data.sourceTopicId),
    stages: refreshStageCompleteness(toStages(data.stages)),
    status: toStatus(data.status),
    submittedAt: stringOrUndefined(data.submittedAt),
    approvedAt: stringOrUndefined(data.approvedAt),
    publishedAt: stringOrUndefined(data.publishedAt),
    templateSnapshot:
      data.templateSnapshot && typeof data.templateSnapshot === "object"
        ? data.templateSnapshot as AdminTopicDraft["templateSnapshot"]
        : undefined,
    topicId: String(data.topicId ?? ""),
    topicSlug: String(data.topicSlug ?? data.topicId ?? ""),
    topicTitle: String(data.topicTitle ?? ""),
    updatedAt: toIso(data.updatedAt),
    updatedBy: String(data.updatedBy ?? ""),
    worldId: String(data.worldId ?? ""),
  };
}

function toStages(value: unknown): AdminStageDraft[] {
  if (!Array.isArray(value)) return createEmptyAdminStages("");
  return value.map((item) => {
    const record = asRecord(item);
    return {
      ...record,
      assetRefs: Array.isArray(record.assetRefs) ? record.assetRefs : [],
      choices: Array.isArray(record.choices) ? record.choices as AdminStageChoice[] : undefined,
      instruction: String(record.instruction ?? ""),
      isComplete: Boolean(record.isComplete),
      stageType: toStageType(record.stageType),
    } as AdminStageDraft;
  });
}

function toStageType(value: unknown): ContentCurationStageType {
  return CONTENT_CURATION_STAGE_TYPES.includes(value as ContentCurationStageType) ? value as ContentCurationStageType : "LOOK";
}

function toDifficulty(value: unknown): AdminTopicDifficulty {
  return value === "medium" || value === "hard" ? value : "easy";
}

function toStatus(value: unknown): AdminTopicDraftStatus {
  return value === "inReview" || value === "approved" || value === "rejected" || value === "published" ? value : "draft";
}

function toIso(value: unknown) {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return typeof value === "string" ? value : new Date().toISOString();
}

function stringOrUndefined(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function logAdminDraftError(action: string, error: unknown) {
  if (__DEV__) console.warn(`[AdminTopicDraft:${action}]`, error);
}
