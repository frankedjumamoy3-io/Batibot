import type {
  ActiveLearningPhase,
  FrameworkStageLabel,
} from "@/src/data/curriculum/learning-path";
import { getFallbackIconForLabel } from "@/src/data/assets/fallback-icon-map";

export type CurriculumPlaceholderAsset = {
  iconName: string;
  label: string;
};

export type EducationalFallbackActivity = {
  action: string;
  choices: [string, string];
  concept: string;
  correctAnswer: string;
  iconName: string;
  statement: string;
};

export const CURRICULUM_PLACEHOLDER_ASSETS: Record<string, CurriculumPlaceholderAsset> = {
  "preschool-family-world": { iconName: "mdi:account-group", label: "Family learning picture" },
  "preschool-body-world": { iconName: "mdi:human-handsup", label: "Body learning picture" },
  "preschool-colorful-world": { iconName: "mdi:palette", label: "Color learning picture" },
  "preschool-shape-kingdom": { iconName: "mdi:shape-outline", label: "Shape learning picture" },
  "preschool-animal-adventure": { iconName: "mdi:paw", label: "Animal learning picture" },
  "preschool-fruit-garden": { iconName: "mdi:food-apple", label: "Fruit learning picture" },
  "preschool-food-town": { iconName: "mdi:food", label: "Food learning picture" },
  "preschool-number-village": { iconName: "mdi:numeric", label: "Number learning picture" },
  "kindergarten-alphabet": { iconName: "mdi:alphabetical", label: "Alphabet learning picture" },
  "kindergarten-school": { iconName: "mdi:school", label: "School learning picture" },
  "kindergarten-nature": { iconName: "mdi:tree", label: "Nature learning picture" },
  "kindergarten-community-village": { iconName: "mdi:account-group", label: "Community learning picture" },
  "kindergarten-number-forest": { iconName: "mdi:counter", label: "Counting learning picture" },
  "kindergarten-shapes": { iconName: "mdi:shape-outline", label: "Shape learning picture" },
  "kindergarten-patterns": { iconName: "mdi:shape-plus", label: "Pattern learning picture" },
  "kindergarten-number-adventure": { iconName: "mdi:numeric", label: "Number learning picture" },
  "kindergarten-reading-readiness": { iconName: "mdi:book-open-page-variant", label: "Reading learning picture" },
  "kindergarten-problem-solving": { iconName: "mdi:lightbulb-on-outline", label: "Thinking learning picture" },
  "grade1-word-kingdom": { iconName: "mdi:format-letter-case", label: "Word learning picture" },
  "grade1-reading": { iconName: "mdi:book-open-page-variant", label: "Reading learning picture" },
  "grade1-number-kingdom": { iconName: "mdi:numeric", label: "Number learning picture" },
  "grade1-math": { iconName: "mdi:calculator-variant-outline", label: "Math learning picture" },
  "grade1-family-story-village": { iconName: "mdi:book-open-variant", label: "Story learning picture" },
  "grade1-time-town": { iconName: "mdi:clock-outline", label: "Time learning picture" },
  "grade1-shapes": { iconName: "mdi:shape-outline", label: "Shape learning picture" },
  "grade1-nature": { iconName: "mdi:tree", label: "Nature learning picture" },
  "grade2-vocabulary": { iconName: "mdi:format-letter-case", label: "Vocabulary learning picture" },
  "grade2-community-explorer": { iconName: "mdi:map-marker-radius-outline", label: "Community learning picture" },
  "grade2-place-value": { iconName: "mdi:abacus", label: "Place value learning picture" },
  "grade2-problems": { iconName: "mdi:lightbulb-on-outline", label: "Problem solving picture" },
  "grade2-measurement": { iconName: "mdi:ruler", label: "Measurement learning picture" },
  "grade2-multiplication": { iconName: "mdi:multiplication", label: "Multiplication learning picture" },
  "grade2-challenge": { iconName: "mdi:flag-checkered", label: "Challenge learning picture" },
  "grade2-story": { iconName: "mdi:book-open-variant", label: "Story learning picture" },
  "grade3-reading": { iconName: "mdi:book-open-page-variant", label: "Reading learning picture" },
  "grade3-context-clue-canyon": { iconName: "mdi:text-search", label: "Context clue learning picture" },
  "grade3-story-adventure": { iconName: "mdi:book-open-variant", label: "Story learning picture" },
  "grade3-number": { iconName: "mdi:numeric", label: "Number learning picture" },
  "grade3-multiplication": { iconName: "mdi:multiplication", label: "Multiplication learning picture" },
  "grade3-division": { iconName: "mdi:division", label: "Division learning picture" },
  "grade3-fractions": { iconName: "mdi:chart-pie", label: "Fraction learning picture" },
  "grade3-money": { iconName: "mdi:cash-multiple", label: "Money learning picture" },
  "grade3-master": { iconName: "mdi:trophy-outline", label: "Mastery learning picture" },
};

