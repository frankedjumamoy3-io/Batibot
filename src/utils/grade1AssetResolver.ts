import type { ImageSourcePropType } from "react-native";

import {
  FEEDBACK_ASSETS,
  PLAY_BACKGROUNDS,
  REUSABLE_LEARNING_ASSETS,
  TOPIC_IMAGES,
  WORLD_IMAGES,
} from "@/src/data/play-assets";

export type Grade1AssetKey =
  | "background.wordKingdom"
  | "background.readingQuest"
  | "background.numberKingdom"
  | "background.mathMountain"
  | "feedback.correct"
  | "feedback.wrong"
  | "dropArea.default"
  | "dropArea.correct"
  | "dropArea.wrong"
  | "timer.icon"
  | "reward.icon"
  | string;

const grade1Assets: Record<string, ImageSourcePropType> = {
  "background.wordKingdom": WORLD_IMAGES["grade1-word-kingdom"],
  "background.readingQuest": WORLD_IMAGES["grade1-reading"],
  "background.numberKingdom": WORLD_IMAGES["grade1-number-kingdom"],
  "background.mathMountain": WORLD_IMAGES["grade1-math"],
  "feedback.correct": FEEDBACK_ASSETS.reward.star,
  "feedback.wrong": FEEDBACK_ASSETS.wrong.grade1,
  "dropArea.default": WORLD_IMAGES["grade1-word-kingdom"],
  "dropArea.correct": FEEDBACK_ASSETS.reward.star,
  "dropArea.wrong": FEEDBACK_ASSETS.wrong.grade1,
  "timer.icon": FEEDBACK_ASSETS.reward.progress,
  "reward.icon": FEEDBACK_ASSETS.reward.badge,

  "word.noun.boy": TOPIC_IMAGES["preschool-family-world-brother"],
  "word.noun.dog": REUSABLE_LEARNING_ASSETS.animals.dog,
  "word.noun.school": WORLD_IMAGES["kindergarten-school"],
  "word.noun.ball": REUSABLE_LEARNING_ASSETS.objects.ball,
  "word.action.run": REUSABLE_LEARNING_ASSETS.actions.run,
  "word.action.jump": REUSABLE_LEARNING_ASSETS.actions.jump,
  "word.action.write": REUSABLE_LEARNING_ASSETS.actions.write,
  "word.action.read": REUSABLE_LEARNING_ASSETS.actions.read,
  "word.describe.big": WORLD_IMAGES["kindergarten-big-small"],
  "word.describe.bright": REUSABLE_LEARNING_ASSETS.nature.sun,
  "word.describe.happy": TOPIC_IMAGES["preschool-family-world-friend"],
  "word.describe.fast": REUSABLE_LEARNING_ASSETS.actions.run,
  "word.opposite.small": WORLD_IMAGES["kindergarten-big-small"],
  "word.opposite.hot": REUSABLE_LEARNING_ASSETS.nature.sun,
  "word.opposite.cold": REUSABLE_LEARNING_ASSETS.nature.water,
  "word.opposite.slow": REUSABLE_LEARNING_ASSETS.animals.dog,
  "word.opposite.sad": FEEDBACK_ASSETS.wrong.grade1,
  "word.opposite.up": REUSABLE_LEARNING_ASSETS.nature.tree,
  "word.opposite.down": REUSABLE_LEARNING_ASSETS.nature.grass,
  "word.similar.large": WORLD_IMAGES["kindergarten-big-small"],
  "word.similar.tiny": WORLD_IMAGES["kindergarten-big-small"],
  "word.similar.glad": TOPIC_IMAGES["preschool-family-world-friend"],
  "word.similar.quick": REUSABLE_LEARNING_ASSETS.actions.run,
  "word.similar.begin": FEEDBACK_ASSETS.reward.progress,
  "word.similar.start": FEEDBACK_ASSETS.reward.progress,
  "reading.benPuppy.storyImage": WORLD_IMAGES["grade1-reading"],
  "reading.word.I": WORLD_IMAGES["grade1-reading"],
  "reading.word.a": WORLD_IMAGES["grade1-reading"],
  "reading.word.the": WORLD_IMAGES["grade1-reading"],
  "reading.word.is": WORLD_IMAGES["grade1-reading"],
  "reading.sentence.runFast": REUSABLE_LEARNING_ASSETS.actions.run,
  "reading.sentence.dogJumps": REUSABLE_LEARNING_ASSETS.actions.jump,
  "reading.character.ben": TOPIC_IMAGES["preschool-family-world-brother"],
  "reading.character.girl": TOPIC_IMAGES["preschool-family-world-sister"],
  "reading.character.puppy": REUSABLE_LEARNING_ASSETS.animals.dog,
  "reading.setting.park": REUSABLE_LEARNING_ASSETS.nature.tree,
  "reading.setting.playground": WORLD_IMAGES["kindergarten-problem-solving"],
  "reading.object.bench": WORLD_IMAGES["kindergarten-school"],
  "reading.object.tree": REUSABLE_LEARNING_ASSETS.nature.tree,
};

const sharedAssets: Record<string, ImageSourcePropType> = {
  "grade1-word-kingdom": WORLD_IMAGES["grade1-word-kingdom"],
  "grade1-reading": WORLD_IMAGES["grade1-reading"],
  "grade1-number-kingdom": WORLD_IMAGES["grade1-number-kingdom"],
  "grade1-math": WORLD_IMAGES["grade1-math"],
};

const fallbackAssets: Record<string, ImageSourcePropType> = {
  placeholder: PLAY_BACKGROUNDS["Grade 1"],
};

export function resolveGrade1Asset(
  key: Grade1AssetKey,
  fallbackKey?: Grade1AssetKey
): ImageSourcePropType {
  return (
    grade1Assets[key] ??
    TOPIC_IMAGES[key] ??
    WORLD_IMAGES[key] ??
    sharedAssets[key] ??
    (fallbackKey ? grade1Assets[fallbackKey] : undefined) ??
    (fallbackKey ? TOPIC_IMAGES[fallbackKey] : undefined) ??
    fallbackAssets.placeholder
  );
}

export function resolveGrade1WordAsset(key?: string): ImageSourcePropType {
  return resolveGrade1Asset(key ?? "grade1-word-kingdom", "grade1-word-kingdom");
}
