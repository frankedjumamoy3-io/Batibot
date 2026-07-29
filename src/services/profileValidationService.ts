import {
  LEARNER_GRADE_LEVELS,
  isLearnerGradeLevel,
  type LearnerGradeLevel,
} from "@/src/types/user";

export const PROFILE_NAME_MAX_LENGTH = 20;

export interface LearnerAvatarOption {
  category: "animal" | "fruit" | "friendly";
  emoji: string;
  id: string;
  label: string;
}

export interface LearnerProfileDraft {
  avatarCategory?: LearnerAvatarOption["category"] | null;
  avatarId?: string | null;
  displayName?: string | null;
  gradeLevel?: LearnerGradeLevel | null;
}

export function normalizeLearnerName(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, PROFILE_NAME_MAX_LENGTH);
}

export function validateLearnerName(value: string) {
  const normalized = value.trim().replace(/\s+/g, " ");

  if (!normalized) {
    return "Type your first name.";
  }

  if (normalized.length > PROFILE_NAME_MAX_LENGTH) {
    return "Use 20 characters or fewer.";
  }

  return null;
}

export function validateLearnerGrade(value: unknown) {
  return isLearnerGradeLevel(value) ? null : "Choose one grade.";
}

export function validateLearnerAvatar(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? null
    : "Choose one avatar.";
}

export function validateLearnerProfileDraft(draft: LearnerProfileDraft) {
  const errors: string[] = [];
  const nameError = validateLearnerName(draft.displayName ?? "");
  const gradeError = validateLearnerGrade(draft.gradeLevel);
  const avatarError = validateLearnerAvatar(draft.avatarId);

  if (nameError) {
    errors.push(nameError);
  }

  if (gradeError) {
    errors.push(gradeError);
  }

  if (avatarError) {
    errors.push(avatarError);
  }

  return {
    errors,
    isValid: errors.length === 0,
  };
}

export function getGradePreview(gradeLevel: LearnerGradeLevel) {
  switch (gradeLevel) {
    case "Preschool":
      return "Pictures, words, numbers, colors, shapes";
    case "Kindergarten":
      return "Letters, sounds, counting, stories";
    case "Grade 1":
      return "Reading words, sentences, number sense";
    case "Grade 2":
      return "Comprehension, math models, reasoning";
    case "Grade 3":
      return "Passages, vocabulary, evidence, strategy";
    default:
      return LEARNER_GRADE_LEVELS.join(", ");
  }
}
