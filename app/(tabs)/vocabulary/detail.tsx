import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { AnimatedWordImage } from "@/components/vocabulary";
import {
  getVocabularyItem,
  VOCABULARY_CATEGORY_META,
  VOCABULARY_SUBCATEGORY_META,
  type VocabularyItem,
} from "@/src/data/vocabulary";
import { getGradeVocabularyItems } from "@/src/data/learner-module";
import { APP_ROUTES } from "@/src/navigation/routes";
import { VOCABULARY_DETAIL_COPY } from "@/src/screens/vocabulary/vocabulary-detail.content";
import { createVocabularyDetailStyles } from "@/src/screens/vocabulary/vocabulary-detail.styles";
import { VOCABULARY_SPEECH } from "@/src/screens/vocabulary/vocabulary.content";
import { getPublishedVocabularyItemById } from "@/src/services/vocabularyService";
import { useLearnerProgress } from "@/src/presentation/state/learner-progress-provider";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { useUserSettings } from "@/src/store/user-settings";

export default function VocabularyDetail() {
  const params = useLocalSearchParams<{ id?: string; studyIds?: string }>();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const itemId = Array.isArray(params.id) ? params.id[0] : params.id;
  const studyIdsParam = Array.isArray(params.studyIds)
    ? params.studyIds[0]
    : params.studyIds;
  const [item, setItem] = useState<VocabularyItem | null>(
    () => getVocabularyItem(itemId) ?? null
  );
  const { profile } = useCurrentUserProfile();
  const { markWordViewed } = useLearnerProgress();
  const { settings, theme } = useUserSettings();
  const styles = createVocabularyDetailStyles(theme);
  const floatAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isActive = true;
    const localItem = getVocabularyItem(itemId) ?? null;

    setItem(localItem);

    getPublishedVocabularyItemById(itemId)
      .then((publishedItem) => {
        if (!isActive) {
          return;
        }

        setItem(publishedItem ?? localItem);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setItem(localItem);
      });

    return () => {
      isActive = false;
    };
  }, [itemId]);

  useEffect(() => {
    if (item) {
      markWordViewed(item.id, item.word, item.legacyIds);
    }
  }, [item, markWordViewed]);

  useEffect(() => {
    if (!item || !settings.autoPlayPronunciation || !settings.soundEnabled) {
      return;
    }

    Speech.stop();
    setIsSpeaking(true);
    Speech.speak(item.word, {
      language: "en-US",
      pitch: 1,
      rate: VOCABULARY_SPEECH.wordRate,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });

    return () => {
      Speech.stop();
      setIsSpeaking(false);
    };
  }, [item, settings.autoPlayPronunciation, settings.soundEnabled]);

  useEffect(() => {
    if (settings.reduceMotion) {
      floatAnimation.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnimation, {
          toValue: -8,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnimation, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [floatAnimation, settings.reduceMotion]);

  function speakWord(word: string) {
    if (!settings.soundEnabled) {
      return;
    }

    Speech.stop();
    setIsSpeaking(true);
    Speech.speak(word, {
      language: "en-US",
      pitch: 1,
      rate: VOCABULARY_SPEECH.wordRate,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }

  if (!item) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>{VOCABULARY_DETAIL_COPY.emptyTitle}</Text>
        <Text style={styles.emptyText}>{VOCABULARY_DETAIL_COPY.emptyText}</Text>
      </View>
    );
  }

  const categoryMeta = VOCABULARY_CATEGORY_META[item.category];
  const subcategoryMeta = VOCABULARY_SUBCATEGORY_META[item.category].find(
    (subcategory) => subcategory.id === item.subcategory
  );
  const studyItems: VocabularyItem[] = (studyIdsParam ?? "")
    .split(",")
    .map((studyId: string) => getVocabularyItem(studyId))
    .filter(
      (candidate: VocabularyItem | undefined): candidate is VocabularyItem =>
        !!candidate
    )
    .filter(
      (candidate: VocabularyItem, index: number, items: VocabularyItem[]) =>
        items.findIndex((match) => match.id === candidate.id) === index
    );
  const relatedItemsSource: VocabularyItem[] = studyItems.length
    ? studyItems
    : [item, ...getGradeVocabularyItems(profile?.gradeLevel)];
  const relatedItems = relatedItemsSource.filter(
    (candidate: VocabularyItem, index: number, items: VocabularyItem[]) =>
      candidate &&
      items.findIndex((match) => match?.id === candidate.id) === index
  ).filter((candidate: VocabularyItem) => {
    if (studyItems.length) {
      return true;
    }

    return (
      candidate.category === item.category &&
      candidate.subcategory === item.subcategory
    );
  });
  const orderedRelatedItems: VocabularyItem[] = studyItems.length
    ? relatedItems
    : relatedItems.sort((first: VocabularyItem, second: VocabularyItem) =>
        first.word.localeCompare(second.word)
      );
  const currentIndex = orderedRelatedItems.findIndex(
    (candidate: VocabularyItem) => candidate.id === item.id
  );
  const previousItem =
    currentIndex > 0
      ? orderedRelatedItems[currentIndex - 1]
      : orderedRelatedItems.at(-1);
  const nextItem =
    currentIndex >= 0 && currentIndex < orderedRelatedItems.length - 1
      ? orderedRelatedItems[currentIndex + 1]
      : orderedRelatedItems[0];

  function openRelatedWord(wordId?: string) {
    if (!wordId) {
      return;
    }

    router.push({
      pathname: APP_ROUTES.tabs.vocabularyDetail,
      params: {
        id: wordId,
        ...(studyIdsParam ? { studyIds: studyIdsParam } : {}),
      },
    });
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
            fontWeight: "800",
          },
          title: item.word,
        }}
      />

      <Animated.View style={{ transform: [{ translateY: floatAnimation }] }}>
        <AnimatedWordImage
          accentColor={item.accentColor}
          emoji={item.emoji}
          imageUri={item.imageUri}
          recognitionPrompt={item.recognitionPrompt}
          subcategory={item.subcategory}
          variant="detail"
        />
      </Animated.View>

      <View style={styles.content}>
        <View style={styles.wordHeader}>
          <View style={styles.wordTitleWrap}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.word}>{item.word}</Text>
            <Text style={styles.sayItLabel}>{VOCABULARY_DETAIL_COPY.sayItLabel}</Text>
            <Text style={[styles.pronunciationText, { color: item.accentColor }]}>
              {item.pronunciation}
            </Text>
          </View>

          <Pressable
            onPress={() => speakWord(item.word)}
            style={[styles.listenButton, { backgroundColor: item.accentColor }]}
          >
            <Ionicons
              name={isSpeaking ? "volume-high" : "volume-medium-outline"}
              size={22}
              color="#fff"
            />
            <Text style={styles.listenText}>
              {isSpeaking
                ? VOCABULARY_DETAIL_COPY.listeningLabel
                : VOCABULARY_DETAIL_COPY.listenLabel}
            </Text>
          </Pressable>
        </View>

        <View style={styles.tagRow}>
          <View
            style={[
              styles.categoryTag,
              { backgroundColor: `${item.accentColor}18` },
            ]}
          >
            <Text
              style={[
                styles.categoryTagText,
                { color: item.accentColor },
              ]}
            >
              {subcategoryMeta?.label ?? item.subcategory}
            </Text>
          </View>
          <View style={styles.rewardPill}>
            <Text style={styles.rewardText}>{VOCABULARY_DETAIL_COPY.rewardLabel}</Text>
          </View>
        </View>

        <View style={styles.learningCard}>
          <Text style={styles.inlineMetaLabel}>{VOCABULARY_DETAIL_COPY.meaningLabel}</Text>
          <Text style={styles.definition}>{item.definition}</Text>
        </View>

        <View style={styles.learningCard}>
          <Text style={styles.exampleLabel}>{VOCABULARY_DETAIL_COPY.exampleLabel}</Text>
          <Text style={styles.exampleText}>{item.example}</Text>
        </View>

        <View style={styles.tryCard}>
          <Text style={styles.inlineMetaLabel}>{VOCABULARY_DETAIL_COPY.pictureClueLabel}</Text>
          <Text style={styles.exampleText}>{item.recognitionPrompt}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>{VOCABULARY_DETAIL_COPY.curriculumLabel}</Text>
          <Text style={styles.infoTitle}>{item.curriculumBand}</Text>
          <Text style={styles.infoBody}>{categoryMeta.targetSkill}</Text>
        </View>

        <View style={styles.wordNavRow}>
          <Pressable
            onPress={() => openRelatedWord(previousItem?.id)}
            style={styles.wordNavButton}
          >
            <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
            <Text style={styles.wordNavText}>{VOCABULARY_DETAIL_COPY.previousWordLabel}</Text>
          </Pressable>
          <Pressable
            onPress={() => openRelatedWord(nextItem?.id)}
            style={[styles.wordNavButton, styles.wordNavButtonPrimary]}
          >
            <Text style={[styles.wordNavText, styles.wordNavTextPrimary]}>
              {VOCABULARY_DETAIL_COPY.nextWordLabel}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
