import { StyleSheet, Text, View } from "react-native";

import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { isTestAccountModeAvailable } from "@/src/services/testAccountService";

export function TestModeBadge() {
  const { profile, user } = useCurrentUserProfile();

  if (profile?.isTestAccount !== true || !isTestAccountModeAvailable(profile, user)) {
    return null;
  }

  return (
    <View style={[styles.badge, { pointerEvents: "none" }]}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.title}>
        TEST MODE
      </Text>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.meta}>
        {profile.gradeLevel ?? "Preview"} |{" "}
        {profile.unlockMode === "normal_locked" ? "Locked preview" : "All unlocked"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
    borderRadius: 14,
    borderWidth: 2,
    bottom: 104,
    left: 12,
    maxWidth: 190,
    paddingHorizontal: 10,
    paddingVertical: 7,
    position: "absolute",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 7,
  },
  meta: {
    color: "#92400E",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 1,
  },
  title: {
    color: "#78350F",
    fontSize: 12,
    fontWeight: "900",
  },
});
