export type VocabularyCategory = "linguistic" | "numeric";

export type LinguisticSubcategory =
  | "family"
  | "body"
  | "colors"
  | "animals"
  | "alphabet"
  | "school"
  | "community"
  | "actions"
  | "vocabulary"
  | "story"
  | "plants"
  | "things"
  | "nature"
  | "reading";

export type NumericSubcategory =
  | "counting"
  | "shapes"
  | "patterns"
  | "numbers"
  | "place-value"
  | "measurement"
  | "multiplication"
  | "division"
  | "fractions"
  | "money"
  | "problem-solving"
  | "adding"
  | "comparing";

export type VocabularySubcategory =
  | LinguisticSubcategory
  | NumericSubcategory;

export interface VocabularyItem {
  id: string;
  legacyIds: string[];
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  imageUri: string;
  emoji: string;
  accentColor: string;
  category: VocabularyCategory;
  subcategory: VocabularySubcategory;
  curriculumBand: string;
  learningGoal: string;
  recognitionPrompt: string;
  searchTerms: string[];
}

export interface VocabularySeed {
  word: string;
  emoji: string;
  meaning: string;
  clue: string;
  sample?: string;
  searchTerms?: string[];
}
