type QuizCategory = "linguistic" | "numeric";

interface QuizQuestion {
  q: string;
  options: string[];
  a: string;
}

function toAsciiQuestion(question: string) {
  return question.replace(/Ã·/g, "/").replace(/×/g, "x");
}

export function getQuizHints(
  category: QuizCategory,
  question: QuizQuestion
): string[] {
  const prompt = toAsciiQuestion(question.q);
  const answer = question.a;

  if (category === "numeric") {
    if (prompt.includes("+")) {
      return [
        "Try putting the two numbers together slowly in your head or on your fingers.",
        `The total is more than ${Math.max(Number(answer) - 2, 0)}.`,
      ];
    }

    if (prompt.includes("-")) {
      return [
        "Start with the bigger number, then count backward.",
        `The answer is smaller than ${Number(answer) + 2}.`,
      ];
    }

    if (/x|\*/i.test(prompt)) {
      return [
        "Think of multiplication as equal groups added together.",
        `The answer has ${answer.length} digit${answer.length === 1 ? "" : "s"}.`,
      ];
    }

    if (prompt.includes("/")) {
      return [
        "Imagine sharing the number into equal groups.",
        `The answer is an even share that matches ${answer}.`,
      ];
    }

    return [
      "Read each number carefully and try the problem one step at a time.",
      `The correct answer is close to ${answer}.`,
    ];
  }

  return [
    "Think about the meaning of the word in the question and choose the best match.",
    `The correct answer starts with "${answer.charAt(0)}".`,
  ];
}
