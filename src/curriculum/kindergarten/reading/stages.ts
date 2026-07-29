import { KINDERGARTEN_READING_WORLD_ID } from "./config";
import { getKindergartenReadingLesson } from "./vocabulary";
import type { KindergartenReadingTopicSupportConfig } from "./types";

export function isScopedKindergartenReadingTopic(topicTitle: string) {
  return Boolean(getKindergartenReadingLesson(topicTitle));
}

export function isScopedKindergartenReadingWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return (
    worldId === KINDERGARTEN_READING_WORLD_ID &&
    isScopedKindergartenReadingTopic(topicTitle)
  );
}

export function getKindergartenReadingTopicSupport(
  topicTitle: string
): KindergartenReadingTopicSupportConfig | null {
  const lesson = getKindergartenReadingLesson(topicTitle);

  if (!lesson) {
    return null;
  }

  return {
    audioPrompt: `Look and listen for ${topicTitle}.`,
    competencyFocus: ["Early Reading", "Oral Language"],
    oralPrompt: lesson.prompt,
    pictureMatch: lesson.pictureMatch,
    target: topicTitle,
    wordMatch: lesson.wordMatch,
    stagePrompts: {
      Discover: `Look at the ${lesson.pictureMatch[0]} picture and label.`,
      Explore: "Tap the example cards. Listen.",
      Interact: "Match the picture to the word.",
      Practice: lesson.prompt,
      Challenge: "Use the same examples in a matching mission.",
    },
    example: lesson.example,
    interactionTypes: [
      "Listening Activity",
      "Story-Based Activity",
      "Match Activity",
      "Drag and Drop Activity",
    ],
  };
}
