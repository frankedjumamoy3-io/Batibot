import { useEffect, useState } from "react";
import { View } from "react-native";
import { router, type Href } from "expo-router";

import {
  AdminBarChart,
  AdminButton,
  AdminCard,
  AdminMetricCard,
  AdminSectionHeader,
  AdminShell,
} from "@/src/components/admin/AdminShell";
import {
  getAdminAnalytics,
  type AdminAnalytics,
} from "@/src/services/admin/adminAnalyticsService";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";

const emptyAnalytics: AdminAnalytics = {
  activeLearners: 0,
  approvedCount: 0,
  aiDraftQueueCount: 0,
  draftCount: 0,
  gradeLevelCount: 0,
  learnersByGrade: {},
  pendingReviewCount: 0,
  publishedCount: 0,
  recentActivityCount: 0,
  topicCount: 0,
  topicsByWorld: {},
  totalLearners: 0,
  validationFailedCount: 0,
  worldCount: 0,
};

export default function AdminDashboardScreen() {
  const { profile } = useCurrentUserProfile();
  const [analytics, setAnalytics] = useState<AdminAnalytics>(emptyAnalytics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!profile) {
      setAnalytics(emptyAnalytics);
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    getAdminAnalytics(profile).then((nextAnalytics) => {
      if (mounted) {
        setAnalytics(nextAnalytics);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [profile]);

  const topicsByStatus = {
    Drafts: analytics.draftCount,
    Published: analytics.publishedCount,
    "Pending Review": analytics.pendingReviewCount,
    "Validation Failed": analytics.validationFailedCount,
  };

  return (
    <AdminShell
      title="Dashboard"
      subtitle="AI-assisted content curation, publishing, learner metadata, and curriculum health."
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <AdminMetricCard label="Total Learners" value={loading ? "—" : analytics.totalLearners} />
        <AdminMetricCard label="Grade Levels" value={loading ? "—" : analytics.gradeLevelCount} />
        <AdminMetricCard label="Worlds" value={loading ? "—" : analytics.worldCount} />
        <AdminMetricCard label="Topics" value={loading ? "—" : analytics.topicCount} />
        <AdminMetricCard label="Draft Content" tone="warning" value={loading ? "—" : analytics.draftCount} />
        <AdminMetricCard label="Pending Review" tone="warning" value={loading ? "—" : analytics.pendingReviewCount} />
        <AdminMetricCard label="Approved Content" tone="good" value={loading ? "—" : analytics.approvedCount} />
        <AdminMetricCard label="Published Content" tone="good" value={loading ? "—" : analytics.publishedCount} />
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        <ModuleCard
          title="Content Management"
          subtitle="View curriculum content, edit stage drafts, validate previews, and publish reviewed content."
          action="Open Content Management"
          href="/(admin)/content-curation"
        />
        <ModuleCard
          title="Asset Library"
          subtitle="Search, review, validate, and assign learning images, audio, backgrounds, and icons."
          action="Open Asset Library"
          href="/(admin)/asset-library"
        />
        <ModuleCard
          title="User Management"
          subtitle="Review learner metadata and keep admin-only tools separated from learner accounts."
          action="Open Users"
          href="/(admin)/users"
        />
        <ModuleCard
          title="Analytics"
          subtitle="Monitor learner activity, draft status, publishing health, and curriculum coverage."
          action="Open Analytics"
          href="/(admin)/analytics"
        />
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        <View style={{ flex: 1, minWidth: 280 }}>
          <AdminBarChart title="Learners by Grade" data={analytics.learnersByGrade} />
        </View>
        <View style={{ flex: 1, minWidth: 280 }}>
          <AdminBarChart title="Topics by Status" data={topicsByStatus} />
        </View>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        <View style={{ flex: 1, minWidth: 280 }}>
          <AdminBarChart title="Drafts by World" data={analytics.topicsByWorld} />
        </View>
        <View style={{ flex: 1, minWidth: 280 }}>
          <AdminBarChart
            title="Recent Publish Activity"
            data={{ Published: analytics.publishedCount, "Ready to Publish": analytics.pendingReviewCount }}
            emptyLabel="Publish activity will appear after the first approved content item."
          />
        </View>
      </View>
      <AdminCard>
        <AdminSectionHeader
          eyebrow="Content Curation Rule"
          title="Generate, review, validate, then publish"
          subtitle="AI output stays draft-only until an administrator reviews it and validation passes."
        />
      </AdminCard>
    </AdminShell>
  );
}

function ModuleCard({
  action,
  href,
  subtitle,
  title,
}: {
  action: string;
  href: Href;
  subtitle: string;
  title: string;
}) {
  return (
    <View style={{ flex: 1, minWidth: 260 }}>
      <AdminCard>
        <AdminSectionHeader title={title} subtitle={subtitle} />
        <AdminButton label={action} onPress={() => router.push(href)} />
      </AdminCard>
    </View>
  );
}
