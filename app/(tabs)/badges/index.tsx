import { Redirect } from "expo-router";

import { APP_ROUTES } from "@/src/navigation/routes";

export default function LegacyBadgesRedirect() {
  return <Redirect href={APP_ROUTES.tabs.reward} />;
}
