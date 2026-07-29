const admin = require("firebase-admin");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

admin.initializeApp();

const geminiApiKey = defineSecret("GEMINI_API_KEY");
const DEFAULT_ADMIN_EMAILS = ["admin@batibot.app", "admin123@gmail.com"];
const GEMINI_MODEL = "gemini-1.5-flash";
const QUIZ_GENERATION_PROMPT_VERSION = "2026-06-batibot-curriculum-intelligence-api-v4";
const MIN_QUESTION_QUALITY_SCORE = 0.72;
const REQUIRED_CHOICE_COUNT = 4;
const BUILT_IN_QUIZ_STYLE_GUIDE = [
  "Built-in BatiBot quiz style guide:",
  "Use short learner-facing prompts only. Do not include admin labels, item numbers, generic topic checks, or draft wording.",
  "Preferred vocabulary prompt patterns: 'Clue: ... Which word is it?', 'This word means: ... Which word matches?', 'Which word means ...?', 'Which thing can you use to ...?', and 'Choose the best word: ... ___.'.",
  "Preferred numeracy prompt patterns: 'There are ... How many ...?', 'Start with ... How many are left?', 'Which is more: ...?', 'Which is less: ...?', and 'Which number ...?'.",
  "Preferred listening and speaking patterns: 'Listen and choose the word.' and 'Say the word: ...'.",
  "Choices should look like built-in choices: exactly four compact options, same answer format, one correct answer, and three plausible but clearly wrong distractors from the same preset scope when possible.",
  "Explanations should be one short sentence that confirms the answer using the same word, meaning, clue, or number relationship.",
].join(" ");

const BATIBOT_ADMIN_PROMPT_PIPELINE =
  "Admin -> BatiBot Curriculum Intelligence API -> Gemini -> Validator -> Review -> Published";
const BATIBOT_CURRICULUM_INTELLIGENCE_PIPELINE =
  "Admin -> BatiBot Curriculum Intelligence API -> Gemini API -> Draft Validator -> Admin Review -> Published Play Content";

const BATIBOT_CURRICULUM_INTELLIGENCE_SERVICES = [
  "Curriculum Service stores levels, worlds, topics, and competency traces.",
  "Active Learning Framework Service stores Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery rules.",
  "Learning Template Service returns reusable grade/topic phase templates.",
  "Cognitive Rules Engine constrains allowed actions, reading length, reasoning depth, and blocked formats by grade.",
  "UI/UX Metadata Service resolves font scale, button size, audio behavior, theme behavior, animation, rewards, and accessibility by grade.",
  "Gamification Service resolves XP, stars, levels, badges, achievements, rewards, streaks, and unlockables.",
  "Progression Service resolves unlock requirements, mastery requirements, topic completion, world completion, and level completion rules.",
  "AI Context Builder converts admin selections into a Gemini-ready curriculum contract.",
  "Gemini Generator Service sends constrained draft requests through the secure backend.",
  "Draft Validator checks age suitability, curriculum alignment, phase fit, difficulty, asset fit, mobile preview, and content format.",
  "Draft Management stores draft, review, needs-fix, published, and archived states.",
  "Content Publishing publishes only validated content to the matching Play placement.",
  "Admin Monitoring stores learner monitoring, progress monitoring, content monitoring, publishing monitoring, analytics, reports, and validation logs.",
  "User Profiles, Progress Tracking, Gamification, Ranking, and Admin Monitoring connect published content to learner outcomes.",
];

const BATIBOT_MINIMUM_API_DATA = [
  "Levels",
  "Worlds",
  "Topics",
  "Framework Rules",
  "Learning Templates",
  "Cognitive Rules",
  "UI/UX Rules",
  "Gamification Rules",
  "Progression Rules",
  "AI Curation Rules",
  "Validation Rules",
  "Admin Monitoring Rules",
  "Publishing Rules",
  "Users",
  "Progress",
  "XP",
  "Stars",
  "Badges",
  "Achievements",
  "Drafts",
  "Published Content",
  "Analytics",
];

const BATIBOT_ADMIN_PROMPT_MODULES = [
  {
    title: "BatiBot Source Of Truth",
    prompt:
      "You are generating an unpublished BatiBot admin draft. BatiBot owns the curriculum, Play-map placement, phase rules, UI format, safety checks, reward logic, and publishing decision. Gemini only assists with draft content.",
  },
  {
    title: "Rank / Play / Reward Alignment",
    prompt:
      "The learner app is Rank / Play / Reward. Learn and Quiz are internal Play actions. All generated content must appear as Play content mapped to Grade > World > Topic > Phase > Node, with Rank and Reward impact described structurally.",
  },
  {
    title: "Active Learning Phase Fit",
    prompt:
      "Use the selected BatiBot phase only: Discover, Explore, Interact, Practice, Challenge, Reward, Progress, or Mastery. Practice repeats known content with support. Challenge checks known content with less guidance and introduces no new content.",
  },
  {
    title: "Child Action And Mobile UI",
    prompt:
      "Every item must use one clear child action such as Tap, Match, Count, Say, Compare, Choose, or Complete. Use short child-facing copy, large-choice or matching surfaces, audio/speech controls when required, and no dense adult instructions.",
  },
  {
    title: "Known Content And Asset Contract",
    prompt:
      "Use only the approved Learning Worlds word set, topic, asset contract, and competency context supplied by BatiBot. Image-based items must include an approved asset mapping or exact asset prompt for admin approval; do not invent live URLs.",
  },
  {
    title: "Reward And Rank Impact",
    prompt:
      "Return structured reward impact: XP, stars, badge or mastery effect, rank progress, reward progress, and next unlock. XP must feel consistent with similar phase, grade, and activity difficulty.",
  },
  {
    title: "Validator And Review Metadata",
    prompt:
      "For every question, include sourceVocabularyWord, vocabularyUsed, targetSkill, reasoningType, questionIntent, quality scores, level-fit explanation, alignment notes, answer justification, distractor notes, and validation flags when risk exists.",
  },
  {
    title: "Structured JSON Only",
    prompt:
      "Return JSON only. Do not include markdown, commentary, admin instructions to the learner, publication claims, secrets, or hidden reasoning. The admin review screen and validator decide whether content can be published.",
  },
];

