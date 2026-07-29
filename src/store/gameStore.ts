// TYPES
export interface GameState {
  level: number;
  xp: number;
  streak: number;
  learnedWords: number;
}

// XP SYSTEM (Duolingo-style scaling)
export function getXPForNextLevel(level: number): number {
  return 50 + level * 25; 
}

export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let xp = totalXP;

  while (xp >= getXPForNextLevel(level)) {
    xp -= getXPForNextLevel(level);
    level++;
  }

  return level;
}

export function getXPInCurrentLevel(totalXP: number): number {
  let level = 1;
  let xp = totalXP;

  while (xp >= getXPForNextLevel(level)) {
    xp -= getXPForNextLevel(level);
    level++;
  }

  return xp;
}
