import { createAudioPlayer, type AudioPlayer } from "expo-audio";

const players = new Map<number, AudioPlayer>();

export function playLearningSound(asset?: number): boolean {
  if (!asset) {
    return false;
  }

  try {
    const player =
      players.get(asset) ??
      createAudioPlayer(asset, {
        downloadFirst: true,
        updateInterval: 250,
      });

    players.set(asset, player);
    player.volume = 1;
    void player.seekTo(0)
      .catch(() => undefined)
      .finally(() => player.play());
    return true;
  } catch (error) {
    console.warn("Learning sound is unavailable.", error);
    return false;
  }
}
