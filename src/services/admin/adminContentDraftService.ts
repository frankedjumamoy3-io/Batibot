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
import { USE_NODE_BACKEND } from "@/src/config/backend";
import { getApiContentDraft, listApiContentDrafts, listApiPublishedContent, publishApiContentDraft, saveApiContentDraft } from "@/src/data/repositories/api-content-repository";
import {
  canTransitionAdminDraft,
  type AdminDraftStatus as DomainAdminDraftStatus,
  type ContentDraftKind as DomainContentDraftKind,
} from "@/src/domain/admin/content-curation";
import { ADMIN_FIRESTORE_COLLECTIONS } from "@/src/infrastructure/admin/admin-firestore-collections";
import { requestGeminiQuizDraft } from "@/src/infrastructure/gemini/quiz-draft-client";
import { requireAdmin } from "@/src/services/adminAccessService";
import {
  buildGeminiContentPrompt,
  buildGeminiDraftPrompt,
  getCurriculumMetadataForContentDraft,
  getAdminWorldMetadata,
  getStageAuthoringRules,
  getTopicBuildSpec,
  validateContentDraftAgainstMetadata,
  validateAdminDraft,
  type AdminContentDraftRequest,
  type ContentDraftValidationResult,
  type CurriculumContentMetadata,
  type LessonStageType,
  type ValidationResult,
} from "@/src/services/admin/batibotCurriculumApi";
import type { UserProfile } from "@/src/types/user";

export type { ValidationResult };

export type AdminDraftStatus = DomainAdminDraftStatus;

export type ContentDraftKind = DomainContentDraftKind;

export type ContentDraftStatus =
  | "draft"
  | "review"
  | "approved"
  | "published"
  | "rejected";

export type ContentDraft = {
  assetRefs: {
    audio: string[];
    backgrounds: string[];
    icons: string[];
    images: string[];
  };
  choices?: {
    id: string;
    isCorrect?: boolean;
    label: string;
  }[];
  content?: string;
  correctAnswer?: string | string[];
  createdAt?: string;
  createdBy: string;
  example?: string;
  gradeLevel: string;
  id: string;
  kind: ContentDraftKind;
  instruction: string;
  metadata: CurriculumContentMetadata;
  passage?: string;
  question?: string;
  requestId: string;
  stageType: Exclude<LessonStageType, "PROGRESS" | "MASTERY">;
  status: ContentDraftStatus;
  title?: string;
  topicId: string;
  updatedAt?: string;
  updatedBy?: string;
  validation: ContentDraftValidationResult;
  worldId: string;
};

export type ContentDraftRequest = AdminContentDraftRequest;

export type AdminContentDraft = {
  adminPrompt: string;
  assetRefs: CurriculumContentMetadata["existingAssetRefs"];
  contentKind: ContentDraftKind;
  createdAt: Timestamp | null;
  createdBy: string;
  editedContent: unknown;
  generatedContent: unknown;
  gradeLevel: string;
  id: string;
  metadata: CurriculumContentMetadata | null;
  publishedAt?: Timestamp | null;
  rejectionNotes?: string;
  requestId: string;
  stageType: Exclude<LessonStageType, "PROGRESS" | "MASTERY">;
  status: AdminDraftStatus;
  topicId: string;
  topicTitle: string;
  topicType: string;
  updatedAt: Timestamp | null;
  validationResults: ValidationResult[];
  worldId: string;
};

export type AdminCreateDraftInput = {
  adminPrompt: string;
  contentKind: ContentDraftKind;
  exampleCount: number;
  gradeLevel: string;
  stageStructure: LessonStageType[];
  stageType: Exclude<LessonStageType, "PROGRESS" | "MASTERY">;
  topicId: string;
  topicTitle: string;
  topicType: string;
  worldId: string;
};

type AdminDraftUser = {
  getIdToken?: () => Promise<string>;
  uid?: string;
} | null;

export type PublishedContentRecord = {
  assetRefs?: CurriculumContentMetadata["existingAssetRefs"];
  content: unknown;
  draftId: string;
  gradeLevel: string;
  id: string;
  metadata?: CurriculumContentMetadata | null;
  publishedAt: Timestamp | null;
  publishedBy: string;
  status: "published" | "unpublished";
  topicTitle: string;
  worldId: string;
};

