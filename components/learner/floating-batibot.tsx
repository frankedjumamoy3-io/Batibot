import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { usePathname } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Fonts, StudyBuddyShadow, StudyBuddyTheme } from "@/constants/theme";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { getLearnerBadges } from "@/src/data/learner-dashboard";
import { getGradeVocabularyItems } from "@/src/data/learner-module";
import { getLevelFromXP } from "@/src/store/gameStore";
import { useLearnerProgress } from "@/src/presentation/state/learner-progress-provider";
import { useTabScroll } from "@/src/store/tab-scroll";
import { useUserSettings } from "@/src/store/user-settings";

interface BuddyMessage {
  title: string;
  body: string;
  mood: "encourage" | "hint" | "celebrate";
}

interface BuddyVisualTheme {
  action: string;
  actionActive: string;
  body: string;
  icon: keyof typeof Ionicons.glyphMap;
  glow: string;
  shoes: string;
  shell: string;
  shorts: string;
  surface: string;
}

type AvailableVoice = Awaited<ReturnType<typeof Speech.getAvailableVoicesAsync>>[number];

function getSpeechProfile(
  pathname: string,
  mood: BuddyMessage["mood"]
) {
  if (pathname.includes("/vocabulary")) {
    return {
      language: "en-US",
      pitch: mood === "celebrate" ? 1.36 : 1.28,
      rate: 0.88,
    } as const;
  }

  if (pathname.includes("/quiz")) {
    return {
      language: "en-US",
      pitch: mood === "hint" ? 1.24 : 1.32,
      rate: mood === "hint" ? 0.9 : 0.95,
    } as const;
  }

  if (pathname.includes("/progress")) {
    return {
      language: "en-US",
      pitch: 1.22,
      rate: 0.84,
    } as const;
  }

  if (pathname.includes("/badges")) {
    return {
      language: "en-US",
      pitch: 1.4,
      rate: 0.98,
    } as const;
  }

  return {
    language: "en-US",
    pitch: mood === "celebrate" ? 1.4 : 1.34,
    rate: 0.94,
  } as const;
}

function scoreVoiceForBatiBot(voice: AvailableVoice) {
  const voiceName = `${voice.name} ${voice.identifier}`.toLowerCase();

  let score = 0;

  if (voice.language.toLowerCase().startsWith("en")) {
    score += 8;
  }

  if (voice.language.toLowerCase().startsWith("en-us")) {
    score += 4;
  }

  if (voiceName.includes("child") || voiceName.includes("kid") || voiceName.includes("junior")) {
    score += 12;
  }

  if (
    voiceName.includes("ava") ||
    voiceName.includes("allison") ||
    voiceName.includes("samantha") ||
    voiceName.includes("serena") ||
    voiceName.includes("sandy") ||
    voiceName.includes("karen") ||
    voiceName.includes("tessa") ||
    voiceName.includes("veena") ||
    voiceName.includes("zira") ||
    voiceName.includes("aria")
  ) {
    score += 6;
  }

  if (voice.quality === Speech.VoiceQuality.Enhanced) {
    score += 3;
  }

  if (voiceName.includes("male") || voiceName.includes("man") || voiceName.includes("david")) {
    score -= 6;
  }

  return score;
}

function pickBatiBotVoice(voices: AvailableVoice[]) {
  const englishVoices = voices.filter((voice) =>
    voice.language.toLowerCase().startsWith("en")
  );
  const candidates = englishVoices.length ? englishVoices : voices;

  return [...candidates].sort(
    (left, right) => scoreVoiceForBatiBot(right) - scoreVoiceForBatiBot(left)
  )[0];
}

function getFirstName(name: string | null | undefined, email: string | undefined) {
  return name?.trim().split(" ")[0] || email?.split("@")[0] || "friend";
}

