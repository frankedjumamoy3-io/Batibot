import {
  VOCABULARY_CATEGORY_META,
  VOCABULARY_SUBCATEGORY_META,
  type VocabularyCategory,
  type VocabularyItem,
  type VocabularySubcategory,
} from "@/src/data/vocabulary";

export type VocabularySubcategoryFilter = "all" | VocabularySubcategory;

export const VOCABULARY_SCREEN_COPY = {
  curriculumLabel: "Learning focus",
  detailCurriculumLabel: "Curriculum band",
  detailEmptyText:
    "Please return to the vocabulary list and choose another word.",
  detailEmptyTitle: "Word not found",
  detailExampleLabel: "Example sentence",
  detailListenLabel: "Hear pronunciation",
  detailListeningLabel: "Playing pronunciation...",
  detailSkillLabel: "Target skill",
  emptyText: "Try another search word or switch to another group.",
  emptyTitle: "No words found",
  featuredWordLabel: "Continue learning",
  heroSubtitle:
    "Tap, listen, and learn.",
  heroTitle: "Words",
  listeningPrompt: "Listening for a word...",
  processingVoiceSearch: "Searching your spoken word...",
  noWordsForLetter: "No words available for this letter.",
  noSpeechDetected: "No word heard. Tap the microphone and try again.",
  openCard: "Open card",
  searchedWordStatus: "Explored",
  subcategoryAllLabel: "All",
  voiceSearchPrompt: "Tap the microphone to search by voice.",
  voiceSearchUnavailable:
    "Voice search needs microphone permission on mobile/tablet. Text search still works everywhere.",
} as const;

export const VOCABULARY_SPEECH = {
  disabledMessage:
    "Turn speech quiz support back on in your profile to use voice search.",
  disabledTitle: "Speech support is off",
  nativeServiceUnavailableMessage:
    "This device does not have speech recognition available right now. Please check microphone, Siri, Dictation, or Google voice settings.",
  nativeUnavailableMessage:
    "Native voice search needs a development or production app build with speech recognition enabled. Text search still works here.",
  noSpeechMessage:
    "BatiBot did not hear a word. Please try again or type in the search box.",
  permissionDeniedMessage:
    "Please allow microphone and speech recognition permissions to search by voice.",
  permissionDeniedTitle: "Voice permission needed",
  prompt: "Say a word to search BatiBot.",
  resetUnavailableMessage:
    "We could not finish the voice search. Please try again or type the word.",
  resetUnavailableTitle: "Voice search stopped",
  unavailableMessage:
    "Voice search needs a supported browser or a mobile app build with speech recognition enabled. Text search still works on all devices.",
  unavailableTitle: "Voice search unavailable",
  wordRate: 0.8,
} as const;

export const VOCABULARY_CATEGORY_ORDER: VocabularyCategory[] = [
  "linguistic",
  "numeric",
];

export function groupVocabularyBySubcategory(items: VocabularyItem[]) {
  return items.reduce<Record<string, VocabularyItem[]>>((groups, item) => {
    const existingGroup = groups[item.subcategory] ?? [];
    groups[item.subcategory] = [...existingGroup, item];
    return groups;
  }, {});
}

export function getVocabularySearchPlaceholder(
  category: VocabularyCategory,
  subcategory: VocabularySubcategoryFilter
) {
  if (subcategory === "all") {
    return `Search ${VOCABULARY_CATEGORY_META[category].label.toLowerCase()}`;
  }

  const selectedSubcategory = VOCABULARY_SUBCATEGORY_META[category].find(
    (item) => item.id === subcategory
  );

  return selectedSubcategory
    ? `Search ${selectedSubcategory.label.toLowerCase()}`
    : `Search ${VOCABULARY_CATEGORY_META[category].label.toLowerCase()}`;
}

export function getVocabularySubcategoryOptions(category: VocabularyCategory) {
  return [
    {
      id: "all" as const,
      label: VOCABULARY_SCREEN_COPY.subcategoryAllLabel,
      description: `See all ${VOCABULARY_CATEGORY_META[category].label.toLowerCase()}.`,
    },
    ...VOCABULARY_SUBCATEGORY_META[category],
  ];
}

export function getVocabularySubcategoryMeta(
  category: VocabularyCategory,
  subcategory: VocabularySubcategoryFilter
) {
  if (subcategory === "all") {
    return {
      label: VOCABULARY_SCREEN_COPY.subcategoryAllLabel,
      description: VOCABULARY_CATEGORY_META[category].description,
    };
  }

  return (
    VOCABULARY_SUBCATEGORY_META[category].find((item) => item.id === subcategory) ?? {
      label: VOCABULARY_SCREEN_COPY.subcategoryAllLabel,
      description: VOCABULARY_CATEGORY_META[category].description,
    }
  );
}
