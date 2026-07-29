import { Redirect } from "expo-router";

export default function LegacyNumericQuizRoute() {
  return <Redirect href="/(tabs)/quiz?category=numeric" />;
}
