import { Pressable, Text, TextInput, View } from "react-native";

import { AdminStatusBadge, adminStyles, mergeAdminStyles } from "@/src/components/admin/AdminShell";
import {
  PROVISIONAL_PLAY_ACTIVITY_TYPES,
  type AdminStageChoice,
  type AdminStageDraft,
} from "@/src/domain/admin/topic-draft";
import type { StageTemplate } from "@/src/domain/admin/curriculum-metadata";

export function AdminTopicStageEditor({
  onChange,
  readOnly,
  stage,
  template,
}: {
  onChange: (stage: AdminStageDraft) => void;
  readOnly: boolean;
  stage: AdminStageDraft;
  template?: StageTemplate;
}) {
  const update = <K extends keyof AdminStageDraft>(field: K, value: AdminStageDraft[K]) => onChange({ ...stage, [field]: value });
  const showChoices = stage.stageType === "TRY" || stage.stageType === "CHOOSE";

  return (
    <View style={{ gap: 12 }}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>{stage.stageType} Content</Text>
        <AdminStatusBadge label={stage.isComplete ? "complete" : "incomplete"} tone={stage.isComplete ? "good" : "warning"} />
      </View>
      {template ? (
        <View style={styles.templateRules}>
          <Text style={styles.label}>Template Requirements</Text>
          <View style={styles.optionRow}>
            {template.requiredFields.map((field) => (
              <AdminStatusBadge key={field} label={field} />
            ))}
          </View>
          <Text style={adminStyles.mutedText}>
            Renderer, layout, stage order, feedback position, and primary button are locked by BatiBot.
          </Text>
        </View>
      ) : null}
      <EditorField label="Instruction" readOnly={readOnly} value={stage.instruction} onChange={(value) => update("instruction", value)} />
      {stage.stageType === "LOOK" ? (
        <>
          <EditorField label="Title" readOnly={readOnly} value={stage.title ?? ""} onChange={(value) => update("title", value)} />
          <EditorField label="Target Word (optional)" readOnly={readOnly} value={stage.word ?? ""} onChange={(value) => update("word", value)} />
          <EditorField multiline label="Meaning / Short Body" readOnly={readOnly} value={stage.meaning ?? stage.body ?? ""} onChange={(value) => update("meaning", value)} />
          <EditorField multiline label="Example" readOnly={readOnly} value={stage.example ?? ""} onChange={(value) => update("example", value)} />
        </>
      ) : null}
      {stage.stageType === "TAP" ? (
        <>
          <EditorField multiline label="Meaning" readOnly={readOnly} value={stage.meaning ?? ""} onChange={(value) => update("meaning", value)} />
          <EditorField multiline label="Example" readOnly={readOnly} value={stage.example ?? ""} onChange={(value) => update("example", value)} />
          <EditorField label="Pronunciation Text" readOnly={readOnly} value={stage.pronunciation ?? ""} onChange={(value) => update("pronunciation", value)} />
          <EditorField multiline label="Reveal Items / Guided Content" readOnly={readOnly} value={stage.body ?? ""} onChange={(value) => update("body", value)} />
        </>
      ) : null}
      {stage.stageType === "CHOOSE" ? <EditorField multiline label="Passage / Model (optional)" readOnly={readOnly} value={stage.passage ?? ""} onChange={(value) => update("passage", value)} /> : null}
      {showChoices ? (
        <>
          <EditorField multiline label="Question" readOnly={readOnly} value={stage.question ?? ""} onChange={(value) => update("question", value)} />
          <ChoiceEditor readOnly={readOnly} stage={stage} onChange={onChange} />
          <FeedbackFields readOnly={readOnly} stage={stage} update={update} />
        </>
      ) : null}
      {stage.stageType === "PLAY" ? (
        <>
          <Text style={styles.label}>Activity Type</Text>
          <View style={styles.optionRow}>
            {(template?.allowedActivityTypes.length
              ? template.allowedActivityTypes
              : PROVISIONAL_PLAY_ACTIVITY_TYPES
            ).map((type) => (
              <Pressable disabled={readOnly} key={type} onPress={() => update("activityType", type)} style={mergeAdminStyles(styles.option, stage.activityType === type && styles.optionActive, readOnly && styles.disabled)}>
                <Text style={mergeAdminStyles(styles.optionText, stage.activityType === type && styles.optionTextActive)}>{type}</Text>
              </Pressable>
            ))}
          </View>
          <EditorField multiline label="Activity Prompt" readOnly={readOnly} value={stage.activityPrompt ?? ""} onChange={(value) => update("activityPrompt", value)} />
          <EditorField label="Answer Key IDs (comma separated)" readOnly={readOnly} value={(stage.correctAnswerIds ?? []).join(", ")} onChange={(value) => update("correctAnswerIds", value.split(",").map((item) => item.trim()).filter(Boolean))} />
          <EditorField label="Timer Seconds (optional)" readOnly={readOnly} value={stage.timerSeconds ? String(stage.timerSeconds) : ""} onChange={(value) => update("timerSeconds", value ? Number(value) : undefined)} />
          <FeedbackFields readOnly={readOnly} stage={stage} update={update} />
        </>
      ) : null}
      {stage.stageType === "REWARD" ? (
        <>
          <EditorField label="Success Title" readOnly={readOnly} value={stage.title ?? ""} onChange={(value) => update("title", value)} />
          <EditorField multiline label="Completion Summary" readOnly={readOnly} value={stage.body ?? ""} onChange={(value) => update("body", value)} />
          <EditorField multiline label="Encouragement (optional)" readOnly={readOnly} value={stage.example ?? ""} onChange={(value) => update("example", value)} />
        </>
      ) : null}
      <View style={styles.assetBoundary}>
        <Text style={styles.label}>Asset References</Text>
        <Text style={adminStyles.mutedText}>{stage.assetRefs.length} attached. Manage these in the Stage Assets panel beside the preview.</Text>
        {template?.assetSlotRules.map((slot) => (
          <Text key={slot.id} style={adminStyles.mutedText}>
            {slot.role}: {slot.minCount}-{slot.maxCount} {slot.type}{slot.required ? " (required)" : ""}
          </Text>
        ))}
      </View>
    </View>
  );
}

