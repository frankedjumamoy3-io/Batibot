import type { ImageSourcePropType } from "react-native";

import {
  FEEDBACK_ASSETS,
  PLAY_BACKGROUNDS,
  REUSABLE_LEARNING_ASSETS,
  TOPIC_IMAGES,
  WORLD_IMAGES,
} from "@/src/data/play-assets";

export type KindergartenAssetKey =
  | "background.junglePath"
  | "feedback.correct"
  | "feedback.wrong"
  | "reward.star"
  | "dropArea.default"
  | "dropArea.correct"
  | "dropArea.wrong"
  | "alphabet.dropArea.default"
  | "alphabet.dropArea.wrong"
  | string;

type KindergartenAssetCategory =
  | "lookImage"
  | "tapContextImage"
  | "playChoiceImage"
  | "playSituationImage"
  | "playCompletedImage"
  | "wrongFeedbackImage";

const kindergartenAssets: Record<string, ImageSourcePropType> = {
  "background.junglePath": PLAY_BACKGROUNDS.Kindergarten,
  "feedback.correct": FEEDBACK_ASSETS.correct.kindergarten,
  "feedback.wrong": FEEDBACK_ASSETS.wrong.kindergarten,
  "reward.star": FEEDBACK_ASSETS.reward.star,
  "dropArea.default": require("../../Batibot assets/kindergarten assets/topic-alphabet island/play drop area/box.png"),
  "dropArea.correct": FEEDBACK_ASSETS.correct.kindergarten,
  "dropArea.wrong": FEEDBACK_ASSETS.wrong.kindergarten,
  "alphabet.dropArea.default": require("../../Batibot assets/kindergarten assets/topic-alphabet island/play drop area/box.png"),
  "alphabet.dropArea.wrong": require("../../Batibot assets/kindergarten assets/topic-alphabet island/play drop area-wrong/wrong.png"),

  "school.bag.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-school world/bag put things.png"),
  "school.book.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-school world/book read.png"),
  "school.chair.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-school world/chair sit.png"),
  "school.crayon.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-school world/crayon color.png"),
  "school.desk.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-school world/desk put things.png"),
  // TODO: Replace with final asset: kindergarten/topic-school-world/eraser-erase.png
  "school.eraser.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-school world/topic/eraser.png"),
  "school.notebook.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-school world/notebook note.png"),
  "school.paper.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-school world/paper writing.png"),
  "school.pencil.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-school world/pencil write.png"),

  "school.bag.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area/bag.png"),
  "school.book.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area/book.png"),
  "school.chair.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area/chair.png"),
  "school.crayon.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area/crayon.png"),
  "school.desk.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area/desk.png"),
  // TODO: Replace with final asset: kindergarten/topic-school-world/play-drop-area/eraser.png
  "school.eraser.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-school world/play choices/eraser.png"),
  "school.notebook.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area/notebook.png"),
  "school.paper.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area/paper.png"),
  "school.pencil.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area/pencil.png"),

  "school.bag.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area-correct/bag-correct.png"),
  "school.book.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area-correct/book-correct.png"),
  "school.chair.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area-correct/chair-corect.png"),
  "school.crayon.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area-correct/crayon-correct.png"),
  "school.desk.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area-correct/desk-corrrect.png"),
  // TODO: Replace with final asset: kindergarten/topic-school-world/play-drop-area-correct/eraser-correct.png
  "school.eraser.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-school world/play choices/eraser.png"),
  "school.notebook.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area-correct/notebook-correct.png"),
  "school.paper.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area-correct/paper-correct.png"),
  "school.pencil.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area-correct/pencil-correct.png"),
  "school.wrongFeedbackImage": require("../../Batibot assets/kindergarten assets/topic-school world/play drop area-wrong/wrong.png"),

  "community.doctor.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-community village/doctor treat.png"),
  "community.nurse.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-community village/nurse check.png"),
  "community.teacher.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-community village/teacher teach.png"),
  "community.police-officer.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-community village/police protect.png"),
  "community.firefighter.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-community village/fireman water.png"),
  "community.farmer.tapContextImage": require("../../Batibot assets/kindergarten assets/topic-community village/farmer plant.png"),

  "community.doctor.playChoiceImage": require("../../Batibot assets/kindergarten assets/topic-community village/play choices/doctor tool.png"),
  "community.nurse.playChoiceImage": require("../../Batibot assets/kindergarten assets/topic-community village/play choices/nurse tool.png"),
  "community.teacher.playChoiceImage": require("../../Batibot assets/kindergarten assets/topic-community village/play choices/book.jpg"),
  "community.police-officer.playChoiceImage": require("../../Batibot assets/kindergarten assets/topic-community village/play choices/police tool.png"),
  "community.firefighter.playChoiceImage": require("../../Batibot assets/kindergarten assets/topic-community village/play choices/fireman tool.png"),
  "community.farmer.playChoiceImage": require("../../Batibot assets/kindergarten assets/topic-community village/play choices/farmer tool.png"),

  "community.doctor.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-community village/play drop area/doctor.png"),
  "community.nurse.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-community village/play drop area/nurse.png"),
  "community.teacher.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-community village/play drop area/teacher.png"),
  "community.police-officer.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-community village/play drop area/police.png"),
  "community.firefighter.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-community village/play drop area/fireman.png"),
  "community.farmer.playSituationImage": require("../../Batibot assets/kindergarten assets/topic-community village/play drop area/farmer.png"),

  "community.doctor.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-community village/play drop area-correct/doctor-correct.png"),
  "community.nurse.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-community village/play drop area-correct/nurse-correct.png"),
  "community.teacher.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-community village/play drop area-correct/teacher-correct.png"),
  "community.police-officer.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-community village/play drop area-correct/police-corrrect.png"),
  "community.firefighter.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-community village/play drop area-correct/fireman-success.png"),
  "community.farmer.playCompletedImage": require("../../Batibot assets/kindergarten assets/topic-community village/play drop area-correct/farmer-correct.png"),
  "community.wrongFeedbackImage": require("../../Batibot assets/kindergarten assets/topic-community village/play drop area-wrong/wrong.png"),
};

