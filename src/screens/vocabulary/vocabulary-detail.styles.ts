import { type AppTheme, createThemedStyles } from "@/constants/theme";

export function createVocabularyDetailStyles(theme: AppTheme) {
  return createThemedStyles(theme, {
  badgeRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  categoryTag: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: "800",
  },
  content: {
    backgroundColor: theme.colors.backgroundAccent,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flex: 1,
    marginTop: -22,
    padding: 20,
  },
  definition: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 27,
  },
  emoji: {
    fontSize: 36,
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundAccent,
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: "center",
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  exampleCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    marginTop: 20,
    padding: 16,
  },
  exampleLabel: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  exampleText: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  heroImage: {
    backgroundColor: theme.colors.backgroundAccent,
    height: 260,
    width: "100%",
  },
  infoBody: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: theme.colors.backgroundAccent,
    borderColor: theme.colors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
  },
  learningCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    marginTop: 16,
    padding: 16,
  },
  inlineMetaLabel: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  infoLabel: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  infoTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
  },
  listenButton: {
    alignItems: "center",
    borderRadius: 18,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 16,
  },
  listenText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: "800",
  },
  metaWrap: {
    alignItems: "flex-end",
    gap: 8,
  },
  pronunciationText: {
    fontSize: 15,
    fontWeight: "900",
    marginTop: 4,
  },
  rewardPill: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  rewardText: {
    color: theme.colors.danger,
    fontSize: 12,
    fontWeight: "900",
  },
  screen: {
    backgroundColor: theme.colors.backgroundAccent,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  sayItLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 8,
    textTransform: "uppercase",
  },
  soundTag: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  soundTagText: {
    color: theme.colors.surface,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  tryCard: {
    backgroundColor: theme.colors.surfaceMint,
    borderRadius: 18,
    marginTop: 16,
    padding: 16,
  },
  word: {
    color: theme.colors.text,
    fontSize: 34,
    fontWeight: "900",
  },
  wordHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "space-between",
  },
  wordNavButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    flexGrow: 1,
    gap: 8,
    justifyContent: "center",
    minHeight: 52,
    minWidth: 150,
    paddingHorizontal: 14,
  },
  wordNavButtonPrimary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  wordNavRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  wordNavText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  wordNavTextPrimary: {
    color: "#FFFFFF",
  },
  wordTitleWrap: {
    flex: 1,
    minWidth: 190,
  },
  });
}

