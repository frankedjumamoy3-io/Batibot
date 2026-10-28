import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
import { USE_NODE_BACKEND } from "@/src/config/backend";
import { ControlledQuizConsole } from "@/src/components/admin/ControlledQuizConsole";

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
  topicDraftCount: null,
  topicsByWorld: {},
  totalLearners: 0,
  validationFailedCount: 0,
  worldCount: 0,
};

export default function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState<"overview" | "quizzes">("quizzes");
  const { profile } = useCurrentUserProfile();
  const [analytics, setAnalytics] = useState<AdminAnalytics>(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

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
        setAnalyticsError(null);
        setLoading(false);
      }
    }).catch((error: unknown) => {
      if (mounted) {
        setAnalyticsError(error instanceof Error ? error.message : "Could not load dashboard metrics.");
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [profile]);

  const topicsByStatus = {
    Unpublished: analytics.draftCount,
    Published: analytics.publishedCount,
    "Pending Review": analytics.pendingReviewCount,
    "Validation Failed": analytics.validationFailedCount,
  };

  async function refreshMetrics() {
    if (!profile) return;
    setLoading(true);
    try {
      setAnalytics(await getAdminAnalytics(profile));
      setAnalyticsError(null);
    } catch (error) {
      setAnalyticsError(error instanceof Error ? error.message : "Could not load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell
      title="Admin Dashboard"
      subtitle="Curriculum oversight, quiz authoring, learner metadata, and system health."
    >
      {/* Top Segmented Tab Switch */}
      <View style={tabStyles.container}>
        <Pressable
          accessibilityRole="tab"
          onPress={() => setActiveTab("quizzes")}
          style={[tabStyles.tab, activeTab === "quizzes" && tabStyles.activeTab]}
        >
          <Text style={[tabStyles.tabText, activeTab === "quizzes" && tabStyles.activeTabText]}>
            Quiz Console {USE_NODE_BACKEND ? "(Live API)" : ""}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          onPress={() => setActiveTab("overview")}
          style={[tabStyles.tab, activeTab === "overview" && tabStyles.activeTab]}
        >
          <Text style={[tabStyles.tabText, activeTab === "overview" && tabStyles.activeTabText]}>
            System Overview & Metrics
          </Text>
        </Pressable>
      </View>

      {activeTab === "quizzes" ? (
        <ControlledQuizConsole embedded={true} />
      ) : (
        <View style={{ gap: 16 }}>
          {analyticsError ? <Text accessibilityRole="alert">Metrics unavailable: {analyticsError}</Text> : null}
          <AdminButton label={loading ? "Loading metrics..." : "Refresh metrics"} disabled={loading} onPress={() => { void refreshMetrics(); }} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            <AdminMetricCard label="Total Learners" value={loading || analyticsError ? "—" : analytics.totalLearners} />
            <AdminMetricCard label="Grade Levels" value={loading || analyticsError ? "—" : analytics.gradeLevelCount} />
            <AdminMetricCard label="Worlds" value={loading || analyticsError ? "—" : analytics.worldCount} />
            <AdminMetricCard label="Topics" value={loading || analyticsError ? "—" : analytics.topicCount} />
            <AdminMetricCard label="Topic Drafts (Firestore/local)" value={loading || analyticsError ? "—" : analytics.topicDraftCount ?? "Unavailable"} />
            <AdminMetricCard label="Unpublished Items" tone="warning" value={loading || analyticsError ? "—" : analytics.draftCount} />
            <AdminMetricCard label="Pending Review" tone="warning" value={loading || analyticsError ? "—" : analytics.pendingReviewCount} />
            <AdminMetricCard label="Approved Content" tone="good" value={loading || analyticsError ? "—" : analytics.approvedCount} />
            <AdminMetricCard label="Backend Published Items" tone="good" value={loading || analyticsError ? "—" : analytics.publishedCount} />
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
            <ModuleCard title="Reports" subtitle="View learner progress, quiz performance, content coverage, and publishing activity."
              action="Open Reports" href="/(admin)/reports" />
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
            <View style={{ flex: 1, minWidth: 280 }}>
              <AdminBarChart title="Learners by Grade" data={analytics.learnersByGrade} />
            </View>
            <View style={{ flex: 1, minWidth: 280 }}>
              <AdminBarChart title="Admin Content by Status" data={topicsByStatus} />
            </View>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
            <View style={{ flex: 1, minWidth: 280 }}>
              <AdminBarChart title="Curriculum Topics by World" data={analytics.topicsByWorld} />
            </View>
            <View style={{ flex: 1, minWidth: 280 }}>
              <AdminBarChart
                title="Published and Review Counts"
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
        </View>
      )}
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

const tabStyles = StyleSheet.create({
  container: {
    backgroundColor: "#EDE9FE",
    borderRadius: 14,
    flexDirection: "row",
    gap: 4,
    marginBottom: 4,
    padding: 4,
  },
  tab: {
    alignItems: "center",
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    paddingVertical: 10,
  },
  activeTab: {
    backgroundColor: "#6D28D9",
    elevation: 2,
    shadowColor: "#4C1D95",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  tabText: {
    color: "#6D28D9",
    fontSize: 13,
    fontWeight: "800",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