const QUESTION_REASONING_TYPES = [
  "recognition",
  "matching",
  "classification",
  "counting",
  "comparison",
  "sequencing",
  "addition",
  "short_scenario",
  "mixed_review",
];

const LEVEL_GENERATION_RULES = {
  starter:
    "numbers 1-3; exactly 4 choices with very obvious distractors; 3-6 words; single-step recognition only; target difficultyScore 0.05-0.2",
  beginner:
    "numbers 1-5; exactly 4 choices with familiar distractors; short familiar sentences; single-step recall or matching; target difficultyScore 0.15-0.35",
  developing:
    "numbers 1-10; exactly 4 choices; one clue; one small inference; target difficultyScore 0.3-0.5",
  intermediate:
    "numbers 1-20; exactly 4 choices; short problem statements; one-step reasoning; target difficultyScore 0.45-0.65",
  advanced:
    "numbers 1-50; 4 choices; applied scenarios; two-step reasoning; target difficultyScore 0.6-0.8",
  challenge:
    "mixed early learner range; 4 choices; mixed review; multi-skill reasoning without trick questions; target difficultyScore 0.75-0.95",
};

const quizResponseSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    objective: { type: "string" },
    instructions: { type: "string" },
    notes: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: [
              "multiple-choice",
              "fill-in-the-blank",
              "matching",
              "image-to-word",
              "word-to-image",
              "true-or-false",
              "word-problem",
              "ordering",
              "counting-objects",
              "compare-numbers",
              "picture-based",
              "scenario",
              "text-to-speech",
              "speech-to-text",
              "image-choice",
              "timed-challenge",
            ],
          },
          prompt: { type: "string" },
          options: {
            type: "array",
            items: { type: "string" },
          },
          answer: { type: "string" },
          audioText: { type: "string" },
          helperText: { type: "string" },
          imageLabel: { type: "string" },
          sentence: { type: "string" },
          wordBank: {
            type: "array",
            items: { type: "string" },
          },
          instruction: { type: "string" },
          pairs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                left: { type: "string" },
                right: { type: "string" },
                leftType: {
                  type: "string",
                  enum: ["text", "word", "image"],
                },
                rightType: {
                  type: "string",
                  enum: ["text", "word", "image"],
                },
                word: { type: "string" },
                imagePrompt: { type: "string" },
                altText: { type: "string" },
                assetId: { type: "string" },
              },
            },
          },
          explanation: { type: "string" },
          learningObjective: { type: "string" },
          targetSkill: { type: "string" },
          reasoningType: {
            type: "string",
            enum: QUESTION_REASONING_TYPES,
          },
          cognitiveSkill: { type: "string" },
          questionIntent: { type: "string" },
          difficultyScore: { type: "number" },
          levelFitScore: { type: "number" },
          qualityScore: { type: "number" },
          alignmentScore: { type: "number" },
          clarityScore: { type: "number" },
          depthScore: { type: "number" },
          uniquenessScore: { type: "number" },
          answerValidityScore: { type: "number" },
          ageFitScore: { type: "number" },
          levelFitExplanation: { type: "string" },
          alignmentNotes: { type: "string" },
          whyThisAnswerIsCorrect: { type: "string" },
          whyDistractorsAreWrong: { type: "string" },
          validationFlags: {
            type: "array",
            items: { type: "string" },
          },
          vocabularyUsed: {
            type: "array",
            items: { type: "string" },
          },
          sourceQuestionSeedId: { type: "string" },
          sourceVocabularyWord: { type: "string" },
        },
        required: ["type", "prompt"],
      },
    },
  },
  required: ["title", "objective", "instructions", "questions"],
};

function setCorsHeaders(response) {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.set("Access-Control-Allow-Methods", "POST, OPTIONS");
}

function getBearerToken(request) {
  const header = request.get("Authorization") || "";
  const [scheme, token] = header.split(" ");

  return scheme === "Bearer" && token ? token : null;
}

async function requireAdmin(request) {
  const token = getBearerToken(request);

  if (!token) {
    throw new Error("Missing Firebase auth token.");
  }

  const decodedToken = await admin.auth().verifyIdToken(token);
  const allowedAdminEmails = [
    ...DEFAULT_ADMIN_EMAILS,
    ...(process.env.BATIBOT_ADMIN_EMAIL || "").split(","),
  ]
    .map((email) => String(email || "").trim().toLowerCase())
    .filter(Boolean);
  const userEmail = (decodedToken.email || "").trim().toLowerCase();

  if (!allowedAdminEmails.includes(userEmail)) {
    throw new Error("Admin access is restricted to the approved admin account.");
  }

  return decodedToken;
}

