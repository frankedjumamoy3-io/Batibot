import type { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { router, usePathname, type Href } from "expo-router";

type AdminShellProps = {
  children: ReactNode;
  subtitle?: string;
  title: string;
};

type AdminMetricCardProps = {
  label: string;
  tone?: "default" | "good" | "warning" | "danger";
  value: string | number;
};

type AdminBarChartProps = {
  data: Record<string, number>;
  emptyLabel?: string;
  title: string;
};

type AdminStatusPillProps = {
  label: string;
  tone?: "default" | "good" | "warning" | "danger";
};

type AdminSectionHeaderProps = {
  action?: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  title: string;
};

type AdminTableProps = {
  action?: ReactNode;
  columns: string[];
  emptyDescription?: string;
  emptyTitle?: string;
  rows: ReactNode[][];
};

const ADMIN_COLORS = {
  background: "#F7F3FF",
  border: "#E7DDFB",
  danger: "#DC2626",
  dangerSoft: "#FEE2E2",
  good: "#16A34A",
  goodSoft: "#DCFCE7",
  muted: "#64748B",
  purple: "#6D28D9",
  purpleDark: "#4C1D95",
  purpleSoft: "#EDE9FE",
  softSurface: "#FBFAFF",
  surface: "#FFFFFF",
  text: "#111827",
  warning: "#D97706",
  warningSoft: "#FEF3C7",
};

const NAV_ITEMS: { href: Href; label: string }[] = [
  { href: "/(admin)" as Href, label: "Dashboard" },
  { href: "/(admin)/content-curation" as Href, label: "Content Management" },
  { href: "/(admin)/asset-library" as Href, label: "Asset Library" },
  { href: "/(admin)/users" as Href, label: "User Management" },
  { href: "/(admin)/analytics" as Href, label: "Analytics" },
  { href: "/(admin)/settings" as Href, label: "Settings" },
];

export function AdminShell({ children, subtitle, title }: AdminShellProps) {
  const pathname = usePathname();
  const normalizedPathname = normalizeAdminPath(pathname);

  return (
    <View style={styles.screen}>
      <View style={styles.sidebar}>
        <View style={styles.brandBlock}>
          <Text style={styles.brand}>BatiBot</Text>
          <Text style={styles.brandSub}>Admin Console</Text>
        </View>
        <View style={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const normalizedHref = normalizeAdminPath(String(item.href));
            const active = isAdminNavActive(normalizedPathname, normalizedHref);

            return (
              <Pressable
                key={item.label}
                onPress={() => router.push(item.href)}
                style={mergeAdminStyles(styles.navItem, active && styles.navItemActive)}
              >
                <Text style={mergeAdminStyles(styles.navText, active && styles.navTextActive)}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.contentScroll}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {children}
      </ScrollView>
    </View>
  );
}

export function AdminCard({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function AdminMetricCard({ label, tone = "default", value }: AdminMetricCardProps) {
  return (
    <View style={mergeAdminStyles(styles.metricCard, styles[`${tone}Metric`])}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export function AdminBarChart({ data, emptyLabel = "No data yet.", title }: AdminBarChartProps) {
  const entries = Object.entries(data).filter(([, value]) => value > 0);
  const max = Math.max(...entries.map(([, value]) => value), 1);

  return (
    <AdminCard>
      <Text style={styles.sectionTitle}>{title}</Text>
      {entries.length ? (
        entries.slice(0, 8).map(([label, value]) => (
          <View key={label} style={styles.barRow}>
            <Text numberOfLines={1} style={styles.barLabel}>{label}</Text>
            <View style={styles.barTrack}>
              <View style={mergeAdminStyles(styles.barFill, { width: `${Math.max(8, (value / max) * 100)}%` })} />
            </View>
            <Text style={styles.barValue}>{value}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.mutedText}>{emptyLabel}</Text>
      )}
    </AdminCard>
  );
}

export function AdminButton({
  disabled = false,
  label,
  onPress,
  tone = "primary",
}: {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  tone?: "primary" | "secondary" | "danger";
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={mergeAdminStyles(
        styles.button,
        tone === "secondary" ? styles.secondaryButton : null,
        tone === "danger" ? styles.dangerButton : null,
        disabled ? styles.buttonDisabled : null
      )}
    >
      <Text style={mergeAdminStyles(styles.buttonText, tone === "secondary" && styles.secondaryButtonText)}>
        {label}
      </Text>
    </Pressable>
  );
}

export function AdminStatusBadge({ label, tone = "default" }: AdminStatusPillProps) {
  return (
    <View style={mergeAdminStyles(styles.statusPill, styles[`${tone}Status`])}>
      <Text style={styles.statusText}>{label}</Text>
    </View>
  );
}

export const AdminStatusPill = AdminStatusBadge;

export function AdminSectionHeader({ action, eyebrow, subtitle, title }: AdminSectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1, gap: 4 }}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.mutedText}>{subtitle}</Text> : null}
      </View>
      {action ? <View>{action}</View> : null}
    </View>
  );
}

export function AdminTable({
  action,
  columns,
  emptyDescription = "Records will appear here when available.",
  emptyTitle = "No records yet",
  rows,
}: AdminTableProps) {
  return (
    <AdminCard>
      {action ? <View style={styles.tableAction}>{action}</View> : null}
      <View style={styles.tableHeader}>
        {columns.map((column) => (
          <Text key={column} style={styles.tableHeaderText}>
            {column}
          </Text>
        ))}
      </View>
      {rows.length ? (
        rows.map((row, rowIndex) => (
          <View key={`admin-table-row-${rowIndex}`} style={styles.tableRow}>
            {row.map((cell, cellIndex) => (
              <View key={`admin-table-cell-${rowIndex}-${cellIndex}`} style={styles.tableCell}>
                {typeof cell === "string" || typeof cell === "number" ? (
                  <Text style={styles.tableCellText}>{cell}</Text>
                ) : (
                  cell
                )}
              </View>
            ))}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{emptyTitle}</Text>
          <Text style={styles.mutedText}>{emptyDescription}</Text>
        </View>
      )}
    </AdminCard>
  );
}

type AdminRuntimeStyle = ImageStyle & TextStyle & ViewStyle;

export function mergeAdminStyles(
  ...items: (object | false | null | undefined)[]
) {
  return Object.assign({}, ...items.filter(Boolean)) as AdminRuntimeStyle;
}

function normalizeAdminPath(value: string) {
  const withoutGroup = value.replace("/(admin)", "");
  return withoutGroup || "/";
}

function isAdminNavActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (pathname === href || pathname.startsWith(`${href}/`)) {
    return true;
  }

  if (href === "/content-curation") {
    return (
      pathname.startsWith("/curriculum") ||
      pathname.startsWith("/create-topic") ||
      pathname.startsWith("/create-draft") ||
      pathname.startsWith("/drafts") ||
      pathname.startsWith("/review-queue") ||
      pathname.startsWith("/topic-editor") ||
      pathname.startsWith("/draft-review") ||
      pathname.startsWith("/published") ||
      pathname.startsWith("/publishing")
    );
  }

  if (href === "/publishing") {
    return pathname.startsWith("/published");
  }

  return false;
}

const styles = StyleSheet.create({
  barFill: {
    backgroundColor: ADMIN_COLORS.purple,
    borderRadius: 999,
    height: 10,
  },
  barLabel: {
    color: ADMIN_COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
    width: 126,
  },
  barRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  barTrack: {
    backgroundColor: ADMIN_COLORS.purpleSoft,
    borderRadius: 999,
    flex: 1,
    height: 10,
    overflow: "hidden",
  },
  barValue: {
    color: ADMIN_COLORS.text,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    width: 34,
  },
  brandBlock: {
    backgroundColor: ADMIN_COLORS.purpleSoft,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  brand: {
    color: ADMIN_COLORS.purpleDark,
    fontSize: 20,
    fontWeight: "900",
  },
  brandSub: {
    color: ADMIN_COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  button: {
    alignItems: "center",
    backgroundColor: ADMIN_COLORS.purple,
    borderRadius: 10,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: ADMIN_COLORS.surface,
    fontSize: 14,
    fontWeight: "900",
  },
  card: {
    backgroundColor: ADMIN_COLORS.surface,
    borderColor: ADMIN_COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    padding: 16,
    shadowColor: "#4C1D95",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  content: {
    alignSelf: "center",
    gap: 16,
    maxWidth: 1180,
    padding: 24,
    paddingBottom: 48,
    width: "100%",
  },
  contentScroll: {
    backgroundColor: ADMIN_COLORS.background,
    flex: 1,
  },
  dangerButton: {
    backgroundColor: ADMIN_COLORS.danger,
  },
  dangerMetric: {
    borderTopColor: ADMIN_COLORS.danger,
  },
  dangerStatus: {
    backgroundColor: ADMIN_COLORS.dangerSoft,
  },
  defaultMetric: {
    borderTopColor: ADMIN_COLORS.purple,
  },
  defaultStatus: {
    backgroundColor: ADMIN_COLORS.purpleSoft,
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: ADMIN_COLORS.softSurface,
    borderColor: ADMIN_COLORS.border,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    gap: 6,
    padding: 22,
  },
  emptyTitle: {
    color: ADMIN_COLORS.text,
    fontSize: 16,
    fontWeight: "900",
  },
  eyebrow: {
    color: ADMIN_COLORS.purple,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  goodMetric: {
    borderTopColor: ADMIN_COLORS.good,
  },
  goodStatus: {
    backgroundColor: ADMIN_COLORS.goodSoft,
  },
  header: {
    gap: 6,
    marginBottom: 4,
  },
  metricCard: {
    backgroundColor: ADMIN_COLORS.surface,
    borderColor: ADMIN_COLORS.border,
    borderRadius: 12,
    borderTopWidth: 4,
    borderWidth: 1,
    elevation: 1,
    flex: 1,
    minWidth: 156,
    padding: 14,
    shadowColor: "#4C1D95",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  metricLabel: {
    color: ADMIN_COLORS.muted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  metricValue: {
    color: ADMIN_COLORS.text,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 6,
  },
  mutedText: {
    color: ADMIN_COLORS.muted,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  navItem: {
    borderColor: "transparent",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  navItemActive: {
    backgroundColor: ADMIN_COLORS.purple,
    borderColor: ADMIN_COLORS.purple,
  },
  navList: {
    gap: 7,
    marginTop: 24,
  },
  navText: {
    color: ADMIN_COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },
  navTextActive: {
    color: ADMIN_COLORS.surface,
  },
  screen: {
    backgroundColor: ADMIN_COLORS.background,
    flex: 1,
    flexDirection: "row",
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
  },
  secondaryButton: {
    backgroundColor: ADMIN_COLORS.surface,
    borderColor: ADMIN_COLORS.border,
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: ADMIN_COLORS.purpleDark,
  },
  sectionTitle: {
    color: ADMIN_COLORS.text,
    fontSize: 17,
    fontWeight: "900",
  },
  sidebar: {
    backgroundColor: ADMIN_COLORS.surface,
    borderColor: ADMIN_COLORS.border,
    borderRightWidth: 1,
    padding: 18,
    width: 220,
  },
  statusPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderColor: "rgba(76, 29, 149, 0.08)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    color: ADMIN_COLORS.text,
    fontSize: 12,
    fontWeight: "900",
  },
  subtitle: {
    color: ADMIN_COLORS.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  tableAction: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  tableCell: {
    flex: 1,
    minWidth: 110,
  },
  tableCellText: {
    color: ADMIN_COLORS.text,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  tableHeader: {
    backgroundColor: ADMIN_COLORS.softSurface,
    borderColor: ADMIN_COLORS.border,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tableHeaderText: {
    color: ADMIN_COLORS.purpleDark,
    flex: 1,
    fontSize: 11,
    fontWeight: "900",
    minWidth: 110,
    textTransform: "uppercase",
  },
  tableRow: {
    alignItems: "center",
    borderBottomColor: ADMIN_COLORS.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  title: {
    color: ADMIN_COLORS.text,
    fontSize: 30,
    fontWeight: "900",
  },
  warningMetric: {
    borderTopColor: ADMIN_COLORS.warning,
  },
  warningStatus: {
    backgroundColor: ADMIN_COLORS.warningSoft,
  },
});

export const adminStyles = styles;
