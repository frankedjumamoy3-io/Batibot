import { useEffect, useMemo, useState } from "react";
import { getGradeQuizPresets } from "@/src/data/learner-module";
import type { QuizPreset } from "@/src/data/quiz";
import { subscribeToPublishedCuratedQuizPresets } from "@/src/services/curatedQuizLearnerService";
import type { LearnerGradeLevel } from "@/src/types/user";

export function useGradeQuizzes(grade?: LearnerGradeLevel | null) {
  const [remote, setRemote] = useState<QuizPreset[]>([]);
  useEffect(() => subscribeToPublishedCuratedQuizPresets(setRemote, { gradeLevel: grade ?? "Preschool" }), [grade]);
  return useMemo(() => [
    ...remote.filter(quiz => quiz.learnerLevel === (grade ?? "Preschool") && quiz.questions.every(q =>
      // The existing quiz screen renders text choices. Other interaction types
      // stay in their purpose-built lesson renderers.
      ["multipleChoice", "trueFalse", "wordProblem"].includes(q.type)
    )),
    ...getGradeQuizPresets(grade).slice(0, 6),
  ], [grade, remote]);
}
