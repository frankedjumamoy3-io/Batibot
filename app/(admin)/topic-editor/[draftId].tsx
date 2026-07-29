import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useNavigation, usePreventRemove } from "@react-navigation/native";

import { AdminAssetSelector } from "@/src/components/admin/AdminAssetSelector";
import { AdminMobileLessonPreview } from "@/src/components/admin/AdminMobileLessonPreview";
import { AdminErrorState, AdminLoadingState, AdminWorkflowProgress } from "@/src/components/admin/AdminState";
import { AdminButton, AdminCard, AdminSectionHeader, AdminShell, AdminStatusBadge, adminStyles, mergeAdminStyles } from "@/src/components/admin/AdminShell";
import { AdminTopicStageEditor } from "@/src/components/admin/AdminTopicStageEditor";
import type { LearnerStagePreviewState } from "@/src/components/lesson/LearnerStageRenderer";
import { CONTENT_CURATION_STAGE_TYPES, type ContentCurationStageType } from "@/src/domain/admin/content-curation";
import {
  getDraftCompleteness,
  refreshStageCompleteness,
  type AdminStageAssetReference,
  type AdminStageDraft,
  type AdminTopicDifficulty,
  type AdminTopicDraft,
} from "@/src/domain/admin/topic-draft";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { getTopicDraft, submitTopicDraftForReview, updateTopicDraft } from "@/src/services/admin/adminTopicDraftService";
import { validateDraftStageAssets } from "@/src/services/admin/adminAssetService";

