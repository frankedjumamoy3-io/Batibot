export type GradeLevel =
  | "preschool"
  | "kindergarten"
  | "grade1"
  | "grade2"
  | "grade3";

export type LearnerProfile = {
  uid: string;
  displayName: string;
  avatarAssetKey?: string | null;
  avatarId?: string | null;
  buddyEmoji?: string | null;
  profileImageUrl?: string | null;
  profilePhotoUrl?: string | null;
  gradeLevel: GradeLevel;
  xp: number;
  stars: number;
  completedWorlds: string[];
  completedTopics: string[];
  badges: string[];
  achievements: string[];
  currentWorldId?: string;
  isTestAccount?: boolean;
  lastPlayedAt?: string;
  unlockAllQuizzes?: boolean;
};

export type WorldNode = {
  id: string;
  gradeLevel: GradeLevel;
  title: string;
  description?: string;
  imageUri?: string;
  emoji?: string;
  requiredWorldId?: string;
  order: number;
};

export type TopicNode = {
  id: string;
  worldId: string;
  gradeLevel: GradeLevel;
  title: string;
  instruction: string;
  imageUri?: string;
  emoji?: string;
  requiredTopicId?: string;
  order: number;
};

export type RankEntry = {
  uid: string;
  displayName: string;
  gradeLevel: GradeLevel;
  xp: number;
  stars: number;
};

export type Badge = {
  id: string;
  gradeLevel: GradeLevel;
  title: string;
  requirement: string;
  iconUri?: string;
  worldId?: string;
};

export type Achievement = {
  id: string;
  gradeLevel: GradeLevel | "global";
  title: string;
  requirement: string;
  targetValue: number;
  metric:
    | "lessonsCompleted"
    | "wordsLearned"
    | "activitiesCompleted"
    | "perfectScores"
    | "streakDays"
    | "xp"
    | "stars"
    | "worldsCompleted";
};