function buildPrompt(body) {
  const topic = String(body.topic || "").trim();
  const adminPrompt = String(body.adminPrompt || "").trim();
  const ageGroup = String(body.ageGroup || "Preschool to Grade 3").trim();
  const category = String(body.category || "linguistic").trim();
  const curriculumLevel = Number(body.curriculumLevel) || 1;
  const difficulty = String(body.difficulty || "beginner").trim();
  const learnerLevel = String(body.learnerLevel || "beginner").trim();
  const objective = String(body.objective || "").trim();
  const notes = String(body.notes || "").trim();
  const language = String(body.language || "english").trim();
  const mediaRequired = String(body.mediaRequired || "none").trim();
  const skillTag = String(body.skillTag || "").trim();
  const vocabularyMode = String(body.vocabularyMode || "selected_topic_only").trim();
  const curriculumContract = body.curriculumContract || null;
  const questionCount = Number(body.questionCount) || 5;
  const questionTypes = Array.isArray(body.questionTypes)
    ? body.questionTypes.join(", ")
    : "multiple-choice";
  const vocabularyContext = Array.isArray(body.vocabularyContext)
    ? body.vocabularyContext
        .slice(0, 20)
        .map((item) => {
          const word = String(item?.word || "").trim();
          const subcategory = String(item?.subcategory || "").trim();
          const level = String(item?.learnerLevel || "").trim();
          const objective = String(item?.curriculumObjective || "").trim();
          const meaning = String(item?.meaning || "").trim();
          const sample = String(item?.sample || "").trim();
          const clue = String(item?.clue || "").trim();
          const imagePrompt = String(item?.imagePrompt || "").trim();
          const questionSeeds = Array.isArray(item?.questionSeeds)
            ? item.questionSeeds
                .slice(0, 3)
                .map((seed) => {
                  const seedId = String(seed?.id || "").trim();
                  const prompt = String(seed?.prompt || "").trim();
                  const answer = String(seed?.answer || "").trim();
                  const reasoning = String(seed?.reasoningType || "").trim();
                  const level = String(seed?.learnerLevel || "").trim();
                  const skill = String(seed?.cognitiveSkill || "").trim();

                  return `{id:${seedId}; prompt:${prompt}; answer:${answer}; reasoning:${reasoning}; level:${level}; skill:${skill}}`;
                })
                .join(" ")
            : "";

          return [
            `word=${word}`,
            `subcategory=${subcategory}`,
            `level=${level}`,
            `objective=${objective}`,
            `meaning=${meaning}`,
            `sample=${sample}`,
            `clue=${clue}`,
            `imagePrompt=${imagePrompt}`,
            `miniQuestionSeeds=${questionSeeds}`,
          ].join("; ");
        })
        .join(" || ")
    : "No approved vocabulary context was provided.";
  const requiredLearningWorldsWordSet = Array.isArray(body.vocabularyContext)
    ? body.vocabularyContext
        .map((item) => String(item?.word || "").trim())
        .filter(Boolean)
        .join(", ")
    : "none";

  return [
    "You are helping an administrator curate Play content for BatiBot, an early learner Rank / Play / Reward app.",
    "The BatiBot API is a Curriculum Intelligence API, not a plain CRUD API.",
    "You are downstream from the BatiBot Curriculum Intelligence API. Treat curriculumContract as the source of truth when present.",
    `Required admin workflow: ${BATIBOT_ADMIN_PROMPT_PIPELINE}.`,
    `Curriculum Intelligence pipeline: ${BATIBOT_CURRICULUM_INTELLIGENCE_PIPELINE}.`,
    `Curriculum Intelligence services: ${BATIBOT_CURRICULUM_INTELLIGENCE_SERVICES.join(" ")}`,
    `Minimum API data: ${BATIBOT_MINIMUM_API_DATA.join(", ")}.`,
    `Required admin prompt modules: ${BATIBOT_ADMIN_PROMPT_MODULES
      .map((module) => `${module.title}: ${module.prompt}`)
      .join(" ")}`,
    curriculumContract
      ? `BatiBot curriculumContract: ${JSON.stringify(curriculumContract).slice(0, 10000)}.`
      : "",
    `Topic: ${topic}.`,
    `Subject domain: ${category}.`,
    `Curriculum level: ${curriculumLevel}.`,
    `Learner progression level: ${learnerLevel}.`,
    `Level generation rules: ${LEVEL_GENERATION_RULES[learnerLevel] || LEVEL_GENERATION_RULES.beginner}.`,
    `Difficulty: ${difficulty}.`,
    `Curriculum objective: ${objective || topic}.`,
    `Skill tag: ${skillTag || "not specified"}.`,
    `Language: ${language}.`,
    `Required media: ${mediaRequired}.`,
    `Vocabulary source mode: ${vocabularyMode}.`,
    `Admin request: ${adminPrompt}.`,
    `Admin notes: ${notes || "None"}.`,
    `Target age group: ${ageGroup}.`,
    `Create ${questionCount} total questions.`,
    `Use these preset layouts only: ${questionTypes}.`,
    `Required Learning Worlds word set for this draft: ${requiredLearningWorldsWordSet}.`,
    `Approved BatiBot vocabulary context: ${vocabularyContext}`,
    `Prompt contract version: ${QUIZ_GENERATION_PROMPT_VERSION}.`,
    BUILT_IN_QUIZ_STYLE_GUIDE,
    "Generate from a blueprint: assign each question a distinct targetSkill, vocabulary focus, reasoning operation, answer, and distractor plan before writing final JSON.",
    "Model the structure and logic of BatiBot built-in quizzes: short prompt, clear child action, one correct answer, fair distractors, direct feedback, and no trick wording.",
    "Do not ask literal topic-label questions such as 'Which answer matches the topic Things?' or 'What is this quiz about?'. The topic only selects the Learning Worlds word set. Questions must be about the selected words under that topic.",
    "The approved vocabulary context is the source of truth. Selected Topic mode must stay inside the selected subcategory. Random Approved Words mode may use any provided approved word. Mixed Review mode should combine several provided subcategories. Admin Prompt Guided mode should choose the provided words that best match the admin request.",
    "Every vocabulary-based question must use at least one word from the required Learning Worlds word set. Put every word used from that set in vocabularyUsed.",
    "Every question must be anchored to one exact vocabulary item. Put that exact item word in sourceVocabularyWord and vocabularyUsed.",
    "When the vocabulary context contains the same number of words as the requested question count, create one question for each selected word before reusing any word.",
    "For preset-topic quizzes, treat the required Learning Worlds word set as the selected Play practice words. The selected words are the only content anchors and the preferred option/distractor pool.",
    "The question content must be about the sourceVocabularyWord itself: use its meaning, sample sentence, clue, use, category, imagePrompt, or child-safe real-world context.",
    "For an everyday object such as Bag, a good question asks what it is used for, what clue points to it, or which word matches a picture of it. Example style: 'Which thing can you use to carry books?' answer 'Bag'.",
    "Do not generate generic topic questions, generic item numbers, or prompts where the selected word is only a random option. The correct answer and explanation must prove the question is about the source word.",
    "Spread the selected words across the draft. If focus words are provided, cover those focus words before using other words from the same preset scope.",
    "Use exactly four unique answer choices for every choice-style question and every fill-in-the-blank wordBank. Matching/image matching layouts should use exactly four unique pairs when enough scoped vocabulary is available.",
    "When a Question blueprint is included in the admin request, follow its sourceVocabularyWord, layout, basis, and four listed choices exactly. The correct sourceVocabularyWord must appear once, and the other three choices must be plausible but clearly wrong.",
    "Use the miniQuestionSeeds in the vocabulary context as structural examples for question logic. Adapt them to the requested quiz layout and learner level, but keep the same answer logic and child-friendly structure.",
    "When a question is based on a miniQuestionSeed, return sourceQuestionSeedId and sourceVocabularyWord.",
    "For selected-topic generation, use random words from that chosen sub-tab only. For random or mixed generation, spread the selected Learning Worlds word set across the draft so the same word is not reused unnecessarily.",
    "When a question needs a vocabulary word, correct answer, distractor, matching word, image prompt, or explanation example, use only the approved vocabulary context above.",
    "Do not introduce outside vocabulary words unless the admin request explicitly asks for a custom topic and no approved vocabulary context was provided.",
    "Every question must be meaningfully different. Do not repeat the same prompt, sentence frame, answer set, correct answer pattern, matching pair, object example, or distractor set.",
    "Before writing each final question, internally plan the skill target, selected vocabulary, reasoning operation, expected answer, and distractor logic. Return only the final JSON, not the hidden plan.",
    "Every question must include reasoningType, cognitiveSkill, questionIntent, difficultyScore from 0 to 1, levelFitScore from 0 to 1, levelFitExplanation, and alignmentNotes.",
    "Every question must also include learningObjective, targetSkill, qualityScore, alignmentScore, clarityScore, depthScore, uniquenessScore, answerValidityScore, ageFitScore, whyThisAnswerIsCorrect, and whyDistractorsAreWrong.",
    "All score fields must be numbers from 0 to 1. Do not assign high scores if the prompt is generic, repeated, unclear, or unsupported by the approved vocabulary.",
    "Distractors must be plausible but clearly wrong. Explain why the distractors are wrong in one short phrase.",
    "difficultyScore must match the selected learner level range. levelFitExplanation must briefly explain why the question fits the selected level.",
    "Harder questions should use more reasoning, not confusing wording, obscure vocabulary, or trick phrasing.",
    "If one objective needs several questions, vary the example, wording, skill angle, and distractors while staying aligned to the same curriculum objective.",
    "Treat image-to-word and word-to-image as matching layouts with pairs. Each image pair must include word, imagePrompt, and altText fields. Do not return live image URLs.",
    "For image-choice, picture-based, counting-objects, image-to-word, and word-to-image layouts, every question must include an imageLabel or pair imagePrompt/altText that describes the exact selected vocabulary word or count.",
    "For matching layouts, create exactly four unique pairs with no duplicate left or right values when at least four scoped words are available.",
    "For counting-objects, use nearby-number distractors and put the object clue in imageLabel or helperText.",
    "For ordering, put the correct sequence in options and the answer as a comma-separated sequence.",
    "Keep the tone child-friendly, clear, and age-appropriate.",
    "Align difficulty with the selected learner level and curriculum objective.",
    "For linguistic content, prioritize vocabulary, listening, reading, spelling, speaking, and sentence understanding.",
    "For numeric content, prioritize number sense, operations, patterns, measurement, and logical reasoning.",
    "Do not include unsafe, violent, mature, or frightening content.",
    "Return only JSON that matches the response schema.",
  ].join(" ");
}

