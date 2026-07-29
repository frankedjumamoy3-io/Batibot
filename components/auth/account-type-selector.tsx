import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { AUTH_SCREEN_COPY } from "@/src/screens/auth/auth.content";
import { authFormStyles as styles } from "@/src/screens/auth/auth-form.styles";

export type AuthAccountType = "learner" | "admin";

export function AccountTypeSelector({
  value,
  onChange,
}: {
  value: AuthAccountType;
  onChange: (value: AuthAccountType) => void;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{AUTH_SCREEN_COPY.accountType.title}</Text>
      <View style={styles.accountTypeRow}>
        <Pressable
          onPress={() => onChange("learner")}
          style={[
            styles.accountTypeButton,
            value === "learner" && styles.accountTypeButtonActive,
          ]}
        >
          <Ionicons
            name="school-outline"
            size={17}
            color={value === "learner" ? "#FFFFFF" : "#0F766E"}
          />
          <Text
            style={[
              styles.accountTypeText,
              value === "learner" && styles.accountTypeTextActive,
            ]}
          >
            {AUTH_SCREEN_COPY.accountType.learner}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onChange("admin")}
          style={[
            styles.accountTypeButton,
            value === "admin" && styles.accountTypeButtonActive,
          ]}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={17}
            color={value === "admin" ? "#FFFFFF" : "#0F766E"}
          />
          <Text
            style={[
              styles.accountTypeText,
              value === "admin" && styles.accountTypeTextActive,
            ]}
          >
            {AUTH_SCREEN_COPY.accountType.admin}
          </Text>
        </Pressable>
      </View>
      {value === "admin" ? (
        <Text style={styles.accountTypeHelp}>
          {AUTH_SCREEN_COPY.accountType.adminHint}
        </Text>
      ) : null}
    </View>
  );
}