const localDrafts = new Map<string, AdminContentDraft>();
const localPublished = new Map<string, PublishedContentRecord>();
const CONTENT_DRAFTS_COLLECTION = ADMIN_FIRESTORE_COLLECTIONS.contentDrafts;
const PUBLISHED_CONTENT_COLLECTION = ADMIN_FIRESTORE_COLLECTIONS.publishedContent;

const emptyAssetRefs: CurriculumContentMetadata["existingAssetRefs"] = {
  audio: [],
  backgrounds: [],
  icons: [],
  images: [],
};

export function buildLocalDraftContent(
  input: AdminCreateDraftInput,
  metadata?: CurriculumContentMetadata
) {
  const spec = getTopicBuildSpec(input);
  const topicTitle = metadata?.topicTitle ?? input.topicTitle;
  const selectedStage = input.stageType;
  const stageDrafts = spec.requiredStages.map((stage) =>
    buildEditableStageDraft(stage.stageLabel, input, metadata)
  );
  const selectedDraft = getDraftContentRecord(
    stageDrafts.find((stage) => stage.stageLabel === selectedStage) ?? stageDrafts[0]
  );

  return {
    assetRefs: emptyAssetRefs,
    availableAssetRefs: metadata?.existingAssetRefs ?? emptyAssetRefs,
    content: selectedDraft?.body ?? metadata?.currentContent?.example ?? `${topicTitle} content draft.`,
    examples: Array.from({ length: spec.exampleCount }, (_, index) => ({
      explanation: `Explain ${topicTitle} example ${index + 1}.`,
      label: `${topicTitle} example ${index + 1}`,
    })),
    feedbackCorrect: selectedDraft?.feedbackCorrect ?? "Great!",
    feedbackIncorrect: selectedDraft?.feedbackIncorrect ?? "Try Again.",
    instruction: selectedDraft?.instruction ?? metadata?.currentContent?.instruction ?? spec.requiredStages[0]?.instructionGuidance,
    question: selectedDraft?.question ?? metadata?.currentContent?.question,
    reward: {
      badge: `${topicTitle} badge`,
      xp: 20,
      stars: 1,
    },
    request: buildContentDraftRequest(input),
    stageType: selectedStage,
    stages: stageDrafts,
    title: selectedDraft?.title ?? topicTitle,
    topicTitle,
    topicType: input.topicType,
  };
}

export async function generateAdminContentDraft(
  input: AdminCreateDraftInput,
  user: AdminDraftUser,
  profile: UserProfile | null | undefined
) {
  requireAdmin(profile);
  const request = buildContentDraftRequest(input);
  const metadata = await getCurriculumMetadataForContentDraft(request);
  const worldMetadata = getAdminWorldMetadata(input.gradeLevel, input.worldId);
  const spec = getTopicBuildSpec(input);
  const localContent = buildLocalDraftContent(input, metadata);
  let generatedContent: unknown = localContent;
  let status: AdminDraftStatus = "needs_review";

  try {
    const token = !USE_NODE_BACKEND && user?.getIdToken ? await user.getIdToken() : null;
    const response = await requestGeminiQuizDraft({
      token,
      body: {
        adminPrompt: input.adminPrompt,
        geminiContentPrompt: buildGeminiContentPrompt(metadata, request),
        geminiDraftPrompt: buildGeminiDraftPrompt(spec),
        gradeLevel: input.gradeLevel,
        worldId: input.worldId,
        maxExamples: worldMetadata?.maxExamples ?? input.exampleCount,
        metadata,
        mode: "admin-content-draft",
        request,
        requiredStages: input.stageStructure,
        topicBuildSpec: spec,
        topicId: input.topicId,
        topicTitle: input.topicTitle,
        topicType: input.topicType,
        worldMetadata,
      },
    });

    if (!response.ok) throw new Error("The AI service could not generate a draft. Please retry.");
    if (response.ok) {
      const payload = (await response.json()) as Record<string, unknown>;
      generatedContent = normalizeGeneratedContent(payload.draft ?? payload.content ?? payload, localContent, metadata);
      status = "ai_generated";
    }
  } catch (error) {
    if (USE_NODE_BACKEND) throw error;
    generatedContent = {
      ...localContent,
      generationNote: "Gemini was unavailable. BatiBot created a safe editable local draft.",
    };
  }
  const validation = validateContentDraftAgainstMetadata(generatedContent, metadata);

  return saveAdminContentDraft({
    adminPrompt: input.adminPrompt,
    assetRefs: getAttachedAssetRefs(generatedContent),
    contentKind: input.contentKind,
    createdBy: profile?.uid ?? user?.uid ?? "local-admin",
    editedContent: generatedContent,
    generatedContent,
    gradeLevel: input.gradeLevel,
    metadata,
    rejectionNotes: "",
    requestId: requestToId(request),
    stageType: input.stageType,
    status: validation.passed ? status : "validation_failed",
    topicId: input.topicId,
    topicTitle: input.topicTitle,
    topicType: input.topicType,
    validationResults: validation.results,
    worldId: input.worldId,
  });
}

