export type ActivityIntegrityChoice =
  | string
  | {
      concept?: string;
      id?: string;
      label?: string;
      text?: string;
      title?: string;
    };

export type ActivityIntegrityInput = {
  choices?: ActivityIntegrityChoice[];
  choiceLimit?: number;
  correctAnswer?: string;
  correctAnswerId?: string;
  correctAssetConcept?: string;
  distractorPool?: ActivityIntegrityChoice[];
  multiSelect?: boolean;
  targetConcept?: string;
};

export type ActivityIntegrityResult = {
  issues: string[];
  valid: boolean;
};

export type ActivityIntegrityRepairResult = ActivityIntegrityResult & {
  activity: ActivityIntegrityInput;
  repaired: boolean;
};

export const ALLOWED_CHOICE_COUNTS = [2, 4] as const;

export function isAllowedChoiceCount(count: number) {
  return ALLOWED_CHOICE_COUNTS.includes(count as (typeof ALLOWED_CHOICE_COUNTS)[number]);
}

export function getAllowedChoiceCount(count: number) {
  return count <= 2 ? 2 : 4;
}

function getStableHash(value: string) {
  return value.split("").reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0;
  }, 2166136261);
}

function getStableShuffledChoices<T>(items: T[], seed: string) {
  const shuffled = [...items];
  let state = getStableHash(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

const EQUIVALENT_WORDS: Record<string, string> = {
  huge: "big",
  large: "big",
  little: "small",
  tiny: "small",
};

export const GROUP_SCENE_CONCEPTS = new Set([
  "classroom",
  "community",
  "family",
  "friends",
  "school",
  "team",
]);

const GROUP_SCENE_ANSWERS: Record<string, Set<string>> = {
  classroom: new Set(["classroom", "classroom scene", "students in classroom"]),
  community: new Set(["community", "community scene", "people in community", "town scene"]),
  family: new Set(["family", "family group", "family members together", "family photo", "family scene"]),
  friends: new Set(["friends", "friends together", "group of friends"]),
  school: new Set(["school", "school scene"]),
  team: new Set(["team", "team together"]),
};

const PLACE_SCENE_ANSWERS: Record<string, Set<string>> = {
  home: new Set(["family house", "home", "home scene", "house"]),
};

export function normalizeActivityConcept(value?: string | null) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^what\s+(?:is|are)\s+/i, "")
    .replace(/^(?:a|an|the)\s+/i, "")
    .replace(/[?.!,]/g, "")
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => EQUIVALENT_WORDS[word] ?? word)
    .join(" ");
}

function getChoiceId(choice: ActivityIntegrityChoice) {
  return typeof choice === "string"
    ? choice
    : choice.id ?? choice.label ?? choice.text ?? choice.title ?? choice.concept ?? "";
}

function getChoiceConcept(choice: ActivityIntegrityChoice) {
  return typeof choice === "string"
    ? choice
    : choice.concept ?? choice.label ?? choice.text ?? choice.title ?? choice.id ?? "";
}

function conceptsAlign(candidate: string, target: string) {
  const normalizedCandidate = normalizeActivityConcept(candidate);
  const normalizedTarget = normalizeActivityConcept(target);

  if (!normalizedCandidate || !normalizedTarget) {
    return false;
  }

  if (normalizedCandidate === normalizedTarget) {
    return true;
  }

  return Boolean(
    GROUP_SCENE_ANSWERS[normalizedTarget]?.has(normalizedCandidate) ||
      PLACE_SCENE_ANSWERS[normalizedTarget]?.has(normalizedCandidate)
  );
}

