import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, ScrollView, Share, Text, View } from "react-native";
import { AdminButton, AdminCard, AdminMetricCard, AdminSectionHeader, AdminShell, AdminTable } from "@/src/components/admin/AdminShell";
import { getAdminInsights, type AdminInsights } from "@/src/services/admin/adminInsightsService";
import { buildLiveAdminReport, reportToCsv, type LiveReportType } from "@/src/services/admin/liveAdminReports";
import { LEARNER_GRADE_LEVELS } from "@/src/types/user";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";

const REPORTS: { type: LiveReportType; label: string }[] = [
  { type: "learner-progress", label: "Learner Progress" },
  { type: "quiz-performance", label: "Quiz Performance" },
  { type: "curriculum-coverage", label: "Content Coverage" },
  { type: "admin-curation", label: "Publishing Activity" },
];

export default function AdminReportsScreen() {
  const { profile } = useCurrentUserProfile();
  const [insights, setInsights] = useState<AdminInsights | null>(null);
  const [type, setType] = useState<LiveReportType>("learner-progress");
  const [grade, setGrade] = useState<string | undefined>();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setInsights(await getAdminInsights(profile)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load reports."); }
    finally { setLoading(false); }
  }, [profile]);
  useEffect(() => { void load(); }, [load]);
  const report = useMemo(() => insights ? buildLiveAdminReport(insights, type, type === "admin-curation" ? undefined : grade) : null, [insights, type, grade]);
  const pageSize = 25;
  const pageCount = report ? Math.max(1, Math.ceil(report.tableRows.length / pageSize)) : 1;

  async function exportCsv() {
    if (!report) return;
    const csv = reportToCsv(report);
    try {
      if (Platform.OS === "web" && typeof document !== "undefined") {
        const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = `batibot-${type}-${new Date(insights!.generatedAt).toISOString().slice(0, 10)}.csv`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(href), 1000);
      } else {
        await Share.share({ title: report.title, message: csv });
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not export the report.");
    }
  }

  return <AdminShell title="Reports" subtitle="Generate reports from saved backend learner progress and admin publishing records.">
    <AdminCard>
      <AdminSectionHeader title="Generate a report" subtitle={insights ? `Backend data updated ${new Date(insights.generatedAt).toLocaleString()}` : "Connect to load current data."}
        action={<AdminButton label={loading ? "Loading..." : "Refresh data"} disabled={loading} onPress={() => { void load(); }} />} />
      {error ? <Text accessibilityRole="alert" style={{ color: "#B91C1C", marginBottom: 12 }}>{error}</Text> : null}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {REPORTS.map(option => <AdminButton key={option.type} label={option.label} tone={type === option.type ? "primary" : "secondary"}
          onPress={() => { setType(option.type); setPage(0); }} />)}
      </View>
      {type !== "admin-curation" ? <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <AdminButton label="All grades" tone={!grade ? "primary" : "secondary"} onPress={() => { setGrade(undefined); setPage(0); }} />
        {LEARNER_GRADE_LEVELS.map(item => <AdminButton key={item} label={item} tone={grade === item ? "primary" : "secondary"}
          onPress={() => { setGrade(item); setPage(0); }} />)}
      </View> : null}
    </AdminCard>
    {report ? <>
      <AdminSectionHeader title={report.title} subtitle={`Generated ${new Date(report.generatedAt).toLocaleString()}`}
        action={<AdminButton label={Platform.OS === "web" ? "Download CSV" : "Share CSV"} onPress={() => { void exportCsv(); }} />} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {report.summaryCards.map(card => <AdminMetricCard key={card.label} label={card.label} value={card.value} />)}
      </View>
      <AdminCard>
        {report.insights.map((line, index) => <Text key={index} style={{ color: "#475569", marginBottom: 5 }}>{line}</Text>)}
      </AdminCard>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={{ minWidth: Math.max(700, report.tableHeaders.length * 150), flex: 1 }}>
          <AdminTable columns={report.tableHeaders} rows={report.tableRows.slice(page * pageSize, (page + 1) * pageSize)}
            emptyTitle="No records for this report" emptyDescription="Try another grade or refresh the backend data." />
        </View>
      </ScrollView>
      {pageCount > 1 ? <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <AdminButton label="Previous" disabled={page === 0} onPress={() => setPage(current => Math.max(0, current - 1))} />
        <Text>Page {page + 1} of {pageCount}</Text>
        <AdminButton label="Next" disabled={page + 1 >= pageCount} onPress={() => setPage(current => Math.min(pageCount - 1, current + 1))} />
      </View> : null}
    </> : <AdminCard><Text>{loading ? "Loading reports..." : "Reports are unavailable until backend data loads."}</Text></AdminCard>}
  </AdminShell>;
}