export async function createContentDraftFromMetadata(
  request: AdminContentDraftRequest,
  adminProfile: UserProfile | null | undefined,
  user?: AdminDraftUser
) {
  requireAdmin(adminProfile);
  const metadata = await getCurriculumMetadataForContentDraft(request);

  return generateAdminContentDraft(
    {
      adminPrompt: request.adminPrompt ?? "",
      contentKind: request.contentKind,
      exampleCount: 4,
      gradeLevel: metadata.gradeLevel,
      stageStructure: ["LOOK", "TAP", "TRY", "CHOOSE", "PLAY", "REWARD", "PROGRESS", "MASTERY"],
      stageType: request.stageType,
      topicId: metadata.topicId,
      topicTitle: metadata.topicTitle,
      topicType: request.contentKind === "assessment" ? "matching" : "concept",
      worldId: metadata.worldId,
    },
    user ?? null,
    adminProfile
  );
}

export async function saveAdminContentDraft(
  draft: Omit<AdminContentDraft, "createdAt" | "id" | "publishedAt" | "updatedAt"> & {
    id?: string;
  }
) {
  if (USE_NODE_BACKEND) return saveApiContentDraft(draft, draft.id);
  const now = Timestamp.now();
  const localDraft: AdminContentDraft = {
    ...draft,
    createdAt: now,
    id: draft.id ?? `local-${Date.now()}`,
    publishedAt: null,
    updatedAt: now,
  };

  try {
    if (draft.id && !draft.id.startsWith("local-")) {
      await updateDoc(doc(db, CONTENT_DRAFTS_COLLECTION, draft.id), {
        ...draft,
        updatedAt: serverTimestamp(),
      });
      return { ...localDraft, id: draft.id };
    }

    const docRef = await addDoc(collection(db, CONTENT_DRAFTS_COLLECTION), {
      ...draft,
      createdAt: serverTimestamp(),
      publishedAt: null,
      updatedAt: serverTimestamp(),
    });

    return { ...localDraft, id: docRef.id };
  } catch {
    localDrafts.set(localDraft.id, localDraft);
    return localDraft;
  }
}

export async function updateAdminContentDraft(
  draftId: string,
  patch: Partial<AdminContentDraft>
) {
  if (USE_NODE_BACKEND) return saveApiContentDraft(patch, draftId);
  const existing = await getAdminContentDraft(draftId);

  if (
    existing &&
    patch.status &&
    !canTransitionAdminDraft(existing.status, patch.status)
  ) {
    throw new Error(`Draft cannot move from ${existing.status} to ${patch.status}.`);
  }

  const next: AdminContentDraft = {
    ...(existing ?? makeEmptyDraft(draftId)),
    ...patch,
    id: draftId,
    updatedAt: Timestamp.now(),
  };

  try {
    if (!draftId.startsWith("local-")) {
      await updateDoc(doc(db, CONTENT_DRAFTS_COLLECTION, draftId), {
        ...patch,
        updatedAt: serverTimestamp(),
      });
    }
  } catch {
    localDrafts.set(draftId, next);
  }

  localDrafts.set(draftId, next);
  return next;
}

export async function updateDraftContent(
  draftId: string,
  editedContent: unknown
): Promise<void> {
  await updateAdminContentDraft(draftId, {
    assetRefs: getAttachedAssetRefs(editedContent),
    editedContent,
    status: "draft",
    validationResults: [],
  });
}

export async function rejectAdminContentDraft(
  draftId: string,
  rejectionNotes: string
) {
  return updateAdminContentDraft(draftId, {
    rejectionNotes,
    status: "rejected",
  });
}

