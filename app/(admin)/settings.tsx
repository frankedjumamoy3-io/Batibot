import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

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
import { APP_ROUTES } from "@/src/navigation/routes";
import { listGrades, listWorldsByGrade } from "@/src/services/admin/batibotMetadataApi";
import { clearLocalAdminDraftCache } from "@/src/services/admin/adminContentDraftService";
import { getAdminSystemStatus, type AdminSystemStatus } from "@/src/services/admin/adminSystemStatusService";

export default function AdminSettingsScreen() {
  const { endSession, profile, user } = useCurrentUserProfile();
  const grades = listGrades();
  const [systemStatus, setSystemStatus] = useState<AdminSystemStatus | null>(null);
  const [statusError, setStatusError] = useState("");
  useEffect(() => {
    let active = true;
    void getAdminSystemStatus().then(value => { if (active) setSystemStatus(value); }).catch(() => { if (active) setStatusError("Could not check backend status."); });
    return () => { active = false; };
  }, []);
  const [strictness, setStrictness] = useState("standard");
  const [safePublishing, setSafePublishing] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [defaultGrade, setDefaultGrade] = useState<string>(grades[0]?.id ?? "grade1");
  const defaultWorlds = defaultGrade ? listWorldsByGrade(defaultGrade) : [];
  const [defaultWorld, setDefaultWorld] = useState(defaultWorlds[0]?.id ?? "");
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function logoutAdmin() {
    setBusy(true);
    await endSession();
    router.replace(APP_ROUTES.auth.login);
  }

  return (
    <AdminShell
      title="Settings"
      subtitle="Admin-only controls for account access, drafting, validation, and maintenance."
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        <View style={{ flex: 1, minWidth: 320 }}>
          <AdminCard>
            <AdminSectionHeader title="Admin Account" subtitle="Current signed-in admin profile." />
            <SettingLine label="Name" value={profile?.displayName ?? "BatiBot Admin"} />
            <SettingLine label="Email / ID" value={profile?.email || user?.uid || "Unavailable"} />
            <SettingLine label="Role" value={profile?.role ?? "admin"} />
            <SettingLine label="Last Login" value="Unavailable in this client session" />
          </AdminCard>
        </View>
        <View style={{ flex: 1, minWidth: 320 }}>
          <AdminCard>
            <AdminSectionHeader title="System Status" subtitle="Configuration reported by the authenticated backend. A live generation request verifies provider access." />
            {systemStatus ? <><StatusLine label={`${systemStatus.provider === "openai" ? "OpenAI" : "Gemini"} configured`} ok={systemStatus.aiConfigured} /><SettingLine label="AI model" value={systemStatus.model ?? "Unavailable"} /><StatusLine label="Backend connection" ok /></> : <Text>{statusError || "Checking backend…"}</Text>}
          </AdminCard>
        </View>
      </View>

      <AdminCard>
        <AdminSectionHeader title="Draft Controls" subtitle="Defaults used while creating and validating drafts." />
        <OptionRow
          label="Validation Strictness"
          options={["relaxed", "standard", "strict"]}
          value={strictness}
          onChange={setStrictness}
        />
        <ToggleRow label="Safe Publishing" value={safePublishing} onChange={setSafePublishing} />
        <ToggleRow label="Auto-save Drafts" value={autoSave} onChange={setAutoSave} />
        <OptionRow
          label="Default Grade"
          options={grades.map((grade) => grade.id)}
          value={defaultGrade}
          onChange={(value) => {
            const nextWorld = listWorldsByGrade(value)[0];
            setDefaultGrade(value);
            setDefaultWorld(nextWorld?.id ?? "");
          }}
        />
        <OptionRow
          label="Default World"
          options={defaultWorlds.map((world) => world.id)}
          value={defaultWorld}
          onChange={setDefaultWorld}
        />
      </AdminCard>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        <View style={{ flex: 1, minWidth: 320 }}>
          <AdminCard>
            <AdminSectionHeader title="Maintenance" subtitle="Local admin workspace actions." />
            {message ? <Text style={adminStyles.mutedText}>{message}</Text> : null}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              <AdminButton
                label="Clear Draft Cache"
                tone="secondary"
                onPress={() => {
                  clearLocalAdminDraftCache();
                  setMessage("Local draft cache cleared.");
                }}
              />
              <AdminButton
                label="Refresh Analytics"
                tone="secondary"
                onPress={() => setMessage("Analytics will refresh on the next dashboard load.")}
              />
              <AdminButton
                label="Reset Preferences"
                tone="secondary"
                onPress={() => {
                  setStrictness("standard");
                  setSafePublishing(true);
                  setAutoSave(true);
                  setMessage("Local admin preferences reset.");
                }}
              />
            </View>
          </AdminCard>
        </View>
        <View style={{ flex: 1, minWidth: 320 }}>
          <AdminCard>
            <AdminSectionHeader title="Account Actions" subtitle="Sign out without changing learner data." />
            {confirmLogout ? (
              <View style={settingsStyles.confirmBox}>
                <Text style={settingsStyles.confirmTitle}>Log out of admin?</Text>
                <Text style={adminStyles.mutedText}>
                  This only ends the current admin session. Curriculum, drafts, and learner progress stay intact.
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                  <AdminButton
                    disabled={busy}
                    label={busy ? "Logging out..." : "Logout"}
                    tone="danger"
                    onPress={logoutAdmin}
                  />
                  <AdminButton label="Cancel" tone="secondary" onPress={() => setConfirmLogout(false)} />
                </View>
              </View>
            ) : (
              <AdminButton label="Logout" tone="danger" onPress={() => setConfirmLogout(true)} />
            )}
          </AdminCard>
        </View>
      </View>
    </AdminShell>
  );
}

function SettingLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={settingsStyles.line}>
      <Text style={settingsStyles.lineLabel}>{label}</Text>
      <Text style={settingsStyles.lineValue}>{value}</Text>
    </View>
  );
}

function StatusLine({ label, ok }: { label: string; ok: boolean }) {
  return (
    <View style={settingsStyles.statusLine}>
      <Text style={settingsStyles.lineLabel}>{label}</Text>
      <AdminStatusBadge label={ok ? "Ready" : "Unavailable"} tone={ok ? "good" : "warning"} />
    </View>
  );
}

function ToggleRow({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: boolean) => void;
  value: boolean;
}) {
  return (
    <View style={settingsStyles.toggleRow}>
      <Text style={settingsStyles.label}>{label}</Text>
      <Pressable
        onPress={() => onChange(!value)}
        style={mergeAdminStyles(settingsStyles.toggle, value && settingsStyles.toggleActive)}
      >
        <Text style={mergeAdminStyles(settingsStyles.toggleText, value && settingsStyles.toggleTextActive)}>
          {value ? "On" : "Off"}
        </Text>
      </Pressable>
    </View>
  );
}

function OptionRow({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <View style={{ gap: 8, marginTop: 14 }}>
      <Text style={settingsStyles.label}>{label}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {options.map((option) => (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={mergeAdminStyles(settingsStyles.option, value === option && settingsStyles.optionActive)}
          >
            <Text style={mergeAdminStyles(settingsStyles.optionText, value === option && settingsStyles.optionTextActive)}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const settingsStyles = {
  confirmBox: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  confirmTitle: {
    color: "#991B1B",
    fontSize: 16,
    fontWeight: "900" as const,
  },
  label: {
    color: "#4C1D95",
    fontSize: 13,
    fontWeight: "900" as const,
  },
  line: {
    borderBottomColor: "#E7DDFB",
    borderBottomWidth: 1,
    gap: 4,
    paddingVertical: 10,
  },
  lineLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "900" as const,
    textTransform: "uppercase" as const,
  },
  lineValue: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "800" as const,
  },
  option: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7DDFB",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionActive: {
    backgroundColor: "#6D28D9",
    borderColor: "#6D28D9",
  },
  optionText: {
    color: "#4C1D95",
    fontSize: 12,
    fontWeight: "800" as const,
  },
  optionTextActive: {
    color: "#FFFFFF",
  },
  statusLine: {
    alignItems: "center" as const,
    borderBottomColor: "#E7DDFB",
    borderBottomWidth: 1,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 10,
  },
  toggle: {
    backgroundColor: "#EDE9FE",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  toggleActive: {
    backgroundColor: "#6D28D9",
  },
  toggleRow: {
    alignItems: "center" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginTop: 14,
  },
  toggleText: {
    color: "#4C1D95",
    fontSize: 12,
    fontWeight: "900" as const,
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
};
