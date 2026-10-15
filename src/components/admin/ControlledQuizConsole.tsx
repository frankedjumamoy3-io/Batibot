import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { CURRICULUM } from "@/src/data/curriculum/learning-path";
import { DEFAULT_REVIEW_CHECKLIST, type CuratedQuiz, type CuratedQuizDraft, type MultipleChoiceQuestion, type QuizReviewChecklist } from "@/src/types/quiz";
import { archiveQuiz, createQuizDraft, deleteDraft, getAdminActivityLogs, getCuratedQuizzes, publishQuiz, unpublishQuiz, updateQuizDraft, type AdminActivityLog } from "@/src/services/adminQuizService";
import { useAuthSession } from "@/src/store/auth-session";

const CHECK_LABELS: Record<keyof QuizReviewChecklist, string> = {
  ageAppropriate: "Age appropriate", objectiveClear: "Objective is clear", instructionsUnderstandable: "Instructions are understandable",
  questionsComplete: "Questions are complete", answersValid: "Answers are correct", noDuplicateQuestions: "No duplicate questions",
  noBrokenMatchingPairs: "No broken matching pairs", noLowQualityAiOutput: "Content quality reviewed", topicMatchesCurriculum: "Matches the selected topic", questionCountAcceptable: "Question count is suitable",
};
function emptyDraft(): CuratedQuizDraft {
  const grade = CURRICULUM[0]; const world = grade.worlds[0]; const topic = world.topics[0];
  return { title: "", topic: topic.title, ageGroup: grade.gradeLevel, category: "linguistic", curriculumLevel: 1, difficulty: "beginner",
    learnerLevel: grade.gradeLevel, gradeLevel: grade.gradeLevel, worldId: world.id, topicId: topic.title, phase: "Practice", objective: "", instructions: "Choose the answer.",
    notes: "", sourcePrompt: "", createdWith: "local-fallback", questionTypes: ["multiple-choice"], questions: [], rewards: { xp: 20 }, reviewChecklist: { ...DEFAULT_REVIEW_CHECKLIST }, mobilePreviewChecked: false };
}
function Action({ title, onPress, disabled = false }: { title: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.button, disabled && styles.disabled]}><Text style={styles.buttonText}>{title}</Text></Pressable>;
}
function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <View style={styles.field}><Text>{label}</Text><TextInput accessibilityLabel={label} style={styles.input} value={value} onChangeText={onChange} multiline /></View>;
}
export function ControlledQuizConsole() {
  const { user, endSession } = useAuthSession();
  const [quizzes, setQuizzes] = useState<CuratedQuiz[]>([]);
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [draft, setDraft] = useState<CuratedQuizDraft>(emptyDraft);
  const [selected, setSelected] = useState<CuratedQuiz | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(false);
  const grade = CURRICULUM.find(item => item.gradeLevel === draft.gradeLevel) ?? CURRICULUM[0];
  const world = grade.worlds.find(item => item.id === draft.worldId) ?? grade.worlds[0];
  const editable = draft.questions.every(q => q.type === "multiple-choice");
  const refresh = useCallback(async () => {
    const [items, activity] = await Promise.all([getCuratedQuizzes(), getAdminActivityLogs()]);
    setQuizzes(items); setLogs(activity);
  }, []);
  useEffect(() => { void refresh().catch(() => setMessage("Could not load quizzes. Check the connection and retry.")); }, [refresh]);
  function edit(patch: Partial<CuratedQuizDraft>) { setDraft(current => ({ ...current, ...patch, mobilePreviewChecked: false, reviewChecklist: { ...DEFAULT_REVIEW_CHECKLIST } })); setPreview(false); }
  async function run(action: () => Promise<void>) {
    setBusy(true); setMessage("");
    try { await action(); await refresh(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Please try again."); }
    finally { setBusy(false); }
  }
  function select(quiz: CuratedQuiz) { setSelected(quiz); setDraft(quiz); setPreview(false); setMessage(""); }
  function newQuiz() { setSelected(null); setDraft(emptyDraft()); setPreview(false); }
  async function save() {
    if (!user) return;
    if (selected) await updateQuizDraft(selected.id, draft, user, { status: "draft" });
    else await createQuizDraft(draft, user, "draft");
    newQuiz(); setMessage("Draft saved. Select it below to review and publish.");
  }
  function questionChange(index: number, patch: Partial<MultipleChoiceQuestion>) {
    edit({ questions: draft.questions.map((q, i) => i === index ? { ...q, ...patch } as MultipleChoiceQuestion : q) });
  }
  return <SafeAreaView style={styles.screen}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>BatiBot quiz console</Text>
      <Text>Controlled testing · Learner data stays on the device. Remote uploads and AI generation are disabled.</Text>
      <View style={styles.row}><Action title="Refresh" disabled={busy} onPress={() => { void run(refresh); }} /><Action title="New quiz" disabled={busy} onPress={newQuiz} /><Action title="Sign out" disabled={busy} onPress={() => { void run(async () => { await endSession(); router.replace("/(auth)/login"); }); }} /></View>
      {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}
      <View style={styles.card}>
        <Text style={styles.title}>{selected ? `Edit: ${selected.title}` : "Create a quiz"}</Text>
        <Field label="Title" value={draft.title} onChange={title => edit({ title })} />
        <Text>Grade</Text><View style={styles.row}>{CURRICULUM.map(item => <Action key={item.gradeLevel} title={`${draft.gradeLevel === item.gradeLevel ? "✓ " : ""}${item.gradeLevel}`} onPress={() => { const w = item.worlds[0]; edit({ gradeLevel: item.gradeLevel, learnerLevel: item.gradeLevel, ageGroup: item.gradeLevel, worldId: w.id, topicId: w.topics[0].title, topic: w.topics[0].title }); }} />)}</View>
        <Text>World</Text><ScrollView horizontal>{grade.worlds.map(item => <Action key={item.id} title={`${world.id === item.id ? "✓ " : ""}${item.title}`} onPress={() => edit({ worldId: item.id, topicId: item.topics[0].title, topic: item.topics[0].title })} />)}</ScrollView>
        <Text>Topic</Text><ScrollView horizontal>{world.topics.map(item => <Action key={item.title} title={`${draft.topic === item.title ? "✓ " : ""}${item.title}`} onPress={() => edit({ topicId: item.title, topic: item.title })} />)}</ScrollView>
        <View style={styles.row}>{(["Practice", "Challenge"] as const).map(phase => <Action key={phase} title={`${draft.phase === phase ? "✓ " : ""}${phase}`} onPress={() => edit({ phase })} />)}</View>
        <View style={styles.row}>{(["linguistic", "numeric"] as const).map(category => <Action key={category} title={`${draft.category === category ? "✓ " : ""}${category}`} onPress={() => edit({ category })} />)}</View>
        <Field label="Learning objective" value={draft.objective} onChange={objective => edit({ objective })} />
        <Field label="Instructions" value={draft.instructions} onChange={instructions => edit({ instructions })} />
        {!editable ? <Text>This quiz uses an advanced format. Its questions are preserved; use the review controls below.</Text> : draft.questions.map((question, index) => {
          const q = question as MultipleChoiceQuestion;
          return <View key={q.id} style={styles.card}>
            <Field label={`Question ${index + 1}`} value={q.prompt} onChange={prompt => questionChange(index, { prompt })} />
            <Field label="Choices (one per line; two or four for early learners)" value={q.options.join("\n")} onChange={value => questionChange(index, { options: value.split("\n") })} />
            <Field label="Correct answer (must match one choice)" value={q.answer} onChange={answer => questionChange(index, { answer })} />
            <Action title="Remove question" onPress={() => edit({ questions: draft.questions.filter((_, i) => i !== index) })} />
          </View>;
        })}
        {editable ? <Action title="Add question" disabled={draft.questions.length >= 50} onPress={() => edit({ questions: [...draft.questions, { id: `question-${Date.now()}`, type: "multiple-choice", prompt: "", answer: "", options: ["", ""], interactionType: "tap-choice" }] })} /> : null}
        <Action title="Preview questions" disabled={busy || !draft.questions.length} onPress={() => setPreview(true)} />
        {preview ? <View style={styles.card}>{draft.questions.map(q => <View key={q.id}><Text style={styles.title}>{q.prompt}</Text>{"options" in q ? q.options.map((choice, i) => <Text key={i} style={styles.previewChoice}>{choice}</Text>) : <Text>{"pairs" in q ? q.pairs.map(p => `${p.left} → ${p.right}`).join("\n") : q.sentence}</Text>}<Text>Answer: {"answer" in q ? q.answer : "See pairs above"}</Text></View>)}<View style={styles.row}><Switch accessibilityLabel="Mobile preview checked" value={draft.mobilePreviewChecked === true} onValueChange={mobilePreviewChecked => setDraft(current => ({ ...current, mobilePreviewChecked }))} /><Text>I checked the mobile preview.</Text></View></View> : null}
        {(Object.keys(CHECK_LABELS) as (keyof QuizReviewChecklist)[]).map(key => <View key={key} style={styles.row}><Switch accessibilityLabel={CHECK_LABELS[key]} value={draft.reviewChecklist?.[key] === true} onValueChange={value => setDraft(current => ({ ...current, reviewChecklist: { ...DEFAULT_REVIEW_CHECKLIST, ...current.reviewChecklist, [key]: value } }))} /><Text style={styles.checkLabel}>{CHECK_LABELS[key]}</Text></View>)}
        <Action title="Save draft" disabled={busy} onPress={() => { void run(save); }} />
        {selected && user ? <Action title="Save and publish reviewed quiz" disabled={busy || !draft.mobilePreviewChecked || !Object.values(draft.reviewChecklist ?? DEFAULT_REVIEW_CHECKLIST).every(Boolean)} onPress={() => { void run(async () => { await updateQuizDraft(selected.id, draft, user, { status: "draft" }); await publishQuiz({ ...selected, ...draft }, user); newQuiz(); setMessage("Quiz published."); }); }} /> : null}
      </View>
      <Text style={styles.title}>Saved quizzes</Text>
      {!quizzes.length ? <Text>No shared quizzes loaded. Bundled learner quizzes remain available.</Text> : quizzes.map(quiz => <View key={quiz.id} style={styles.card}>
        <Text style={styles.title}>{quiz.title}</Text><Text>{quiz.gradeLevel} · {quiz.status}</Text>
        <View style={styles.row}><Action title="Edit / review" disabled={busy} onPress={() => select(quiz)} />
          {user ? <><Action title={quiz.status === "published" ? "Unpublish" : "Archive"} disabled={busy} onPress={() => { void run(async () => { if (quiz.status === "published") await unpublishQuiz(quiz, user); else await archiveQuiz(quiz, user); }); }} />
          {quiz.status !== "published" ? <Action title="Delete" disabled={busy} onPress={() => Alert.alert("Delete this draft?", quiz.title, [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => { void run(async () => { await deleteDraft(quiz, user); if (selected?.id === quiz.id) newQuiz(); }); } }])} /> : null}</> : null}
        </View>
      </View>)}
      <Text style={styles.title}>Recent activity</Text>{logs.map(log => <Text key={log.id}>{log.actionType} · {log.timestamp ? new Date(log.timestamp).toLocaleString() : ""}</Text>)}
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F3FF" }, content: { padding: 18, paddingBottom: 48, gap: 16 },
  heading: { fontSize: 26, fontWeight: "800", color: "#4C1D95" }, title: { fontSize: 18, fontWeight: "700" },
  card: { backgroundColor: "white", borderRadius: 16, padding: 16, gap: 12 }, row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  button: { backgroundColor: "#6D28D9", borderRadius: 12, padding: 12, minHeight: 48, justifyContent: "center", margin: 2 }, buttonText: { color: "white", fontWeight: "600" }, disabled: { opacity: 0.45 },
  field: { gap: 6 }, input: { borderColor: "#C4B5FD", borderWidth: 1, padding: 12, minHeight: 48, borderRadius: 10, color: "#111827" },
  message: { color: "#4C1D95", fontSize: 16 }, checkLabel: { flex: 1 }, previewChoice: { padding: 14, marginVertical: 4, backgroundColor: "#EDE9FE", borderRadius: 10 },
});
