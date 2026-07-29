import { Redirect, useLocalSearchParams } from "expo-router";

import { APP_ROUTES } from "@/src/navigation/routes";

export default function LegacyBadgeDetailRedirect() {
  const params = useLocalSearchParams();

  return (
    <Redirect
      href={{
        pathname: APP_ROUTES.tabs.rewardDetail,
        params,
      }}
    />
  );
}
