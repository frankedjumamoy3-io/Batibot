import { Ionicons } from "@expo/vector-icons";
import { router, usePathname, type Href } from "expo-router";
import React, { useState, type ReactNode } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { APP_ROUTES } from "@/src/navigation/routes";
import { useAuthSession } from "@/src/store/auth-session";

const ADMIN_SHIELD_ICON = require("@/assets/images/admin/admin-shield-icon.jpg");

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

type NavGroupItem = {
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

const NAV_GROUPS: {
  title: string;
  items: NavGroupItem[];
}[] = [
  {
    title: "MANAGEMENT",
    items: [
      { href: "/(admin)" as Href, icon: "speedometer-outline", label: "Dashboard" },
      { href: "/(admin)/content-curation" as Href, icon: "book-outline", label: "Content Management" },
      { href: "/(admin)/asset-library" as Href, icon: "images-outline", label: "Asset Library" },
      { href: "/(admin)/users" as Href, icon: "people-outline", label: "User Management" },
      { href: "/(admin)/analytics" as Href, icon: "bar-chart-outline", label: "Analytics" },
    ],
  },
  {
    title: "ACTIONS",
    items: [
      { href: "/(admin)/create-draft" as Href, icon: "add-circle-outline", label: "Create Draft" },
      { href: "/(admin)/create-topic" as Href, icon: "create-outline", label: "Create Topic" },
      { href: "/(admin)/curriculum" as Href, icon: "list-outline", label: "Curriculum Map" },
      { href: "/(admin)/review-queue" as Href, icon: "checkmark-done-circle-outline", label: "Review Queue" },
      { href: "/(admin)/published" as Href, icon: "cloud-done-outline", label: "Published Content" },
      { href: "/(admin)/publishing" as Href, icon: "paper-plane-outline", label: "Publishing" },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { href: "/(admin)/settings" as Href, icon: "settings-outline", label: "System Settings" },
    ],
  },
];

export function AdminShell({ children, subtitle, title }: AdminShellProps) {
  const pathname = usePathname();
  const normalizedPathname = normalizeAdminPath(pathname);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user, profile, endSession } = useAuthSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDesktop = width >= 860;

  async function handleLogout() {
    try {
      await endSession();
    } finally {
      setMobileMenuOpen(false);
      router.replace(APP_ROUTES.auth.login);
    }
  }

  function renderSidebarContent() {
    return (
      <View style={styles.sidebarInner}>
        <View style={styles.brandBlock}>
          <Image source={ADMIN_SHIELD_ICON} style={styles.brandIcon} resizeMode="contain" />
          <View style={styles.brandTextWrap}>
            <Text style={styles.brand}>BatiBot</Text>
            <View style={styles.adminBadgePill}>
              <Text style={styles.adminBadgeText}>Admin Console</Text>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.sidebarScroll}>
          {NAV_GROUPS.map((group) => (
            <View key={group.title} style={styles.navGroup}>
              <Text style={styles.navGroupTitle}>{group.title}</Text>
              <View style={styles.navList}>
                {group.items.map((item) => {
                  const normalizedHref = normalizeAdminPath(String(item.href));
                  const active = isAdminNavActive(normalizedPathname, normalizedHref);

                  return (
                    <Pressable
                      key={item.label}
                      onPress={() => {
                        setMobileMenuOpen(false);
                        router.push(item.href);
                      }}
                      style={mergeAdminStyles(styles.navItem, active && styles.navItemActive)}
                    >
                      <Ionicons
                        name={item.icon}
                        size={18}
                        color={active ? "#FFFFFF" : ADMIN_COLORS.purpleDark}
                        style={{ marginRight: 8 }}
                      />
                      <Text style={mergeAdminStyles(styles.navText, active && styles.navTextActive)}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Account Settings Section */}
          <View style={styles.navGroup}>
            <Text style={styles.navGroupTitle}>ACCOUNT SETTINGS</Text>
            <View style={styles.accountCard}>
              <View style={styles.accountRow}>
                <Ionicons name="person-circle-outline" size={26} color={ADMIN_COLORS.purple} />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={styles.accountEmail}>
                    {user?.email || profile?.displayName || "Admin"}
                  </Text>
                  <Text style={styles.accountRole}>Role: Administrator</Text>
                </View>
              </View>
              <Text style={styles.accountServer}>Node.js API · PostgreSQL</Text>
            </View>
          </View>

          {/* Logout Action */}
          <View style={styles.logoutSection}>
            <Pressable
              accessibilityRole="button"
              onPress={() => { void handleLogout(); }}
              style={styles.logoutButton}
            >
              <Ionicons name="log-out-outline" size={19} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.logoutButtonText}>Sign Out</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Desktop Persistent Sidebar */}
      {isDesktop ? (
        <View style={styles.sidebar}>
          {renderSidebarContent()}
        </View>
      ) : null}

      {/* Mobile Drawer Modal */}
      {!isDesktop ? (
        <Modal
          animationType="fade"
          transparent
          visible={mobileMenuOpen}
          onRequestClose={() => setMobileMenuOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={styles.scrim} onPress={() => setMobileMenuOpen(false)} />
            <View style={[styles.mobileDrawer, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
              <Pressable
                accessibilityLabel="Close admin menu"
                onPress={() => setMobileMenuOpen(false)}
                style={styles.closeDrawerButton}
              >
                <Ionicons name="close" size={24} color={ADMIN_COLORS.purpleDark} />
              </Pressable>
              {renderSidebarContent()}
            </View>
          </View>
        </Modal>
      ) : null}

      {/* Main Content Area */}
      <View style={styles.mainContainer}>
        {/* Mobile Top Navigation Bar */}
        {!isDesktop ? (
          <View style={[styles.mobileHeader, { paddingTop: insets.top + 8 }]}>
            <Pressable
              accessibilityLabel="Open Admin Menu"
              onPress={() => setMobileMenuOpen(true)}
              style={styles.hamburgerButton}
            >
              <Ionicons name="menu" size={24} color={ADMIN_COLORS.purpleDark} />
            </Pressable>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <Text numberOfLines={1} style={styles.mobileHeaderTitle}>
                {title}
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Sign out"
              onPress={() => { void handleLogout(); }}
              style={styles.headerLogoutButton}
            >
              <Ionicons name="log-out-outline" size={22} color="#DC2626" />
            </Pressable>
          </View>
        ) : null}

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
    </View>
  );
}

export function AdminCard({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function AdminMetricCard({ label, tone = "default", value }: AdminMetricCardProps) {
  const toneStyle =
    tone === "good"
      ? styles.goodMetric
      : tone === "warning"
      ? styles.warningMetric
      : tone === "danger"
      ? styles.dangerMetric
      : styles.defaultMetric;

  return (
    <View style={mergeAdminStyles(styles.metricCard, toneStyle)}>
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
  const toneStyle =
    tone === "good"
      ? styles.goodStatus
      : tone === "warning"
      ? styles.warningStatus
      : tone === "danger"
      ? styles.dangerStatus
      : styles.defaultStatus;

  return (
    <View style={mergeAdminStyles(styles.statusPill, toneStyle)}>
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
  accountCard: {
    backgroundColor: ADMIN_COLORS.purpleSoft,
    borderColor: ADMIN_COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
    marginTop: 6,
    padding: 10,
  },
  accountEmail: {
    color: ADMIN_COLORS.purpleDark,
    fontSize: 13,
    fontWeight: "800",
  },
  accountRole: {
    color: ADMIN_COLORS.purple,
    fontSize: 11,
    fontWeight: "700",
  },
  accountRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  accountServer: {
    color: ADMIN_COLORS.muted,
    fontSize: 10,
    fontWeight: "600",
  },
  adminBadgePill: {
    backgroundColor: ADMIN_COLORS.purple,
    borderRadius: 999,
    marginTop: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  adminBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
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
    alignItems: "center",
    backgroundColor: ADMIN_COLORS.purpleSoft,
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  brandIcon: {
    borderRadius: 8,
    height: 38,
    width: 38,
  },
  brandTextWrap: {
    flex: 1,
  },
  brand: {
    color: ADMIN_COLORS.purpleDark,
    fontSize: 18,
    fontWeight: "900",
  },
  button: {
    alignItems: "center",
    backgroundColor: ADMIN_COLORS.purple,
    borderRadius: 10,
    justifyContent: "center",
    minHeight: 44,
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
  closeDrawerButton: {
    alignSelf: "flex-end",
    marginBottom: 8,
    padding: 4,
  },
  content: {
    alignSelf: "center",
    gap: 16,
    maxWidth: 1180,
    padding: 20,
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
  warningMetric: {
    borderTopColor: ADMIN_COLORS.warning,
  },
  warningStatus: {
    backgroundColor: ADMIN_COLORS.warningSoft,
  },
  hamburgerButton: {
    backgroundColor: ADMIN_COLORS.purpleSoft,
    borderRadius: 10,
    padding: 8,
  },
  header: {
    gap: 6,
    marginBottom: 4,
  },
  headerLogoutButton: {
    backgroundColor: ADMIN_COLORS.dangerSoft,
    borderRadius: 10,
    padding: 8,
  },
  logoutButton: {
    alignItems: "center",
    backgroundColor: ADMIN_COLORS.dangerSoft,
    borderColor: "rgba(220, 38, 38, 0.2)",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 11,
  },
  logoutButtonText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "800",
  },
  logoutSection: {
    marginBottom: 20,
    marginTop: 8,
  },
  mainContainer: {
    flex: 1,
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
  mobileDrawer: {
    backgroundColor: ADMIN_COLORS.surface,
    bottom: 0,
    left: 0,
    maxWidth: 320,
    paddingHorizontal: 16,
    position: "absolute",
    top: 0,
    width: "82%",
    zIndex: 100,
  },
  mobileHeader: {
    alignItems: "center",
    backgroundColor: ADMIN_COLORS.surface,
    borderBottomColor: ADMIN_COLORS.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingHorizontal: 14,
  },
  mobileHeaderTitle: {
    color: ADMIN_COLORS.purpleDark,
    fontSize: 16,
    fontWeight: "900",
  },
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
  },
  mutedText: {
    color: ADMIN_COLORS.muted,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  navGroup: {
    marginBottom: 14,
  },
  navGroupTitle: {
    color: ADMIN_COLORS.muted,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 6,
    marginLeft: 4,
  },
  navItem: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  navItemActive: {
    backgroundColor: ADMIN_COLORS.purple,
    borderColor: ADMIN_COLORS.purple,
  },
  navList: {
    gap: 4,
  },
  navText: {
    color: ADMIN_COLORS.text,
    fontSize: 13,
    fontWeight: "800",
  },
  navTextActive: {
    color: ADMIN_COLORS.surface,
  },
  scrim: {
    backgroundColor: "rgba(17, 24, 39, 0.45)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
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
    padding: 16,
    width: 250,
  },
  sidebarInner: {
    flex: 1,
  },
  sidebarScroll: {
    flex: 1,
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
  },
  tableHeader: {
    borderBottomColor: ADMIN_COLORS.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingBottom: 10,
  },
  tableHeaderText: {
    color: ADMIN_COLORS.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  tableRow: {
    alignItems: "center",
    borderBottomColor: ADMIN_COLORS.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingVertical: 12,
  },
  title: {
    color: ADMIN_COLORS.purpleDark,
    fontSize: 22,
    fontWeight: "900",
  },
});

export const adminStyles = styles;
