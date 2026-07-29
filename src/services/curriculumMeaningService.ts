import { getAnimalMeaning } from "@/src/curriculum/preschool/animal/meaning";
import { getBodyMeaning } from "@/src/curriculum/preschool/body/meaning";
import { getColorMeaning } from "@/src/curriculum/preschool/color/meaning";
import { getCountingMeaning } from "@/src/curriculum/preschool/counting/meaning";
import { getScopedFamilyMeaning } from "@/src/curriculum/preschool/family/meaning";
import { getFoodMeaning } from "@/src/curriculum/preschool/food/meaning";
import { getFruitMeaning } from "@/src/curriculum/preschool/fruit/meaning";
import { getNumberMeaning } from "@/src/curriculum/preschool/number/meaning";
import { getPatternMeaning } from "@/src/curriculum/preschool/pattern/meaning";
import { getQuantityMeaning } from "@/src/curriculum/preschool/quantity/meaning";
import { getShapeMeaning } from "@/src/curriculum/preschool/shape/meaning";
import { getSizeMeaning } from "@/src/curriculum/preschool/size/meaning";
import { getKindergartenAlphabetMeaning } from "@/src/curriculum/kindergarten/alphabet/meaning";
import { getKindergartenCommunityMeaning } from "@/src/curriculum/kindergarten/community/meaning";
import { getKindergartenMathMeaning } from "@/src/curriculum/kindergarten/math/meaning";
import { getKindergartenNatureMeaning } from "@/src/curriculum/kindergarten/nature/meaning";
import { getKindergartenNumberMeaningByTopic } from "@/src/curriculum/kindergarten/number/meaning";
import { getKindergartenPatternMeaning } from "@/src/curriculum/kindergarten/pattern/meaning";
import { getKindergartenQuantityMeaning } from "@/src/curriculum/kindergarten/quantity/meaning";
import { getKindergartenReadingMeaning } from "@/src/curriculum/kindergarten/reading/meaning";
import { getKindergartenSchoolMeaning } from "@/src/curriculum/kindergarten/school/meaning";
import { getKindergartenShapeMeaning } from "@/src/curriculum/kindergarten/shape/meaning";
import { getKindergartenSizeMeaning } from "@/src/curriculum/kindergarten/size/meaning";
import { getScopedGrade1FamilyStoryMeaning } from "@/src/curriculum/grade1/family-story/meaning";
import { getScopedGrade1MathMeaning } from "@/src/curriculum/grade1/math/meaning";
import { getScopedGrade1NatureMeaning } from "@/src/curriculum/grade1/nature/meaning";
import { getScopedGrade1NumberMeaning } from "@/src/curriculum/grade1/number/meaning";
import { getScopedGrade1ReadingMeaning } from "@/src/curriculum/grade1/reading/meaning";
import { getScopedGrade1ShapeMeaning } from "@/src/curriculum/grade1/shape/meaning";
import { getScopedGrade1TimeMeaning } from "@/src/curriculum/grade1/time/meaning";
import { getScopedWordKingdomMeaning } from "@/src/curriculum/grade1/word/meaning";
import { getScopedGrade2ChallengeMeaning } from "@/src/curriculum/grade2/challenge/meaning";
import { getScopedGrade2MeasurementMeaning } from "@/src/curriculum/grade2/measurement/meaning";
import { getScopedGrade2MultiplicationMeaning } from "@/src/curriculum/grade2/multiplication/meaning";
import { getScopedGrade2PlaceValueMeaning } from "@/src/curriculum/grade2/place-value/meaning";
import { getScopedGrade2ProblemSolvingMeaning } from "@/src/curriculum/grade2/problem-solving/meaning";
import { getScopedGrade2StoryMeaning } from "@/src/curriculum/grade2/story/meaning";
import { getScopedVocabularyMeaning } from "@/src/curriculum/grade2/vocabulary/meaning";
import { getScopedGrade3ChallengeMeaning } from "@/src/curriculum/grade3/challenge/meaning";
import { getScopedContextClueMeaning } from "@/src/curriculum/grade3/context-clue/meaning";
import { getScopedGrade3DivisionMeaning } from "@/src/curriculum/grade3/division/meaning";
import { getScopedGrade3FractionMeaning } from "@/src/curriculum/grade3/fraction/meaning";
import { getScopedGrade3MoneyMeaning } from "@/src/curriculum/grade3/money/meaning";
import { getScopedGrade3MultiplicationMeaning } from "@/src/curriculum/grade3/multiplication/meaning";
import { getScopedGrade3NumberMeaning } from "@/src/curriculum/grade3/number/meaning";
import { getScopedReadingAdventureMeaning } from "@/src/curriculum/grade3/reading/meaning";
import { getScopedGrade3StoryMeaning } from "@/src/curriculum/grade3/story/meaning";