export async function submitDraftForConfirmation(draftId: string): Promise<void> {
  await updateAdminContentDraft(draftId, {
    status: "needs_review",
  });
}

export async function validateAndSaveDraft(
  draftId: string,
  editedContent: unknown
): Promise<ValidationResult[]> {
  const existing = await getAdminContentDraft(draftId);
  const candidate = {
    ...(existing ?? makeEmptyDraft(draftId)),
    editedContent,
  };
  const validationResults = await validateAdminContentDraft(candidate);

  await updateAdminContentDraft(draftId, {
    assetRefs: getAttachedAssetRefs(editedContent),
    editedContent,
    status: hasBlockingValidationIssues(validationResults) ? "validation_failed" : "needs_review",
    validationResults,
  });

  return validationResults;
}

export async function getAdminContentDraft(draftId: string) {
  if (USE_NODE_BACKEND) return getApiContentDraft(draftId);
  if (localDrafts.has(draftId)) {
    return localDrafts.get(draftId) ?? null;
  }

  try {
    const snapshot = await getDoc(doc(db, CONTENT_DRAFTS_COLLECTION, draftId));

    if (!snapshot.exists()) {
      return null;
    }

    return fromDraftDoc(snapshot.id, snapshot.data());
  } catch {
    return null;
  }
}

export async function listAdminContentDrafts() {
  if (USE_NODE_BACKEND) return listApiContentDrafts();
  try {
    const snapshot = await getDocs(
      query(collection(db, CONTENT_DRAFTS_COLLECTION), orderBy("updatedAt", "desc"))
    );

    return snapshot.docs
      .filter((item) => item.data().recordType !== "topicDraft")
      .map((item) => fromDraftDoc(item.id, item.data()));
  } catch {
    return Array.from(localDrafts.values()).sort(
      (left, right) => toMillis(right.updatedAt) - toMillis(left.updatedAt)
    );
  }
}

export async function validateAdminContentDraft(draft: AdminContentDraft) {
  const content = getDraftContentRecord(draft.editedContent ?? draft.generatedContent);
  const spec = getTopicBuildSpec({
    adminPrompt: draft.adminPrompt,
    exampleCount: Array.isArray(content.examples) ? content.examples.length : 1,
    gradeLevel: draft.gradeLevel,
    topicTitle: draft.topicTitle,
    topicType: draft.topicType,
    worldId: draft.worldId,
  });
  const metadata =
    draft.metadata ??
    (await getCurriculumMetadataForContentDraft({
      gradeLevel: draft.gradeLevel,
      stageType: draft.stageType,
      topicId: draft.topicId,
      worldId: draft.worldId,
    }));
  const metadataValidation = validateContentDraftAgainstMetadata(
    {
      ...content,
      assetRefs: draft.assetRefs,
      gradeLevel: draft.gradeLevel,
      stageType: draft.stageType,
      topicId: draft.topicId,
      worldId: draft.worldId,
    },
    metadata
  );

  return [
    ...validateAdminDraft(
    {
      ...content,
      gradeLevel: draft.gradeLevel,
      topicTitle: draft.topicTitle,
      topicType: draft.topicType,
      worldId: draft.worldId,
    },
    spec
    ),
    ...metadataValidation.results,
  ];
}

export function hasBlockingValidationIssues(results: ValidationResult[]) {
  return results.some((result) => result.severity === "error");
}

export async function approveAdminContentDraft(draft: AdminContentDraft) {
  if (USE_NODE_BACKEND) draft = await getApiContentDraft(draft.id);
  const validationResults = await validateAdminContentDraft(draft);

  if (hasBlockingValidationIssues(validationResults)) {
    return updateAdminContentDraft(draft.id, {
      status: "validation_failed",
      validationResults,
    });
  }

  return updateAdminContentDraft(draft.id, {
    status: "approved",
    validationResults,
  });
}