function parseGeminiText(payload) {
  const text =
    payload?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim() || "";

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return JSON.parse(text);
}

function normalizeForComparison(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanStringArray(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
    : [];
}

function clampScore(value, fallback) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : fallback;
}

function getQuestionTerms(question) {
  const explicitVocabulary = cleanStringArray(question.vocabularyUsed);

  if (["matching", "image-to-word", "word-to-image"].includes(question.type)) {
    const pairTerms = Array.isArray(question.pairs)
      ? question.pairs.flatMap((pair) => [
          pair?.word || "",
          pair?.leftType === "word" ? pair.left : "",
          pair?.rightType === "word" ? pair.right : "",
        ])
      : [];

    return [...explicitVocabulary, ...pairTerms];
  }

  if (question.type === "fill-in-the-blank") {
    return [
      ...explicitVocabulary,
      question.answer || "",
      ...cleanStringArray(question.wordBank),
    ];
  }

  return [
    ...explicitVocabulary,
    question.answer || "",
    ...cleanStringArray(question.options),
  ];
}

function getQuestionPrimaryAnswer(question) {
  if (["matching", "image-to-word", "word-to-image"].includes(question.type)) {
    return Array.isArray(question.pairs)
      ? question.pairs.map((pair) => pair?.right || "").join("|")
      : "";
  }

  return question.answer || "";
}

