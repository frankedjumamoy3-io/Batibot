import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { AuthScreenShell } from "@/components/auth/auth-screen-shell";
import {
  AUTH_SCREEN_COPY,
  AUTH_VALIDATION_MESSAGES,
  isValidEmail,
} from "@/src/screens/auth/auth.content";
import { authFormStyles as styles } from "@/src/screens/auth/auth-form.styles";
import { APP_ROUTES } from "@/src/navigation/routes";
import { requestPasswordReset } from "@/src/presentation/viewmodels/auth-actions";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const isDisabled = useMemo(() => {
    return !email.trim() || loading;
  }, [email, loading]);

  const handleReset = async () => {
    if (!isValidEmail(email)) {
      Alert.alert(
        AUTH_VALIDATION_MESSAGES.invalidEmail.title,
        AUTH_VALIDATION_MESSAGES.invalidEmail.message
      );
      return;
    }

    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccessMessage(AUTH_SCREEN_COPY.forgotPassword.successBody);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : AUTH_VALIDATION_MESSAGES.resetFallbackError;
      Alert.alert(AUTH_SCREEN_COPY.forgotPassword.resetFailedTitle, message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenShell
      badge={AUTH_SCREEN_COPY.forgotPassword.badge}
      title={AUTH_SCREEN_COPY.forgotPassword.shellTitle}
      subtitle={AUTH_SCREEN_COPY.forgotPassword.shellSubtitle}
    >
      <View style={styles.header}>
        <Text style={styles.heading}>{AUTH_SCREEN_COPY.forgotPassword.header}</Text>
        <Text style={styles.supportingText}>{AUTH_SCREEN_COPY.forgotPassword.supporting}</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{AUTH_SCREEN_COPY.forgotPassword.emailLabel}</Text>
        <View style={styles.inputRow}>
          <Ionicons name="mail-open-outline" size={18} color="#0F766E" />
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (successMessage) {
                setSuccessMessage("");
              }
            }}
          />
        </View>
      </View>

      {successMessage ? (
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>{AUTH_SCREEN_COPY.forgotPassword.successTitle}</Text>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}

      <Pressable
        style={[
          styles.primaryButton,
          { backgroundColor: "#D97706" },
          isDisabled && styles.buttonDisabled,
        ]}
        disabled={isDisabled}
        onPress={handleReset}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>{AUTH_SCREEN_COPY.forgotPassword.button}</Text>
        )}
      </Pressable>

      <Pressable style={styles.secondaryAction} onPress={() => router.push(APP_ROUTES.auth.login)}>
        <Text style={styles.secondaryActionText}>{AUTH_SCREEN_COPY.forgotPassword.backToLogin}</Text>
      </Pressable>
    </AuthScreenShell>
  );
}