function ChoiceEditor({ onChange, readOnly, stage }: { onChange: (stage: AdminStageDraft) => void; readOnly: boolean; stage: AdminStageDraft }) {
  const choices = stage.choices ?? [];
  const max = stage.stageType === "TRY" ? 3 : 4;
  const setChoices = (next: AdminStageChoice[]) => onChange({ ...stage, choices: next, correctAnswerIds: next.filter((choice) => choice.isCorrect).map((choice) => choice.id) });

  return <View style={{ gap: 9 }}><View style={styles.headingRow}><Text style={styles.label}>Choices ({choices.length}/{max})</Text><Pressable disabled={readOnly || choices.length >= max} onPress={() => setChoices([...choices, { id: `choice-${Date.now()}`, isCorrect: false, label: "" }])} style={mergeAdminStyles(styles.smallButton, (readOnly || choices.length >= max) && styles.disabled)}><Text style={styles.smallButtonText}>Add Choice</Text></Pressable></View>{choices.map((choice, index) => <View key={choice.id} style={styles.choiceRow}><Pressable disabled={readOnly} onPress={() => setChoices(choices.map((item) => ({ ...item, isCorrect: item.id === choice.id })))} style={mergeAdminStyles(styles.correct, choice.isCorrect && styles.correctActive)}><Text style={styles.correctText}>{choice.isCorrect ? "Correct" : "Mark"}</Text></Pressable><TextInput editable={!readOnly} onChangeText={(label) => setChoices(choices.map((item, itemIndex) => itemIndex === index ? { ...item, label } : item))} style={styles.input} value={choice.label} /><Pressable disabled={readOnly} onPress={() => setChoices(choices.filter((item) => item.id !== choice.id))} style={mergeAdminStyles(styles.remove, readOnly && styles.disabled)}><Text style={styles.removeText}>Remove</Text></Pressable></View>)}</View>;
}

function FeedbackFields({ readOnly, stage, update }: { readOnly: boolean; stage: AdminStageDraft; update: <K extends keyof AdminStageDraft>(field: K, value: AdminStageDraft[K]) => void }) {
  return <><EditorField label="Success Feedback" readOnly={readOnly} value={stage.feedbackCorrect ?? ""} onChange={(value) => update("feedbackCorrect", value)} /><EditorField label="Wrong Feedback" readOnly={readOnly} value={stage.feedbackIncorrect ?? ""} onChange={(value) => update("feedbackIncorrect", value)} /></>;
}

function EditorField({ label, multiline = false, onChange, readOnly, value }: { label: string; multiline?: boolean; onChange: (value: string) => void; readOnly: boolean; value: string }) {
  return <View><Text style={styles.label}>{label}</Text><TextInput editable={!readOnly} multiline={multiline} onChangeText={onChange} style={mergeAdminStyles(styles.input, multiline && styles.multiline, readOnly && styles.disabled)} value={value} /></View>;
}

const styles = {
  assetBoundary: { backgroundColor: "#FBFAFF", borderColor: "#E7DDFB", borderRadius: 10, borderStyle: "dashed" as const, borderWidth: 1, padding: 12 },
  choiceRow: { alignItems: "center" as const, flexDirection: "row" as const, gap: 8 },
  correct: { alignItems: "center" as const, borderColor: "#C4B5FD", borderRadius: 8, borderWidth: 1, justifyContent: "center" as const, minHeight: 42, paddingHorizontal: 9 },
  correctActive: { backgroundColor: "#DCFCE7", borderColor: "#16A34A" },
  correctText: { color: "#4C1D95", fontSize: 11, fontWeight: "900" as const },
  disabled: { opacity: 0.45 },
  heading: { color: "#111827", fontSize: 18, fontWeight: "900" as const },
  headingRow: { alignItems: "center" as const, flexDirection: "row" as const, gap: 10, justifyContent: "space-between" as const },
  input: { backgroundColor: "#FFFFFF", borderColor: "#E7DDFB", borderRadius: 9, borderWidth: 1, color: "#111827", flex: 1, fontSize: 13, minHeight: 42, paddingHorizontal: 11, paddingVertical: 9 },
  label: { color: "#4C1D95", fontSize: 13, fontWeight: "900" as const, marginBottom: 6 },
  multiline: { minHeight: 76, textAlignVertical: "top" as const },
  option: { borderColor: "#E7DDFB", borderRadius: 999, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7 },
  optionActive: { backgroundColor: "#6D28D9", borderColor: "#6D28D9" },
  optionRow: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 7 },
  optionText: { color: "#4C1D95", fontSize: 11, fontWeight: "900" as const },
  optionTextActive: { color: "#FFFFFF" },
  remove: { padding: 8 },
  removeText: { color: "#DC2626", fontSize: 11, fontWeight: "900" as const },
  smallButton: { backgroundColor: "#EDE9FE", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 },
  smallButtonText: { color: "#4C1D95", fontSize: 11, fontWeight: "900" as const },
  templateRules: { backgroundColor: "#F5F3FF", borderColor: "#E7DDFB", borderRadius: 10, borderWidth: 1, gap: 8, padding: 12 },
};