function getPromptFrameSignature(question) {
  const answerTerms = getQuestionTerms(question)
    .map(normalizeForComparison)
    .filter(Boolean)
    .sort((first, second) => second.length - first.length);
  let prompt = normalizeForComparison(question.prompt)
    .replace(/\b\d+\b/g, "#")
    .replace(/\b(item|question|picture clue)\s+#\b/g, "$1 #");

  answerTerms.forEach((term) => {
    if (term.length > 2) {
      prompt = prompt.replace(new RegExp(`\\b${term}\\b`, "g"), "{word}");
    }
  });

  return `${question.type}:${prompt}`;
}

function getQuestionOptionCount(question) {
  if (["matching", "image-to-word", "word-to-image"].includes(question.type)) {
    return Array.isArray(question.pairs) ? question.pairs.length : 0;
  }

  if (question.type === "fill-in-the-blank") {
    return cleanStringArray(question.wordBank).length;
  }

  return cleanStringArray(question.options).length;
}

function shouldHaveFourChoices(question) {
  return !["speech-to-text"].includes(question.type);
}

function hasRequiredChoiceCount(question) {
  if (!shouldHaveFourChoices(question)) {
    return true;
  }

  return getQuestionOptionCount(question) === REQUIRED_CHOICE_COUNT;
}

function getPromptWordCount(question) {
  return normalizeForComparison(question.prompt).split(" ").filter(Boolean).length;
}

function hasDuplicateValues(values) {
  const normalizedValues = values.map(normalizeForComparison).filter(Boolean);
  return new Set(normalizedValues).size !== normalizedValues.length;
}

function hasShallowPrompt(question) {
  const prompt = normalizeForComparison(question.prompt);

  return (
    getPromptWordCount(question) < 4 ||
    prompt.includes("matches the topic") ||
    prompt.includes("quiz about") ||
    prompt.includes("this topic") ||
    prompt.includes("today s learning topic") ||
    prompt.includes("which answer matches")
  );
}

function hasUnclearPrompt(question, learnerLevel) {
  const maxWords =
    learnerLevel === "starter"
      ? 12
      : learnerLevel === "beginner"
        ? 18
        : learnerLevel === "developing"
          ? 24
          : 36;
  const prompt = normalizeForComparison(question.prompt);

  return (
    getPromptWordCount(question) > maxWords ||
    /\b(item|picture clue)\s+\d+\b/.test(prompt) ||
    prompt.includes("not specified")
  );
}

function hasBuiltInQuizPromptStyle(question) {
  const prompt = normalizeForComparison(question.prompt);
  const hasDraftOnlyWording =
    prompt.includes("learning topic") ||
    prompt.includes("quiz topic") ||
    /\b(item|set|example|picture clue)\s+\d+\b/.test(prompt) ||
    prompt.includes("which answer matches");

  if (!prompt || hasDraftOnlyWording) {
    return false;
  }

  if (["matching", "image-to-word", "word-to-image"].includes(question.type)) {
    return prompt.startsWith("match ");
  }

  if (question.type === "fill-in-the-blank") {
    return prompt.startsWith("choose ") && String(question.sentence || "").includes("___");
  }

  if (question.type === "text-to-speech") {
    return prompt.startsWith("listen ");
  }

  if (question.type === "speech-to-text") {
    return prompt.startsWith("say the word");
  }

  if (question.type === "true-or-false") {
    return prompt.startsWith("true or false");
  }

  if (question.type === "counting-objects") {
    return prompt.startsWith("how many ");
  }

  if (question.type === "compare-numbers") {
    return (
      prompt.startsWith("which is more") ||
      prompt.startsWith("which is less") ||
      prompt.startsWith("which number")
    );
  }

  if (question.type === "word-problem" || question.type === "scenario") {
    return /^(there are|start with|a learner|a story|ana has|which is more|which is less)\b/.test(
      prompt
    );
  }

  if (question.type === "ordering") {
    return (
      prompt.startsWith("put these ") ||
      prompt.startsWith("which comes ") ||
      prompt.startsWith("what comes ")
    );
  }

  return /^(which|what|choose|clue|this word means|read the clue|listen|quick answer)\b/.test(
    prompt
  );
}

function getQuestionChoiceTextValues(question) {
  if (["matching", "image-to-word", "word-to-image"].includes(question.type)) {
    const pairs = Array.isArray(question.pairs) ? question.pairs : [];
    return pairs.flatMap((pair) => [pair?.left || "", pair?.right || ""]);
  }

  if (question.type === "fill-in-the-blank") {
    return cleanStringArray(question.wordBank);
  }

  return cleanStringArray(question.options);
}

function hasCompactBuiltInChoices(question) {
  if (question.type === "speech-to-text") {
    return true;
  }

  return getQuestionChoiceTextValues(question).every((choice) => {
    const trimmedChoice = String(choice || "").trim();
    const wordCount = trimmedChoice.split(/\s+/).filter(Boolean).length;

    return trimmedChoice.length <= 56 && wordCount <= 8;
  });
}

function isQuestionComplete(question) {
  if (!String(question.prompt || "").trim()) {
    return false;
  }

  if (["matching", "image-to-word", "word-to-image"].includes(question.type)) {
    const pairs = Array.isArray(question.pairs) ? question.pairs : [];

    return (
      pairs.length === REQUIRED_CHOICE_COUNT &&
      pairs.every((pair) => String(pair?.left || "").trim() && String(pair?.right || "").trim()) &&
      !hasDuplicateValues(pairs.map((pair) => pair.left)) &&
      !hasDuplicateValues(pairs.map((pair) => pair.right))
    );
  }

  if (question.type === "fill-in-the-blank") {
    const wordBank = cleanStringArray(question.wordBank);
    const answer = String(question.answer || "").trim();

    return Boolean(
      String(question.sentence || "").trim() &&
        answer &&
        wordBank.length === REQUIRED_CHOICE_COUNT &&
        wordBank.map(normalizeForComparison).includes(normalizeForComparison(answer)) &&
        !hasDuplicateValues(wordBank)
    );
  }

  if (question.type === "speech-to-text") {
    return Boolean(String(question.answer || "").trim());
  }

  const options = cleanStringArray(question.options);
  const answer = String(question.answer || "").trim();

  return (
    options.length === REQUIRED_CHOICE_COUNT &&
    Boolean(answer) &&
    options.map(normalizeForComparison).includes(normalizeForComparison(answer)) &&
    !hasDuplicateValues(options)
  );
}

function getApprovedWordSet(vocabularyContext) {
  return new Set(
    (Array.isArray(vocabularyContext) ? vocabularyContext : []).flatMap((item) => [
      normalizeForComparison(item?.word),
      normalizeForComparison(item?.normalizedWord),
    ])
  );
}

function questionUsesRequiredWordBank(question, vocabularyContext) {
  if (!Array.isArray(vocabularyContext) || !vocabularyContext.length) {
    return true;
  }

  const approvedWords = getApprovedWordSet(vocabularyContext);

  return getQuestionTerms(question).some((term) =>
    approvedWords.has(normalizeForComparison(term))
  );
}

function questionSourceWordIsInWordBank(question, vocabularyContext) {
  if (!Array.isArray(vocabularyContext) || !vocabularyContext.length) {
    return true;
  }

  const sourceWord = normalizeForComparison(question.sourceVocabularyWord);

  if (!sourceWord) {
    return false;
  }

  return getApprovedWordSet(vocabularyContext).has(sourceWord);
}

function getAgeFitScore(question, learnerLevel) {
  const optionCount = getQuestionOptionCount(question);
  const difficultyScore = clampScore(question.difficultyScore, 0.5);

  if (learnerLevel === "starter") {
    return difficultyScore <= 0.3 && optionCount === REQUIRED_CHOICE_COUNT ? 1 : 0.45;
  }

  if (learnerLevel === "beginner") {
    return difficultyScore <= 0.45 && optionCount === REQUIRED_CHOICE_COUNT ? 1 : 0.55;
  }

  if (learnerLevel === "challenge") {
    return difficultyScore >= 0.45 ? 1 : 0.5;
  }

  return clampScore(question.levelFitScore, 0.75);
}

function scoreQuestionQuality({
  answerUseCount,
  frameUseCount,
  learnerLevel,
  question,
  vocabularyContext,
}) {
  const hasVocabularyContext = Array.isArray(vocabularyContext) && vocabularyContext.length > 0;
  const hasCoreMetadata = Boolean(
    question.learningObjective &&
      question.targetSkill &&
      question.reasoningType &&
      question.cognitiveSkill &&
      question.questionIntent
  );
  const alignmentScore =
    (!hasVocabularyContext || questionUsesRequiredWordBank(question, vocabularyContext)) &&
    (question.alignmentNotes || question.learningObjective)
      ? 1
      : 0.45;
  const clarityScore = hasUnclearPrompt(question, learnerLevel)
    ? 0.45
    : hasBuiltInQuizPromptStyle(question) && hasCompactBuiltInChoices(question)
      ? 1
      : 0.7;
  const depthScore =
    hasShallowPrompt(question) || !question.reasoningType
      ? 0.35
      : question.reasoningType === "recognition" && learnerLevel !== "starter"
        ? 0.7
        : 1;
  const uniquenessScore = frameUseCount > 1 || answerUseCount > 2 ? 0.45 : 1;
  const answerValidityScore = isQuestionComplete(question) ? 1 : 0.25;
  const ageFitScore = getAgeFitScore(question, learnerLevel);
  const metadataScore = hasCoreMetadata ? 1 : 0.55;
  const qualityScore =
    alignmentScore * 0.18 +
    clarityScore * 0.16 +
    depthScore * 0.18 +
    uniquenessScore * 0.16 +
    answerValidityScore * 0.18 +
    ageFitScore * 0.1 +
    metadataScore * 0.04;

  return {
    alignmentScore,
    answerValidityScore,
    ageFitScore,
    clarityScore,
    depthScore,
    qualityScore: clampScore(qualityScore, 0),
    uniquenessScore,
  };
}

function getQuestionFlags(question, learnerLevel, vocabularyContext, duplicateContext) {
  const flags = new Set(cleanStringArray(question.validationFlags));
  const scores = scoreQuestionQuality({
    answerUseCount: duplicateContext.answerUseCount,
    frameUseCount: duplicateContext.frameUseCount,
    learnerLevel,
    question,
    vocabularyContext,
  });

  if (!question.learningObjective) flags.add("Missing learning objective.");
  if (!question.targetSkill) flags.add("Missing target skill.");
  if (!question.reasoningType) flags.add("Missing reasoning type.");
  if (!question.questionIntent) flags.add("Missing question intent.");
  if (!question.cognitiveSkill) flags.add("Missing cognitive skill.");
  if (!question.whyThisAnswerIsCorrect) flags.add("Missing correct-answer rationale.");
  if (Array.isArray(vocabularyContext) && vocabularyContext.length && !question.sourceVocabularyWord) {
    flags.add("Missing source vocabulary word.");
  }
  if (
    Array.isArray(vocabularyContext) &&
    vocabularyContext.length &&
    !questionSourceWordIsInWordBank(question, vocabularyContext)
  ) {
    flags.add("Source vocabulary word must be one of the selected random quiz words.");
  }
  if (
    !["speech-to-text", "matching", "image-to-word", "word-to-image"].includes(question.type) &&
    !question.whyDistractorsAreWrong
  ) {
    flags.add("Missing distractor rationale.");
  }
  if (hasShallowPrompt(question)) flags.add("Question may be too shallow.");
  if (hasUnclearPrompt(question, learnerLevel)) {
    flags.add("Prompt may be unclear for the selected learner level.");
  }
  if (!hasBuiltInQuizPromptStyle(question)) {
    flags.add("Question format should match built-in quiz style.");
  }
  if (!hasCompactBuiltInChoices(question)) {
    flags.add("Answer choices should be short, built-in-style choices.");
  }
  if (duplicateContext.frameUseCount > 1) {
    flags.add("Question repeats a sentence frame used elsewhere.");
  }
  if (duplicateContext.answerUseCount > 2) {
    flags.add("Correct answer is reused too often in this draft.");
  }
  if (!questionUsesRequiredWordBank(question, vocabularyContext)) {
    flags.add("Question does not use the selected Learning Worlds word set.");
  }
  if (!isQuestionComplete(question)) {
    flags.add("Question is incomplete or has invalid answer choices.");
  }
  if (!hasRequiredChoiceCount(question)) {
    flags.add("Question must have exactly four answer choices or matching pairs.");
  }
  if (scores.qualityScore < MIN_QUESTION_QUALITY_SCORE) {
    flags.add("Low generated quality score.");
  }

  return { flags: Array.from(flags), scores };
}

function getQualitySummary(questions) {
  const skillCoverage = {};
  const vocabularyCoverage = {};
  const frameCounts = new Map();
  const qualityScores = questions.map((question) => question.qualityScore || 0.7);

  questions.forEach((question) => {
    const skill =
      question.targetSkill ||
      question.cognitiveSkill ||
      question.reasoningType ||
      question.type;
    skillCoverage[skill] = (skillCoverage[skill] || 0) + 1;
    cleanStringArray(question.vocabularyUsed).forEach((word) => {
      vocabularyCoverage[word] = (vocabularyCoverage[word] || 0) + 1;
    });
    const frame = getPromptFrameSignature(question);
    frameCounts.set(frame, (frameCounts.get(frame) || 0) + 1);
  });

  const flaggedQuestionCount = questions.filter(
    (question) => Array.isArray(question.validationFlags) && question.validationFlags.length
  ).length;
  const duplicateRiskCount = questions.filter(
    (question) => (frameCounts.get(getPromptFrameSignature(question)) || 0) > 1
  ).length;
  const shallowQuestionCount = questions.filter(hasShallowPrompt).length;
  const unclearQuestionCount = questions.filter((question) =>
    cleanStringArray(question.validationFlags).some((flag) =>
      flag.toLowerCase().includes("unclear")
    )
  ).length;
  const weakDistractorCount = questions.filter((question) =>
    cleanStringArray(question.validationFlags).some((flag) =>
      flag.toLowerCase().includes("distractor")
    )
  ).length;
  const missingMetadataCount = questions.filter(
    (question) =>
      !question.learningObjective ||
      !question.targetSkill ||
      !question.reasoningType ||
      !question.questionIntent
  ).length;
  const overallScore = qualityScores.length
    ? Math.round(
        (qualityScores.reduce((total, score) => total + score, 0) / qualityScores.length) *
          100
      )
    : 0;
  const recommendations = [
    flaggedQuestionCount ? "Regenerate or edit flagged questions before review." : "",
    duplicateRiskCount ? "Vary repeated sentence frames, answers, and distractor sets." : "",
    shallowQuestionCount ? "Replace topic-label checks with real skill actions." : "",
    missingMetadataCount ? "Require objective, skill, reasoning, and intent metadata." : "",
  ].filter(Boolean);

  return {
    duplicateRiskCount,
    flaggedQuestionCount,
    missingMetadataCount,
    overallScore,
    recommendations,
    shallowQuestionCount,
    skillCoverage,
    unclearQuestionCount,
    vocabularyCoverage,
    weakDistractorCount,
  };
}

function removeRepeatedQuestions(questions) {
  const seenPrompts = new Set();
  const seenSignatures = new Set();

  return questions.filter((question) => {
    const prompt = normalizeForComparison(question.prompt);
    const signature = `${question.type}:${prompt}:${normalizeForComparison(
      getQuestionPrimaryAnswer(question)
    )}`;

    if (seenPrompts.has(prompt) || seenSignatures.has(signature)) {
      return false;
    }

    seenPrompts.add(prompt);
    seenSignatures.add(signature);
    return true;
  });
}

function reviewQuizDraft(body, quiz) {
  const learnerLevel = String(body.learnerLevel || "beginner").trim();
  const vocabularyContext = Array.isArray(body.vocabularyContext)
    ? body.vocabularyContext
    : [];
  const questions = removeRepeatedQuestions(Array.isArray(quiz.questions) ? quiz.questions : []);
  const frameCounts = questions.reduce((counts, question) => {
    const frame = getPromptFrameSignature(question);
    counts.set(frame, (counts.get(frame) || 0) + 1);
    return counts;
  }, new Map());
  const answerCounts = questions.reduce((counts, question) => {
    const answer = normalizeForComparison(getQuestionPrimaryAnswer(question));
    counts.set(answer, (counts.get(answer) || 0) + 1);
    return counts;
  }, new Map());
  const reviewedQuestions = questions.map((question, index) => {
    const duplicateContext = {
      answerUseCount:
        answerCounts.get(normalizeForComparison(getQuestionPrimaryAnswer(question))) || 1,
      frameUseCount: frameCounts.get(getPromptFrameSignature(question)) || 1,
    };
    const { flags, scores } = getQuestionFlags(
      question,
      learnerLevel,
      vocabularyContext,
      duplicateContext
    );

    return {
      ...question,
      id: question.id || `question-${index + 1}`,
      ...scores,
      validationFlags: flags,
    };
  });

  return {
    ...quiz,
    promptVersion: quiz.promptVersion || QUIZ_GENERATION_PROMPT_VERSION,
    modelName: quiz.modelName || GEMINI_MODEL,
    questions: reviewedQuestions,
    qualitySummary: getQualitySummary(reviewedQuestions),
  };
}

function buildRepairPrompt(body, reviewedQuiz) {
  const flaggedQuestions = reviewedQuiz.questions
    .map((question, index) => ({
      number: index + 1,
      type: question.type,
      prompt: question.prompt,
      answer: getQuestionPrimaryAnswer(question),
      flags: cleanStringArray(question.validationFlags),
    }))
    .filter((question) => question.flags.length);

  return [
    buildPrompt(body),
    "Repair pass: rewrite the full quiz JSON while preserving the title, objective, allowed layouts, selected vocabulary context, and total question count.",
    "Replace every flagged question with a clearer, more aligned, non-repeated question. Keep acceptable questions only if they do not create duplicate frames or answer overuse.",
    "Do not return any question with validationFlags unless the flag needs human review and cannot be solved by rewriting.",
    `Flagged questions to repair: ${JSON.stringify(flaggedQuestions).slice(0, 6000)}`,
  ].join(" ");
}

async function callGemini(endpoint, prompt) {
  const geminiResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: quizResponseSchema,
      },
    }),
  });
  const payload = await geminiResponse.json().catch(() => null);

  if (!geminiResponse.ok) {
    const error = new Error(
      payload?.error?.message ||
        "The Gemini quiz service could not generate a draft right now."
    );
    error.status = geminiResponse.status;
    throw error;
  }

  return parseGeminiText(payload);
}

