import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { getGradeVocabularyItems } from "@/src/data/learner-module";
import type { VocabularyItem } from "@/src/data/vocabulary";
import { APP_ROUTES } from "@/src/navigation/routes";
import { useUserSettings } from "@/src/store/user-settings";

const STORAGE_KEY_PREFIX = "batibot:word-of-day";

type StoredWordOfDay = {
  date: string;
  dismissed: boolean;
  wordId: string;
};

function getDateStamp(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getHash(value: string) {
  return value.split("").reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0;
  }, 7);
}

function getDailyWord(
  userKey: string,
  dateStamp: string,
  vocabularyItems: VocabularyItem[]
) {
  const index = getHash(`${userKey}:${dateStamp}`) % vocabularyItems.length;
  return vocabularyItems[index];
}

function parseStoredWordOfDay(value: string | null): StoredWordOfDay | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<StoredWordOfDay>;

    if (
      typeof parsed.date === "string" &&
      typeof parsed.wordId === "string" &&
      typeof parsed.dismissed === "boolean"
    ) {
      return {
        date: parsed.date,
        dismissed: parsed.dismissed,
        wordId: parsed.wordId,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function WordOfDayToast() {
  const router = useRouter();
  const { profile, user } = useCurrentUserProfile();
  const { settings, theme } = useUserSettings();
  const insets = useSafeAreaInsets();
  const [word, setWord] = useState<VocabularyItem | null>(null);
  const [visible, setVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const storageKey = useMemo(() => {
    return user?.uid ? `${STORAGE_KEY_PREFIX}:${user.uid}` : null;
  }, [user?.uid]);

  useEffect(() => {
    let isMounted = true;

    async function loadWordOfDay() {
      if (!storageKey || !settings.notificationsEnabled) {
        setVisible(false);
        setWord(null);
        return;
      }

      const today = getDateStamp();
      const stored = parseStoredWordOfDay(await AsyncStorage.getItem(storageKey));
      const vocabularyItems = getGradeVocabularyItems(profile?.gradeLevel);

      if (!vocabularyItems.length) {
        setVisible(false);
        setWord(null);
        return;
      }

      if (stored?.date === today && stored.dismissed) {
        return;
      }

      const storedWord =
        stored?.date === today
          ? vocabularyItems.find((item) => item.id === stored.wordId)
          : null;
      const nextWord =
        storedWord ?? getDailyWord(user?.uid ?? "learner", today, vocabularyItems);

      if (!storedWord) {
        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify({
            date: today,
            dismissed: false,
            wordId: nextWord.id,
          } satisfies StoredWordOfDay)
        );
      }

      if (isMounted) {
        setWord(nextWord);
        setVisible(true);
      }
    }

    void loadWordOfDay();

    return () => {
      isMounted = false;
    };
  }, [profile?.gradeLevel, settings.notificationsEnabled, storageKey, user?.uid]);

  useEffect(() => {
    if (settings.reduceMotion) {
      animation.setValue(visible ? 1 : 0);
      return;
    }

    Animated.spring(animation, {
      damping: 18,
      mass: 0.9,
      stiffness: 190,
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [animation, settings.reduceMotion, visible]);

  async function dismiss() {
    const today = getDateStamp();

    if (storageKey && word) {
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({
          date: today,
          dismissed: true,
          wordId: word.id,
        } satisfies StoredWordOfDay)
      );
    }

    setVisible(false);
  }

  function openWord() {
    if (!word) {
      return;
    }

    void dismiss();
    router.push({
      pathname: APP_ROUTES.tabs.vocabularyDetail,
      params: { id: word.id },
    });
  }

  if (!word || !visible || !settings.notificationsEnabled) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.overlay,
        { pointerEvents: "box-none" },
        {
          opacity: animation,
          paddingTop: Math.max(insets.top + 10, 18),
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-16, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Pressable
        accessibilityLabel={`Word of the day: ${word.word}`}
        onPress={openWord}
        style={[
          styles.toast,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            shadowColor: theme.shadow.shadowColor,
            shadowOffset: theme.shadow.shadowOffset,
            shadowOpacity: theme.shadow.shadowOpacity,
            shadowRadius: theme.shadow.shadowRadius,
            elevation: theme.shadow.elevation,
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: word.accentColor }]}>
          <Text style={styles.emoji}>{word.emoji}</Text>
        </View>
        <View style={styles.body}>
          <Text style={[styles.kicker, { color: theme.colors.primary }]}>
            Word of the day
          </Text>
          <Text numberOfLines={1} style={[styles.word, { color: theme.colors.text }]}>
            {word.word}
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.description, { color: theme.colors.textMuted }]}
          >
            {word.definition}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Dismiss word of the day"
          hitSlop={10}
          onPress={(event) => {
            event.stopPropagation();
            void dismiss();
          }}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={18} color={theme.colors.textSoft} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  closeButton: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  description: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 2,
  },
  emoji: {
    fontSize: 20,
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 16,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  kicker: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  overlay: {
    left: 14,
    position: "absolute",
    right: 14,
    top: 0,
    zIndex: 80,
  },
  toast: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 12,
  },
  word: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 1,
  },
});
