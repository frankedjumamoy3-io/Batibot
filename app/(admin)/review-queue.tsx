import { useCallback, useEffect, useState } from "react";
import { Text } from "react-native";
import { router } from "expo-router";

import { AdminErrorState, AdminLoadingState } from "@/src/components/admin/AdminState";
import { AdminButton, AdminSectionHeader, AdminShell, AdminStatusBadge, AdminTable } from "@/src/components/admin/AdminShell";
import { getDraftCompleteness, type AdminTopicDraft } from "@/src/domain/admin/topic-draft";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { listAdminContentDrafts, type AdminContentDraft } from "@/src/services/admin/adminContentDraftService";
import { listTopicDrafts } from "@/src/services/admin/adminTopicDraftService";

export default function AdminReviewQueueScreen() {
  const { profile } = useCurrentUserProfile();
  const [topics, setTopics] = useState<AdminTopicDraft[]>([]);
  const [aiDrafts, setAiDrafts] = useState<AdminContentDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadQueue = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [topicItems, aiItems] = await Promise.all([listTopicDrafts({ status: "inReview" }, profile), listAdminContentDrafts()]);
      setTopics(topicItems);
      setAiDrafts(aiItems.filter((draft) => ["ai_generated", "needs_review", "validation_failed"].includes(draft.status)));
    } catch { setError("The review queue could not be loaded."); }
    finally { setLoading(false); }
  }, [profile]);
  useEffect(() => { void loadQueue(); }, [loadQueue]);

  return <AdminShell title="Review Queue" subtitle="Submitted topic drafts and AI-assisted content waiting for administrator review.">
    {loading ? <AdminLoadingState message="Loading review queue..." /> : null}
    {!loading && error ? <AdminErrorState message={error} onRetry={loadQueue} /> : null}
    {!loading && !error ? <>
      <AdminSectionHeader title="Submitted Topic Drafts" subtitle="Review submitted topic drafts and decide on approval or rejection." />
      <AdminTable columns={["Topic", "Grade", "World", "Author", "Updated", "Complete", "Action"]} emptyTitle="No topic drafts awaiting review" rows={topics.map((draft) => { const completeness = getDraftCompleteness(draft); return [<Text key="topic" style={{ color: "#111827", fontWeight: "900" }}>{draft.topicTitle}</Text>, draft.gradeLevel, draft.worldId, draft.createdBy, formatDate(draft.updatedAt), `${completeness.completeStages}/${completeness.totalStages}`, <AdminButton key="open" label="Open Review" onPress={() => router.push({ pathname: "/(admin)/topic-editor/[draftId]", params: { draftId: draft.id } })} />]; })} />
      <AdminSectionHeader title="AI Content Queue" subtitle="Existing AI draft review remains available alongside topic authoring." />
      <AdminTable columns={["Topic", "Grade", "World", "Stage", "Status", "Action"]} emptyTitle="AI review queue is clear" rows={aiDrafts.map((draft) => [<Text key="topic" style={{ color: "#111827", fontWeight: "900" }}>{draft.topicTitle}</Text>, draft.gradeLevel, draft.worldId, draft.stageType, <AdminStatusBadge key="status" label={draft.status} tone={draft.status === "validation_failed" ? "danger" : "warning"} />, <AdminButton key="review" label="Review" onPress={() => router.push({ pathname: "/(admin)/draft-review/[draftId]", params: { draftId: draft.id } })} />])} />
    </> : null}
  </AdminShell>;
}

function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString(); }
