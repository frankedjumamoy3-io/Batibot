import { Redirect, Stack } from "expo-router";

import { AppLoadingScreen } from "@/components/common/app-loading-screen";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { APP_ROUTES } from "@/src/navigation/routes";
import { canAccessAdminRoute } from "@/src/services/adminAccessService";
import { LearnerProgressProvider } from "@/src/presentation/state/learner-progress-provider";

export default function AdminLayout() {
  const { loading, profile, user } = useCurrentUserProfile();

  if (loading) {
    return <AppLoadingScreen message="Loading admin workspace..." />;
  }

  if (!user) {
    return <Redirect href={APP_ROUTES.auth.login} />;
  }

  if (!canAccessAdminRoute(profile)) {
    return <Redirect href={APP_ROUTES.tabs.play} />;
  }


  return (
    <LearnerProgressProvider>
      <Stack screenOptions={{ animation: "slide_from_right", headerShown: false }} />
    </LearnerProgressProvider>
  );
}
