import { Redirect, Stack, usePathname } from "expo-router";

import { AppLoadingScreen } from "@/components/common/app-loading-screen";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { SYSTEM_COPY } from "@/src/content/system";
import { APP_ROUTES } from "@/src/navigation/routes";
import { canAccessAdminRoute } from "@/src/services/adminAccessService";

export default function AuthLayout() {
  const { loading, profile, user } = useCurrentUserProfile();
  const pathname = usePathname();

  if (loading) {
    return <AppLoadingScreen message={SYSTEM_COPY.authLoading} />;
  }

  if (user && !(user.isLocalLearner && pathname.endsWith("/online"))) {
    return (
      <Redirect
        href={
          canAccessAdminRoute(profile)
            ? (APP_ROUTES.admin.dashboard as never)
            : APP_ROUTES.tabs.play
        }
      />
    );
  }

  return <Stack screenOptions={{ animation: "slide_from_right", headerShown: false }} />;
}
