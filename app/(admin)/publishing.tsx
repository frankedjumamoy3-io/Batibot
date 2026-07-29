import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { router, type Href } from "expo-router";

import {
  AdminButton,
  AdminCard,
  AdminSectionHeader,
  AdminShell,
  AdminStatusBadge,
  AdminTable,
  adminStyles,
} from "@/src/components/admin/AdminShell";
import {
  listAdminContentDrafts,
  listPublishedContent,
  type AdminContentDraft,
  type PublishedContentRecord,
} from "@/src/services/admin/adminContentDraftService";

const WORKFLOW_STEPS = ["Draft", "Preview", "Review", "Publish"];

export default function AdminPublishingScreen() {
  const [drafts, setDrafts] = useState<AdminContentDraft[]>([]);
  const [published, setPublished] = useState<PublishedContentRecord[]>([]);

  useEffect(() => {
    let mounted = true;

    Promise.all([listAdminContentDrafts(), listPublishedContent()]).then(
      ([nextDrafts, nextPublished]) => {
        if (mounted) {
          setDrafts(nextDrafts);
          setPublished(nextPublished);
        }
      }
    );

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminShell
      title="Preview & Publishing"
      subtitle="Move content from draft to preview, review, and publish without bypassing validation."
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {WORKFLOW_STEPS.map((step, index) => (
          <View key={step} style={{ flex: 1, minWidth: 180 }}>
            <AdminCard>
              <AdminSectionHeader
                eyebrow={`Step ${index + 1}`}
                title={step}
                subtitle={
                  step === "Publish"
                    ? "Only approved and validated content can publish."
                    : "Required before content reaches learners."
                }
              />
            </AdminCard>
          </View>
        ))}
      </View>

      <AdminTable
        columns={["Content", "Grade", "World", "Stage", "Kind", "Status", "Action"]}
        emptyTitle="No content in publishing workflow"
        emptyDescription="Create an AI content draft to begin the Draft -> Preview -> Review -> Publish flow."
        action={
          <AdminButton
            label="Create Content Draft"
            onPress={() => router.push("/(admin)/create-draft" as Href)}
          />
        }
        rows={drafts.slice(0, 8).map((draft) => [
          <Text key="topic" style={publishingStyles.topicText}>
            {draft.topicTitle || "Untitled Content"}
          </Text>,
          draft.gradeLevel,
          draft.worldId,
          draft.stageType,
          draft.contentKind,
          <AdminStatusBadge key="status" label={toContentStatusLabel(draft.status)} tone={getStatusTone(draft.status)} />,
          <AdminButton
            key="review"
            label="Preview / Review"
            onPress={() =>
              router.push({
                pathname: "/(admin)/draft-review/[draftId]",
                params: { draftId: draft.id },
              })
            }
          />,
        ])}
      />

      <AdminCard>
        <AdminSectionHeader
          title="Published Content"
          subtitle={`${published.length} published content records. Static curriculum remains protected from accidental overwrite.`}
          action={<AdminButton label="Open Published Manager" tone="secondary" onPress={() => router.push("/(admin)/published" as Href)} />}
        />
        <Text style={adminStyles.mutedText}>
          Published content is listed separately so administrators can audit what has been approved for learner-facing use.
        </Text>
      </AdminCard>
    </AdminShell>
  );
}

function getStatusTone(status: AdminContentDraft["status"]) {
  if (status === "approved" || status === "published") return "good";
  if (status === "validation_failed" || status === "rejected") return "danger";
  if (status === "ai_generated" || status === "needs_review") return "warning";
  return "default";
}

function toContentStatusLabel(status: AdminContentDraft["status"]) {
  if (status === "ai_generated") return "AI Draft";
  if (status === "needs_review") return "Review";
  if (status === "validation_failed" || status === "rejected") return "Rejected";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

const publishingStyles = {
  topicText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900" as const,
  },
};
