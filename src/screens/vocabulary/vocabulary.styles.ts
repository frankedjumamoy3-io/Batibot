import { Fonts, type AppTheme, createThemedStyles } from "@/constants/theme";

export function createVocabularyStyles(
  theme: AppTheme,
  options: { compact?: boolean; desktop?: boolean } = {}
) {
  const isCompact = options.compact === true;
  const isDesktop = options.desktop === true;

  return createThemedStyles(theme, {
  activeLetterBadge: {
    alignItems: "center",
    backgroundColor: theme.learning.words.accent,
    borderRadius: 16,
    flexDirection: "row",
    gap: 6,
    minWidth: 72,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeLetterBadgeSide: {
    borderRadius: 999,
    height: 18,
    minWidth: 20,
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: 20,
  },
  activeLetterEyebrow: {
    color: "#DBEAFE",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  activeLetterText: {
    color: "#FFFFFF",
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: "800",
  },
  activeLetterTextSide: {
    fontSize: 10,
  },
  alphabetBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 999,
    minWidth: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  alphabetBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  alphabetBarContent: {
    gap: 7,
    paddingVertical: 2,
  },
  alphabetBarContentSide: {
    alignItems: "center",
    gap: 0,
    justifyContent: "center",
    width: 24,
  },
  alphabetBarWrap: {
    backgroundColor: theme.isDark
      ? theme.learning.words.surface
      : "rgba(255,255,255,0.94)",
    borderColor: theme.learning.words.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
  },
  alphabetBarWrapSide: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderRadius: 999,
    borderWidth: 0,
    justifyContent: "center",
    paddingHorizontal: 2,
    paddingVertical: 0,
    width: 28,
  },
  alphabetBarScrollerSide: {
    width: 24,
  },
  alphabetBarWrapTop: {
    ...theme.shadow,
    borderRadius: 18,
    padding: 12,
  },
  alphabetOverlay: {
    position: "absolute",
    zIndex: 24,
  },
  alphabetOverlaySide: {
    right: 2,
    top: 84,
  },
  alphabetOverlayTop: {
    left: 20,
    right: 20,
    top: 14,
  },
  alphabetPill: {
    alignItems: "center",
    backgroundColor: "#EDF4F8",
    borderColor: "#DCE8F5",
    borderRadius: 999,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 34,
  },
  alphabetPillSide: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    height: 13,
    width: 22,
  },
  alphabetPillAvailable: {
    backgroundColor: theme.learning.words.soft,
  },
  alphabetPillSelected: {
    backgroundColor: theme.learning.words.accent,
    borderColor: theme.learning.words.accent,
  },
  alphabetPillText: {
    color: "#A7B6C8",
    fontSize: 13,
    fontWeight: "800",
  },
  alphabetPillTextSide: {
    fontSize: 9,
  },
  alphabetPillTextAvailable: {
    color: theme.learning.words.deep,
  },
  alphabetPillTextSelected: {
    color: "#FFFFFF",
  },
  alphabetStatusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingBottom: 8,
  },
  alphabetStatusRowSide: {
    gap: 1,
    justifyContent: "center",
    paddingBottom: 3,
  },
  card: {
    ...theme.shadow,
    backgroundColor: theme.isDark
      ? theme.learning.words.surface
      : "rgba(255,255,255,0.94)",
    borderBottomWidth: 4,
    borderColor: theme.learning.words.border,
    borderWidth: 1,
    borderRadius: 22,
    overflow: "hidden",
  },
  cardBody: {
    padding: 16,
  },
  cardFooter: {
    alignItems: "flex-start",
    gap: 8,
    marginTop: 12,
  },
  categoryChip: {
    backgroundColor: isDesktop ? theme.colors.backgroundAccent : "rgba(255,255,255,0.92)",
    borderColor: isDesktop ? theme.colors.border : "rgba(255,255,255,0.86)",
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    minHeight: isDesktop ? 42 : 28,
    paddingHorizontal: isDesktop ? 14 : 12,
    paddingVertical: isDesktop ? 11 : 5,
  },
  categoryChipActive: {
    backgroundColor: theme.learning.words.accent,
    borderColor: theme.learning.words.accent,
  },
  categoryChipText: {
    color: isDesktop ? theme.colors.text : theme.learning.words.deep,
    fontSize: isDesktop ? 13 : 12,
    fontWeight: "800",
    textAlign: "center",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  categoryRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  container: {
    backgroundColor: "transparent",
    gap: 12,
    padding: isCompact ? 16 : 20,
    paddingBottom: 148,
    paddingTop: isCompact ? 16 : 20,
  },
  containerWithBuddy: {
    paddingBottom: 176,
  },
  containerWithSideAlphabet: {
    paddingRight: isCompact ? 40 : 44,
    paddingTop: isCompact ? 16 : 20,
  },
  containerWithTopAlphabet: {
    paddingTop: isCompact ? 116 : 126,
  },
  curriculumTag: {
    alignSelf: "flex-start",
    backgroundColor: theme.learning.words.soft,
    borderRadius: 999,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  curriculumTagText: {
    color: theme.learning.words.deep,
    fontSize: 12,
    fontWeight: "700",
  },
  definition: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  emptyCard: {
    ...theme.shadow,
    backgroundColor: theme.isDark
      ? theme.colors.surface
      : "rgba(255,255,255,0.94)",
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: "center",
  },
  emptyTitle: {
    color: theme.colors.text,
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  featuredAlphabetBadge: {
    alignItems: "center",
    backgroundColor: theme.learning.words.soft,
    borderRadius: 999,
    height: 28,
    justifyContent: "center",
    minWidth: 28,
    paddingHorizontal: 10,
  },
  featuredAlphabetText: {
    color: theme.learning.words.deep,
    fontSize: 12,
    fontWeight: "800",
  },
  featuredBody: {
    padding: 14,
  },
  featuredCard: {
    ...theme.shadow,
    backgroundColor: theme.isDark
      ? theme.learning.words.surface
      : "rgba(255,255,255,0.94)",
    borderBottomWidth: 4,
    borderColor: theme.learning.words.border,
    borderWidth: 1,
    borderRadius: 24,
    overflow: "hidden",
  },
  featuredDefinition: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  featuredEyebrow: {
    color: theme.learning.words.deep,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  featuredGoal: {
    color: theme.colors.textSoft,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  featuredMeta: {
    color: theme.learning.progress.deep,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
  },
  featuredTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featuredWord: {
    color: theme.colors.text,
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 6,
  },
  goalText: {
    color: theme.colors.textSoft,
    fontSize: 13,
    lineHeight: 18,
  },
  hero: {
    ...theme.shadow,
    backgroundColor: theme.isDark
      ? theme.learning.words.surface
      : "rgba(255, 251, 245, 0.96)",
    borderBottomWidth: 4,
    borderColor: theme.learning.words.border,
    borderWidth: 1,
    borderRadius: 24,
    gap: 8,
    padding: isCompact ? 10 : 12,
  },
  heroHeaderRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  heroTitleBlock: {
    marginTop: 0,
  },
  headerActions: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 0,
    gap: 8,
  },
  hint: {
    color: "#3B82F6",
    fontSize: 13,
    fontWeight: "700",
  },
  letterEmptyState: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 16,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  letterEmptyText: {
    color: "#A24709",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16,
  },
  letterSection: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingTop: 4,
  },
  letterSectionBadge: {
    alignItems: "center",
    backgroundColor: theme.learning.words.accent,
    borderRadius: 18,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  letterSectionBadgeText: {
    color: "#FFFFFF",
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: "800",
  },
  letterSectionCopy: {
    flex: 1,
  },
  letterSwitchOverlay: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(23,50,77,0.94)",
    borderRadius: 24,
    justifyContent: "center",
    minWidth: 132,
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: "absolute",
    top: "42%",
    zIndex: 30,
  },
  letterSwitchSubtext: {
    color: "#D8E8F5",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  letterSwitchText: {
    color: "#FFFFFF",
    fontFamily: Fonts.rounded,
    fontSize: 34,
    fontWeight: "800",
  },
  listFooterSpace: {
    height: 72,
  },
  listShell: {
    flex: 1,
  },
  pronunciation: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginTop: 4,
  },
  profileDock: {
    position: "absolute",
    zIndex: 2,
  },
  overlayLabel: {
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
  overlayLabelText: {
    color: "#FFFFFF",
    flexShrink: 1,
    fontFamily: Fonts.rounded,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  screen: {
    backgroundColor: "transparent",
    flex: 1,
  },
  searchInput: {
    color: theme.colors.text,
    flex: 1,
    fontSize: isDesktop ? 15 : 14,
    paddingVertical: isDesktop ? 10 : 5,
  },
  searchInputWrap: {
    alignItems: "center",
    backgroundColor: isDesktop ? theme.learning.words.soft : "#FFFFFF",
    borderColor: isDesktop ? theme.learning.words.border : "rgba(255,255,255,0.82)",
    borderRadius: isDesktop ? 18 : 999,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: isDesktop ? undefined : 30,
    paddingHorizontal: isDesktop ? 14 : 12,
  },
  searchShell: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  sectionSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: "800",
  },
  speakerButton: {
    alignItems: "center",
    backgroundColor: theme.learning.words.soft,
    borderColor: theme.learning.words.border,
    borderWidth: 1,
    borderRadius: 21,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  subcategoryChip: {
    backgroundColor: isDesktop ? theme.colors.backgroundAccent : "rgba(255,255,255,0.92)",
    borderColor: isDesktop ? theme.colors.border : "rgba(255,255,255,0.82)",
    borderRadius: isDesktop ? 14 : 999,
    borderWidth: 1,
    flex: isDesktop ? undefined : 1,
    minHeight: isDesktop ? undefined : 24,
    minWidth: isDesktop ? 72 : undefined,
    paddingHorizontal: isDesktop ? 12 : 4,
    paddingVertical: isDesktop ? 8 : 5,
  },
  subcategoryChipActive: {
    backgroundColor: theme.learning.words.accent,
    borderColor: theme.learning.words.accent,
  },
  subcategoryChipText: {
    color: isDesktop ? theme.colors.text : theme.learning.words.deep,
    fontSize: isDesktop ? 12 : 10,
    fontWeight: "800",
    textAlign: "center",
  },
  subcategoryChipTextActive: {
    color: "#FFFFFF",
  },
  subcategoryRow: {
    flexDirection: "row",
    gap: isDesktop ? 8 : 6,
    justifyContent: isDesktop ? "center" : undefined,
  },
  subtitle: {
    color: isDesktop ? theme.colors.textMuted : "rgba(255,255,255,0.82)",
    fontSize: isCompact ? 13 : 14,
    lineHeight: isCompact ? 18 : 19,
    marginTop: 0,
    textAlign: "left",
  },
  summaryBadge: {
    backgroundColor: isDesktop ? theme.learning.words.soft : "rgba(255,255,255,0.18)",
    borderRadius: 999,
    borderColor: isDesktop ? "transparent" : "rgba(255,255,255,0.26)",
    borderWidth: 1,
    flex: isDesktop ? undefined : 1,
    minHeight: isDesktop ? undefined : 22,
    paddingHorizontal: isDesktop ? 12 : isCompact ? 6 : 8,
    paddingVertical: isDesktop ? 7 : 4,
  },
  summaryBadgeOnColor: {
    backgroundColor: "rgba(255,255,255,0.24)",
  },
  summaryBadgeText: {
    color: isDesktop ? theme.learning.words.deep : "#FFFFFF",
    fontSize: isDesktop ? 13 : isCompact ? 9 : 10,
    fontWeight: "700",
    textAlign: "center",
  },
  summaryBadgeTextOnColor: {
    color: "#FFFFFF",
  },
  summaryRow: {
    flexDirection: "row",
    gap: isDesktop ? 8 : 10,
    justifyContent: isDesktop ? "center" : undefined,
  },
  title: {
    color: isDesktop ? theme.colors.text : "#FFFFFF",
    fontFamily: Fonts.rounded,
    fontSize: isCompact ? 21 : 24,
    fontWeight: "800",
    textAlign: "left",
  },
  voiceButton: {
    alignItems: "center",
    backgroundColor: isDesktop ? theme.learning.play.soft : "rgba(255,255,255,0.92)",
    borderColor: isDesktop ? theme.learning.play.border : "rgba(255,255,255,0.72)",
    borderRadius: isDesktop ? 18 : 999,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: isDesktop ? undefined : 30,
    width: isDesktop ? 48 : 54,
  },
  voiceButtonActive: {
    backgroundColor: theme.learning.play.accent,
    borderColor: theme.learning.play.accent,
  },
  voiceButtonDisabled: {
    opacity: 0.75,
  },
  voiceHint: {
    color: isDesktop ? theme.colors.textSoft : "rgba(255,255,255,0.78)",
    fontSize: isDesktop ? 12 : 11,
    lineHeight: isDesktop ? 18 : 15,
    marginTop: isDesktop ? 8 : 5,
    textAlign: isDesktop ? "center" : "left",
  },
  word: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 10,
  },
  wordBlock: {
    flex: 1,
  },
  wordRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  });
}


