import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";

import { AdminErrorState, AdminLoadingState } from "@/src/components/admin/AdminState";
import { AdminButton, AdminSectionHeader, AdminShell, AdminStatusBadge, AdminTable } from "@/src/components/admin/AdminShell";
import type { AdminTopicDraft } from "@/src/domain/admin/topic-draft";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { listPublishedContent, type PublishedContentRecord } from "@/src/services/admin/adminContentDraftService";
import { listTopicDrafts, unpublishTopicDraft } from "@/src/services/admin/adminTopicDraftService";

export default function AdminPublishedScreen() {
  const { profile } = useCurrentUserProfile();
  const [items, setItems] = useState<PublishedContentRecord[]>([]);
  const [topics, setTopics] = useState<AdminTopicDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [published, topicDrafts] = await Promise.all([listPublishedContent(), listTopicDrafts({ status: "published" }, profile)]);
      setItems(published); setTopics(topicDrafts);
    } catch { setError("Published content could not be loaded."); }
    finally { setLoading(false); }
  }, [profile]);
  useEffect(() => { void load(); }, [load]);

  async function handleUnpublish(draftId: string) {
    try {
      await unpublishTopicDraft(draftId, profile);
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unpublish topic.");
    }
  }

  return <AdminShell title="Published Content" subtitle="Audited published topics and curriculum content records.">
    {loading ? <AdminLoadingState message="Loading published content..." /> : null}
    {!loading && error ? <AdminErrorState message={error} onRetry={load} /> : null}
    {!loading && !error ? <>
      <AdminSectionHeader title="Published Topics" subtitle="Structured topic records live in the catalog." action={<AdminButton label="Create Topic" onPress={() => router.push("/(admin)/create-topic")} />} />
      <AdminTable columns={["Topic", "Grade", "World", "Author", "Status", "Action"]} emptyTitle="No published topic drafts" rows={topics.map((draft) => [<Topic key="topic" value={draft.topicTitle} />, draft.gradeLevel, draft.worldId, draft.updatedBy, <AdminStatusBadge key="status" label="published" tone="good" />, <View key="actions" style={{ flexDirection: "row", gap: 6 }}><AdminButton label="View" tone="secondary" onPress={() => router.push({ pathname: "/(admin)/topic-editor/[draftId]", params: { draftId: draft.id } })} /><AdminButton label="Unpublish" tone="danger" onPress={() => { void handleUnpublish(draft.id); }} /></View>])} />
      <AdminSectionHeader title="Published Stage Content" subtitle="Existing approved AI-assisted content records." />
      <AdminTable columns={["Topic", "Grade", "World", "Published By", "Status"]} emptyTitle="No published content yet" emptyDescription="Approved content will appear here once published." rows={items.map((item) => [<Topic key="topic" value={item.topicTitle} />, item.gradeLevel, item.worldId, item.publishedBy, <AdminStatusBadge key="status" label={item.status} tone="good" />])} />
    </> : null}
  </AdminShell>;
}

function Topic({ value }: { value: string }) { return <Text style={{ color: "#111827", fontSize: 13, fontWeight: "900" }}>{value}</Text>; }
