export type CurriculumDomainId = "linguistic" | "numeric";

export type CurriculumLevelId =
  | "preschool"
  | "kindergarten"
  | "grade1"
  | "grade2"
  | "grade3";

type CurriculumLevel = {
  focus: string;
  label: string;
  subjects: string[];
};

type CurriculumDomain = {
  corePurpose: string[];
  exampleSubjects: string[];
  keyCompetencies: string[];
  label: string;
  levels: CurriculumLevel[];
  summary: string;
};

export const PH_CURRICULUM_FRAMEWORK: {
  audience: string;
  domains: Record<CurriculumDomainId, CurriculumDomain>;
  integratedSubjects: string[];
  keyInsight: string[];
  title: string;
} = {
  title: "Philippines Preschool to Grade 3 Curriculum",
  audience: "Target learners: Preschool to Grade 3",
  domains: {
    linguistic: {
      label: "Linguistic",
      summary: "Language, communication, reading, writing, and contextual expression.",
      corePurpose: [
        "Develop communication skills.",
        "Build reading comprehension.",
        "Strengthen writing ability.",
        "Support cultural and contextual language use.",
      ],
      exampleSubjects: ["Mother Tongue", "Filipino", "English"],
      keyCompetencies: [
        "Phonemic awareness",
        "Vocabulary acquisition",
        "Grammar and syntax",
        "Reading comprehension",
        "Writing composition",
      ],
      levels: [
        {
          label: "Preschool",
          focus: "Listening, speaking, early expression, and picture-supported meaning.",
          subjects: ["Oral language", "Storytelling", "Listening", "Pre-writing"],
        },
        {
          label: "Kindergarten",
          focus: "Listening, speaking, vocabulary building, and pre-writing routines.",
          subjects: [
            "Mother Tongue oral language",
            "Storytelling and listening",
            "Vocabulary building",
            "Drawing and tracing",
          ],
        },
        {
          label: "Grade 1",
          focus: "Word reading, alphabet knowledge, phonics, and basic writing.",
          subjects: ["Mother Tongue (MTB-MLE)", "Filipino oral skills", "English alphabet and phonics"],
        },
        {
          label: "Grade 2",
          focus: "Sentence comprehension, reading fluency, and early written expression.",
          subjects: ["Mother Tongue reading fluency", "Filipino sentence construction", "English reading and writing"],
        },
        {
          label: "Grade 3",
          focus: "Reading comprehension, vocabulary through context, story understanding, and short written response.",
          subjects: ["English reading comprehension", "Context clue vocabulary", "Story elements and moral lessons"],
        },
      ],
    },
    numeric: {
      label: "Numeric",
      summary: "Mathematics, logical thinking, number sense, and quantitative reasoning.",
      corePurpose: [
        "Develop number sense.",
        "Build problem-solving skills.",
        "Strengthen logical reasoning.",
        "Support quantitative analysis.",
      ],
      exampleSubjects: ["Mathematics"],
      keyCompetencies: [
        "Number operations",
        "Pattern recognition",
        "Measurement",
        "Spatial awareness",
        "Logical reasoning",
      ],
      levels: [
        {
          label: "Preschool",
          focus: "Sorting, comparing, matching, and noticing quantity in playful contexts.",
          subjects: ["Counting play", "Sorting", "Patterns", "Shape recognition"],
        },
        {
          label: "Kindergarten",
          focus: "Counting, sorting, patterns, and shape recognition.",
          subjects: ["Counting", "Sorting and patterns", "Shape recognition"],
        },
        {
          label: "Grade 1",
          focus: "Numbers to 100, basic operations, shapes, and measurement.",
          subjects: ["Numbers 0-100", "Basic addition and subtraction", "Shapes and measurement"],
        },
        {
          label: "Grade 2",
          focus: "Applied operations with larger numbers, time, and money.",
          subjects: ["Numbers up to 1,000", "Addition and subtraction with regrouping", "Time and money"],
        },
        {
          label: "Grade 3",
          focus: "Problem-solving with multiplication, division, fractions, measurement, and geometry.",
          subjects: ["Multiplication and division", "Introductory fractions", "Measurement and geometry"],
        },
      ],
    },
  },
  integratedSubjects: ["Science", "Araling Panlipunan", "MAPEH", "ESP"],
  keyInsight: [
    "Linguistic = how learners express and understand.",
    "Numeric = how learners compute and reason.",
    "Both domains develop in parallel and reinforce each other.",
  ],
};

export function getCurriculumDomainSummary(domain: CurriculumDomainId) {
  return PH_CURRICULUM_FRAMEWORK.domains[domain];
}

export function getCurriculumPromptContext() {
  const linguistic = PH_CURRICULUM_FRAMEWORK.domains.linguistic;
  const numeric = PH_CURRICULUM_FRAMEWORK.domains.numeric;

  return [
    `${PH_CURRICULUM_FRAMEWORK.title}.`,
    PH_CURRICULUM_FRAMEWORK.audience,
    `Linguistic domain focus: ${linguistic.summary}`,
    `Linguistic competencies: ${linguistic.keyCompetencies.join(", ")}.`,
    `Numeric domain focus: ${numeric.summary}`,
    `Numeric competencies: ${numeric.keyCompetencies.join(", ")}.`,
    `Integrated support subjects: ${PH_CURRICULUM_FRAMEWORK.integratedSubjects.join(", ")}.`,
    `Key insight: ${PH_CURRICULUM_FRAMEWORK.keyInsight.join(" ")}`,
  ].join(" ");
}