function getTabHint(pathname: string, recentWord?: string): BuddyMessage {
  if (pathname.includes("/quiz")) {
    return {
      title: "Quiz hint",
      body:
        "Read the whole question first, whisper each choice, and use the Hint button only after you try on your own.",
      mood: "hint",
    };
  }

  if (pathname.includes("/vocabulary")) {
    return {
      title: "Word hint",
      body: recentWord
        ? `Try looking for another word connected to ${recentWord}, or tap the speaker button to hear the pronunciation again.`
        : "Tap the microphone to search by voice, then open a word card and listen to how it sounds.",
      mood: "hint",
    };
  }

  if (pathname.includes("/progress")) {
    return {
      title: "Progress hint",
      body:
        "A short word activity plus one quiz is a great way to grow your XP and start a streak.",
      mood: "hint",
    };
  }

  if (pathname.includes("/badges")) {
    return {
      title: "Rewards hint",
      body:
        "Open more vocabulary cards and finish quiz sets to unlock your next shiny reward.",
      mood: "hint",
    };
  }

  return {
    title: "Buddy hint",
    body:
      "Try words first, then quizzes, then come back to progress to see how much you grew today.",
    mood: "hint",
  };
}

function getMessageBucketIndex(pathname: string) {
  if (pathname.includes("/vocabulary")) {
    return 1;
  }

  if (pathname.includes("/quiz")) {
    return 2;
  }

  if (pathname.includes("/progress")) {
    return 3;
  }

  if (pathname.includes("/badges")) {
    return 4;
  }

  return 0;
}

function getBuddyVisualTheme(pathname: string): BuddyVisualTheme {
  if (pathname.includes("/vocabulary")) {
    return {
      action: "#2563EB",
      actionActive: "#1D4ED8",
      body: "#2563EB",
      icon: "book",
      glow: "#BEE7FF",
      shoes: "#38BDF8",
      shell: "#38BDF8",
      shorts: "#1E40AF",
      surface: "#E0F2FE",
    };
  }

  if (pathname.includes("/quiz")) {
    return {
      action: "#EA580C",
      actionActive: "#C2410C",
      body: "#F97316",
      icon: "game-controller",
      glow: "#FFD5AF",
      shoes: "#FDBA74",
      shell: "#F97316",
      shorts: "#9A3412",
      surface: "#FFEDD5",
    };
  }

  if (pathname.includes("/progress")) {
    return {
      action: "#7C3AED",
      actionActive: "#6D28D9",
      body: "#8B5CF6",
      icon: "bar-chart",
      glow: "#DDD6FE",
      shoes: "#C4B5FD",
      shell: "#8B5CF6",
      shorts: "#4C1D95",
      surface: "#F3E8FF",
    };
  }

  if (pathname.includes("/badges")) {
    return {
      action: "#D97706",
      actionActive: "#B45309",
      body: "#F59E0B",
      icon: "star",
      glow: "#FDE68A",
      shoes: "#FCD34D",
      shell: "#F59E0B",
      shorts: "#92400E",
      surface: "#FEF3C7",
    };
  }

  return {
    action: StudyBuddyTheme.colors.primary,
    actionActive: StudyBuddyTheme.colors.primaryDark,
    body: "#06C26F",
    icon: "home",
    glow: "#A7F3D0",
    shoes: "#F05A3C",
    shell: StudyBuddyTheme.colors.primary,
    shorts: "#0759B7",
    surface: StudyBuddyTheme.colors.surfaceMint,
  };
}

