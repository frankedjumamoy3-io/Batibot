import { Fonts, type AppTheme, createThemedStyles } from "@/constants/theme";

export function createHomeStyles(
  theme: AppTheme,
  options: { compact?: boolean } = {}
) {
  const isCompact = options.compact === true;

  return createThemedStyles(theme, {
    actionBody: {
      flex: 1,
    },
    actionCard: {
      ...theme.shadow,
      alignItems: "center",
      backgroundColor: theme.isDark
        ? theme.colors.surface
        : "rgba(255,255,255,0.96)",
      borderBottomWidth: 4,
      borderColor: theme.learning.home.border,
      borderWidth: 1,
      borderRadius: 24,
      flexDirection: "row",
      gap: 14,
      padding: 16,
    },
    actionIconWrap: {
      alignItems: "center",
      borderColor: "rgba(255,255,255,0.72)",
      borderRadius: 20,
      borderWidth: 2,
      height: 52,
      justifyContent: "center",
      width: 52,
    },
    actionSubtitle: {
      color: theme.colors.textMuted,
      fontSize: 13,
      lineHeight: 18,
      marginTop: 4,
    },
    actionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "800",
    },
    actionsList: {
      gap: 12,
      marginTop: 12,
    },
    content: {
      gap: 14,
      padding: isCompact ? 16 : theme.spacing.screen,
      paddingBottom: 34,
    },
    contentWithBuddy: {
      paddingBottom: 168,
    },
    overviewSummaryCard: {
      ...theme.shadow,
      backgroundColor: theme.isDark
        ? theme.colors.surface
        : "rgba(255,255,255,0.92)",
      borderBottomWidth: 4,
      borderColor: theme.learning.home.border,
      borderWidth: 1,
      borderRadius: theme.radii.lg,
      padding: 18,
    },
    overviewSummaryText: {
      color: theme.colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
      marginTop: 8,
    },
    continueBody: {
      flex: 1,
      gap: 3,
    },
    continueCard: {
      ...theme.shadow,
      alignItems: "center",
      backgroundColor: theme.isDark
        ? theme.learning.play.surface
        : "rgba(247,255,249,0.96)",
      borderBottomWidth: 4,
      borderColor: theme.learning.play.border,
      borderRadius: 24,
      borderWidth: 1,
      flexDirection: "row",
      gap: 14,
      padding: 16,
    },
    continueEyebrow: {
      color: theme.learning.play.deep,
      fontSize: 12,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    continueIconWrap: {
      alignItems: "center",
      backgroundColor: theme.learning.play.accent,
      borderColor: "rgba(255,255,255,0.76)",
      borderRadius: 20,
      borderWidth: 2,
      height: 52,
      justifyContent: "center",
      width: 52,
    },
    continueText: {
      color: theme.colors.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
    continueTitle: {
      color: theme.colors.text,
      fontFamily: Fonts.rounded,
      fontSize: 20,
      fontWeight: "900",
    },
    adminButton: {
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.18)",
      borderRadius: 999,
      height: 42,
      justifyContent: "center",
      width: 42,
    },
    headerActions: {
      alignItems: "center",
      flexDirection: "row",
      flexShrink: 0,
      gap: 8,
    },
    hero: {
      ...theme.shadow,
      backgroundColor: theme.learning.home.accent,
      borderColor: "rgba(255,255,255,0.22)",
      borderWidth: 1,
      borderRadius: 24,
      gap: 8,
      padding: isCompact ? 16 : 18,
    },
    heroBadge: {
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: "rgba(255,255,255,0.18)",
      borderRadius: 999,
      flexDirection: "row",
      gap: 8,
      maxWidth: "58%",
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    heroBadgeText: {
      color: "#FFFFFF",
      flexShrink: 1,
      fontFamily: Fonts.rounded,
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 0.3,
    },
    heroHeaderRow: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: 12,
      justifyContent: "space-between",
    },
    heroOverlay: {
      left: 0,
      position: "absolute",
      right: 0,
      top: 0,
      zIndex: 10,
    },
    heroStatCard: {
      backgroundColor: "rgba(255,255,255,0.20)",
      borderColor: "rgba(255,255,255,0.22)",
      borderWidth: 1,
      borderRadius: 18,
      flex: 1,
      minWidth: "30%",
      padding: 10,
    },
    heroStatLabel: {
      color: "#CCFBF1",
      fontSize: 11,
      fontWeight: "700",
      marginTop: 4,
    },
    heroStatValue: {
      color: "#FFFFFF",
      fontSize: isCompact ? 16 : 17,
      fontWeight: "800",
    },
    heroStats: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    heroText: {
      color: "#E7FFF8",
      fontSize: isCompact ? 13 : 14,
      lineHeight: isCompact ? 18 : 19,
    },
    heroTitle: {
      color: "#FFFFFF",
      fontFamily: Fonts.rounded,
      fontSize: isCompact ? 21 : 24,
      fontWeight: "800",
      marginBottom: 4,
      marginTop: 8,
    },
    missionButton: {
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: theme.learning.words.accent,
      borderBottomColor: theme.learning.words.deep,
      borderBottomWidth: 4,
      borderRadius: 18,
      marginTop: 16,
      paddingHorizontal: 18,
      paddingVertical: 12,
    },
    missionButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "800",
    },
    missionCard: {
      ...theme.shadow,
      backgroundColor: theme.isDark
        ? theme.learning.words.surface
        : "rgba(255, 251, 245, 0.96)",
      borderBottomWidth: 4,
      borderColor: theme.learning.words.border,
      borderWidth: 1,
      borderRadius: theme.radii.lg,
      padding: 18,
    },
    missionText: {
      color: theme.isDark ? "#FFD4B4" : "#A24709",
      fontSize: 15,
      lineHeight: 22,
      marginTop: 8,
    },
    progressBarFill: {
      backgroundColor: theme.learning.play.accent,
      borderRadius: 999,
      height: "100%",
    },
    progressBarTrack: {
      backgroundColor: theme.learning.play.soft,
      borderRadius: 999,
      height: 14,
      overflow: "hidden",
    },
    progressCard: {
      ...theme.shadow,
      backgroundColor: theme.isDark
        ? theme.learning.progress.surface
        : "rgba(248,251,255,0.96)",
      borderBottomWidth: 4,
      borderColor: theme.learning.progress.border,
      borderWidth: 1,
      borderRadius: theme.radii.lg,
      padding: 18,
    },
    progressSummary: {
      color: theme.colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
      marginTop: 12,
    },
    screen: {
      backgroundColor: "transparent",
      flex: 1,
    },
    sectionCaption: {
      color: theme.colors.textMuted,
      fontSize: 13,
      fontWeight: "700",
    },
    sectionHeader: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
      justifyContent: "space-between",
      marginBottom: 14,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontFamily: Fonts.rounded,
      fontSize: 20,
      fontWeight: "800",
    },
    snapshotCard: {
      ...theme.shadow,
      backgroundColor: theme.isDark
        ? theme.colors.surface
        : "rgba(255,255,255,0.94)",
      borderBottomWidth: 4,
      borderColor: theme.learning.home.border,
      borderWidth: 1,
      borderRadius: theme.radii.lg,
      padding: 18,
    },
    snapshotGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 14,
    },
    snapshotLabel: {
      color: theme.colors.textMuted,
      fontSize: 13,
      lineHeight: 18,
      marginTop: 6,
    },
    snapshotTile: {
      backgroundColor: theme.isDark
        ? theme.colors.backgroundAccent
        : theme.learning.home.soft,
      borderColor: theme.learning.home.border,
      borderWidth: 1,
      borderRadius: 18,
      minWidth: "47%",
      padding: 16,
    },
    snapshotValue: {
      color: theme.learning.home.deep,
      fontSize: 22,
      fontWeight: "800",
    },
  });
}