export async function publishAdminContentDraft(
  draft: AdminContentDraft,
  profile: UserProfile | null | undefined
) {
  requireAdmin(profile);
  if (USE_NODE_BACKEND) draft = await getApiContentDraft(draft.id);

  if (draft.status !== "approved") {
    throw new Error("Approve the draft before publishing.");
  }

  const validationResults = await validateAdminContentDraft(draft);

  if (hasBlockingValidationIssues(validationResults)) {
    await updateAdminContentDraft(draft.id, {
      status: "validation_failed",
      validationResults,
    });
    throw new Error("Validation must pass before publishing.");
  }

  if (USE_NODE_BACKEND) return publishApiContentDraft(draft.id);

  const published: PublishedContentRecord = {
    assetRefs: draft.assetRefs,
    content: draft.editedContent ?? draft.generatedContent,
    draftId: draft.id,
    gradeLevel: draft.gradeLevel,
    id: `published-${draft.id}`,
    metadata: draft.metadata,
    publishedAt: Timestamp.now(),
    publishedBy: profile?.uid ?? "local-admin",
    status: "published",
    topicTitle: draft.topicTitle,
    worldId: draft.worldId,
  };

  try {
    const docRef = await addDoc(collection(db, PUBLISHED_CONTENT_COLLECTION), {
      ...published,
      publishedAt: serverTimestamp(),
    });
    published.id = docRef.id;
  } catch {
    localPublished.set(published.id, published);
  }

  await updateAdminContentDraft(draft.id, {
    publishedAt: Timestamp.now(),
    status: "published",
    validationResults,
  });

  return published;
}

export async function listPublishedContent() {
  if (USE_NODE_BACKEND) return listApiPublishedContent();
  try {
    const snapshot = await getDocs(
      query(collection(db, PUBLISHED_CONTENT_COLLECTION), orderBy("publishedAt", "desc"))
    );

    return snapshot.docs.map((item) => {
      const data = item.data();

      return {
        content: data.content ?? null,
        draftId: String(data.draftId ?? ""),
        gradeLevel: String(data.gradeLevel ?? ""),
        id: item.id,
        assetRefs: toAssetRefs(data.assetRefs),
        metadata: toCurriculumContentMetadata(data.metadata),
        publishedAt: data.publishedAt instanceof Timestamp ? data.publishedAt : null,
        publishedBy: String(data.publishedBy ?? ""),
        status: data.status === "unpublished" ? "unpublished" : "published",
        topicTitle: String(data.topicTitle ?? ""),
        worldId: String(data.worldId ?? ""),
      } satisfies PublishedContentRecord;
    });
  } catch {
    return Array.from(localPublished.values());
  }
}

export function clearLocalAdminDraftCache() {
  localDrafts.clear();
  localPublished.clear();
}

function buildEditableStageDraft(
  stageType: LessonStageType,
  input: AdminCreateDraftInput,
  metadata?: CurriculumContentMetadata
) {
  const topicTitle = metadata?.topicTitle ?? input.topicTitle;
  const rules = getStageAuthoringRules({
    stageType: stageType === "PROGRESS" || stageType === "MASTERY" ? "REWARD" : stageType,
  });
  const base = {
    activityType: rules.allowedActivityTypes[0] ?? "concept",
    assetRefs: emptyAssetRefs,
    feedbackCorrect: "Great!",
    feedbackIncorrect: "Try Again.",
    id: stageType.toLowerCase(),
    instruction: metadata?.stageType === stageType
      ? metadata.currentContent?.instruction ?? getFallbackInstruction(stageType, topicTitle)
      : getFallbackInstruction(stageType, topicTitle),
    stageLabel: stageType,
    title: topicTitle,
  };

  if (stageType === "LOOK") {
    return {
      ...base,
      body: metadata?.currentContent?.meaning ?? `Learn about ${topicTitle}.`,
      example: metadata?.currentContent?.example ?? topicTitle,
    };
  }

  if (stageType === "TAP") {
    return {
      ...base,
      body: `Tap to learn: ${topicTitle}.`,
      meaning: metadata?.currentContent?.meaning ?? `${topicTitle} is the idea for this lesson.`,
    };
  }

  if (stageType === "TRY" || stageType === "CHOOSE") {
    const choices = buildDefaultChoices(topicTitle, stageType === "TRY" ? 2 : 4);

    return {
      ...base,
      choices,
      correctAnswer: choices[0]?.id,
      question: metadata?.currentContent?.question ?? getFallbackQuestion(stageType, topicTitle),
    };
  }

  if (stageType === "PLAY") {
    return {
      ...base,
      activityType: metadata?.learnerUiSchema.allowedInteractionTypes?.[0] ?? input.topicType ?? "matching",
      body: `Complete the ${topicTitle} activity.`,
      items: [
        { id: "match-1", left: topicTitle, right: `${topicTitle} answer` },
        { id: "match-2", left: "Example", right: "Match" },
      ],
      question: metadata?.currentContent?.question ?? `Complete the activity about ${topicTitle}.`,
    };
  }

  return {
    ...base,
    body: stageType === "REWARD" ? `You finished ${topicTitle}.` : "Preview-only progress content.",
  };
}

