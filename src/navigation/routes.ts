export const APP_ROUTES = {
  auth: {
    online: "/(auth)/online",
    login: "/(auth)/login",
    signup: "/(auth)/signup",
    forgotPassword: "/(auth)/forgot-password",
  },
  admin: {
    analytics: "/(admin)/analytics",
    assetLibrary: "/(admin)/asset-library",
    contentCuration: "/(admin)/content-curation",
    createDraft: "/(admin)/create-draft",
    createTopic: "/(admin)/create-topic",
    dashboard: "/(admin)",
    drafts: "/(admin)/drafts",
    publishing: "/(admin)/publishing",
    reviewQueue: "/(admin)/review-queue",
    settings: "/(admin)/settings",
    topicEditor: "/(admin)/topic-editor/[draftId]",
    users: "/(admin)/users",
  },
  tabs: {
    play: "/(tabs)/play",
    topic: "/(tabs)/topic/[topicId]",
    worldTopics: "/(tabs)/world/[worldId]/topics",
    vocabulary: "/(tabs)/vocabulary",
    vocabularyDetail: "/(tabs)/vocabulary/detail",
    quiz: "/(tabs)/quiz",
    rank: "/(tabs)/rank",
    reward: "/(tabs)/reward",
    rewardDetail: "/(tabs)/reward/detail",
  },
  lesson: {
    topic: "/lesson/[topicId]",
  },
  modal: "/modal",
} as const;

export const STACK_ROUTE_NAMES = {
  admin: "(admin)",
  auth: "(auth)",
  lessonTopic: "lesson/[topicId]",
  tabs: "(tabs)",
  modal: "modal",
} as const;

export const TAB_ROUTE_NAMES = {
  play: "play",
  rank: "rank",
  reward: "reward",
  vocabulary: "vocabulary",
  quiz: "quiz",
} as const;

export const VISIBLE_TAB_ROUTE_NAMES = [
  TAB_ROUTE_NAMES.rank,
  TAB_ROUTE_NAMES.play,
  TAB_ROUTE_NAMES.reward,
] as const;

export const HIDDEN_TAB_ROUTE_NAMES = [
  "home",
  "progress",
  "badges",
  "badges/detail",
  "vocabulary",
  "vocabulary/index",
  "vocabulary/words",
  "vocabulary/detail",
  "reward/detail",
  "world/[worldId]/topics",
  "topic/[topicId]",
  "quiz",
  "quiz/index",
  "quiz/quiz-section",
  "quiz/linguistic/index",
  "quiz/numeric/index",
  "quiz/result",
] as const;

export type VisibleTabRouteName = (typeof VISIBLE_TAB_ROUTE_NAMES)[number];

export type HiddenTabRouteName = (typeof HIDDEN_TAB_ROUTE_NAMES)[number];