exports.generateQuizDraft = onRequest(
  {
    cors: false,
    region: "us-central1",
    secrets: [geminiApiKey],
  },
  async (request, response) => {
    setCorsHeaders(response);

    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    if (request.method !== "POST") {
      response.status(405).json({ message: "Use POST for quiz generation." });
      return;
    }

    try {
      await requireAdmin(request);

      const apiKey = geminiApiKey.value();
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
      const body = request.body || {};
      const initialQuiz = await callGemini(
        endpoint,
        body.prompt || buildPrompt(body)
      );
      let reviewedQuiz = reviewQuizDraft(body, initialQuiz);

      if (reviewedQuiz.qualitySummary.flaggedQuestionCount > 0) {
        try {
          const repairedQuiz = await callGemini(
            endpoint,
            buildRepairPrompt(body, reviewedQuiz)
          );
          const reviewedRepair = reviewQuizDraft(body, repairedQuiz);

          if (
            reviewedRepair.qualitySummary.overallScore >=
              reviewedQuiz.qualitySummary.overallScore ||
            reviewedRepair.qualitySummary.flaggedQuestionCount <
              reviewedQuiz.qualitySummary.flaggedQuestionCount
          ) {
            reviewedQuiz = reviewedRepair;
          }
        } catch (repairError) {
          reviewedQuiz.notes = [
            reviewedQuiz.notes || "",
            repairError instanceof Error
              ? `Repair pass could not complete: ${repairError.message}`
              : "Repair pass could not complete.",
          ]
            .filter(Boolean)
            .join(" ");
        }
      }

      response.json({ quiz: reviewedQuiz });
    } catch (error) {
      response.status(error.status || 403).json({
        message:
          error instanceof Error
            ? error.message
            : "The quiz draft endpoint failed.",
      });
    }
  }
);
