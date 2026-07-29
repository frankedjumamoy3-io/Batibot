import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Fonts, type AppTheme, createThemedStyles } from "@/constants/theme";
import { getLearnerRewardById } from "@/src/data/learner-dashboard";
import { APP_ROUTES } from "@/src/navigation/routes";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { useLearnerProgress } from "@/src/presentation/state/learner-progress-provider";
import { useUserSettings } from "@/src/store/user-settings";

function getStringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getStatusLabel(status: string) {
  if (status === "unlocked") {
    return "Unlocked";
  }

  if (status === "in-progress") {
    return "In progress";
  }

  return "Locked";
}

function getStatusIcon(status: string): keyof typeof Ionicons.glyphMap {
  if (status === "unlocked") {
    return "checkmark-circle";
  }

  if (status === "in-progress") {
    return "time-outline";
  }

  return "lock-closed-outline";
}

export default function RewardDetail() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    kind?: string | string[];
    status?: string | string[];
  }>();
  const { progress } = useLearnerProgress();
  const { profile } = useCurrentUserProfile();
  const { theme } = useUserSettings();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const rewardId = getStringParam(params.id);
  const requestedStatus = getStringParam(params.status);
  const reward = getLearnerRewardById(rewardId, progress, profile?.gradeLevel);
  const status = reward?.status ?? requestedStatus ?? "locked";
  const statusLabel = getStatusLabel(status);
  const statusIcon = getStatusIcon(status);

  function returnToRewardsTab() {
    router.replace(APP_ROUTES.tabs.reward);
  }

  if (!reward) {
    return (
      <View style={styles.emptyScreen}>
        <Stack.Screen
          options={{
            headerBackVisible: false,
            headerLeft: () => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to rewards"
                onPress={returnToRewardsTab}
              >
                <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
              </Pressable>
            ),
            headerShown: true,
            title: "Reward",
          }}
        />
        <Ionicons name="ribbon-outline" size={28} color={theme.colors.textSoft} />
        <Text style={styles.emptyTitle}>Reward not found</Text>
        <Text style={styles.emptyText}>This reward is not available for this learner path.</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to rewards"
          onPress={returnToRewardsTab}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to rewards"
              onPress={returnToRewardsTab}
            >
              <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
            </Pressable>
          ),
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
            fontWeight: "800",
          },
          title: reward.title,
        }}
      />

      <View style={[styles.heroPanel, { backgroundColor: reward.accentColor }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to rewards"
          onPress={returnToRewardsTab}
          style={styles.inlineBackButton}
        >
          <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
          <Text style={styles.inlineBackText}>Rewards</Text>
        </Pressable>

        <View style={styles.heroIcon}>
          <Ionicons name={reward.icon as never} size={54} color={reward.accentColor} />
        </View>
        <Text style={styles.kindLabel}>{reward.sourceLabel}</Text>
        <Text style={styles.heroTitle}>{reward.title}</Text>
        <View style={styles.statusPill}>
          <Ionicons name={statusIcon} size={16} color="#FFFFFF" />
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelEyebrow}>Why It Matters</Text>
        <Text style={styles.description}>{reward.description}</Text>
      </View>

      <View style={styles.panel}>
        <View style={styles.progressHeader}>
          <Text style={styles.panelEyebrow}>Progress</Text>
          <Text style={[styles.progressValue, { color: reward.accentColor }]}>
            {reward.completed}/{reward.total}
          </Text>
        </View>
        <View
          accessibilityRole="progressbar"
          accessibilityLabel={`${reward.title} progress ${reward.percentage} percent`}
          style={styles.progressTrack}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: reward.accentColor,
                width: `${reward.percentage}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressPercent}>{reward.percentage}% complete</Text>
      </View>

      {reward.requiredWords.length ? (
        <View style={styles.panel}>
          <Text style={styles.panelEyebrow}>Words To Try</Text>
          <View style={styles.wordChipWrap}>
            {reward.requiredWords.map((word) => (
              <View
                key={word.id}
                style={[
                  styles.wordChip,
                  word.viewed ? styles.wordChipViewed : styles.wordChipLocked,
                ]}
              >
                <Ionicons
                  name={word.viewed ? "checkmark-circle" : "lock-closed-outline"}
                  size={15}
                  color={word.viewed ? theme.colors.primary : theme.colors.textSoft}
                />
                <Text
                  style={[
                    styles.wordChipText,
                    word.viewed ? styles.wordChipTextViewed : styles.wordChipTextLocked,
                  ]}
                >
                  {word.word}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.panel}>
        <Text style={styles.panelEyebrow}>How To Unlock</Text>
        <View style={styles.requirementList}>
          {reward.requirementText.length ? (
            reward.requirementText.map((requirement) => (
              <View key={requirement} style={styles.requirementRow}>
                <Ionicons
                  name={reward.unlocked ? "checkmark-circle" : "ellipse-outline"}
                  size={15}
                  color={reward.unlocked ? reward.accentColor : theme.colors.textSoft}
                />
                <Text style={styles.requirementText}>{requirement}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.requirementText}>Play and keep learning to unlock this reward.</Text>
          )}
        </View>
      </View>

      <View style={styles.playPanel}>
        <Ionicons name="play" size={20} color="#6B21F2" />
        <Text style={styles.playPanelText}>
          Connected to Play progress, mastery, XP, stars, and streak.
        </Text>
      </View>
    </ScrollView>
  );
}

function createStyles(theme: AppTheme) {
  return createThemedStyles(theme, {
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      gap: 14,
      padding: 20,
      paddingBottom: 148,
    },
    heroPanel: {
      ...theme.shadow,
      alignItems: "center",
      borderRadius: 22,
      gap: 10,
      padding: 20,
    },
    inlineBackButton: {
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: "rgba(255,255,255,0.18)",
      borderRadius: 999,
      flexDirection: "row",
      gap: 4,
      minHeight: 40,
      paddingHorizontal: 10,
      paddingVertical: 7,
    },
    inlineBackText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "900",
    },
    heroIcon: {
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 28,
      height: 96,
      justifyContent: "center",
      marginTop: 2,
      width: 96,
    },
    kindLabel: {
      color: "rgba(255,255,255,0.82)",
      fontSize: 12,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    heroTitle: {
      color: "#FFFFFF",
      fontFamily: Fonts.rounded,
      fontSize: 25,
      fontWeight: "900",
      textAlign: "center",
    },
    statusPill: {
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.18)",
      borderRadius: 999,
      flexDirection: "row",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    statusText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    panel: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 18,
      borderWidth: 1,
      padding: 16,
    },
    panelEyebrow: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: "900",
      marginBottom: 8,
      textTransform: "uppercase",
    },
    description: {
      color: theme.colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "700",
    },
    progressHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    progressValue: {
      fontSize: 16,
      fontWeight: "900",
    },
    progressPercent: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "800",
      marginTop: 7,
    },
    progressTrack: {
      backgroundColor: "#E6EDF5",
      borderRadius: 999,
      height: 12,
      marginTop: 2,
      overflow: "hidden",
    },
    progressFill: {
      borderRadius: 999,
      height: "100%",
    },
    wordChipWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    wordChip: {
      alignItems: "center",
      borderRadius: 999,
      flexDirection: "row",
      gap: 6,
      minHeight: 36,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    wordChipViewed: {
      backgroundColor: theme.colors.surfaceMint,
    },
    wordChipLocked: {
      backgroundColor: theme.colors.surfaceSoft,
    },
    wordChipText: {
      fontSize: 12,
      fontWeight: "800",
    },
    wordChipTextViewed: {
      color: theme.colors.primaryDark,
    },
    wordChipTextLocked: {
      color: theme.colors.textSoft,
    },
    requirementList: {
      gap: 8,
    },
    requirementRow: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: 8,
    },
    requirementText: {
      color: theme.colors.textMuted,
      flex: 1,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 19,
    },
    playPanel: {
      alignItems: "center",
      backgroundColor: "#F5F3FF",
      borderColor: "#DDD6FE",
      borderRadius: 18,
      borderWidth: 1,
      flexDirection: "row",
      gap: 10,
      padding: 14,
    },
    playPanelText: {
      color: "#44239A",
      flex: 1,
      fontSize: 13,
      fontWeight: "900",
      lineHeight: 18,
    },
    emptyScreen: {
      alignItems: "center",
      backgroundColor: theme.colors.background,
      flex: 1,
      justifyContent: "center",
      padding: 24,
    },
    emptyTitle: {
      color: theme.colors.text,
      fontFamily: Fonts.rounded,
      fontSize: 20,
      fontWeight: "900",
      marginTop: 10,
    },
    emptyText: {
      color: theme.colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
      marginTop: 6,
      textAlign: "center",
    },
    backButton: {
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: 999,
      flexDirection: "row",
      gap: 4,
      marginTop: 16,
      minHeight: 44,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    backButtonText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "900",
    },
  });
}
