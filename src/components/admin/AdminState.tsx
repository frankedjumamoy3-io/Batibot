import { ActivityIndicator, Text, View } from "react-native";

import {
  AdminButton,
  AdminCard,
  AdminSectionHeader,
  adminStyles,
} from "@/src/components/admin/AdminShell";

export function AdminLoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <AdminCard>
      <View style={{ alignItems: "center", gap: 12, paddingVertical: 24 }}>
        <ActivityIndicator color="#6D28D9" size="large" />
        <Text style={adminStyles.mutedText}>{message}</Text>
      </View>
    </AdminCard>
  );
}

export function AdminErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <AdminCard>
      <AdminSectionHeader eyebrow="Action Required" title="Unable to load this module" subtitle={message} />
      {onRetry ? <AdminButton label="Try Again" tone="secondary" onPress={onRetry} /> : null}
    </AdminCard>
  );
}

export function AdminEmptyState({
  actionLabel,
  description,
  onAction,
  title,
}: {
  actionLabel?: string;
  description: string;
  onAction?: () => void;
  title: string;
}) {
  return (
    <AdminCard>
      <View style={{ alignItems: "center", gap: 10, paddingVertical: 22 }}>
        <Text style={{ color: "#111827", fontSize: 17, fontWeight: "900" }}>{title}</Text>
        <Text style={[adminStyles.mutedText, { maxWidth: 520, textAlign: "center" }]}>{description}</Text>
        {actionLabel && onAction ? <AdminButton label={actionLabel} onPress={onAction} /> : null}
      </View>
    </AdminCard>
  );
}

export function AdminWorkflowProgress({
  current,
}: {
  current: "create" | "draft" | "review" | "approve" | "publish";
}) {
  const steps = [
    ["create", "Create Topic"],
    ["draft", "Draft"],
    ["review", "Review"],
    ["approve", "Approve"],
    ["publish", "Publish"],
  ] as const;
  const currentIndex = steps.findIndex(([id]) => id === current);

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {steps.map(([id, label], index) => {
        const active = index <= currentIndex;
        return (
          <View
            key={id}
            style={{
              backgroundColor: active ? "#6D28D9" : "#F5F3FF",
              borderColor: active ? "#6D28D9" : "#E7DDFB",
              borderRadius: 999,
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 7,
            }}
          >
            <Text style={{ color: active ? "#FFFFFF" : "#64748B", fontSize: 12, fontWeight: "900" }}>
              {index + 1}. {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
