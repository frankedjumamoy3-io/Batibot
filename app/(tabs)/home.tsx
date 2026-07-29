import { Redirect } from "expo-router";

import { APP_ROUTES } from "@/src/navigation/routes";

export default function LegacyHomeRedirect() {
  return <Redirect href={APP_ROUTES.tabs.play} />;
}
