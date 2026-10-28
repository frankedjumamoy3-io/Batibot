import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";

import {
  AdminBarChart,
  AdminButton,
  AdminCard,
  AdminMetricCard,
  AdminSectionHeader,
  AdminShell,
  AdminStatusBadge,
  adminStyles,
} from "@/src/components/admin/AdminShell";
import {
  summarizeAdminInsights,
  type AdminAnalytics,
} from "@/src/services/admin/adminAnalyticsService";
import { getAdminInsights, type AdminInsights } from "@/src/services/admin/adminInsightsService";
import {
  checkSystemMonitoringHealth,
  type ClientMonitoringHealth,
} from "@/src/services/admin/adminMonitoringService";

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

const initialMonitoring: ClientMonitoringHealth = {
  apiConfigured: false,
  apiOrigin: "Checking...",
  backendLive: false,
  checkTimestamp: "",
  data: null,
  errorMessage: null,
  latencyMs: 0,
};

export default function AdminAnalyticsScreen() {
  const { profile } = useCurrentUserProfile();
  const [activeTab, setActiveTab] = useState<"learning" | "system">("learning");
  const [analytics, setAnalytics] = useState<AdminAnalytics>(emptyAnalytics);
  const [insights, setInsights] = useState<AdminInsights | null>(null);
  const [monitoring, setMonitoring] = useState<ClientMonitoringHealth>(initialMonitoring);
  const [dataError, setDataError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setDataError(null);
    try {
      const next = await getAdminInsights(profile);
      setInsights(next);
      setAnalytics(summarizeAdminInsights(next));
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Could not load analytics.");
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const pingMonitoring = useCallback(async () => {
    setChecking(true);
    try {
      const health = await checkSystemMonitoringHealth();
      setMonitoring(health);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
    void pingMonitoring();
    const timer = setInterval(() => { void pingMonitoring(); }, 60_000);
    return () => clearInterval(timer);
  }, [loadData, pingMonitoring]);

  function formatBytes(bytes?: number) {
    if (!bytes) return "0 MB";
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatUptime(seconds?: number) {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m ${seconds % 60}s`;
  }

  return (
    <AdminShell
      title="Analytics & Monitoring"
      subtitle="Saved learner progress, published content, and live backend health."
    >
      <AdminSectionHeader title="Current data" subtitle={insights ? `Updated ${new Date(insights.generatedAt).toLocaleString()} · Active means saved progress in the past 30 days.` : "Load saved backend records to view analytics."}
        action={<AdminButton label={loading ? "Refreshing..." : "Refresh data"} disabled={loading} onPress={() => { void loadData(); }} />} />
      {dataError ? <Text style={monStyles.errorText}>Analytics unavailable: {dataError}</Text> : null}
      {/* Top Segmented Tabs */}
      <View style={tabStyles.container}>
        <Pressable
          accessibilityRole="tab"
          onPress={() => setActiveTab("learning")}
          style={[tabStyles.tab, activeTab === "learning" && tabStyles.activeTab]}
        >
          <Text style={[tabStyles.tabText, activeTab === "learning" && tabStyles.activeTabText]}>
            Learner & Curriculum Analytics
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          onPress={() => setActiveTab("system")}
          style={[tabStyles.tab, activeTab === "system" && tabStyles.activeTab]}
        >
          <Text style={[tabStyles.tabText, activeTab === "system" && tabStyles.activeTabText]}>
            System Health & Live Monitoring
          </Text>
        </Pressable>
      </View>

      {activeTab === "learning" ? (
        <>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            <AdminMetricCard label="Active Learners (30 days)" tone="good" value={insights ? analytics.activeLearners : "—"} />
            <AdminMetricCard label="Unpublished Items" tone="warning" value={insights ? analytics.draftCount : "—"} />
            <AdminMetricCard label="Backend Published Items" tone="good" value={insights ? analytics.publishedCount : "—"} />
            <AdminMetricCard label="Topic Drafts (Firestore/local)" value={insights ? analytics.topicDraftCount ?? "Unavailable" : "—"} />
            <AdminMetricCard label="Completed Lessons" tone="good" value={insights ? insights.learners.completedLessons : "—"} />
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
            <View style={{ flex: 1, minWidth: 300 }}>
              <AdminBarChart title="Learners by Grade" data={analytics.learnersByGrade} />
            </View>
            <View style={{ flex: 1, minWidth: 300 }}>
              <AdminBarChart title="Published Stages by World" data={Object.fromEntries((insights?.content.worldCoverage ?? []).map(row => [`${row.gradeLevel}: ${row.worldId}`, row.publishedStages]))} />
            </View>
          </View>

          <AdminCard>
            <AdminSectionHeader
              title="Saved Learning Summary"
              subtitle="Aggregated from authenticated learner progress saved to PostgreSQL. Scores are the latest saved score per quiz and learner."
            />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
              <AdminMetricCard label="Saved Quiz Attempts" value={insights?.learners.savedQuizAttempts ?? "—"} />
              <AdminMetricCard label="Avg Latest Score" tone="good" value={insights ? insights.learners.averageLatestScore === null ? "No scores" : `${insights.learners.averageLatestScore}%` : "—"} />
              <AdminMetricCard label="Mastered Topics" value={insights?.learners.masteredTopics ?? "—"} />
              <AdminMetricCard
                label="Validation Failed"
                tone={analytics.validationFailedCount > 0 ? "danger" : "default"}
                value={analytics.validationFailedCount}
              />
            </View>
          </AdminCard>
        </>
      ) : (
        <>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            <AdminMetricCard
              label="Backend Status"
              tone={monitoring.data?.status === "healthy" ? "good" : monitoring.backendLive ? "warning" : "danger"}
              value={monitoring.data?.status === "healthy" ? "Healthy" : monitoring.backendLive ? "Degraded" : "Unavailable"}
            />
            <AdminMetricCard
              label="Server Latency"
              tone={!monitoring.backendLive ? "default" : monitoring.latencyMs < 300 ? "good" : monitoring.latencyMs < 1000 ? "warning" : "danger"}
              value={monitoring.backendLive ? `${monitoring.latencyMs} ms` : "—"}
            />
            <AdminMetricCard
              label="Database"
              tone={monitoring.data?.database?.status === "connected" ? "good" : "warning"}
              value={monitoring.data?.database?.status ?? "Unknown"}
            />
            <AdminMetricCard
              label="Server Uptime"
              value={monitoring.data ? formatUptime(monitoring.data.uptimeSeconds) : "—"}
            />
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
            <View style={{ flex: 1, minWidth: 320 }}>
              <AdminCard>
                <AdminSectionHeader
                  title="Backend API & Server Health"
                  subtitle="Render Node.js + PostgreSQL live service inspection."
                  action={
                    <AdminButton
                      label={checking ? "Pinging..." : "Ping Server"}
                      disabled={checking}
                      onPress={pingMonitoring}
                    />
                  }
                />
                <View style={monStyles.line}>
                  <Text style={monStyles.label}>Target URL:</Text>
                  <Text style={monStyles.value}>{monitoring.apiOrigin}</Text>
                </View>
                <View style={monStyles.line}>
                  <Text style={monStyles.label}>Environment:</Text>
                  <Text style={monStyles.value}>{monitoring.data?.environment ?? "Unavailable"}</Text>
                </View>
                <View style={monStyles.line}>
                  <Text style={monStyles.label}>Node Version:</Text>
                  <Text style={monStyles.value}>{monitoring.data?.nodeVersion ?? "Unavailable"}</Text>
                </View>
                <View style={monStyles.line}>
                  <Text style={monStyles.label}>DB Ping Latency:</Text>
                  <Text style={monStyles.value}>
                    {monitoring.data?.database?.latencyMs ? `${monitoring.data.database.latencyMs} ms` : "Available when live"}
                  </Text>
                </View>
                <View style={monStyles.line}>
                  <Text style={monStyles.label}>Statistics Query:</Text>
                  <Text style={monStyles.value}>{monitoring.data?.statisticsStatus ?? "Unavailable"}</Text>
                </View>
                {monitoring.errorMessage ? (
                  <Text style={monStyles.errorText}>
                    Notice: {monitoring.errorMessage}
                  </Text>
                ) : null}
              </AdminCard>
            </View>

            <View style={{ flex: 1, minWidth: 320 }}>
              <AdminCard>
                <AdminSectionHeader
                  title="Server Memory Utilization"
                  subtitle="Process heap & resident memory usage reported by runtime."
                />
                <View style={monStyles.line}>
                  <Text style={monStyles.label}>Resident Set (RSS):</Text>
                  <Text style={monStyles.value}>{formatBytes(monitoring.data?.memory?.rssBytes)}</Text>
                </View>
                <View style={monStyles.line}>
                  <Text style={monStyles.label}>Heap Used:</Text>
                  <Text style={monStyles.value}>{formatBytes(monitoring.data?.memory?.heapUsedBytes)}</Text>
                </View>
                <View style={monStyles.line}>
                  <Text style={monStyles.label}>Heap Total:</Text>
                  <Text style={monStyles.value}>{formatBytes(monitoring.data?.memory?.heapTotalBytes)}</Text>
                </View>
                <View style={monStyles.line}>
                  <Text style={monStyles.label}>External Memory:</Text>
                  <Text style={monStyles.value}>{formatBytes(monitoring.data?.memory?.externalBytes)}</Text>
                </View>
              </AdminCard>
            </View>
          </View>

          <AdminCard>
            <AdminSectionHeader
              title="Recent Admin Activity"
              subtitle="Latest saved quiz and content actions on the backend."
            />
            {(insights?.recentActivity.length ?? 0) === 0 ? (
              <Text style={adminStyles.mutedText}>No saved admin activity is available.</Text>
            ) : (
              <View style={{ gap: 8, marginTop: 8 }}>
                {insights?.recentActivity.slice(0, 15).map((event, index) => (
                  <View key={`${event.timestamp}-${index}`} style={monStyles.eventRow}>
                    <AdminStatusBadge
                      label={event.action}
                      tone={event.action.includes("failed") || event.action.includes("rejected") ? "danger" : "good"}
                    />
                    <Text style={monStyles.eventTime}>
                      {event.timestamp ? new Date(event.timestamp).toLocaleString() : "—"}
                    </Text>
                    <Text numberOfLines={1} style={monStyles.eventData}>
                      {event.entityType}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </AdminCard>
        </>
      )}
    </AdminShell>
  );
}

const tabStyles = StyleSheet.create({
  activeTab: {
    backgroundColor: "#6D28D9",
    borderColor: "#6D28D9",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7DDFB",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tabText: {
    color: "#4C1D95",
    fontSize: 13,
    fontWeight: "700",
  },
});

const monStyles = StyleSheet.create({
  errorText: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    borderRadius: 8,
    borderWidth: 1,
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
    padding: 8,
  },
  eventData: {
    color: "#4B5563",
    flex: 1,
    fontSize: 12,
  },
  eventRow: {
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    flexDirection: "row",
    gap: 10,
    padding: 8,
  },
  eventTime: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "700",
  },
  label: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },
  line: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  value: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "800",
  },
});
