export interface CompleteLessonNodeInput {
  answerLabel: string;
  completedNodes: boolean[];
  correct: boolean;
  correctNodes: boolean[];
  nodeIndex: number;
  selectedAnswers: (string | null)[];
}

export interface CompleteLessonNodeResult {
  completedNodes: boolean[];
  correctNodes: boolean[];
  selectedAnswers: (string | null)[];
  wrongAnswer: string | null;
}

export function completeLessonNode({
  answerLabel,
  completedNodes,
  correct,
  correctNodes,
  nodeIndex,
  selectedAnswers,
}: CompleteLessonNodeInput): CompleteLessonNodeResult {
  return {
    completedNodes: completedNodes.map((done, index) =>
      index === nodeIndex ? true : done
    ),
    correctNodes: correctNodes.map((done, index) =>
      index === nodeIndex ? correct : done
    ),
    selectedAnswers: selectedAnswers.map((answer, index) =>
      index === nodeIndex ? answerLabel : answer
    ),
    wrongAnswer: correct ? null : answerLabel,
  };
}
