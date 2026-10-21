import * as Speech from "expo-speech";
import { isLearningAudioEnabled } from "@/src/services/audioService";

type SpeakTextOptions = {
  grade?: "grade1" | "grade2" | "grade3";
};

export async function stopSpeaking(): Promise<void> {
  try {
    await Speech.stop();
  } catch (error) {
    console.warn("Speech stop is unavailable.", error);
  }
}

export async function speakText(text: string, options: SpeakTextOptions = {}): Promise<void> {
  const message = text.trim();

  if (!message || !isLearningAudioEnabled()) {
    return;
  }

  try {
    await stopSpeaking();
    if (!isLearningAudioEnabled()) return;
    Speech.speak(message, {
      language: "en-US",
      pitch: 1,
      rate: options.grade === "grade1" ? 0.75 : 0.85,
    });
  } catch (error) {
    console.warn("Speech is unavailable.", error);
  }
}

export function speak(text: string): void {
  void speakText(text, { grade: "grade1" });
}

export function speakWord(text: string): void {
  speak(text);
}
