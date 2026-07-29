import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { router, type Href } from "expo-router";

import {
  AdminButton,
  AdminCard,
  AdminSectionHeader,
  AdminShell,
  AdminStatusBadge,
  adminStyles,
} from "@/src/components/admin/AdminShell";
import { AdminWorkflowProgress } from "@/src/components/admin/AdminState";
import {
  listGrades,
  listTopicsByWorld,
  listWorldsByGrade,
} from "@/src/services/admin/batibotMetadataApi";
import {
  listAdminContentDrafts,
  listPublishedContent,
  type AdminContentDraft,
  type PublishedContentRecord,
} from "@/src/services/admin/adminContentDraftService";

export default function AdminContentCurationScreen() {
  const metadata = useMemo(() => {
    const grades = listGrades();
    const worlds = grades.flatMap((grade) => listWorldsByGrade(grade.id));
    const topicCount = worlds.reduce(
      (total, world) => total + listTopicsByWorld(world.gradeLevel, world.id).length,
      0
    );
    return { grades, topicCount, worlds };
  }, []);
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

  const pendingCount = drafts.filter((draft) =>
    ["ai_generated", "needs_review", "validation_failed"].includes(draft.status)
  ).length;
  const approvedCount = drafts.filter((draft) => draft.status === "approved").length;
  const rejectedCount = drafts.filter((draft) => draft.status === "rejected").length;

  const contentModules = [
    {
      action: "Create Topic",
      count: "Empty LOOK-TAP-TRY-CHOOSE-PLAY-REWARD shell",
      href: "/(admin)/create-topic" as Href,
      status: "Ready",
      title: "Create Topic",
      description: "Start a topic under an existing grade and world without invoking Gemini or publishing.",
    },
    {
      action: "View Curriculum",
      count: `${metadata.grades.length} grades / ${metadata.worlds.length} worlds / ${metadata.topicCount} topics`,
      href: "/(admin)/curriculum" as Href,
      status: "Active",
      title: "Curriculum Content",
      description: "View grades, worlds, topics, and the standard stages available per topic.",
    },
    {
      action: "Open Stage Editor",
      count: "LOOK, TAP, TRY, CHOOSE, PLAY, REWARD",
      href: "/(admin)/create-draft" as Href,
      status: "Ready",
      title: "Stage Content Editor",
      description: "Edit stage content through draft records before validation and publish.",
    },
    {
      action: "Generate Draft",
      count: `${drafts.filter((draft) => draft.status === "ai_generated").length} AI drafts`,
      href: "/(admin)/create-draft" as Href,
      status: "Active",
      title: "AI Content Drafts",
      description:
        "Generate meanings, examples, instructions, activities, questions, stories, and assessments.",
    },
    {
      action: "Open Queue",
      count: `${pendingCount} pending / ${approvedCount} approved / ${rejectedCount} rejected`,
      href: "/(admin)/review-queue" as Href,
      status: "Active",
      title: "Review Queue",
      description: "Review pending, approved, rejected, and published content drafts.",
    },
    {
      action: "Open Drafts",
      count: `${drafts.length} existing AI records plus structured topic drafts`,
      href: "/(admin)/drafts" as Href,
      status: "Active",
      title: "Drafts",
      description: "Reopen saved topic drafts and continue stage-by-stage authoring.",
    },
    {
      action: "View Published",
      count: `${published.length} published content records`,
      href: "/(admin)/published" as Href,
      status: "Ready",
      title: "Published Content",
      description: "Read-only content records that have completed the publishing workflow.",
    },
    {
      action: "Preview Drafts",
      count: `${drafts.filter((draft) => draft.status === "validation_failed").length} need fixes`,
      href: "/(admin)/drafts" as Href,
      status: "Ready",
      title: "Preview & Validation",
      description:
        "Preview learner-side lessons and validate missing instructions, choices, answers, and assets.",
    },
    {
      action: "Open Publishing",
      count: `${published.length} published`,
      href: "/(admin)/publishing" as Href,
      status: "Guarded",
      title: "Publishing",
      description: "Save, publish, unpublish, and audit content status after approval.",
    },
  ];

  return (
    <AdminShell
      title="Content Management"
      subtitle="Create, review, edit, preview, validate, approve, reject, and publish AI-assisted learning content."
    >
      <AdminCard>
        <AdminSectionHeader
          eyebrow="Core Workflow"
          title="AI draft -> review -> edit -> preview -> approve -> publish"
          subtitle="Assessment draft logic remains available as one content type, while this module covers curriculum content, stage content, validation, review, and publishing."
        />
        <AdminWorkflowProgress current="create" />
      </AdminCard>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        {contentModules.map((item) => (
          <View key={item.title} style={{ flex: 1, minWidth: 280 }}>
            <AdminCard>
              <View style={{ gap: 12 }}>
                <View style={{ alignItems: "center", flexDirection: "row", gap: 10 }}>
                  <Text style={contentStyles.cardTitle}>{item.title}</Text>
                  <AdminStatusBadge
                    label={item.status}
                    tone={item.status === "Active" ? "good" : "default"}
                  />
                </View>
                <Text style={adminStyles.mutedText}>{item.description}</Text>
                <AdminStatusBadge label={item.count} tone={item.status === "Guarded" ? "warning" : "default"} />
                <AdminButton label={item.action} onPress={() => router.push(item.href)} />
              </View>
            </AdminCard>
          </View>
        ))}
      </View>
    </AdminShell>
  );
}

const contentStyles = {
  cardTitle: {
    color: "#111827",
    flex: 1,
    fontSize: 17,
    fontWeight: "900" as const,
  },
};