export function FloatingBatiBot() {
  const pathname = usePathname();
  const { width: screenWidth } = useWindowDimensions();
  const { profile } = useCurrentUserProfile();
  const { progress } = useLearnerProgress();
  const { handleScrollEnd, isTabScrolling } = useTabScroll();
  const { settings, updateSettings } = useUserSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceIdentifier, setVoiceIdentifier] = useState<string | undefined>();
  const [messageIndex, setMessageIndex] = useState(0);
  const [overrideMessage, setOverrideMessage] = useState<BuddyMessage | null>(null);
  const blink = useRef(new Animated.Value(1)).current;
  const handWave = useRef(new Animated.Value(0)).current;
  const lastPathname = useRef<string | null>(null);

  const firstName = getFirstName(profile?.displayName, profile?.email);
  const level = getLevelFromXP(progress.totalXp);
  const earnedBadges = getLearnerBadges(progress).filter((badge) => badge.unlocked).length;
  const lastActivity = progress.recentActivity[0];
  const recentWord = useMemo(() => {
    const recentWordActivity = progress.recentActivity.find(
      (activity) => activity.type === "word"
    );

    return recentWordActivity?.title;
  }, [progress.recentActivity]);
  const recentWordCount = progress.viewedWordIds.length;
  const totalWords = getGradeVocabularyItems(profile?.gradeLevel).length;
  const latestQuizActivity = useMemo(() => {
    return progress.recentActivity.find((activity) => activity.type === "quiz");
  }, [progress.recentActivity]);
  const visualTheme = useMemo(() => getBuddyVisualTheme(pathname), [pathname]);

  const tabAwareTopics = useMemo<BuddyMessage[][]>(() => {
    return [
      [
        {
          title: "Home hello",
          body: `Hi ${firstName}! I am BatiBot today. We can visit words, quizzes, progress, or rewards together.`,
          mood: "encourage",
        },
        {
          title: "Study plan",
          body:
            recentWordCount > 0
              ? `You already explored ${recentWordCount} of ${totalWords} words. A quick quiz next would help your learning click together.`
              : "A great first step is opening a picture word, then trying one gentle quiz right after.",
          mood: "encourage",
        },
        {
          title: "Topic of the day",
          body: recentWord
            ? `Today's chat topic is ${recentWord}. Can you find a matching word or number somewhere else in the app?`
            : "Today's chat topic is colors, animals, numbers, or shapes. Pick one and I will cheer for you.",
          mood: "celebrate",
        },
      ],
      [
        {
          title: "Word time",
          body:
            "Welcome to Words. You can search, tap the microphone, and open picture cards to build your word bank.",
          mood: "encourage",
        },
        {
          title: "Word challenge",
          body: recentWord
            ? `You last explored ${recentWord}. Try finding another word that connects to it and listen to both pronunciations.`
            : "Try choosing one word to read, hear, and say out loud. That helps the new word stick.",
          mood: "hint",
        },
        {
          title: "Vocabulary goal",
          body: `${recentWordCount} of ${totalWords} words explored so far. Every new card helps grow your learning world.`,
          mood: "celebrate",
        },
      ],
      [
        {
          title: "Quiz coach",
          body:
            "Welcome to Quizzes. Pick a ready quiz, read slowly, and try on your own before asking me for a hint.",
          mood: "encourage",
        },
        {
          title: "Quiz strategy",
          body: latestQuizActivity
            ? `Your latest quiz was ${latestQuizActivity.title}. Try another set in the same category while that thinking pattern is still fresh.`
            : "Start with an unlocked quiz that feels easiest, then review locked quiz goals when you are ready for the next one.",
          mood: "hint",
        },
        {
          title: "Quiz cheer",
          body:
            progress.completedQuizIds.length > 0
              ? `You already completed ${progress.completedQuizIds.length} quiz set${progress.completedQuizIds.length === 1 ? "" : "s"}. That is strong practice.`
              : "Your first finished quiz set can give you a nice XP boost today.",
          mood: "celebrate",
        },
      ],
      [
        {
          title: "Growth check",
          body: `You are on level ${level} right now. Small steps still count, and I can already see your progress growing.`,
          mood: "celebrate",
        },
        {
          title: "XP tip",
          body:
            "If you want your progress bar to move faster, try one vocabulary card and one quiz set in the same study session.",
          mood: "hint",
        },
        {
          title: "Streak chat",
          body:
            progress.streak > 0
              ? `Your streak is ${progress.streak} day${progress.streak === 1 ? "" : "s"}. A tiny study session today helps keep it glowing.`
              : "A short session today can start your first learning streak.",
          mood: "encourage",
        },
      ],
      [
        {
          title: "Rewards room",
          body:
            earnedBadges > 0
              ? `You already earned ${earnedBadges} reward${earnedBadges === 1 ? "" : "s"}. I like how your hard work is shining here.`
              : "This is where your hard work turns into rewards. Your first badge is waiting.",
          mood: "celebrate",
        },
        {
          title: "Unlock idea",
          body:
            "Rewards grow when you open more words and finish more quiz sets, so a little practice can unlock something new.",
          mood: "hint",
        },
        {
          title: "Buddy cheer",
          body:
            lastActivity
              ? `Your latest step was ${lastActivity.title}. Every small learning win helps build your next badge.`
              : "Once you start exploring, I will celebrate each new step with you here too.",
          mood: "encourage",
        },
      ],
    ];
  }, [
    earnedBadges,
    firstName,
    lastActivity,
    latestQuizActivity,
    level,
    progress.completedQuizIds.length,
    progress.streak,
    recentWord,
    recentWordCount,
    totalWords,
  ]);

  const fallbackTopics = useMemo<BuddyMessage[]>(() => {
    return [
      {
        title: "Hello!",
        body: `Hi ${firstName}! I am right here if you want a hint, a cheer, or a quick study chat.`,
        mood: "encourage",
      },
    ];
  }, [firstName]);

  const contextMessages = useMemo(() => {
    return tabAwareTopics[getMessageBucketIndex(pathname)] ?? tabAwareTopics[0];
  }, [pathname, tabAwareTopics]);
  const currentMessage =
    overrideMessage ??
    contextMessages[messageIndex] ??
    contextMessages[0] ??
    fallbackTopics[0];
  const speechProfile = useMemo(() => {
    return getSpeechProfile(pathname, currentMessage.mood);
  }, [currentMessage.mood, pathname]);
  const isCompactBuddy = screenWidth < 380;
  const isTinyBuddy = screenWidth < 340;
  const isBuddyVisible = settings.showFloatingBatiBot;
  const scrollScale = isTabScrolling ? 0.72 : 1;
  const buddyScale = isOpen
    ? isCompactBuddy
      ? 0.78
      : 0.86
    : 0.86;
  const handWaveRotation = handWave.interpolate({
    inputRange: [0, 1],
    outputRange: ["-50deg", "-26deg"],
  });

  useEffect(() => {
    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, {
          toValue: 0.18,
          duration: 95,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 105,
          useNativeDriver: true,
        }),
        Animated.delay(800),
      ])
    );

    const handWaveLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(10000),
        Animated.timing(handWave, {
          toValue: 1,
          duration: 170,
          useNativeDriver: true,
        }),
        Animated.timing(handWave, {
          toValue: 0,
          duration: 170,
          useNativeDriver: true,
        }),
        Animated.timing(handWave, {
          toValue: 1,
          duration: 170,
          useNativeDriver: true,
        }),
        Animated.timing(handWave, {
          toValue: 0,
          duration: 170,
          useNativeDriver: true,
        }),
        Animated.timing(handWave, {
          toValue: 1,
          duration: 170,
          useNativeDriver: true,
        }),
        Animated.timing(handWave, {
          toValue: 0,
          duration: 170,
          useNativeDriver: true,
        }),
      ])
    );

    blinkLoop.start();
    handWaveLoop.start();

    return () => {
      blinkLoop.stop();
      handWaveLoop.stop();
    };
  }, [blink, handWave]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadVoices() {
      try {
        const availableVoices = await Speech.getAvailableVoicesAsync();
        const preferredVoice = pickBatiBotVoice(availableVoices);

        if (active) {
          setVoiceIdentifier(preferredVoice?.identifier);
        }
      } catch {
        if (active) {
          setVoiceIdentifier(undefined);
        }
      }
    }

    loadVoices();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const previousPathname = lastPathname.current;
    const bucketIndex = getMessageBucketIndex(pathname);
    const nextMessages = tabAwareTopics[bucketIndex] ?? tabAwareTopics[0];

    if (!nextMessages.length) {
      return;
    }

    if (previousPathname === pathname) {
      return;
    }

    const nextIndex = (bucketIndex + recentWordCount) % nextMessages.length;

    setOverrideMessage(null);
    setMessageIndex(nextIndex);
    lastPathname.current = pathname;
  }, [pathname, recentWordCount, tabAwareTopics]);

  useEffect(() => {
    if (!isTabScrolling || !isOpen) {
      return;
    }

    setIsOpen(false);
  }, [isOpen, isTabScrolling]);

  useEffect(() => {
    if (!voiceEnabled || !isOpen) {
      Speech.stop();
      return;
    }

    Speech.stop();
    Speech.speak(`${currentMessage.title}. ${currentMessage.body}`, {
      ...speechProfile,
      voice: voiceIdentifier,
    });
  }, [
    currentMessage.body,
    currentMessage.title,
    isOpen,
    speechProfile,
    voiceEnabled,
    voiceIdentifier,
  ]);

  function hideBuddy() {
    setIsOpen(false);
    setVoiceEnabled(false);
    updateSettings({ showFloatingBatiBot: false });
  }

  function showBuddy() {
    updateSettings({ showFloatingBatiBot: true });
    handleScrollEnd();
  }

  function showGreeting() {
    setOverrideMessage(contextMessages[0] ?? fallbackTopics[0]);
    setIsOpen(true);
  }

  function showRandomTopic() {
    setOverrideMessage(null);
    setMessageIndex((current) => {
      if (contextMessages.length <= 1) {
        return 0;
      }

      return (current + 1) % contextMessages.length;
    });
    setIsOpen(true);
  }

  function showHint() {
    setOverrideMessage(getTabHint(pathname, recentWord));
    setIsOpen(true);
  }

  function toggleVoice() {
    setVoiceEnabled((current) => {
      const nextValue = !current;

      if (!nextValue) {
        Speech.stop();
      }

      return nextValue;
    });
  }

  if (!isBuddyVisible) {
    return (
      <View style={[styles.wrap, styles.hiddenWrap, { pointerEvents: "box-none" }]}>
        <Pressable
          accessibilityLabel="Show BatiBot buddy"
          onPress={showBuddy}
          style={[
            styles.restoreButton,
            isTabScrolling && styles.restoreButtonScrolling,
            { borderColor: visualTheme.shell },
          ]}
        >
          <Ionicons name={visualTheme.icon} size={16} color={visualTheme.shell} />
          <Text style={[styles.restoreButtonText, { color: visualTheme.shell }]}>
            Show BatiBot
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.wrap,
        { pointerEvents: "box-none" },
        isTabScrolling && styles.wrapScrolling,
        isOpen && styles.wrapOpen,
      ]}
    >
      <View style={isOpen ? styles.openDock : styles.closedDock}>
        {isOpen ? (
          <View
            style={[
              styles.panel,
              isCompactBuddy && styles.panelCompact,
              isTinyBuddy && styles.panelTiny,
              { borderColor: visualTheme.shell },
            ]}
          >
            <View
              style={[
                styles.moodBadge,
                currentMessage.mood === "hint"
                  ? styles.moodHint
                  : currentMessage.mood === "celebrate"
                    ? styles.moodCelebrate
                    : styles.moodEncourage,
              ]}
            >
              <Text style={styles.moodText}>{currentMessage.title}</Text>
            </View>

            <Text
              numberOfLines={isTinyBuddy ? 3 : 4}
              style={[styles.panelText, isCompactBuddy && styles.panelTextCompact]}
            >
              {currentMessage.body}
            </Text>
            <View style={[styles.speechTail, { borderLeftColor: visualTheme.shell }]} />
          </View>
        ) : null}

        <View style={styles.characterDock}>
          {isOpen ? (
          <View style={[styles.actionRail, isCompactBuddy && styles.actionRailCompact]}>
            <Pressable
              style={[styles.actionChip, { backgroundColor: visualTheme.action }]}
              onPress={showGreeting}
            >
              <Text style={styles.actionText}>Greet Me</Text>
            </Pressable>

            <Pressable
              style={[styles.actionChip, { backgroundColor: visualTheme.action }]}
              onPress={showRandomTopic}
            >
              <Text style={styles.actionText}>Topic</Text>
            </Pressable>

            <Pressable
              style={[styles.actionChip, { backgroundColor: visualTheme.action }]}
              onPress={showHint}
            >
              <Text style={styles.actionText}>Hint</Text>
            </Pressable>

            <Pressable
              style={[
                styles.actionChip,
                { backgroundColor: visualTheme.action },
                voiceEnabled && styles.actionChipActive,
                voiceEnabled && { backgroundColor: visualTheme.actionActive },
              ]}
              onPress={toggleVoice}
            >
              <Text
                style={[
                  styles.actionText,
                  voiceEnabled && styles.actionTextActive,
                ]}
              >
                {voiceEnabled ? "Voice On" : "Voice Off"}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.actionChip, { backgroundColor: "#FFFFFF" }]}
              onPress={hideBuddy}
            >
              <Text style={[styles.actionText, { color: visualTheme.action }]}>Hide</Text>
            </Pressable>
          </View>
          ) : null}

        <Animated.View
          style={[
            styles.characterFloat,
            isOpen && isCompactBuddy && styles.characterFloatCompact,
            {
              opacity: isTabScrolling ? 0.82 : 1,
              transform: [
                { scale: buddyScale * scrollScale },
                { translateX: isTabScrolling ? 14 : 0 },
                { translateY: isTabScrolling ? 6 : 0 },
              ],
            },
          ]}
        >
          <Pressable
            accessibilityLabel="Hide BatiBot buddy"
            onPress={hideBuddy}
            style={[
              styles.visibilityButton,
              isOpen && styles.visibilityButtonRaised,
              { borderColor: visualTheme.shell },
            ]}
          >
            <Ionicons name="eye-off-outline" size={12} color={visualTheme.shell} />
          </Pressable>
          <Pressable
            accessibilityLabel={isOpen ? "Close BatiBot buddy" : "Open BatiBot buddy"}
            style={styles.iconButton}
            onPress={() => setIsOpen((current) => !current)}
          >
            <View style={[styles.glowRing, { backgroundColor: visualTheme.glow }]} />
            <View style={styles.floorShadow} />

            <View style={styles.characterShell}>
              <Animated.View
                style={[
                  styles.waveArm,
                  { backgroundColor: "#FFC98F" },
                  { transform: [{ rotate: handWaveRotation }] },
                ]}
              >
                <View style={styles.waveHand}>
                  <View style={[styles.finger, styles.fingerOne]} />
                  <View style={[styles.finger, styles.fingerTwo]} />
                  <View style={[styles.finger, styles.fingerThree]} />
                  <View style={[styles.finger, styles.fingerFour]} />
                  <View style={[styles.finger, styles.fingerFive]} />
                </View>
              </Animated.View>
              <View style={styles.restArm} />
              <View style={[styles.leftShorts, { backgroundColor: visualTheme.shorts }]} />
              <View style={[styles.rightShorts, { backgroundColor: visualTheme.shorts }]} />
              <View style={styles.leftLeg} />
              <View style={styles.rightLeg} />
              <View style={[styles.shoe, styles.leftShoe, { backgroundColor: visualTheme.shoes }]} />
              <View style={[styles.shoe, styles.rightShoe, { backgroundColor: visualTheme.shoes }]} />
              <Animated.View style={[styles.body, { backgroundColor: visualTheme.body }]} />
              <Animated.View style={styles.childHead}>
                <View style={styles.ear} />
                <View style={[styles.ear, styles.rightEar]} />
                <View style={styles.hairCap} />
                <View style={[styles.hairCurl, styles.hairCurlLeft]} />
                <View style={[styles.hairCurl, styles.hairCurlCenter]} />
                <View style={[styles.hairCurl, styles.hairCurlRight]} />
                <View style={styles.childEyes}>
                  <Animated.View
                    style={[styles.childEye, { transform: [{ scaleY: blink }] }]}
                  />
                  <Animated.View
                    style={[styles.childEye, { transform: [{ scaleY: blink }] }]}
                  />
                </View>
                <View style={styles.childSmile} />
              </Animated.View>
            </View>
          </Pressable>
        </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "flex-end",
    bottom: 98,
    left: 6,
    position: "absolute",
    right: 6,
  },
  wrapScrolling: {
    bottom: 90,
  },
  wrapOpen: {
    right: 6,
  },
  hiddenWrap: {
    bottom: 110,
  },
  openDock: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
    maxWidth: 390,
    width: "100%",
  },
  closedDock: {
    alignItems: "flex-end",
    width: "100%",
  },
  panel: {
    ...StudyBuddyShadow,
    backgroundColor: StudyBuddyTheme.colors.surface,
    borderRadius: 18,
    borderWidth: 2,
    flexShrink: 1,
    marginBottom: 26,
    marginRight: 4,
    maxWidth: 166,
    minWidth: 132,
    padding: 10,
    position: "relative",
  },
  panelCompact: {
    maxWidth: 134,
    minWidth: 118,
    padding: 8,
  },
  panelTiny: {
    maxWidth: 112,
    minWidth: 100,
  },
  moodBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    marginBottom: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  moodEncourage: {
    backgroundColor: StudyBuddyTheme.colors.surfaceMint,
  },
  moodHint: {
    backgroundColor: StudyBuddyTheme.colors.surfaceSoft,
  },
  moodCelebrate: {
    backgroundColor: StudyBuddyTheme.colors.surfaceLavender,
  },
  moodText: {
    color: StudyBuddyTheme.colors.text,
    fontFamily: Fonts.rounded,
    fontSize: 10,
    fontWeight: "800",
  },
  panelText: {
    color: StudyBuddyTheme.colors.text,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 15,
  },
  panelTextCompact: {
    fontSize: 10,
    lineHeight: 14,
  },
  speechTail: {
    borderBottomColor: "transparent",
    borderBottomWidth: 8,
    borderLeftWidth: 12,
    borderTopColor: "transparent",
    borderTopWidth: 8,
    bottom: 20,
    height: 0,
    position: "absolute",
    right: -12,
    width: 0,
  },
  characterDock: {
    alignItems: "center",
    gap: -2,
  },
  actionRail: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    justifyContent: "center",
    marginBottom: -10,
    maxWidth: 124,
  },
  actionRailCompact: {
    gap: 3,
    maxWidth: 110,
  },
  actionChip: {
    alignItems: "center",
    backgroundColor: "#06C26F",
    borderRadius: 999,
    justifyContent: "center",
    minHeight: 24,
    minWidth: 48,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  actionChipActive: {
    backgroundColor: StudyBuddyTheme.colors.primaryDark,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    textAlign: "center",
  },
  actionTextActive: {
    color: "#FFFFFF",
  },
  characterFloat: {
    alignItems: "center",
  },
  characterFloatCompact: {
    marginRight: -4,
  },
  visibilityButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 1,
    height: 24,
    justifyContent: "center",
    position: "absolute",
    right: 10,
    top: 10,
    width: 24,
    zIndex: 8,
  },
  visibilityButtonRaised: {
    top: 0,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "flex-end",
    minHeight: 154,
    width: 94,
  },
  restoreButton: {
    ...StudyBuddyShadow,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  restoreButtonScrolling: {
    opacity: 0.8,
  },
  restoreButtonText: {
    fontFamily: Fonts.rounded,
    fontSize: 12,
    fontWeight: "800",
  },
  glowRing: {
    borderRadius: 999,
    height: 92,
    opacity: 0.38,
    position: "absolute",
    top: 22,
    width: 92,
  },
  floorShadow: {
    backgroundColor: "rgba(15, 23, 42, 0.14)",
    borderRadius: 999,
    bottom: 2,
    height: 14,
    position: "absolute",
    width: 78,
  },
  characterShell: {
    alignItems: "center",
    height: 150,
    justifyContent: "flex-end",
    width: 94,
  },
  childHead: {
    alignItems: "center",
    backgroundColor: "#FFC98F",
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 62,
    justifyContent: "center",
    position: "absolute",
    top: 26,
    width: 72,
    zIndex: 5,
  },
  ear: {
    backgroundColor: "#FFC98F",
    borderRadius: 999,
    height: 14,
    left: -6,
    position: "absolute",
    top: 28,
    width: 12,
  },
  rightEar: {
    left: undefined,
    right: -6,
  },
  hairCap: {
    backgroundColor: "#030303",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: 28,
    position: "absolute",
    top: -16,
    width: 68,
  },
  hairCurl: {
    backgroundColor: "#030303",
    borderRadius: 999,
    height: 34,
    position: "absolute",
    top: -6,
    width: 24,
  },
  hairCurlLeft: {
    left: -2,
  },
  hairCurlCenter: {
    height: 38,
    top: -20,
    width: 42,
  },
  hairCurlRight: {
    right: -2,
  },
  childEyes: {
    flexDirection: "row",
    gap: 18,
    marginTop: 14,
  },
  childEye: {
    backgroundColor: "#050505",
    borderRadius: 7,
    height: 22,
    width: 12,
  },
  childSmile: {
    borderBottomColor: "#050505",
    borderBottomWidth: 3,
    borderLeftColor: "transparent",
    borderLeftWidth: 2,
    borderRadius: 999,
    borderRightColor: "transparent",
    borderRightWidth: 2,
    height: 13,
    marginTop: 4,
    width: 31,
  },
  body: {
    backgroundColor: "#06C26F",
    borderRadius: 13,
    height: 49,
    position: "absolute",
    top: 82,
    width: 66,
    zIndex: 4,
  },
  waveArm: {
    backgroundColor: "#FFC98F",
    borderRadius: 10,
    height: 52,
    left: 4,
    position: "absolute",
    top: 63,
    width: 15,
    zIndex: 3,
  },
  waveHand: {
    backgroundColor: "#FFC98F",
    borderRadius: 999,
    height: 26,
    left: -7,
    position: "absolute",
    top: -19,
    width: 27,
  },
  finger: {
    backgroundColor: "#FFC98F",
    borderRadius: 999,
    height: 17,
    position: "absolute",
    top: -7,
    width: 5,
  },
  fingerOne: {
    left: 0,
    top: -2,
    transform: [{ rotate: "-56deg" }],
  },
  fingerTwo: {
    left: 4,
    top: -9,
    transform: [{ rotate: "-32deg" }],
  },
  fingerThree: {
    left: 11,
    top: -12,
    transform: [{ rotate: "-5deg" }],
  },
  fingerFour: {
    right: 5,
    top: -9,
    transform: [{ rotate: "24deg" }],
  },
  fingerFive: {
    right: 0,
    top: -2,
    transform: [{ rotate: "54deg" }],
  },
  restArm: {
    backgroundColor: "#FFC98F",
    borderRadius: 999,
    height: 49,
    position: "absolute",
    right: 11,
    top: 84,
    transform: [{ rotate: "-18deg" }],
    width: 14,
    zIndex: 2,
  },
  leftLeg: {
    backgroundColor: "#FFC98F",
    height: 26,
    left: 31,
    position: "absolute",
    top: 124,
    width: 13,
    zIndex: 1,
  },
  rightLeg: {
    backgroundColor: "#FFC98F",
    height: 26,
    position: "absolute",
    right: 31,
    top: 124,
    width: 13,
    zIndex: 1,
  },
  shoe: {
    backgroundColor: "#F05A3C",
    borderColor: "#4C6E91",
    borderRadius: 10,
    borderWidth: 2,
    bottom: 0,
    height: 18,
    position: "absolute",
    width: 34,
    zIndex: 3,
  },
  leftShoe: {
    left: 20,
    transform: [{ rotate: "-8deg" }],
  },
  rightShoe: {
    right: 18,
    transform: [{ rotate: "8deg" }],
  },
  leftShorts: {
    backgroundColor: "#0759B7",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 8,
    height: 24,
    left: 24,
    position: "absolute",
    top: 121,
    width: 22,
    zIndex: 3,
  },
  rightShorts: {
    backgroundColor: "#0759B7",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 12,
    height: 24,
    position: "absolute",
    right: 24,
    top: 121,
    width: 22,
    zIndex: 3,
  },
});
