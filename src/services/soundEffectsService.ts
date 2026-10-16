import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { Platform } from "react-native";

export async function playTapFeedback(): Promise<void> {
  try {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch {
    // Graceful fallback if haptics is unsupported
  }
}

export async function playSuccessFeedback(message = "Magaling!"): Promise<void> {
  try {
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Speech.stop();
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
  try {
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 150);
    }
    Speech.stop();
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
  try {
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    Speech.stop();
    Speech.speak(message, {
      language: "tl-PH",
      pitch: 1.0,
      rate: 0.85,
    });
  } catch {
    // Graceful fallback
  }
}
