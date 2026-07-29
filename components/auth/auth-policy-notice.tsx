import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { AUTH_POLICY_DOCUMENTS } from "@/src/screens/auth/auth.content";
import { authFormStyles as styles } from "@/src/screens/auth/auth-form.styles";

type AuthPolicyKey = keyof typeof AUTH_POLICY_DOCUMENTS;

interface AuthPolicyNoticeProps {
  action: "logging in" | "signing up";
}

export function AuthPolicyNotice({ action }: AuthPolicyNoticeProps) {
  const [activePolicy, setActivePolicy] = useState<AuthPolicyKey | null>(null);
  const document = activePolicy ? AUTH_POLICY_DOCUMENTS[activePolicy] : null;

  return (
    <>
      <Text style={styles.policyNotice}>
        By {action}, you agree to {"BatiBot's "}
        <Text
          accessibilityRole="link"
          onPress={() => setActivePolicy("privacy")}
          style={styles.policyLink}
        >
          Privacy Policy
        </Text>{" "}
        and{" "}
        <Text
          accessibilityRole="link"
          onPress={() => setActivePolicy("policies")}
          style={styles.policyLink}
        >
          App Policies
        </Text>
        .
      </Text>

      <Modal
        animationType="fade"
        onRequestClose={() => setActivePolicy(null)}
        transparent
        visible={document !== null}
      >
        <View style={styles.policyModalBackdrop}>
          <View style={styles.policyModalCard}>
            <View style={styles.policyModalHeader}>
              <Text style={styles.policyModalTitle}>{document?.title}</Text>
              <Pressable
                accessibilityLabel="Close policy"
                onPress={() => setActivePolicy(null)}
                style={styles.policyModalCloseIcon}
              >
                <Ionicons name="close" size={22} color="#334155" />
              </Pressable>
            </View>

            <Text style={styles.policyModalSubtitle}>{document?.subtitle}</Text>

            <ScrollView
              contentContainerStyle={{ paddingBottom: 4 }}
              showsVerticalScrollIndicator={false}
              style={styles.policyModalBody}
            >
              <Text style={styles.policyUpdated}>Last updated: May 20, 2026</Text>

              {document?.sections.map((section) => (
                <View key={section.title} style={styles.policyModalSection}>
                  <Text style={styles.policyModalSectionTitle}>{section.title}</Text>
                  <Text style={styles.policyModalSectionBody}>{section.body}</Text>
                </View>
              ))}
            </ScrollView>

            <Pressable
              onPress={() => setActivePolicy(null)}
              style={styles.policyModalClose}
            >
              <Text style={styles.policyModalCloseText}>I Understand</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