export type MeaningContext = {
  gradeLevel?: string;
  worldId: string;
  topicLabel: string;
};

const FALLBACK_MEANING = "Let's learn together.";

type MeaningGetter = (topicLabel: string) => string | undefined | null;

const MEANING_GETTERS_BY_WORLD_ID: Record<string, MeaningGetter> = {
  "preschool-animal-adventure": getAnimalMeaning,
  "preschool-big-small": getSizeMeaning,
  "preschool-body-world": getBodyMeaning,
  "preschool-colorful-world": getColorMeaning,
  "preschool-counting-forest": getCountingMeaning,
  "preschool-family-world": getScopedFamilyMeaning,
  "preschool-food-town": getFoodMeaning,
  "preschool-fruit-garden": getFruitMeaning,
  "preschool-more-less": getQuantityMeaning,
  "preschool-number-village": getNumberMeaning,
  "preschool-pattern-playground": getPatternMeaning,
  "preschool-shape-kingdom": getShapeMeaning,
  "kindergarten-alphabet": getKindergartenAlphabetMeaning,
  "kindergarten-big-small": getKindergartenSizeMeaning,
  "kindergarten-community-village": getKindergartenCommunityMeaning,
  "kindergarten-more-less": getKindergartenQuantityMeaning,
  "kindergarten-nature": getKindergartenNatureMeaning,
  "kindergarten-number-adventure": getKindergartenMathMeaning,
  "kindergarten-number-forest": getKindergartenNumberMeaningByTopic,
  "kindergarten-patterns": getKindergartenPatternMeaning,
  "kindergarten-reading": getKindergartenReadingMeaning,
  "kindergarten-school": getKindergartenSchoolMeaning,
  "kindergarten-shapes": getKindergartenShapeMeaning,
  "grade1-family-story-village": getScopedGrade1FamilyStoryMeaning,
  "grade1-math": getScopedGrade1MathMeaning,
  "grade1-nature": getScopedGrade1NatureMeaning,
  "grade1-number-kingdom": getScopedGrade1NumberMeaning,
  "grade1-reading": getScopedGrade1ReadingMeaning,
  "grade1-shapes": getScopedGrade1ShapeMeaning,
  "grade1-time-town": getScopedGrade1TimeMeaning,
  "grade1-word-kingdom": getScopedWordKingdomMeaning,
  "grade2-challenge": getScopedGrade2ChallengeMeaning,
  "grade2-measurement": getScopedGrade2MeasurementMeaning,
  "grade2-multiplication": getScopedGrade2MultiplicationMeaning,
  "grade2-place-value": getScopedGrade2PlaceValueMeaning,
  "grade2-problems": getScopedGrade2ProblemSolvingMeaning,
  "grade2-story": getScopedGrade2StoryMeaning,
  "grade2-vocabulary": getScopedVocabularyMeaning,
  "grade3-context-clue-canyon": getScopedContextClueMeaning,
  "grade3-division": getScopedGrade3DivisionMeaning,
  "grade3-fractions": getScopedGrade3FractionMeaning,
  "grade3-master": getScopedGrade3ChallengeMeaning,
  "grade3-money": getScopedGrade3MoneyMeaning,
  "grade3-multiplication": getScopedGrade3MultiplicationMeaning,
  "grade3-number": getScopedGrade3NumberMeaning,
  "grade3-reading": getScopedReadingAdventureMeaning,
  "grade3-story-adventure": getScopedGrade3StoryMeaning,
};

export function getCurriculumMeaning(context: MeaningContext): string {
  const getter = MEANING_GETTERS_BY_WORLD_ID[context.worldId];
  const meaning = getter?.(context.topicLabel)?.replace(/\s+/g, " ").trim();

  return meaning || FALLBACK_MEANING;
}

export function getCurriculumMeaningSpeech(context: MeaningContext): string {
  const topic = context.topicLabel.replace(/\s+/g, " ").trim();
  const meaning = getCurriculumMeaning(context);

  return topic ? `${topic}. ${meaning}` : meaning;
}
