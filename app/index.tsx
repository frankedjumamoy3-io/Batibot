import { Redirect } from "expo-router";

import { AppLoadingScreen } from "@/components/common/app-loading-screen";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { SYSTEM_COPY } from "@/src/content/system";
import { APP_ROUTES } from "@/src/navigation/routes";
import { canAccessAdminRoute } from "@/src/services/adminAccessService";

export default function Index() {
  const { loading, profile, user } = useCurrentUserProfile();

  if (loading) {
    return <AppLoadingScreen message={SYSTEM_COPY.rootLoading} />;
  }

  return (
    <Redirect
      href={
        user
          ? canAccessAdminRoute(profile)
            ? (APP_ROUTES.admin.dashboard as never)
            : APP_ROUTES.tabs.play
          : APP_ROUTES.auth.signup
      }
    />
  );
}
