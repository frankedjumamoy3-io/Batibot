import { ActivityIndicator, Text, View } from "react-native";

import { useUserSettings } from "@/src/store/user-settings";

import { createAppLoadingScreenStyles } from "./app-loading-screen.styles";

interface AppLoadingScreenProps {
  message: string;
}

export function AppLoadingScreen({ message }: AppLoadingScreenProps) {
  const { theme } = useUserSettings();
  const styles = createAppLoadingScreenStyles(theme);

  return (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}
