import { getAllCurriculumTopics } from "@/src/data/curriculum/learning-path";
import { createVocabularyImageUri } from "@/src/data/vocabulary/media";
import type { VocabularyItem } from "@/src/data/vocabulary/types";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getChildTopicLabel(title: string) {
  const baseTitle = title.replace(/\s+\d+-\d+$/, "");
  const introMatch = baseTitle.match(/^What\s+(?:is|are)\s+(.+)\?$/i);
  const childTitle = introMatch ? introMatch[1] : baseTitle;

  return childTitle.replace(/^(?:a|an|the)\s+/i, "");
}

function getPreschoolDefinition(title: string, worldTitle: string) {
  const label = getChildTopicLabel(title);
  const lowerLabel = label.toLowerCase();

  if (/fruit/i.test(worldTitle)) {
    return `${label} is a fruit. Tap ${lowerLabel}.`;
  }

  if (/food/i.test(worldTitle)) {
    return `${label} is food. Tap ${lowerLabel}.`;
  }

  if (/body/i.test(worldTitle)) {
    return `${label} is a body word. Tap ${lowerLabel}.`;
  }

  if (/color/i.test(worldTitle)) {
    return `${label} is a color. Tap ${lowerLabel}.`;
  }

  if (/shape/i.test(worldTitle)) {
    return `${label} is a shape. Tap ${lowerLabel}.`;
  }

  if (/number|counting/i.test(worldTitle)) {
    return `Count ${lowerLabel}. Tap and match.`;
  }

  if (/pattern/i.test(worldTitle)) {
    return `${label} repeats. What comes next?`;
  }

  if (/family/i.test(worldTitle)) {
    return `${label} is a family word. Tap ${lowerLabel}.`;
  }

  return `Meet ${label}. Tap ${lowerLabel}.`;
}

function getGradeDefinition({
  gradeLevel,
  title,
  worldTitle,
}: {
  gradeLevel: string;
  title: string;
  worldTitle: string;
}) {
  const label = getChildTopicLabel(title);

  if (gradeLevel === "Preschool") {
    return getPreschoolDefinition(title, worldTitle);
  }

  if (gradeLevel === "Kindergarten") {
    if (/^Letter\s+[A-Z]$/i.test(title)) {
      return `${label} makes a letter sound. Tap and listen.`;
    }

    return `${label} is a word to match with a picture.`;
  }

  if (gradeLevel === "Grade 1") {
    return `${label} is a word to read, hear, and use in a simple sentence.`;
  }

  if (gradeLevel === "Grade 2") {
    return `${label} helps with comparing, reading, or solving a short problem.`;
  }

  return `${label} helps with reading clues, explaining ideas, or solving multi-step tasks.`;
}

export const LEARNING_WORLD_VOCABULARY_ITEMS: VocabularyItem[] =
  getAllCurriculumTopics().map((topic) => {
    const id = `${slugify(topic.gradeLevel)}-${slugify(topic.worldId)}-${slugify(topic.title)}`;
    const learningGoal = `${topic.worldTitle}: complete Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery.`;
    const recognitionPrompt = getGradeDefinition({
      gradeLevel: topic.gradeLevel,
      title: topic.title,
      worldTitle: topic.worldTitle,
    });

    return {
      id,
      legacyIds: [],
      word: topic.title,
      pronunciation: topic.title,
      definition: recognitionPrompt,
      example: topic.gradeLevel === "Preschool" ? recognitionPrompt : topic.example,
      imageUri: createVocabularyImageUri({
        accentColor: topic.accentColor,
        category: topic.category,
        emoji: topic.emoji,
        subcategory: topic.subcategory,
        word: topic.title,
      }),
      emoji: topic.emoji,
      accentColor: topic.accentColor,
      category: topic.category,
      subcategory: topic.subcategory,
      curriculumBand: `${topic.gradeLevel} - ${topic.worldTitle}`,
      learningGoal,
      recognitionPrompt,
      searchTerms: [
        topic.title,
        topic.worldTitle,
        topic.gradeLevel,
        topic.category,
        topic.subcategory,
        ...topic.interactionTypes,
      ],
    };
  });
