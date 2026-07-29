import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { beginTopicCreation } from "@/src/application/admin/content-curation";
import {
  AdminButton,
  AdminCard,
  AdminSectionHeader,
  AdminShell,
  AdminStatusBadge,
  adminStyles,
  mergeAdminStyles,
} from "@/src/components/admin/AdminShell";
import { AdminWorkflowProgress } from "@/src/components/admin/AdminState";
import { CONTENT_CURATION_STAGE_TYPES } from "@/src/domain/admin/content-curation";
import {
  toTopicSlug,
  type AdminTopicDifficulty,
  type AdminTopicDraftMode,
} from "@/src/domain/admin/topic-draft";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import {
  listGrades,
  listTopicsByWorld,
  listWorldsByGrade,
} from "@/src/services/admin/batibotMetadataApi";

export default function AdminCreateTopicScreen() {
  const { profile } = useCurrentUserProfile();
  const grades = useMemo(() => listGrades(), []);
  const [step, setStep] = useState<1 | 2>(1);
  const [gradeLevel, setGradeLevel] = useState("");
  const worlds = useMemo(
    () => (gradeLevel ? listWorldsByGrade(gradeLevel) : []),
    [gradeLevel]
  );
  const [worldId, setWorldId] = useState("");
  const selectedWorld = worlds.find((world) => world.id === worldId);
  const existingTopics = useMemo(
    () => (gradeLevel && worldId ? listTopicsByWorld(gradeLevel, worldId) : []),
    [gradeLevel, worldId]
  );
  const sourceTopic = existingTopics.find((topic) => topic.title === sourceTopicTitle);
  const [mode, setMode] = useState<AdminTopicDraftMode>("create");
  const [sourceTopicTitle, setSourceTopicTitle] = useState("");
  const [topicTitle, setTopicTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<AdminTopicDifficulty>("easy");
  const [adminNotes, setAdminNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const locationReady = Boolean(gradeLevel && selectedWorld && (mode === "create" || sourceTopicTitle));

  async function createDraft() {
    setBusy(true);
    setMessage("");
    try {
      const draft = await beginTopicCreation(
        {
          adminNotes,
          description,
          difficulty,
          gradeLevel,
          mode,
          objective,
          sourceTopicId: mode === "editExisting" ? sourceTopic?.id : undefined,
          sourceTopicTitle: mode === "editExisting" ? sourceTopicTitle : undefined,
          topicTitle,
          worldId,
        },
        profile
      );
      router.push({ pathname: "/(admin)/topic-editor/[draftId]", params: { draftId: draft.id } });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to initialize the topic draft.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell title="Create Topic" subtitle="Create a new topic or make an editable draft copy of existing curriculum content.">
      <AdminWorkflowProgress current="create" />
      <View style={{ alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        <View style={{ flex: 1.5, minWidth: 340 }}>
          <AdminCard>
            {step === 1 ? (
              <>
                <AdminSectionHeader eyebrow="Step 1" title="Curriculum location" subtitle="Choose where this topic draft belongs." />
                <OptionRow label="Grade" options={grades.map((grade) => grade.id)} value={gradeLevel} onChange={(value) => { setGradeLevel(value); setWorldId(""); setSourceTopicTitle(""); }} />
                <OptionRow disabled={!gradeLevel} label="World" options={worlds.map((world) => world.id)} value={worldId} onChange={(value) => { setWorldId(value); setSourceTopicTitle(""); }} />
                <OptionRow label="Topic Mode" options={["Create New Topic", "Edit Existing Topic"]} value={mode === "create" ? "Create New Topic" : "Edit Existing Topic"} onChange={(value) => { const nextMode = value === "Edit Existing Topic" ? "editExisting" : "create"; setMode(nextMode); setSourceTopicTitle(""); setTopicTitle(""); }} />
                {mode === "editExisting" ? (
                  <OptionRow disabled={!selectedWorld} label="Existing Topic" options={existingTopics.map((topic) => topic.title)} value={sourceTopicTitle} onChange={(value) => { setSourceTopicTitle(value); setTopicTitle(value); }} />
                ) : null}
                <AdminButton disabled={!locationReady} label="Continue" onPress={() => setStep(2)} />
              </>
            ) : (
              <>
                <AdminSectionHeader eyebrow="Step 2" title="Topic details" subtitle="These fields travel with the draft; grade, world, and stage order stay locked." />
                <Field label="Topic Title" value={topicTitle} onChange={setTopicTitle} readOnly={mode === "editExisting"} />
                <Text style={styles.slug}>Topic slug: {toTopicSlug(topicTitle) || "—"}</Text>
                <Field multiline label="Learning Objective" value={objective} onChange={setObjective} />
                <Field multiline label="Short Description" value={description} onChange={setDescription} />
                <OptionRow label="Difficulty" options={["easy", "medium", "hard"]} value={difficulty} onChange={(value) => setDifficulty(value as AdminTopicDifficulty)} />
                <Field multiline label="Administrator Notes (optional)" value={adminNotes} onChange={setAdminNotes} />
                {message ? <Text style={adminStyles.mutedText}>{message}</Text> : null}
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                  <AdminButton label="Back" tone="secondary" onPress={() => setStep(1)} />
                  <AdminButton disabled={busy || !topicTitle.trim() || !objective.trim()} label={busy ? "Creating Draft..." : "Create Structured Draft"} onPress={createDraft} />
                </View>
              </>
            )}
          </AdminCard>
        </View>
        <View style={{ flex: 1, minWidth: 290 }}>
          <AdminCard>
            <AdminSectionHeader title={selectedWorld?.title ?? "Select a world"} subtitle="The six-stage structure is fixed and cannot be reordered or removed." />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {CONTENT_CURATION_STAGE_TYPES.map((stage) => <AdminStatusBadge key={stage} label={stage} />)}
            </View>
            <Text style={adminStyles.mutedText}>{mode === "editExisting" ? "Existing content is copied into a separate draft. Static curriculum is never edited directly." : "A new empty topic draft is created without Gemini, upload, validation, or publishing side effects."}</Text>
          </AdminCard>
        </View>
      </View>
    </AdminShell>
  );
}

function OptionRow({ disabled = false, label, onChange, options, value }: { disabled?: boolean; label: string; onChange: (value: string) => void; options: string[]; value: string }) {
  return <View style={{ gap: 7, marginBottom: 14 }}><Text style={styles.label}>{label}</Text><View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{options.map((option) => <Pressable disabled={disabled} key={option} onPress={() => onChange(option)} style={mergeAdminStyles(styles.option, option === value && styles.optionActive, disabled && styles.disabled)}><Text style={mergeAdminStyles(styles.optionText, option === value && styles.optionTextActive)}>{option}</Text></Pressable>)}</View></View>;
}

function Field({ label, multiline = false, onChange, readOnly = false, value }: { label: string; multiline?: boolean; onChange: (value: string) => void; readOnly?: boolean; value: string }) {
  return <View><Text style={styles.label}>{label}</Text><TextInput editable={!readOnly} multiline={multiline} onChangeText={onChange} style={mergeAdminStyles(styles.input, multiline && styles.multiline, readOnly && styles.disabled)} value={value} /></View>;
}

const styles = {
  disabled: { opacity: 0.45 },
  input: { backgroundColor: "#FFFFFF", borderColor: "#E7DDFB", borderRadius: 10, borderWidth: 1, color: "#111827", fontSize: 14, marginBottom: 14, padding: 12 },
  label: { color: "#4C1D95", fontSize: 13, fontWeight: "900" as const, marginBottom: 6 },
  multiline: { minHeight: 82, textAlignVertical: "top" as const },
  option: { backgroundColor: "#FFFFFF", borderColor: "#E7DDFB", borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  optionActive: { backgroundColor: "#6D28D9", borderColor: "#6D28D9" },
  optionText: { color: "#4C1D95", fontSize: 12, fontWeight: "900" as const },
  optionTextActive: { color: "#FFFFFF" },
  slug: { color: "#64748B", fontSize: 12, fontWeight: "700" as const, marginBottom: 14, marginTop: -8 },
};
