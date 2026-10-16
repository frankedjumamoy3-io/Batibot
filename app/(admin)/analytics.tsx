import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import {
  getAdminAnalytics,
  type AdminAnalytics,
} from "@/src/services/admin/adminAnalyticsService";
import {
  checkSystemMonitoringHealth,
  type ClientMonitoringHealth,
} from "@/src/services/admin/adminMonitoringService";
import {
  getRecentTelemetryEvents,
  getTelemetrySummary,
  type TelemetryEvent,
  type TelemetrySummary,
} from "@/src/services/analytics/telemetryService";

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

const initialMonitoring: ClientMonitoringHealth = {
  apiConfigured: false,
  apiOrigin: "Checking...",
  backendLive: false,
  checkTimestamp: "",
  data: null,
  errorMessage: null,
  latencyMs: 0,
};

const initialTelemetry: TelemetrySummary = {
  averageScore: 100,
  completedLessons: 0,
  errorCount: 0,
  lastActive: null,
  quizAttempts: 0,
  totalEvents: 0,
};

export default function AdminAnalyticsScreen() {
  const { profile } = useCurrentUserProfile();
  const [activeTab, setActiveTab] = useState<"learning" | "system">("learning");
  const [analytics, setAnalytics] = useState<AdminAnalytics>(emptyAnalytics);
  const [monitoring, setMonitoring] = useState<ClientMonitoringHealth>(initialMonitoring);
  const [telemetry, setTelemetry] = useState<TelemetrySummary>(initialTelemetry);
  const [recentEvents, setRecentEvents] = useState<TelemetryEvent[]>([]);
  const [checking, setChecking] = useState(false);

  const loadData = useCallback(async () => {
    const [nextAnalytics, nextTelemetry, events] = await Promise.all([
      getAdminAnalytics(profile),
      getTelemetrySummary(),
      getRecentTelemetryEvents(15),
    ]);
    setAnalytics(nextAnalytics);
    setTelemetry(nextTelemetry);
    setRecentEvents(events);
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
      subtitle="Comprehensive learner telemetry, curriculum coverage, and live system infrastructure monitoring."
    >
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
            <AdminMetricCard label="Active Learners" tone="good" value={analytics.activeLearners} />
            <AdminMetricCard label="Draft Content" tone="warning" value={analytics.draftCount} />
            <AdminMetricCard label="Published Content" tone="good" value={analytics.publishedCount} />
            <AdminMetricCard label="Completed Lessons" tone="good" value={telemetry.completedLessons} />
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
              title="Learner Telemetry Summary"
              subtitle="Device-local learning session tracking and quiz metrics."
              action={
                <AdminStatusBadge
                  label={telemetry.errorCount === 0 ? "All Good" : `${telemetry.errorCount} Issues`}
                  tone={telemetry.errorCount === 0 ? "good" : "warning"}
                />
              }
            />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
              <AdminMetricCard label="Quiz Attempts" value={telemetry.quizAttempts} />
              <AdminMetricCard label="Avg Score" tone="good" value={`${telemetry.averageScore}%`} />
              <AdminMetricCard label="Logged Events" value={telemetry.totalEvents} />
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
              tone={monitoring.backendLive ? "good" : "danger"}
              value={monitoring.backendLive ? "Live (Connected)" : "Offline / Sleeping"}
            />
            <AdminMetricCard
              label="Server Latency"
              tone={monitoring.latencyMs < 300 ? "good" : monitoring.latencyMs < 1000 ? "warning" : "danger"}
              value={`${monitoring.latencyMs} ms`}
            />
            <AdminMetricCard
              label="Database"
              tone={monitoring.data?.database?.status === "connected" ? "good" : "warning"}
              value={monitoring.data?.database?.status ?? "Unknown"}
            />
            <AdminMetricCard
              label="Server Uptime"
              value={formatUptime(monitoring.data?.uptimeSeconds)}
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
                  <Text style={monStyles.value}>{monitoring.data?.environment ?? "Render Production"}</Text>
                </View>
                <View style={monStyles.line}>
                  <Text style={monStyles.label}>Node Version:</Text>
                  <Text style={monStyles.value}>{monitoring.data?.nodeVersion ?? "Node.js 22"}</Text>
                </View>
                <View style={monStyles.line}>
                  <Text style={monStyles.label}>DB Ping Latency:</Text>
                  <Text style={monStyles.value}>
                    {monitoring.data?.database?.latencyMs ? `${monitoring.data.database.latencyMs} ms` : "Available when live"}
                  </Text>
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
              title="Recent Client Events Telemetry"
              subtitle="Latest client session events logged on this device."
            />
            {recentEvents.length === 0 ? (
              <Text style={adminStyles.mutedText}>No telemetry events logged yet in this session.</Text>
            ) : (
              <View style={{ gap: 8, marginTop: 8 }}>
                {recentEvents.map((event) => (
                  <View key={event.id} style={monStyles.eventRow}>
                    <AdminStatusBadge
                      label={event.type}
                      tone={event.type.includes("fail") || event.type.includes("error") ? "danger" : "good"}
                    />
                    <Text style={monStyles.eventTime}>
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </Text>
                    <Text numberOfLines={1} style={monStyles.eventData}>
                      {event.data ? JSON.stringify(event.data) : "Standard lifecycle event"}
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
