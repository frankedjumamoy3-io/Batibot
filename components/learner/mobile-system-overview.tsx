import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";

import { AnimatedButton } from "@/components/animation/animated-button";
import { AnimatedLearningNode } from "@/components/animation/animated-learning-node";
import { AnimatedScreenWrapper } from "@/components/animation/animated-screen-wrapper";
import { Fonts, type AppTheme, createThemedStyles } from "@/constants/theme";
import {
  LEARNER_PHASES,
  getLearnerPhase,
  getLearnerPhaseIndex,
  getNextLearnerPhase,
  type LearnerPhaseId,
} from "@/src/content/learner-phases";
import { useUserSettings } from "@/src/store/user-settings";

const REVISION_POINTS = [
  "Preschool to Grade 3 curriculum targeting",
  "Three-tab Play, Rank, and Reward learner journey",
  "Learn and Quiz activities fused into the Play map",
  "Reanimated touch, progress, and transition feedback",
  "Admin-reviewed AI quiz drafts before publishing",
] as const;

export function MobileSystemOverview({
  current,
  showHighlights = false,
}: {
  current: LearnerPhaseId;
  showHighlights?: boolean;
}) {
  const { theme } = useUserSettings();
  const styles = createStyles(theme);
  const currentPhase = getLearnerPhase(current);
  const nextPhase = getNextLearnerPhase(current);
  const currentPhaseIndex = getLearnerPhaseIndex(current);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: `${currentPhase.accent}14`,
              borderColor: `${currentPhase.accent}34`,
            },
          ]}
        >
          <Ionicons name="phone-portrait" size={15} color={currentPhase.accent} />
          <Text style={[styles.badgeText, { color: currentPhase.accent }]}>
            Phase {currentPhase.phase} of {LEARNER_PHASES.length}
          </Text>
        </View>
        <Text style={styles.title}>Mobile learning map</Text>
        <Text style={styles.subtitle}>
          Play lessons and quizzes, climb the rank board, and collect rewards through one guided mobile journey.
        </Text>
      </View>

      <View style={[styles.phaseCard, { borderColor: `${currentPhase.accent}36` }]}>
        <View style={[styles.phaseIconWrap, { backgroundColor: currentPhase.accent }]}>
          <Ionicons name={currentPhase.focusedIcon} size={22} color="#FFFFFF" />
        </View>
        <View style={styles.phaseCopy}>
          <Text style={[styles.phaseEyebrow, { color: currentPhase.accent }]}>
            Current phase: {currentPhase.status}
          </Text>
          <Text style={styles.phaseTitle}>{currentPhase.title}</Text>
          <Text style={styles.phaseText}>{currentPhase.goal}</Text>
        </View>
      </View>

      <View style={styles.pathRow}>
        {LEARNER_PHASES.map((phase, index) => {
          const isActive = phase.id === current;
          const isPastCurrent = currentPhaseIndex >= index;

          return (
            <View key={phase.id} style={styles.pathStep}>
              {index > 0 ? (
                <View
                  style={[
                    styles.pathConnector,
                    isPastCurrent && { backgroundColor: phase.accent },
                  ]}
                />
              ) : null}
              <AnimatedLearningNode
                active={isActive}
                onPress={() => router.push(phase.route)}
                style={[
                  styles.pathNode,
                  {
                    backgroundColor: isActive ? phase.accent : `${phase.accent}18`,
                    borderColor: isActive ? "#FFFFFF" : `${phase.accent}34`,
                  },
                ]}
              >
                <Ionicons
                  name={isActive ? phase.focusedIcon : phase.defaultIcon}
                  size={18}
                  color={isActive ? "#FFFFFF" : phase.accent}
                />
              </AnimatedLearningNode>
              <Text
                numberOfLines={1}
                style={[
                  styles.pathLabel,
                  isActive && { color: phase.accent },
                ]}
              >
                {phase.status}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.grid}>
        {LEARNER_PHASES.map((phase, index) => {
          const isActive = phase.id === current;

          return (
            <AnimatedScreenWrapper key={phase.id} delay={index * 18}>
              <AnimatedButton
                style={[
                  styles.card,
                  isActive && {
                    borderColor: phase.accent,
                    backgroundColor: `${phase.accent}12`,
                  },
                ]}
                onPress={() => router.push(phase.route)}
              >
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.iconWrap,
                      { backgroundColor: isActive ? phase.accent : `${phase.accent}18` },
                    ]}
                  >
                    <Ionicons
                      name={isActive ? phase.focusedIcon : phase.defaultIcon}
                      size={22}
                      color={isActive ? "#FFFFFF" : phase.accent}
                    />
                  </View>
                  <View style={styles.cardCopy}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.cardTitle}>{phase.title}</Text>
                      {isActive ? (
                        <View style={[styles.activePill, { backgroundColor: phase.accent }]}>
                          <Text style={styles.activePillText}>Current</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.cardText}>{phase.subtitle}</Text>
                  </View>
                </View>
                <View style={[styles.statusPill, { backgroundColor: phase.accent }]}>
                  <Text style={styles.statusText}>Phase {phase.phase}: {phase.status}</Text>
                </View>
              </AnimatedButton>
            </AnimatedScreenWrapper>
          );
        })}
      </View>

      <AnimatedButton
        style={[styles.nextPhaseCard, { borderColor: `${nextPhase.accent}38` }]}
        onPress={() => router.push(nextPhase.route)}
      >
        <View style={[styles.nextPhaseIcon, { backgroundColor: `${nextPhase.accent}18` }]}>
          <Ionicons name={nextPhase.focusedIcon} size={20} color={nextPhase.accent} />
        </View>
        <View style={styles.nextPhaseCopy}>
          <Text style={[styles.nextPhaseEyebrow, { color: nextPhase.accent }]}>
            Next guided step
          </Text>
          <Text style={styles.nextPhaseTitle}>
            Phase {nextPhase.phase}: {nextPhase.title}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={nextPhase.accent} />
      </AnimatedButton>

      {showHighlights ? (
        <View style={styles.highlights}>
          <Text style={styles.highlightsTitle}>Revision highlights</Text>
          {REVISION_POINTS.map((point) => (
            <View key={point} style={styles.highlightRow}>
              <View style={styles.highlightDot} />
              <Text style={styles.highlightText}>{point}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return createThemedStyles(theme, {
    activePill: {
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    activePillText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    badge: {
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: theme.learning.home.soft,
      borderColor: theme.learning.home.border,
      borderRadius: 999,
      borderWidth: 1,
      flexDirection: "row",
      gap: 7,
      paddingHorizontal: 11,
      paddingVertical: 7,
    },
    badgeText: {
      color: theme.learning.home.deep,
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    card: {
      ...theme.shadow,
      backgroundColor: theme.isDark ? theme.colors.surface : "rgba(255,255,255,0.96)",
      borderBottomWidth: 4,
      borderColor: theme.learning.home.border,
      borderRadius: 22,
      borderWidth: 1,
      gap: 12,
      padding: 15,
    },
    cardCopy: {
      flex: 1,
      gap: 4,
    },
    cardHeader: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
    },
    cardText: {
      color: theme.colors.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
    cardTitle: {
      color: theme.colors.text,
      flex: 1,
      fontFamily: Fonts.rounded,
      fontSize: 17,
      fontWeight: "900",
    },
    cardTitleRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
    },
    grid: {
      gap: 12,
    },
    header: {
      gap: 8,
    },
    highlightDot: {
      backgroundColor: theme.learning.home.accent,
      borderRadius: 999,
      height: 8,
      marginTop: 6,
      width: 8,
    },
    highlightRow: {
      flexDirection: "row",
      gap: 10,
    },
    highlightText: {
      color: theme.colors.textMuted,
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
    },
    highlights: {
      ...theme.shadow,
      backgroundColor: theme.isDark ? theme.colors.surface : "rgba(255,255,255,0.94)",
      borderBottomWidth: 4,
      borderColor: theme.learning.home.border,
      borderRadius: 22,
      borderWidth: 1,
      gap: 12,
      padding: 16,
    },
    highlightsTitle: {
      color: theme.colors.text,
      fontFamily: Fonts.rounded,
      fontSize: 18,
      fontWeight: "900",
    },
    iconWrap: {
      alignItems: "center",
      borderRadius: 18,
      height: 48,
      justifyContent: "center",
      width: 48,
    },
    nextPhaseCard: {
      ...theme.shadow,
      alignItems: "center",
      backgroundColor: theme.isDark ? theme.colors.surface : "rgba(255,255,255,0.96)",
      borderBottomWidth: 4,
      borderRadius: 20,
      borderWidth: 1,
      flexDirection: "row",
      gap: 12,
      padding: 14,
    },
    nextPhaseCopy: {
      flex: 1,
      gap: 2,
    },
    nextPhaseEyebrow: {
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    nextPhaseIcon: {
      alignItems: "center",
      borderRadius: 16,
      height: 42,
      justifyContent: "center",
      width: 42,
    },
    nextPhaseTitle: {
      color: theme.colors.text,
      fontFamily: Fonts.rounded,
      fontSize: 16,
      fontWeight: "900",
    },
    phaseCard: {
      ...theme.shadow,
      alignItems: "center",
      backgroundColor: theme.isDark ? theme.colors.surface : "rgba(255,255,255,0.96)",
      borderBottomWidth: 4,
      borderRadius: 22,
      borderWidth: 1,
      flexDirection: "row",
      gap: 12,
      padding: 15,
    },
    phaseCopy: {
      flex: 1,
      gap: 3,
    },
    phaseEyebrow: {
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    phaseIconWrap: {
      alignItems: "center",
      borderColor: "rgba(255,255,255,0.78)",
      borderRadius: 18,
      borderWidth: 2,
      height: 50,
      justifyContent: "center",
      width: 50,
    },
    phaseText: {
      color: theme.colors.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
    phaseTitle: {
      color: theme.colors.text,
      fontFamily: Fonts.rounded,
      fontSize: 19,
      fontWeight: "900",
    },
    pathConnector: {
      backgroundColor: theme.colors.border,
      borderRadius: 999,
      height: 4,
      left: "-50%",
      position: "absolute",
      right: "50%",
      top: 22,
      zIndex: 0,
    },
    pathLabel: {
      color: theme.colors.textMuted,
      fontSize: 10,
      fontWeight: "900",
      marginTop: 6,
      textAlign: "center",
    },
    pathNode: {
      alignItems: "center",
      borderRadius: 999,
      borderWidth: 2,
      height: 44,
      justifyContent: "center",
      width: 44,
      zIndex: 2,
    },
    pathRow: {
      ...theme.shadow,
      backgroundColor: theme.isDark ? theme.colors.surface : "rgba(255,255,255,0.94)",
      borderBottomWidth: 4,
      borderColor: theme.colors.border,
      borderRadius: 22,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      paddingVertical: 14,
    },
    pathStep: {
      alignItems: "center",
      flex: 1,
      position: "relative",
    },
    section: {
      gap: 14,
    },
    statusPill: {
      alignSelf: "flex-start",
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    statusText: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    title: {
      color: theme.colors.text,
      fontFamily: Fonts.rounded,
      fontSize: 22,
      fontWeight: "900",
    },
  });
}
