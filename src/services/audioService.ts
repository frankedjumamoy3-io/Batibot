import { createAudioPlayer, type AudioPlayer } from "expo-audio";
import { LESSON_SOUNDS } from "@/src/data/assets/lesson-sounds";

const players = new Map<number, AudioPlayer>();
let learningAudioEnabled = true;

export function isLearningAudioEnabled() {
  return learningAudioEnabled;
}

export function setLearningAudioEnabled(enabled: boolean) {
  learningAudioEnabled = enabled;
  if (!enabled) players.forEach((player) => {
    try { player.pause(); } catch { /* Player may already be released. */ }
  });
}

export function playLessonCue(cue: keyof typeof LESSON_SOUNDS) {
  return playLearningSound(LESSON_SOUNDS[cue]);
}

export function playLearningSound(asset?: number): boolean {
  if (!asset || !learningAudioEnabled) {
    return false;
  }

  try {
    const existing = players.get(asset);
    const player =
      existing ??
      createAudioPlayer(asset, {
        // Bundled clips already have a local source. Deferring source setup
        // until after play() loses the first sound on web.
        downloadFirst: false,
        updateInterval: 250,
      });

    players.set(asset, player);
    player.volume = 1;
    if (!existing) {
      player.play();
    } else {
      void player.seekTo(0)
        .catch(() => undefined)
        .then(() => { if (learningAudioEnabled) player.play(); })
        .catch(() => undefined);
    }
    return true;
  } catch (error) {
    console.warn("Learning sound is unavailable.", error);
    return false;
  }
}