function normalizeGeneratedContent(
  generated: unknown,
  localContent: Record<string, unknown>,
  metadata: CurriculumContentMetadata
) {
  const generatedRecord = getDraftContentRecord(generated);
  const localStages = Array.isArray(localContent.stages) ? localContent.stages.map(getDraftContentRecord) : [];
  const generatedStages = Array.isArray(generatedRecord.stages) ? generatedRecord.stages.map(getDraftContentRecord) : [];
  const singleGeneratedStage = generatedRecord.stageType || generatedRecord.instruction || generatedRecord.question
    ? generatedRecord
    : null;
  const stages = localStages.map((stage) => {
    const stageLabel = String(stage.stageLabel ?? "");
    const replacement =
      generatedStages.find((item) => String(item.stageLabel ?? item.stageType ?? "") === stageLabel) ??
      (singleGeneratedStage && String(singleGeneratedStage.stageType ?? metadata.stageType) === stageLabel
        ? singleGeneratedStage
        : null);

    return replacement
      ? {
          ...stage,
          ...replacement,
          stageLabel,
        }
      : stage;
  });
  const selectedStage = stages.find((stage) => String(stage.stageLabel ?? "") === metadata.stageType);

  return {
    ...localContent,
    ...generatedRecord,
    assetRefs: getAttachedAssetRefs(generatedRecord),
    feedbackCorrect: String(generatedRecord.feedbackCorrect ?? selectedStage?.feedbackCorrect ?? "Great!"),
    feedbackIncorrect: String(generatedRecord.feedbackIncorrect ?? selectedStage?.feedbackIncorrect ?? "Try Again."),
    instruction: String(generatedRecord.instruction ?? selectedStage?.instruction ?? localContent.instruction ?? ""),
    question: String(generatedRecord.question ?? selectedStage?.question ?? localContent.question ?? ""),
    stageType: metadata.stageType,
    stages,
    title: String(generatedRecord.title ?? selectedStage?.title ?? metadata.topicTitle),
  };
}

function getAttachedAssetRefs(content: unknown): CurriculumContentMetadata["existingAssetRefs"] {
  const refs: CurriculumContentMetadata["existingAssetRefs"] = {
    audio: [],
    backgrounds: [],
    icons: [],
    images: [],
  };

  function add(field: keyof CurriculumContentMetadata["existingAssetRefs"], value: unknown) {
    if (typeof value === "string" && value.trim() && !refs[field].includes(value)) {
      refs[field].push(value);
    }
  }

  function visit(value: unknown) {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (!value || typeof value !== "object") {
      return;
    }

    const record = value as Record<string, unknown>;
    add("images", record.assetKey);
    add("images", record.imageAssetKey);
    add("images", record.assetUri);
    add("icons", record.badgeAssetKey);

    const assetRefs = getDraftContentRecord(record.assetRefs);
    (["images", "audio", "backgrounds", "icons"] as const).forEach((field) => {
      const values = assetRefs[field];
      if (Array.isArray(values)) {
        values.forEach((item) => add(field, item));
      }
    });

    Object.values(record).forEach(visit);
  }

  visit(content);
  return refs;
}

function buildDefaultChoices(topicTitle: string, count: number) {
  const baseChoices = [
    { id: "correct", isCorrect: true, label: topicTitle },
    { id: "review", isCorrect: false, label: `${topicTitle} review` },
    { id: "example", isCorrect: false, label: `${topicTitle} example` },
    { id: "other", isCorrect: false, label: `Not ${topicTitle}` },
  ];

  return baseChoices.slice(0, count);
}

function getFallbackInstruction(stageType: LessonStageType, topicTitle: string) {
  if (stageType === "LOOK") return `Look at ${topicTitle}.`;
  if (stageType === "TAP") return "Tap each card to learn.";
  if (stageType === "TRY") return "Try one with help.";
  if (stageType === "CHOOSE") return "Choose the best answer.";
  if (stageType === "PLAY") return "Complete the activity, then tap Done.";
  if (stageType === "REWARD") return "Lesson Complete!";
  if (stageType === "PROGRESS") return "Check progress.";
  return "Lesson Complete!";
}