export function validateActivityCorrectAnswer(
  activity: ActivityIntegrityInput
): ActivityIntegrityResult {
  const choices = activity.choices ?? [];
  const issues: string[] = [];
  const target = normalizeActivityConcept(activity.targetConcept ?? activity.correctAnswer);
  const correctAnswer = normalizeActivityConcept(activity.correctAnswer);
  const correctAnswerId = normalizeActivityConcept(activity.correctAnswerId);

  if (!target) {
    issues.push("Activity is missing a target concept.");
  }

  if (!choices.length) {
    issues.push("Activity has no choices.");
  }

  if (choices.length && !isAllowedChoiceCount(choices.length)) {
    issues.push("Activity choices must use exactly 2 or 4 answers.");
  }

  const correctMatches = choices.filter((choice) => {
    const id = normalizeActivityConcept(getChoiceId(choice));
    const concept = getChoiceConcept(choice);

    return Boolean(
      (correctAnswerId && id === correctAnswerId) ||
        (correctAnswer && conceptsAlign(concept, correctAnswer))
    );
  });

  if (!activity.multiSelect && correctMatches.length !== 1) {
    issues.push(`Activity must contain exactly one correct answer; found ${correctMatches.length}.`);
  }

  if (target) {
    const targetMatches = choices.filter(
      (choice) => conceptsAlign(getChoiceConcept(choice), target)
    );

    if (!activity.multiSelect && targetMatches.length !== 1) {
      issues.push(`Target concept must appear exactly once; found ${targetMatches.length}.`);
    }
  }

  const normalizedChoices = choices.map((choice) =>
    normalizeActivityConcept(getChoiceConcept(choice))
  );

  if (new Set(normalizedChoices).size !== normalizedChoices.length) {
    issues.push("Choices contain duplicate or equivalent answers.");
  }

  if (
    activity.correctAssetConcept &&
    target &&
    !conceptsAlign(activity.correctAssetConcept, target)
  ) {
    issues.push("Correct visual does not match the target concept.");
  }

  if (target && correctAnswer && !conceptsAlign(correctAnswer, target)) {
    issues.push("Correct answer does not match the target concept.");
  }

  return {
    issues,
    valid: issues.length === 0,
  };
}

export function repairChoicesForTarget(
  activity: ActivityIntegrityInput
): ActivityIntegrityRepairResult {
  const originalChoices = activity.choices ?? [];
  const target = activity.targetConcept ?? activity.correctAnswer ?? "";
  const correctAnswer = activity.correctAnswer ?? target;
  const requestedCount = activity.choiceLimit ?? originalChoices.length;
  const desiredCount = getAllowedChoiceCount(requestedCount);
  const candidates = [...originalChoices, ...(activity.distractorPool ?? [])];
  const correctChoice =
    candidates.find((choice) => conceptsAlign(getChoiceConcept(choice), correctAnswer)) ??
    correctAnswer;
  const repairedChoices: ActivityIntegrityChoice[] = [];
  const seen = new Set<string>();

  const addChoice = (choice: ActivityIntegrityChoice, allowCorrect: boolean) => {
    const concept = getChoiceConcept(choice).trim();
    const normalized = normalizeActivityConcept(concept);

    if (
      !normalized ||
      seen.has(normalized) ||
      (!allowCorrect && conceptsAlign(concept, target))
    ) {
      return;
    }

    seen.add(normalized);
    repairedChoices.push(choice);
  };

  addChoice(correctChoice, true);
  candidates.forEach((choice) => {
    if (repairedChoices.length < desiredCount) {
      addChoice(choice, false);
    }
  });

  const repairedActivity: ActivityIntegrityInput = {
    ...activity,
    choices: getStableShuffledChoices(
      repairedChoices,
      [
        "activity-choice-order",
        normalizeActivityConcept(target),
        normalizeActivityConcept(correctAnswer),
        desiredCount,
      ].join("|")
    ),
    correctAnswer,
    targetConcept: target,
  };
  const validation = validateActivityCorrectAnswer(repairedActivity);
  const repaired =
    originalChoices.length !== repairedChoices.length ||
    originalChoices.some((choice, index) => choice !== repairedChoices[index]);

  return {
    ...validation,
    activity: repairedActivity,
    repaired,
  };
}
