import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { loginLearnerOnline, signupWithEmail } from "@/src/presentation/viewmodels/auth-actions";
import { LEARNER_GRADE_LEVELS, type LearnerGradeLevel } from "@/src/types/user";
import { APP_ROUTES } from "@/src/navigation/routes";
import { useAuthSession } from "@/src/store/auth-session";
import { useLearnerProgress } from "@/src/presentation/state/learner-progress-provider";

export default function OnlineAccountScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const { user, profile } = useAuthSession();
  const { progress } = useLearnerProgress();
  const backingUp = user?.isLocalLearner === true && !user.isTestAccount;
  const [creating, setCreating] = useState(params.mode === "signup");
  const [displayName, setDisplayName] = useState(backingUp ? profile?.displayName ?? "" : "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gradeLevel, setGradeLevel] = useState<LearnerGradeLevel>(profile?.gradeLevel ?? "Preschool");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const insets = useSafeAreaInsets();

  async function submit() {
    if (busy) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !password || (creating && (password.length < 8 || displayName.trim().length < 2))) {
      setError(creating ? "Enter a name, valid email, and a password with at least 8 characters." : "Enter your email and password.");
      return;
    }
    setBusy(true); setError("");
    try {
      const localProgress = backingUp ? progress : undefined;
      if (creating) await signupWithEmail({ email, password, displayName, gradeLevel, localProgress });
      else await loginLearnerOnline({ email, password, localProgress });
      router.replace(APP_ROUTES.tabs.play);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not connect. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.page, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.panel}>
          <Text accessibilityRole="header" style={styles.title}>{creating ? "Save your adventure" : "Welcome back!"}</Text>
          <Text style={styles.description}>Ask a grown-up to help. Your progress stays on this device and syncs to your account when you are online.</Text>
          {backingUp && <Text style={styles.description}>This will back up {profile?.displayName}&apos;s current journey to this account.</Text>}
          {creating && <>
            <Text style={styles.label}>Learner name</Text>
            <TextInput accessibilityLabel="Learner name" style={styles.input} value={displayName} onChangeText={setDisplayName} maxLength={40} editable={!busy} />
            <Text style={styles.label}>Grade</Text>
            <View style={styles.grades}>{LEARNER_GRADE_LEVELS.map(grade => (
              <Pressable key={grade} accessibilityRole="button" accessibilityState={{ selected: grade === gradeLevel }} disabled={busy}
                onPress={() => setGradeLevel(grade)} style={[styles.grade, grade === gradeLevel && styles.selected]}>
                <Text style={grade === gradeLevel ? styles.white : styles.purple}>{grade}</Text>
              </Pressable>
            ))}</View>
          </>}
          <Text style={styles.label}>Email</Text>
          <TextInput accessibilityLabel="Email" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email"
            style={styles.input} value={email} onChangeText={setEmail} editable={!busy} />
          <Text style={styles.label}>Password</Text>
          <TextInput accessibilityLabel="Password" secureTextEntry autoCapitalize="none" autoComplete={creating ? "new-password" : "current-password"}
            style={styles.input} value={password} onChangeText={setPassword} editable={!busy} onSubmitEditing={() => { void submit(); }} />
          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Pressable accessibilityRole="button" disabled={busy} onPress={() => { void submit(); }} style={[styles.button, busy && { opacity: 0.6 }]}>
            {busy ? <ActivityIndicator color="#FFF" /> : <Text style={styles.white}>{creating ? "Create online account" : "Sign in"}</Text>}
          </Pressable>
          <Pressable accessibilityRole="button" disabled={busy} style={styles.link} onPress={() => { setCreating(!creating); setError(""); }}>
            <Text style={styles.purple}>{creating ? "I already have an account" : "Create an online account"}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={busy} style={styles.link} onPress={() => router.replace(backingUp ? APP_ROUTES.tabs.play : APP_ROUTES.auth.login)}>
            <Text style={styles.purple}>{backingUp ? "Back to my adventure" : "Back to device profiles"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F2EAFF" }, page: { flexGrow: 1, paddingHorizontal: 24, justifyContent: "center", alignItems: "center" },
  panel: { width: "100%", maxWidth: 440 }, title: { fontSize: 30, fontWeight: "900", color: "#32135C" },
  description: { fontSize: 16, lineHeight: 24, color: "#59456F", marginVertical: 16 }, label: { color: "#32135C", fontWeight: "700", marginTop: 14, marginBottom: 6 },
  input: { minHeight: 52, padding: 14, borderWidth: 2, borderColor: "#CDB4F6", backgroundColor: "#FFF", borderRadius: 16, fontSize: 18, color: "#32135C" },
  grades: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, grade: { minHeight: 48, paddingHorizontal: 14, justifyContent: "center", borderRadius: 14, backgroundColor: "#FFF" },
  selected: { backgroundColor: "#6B21F2" }, white: { color: "#FFF", fontWeight: "800", fontSize: 16 }, purple: { color: "#5B21B6", fontWeight: "700", fontSize: 16 },
  button: { minHeight: 56, borderRadius: 18, backgroundColor: "#6B21F2", alignItems: "center", justifyContent: "center", marginTop: 24 },
  link: { minHeight: 48, alignItems: "center", justifyContent: "center", marginTop: 8 }, error: { color: "#A01840", fontSize: 15, marginTop: 12 },
});
