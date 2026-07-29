import { getCurriculumDomainSummary } from "@/src/content/curriculum";
import { LEARNING_WORLD_VOCABULARY_ITEMS } from "@/src/data/vocabulary/learning-worlds";
import type {
  VocabularyCategory,
  VocabularyItem,
  VocabularySubcategory,
} from "@/src/data/vocabulary/types";

export type {
  LinguisticSubcategory,
  NumericSubcategory,
  VocabularyCategory,
  VocabularyItem,
  VocabularySeed,
  VocabularySubcategory,
} from "@/src/data/vocabulary/types";

export { VOCABULARY_LOTTIE_SOURCES } from "@/src/data/vocabulary/media";

export const VOCABULARY_CATEGORY_META: Record<
  VocabularyCategory,
  {
    label: string;
    description: string;
    accentColor: string;
    targetSkill: string;
  }
> = {
  linguistic: {
    label: "Words",
    description: getCurriculumDomainSummary("linguistic").summary,
    accentColor: "#7C2EF2",
    targetSkill: "Literacy, vocabulary, listening, and reading readiness",
  },
  numeric: {
    label: "Numbers",
    description: getCurriculumDomainSummary("numeric").summary,
    accentColor: "#FF850F",
    targetSkill: "Counting, shapes, patterns, operations, and problem solving",
  },
};

export const VOCABULARY_SUBCATEGORY_META: Record<
  VocabularyCategory,
  {
    id: VocabularySubcategory;
    label: string;
    description: string;
  }[]
> = {
  linguistic: [
    {
      id: "family",
      label: "My Family World",
      description: "Family and friend words for early social vocabulary.",
    },
    {
      id: "body",
      label: "My Body World",
      description: "Body-part words for listening and identifying.",
    },
    {
      id: "colors",
      label: "Colorful World",
      description: "Basic color words for sorting and matching.",
    },
    {
      id: "animals",
      label: "Animal Adventure",
      description: "Familiar animals and sound-based recognition.",
    },
    {
      id: "alphabet",
      label: "Alphabet Adventure",
      description: "Letters, sounds, and familiar Play words.",
    },
    {
      id: "school",
      label: "School World",
      description: "Classroom and school-object words.",
    },
    {
      id: "vocabulary",
      label: "Word Kingdom",
      description: "Vocabulary relationships and word meaning.",
    },
    {
      id: "reading",
      label: "Reading Quest",
      description: "Reading words, sentence parts, and comprehension.",
    },
    {
      id: "story",
      label: "Story Adventure",
      description: "Story vocabulary and comprehension words.",
    },
  ],
  numeric: [
    {
      id: "counting",
      label: "Number Village",
      description: "Numbers, counting, quantity, and group-comparison ideas.",
    },
    {
      id: "shapes",
      label: "Shape Kingdom",
      description: "Basic shapes and shape matching.",
    },
    {
      id: "patterns",
      label: "Pattern Playground",
      description: "Repeated patterns and sequencing.",
    },
    {
      id: "adding",
      label: "Math Mountain",
      description: "Addition words and number actions.",
    },
    {
      id: "place-value",
      label: "Place Value City",
      description: "Tens, ones, and number-building ideas.",
    },
    {
      id: "measurement",
      label: "Measurement Harbor",
      description: "Length, time, and measuring words.",
    },
    {
      id: "multiplication",
      label: "Multiplication Empire",
      description: "Multiplication vocabulary and products.",
    },
    {
      id: "fractions",
      label: "Fraction Fortress",
      description: "Simple fraction words and equal parts.",
    },
    {
      id: "money",
      label: "Money Market",
      description: "Money words and counting coins.",
    },
  ],
};

function normalizeVocabularyWord(word: string) {
  return word.trim().toLowerCase().replace(/\s+/g, " ");
}

function mergeDuplicateVocabularyItems(items: VocabularyItem[]) {
  const mergedItems: VocabularyItem[] = [];
  const itemsByWord = new Map<string, VocabularyItem>();

  items.forEach((item) => {
    const normalizedWord = normalizeVocabularyWord(item.word);
    const existingItem = itemsByWord.get(normalizedWord);

    if (!existingItem) {
      const nextItem = { ...item, legacyIds: Array.from(new Set(item.legacyIds)) };

      itemsByWord.set(normalizedWord, nextItem);
      mergedItems.push(nextItem);
      return;
    }

    existingItem.legacyIds = Array.from(
      new Set([...existingItem.legacyIds, item.id, ...item.legacyIds])
    );
  });

  return mergedItems;
}

export const VOCABULARY_ITEMS: VocabularyItem[] = mergeDuplicateVocabularyItems(
  LEARNING_WORLD_VOCABULARY_ITEMS
);

export function isVocabularyItemViewed(
  item: VocabularyItem,
  viewedWordIds: string[]
) {
  return [item.id, ...item.legacyIds].some((candidateId) =>
    viewedWordIds.includes(candidateId)
  );
}

export function getVocabularyItem(id?: string | string[]) {
  const itemId = Array.isArray(id) ? id[0] : id;

  return VOCABULARY_ITEMS.find((item) => {
    if (!itemId) {
      return false;
    }

    return item.id === itemId || item.legacyIds.includes(itemId);
  });
}

export function getVocabularyItemByWord(
  word?: string,
  category?: VocabularyCategory
) {
  const normalizedWord = word?.trim().toLowerCase().replace(/\s+/g, " ");

  if (!normalizedWord) {
    return undefined;
  }

  return VOCABULARY_ITEMS.find((item) => {
    const matchesWord =
      item.word.trim().toLowerCase().replace(/\s+/g, " ") === normalizedWord;

    return matchesWord && (!category || item.category === category);
  });
}

export function getVocabularyByCategory(category: VocabularyCategory) {
  return VOCABULARY_ITEMS.filter((item) => item.category === category);
}