export default function AdminTopicEditorScreen() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { draftId } = useLocalSearchParams<{ draftId?: string | string[] }>();
  const id = Array.isArray(draftId) ? draftId[0] : draftId;
  const { profile } = useCurrentUserProfile();
  const [draft, setDraft] = useState<AdminTopicDraft | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [selectedStage, setSelectedStage] = useState<ContentCurationStageType>("LOOK");
  const [previewState, setPreviewState] = useState<LearnerStagePreviewState>("default");
  const [showAssets, setShowAssets] = useState(false);
  const [assetValidation, setAssetValidation] = useState<{ id: string; message: string; severity: "error" | "pass" | "warning" }[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [allowLeave, setAllowLeave] = useState(false);
  const isDirty = Boolean(draft && JSON.stringify(draft) !== savedSnapshot);
  const completeness = useMemo(() => draft ? getDraftCompleteness(draft) : null, [draft]);
  const readOnly = Boolean(draft && !["draft", "rejected"].includes(draft.status));

  const loadDraft = useCallback(async () => {
    if (!id) {
      setError("The draft ID is missing.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const loaded = await getTopicDraft(id, profile);
      setDraft(loaded);
      setSavedSnapshot(JSON.stringify(loaded));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "The topic draft could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [id, profile]);

  useEffect(() => { void loadDraft(); }, [loadDraft]);

  const saveDraft = useCallback(async () => {
    if (!draft || !id || readOnly) return null;
    setBusy(true);
    setMessage("");
    try {
      const saved = await updateTopicDraft(
        id,
        { ...draft, status: draft.status === "rejected" ? "draft" : draft.status },
        profile
      );
      setDraft(saved);
      setSavedSnapshot(JSON.stringify(saved));
      setMessage("Draft saved.");
      return saved;
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : "The topic draft could not be saved.");
      return null;
    } finally {
      setBusy(false);
    }
  }, [draft, id, profile, readOnly]);

  usePreventRemove(isDirty && !allowLeave, ({ data }) => {
    Alert.alert("Unsaved changes", "Save your topic draft before leaving?", [
      { style: "cancel", text: "Cancel" },
      { style: "destructive", text: "Discard and Leave", onPress: () => { setAllowLeave(true); setTimeout(() => navigation.dispatch(data.action), 0); } },
      { text: "Save and Leave", onPress: () => { void saveDraft().then((saved) => { if (saved) { setAllowLeave(true); setTimeout(() => navigation.dispatch(data.action), 0); } }); } },
    ]);
  });

  function patchDraft(patch: Partial<AdminTopicDraft>) {
    if (!draft || readOnly) return;
    setDraft({ ...draft, ...patch });
    setMessage("");
  }

  function updateStage(stage: AdminStageDraft) {
    if (!draft || readOnly) return;
    const stages = refreshStageCompleteness(
      draft.stages.map((item) => item.stageType === stage.stageType ? stage : item)
    );
    patchDraft({ stages });
  }

  async function submitForReview() {
    if (!draft || !id || !completeness?.canSubmitForReview) return;
    const saved = isDirty ? await saveDraft() : draft;
    if (!saved) return;
    setBusy(true);
    try {
      const submitted = await submitTopicDraftForReview(id, profile);
      setDraft(submitted);
      setSavedSnapshot(JSON.stringify(submitted));
      setMessage("Draft submitted for review.");
    } catch (submitError) {
      setMessage(submitError instanceof Error ? submitError.message : "The draft could not be submitted.");
    } finally {
      setBusy(false);
    }
  }

  const stage = draft?.stages.find((item) => item.stageType === selectedStage) ?? draft?.stages[0];
  const template = draft?.templateSnapshot?.stageTemplates[selectedStage];
  const stageAssetRefs = stage?.assetRefs;

  useEffect(() => {
    let mounted = true;
    if (!profile || !stageAssetRefs || !template) {
      setAssetValidation([]);
      return () => { mounted = false; };
    }
    void validateDraftStageAssets(stageAssetRefs, template.assetSlotRules, profile)
      .then((results) => { if (mounted) setAssetValidation(results); })
      .catch(() => { if (mounted) setAssetValidation([{ id: "asset-validation", message: "Unable to validate current stage assets.", severity: "warning" }]); });
    return () => { mounted = false; };
  }, [profile, stageAssetRefs, template]);

  if (loading) return <AdminShell title="Topic Editor"><AdminLoadingState message="Loading topic draft..." /></AdminShell>;
  if (error || !draft) return <AdminShell title="Topic Editor"><AdminErrorState message={error || "Draft not found."} onRetry={id ? loadDraft : undefined} /></AdminShell>;

  const stacked = width < 1180;

  function attachAsset(asset: AdminStageAssetReference) {
    if (!stage || !template) return;
    const rule = template.assetSlotRules.find((item) => item.role === asset.role);
    const otherRoles = stage.assetRefs.filter((item) => item.role !== asset.role);
    const current = stage.assetRefs.filter(
      (item) => item.role === asset.role && (item.assetId ?? item.id) !== (asset.assetId ?? asset.id)
    );
    const nextForRole = rule && current.length >= rule.maxCount
      ? [...current.slice(1), asset]
      : [...current, asset];
    const next = [...otherRoles, ...nextForRole];
    updateStage({ ...stage, assetRefs: next });
    setMessage(`${asset.assetId ?? asset.id} attached to ${asset.role}.`);
  }

  function removeAsset(assetId: string, role: string) {
    if (!stage) return;
    updateStage({
      ...stage,
      assetRefs: stage.assetRefs.filter((item) => (item.assetId ?? item.id) !== assetId || item.role !== role),
    });
    setMessage(`${assetId} removed from ${role}.`);
  }

  return (
    <AdminShell title="Topic Editor" subtitle="Edit content, attach approved assets, preview learner states, save, then submit a complete draft for review.">
      <AdminWorkflowProgress current={draft.status === "draft" || draft.status === "rejected" ? "draft" : "review"} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stageTabs}>
        {CONTENT_CURATION_STAGE_TYPES.map((stageType) => {
          const item = draft.stages.find((candidate) => candidate.stageType === stageType);
          return (
            <Pressable
              key={stageType}
              onPress={() => { setSelectedStage(stageType); setPreviewState("default"); setShowAssets(false); }}
              style={mergeAdminStyles(styles.stageTab, selectedStage === stageType && styles.stageTabActive)}
            >
              <Text style={mergeAdminStyles(styles.stageTabText, selectedStage === stageType && styles.stageTabTextActive)}>
                {stageType}{item?.isComplete ? " complete" : ""}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ alignItems: "flex-start", flexDirection: stacked ? "column" : "row", gap: 16 }}>
        <View style={{ minWidth: 280, width: stacked ? "100%" : 300 }}>
          <AdminCard>
            <AdminSectionHeader title="Topic Details" subtitle="Curriculum identity and interface structure stay locked." />
            <LockedLine label="Grade" value={draft.gradeLevel} />
            <LockedLine label="World" value={draft.worldId} />
            <LockedLine label="Topic ID" value={draft.topicId} />
            <Field label="Topic Title" readOnly={readOnly} value={draft.topicTitle} onChange={(topicTitle) => patchDraft({ topicTitle })} />
            <Field multiline label="Learning Objective" readOnly={readOnly} value={draft.objective} onChange={(objective) => patchDraft({ objective })} />
            <Field multiline label="Description" readOnly={readOnly} value={draft.description ?? ""} onChange={(description) => patchDraft({ description })} />
            <Difficulty value={draft.difficulty} readOnly={readOnly} onChange={(difficulty) => patchDraft({ difficulty })} />
            <Field multiline label="Admin Notes" readOnly={readOnly} value={draft.adminNotes ?? ""} onChange={(adminNotes) => patchDraft({ adminNotes })} />
          </AdminCard>
        </View>

        <View style={{ flex: 1, minWidth: 340, width: stacked ? "100%" : undefined }}>
          <AdminCard>
            {stage ? <AdminTopicStageEditor onChange={updateStage} readOnly={readOnly} stage={stage} template={template} /> : <Text style={adminStyles.mutedText}>Required stage data is missing.</Text>}
          </AdminCard>
        </View>

        <View style={{ gap: 16, minWidth: 340, width: stacked ? "100%" : 420 }}>
          <AdminCard>
            <AdminSectionHeader title="Mobile Preview" subtitle="Shared learner renderer. Preview state is local and never writes learner progress." />
            <PreviewStateToggle onChange={setPreviewState} value={previewState} />
            {template && stage ? (
              <AdminMobileLessonPreview
                backgroundRef={draft.templateSnapshot?.worldTheme.backgroundRef}
                content={stage}
                previewState={previewState}
                template={template}
              />
            ) : (
              <Text style={adminStyles.mutedText}>This draft has no resolved stage template.</Text>
            )}
          </AdminCard>

          {template && stage ? (
            <AdminCard>
              <AdminSectionHeader title="Stage Assets" subtitle="Only assets attached to this stage are validated and previewed." />
              {assetValidation.map((result) => (
                <View key={result.id} style={styles.assetValidationRow}>
                  <AdminStatusBadge label={result.severity} tone={result.severity === "pass" ? "good" : result.severity === "warning" ? "warning" : "danger"} />
                  <Text style={mergeAdminStyles(adminStyles.mutedText, styles.assetValidationText)}>{result.message}</Text>
                </View>
              ))}
              <AdminButton disabled={readOnly} label={showAssets ? "Hide Asset Selector" : "Select or Upload Asset"} tone="secondary" onPress={() => setShowAssets((value) => !value)} />
              {showAssets ? (
                <AdminAssetSelector
                  key={stage.stageType}
                  currentGrade={draft.gradeLevel}
                  currentStageType={stage.stageType}
                  currentTopicId={draft.topicId}
                  currentWorldId={draft.worldId}
                  onAttach={attachAsset}
                  onRemove={removeAsset}
                  rules={template.assetSlotRules}
                  selectedAssetRefs={stage.assetRefs}
                />
              ) : null}
            </AdminCard>
          ) : null}

          <AdminCard>
            <AdminSectionHeader title="Draft Status" action={<AdminStatusBadge label={draft.status} tone={draft.status === "published" || draft.status === "approved" ? "good" : draft.status === "rejected" ? "danger" : "warning"} />} />
            <Text style={adminStyles.mutedText}>Updated {formatDate(draft.updatedAt)}</Text>
            <Text style={styles.completeness}>{completeness?.completeStages ?? 0}/{completeness?.totalStages ?? 6} stages complete</Text>
            {completeness?.missingFields.slice(0, 8).map((item) => <Text key={item} style={styles.missing}>- {item}</Text>)}
            {message ? <Text style={adminStyles.mutedText}>{message}</Text> : null}
            {readOnly ? (
              <Text style={styles.readOnly}>This draft status is read-only until the review workflow changes it.</Text>
            ) : (
              <>
                <AdminButton disabled={busy || !isDirty} label={busy ? "Saving..." : "Save Draft"} onPress={() => { void saveDraft(); }} />
                <AdminButton disabled={busy || !completeness?.canSubmitForReview || draft.status !== "draft"} label="Submit for Review" tone="secondary" onPress={() => { void submitForReview(); }} />
              </>
            )}
            <AdminButton label="Back" tone="secondary" onPress={() => router.back()} />
          </AdminCard>
        </View>
      </View>
    </AdminShell>
  );
}

function PreviewStateToggle({ onChange, value }: { onChange: (value: LearnerStagePreviewState) => void; value: LearnerStagePreviewState }) {
  return <View style={styles.previewStates}>{(["default", "correct", "wrong"] as const).map((state) => <Pressable key={state} onPress={() => onChange(state)} style={mergeAdminStyles(styles.previewState, value === state && styles.previewStateActive)}><Text style={mergeAdminStyles(styles.previewStateText, value === state && styles.previewStateTextActive)}>{state}</Text></Pressable>)}</View>;
}

function LockedLine({ label, value }: { label: string; value: string }) { return <View style={styles.locked}><Text style={styles.lockedLabel}>{label}</Text><Text style={styles.lockedValue}>{value}</Text></View>; }
function Field({ label, multiline = false, onChange, readOnly, value }: { label: string; multiline?: boolean; onChange: (value: string) => void; readOnly: boolean; value: string }) { return <View><Text style={styles.label}>{label}</Text><TextInput editable={!readOnly} multiline={multiline} onChangeText={onChange} style={mergeAdminStyles(styles.input, multiline && styles.multiline, readOnly && styles.disabled)} value={value} /></View>; }
function Difficulty({ onChange, readOnly, value }: { onChange: (value: AdminTopicDifficulty) => void; readOnly: boolean; value: AdminTopicDifficulty }) { return <View><Text style={styles.label}>Difficulty</Text><View style={styles.difficultyRow}>{(["easy", "medium", "hard"] as const).map((item) => <Pressable disabled={readOnly} key={item} onPress={() => onChange(item)} style={mergeAdminStyles(styles.difficulty, value === item && styles.difficultyActive, readOnly && styles.disabled)}><Text style={mergeAdminStyles(styles.difficultyText, value === item && styles.difficultyTextActive)}>{item}</Text></Pressable>)}</View></View>; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "recently" : date.toLocaleString(); }

const styles = {
  assetValidationRow: { alignItems: "center" as const, flexDirection: "row" as const, gap: 7 },
  assetValidationText: { flex: 1 },
  completeness: { color: "#4C1D95", fontSize: 16, fontWeight: "900" as const, marginVertical: 10 },
  difficulty: { borderColor: "#E7DDFB", borderRadius: 999, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7 },
  difficultyActive: { backgroundColor: "#6D28D9", borderColor: "#6D28D9" },
  difficultyRow: { flexDirection: "row" as const, gap: 7, marginBottom: 12 },
  difficultyText: { color: "#4C1D95", fontSize: 11, fontWeight: "900" as const },
  difficultyTextActive: { color: "#FFFFFF" },
  disabled: { opacity: 0.55 },
  input: { backgroundColor: "#FFFFFF", borderColor: "#E7DDFB", borderRadius: 9, borderWidth: 1, color: "#111827", fontSize: 13, marginBottom: 12, minHeight: 42, padding: 10 },
  label: { color: "#4C1D95", fontSize: 12, fontWeight: "900" as const, marginBottom: 5 },
  locked: { backgroundColor: "#F5F3FF", borderRadius: 8, marginBottom: 8, padding: 9 },
  lockedLabel: { color: "#64748B", fontSize: 10, fontWeight: "800" as const, textTransform: "uppercase" as const },
  lockedValue: { color: "#4C1D95", fontSize: 12, fontWeight: "900" as const, marginTop: 2 },
  missing: { color: "#B45309", fontSize: 12, fontWeight: "700" as const, lineHeight: 18 },
  multiline: { minHeight: 72, textAlignVertical: "top" as const },
  previewState: { borderColor: "#E7DDFB", borderRadius: 999, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 7 },
  previewStateActive: { backgroundColor: "#6D28D9", borderColor: "#6D28D9" },
  previewStateText: { color: "#4C1D95", fontSize: 11, fontWeight: "900" as const, textTransform: "capitalize" as const },
  previewStateTextActive: { color: "#FFFFFF" },
  previewStates: { flexDirection: "row" as const, gap: 7, justifyContent: "center" as const },
  readOnly: { backgroundColor: "#F5F3FF", borderRadius: 8, color: "#4C1D95", fontSize: 12, fontWeight: "800" as const, padding: 10 },
  stageTab: { backgroundColor: "#FFFFFF", borderColor: "#E7DDFB", borderRadius: 999, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 9 },
  stageTabActive: { backgroundColor: "#6D28D9", borderColor: "#6D28D9" },
  stageTabText: { color: "#4C1D95", fontSize: 12, fontWeight: "900" as const },
  stageTabTextActive: { color: "#FFFFFF" },
  stageTabs: { gap: 8 },
};
