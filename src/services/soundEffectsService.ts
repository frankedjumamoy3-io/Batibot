import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { Platform } from "react-native";
import { isLearningAudioEnabled, playLessonCue } from "@/src/services/audioService";

export async function playTapFeedback(): Promise<void> {
  playLessonCue("tap");
  try {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch {
    // Graceful fallback if haptics is unsupported
  }
}

export async function playSuccessFeedback(message = "Magaling!"): Promise<void> {
  playLessonCue("correct");
  try {
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    if (!isLearningAudioEnabled()) return;
    await Speech.stop();
    if (!isLearningAudioEnabled()) return;
    Speech.speak(message, {
      language: "tl-PH",
      pitch: 1.15,
      rate: 0.9,
    });
  } catch {
    // Graceful fallback
  }
}

export async function playCelebrateFeedback(message = "Napakagaling! Tapos na ang yugto!"): Promise<void> {
  playLessonCue("complete");
  try {
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 150);
    }
    if (!isLearningAudioEnabled()) return;
    await Speech.stop();
    if (!isLearningAudioEnabled()) return;
    Speech.speak(message, {
      language: "tl-PH",
      pitch: 1.2,
      rate: 0.88,
    });
  } catch {
    // Graceful fallback
  }
}

export async function playWrongFeedback(message = "Subukan muli!"): Promise<void> {
  playLessonCue("retry");
  try {
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    if (!isLearningAudioEnabled()) return;
    await Speech.stop();
    if (!isLearningAudioEnabled()) return;
    Speech.speak(message, {
      language: "tl-PH",
      pitch: 1.0,
      rate: 0.85,
    });
  } catch {
    // Graceful fallback
  }
}
