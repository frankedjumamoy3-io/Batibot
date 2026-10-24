import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import {
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppLoadingScreen } from "@/components/common/app-loading-screen";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { SYSTEM_COPY } from "@/src/content/system";
import { APP_ROUTES } from "@/src/navigation/routes";
import { HIDDEN_TAB_SCREENS, VISIBLE_TAB_SCREENS } from "@/src/navigation/tab-config";
import { createTabLayoutStyles } from "@/src/navigation/tab-layout.styles";
import { canAccessAdminRoute } from "@/src/services/adminAccessService";
import { TabScrollProvider } from "@/src/store/tab-scroll";
import { useUserSettings } from "@/src/store/user-settings";

function isTabBarHidden(tabBarStyle: unknown): boolean {
  if (!tabBarStyle) {
    return false;
  }

  if (Array.isArray(tabBarStyle)) {
    return tabBarStyle.some((style) => isTabBarHidden(style));
  }

  if (typeof tabBarStyle === "object") {
    return "display" in tabBarStyle && tabBarStyle.display === "none";
  }

  return false;
}

export default function TabLayout() {
  const { loading, profile, user } = useCurrentUserProfile();
  const { theme } = useUserSettings();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isPortableLayout = width < 1024;
  const styles = createTabLayoutStyles(theme, {
    bottomInset: insets.bottom,
    isPortableLayout,
    screenWidth: width,
  });

  if (loading) {
    return <AppLoadingScreen message={SYSTEM_COPY.tabsLoading} />;
  }

  if (!user) {
    return <Redirect href={APP_ROUTES.auth.login} />;
  }

  if (canAccessAdminRoute(profile)) {
    return <Redirect href={APP_ROUTES.admin.dashboard} />;
  }

  return (
    <View style={styles.root}>
      <TabScrollProvider>
          <Tabs
            tabBar={({ descriptors, navigation, state }) => {
              const focusedRoute = state.routes[state.index];
              const focusedOptions = focusedRoute
                ? descriptors[focusedRoute.key]?.options
                : undefined;
              const focusedRouteParams = focusedRoute?.params as
                | Record<string, unknown>
                | undefined;

              if (
                isTabBarHidden(focusedOptions?.tabBarStyle) ||
                focusedRouteParams?.hideTabs === "1"
              ) {
                return null;
              }

              return (
                <View style={[styles.tabBar, { pointerEvents: "box-none" }]}>
                  <View style={styles.tabBarTrack}>
                    {VISIBLE_TAB_SCREENS.map((screen) => {
                      const routeIndex = state.routes.findIndex(
                        (route) => route.name === screen.name
                      );

                      if (routeIndex < 0) {
                        return null;
                      }

                      const route = state.routes[routeIndex];
                      const focused = state.index === routeIndex;
                      const options = descriptors[route.key]?.options;

                      return (
                        <Pressable
                          key={screen.name}
                          accessibilityLabel={
                            options?.tabBarAccessibilityLabel ?? screen.accessibilityLabel
                          }
                          accessibilityRole="button"
                          accessibilityState={focused ? { selected: true } : undefined}
                          onPress={() => {
                            const event = navigation.emit({
                              canPreventDefault: true,
                              target: route.key,
                              type: "tabPress",
                            });

                            if (!focused && !event.defaultPrevented) {
                              navigation.navigate(route.name, route.params);
                            } else if (focused && (screen.name === "play" || screen.title === "Play")) {
                              navigation.navigate(route.name, {
                                ...(route.params as Record<string, unknown> | undefined),
                                autoLaunch: String(Date.now()),
                              });
                            }
                          }}
                          style={styles.tabButtonSlot}
                        >
                          <View
                            style={[
                              styles.tabButton,
                              screen.title === "Rank" && styles.rankTabButton,
                              screen.title === "Play" && styles.playTabButton,
                              screen.title === "Reward" && styles.rewardTabButton,
                              focused && styles.tabButtonFocused,
                            ]}
                          >
                            {screen.title === "Play" ? (
                              <View style={styles.playTabContent}>
                                <Ionicons name="play" size={21} color="#7C2EF2" />
                                <Text style={styles.playTabText}>PLAY</Text>
                              </View>
                            ) : screen.imageIcon ? (
                              <View style={styles.sideTabContent}>
                                <Image
                                  source={screen.imageIcon}
                                  resizeMode="contain"
                                  style={[
                                    styles.tabBarImageIcon,
                                    focused && styles.tabBarImageIconFocused,
                                  ]}
                                />
                                <Text numberOfLines={1} style={styles.sideTabText}>
                                  {screen.title.toUpperCase()}
                                </Text>
                              </View>
                            ) : (
                              <Ionicons
                                name={focused ? screen.focusedIcon : screen.defaultIcon}
                                size={22}
                                color={focused ? "#FFFFFF" : theme.colors.tabMuted}
                              />
                            )}
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            }}
            screenOptions={{
              animation: "fade",
              headerShown: false,
              sceneStyle: { backgroundColor: theme.colors.background },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: theme.colors.tabMuted,
              tabBarShowLabel: false,
              tabBarHideOnKeyboard: true,
              tabBarLabelStyle: styles.tabBarLabel,
              tabBarItemStyle: styles.tabBarItem,
              tabBarStyle: styles.tabBar,
            }}
          >
            {VISIBLE_TAB_SCREENS.map((screen) => (
              <Tabs.Screen
                key={screen.name}
                name={screen.name}
                options={{
              title: screen.title,
              tabBarActiveTintColor: screen.activeColor,
              tabBarAccessibilityLabel: screen.accessibilityLabel,
                }}
              />
            ))}

            {HIDDEN_TAB_SCREENS.map((routeName) => (
              <Tabs.Screen
                key={routeName}
                name={routeName}
                options={{
                  tabBarButton: () => null,
                  tabBarItemStyle: styles.hiddenTabBarItem,
                }}
              />
            ))}
          </Tabs>
      </TabScrollProvider>
    </View>
  );
}
