import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/src/config/firebase";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import { buildLearningArchitectureSnapshot } from "@/src/data/curriculum/firestore-architecture";
import type {
  FirestoreActivityDocument,
  FirestoreChallengeDocument,
  FirestoreCurriculumLevelDocument,
  FirestoreRewardDocument,
  FirestoreStageDocument,
  FirestoreTopicDocument,
  FirestoreWorldDocument,
  LearningArchitectureSnapshot,
} from "@/src/data/curriculum/firestore-architecture";

type LearningArchitectureCollectionName =
  | "activities"
  | "challenges"
  | "curriculumLevels"
  | "rewards"
  | "stages"
  | "topics"
  | "worlds";

const COLLECTION_NAMES = {
  activities: "activities",
  challenges: "challenges",
  curriculumLevels: "curriculumLevels",
  rewards: "rewards",
  stages: "stages",
  topics: "topics",
  worlds: "worlds",
} satisfies Record<LearningArchitectureCollectionName, string>;

async function getPublishedCollection<T extends { id: string; order?: number }>(
  collectionName: LearningArchitectureCollectionName
) {
  if (USE_NODE_BACKEND) return buildLearningArchitectureSnapshot()[collectionName] as unknown as T[];
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAMES[collectionName]),
      where("isPublished", "==", true)
    )
  );

  return snapshot.docs
    .map((docSnapshot) => ({
      id: docSnapshot.id,
      ...docSnapshot.data(),
    }) as T)
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
}

export async function getPublishedLearningArchitecture(): Promise<LearningArchitectureSnapshot> {
  const [
    activities,
    challenges,
    curriculumLevels,
    rewards,
    stages,
    topics,
    worlds,
  ] = await Promise.all([
    getPublishedCollection<FirestoreActivityDocument>("activities"),
    getPublishedCollection<FirestoreChallengeDocument>("challenges"),
    getPublishedCollection<FirestoreCurriculumLevelDocument>("curriculumLevels"),
    getPublishedCollection<FirestoreRewardDocument>("rewards"),
    getPublishedCollection<FirestoreStageDocument>("stages"),
    getPublishedCollection<FirestoreTopicDocument>("topics"),
    getPublishedCollection<FirestoreWorldDocument>("worlds"),
  ]);

  return {
    activities,
    challenges,
    curriculumLevels,
    rewards,
    stages,
    topics,
    worlds,
  };
}

export async function getPublishedWorldsForCurriculumLevel(curriculumLevel: string) {
  if (USE_NODE_BACKEND) return buildLearningArchitectureSnapshot().worlds.filter(world => world.curriculumLevel === curriculumLevel);
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAMES.worlds),
      where("isPublished", "==", true),
      where("curriculumLevel", "==", curriculumLevel),
      orderBy("order", "asc")
    )
  );

  return snapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  }) as FirestoreWorldDocument);
}

export async function getPublishedTopicArchitecture(topicId: string) {
  const [stages, activities, challenges, rewards] = await Promise.all([
    getPublishedCollection<FirestoreStageDocument>("stages"),
    getPublishedCollection<FirestoreActivityDocument>("activities"),
    getPublishedCollection<FirestoreChallengeDocument>("challenges"),
    getPublishedCollection<FirestoreRewardDocument>("rewards"),
  ]);

  return {
    activities: activities.filter((activity) => activity.topicId === topicId),
    challenges: challenges.filter((challenge) => challenge.topicId === topicId),
    rewards: rewards.filter((reward) => reward.topicId === topicId),
    stages: stages.filter((stage) => stage.topicId === topicId),
  };
}
