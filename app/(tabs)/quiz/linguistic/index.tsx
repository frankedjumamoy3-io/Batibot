import { Redirect } from "expo-router";

export default function LegacyLinguisticQuizRoute() {
  return <Redirect href="/(tabs)/quiz?category=linguistic" />;
}
