import { Fonts, type AppTheme, createThemedStyles } from "@/constants/theme";

export function createTabLayoutStyles(
  theme: AppTheme,
  options: { bottomInset?: number; isPortableLayout?: boolean; screenWidth?: number } = {}
) {
  const isPortableLayout = options.isPortableLayout;
  const isNarrowPhone = (options.screenWidth ?? 390) < 360;
  const safeBottomPadding = options.isPortableLayout
    ? Math.max(options.bottomInset ?? 0, 34)
    : Math.max(options.bottomInset ?? 0, 18);

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
    root: {
      flex: 1,
    },
    tabBar: {
      alignItems: "center",
      alignSelf: "center",
      backgroundColor: "transparent",
      borderTopWidth: 0,
      bottom: 0,
      elevation: 0,
      height: (isPortableLayout ? 84 : 92) + safeBottomPadding,
      justifyContent: "flex-end",
      left: 0,
      paddingBottom: safeBottomPadding,
      paddingTop: isPortableLayout ? 6 : 8,
      position: "absolute",
      right: 0,
      shadowOpacity: 0,
    },
    tabBarTrack: {
      alignItems: "center",
      alignSelf: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      maxWidth: 430,
      paddingHorizontal: isNarrowPhone ? 8 : 18,
      width: "100%",
    },
    tabButtonSlot: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: isPortableLayout ? 66 : 74,
      width: isNarrowPhone ? 72 : isPortableLayout ? 86 : 104,
    },
    tabButton: {
      alignItems: "center",
      borderBottomWidth: 5,
      borderLeftWidth: 4,
      borderRadius: 18,
      borderRightWidth: 4,
      borderTopWidth: 4,
      height: isPortableLayout ? 56 : 66,
      justifyContent: "center",
      shadowColor: "#172033",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 9,
      width: isPortableLayout ? 66 : 76,
    },
    tabBarImageIcon: {
      height: isPortableLayout ? 28 : 34,
      opacity: 1,
      width: isPortableLayout ? 28 : 34,
    },
    tabBarImageIconFocused: {
      opacity: 1,
    },
    rankTabButton: {
      backgroundColor: "#5DC6F5",
      borderColor: "#1589B6",
    },
    playTabButton: {
      backgroundColor: "#35E79E",
      borderColor: "#159B70",
      borderRadius: 21,
      height: isPortableLayout ? 62 : 70,
      minWidth: isNarrowPhone ? 116 : isPortableLayout ? 132 : 148,
      width: isNarrowPhone ? 116 : isPortableLayout ? 132 : 148,
    },
    playTabContent: {
      alignItems: "center",
      flexDirection: "row",
      gap: isPortableLayout ? 4 : 6,
      justifyContent: "center",
      minWidth: isPortableLayout ? 82 : 108,
    },
    sideTabContent: {
      alignItems: "center",
      gap: 1,
      justifyContent: "center",
    },
    sideTabText: {
      color: "#FFFFFF",
      fontFamily: Fonts.rounded,
      fontSize: isNarrowPhone ? 8 : isPortableLayout ? 9 : 10,
      fontWeight: "900",
      maxWidth: isNarrowPhone ? 50 : isPortableLayout ? 58 : 66,
      textAlign: "center",
    },
    playTabText: {
      color: "#7C2EF2",
      fontFamily: Fonts.rounded,
      fontSize: isNarrowPhone ? 18 : isPortableLayout ? 20 : 25,
      fontWeight: "900",
    },
    rewardTabButton: {
      backgroundColor: "#FFE870",
      borderColor: "#F5C542",
    },
    tabButtonFocused: {
      transform: [{ translateY: -3 }],
    },
    tabBarItem: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      maxWidth: isPortableLayout ? 148 : 172,
      minWidth: isPortableLayout ? 82 : 104,
      paddingTop: 0,
    },
    hiddenTabBarItem: {
      display: "none",
      height: 0,
      width: 0,
    },
    tabBarLabel: {
      fontFamily: Fonts.rounded,
      fontSize: 12,
      fontWeight: "800",
      marginBottom: 4,
    },
  });
}
