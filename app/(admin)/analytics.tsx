import { useEffect, useState } from "react";
import { View } from "react-native";

import {
  AdminBarChart,
  AdminCard,
  AdminMetricCard,
  AdminSectionHeader,
  AdminShell,
} from "@/src/components/admin/AdminShell";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import {
  getAdminAnalytics,
  type AdminAnalytics,
} from "@/src/services/admin/adminAnalyticsService";

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

export default function AdminAnalyticsScreen() {
  const { profile } = useCurrentUserProfile();
  const [analytics, setAnalytics] = useState<AdminAnalytics>(emptyAnalytics);

  useEffect(() => {
    let mounted = true;

    getAdminAnalytics(profile).then((nextAnalytics) => {
      if (mounted) {
        setAnalytics(nextAnalytics);
      }
    });

    return () => {
      mounted = false;
    };
  }, [profile]);

  return (
    <AdminShell
      title="Analytics"
      subtitle="Monitor learner activity, curriculum coverage, content workflow, and publishing health."
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <AdminMetricCard label="Active Learners" tone="good" value={analytics.activeLearners} />
        <AdminMetricCard label="Draft Content" tone="warning" value={analytics.draftCount} />
        <AdminMetricCard label="Published Content" tone="good" value={analytics.publishedCount} />
        <AdminMetricCard label="Validation Failed" tone="danger" value={analytics.validationFailedCount} />
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        <View style={{ flex: 1, minWidth: 300 }}>
          <AdminBarChart title="Learners by Grade" data={analytics.learnersByGrade} />
        </View>
        <View style={{ flex: 1, minWidth: 300 }}>
          <AdminBarChart title="Topics by World" data={analytics.topicsByWorld} />
        </View>
      </View>

      <AdminCard>
        <AdminSectionHeader
          title="Content Analytics Roadmap"
          subtitle="Frequently failed activities, most viewed topics, and AI usage analytics should be added once event tracking is available."
        />
      </AdminCard>
    </AdminShell>
  );
}