const PHASE_ACTIONS: Record<ActiveLearningPhase | FrameworkStageLabel, (concept: string) => string> = {
  Challenge: (concept) => `Use what you know about ${concept}.`,
  CHOOSE: (concept) => `Choose ${concept}.`,
  Discover: (concept) => `Look at ${concept}.`,
  Explore: (concept) => `Tap ${concept}.`,
  Interact: (concept) => `Find ${concept}.`,
  LOOK: (concept) => `Look at ${concept}.`,
  Mastery: (concept) => `Show what you know about ${concept}.`,
  MASTERED: (concept) => `Show what you know about ${concept}.`,
  PLAY: (concept) => `Use what you know about ${concept}.`,
  Practice: (concept) => `Choose ${concept}.`,
  Progress: (concept) => `See your ${concept} progress.`,
  PROGRESS: (concept) => `See your ${concept} progress.`,
  Reward: (concept) => `Celebrate learning ${concept}.`,
  STAR: (concept) => `Celebrate learning ${concept}.`,
  TAP: (concept) => `Tap ${concept}.`,
  TRY: (concept) => `Find ${concept}.`,
};

function cleanConcept(value?: string | null) {
  return (
    value
      ?.trim()
      .replace(/^What\s+(?:is|are)\s+/i, "")
      .replace(/\?+$/, "")
      .replace(/\s+(?:challenge|mastery)$/i, "")
      .trim() || "Learning"
  );
}

function getStatement(concept: string) {
  const normalized = concept.toLowerCase();

  if (normalized === "family") return "This is a family.";
  if (normalized.includes("eye")) return "Blink your eyes two times.";
  if (normalized === "red") return "Find something red around you.";
  if (normalized.includes("circle")) return "Can you find a circle nearby?";
  if (normalized === "dog") return "Tap the dog.";
  if (normalized.includes("number") || /^\d+$/.test(normalized)) return `Count with ${concept}.`;
  if (normalized.includes("story") || normalized.includes("reading")) return `Read and think about ${concept}.`;

  return `Let us learn about ${concept}.`;
}

export function getCurriculumPlaceholderAsset(worldId?: string | null, label?: string | null) {
  const configured = worldId ? CURRICULUM_PLACEHOLDER_ASSETS[worldId] : undefined;
  const safeLabel = cleanConcept(label ?? configured?.label);

  return (
    configured ?? {
      iconName: getFallbackIconForLabel(safeLabel),
      label: `${safeLabel} learning picture`,
    }
  );
}

export function getEducationalFallbackActivity({
  concept,
  phase = "LOOK",
  worldId,
}: {
  concept?: string | null;
  phase?: ActiveLearningPhase | FrameworkStageLabel;
  worldId?: string | null;
}): EducationalFallbackActivity {
  const safeConcept = cleanConcept(concept);
  const placeholder = getCurriculumPlaceholderAsset(worldId, safeConcept);

  return {
    action: PHASE_ACTIONS[phase](safeConcept),
    choices: [safeConcept, "Another answer"],
    concept: safeConcept,
    correctAnswer: safeConcept,
    iconName: worldId ? placeholder.iconName : getFallbackIconForLabel(safeConcept),
    statement: getStatement(safeConcept),
  };
}