const sharedFallbackAssets: Record<string, ImageSourcePropType> = {
  "alphabet.apple": REUSABLE_LEARNING_ASSETS.alphabet.apple,
  "alphabet.ball": REUSABLE_LEARNING_ASSETS.objects.ball,
  "alphabet.cat": REUSABLE_LEARNING_ASSETS.animals.cat,
  "alphabet.dog": REUSABLE_LEARNING_ASSETS.animals.dog,
  "alphabet.fish": REUSABLE_LEARNING_ASSETS.animals.fish,
  "school.pencil": REUSABLE_LEARNING_ASSETS.objects.pencil,
};

const fallbackAssets: Record<string, ImageSourcePropType> = {
  placeholder: PLAY_BACKGROUNDS.Kindergarten,
};

const worldPrefixes: Record<string, string> = {
  "kindergarten-community-village": "community",
  "kindergarten-school": "school",
};

export function resolveKindergartenAsset(
  key: KindergartenAssetKey,
  fallbackKey?: KindergartenAssetKey
): ImageSourcePropType {
  return (
    kindergartenAssets[key] ??
    TOPIC_IMAGES[key] ??
    WORLD_IMAGES[key] ??
    sharedFallbackAssets[key] ??
    (fallbackKey ? kindergartenAssets[fallbackKey] : undefined) ??
    (fallbackKey ? TOPIC_IMAGES[fallbackKey] : undefined) ??
    fallbackAssets.placeholder
  );
}

export function resolveKindergartenTopicAsset(
  worldId: string,
  topicId: string,
  category: KindergartenAssetCategory = "lookImage"
): ImageSourcePropType {
  const worldPrefix = worldPrefixes[worldId];
  const localKey = worldPrefix ? `${worldPrefix}.${topicId}.${category}` : undefined;
  const topicKey = `${worldId}-${topicId}`;
  const fallbackKey = `${worldPrefix ?? worldId}.${topicId}`;

  if (localKey && kindergartenAssets[localKey]) {
    return kindergartenAssets[localKey];
  }

  return (
    TOPIC_IMAGES[topicKey] ??
    sharedFallbackAssets[fallbackKey] ??
    WORLD_IMAGES[worldId] ??
    fallbackAssets.placeholder
  );
}

export function resolveKindergartenWorldWrongImage(worldId: string): ImageSourcePropType {
  const worldPrefix = worldPrefixes[worldId];
  return resolveKindergartenAsset(
    worldPrefix ? `${worldPrefix}.wrongFeedbackImage` : "feedback.wrong",
    "feedback.wrong"
  );
}