function getFallbackQuestion(stageType: LessonStageType, topicTitle: string) {
  if (stageType === "TRY") return `Which answer matches ${topicTitle}?`;
  return `Choose the answer about ${topicTitle}.`;
}

function fromDraftDoc(id: string, data: Record<string, unknown>): AdminContentDraft {
  return {
    adminPrompt: String(data.adminPrompt ?? ""),
    assetRefs: toAssetRefs(data.assetRefs),
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : null,
    createdBy: String(data.createdBy ?? ""),
    contentKind: toContentDraftKind(data.contentKind),
    editedContent: data.editedContent ?? null,
    generatedContent: data.generatedContent ?? null,
    gradeLevel: String(data.gradeLevel ?? ""),
    id,
    metadata: toCurriculumContentMetadata(data.metadata),
    publishedAt: data.publishedAt instanceof Timestamp ? data.publishedAt : null,
    rejectionNotes: String(data.rejectionNotes ?? ""),
    requestId: String(data.requestId ?? ""),
    stageType: toContentStageType(data.stageType),
    status: toDraftStatus(data.status),
    topicId: String(data.topicId ?? data.topicTitle ?? ""),
    topicTitle: String(data.topicTitle ?? ""),
    topicType: String(data.topicType ?? ""),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : null,
    validationResults: Array.isArray(data.validationResults)
      ? (data.validationResults as ValidationResult[])
      : [],
    worldId: String(data.worldId ?? ""),
  };
}

function getDraftContentRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function makeEmptyDraft(id: string): AdminContentDraft {
  return {
    adminPrompt: "",
    assetRefs: emptyAssetRefs,
    contentKind: "activity",
    createdAt: Timestamp.now(),
    createdBy: "local-admin",
    editedContent: null,
    generatedContent: null,
    gradeLevel: "",
    id,
    metadata: null,
    publishedAt: null,
    rejectionNotes: "",
    requestId: "",
    stageType: "LOOK",
    status: "draft",
    topicId: "",
    topicTitle: "",
    topicType: "",
    updatedAt: Timestamp.now(),
    validationResults: [],
    worldId: "",
  };
}

function toDraftStatus(value: unknown): AdminDraftStatus {
  return value === "draft" ||
    value === "ai_generated" ||
    value === "needs_review" ||
    value === "validation_failed" ||
    value === "approved" ||
    value === "published" ||
    value === "rejected"
    ? value
    : "draft";
}

function buildContentDraftRequest(input: AdminCreateDraftInput): ContentDraftRequest {
  return {
    adminPrompt: input.adminPrompt,
    contentKind: input.contentKind,
    gradeLevel: input.gradeLevel,
    stageType: input.stageType,
    topicId: input.topicId,
    worldId: input.worldId,
  };
}

function requestToId(request: ContentDraftRequest) {
  return [
    request.gradeLevel,
    request.worldId,
    request.topicId,
    request.stageType,
    request.contentKind,
  ]
    .join(":")
    .toLowerCase();
}

function toContentDraftKind(value: unknown): ContentDraftKind {
  return value === "meaning" ||
    value === "example" ||
    value === "readingPassage" ||
    value === "story" ||
    value === "instruction" ||
    value === "activity" ||
    value === "question" ||
    value === "assessment" ||
    value === "playActivity"
    ? value
    : "activity";
}

function toAssetRefs(value: unknown): CurriculumContentMetadata["existingAssetRefs"] {
  const record = value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

  return {
    audio: toStringArray(record.audio),
    backgrounds: toStringArray(record.backgrounds),
    icons: toStringArray(record.icons),
    images: toStringArray(record.images),
  };
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function toCurriculumContentMetadata(value: unknown): CurriculumContentMetadata | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as CurriculumContentMetadata)
    : null;
}

function toContentStageType(value: unknown): Exclude<LessonStageType, "PROGRESS" | "MASTERY"> {
  return value === "LOOK" ||
    value === "TAP" ||
    value === "TRY" ||
    value === "CHOOSE" ||
    value === "PLAY" ||
    value === "REWARD"
    ? value
    : "LOOK";
}

function toMillis(value: Timestamp | null) {
  return value?.toMillis() ?? 0;
}
