import { Redirect, Stack, useSegments } from "expo-router";
import { USE_NODE_BACKEND } from "@/src/config/backend";

import { AppLoadingScreen } from "@/components/common/app-loading-screen";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { APP_ROUTES } from "@/src/navigation/routes";
import { canAccessAdminRoute } from "@/src/services/adminAccessService";
import { LearnerProgressProvider } from "@/src/presentation/state/learner-progress-provider";

export default function AdminLayout() {
  const segments = useSegments();
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

  if (USE_NODE_BACKEND && segments.length > 1) {
    return <Redirect href={APP_ROUTES.admin.dashboard} />;
  }

  return (
    <LearnerProgressProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </LearnerProgressProvider>
  );
}
