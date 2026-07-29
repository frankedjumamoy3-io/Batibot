import { useCallback, useEffect, useState } from "react";
import { Text } from "react-native";
import { router } from "expo-router";

import { AdminErrorState, AdminLoadingState } from "@/src/components/admin/AdminState";
import { AdminButton, AdminSectionHeader, AdminShell, AdminStatusBadge, AdminTable } from "@/src/components/admin/AdminShell";
import type { AdminTopicDraft } from "@/src/domain/admin/topic-draft";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { listAdminContentDrafts, type AdminContentDraft, type AdminDraftStatus } from "@/src/services/admin/adminContentDraftService";
import { listTopicDrafts } from "@/src/services/admin/adminTopicDraftService";

export default function AdminDraftsScreen() {
  const { profile } = useCurrentUserProfile();
  const [topicDrafts, setTopicDrafts] = useState<AdminTopicDraft[]>([]);
  const [aiDrafts, setAiDrafts] = useState<AdminContentDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [topics, ai] = await Promise.all([listTopicDrafts({}, profile), listAdminContentDrafts()]);
      setTopicDrafts(topics);
      setAiDrafts(ai);
    } catch {
      setError("Drafts could not be loaded. Check the admin session and try again.");
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => { void load(); }, [load]);

  return (
    <AdminShell title="Content Drafts" subtitle="Create, reopen, and continue structured topic drafts or existing AI-assisted content drafts.">
      {loading ? <AdminLoadingState message="Loading content drafts..." /> : null}
      {!loading && error ? <AdminErrorState message={error} onRetry={load} /> : null}
      {!loading && !error ? (
        <>
          <AdminSectionHeader title="Topic Drafts" subtitle="Fixed LOOK, TAP, TRY, CHOOSE, PLAY, and REWARD authoring records." action={<AdminButton label="Create Topic" onPress={() => router.push("/(admin)/create-topic")} />} />
          <AdminTable
            columns={["Topic", "Mode", "Grade", "World", "Status", "Updated", "Action"]}
            emptyTitle="No topic drafts yet"
            emptyDescription="Create a topic to initialize the six required stages."
            rows={topicDrafts.map((draft) => [
              <TopicName key="topic" value={draft.topicTitle} />,
              draft.mode === "editExisting" ? "Existing copy" : "New topic",
              draft.gradeLevel,
              draft.worldId,
              <AdminStatusBadge key="status" label={draft.status} tone={topicStatusTone(draft.status)} />,
              formatDate(draft.updatedAt),
              <AdminButton key="open" label={draft.status === "published" ? "View" : "Edit"} onPress={() => router.push({ pathname: "/(admin)/topic-editor/[draftId]", params: { draftId: draft.id } })} />,
            ])}
          />
          <AdminSectionHeader title="AI Content Drafts" subtitle="Existing Gemini-assisted stage records remain available as a separate draft type." action={<AdminButton label="Create AI Draft" tone="secondary" onPress={() => router.push("/(admin)/create-draft")} />} />
          <AdminTable
            columns={["Topic", "Grade", "World", "Stage", "Kind", "Status", "Action"]}
            emptyTitle="No AI drafts yet"
            rows={aiDrafts.map((draft) => [
              <TopicName key="topic" value={draft.topicTitle || "Untitled Draft"} />,
              draft.gradeLevel,
              draft.worldId,
              draft.stageType,
              draft.contentKind,
              <AdminStatusBadge key="status" label={draft.status} tone={aiStatusTone(draft.status)} />,
              <AdminButton key="review" label="Review" onPress={() => router.push({ pathname: "/(admin)/draft-review/[draftId]", params: { draftId: draft.id } })} />,
            ])}
          />
        </>
      ) : null}
    </AdminShell>
  );
}

function TopicName({ value }: { value: string }) { return <Text style={{ color: "#111827", fontSize: 13, fontWeight: "900" }}>{value}</Text>; }
function aiStatusTone(status: AdminDraftStatus) { if (status === "approved" || status === "published") return "good"; if (status === "validation_failed" || status === "rejected") return "danger"; if (status === "needs_review" || status === "ai_generated") return "warning"; return "default"; }
function topicStatusTone(status: AdminTopicDraft["status"]) { if (status === "approved" || status === "published") return "good"; if (status === "rejected") return "danger"; if (status === "inReview") return "warning"; return "default"; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString(); }
