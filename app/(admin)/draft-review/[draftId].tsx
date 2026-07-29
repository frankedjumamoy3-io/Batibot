import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { AdminAssetSelector } from "@/src/components/admin/AdminAssetSelector";
import { AdminMobileLessonPreview } from "@/src/components/admin/AdminMobileLessonPreview";
import {
  AdminButton,
  AdminCard,
  AdminSectionHeader,
  AdminShell,
  AdminStatusBadge,
  adminStyles,
  mergeAdminStyles,
} from "@/src/components/admin/AdminShell";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import type { BatibotAssetMeta } from "@/src/assets/assetRegistry";
import type { AdminAsset } from "@/src/services/admin/adminAssetService";
import {
  approveAdminContentDraft,
  getAdminContentDraft,
  hasBlockingValidationIssues,
  publishAdminContentDraft,
  rejectAdminContentDraft,
  submitDraftForConfirmation,
  updateAdminContentDraft,
  updateDraftContent,
  validateAndSaveDraft,
  type AdminContentDraft,
  type ValidationResult,
} from "@/src/services/admin/adminContentDraftService";

type ReviewTab = "edit" | "preview" | "validate";
type PreviewState = "default" | "correct" | "wrong";

export default function AdminDraftReviewScreen() {
  const { profile } = useCurrentUserProfile();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ draftId?: string }>();
  const draftId = Array.isArray(params.draftId) ? params.draftId[0] : params.draftId;
  const [draft, setDraft] = useState<AdminContentDraft | null>(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [adminPrompt, setAdminPrompt] = useState("");
  const [contentText, setContentText] = useState("{}");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [activeTab, setActiveTab] = useState<ReviewTab>("edit");
  const [previewState, setPreviewState] = useState<PreviewState>("default");
  const isNarrow = width < 1040;
  const canApprove = validationResults.length > 0 && !hasBlockingValidationIssues(validationResults);
  const canPublish = draft?.status === "approved";

  useEffect(() => {
    let mounted = true;
    setLoaded(false);

    if (!draftId) {
      setLoaded(true);
      return undefined;
    }

    getAdminContentDraft(draftId).then((item) => {
      if (!mounted) {
        return;
      }

      if (item) {
        setDraft(item);
        setTopicTitle(item.topicTitle);
        setAdminPrompt(item.adminPrompt);
        setContentText(JSON.stringify(item.editedContent ?? item.generatedContent ?? {}, null, 2));
        setRejectionNotes(item.rejectionNotes ?? "");
        setValidationResults(item.validationResults);
      } else {
        setDraft(null);
      }
      setLoaded(true);
    });

    return () => {
      mounted = false;
    };
  }, [draftId]);

  const parsedContent = useMemo(() => {
    try {
      return JSON.parse(contentText) as unknown;
    } catch {
      return null;
    }
  }, [contentText]);

  const contentRecord = asRecord(parsedContent);
  const stageTargets = getAssetTargets(contentRecord);
  const editableStage = getEditableStage(contentRecord, draft?.stageType);

  async function saveDraft() {
    if (!draft || !draftId) return;

    if (parsedContent === null) {
      setMessage("Content JSON is invalid.");
      return;
    }

    setBusy(true);
    await updateDraftContent(draftId, parsedContent);
    const next = await updateAdminContentDraft(draftId, {
      adminPrompt,
      assetRefs: getAttachedAssetRefs(parsedContent),
      topicTitle,
    });
    setDraft(next);
    setMessage("Draft content saved.");
    setBusy(false);
  }

  async function validateDraft() {
    if (!draft || !draftId || parsedContent === null) {
      setMessage("Save valid content before validation.");
      return;
    }

    setBusy(true);
    await updateAdminContentDraft(draftId, {
      adminPrompt,
      assetRefs: getAttachedAssetRefs(parsedContent),
      topicTitle,
    });
    const results = await validateAndSaveDraft(draftId, parsedContent);
    const next = await getAdminContentDraft(draftId);
    setDraft(next);
    setValidationResults(results);
    setMessage(hasBlockingValidationIssues(results) ? "Validation failed." : "Validation passed.");
    setBusy(false);
  }

  async function submitForConfirmation() {
    if (!draftId || parsedContent === null) return;

    setBusy(true);
    await saveDraft();
    await submitDraftForConfirmation(draftId);
    const next = await getAdminContentDraft(draftId);
    setDraft(next);
    setMessage("Draft submitted for confirmation.");
    setBusy(false);
  }

  async function approveDraft() {
    if (!draft || parsedContent === null) return;

    setBusy(true);
    const next = await approveAdminContentDraft({
      ...draft,
      adminPrompt,
      editedContent: parsedContent,
      topicTitle,
    });
    setDraft(next);
    setValidationResults(next.validationResults);
    setMessage(next.status === "approved" ? "Draft approved." : "Fix validation issues first.");
    setBusy(false);
  }

  async function publishDraft() {
    if (!draft) return;

    setBusy(true);

    try {
      await publishAdminContentDraft(draft, profile);
      const next = await getAdminContentDraft(draft.id);
      setDraft(next);
      setMessage("Published content saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Publish failed.");
    } finally {
      setBusy(false);
    }
  }

  async function rejectDraft() {
    if (!draft || !draftId) return;

    if (!rejectionNotes.trim()) {
      setMessage("Add rejection notes before rejecting this draft.");
      return;
    }

    setBusy(true);
    const next = await rejectAdminContentDraft(draftId, rejectionNotes.trim());
    setDraft(next);
    setMessage("Draft rejected with notes.");
    setBusy(false);
  }

  function updateContent(nextContent: unknown) {
    setContentText(JSON.stringify(nextContent, null, 2));
  }

  function updateStageInstruction(index: number, instruction: string) {
    const nextContent = cloneContent(contentRecord);
    const stages = Array.isArray(nextContent.stages) ? nextContent.stages.map(asRecord) : [];
    stages[index] = {
      ...stages[index],
      instruction,
    };
    updateContent({ ...nextContent, stages });
  }

  function updateCurrentStageField(field: string, value: string) {
    if (!draft) return;

    updateContent(updateStageInContent(contentRecord, draft.stageType, (stage) => ({
      ...stage,
      [field]: value,
    })));
  }

  function updateChoice(index: number, field: "label" | "id", value: string) {
    if (!draft) return;

    updateContent(updateStageInContent(contentRecord, draft.stageType, (stage) => {
      const choices = Array.isArray(stage.choices) ? stage.choices.map(asRecord) : [];
      choices[index] = {
        ...choices[index],
        [field]: value,
      };

      return {
        ...stage,
        choices,
      };
    }));
  }

  function setCorrectChoice(index: number) {
    if (!draft) return;

    updateContent(updateStageInContent(contentRecord, draft.stageType, (stage) => {
      const choices = Array.isArray(stage.choices) ? stage.choices.map(asRecord) : [];
      const nextChoices = choices.map((choice, choiceIndex) => ({
        ...choice,
        isCorrect: choiceIndex === index,
      }));
      const correctChoice = asRecord(nextChoices[index]);

      return {
        ...stage,
        choices: nextChoices,
        correctAnswer: String(correctChoice.id ?? `choice-${index + 1}`),
      };
    }));
  }

  function addChoice() {
    if (!draft) return;

    updateContent(updateStageInContent(contentRecord, draft.stageType, (stage) => {
      const choices = Array.isArray(stage.choices) ? stage.choices.map(asRecord) : [];
      const nextIndex = choices.length + 1;

      return {
        ...stage,
        choices: [
          ...choices,
          {
            id: `choice-${nextIndex}`,
            isCorrect: choices.length === 0,
            label: `New answer ${nextIndex}`,
          },
        ],
      };
    }));
  }

  function removeChoice(index: number) {
    if (!draft) return;

    updateContent(updateStageInContent(contentRecord, draft.stageType, (stage) => {
      const choices = Array.isArray(stage.choices) ? stage.choices.map(asRecord) : [];
      const nextChoices = choices.filter((_, choiceIndex) => choiceIndex !== index);

      return {
        ...stage,
        choices: nextChoices,
        correctAnswer: String(nextChoices.find((choice) => choice.isCorrect)?.id ?? nextChoices[0]?.id ?? ""),
      };
    }));
  }

  function insertAsset(asset: BatibotAssetMeta | AdminAsset, targetId: string) {
    const nextContent = cloneContent(contentRecord);
    const assetId = getInsertedAssetId(asset);
    const assetPatch = getInsertedAssetPatch(asset);

    if (targetId.startsWith("stage:")) {
      const stageLabel = targetId.replace("stage:", "");
      const stages = Array.isArray(nextContent.stages) ? nextContent.stages.map(asRecord) : [];
      updateContent({
        ...nextContent,
        stages: stages.map((stage) =>
          stage.stageLabel === stageLabel ? { ...stage, ...assetPatch } : stage
        ),
      });
      setMessage(`Inserted ${assetId} into ${stageLabel}.`);
      return;
    }

    if (targetId === "reward") {
      updateContent({
        ...nextContent,
        reward: {
          ...asRecord(nextContent.reward),
          badgeAssetKey: assetId,
        },
      });
      setMessage(`Inserted ${assetId} into reward.`);
      return;
    }

    updateContent({
      ...nextContent,
      ...assetPatch,
    });
    setMessage(`Inserted ${assetId} into topic.`);
  }

  if (!draft) {
    if (!draftId) {
      return (
        <AdminShell title="Draft Review" subtitle="Missing draft id.">
          <AdminCard>
            <AdminSectionHeader
              title="Draft route is missing an id"
              subtitle="Open this page from Create Draft or the Draft Queue after a draft has been saved."
            />
          </AdminCard>
        </AdminShell>
      );
    }

    if (loaded) {
      return (
        <AdminShell title="Draft Review" subtitle="Draft not found.">
          <AdminCard>
            <AdminSectionHeader
              title="Draft could not be found"
              subtitle="The draft may not have saved, may have been cleared from local fallback storage, or the link may be stale."
            />
          </AdminCard>
        </AdminShell>
      );
    }

    return (
      <AdminShell title="Draft Review" subtitle="Loading draft...">
        <AdminCard>
          <Text style={adminStyles.mutedText}>Draft not found or still loading.</Text>
        </AdminCard>
      </AdminShell>
    );
  }

  const editPanel = (
    <AdminCard>
      <AdminSectionHeader
        title="Content Editor"
        subtitle="Edit draft content only. Grade, world, stage rules, and validation rules stay locked."
        action={<AdminStatusBadge label={draft.status} />}
      />
      <LockedMetadata draft={draft} />
      <Text style={editorStyles.label}>Topic Title</Text>
      <TextInput style={editorStyles.input} value={topicTitle} onChangeText={setTopicTitle} />
      <Text style={editorStyles.label}>Optional Admin Prompt</Text>
      <TextInput
        multiline
        style={mergeAdminStyles(editorStyles.input, { minHeight: 76, textAlignVertical: "top" })}
        value={adminPrompt}
        onChangeText={setAdminPrompt}
      />
      <StageContentEditor
        stage={editableStage}
        onAddChoice={addChoice}
        onChoiceChange={updateChoice}
        onCorrectChoice={setCorrectChoice}
        onFieldChange={updateCurrentStageField}
        onRemoveChoice={removeChoice}
      />
      <StageInstructionEditor content={contentRecord} onChange={updateStageInstruction} />
      <AdminButton
        label={showAssetSelector ? "Hide Asset Selector" : "Insert Image Asset"}
        tone="secondary"
        onPress={() => setShowAssetSelector((current) => !current)}
      />
      {showAssetSelector ? (
        <AdminAssetSelector
          currentGrade={draft.gradeLevel}
          currentTopicId={draft.topicId}
          currentWorldId={draft.worldId}
          targets={stageTargets}
          onInsert={insertAsset}
        />
      ) : null}
      <Text style={editorStyles.label}>Advanced Content JSON</Text>
      <TextInput
        multiline
        style={mergeAdminStyles(editorStyles.input, editorStyles.jsonInput)}
        value={contentText}
        onChangeText={setContentText}
      />
      {parsedContent === null ? <Text style={editorStyles.errorText}>JSON is invalid.</Text> : null}
    </AdminCard>
  );

  const previewPanel = (
    <AdminCard>
      <AdminSectionHeader
        title="Mobile Preview"
        subtitle="Preview-only. No learner progress, reward, mastery, or route writes happen here."
      />
      <PreviewStateToggle value={previewState} onChange={setPreviewState} />
      <AdminMobileLessonPreview
        content={parsedContent ?? {}}
        metadata={draft.metadata}
        previewState={previewState}
        topicTitle={topicTitle}
      />
    </AdminCard>
  );

  const validationPanel = (
    <AdminCard>
      <AdminSectionHeader title="Validation & Actions" subtitle="Publish stays blocked until validation passes and the draft is approved." />
      {message ? <Text style={adminStyles.mutedText}>{message}</Text> : null}
      <View style={{ gap: 8 }}>
        {validationResults.length ? (
          validationResults.map((result) => (
            <View key={result.id} style={editorStyles.validationRow}>
              <AdminStatusBadge
                label={result.severity}
                tone={result.severity === "pass" ? "good" : result.severity === "warning" ? "warning" : "danger"}
              />
              <Text style={mergeAdminStyles(adminStyles.mutedText, { flex: 1 })}>{result.message}</Text>
            </View>
          ))
        ) : (
          <Text style={adminStyles.mutedText}>Run validation to see publish readiness.</Text>
        )}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <AdminButton disabled={busy || parsedContent === null} label="Save Draft" onPress={saveDraft} />
        <AdminButton disabled={busy || parsedContent === null} label="Validate Draft" tone="secondary" onPress={validateDraft} />
        <AdminButton disabled={busy || parsedContent === null} label="Submit for Confirmation" tone="secondary" onPress={submitForConfirmation} />
        <AdminButton disabled={!canApprove || busy} label="Approve" onPress={approveDraft} />
        <AdminButton disabled={!canPublish || busy} label="Publish" tone="secondary" onPress={publishDraft} />
      </View>
      <Text style={editorStyles.label}>Rejection Notes</Text>
      <TextInput
        multiline
        onChangeText={setRejectionNotes}
        placeholder="Explain what must be fixed before this content can be approved."
        style={mergeAdminStyles(editorStyles.input, { minHeight: 82, textAlignVertical: "top" })}
        value={rejectionNotes}
      />
      <AdminButton
        disabled={busy}
        label="Reject Draft"
        tone="danger"
        onPress={rejectDraft}
      />
    </AdminCard>
  );

  return (
    <AdminShell
      title="Draft Review"
      subtitle="Edit generated content, preview the mobile lesson, validate, approve, then publish."
    >
      {isNarrow ? (
        <View style={{ gap: 14 }}>
          <View style={editorStyles.tabRow}>
            {(["edit", "preview", "validate"] as ReviewTab[]).map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={mergeAdminStyles(editorStyles.tab, activeTab === tab && editorStyles.tabActive)}
              >
                <Text style={mergeAdminStyles(editorStyles.tabText, activeTab === tab && editorStyles.tabTextActive)}>
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>
          {activeTab === "edit" ? editPanel : null}
          {activeTab === "preview" ? previewPanel : null}
          {activeTab === "validate" ? validationPanel : null}
        </View>
      ) : (
        <View style={{ alignItems: "flex-start", flexDirection: "row", gap: 16 }}>
          <View style={{ flex: 1.1, minWidth: 320 }}>{editPanel}</View>
          <View style={{ flex: 1.15, minWidth: 420 }}>{previewPanel}</View>
          <View style={{ flex: 0.9, minWidth: 300 }}>{validationPanel}</View>
        </View>
      )}
    </AdminShell>
  );
}

function LockedMetadata({ draft }: { draft: AdminContentDraft }) {
  return (
    <View style={editorStyles.lockedBox}>
      <Text style={editorStyles.lockedText}>Grade: {draft.gradeLevel}</Text>
      <Text style={editorStyles.lockedText}>World: {draft.worldId}</Text>
      <Text style={editorStyles.lockedText}>Topic ID: {draft.topicId}</Text>
      <Text style={editorStyles.lockedText}>Stage: {draft.stageType}</Text>
      <Text style={editorStyles.lockedText}>Content Kind: {draft.contentKind}</Text>
      <Text style={editorStyles.lockedText}>Type: {draft.topicType}</Text>
    </View>
  );
}

function StageInstructionEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (index: number, instruction: string) => void;
}) {
  const stages = Array.isArray(content.stages) ? content.stages.map(asRecord) : [];

  if (!stages.length) {
    return <Text style={adminStyles.mutedText}>No editable stage instructions found.</Text>;
  }

  return (
    <View style={{ gap: 10 }}>
      <Text style={editorStyles.label}>Stage Instructions</Text>
      <ScrollView style={{ maxHeight: 260 }}>
        {stages.map((stage, index) => (
          <View key={`${stage.stageLabel ?? "stage"}-${index}`} style={editorStyles.stageInstructionRow}>
            <Text style={editorStyles.stageLabel}>{String(stage.stageLabel ?? `Stage ${index + 1}`)}</Text>
            <TextInput
              style={editorStyles.stageInput}
              value={String(stage.instruction ?? "")}
              onChangeText={(value) => onChange(index, value)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function StageContentEditor({
  onAddChoice,
  onChoiceChange,
  onCorrectChoice,
  onFieldChange,
  onRemoveChoice,
  stage,
}: {
  onAddChoice: () => void;
  onChoiceChange: (index: number, field: "label" | "id", value: string) => void;
  onCorrectChoice: (index: number) => void;
  onFieldChange: (field: string, value: string) => void;
  onRemoveChoice: (index: number) => void;
  stage: Record<string, unknown>;
}) {
  const choices = Array.isArray(stage.choices) ? stage.choices.map(asRecord) : [];

  return (
    <View style={editorStyles.stageEditorBox}>
      <Text style={editorStyles.label}>Selected Stage Content</Text>
      <Text style={editorStyles.stageEditorHint}>
        These fields drive the phone preview and learner-side stage structure.
      </Text>
      <EditorField label="Instruction" value={String(stage.instruction ?? "")} onChange={(value) => onFieldChange("instruction", value)} />
      <EditorField label="Title" value={String(stage.title ?? "")} onChange={(value) => onFieldChange("title", value)} />
      <EditorField multiline label="Body / Content" value={String(stage.body ?? stage.content ?? "")} onChange={(value) => onFieldChange("body", value)} />
      <EditorField multiline label="Passage" value={String(stage.passage ?? "")} onChange={(value) => onFieldChange("passage", value)} />
      <EditorField label="Question" value={String(stage.question ?? "")} onChange={(value) => onFieldChange("question", value)} />
      <EditorField label="Activity Type" value={String(stage.activityType ?? "")} onChange={(value) => onFieldChange("activityType", value)} />
      <EditorField label="Correct Feedback" value={String(stage.feedbackCorrect ?? "Great!")} onChange={(value) => onFieldChange("feedbackCorrect", value)} />
      <EditorField label="Wrong Feedback" value={String(stage.feedbackIncorrect ?? "Try Again.")} onChange={(value) => onFieldChange("feedbackIncorrect", value)} />
      <View style={{ gap: 8 }}>
        <View style={editorStyles.choiceHeaderRow}>
          <Text style={editorStyles.label}>Choices</Text>
          <AdminButton label="Add Choice" tone="secondary" onPress={onAddChoice} />
        </View>
        {choices.length ? (
          choices.map((choice, index) => (
            <View key={`${choice.id ?? index}`} style={editorStyles.choiceEditorRow}>
              <Pressable
                onPress={() => onCorrectChoice(index)}
                style={mergeAdminStyles(editorStyles.correctDot, choice.isCorrect === true && editorStyles.correctDotActive)}
              >
                <Text style={editorStyles.correctDotText}>{choice.isCorrect === true ? "OK" : ""}</Text>
              </Pressable>
              <TextInput
                style={mergeAdminStyles(editorStyles.stageInput, { flex: 0.45 })}
                value={String(choice.id ?? `choice-${index + 1}`)}
                onChangeText={(value) => onChoiceChange(index, "id", value)}
              />
              <TextInput
                style={editorStyles.stageInput}
                value={String(choice.label ?? "")}
                onChangeText={(value) => onChoiceChange(index, "label", value)}
              />
              <AdminButton label="Remove" tone="danger" onPress={() => onRemoveChoice(index)} />
            </View>
          ))
        ) : (
          <Text style={adminStyles.mutedText}>No choices yet. Add choices for TRY or CHOOSE stages.</Text>
        )}
      </View>
    </View>
  );
}

function EditorField({
  label,
  multiline = false,
  onChange,
  value,
}: {
  label: string;
  multiline?: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <View>
      <Text style={editorStyles.label}>{label}</Text>
      <TextInput
        multiline={multiline}
        style={mergeAdminStyles(editorStyles.input, multiline && { minHeight: 74, textAlignVertical: "top" })}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

function PreviewStateToggle({
  onChange,
  value,
}: {
  onChange: (value: PreviewState) => void;
  value: PreviewState;
}) {
  return (
    <View style={editorStyles.tabRow}>
      {(["default", "correct", "wrong"] as PreviewState[]).map((state) => (
        <Pressable
          key={state}
          onPress={() => onChange(state)}
          style={mergeAdminStyles(editorStyles.tab, value === state && editorStyles.tabActive)}
        >
          <Text style={mergeAdminStyles(editorStyles.tabText, value === state && editorStyles.tabTextActive)}>
            {state}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function getAssetTargets(content: Record<string, unknown>) {
  const stages = Array.isArray(content.stages) ? content.stages.map(asRecord) : [];
  const targets = [
    { id: "topic", label: "Topic" },
    ...stages.map((stage) => ({
      id: `stage:${String(stage.stageLabel ?? stage.id ?? "stage")}`,
      label: `${String(stage.stageLabel ?? "Stage")} stage`,
    })),
    { id: "reward", label: "Reward Badge" },
  ];

  return targets;
}

function getEditableStage(content: Record<string, unknown>, stageType?: string) {
  const stages = Array.isArray(content.stages) ? content.stages.map(asRecord) : [];
  const stage = stages.find((item) => String(item.stageLabel ?? item.stageType ?? "") === stageType);

  return stage ?? {
    activityType: String(content.activityType ?? ""),
    body: String(content.body ?? content.content ?? ""),
    choices: Array.isArray(content.choices) ? content.choices : [],
    correctAnswer: content.correctAnswer,
    feedbackCorrect: String(content.feedbackCorrect ?? "Great!"),
    feedbackIncorrect: String(content.feedbackIncorrect ?? "Try Again."),
    instruction: String(content.instruction ?? ""),
    passage: String(content.passage ?? ""),
    question: String(content.question ?? ""),
    stageLabel: stageType,
    title: String(content.title ?? content.topicTitle ?? ""),
  };
}

function updateStageInContent(
  content: Record<string, unknown>,
  stageType: string,
  updater: (stage: Record<string, unknown>) => Record<string, unknown>
) {
  const nextContent = cloneContent(content);
  const stages = Array.isArray(nextContent.stages) ? nextContent.stages.map(asRecord) : [];
  const stageIndex = stages.findIndex((stage) => String(stage.stageLabel ?? stage.stageType ?? "") === stageType);
  const currentStage = stageIndex >= 0
    ? stages[stageIndex]
    : {
        id: stageType.toLowerCase(),
        stageLabel: stageType,
      };
  const nextStage = updater(currentStage);
  const nextStages = stageIndex >= 0
    ? stages.map((stage, index) => (index === stageIndex ? nextStage : stage))
    : [...stages, nextStage];

  return {
    ...nextContent,
    ...pickStageTopLevelFields(nextStage),
    stages: nextStages,
  };
}

function pickStageTopLevelFields(stage: Record<string, unknown>) {
  return {
    activityType: stage.activityType,
    body: stage.body,
    choices: stage.choices,
    content: stage.body ?? stage.content,
    correctAnswer: stage.correctAnswer,
    feedbackCorrect: stage.feedbackCorrect,
    feedbackIncorrect: stage.feedbackIncorrect,
    instruction: stage.instruction,
    passage: stage.passage,
    question: stage.question,
    stageType: stage.stageLabel ?? stage.stageType,
    title: stage.title,
  };
}

function getInsertedAssetId(asset: BatibotAssetMeta | AdminAsset) {
  return "key" in asset ? asset.key : asset.id;
}

function getInsertedAssetPatch(asset: BatibotAssetMeta | AdminAsset) {
  if ("key" in asset) {
    return {
      assetKey: asset.key,
      assetLabel: asset.label,
    };
  }

  return {
    assetLabel: asset.name,
    assetUri: asset.uri,
  };
}

function getAttachedAssetRefs(content: unknown) {
  const refs = {
    audio: [] as string[],
    backgrounds: [] as string[],
    icons: [] as string[],
    images: [] as string[],
  };

  function add(field: keyof typeof refs, value: unknown) {
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
    const assetRefs = asRecord(record.assetRefs);
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

function cloneContent(content: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(content)) as Record<string, unknown>;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

const editorStyles = {
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "900" as const,
  },
  choiceEditorRow: {
    alignItems: "center" as const,
    flexDirection: "row" as const,
    gap: 8,
  },
  choiceHeaderRow: {
    alignItems: "center" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
  },
  correctDot: {
    alignItems: "center" as const,
    backgroundColor: "#FFFFFF",
    borderColor: "#C4B5FD",
    borderRadius: 999,
    borderWidth: 2,
    height: 34,
    justifyContent: "center" as const,
    width: 34,
  },
  correctDotActive: {
    backgroundColor: "#DCFCE7",
    borderColor: "#16A34A",
  },
  correctDotText: {
    color: "#16A34A",
    fontSize: 16,
    fontWeight: "900" as const,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7DDFB",
    borderRadius: 10,
    borderWidth: 1,
    color: "#111827",
    fontSize: 14,
    fontWeight: "700" as const,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  jsonInput: {
    fontFamily: "monospace",
    minHeight: 260,
    textAlignVertical: "top" as const,
  },
  label: {
    color: "#4C1D95",
    fontSize: 13,
    fontWeight: "900" as const,
    marginBottom: 6,
  },
  lockedBox: {
    backgroundColor: "#F5F3FF",
    borderColor: "#E7DDFB",
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
    padding: 12,
  },
  lockedText: {
    color: "#4C1D95",
    fontSize: 12,
    fontWeight: "900" as const,
  },
  stageInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7DDFB",
    borderRadius: 10,
    borderWidth: 1,
    color: "#111827",
    flex: 1,
    fontSize: 13,
    fontWeight: "700" as const,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  stageEditorBox: {
    backgroundColor: "#FBFAFF",
    borderColor: "#E7DDFB",
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginBottom: 14,
    padding: 12,
  },
  stageEditorHint: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700" as const,
    marginBottom: 6,
  },
  stageInstructionRow: {
    alignItems: "center" as const,
    flexDirection: "row" as const,
    gap: 8,
    marginBottom: 8,
  },
  stageLabel: {
    color: "#6D28D9",
    fontSize: 12,
    fontWeight: "900" as const,
    width: 74,
  },
  tab: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7DDFB",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tabActive: {
    backgroundColor: "#6D28D9",
    borderColor: "#6D28D9",
  },
  tabRow: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  tabText: {
    color: "#4C1D95",
    fontSize: 13,
    fontWeight: "900" as const,
    textTransform: "capitalize" as const,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  validationRow: {
    alignItems: "center" as const,
    flexDirection: "row" as const,
    gap: 8,
  },
};
