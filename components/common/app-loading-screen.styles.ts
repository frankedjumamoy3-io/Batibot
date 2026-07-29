import { type AppTheme, createThemedStyles } from "@/constants/theme";

export function createAppLoadingScreenStyles(theme: AppTheme) {
  return createThemedStyles(theme, {
    loadingScreen: {
      alignItems: "center",
      backgroundColor: theme.colors.background,
      flex: 1,
      justifyContent: "center",
      padding: 24,
    },
    loadingText: {
      color: theme.colors.text,
      fontSize: 15,
      fontWeight: "600",
      marginTop: 14,
    },
  });
}
