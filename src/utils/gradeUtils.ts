import type { GradeLevel } from "@/src/types/learning";
import type { LearnerGradeLevel } from "@/src/types/user";

const GRADE_LABELS: Record<GradeLevel, LearnerGradeLevel> = {
  preschool: "Preschool",
  kindergarten: "Kindergarten",
  grade1: "Grade 1",
  grade2: "Grade 2",
  grade3: "Grade 3",
};

export function formatGradeLabel(gradeLevel: GradeLevel): string {
  switch (gradeLevel) {
    case "preschool":
      return "Preschool";
    case "kindergarten":
      return "Kindergarten";
    case "grade1":
      return "Grade 1";
    case "grade2":
      return "Grade 2";
    case "grade3":
      return "Grade 3";
    default:
      return "Learner";
  }
}

export function toGradeLevel(value?: GradeLevel | LearnerGradeLevel | string | null): GradeLevel {
  switch (value) {
    case "preschool":
    case "Preschool":
      return "preschool";
    case "kindergarten":
    case "Kindergarten":
      return "kindergarten";
    case "grade1":
    case "Grade 1":
      return "grade1";
    case "grade2":
    case "Grade 2":
      return "grade2";
    case "grade3":
    case "Grade 3":
      return "grade3";
    default:
      return "preschool";
  }
}

export function gradeLevelToLearnerGradeLabel(gradeLevel: GradeLevel): LearnerGradeLevel {
  return GRADE_LABELS[gradeLevel];
}
