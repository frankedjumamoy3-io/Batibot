import type { KindergartenCommunityWorldConfig } from "./types";

export const KINDERGARTEN_COMMUNITY_WORLD_ID =
  "kindergarten-community-village";

export const KINDERGARTEN_COMMUNITY_WORLD_CONFIG: KindergartenCommunityWorldConfig = {
  id: KINDERGARTEN_COMMUNITY_WORLD_ID,
  title: "Community Helpers",
  emoji: "\uD83C\uDFD8\uFE0F",
  accentColor: "#0EA5E9",
  description:
    "Help community workers complete jobs using their places and tools.",
  activities: [
    "Help doctor",
    "Help nurse",
    "Help teacher",
    "Help police officer",
    "Help firefighter",
    "Deliver food with farmer",
  ],
  topics: [
    {
      assetId: "doctor",
      title: "Doctor",
      emoji: "\uD83E\uDDD1\u200D\u2695\uFE0F",
      category: "linguistic",
      subcategory: "community",
      interactionTypes: ["Tap Activity", "Listening Activity", "Match Activity", "Timed Challenge"],
    },
    {
      assetId: "nurse",
      title: "Nurse",
      emoji: "\uD83E\uDDD1\u200D\u2695\uFE0F",
      category: "linguistic",
      subcategory: "community",
      interactionTypes: ["Tap Activity", "Listening Activity", "Match Activity", "Timed Challenge"],
      example: "Nurse cares for patients.",
    },
    {
      assetId: "teacher",
      title: "Teacher",
      emoji: "\uD83E\uDDD1\u200D\uD83C\uDFEB",
      category: "linguistic",
      subcategory: "community",
      interactionTypes: ["Tap Activity", "Listening Activity", "Match Activity", "Timed Challenge"],
      example: "Teacher helps us learn.",
    },
    {
      assetId: "police-officer",
      title: "Police Officer",
      emoji: "\uD83D\uDC6E",
      category: "linguistic",
      subcategory: "community",
      interactionTypes: ["Tap Activity", "Listening Activity", "Match Activity", "Timed Challenge"],
    },
    {
      assetId: "firefighter",
      title: "Firefighter",
      emoji: "\uD83E\uDDD1\u200D\uD83D\uDE92",
      category: "linguistic",
      subcategory: "community",
      interactionTypes: ["Tap Activity", "Listening Activity", "Match Activity", "Timed Challenge"],
    },
    {
      assetId: "farmer",
      title: "Farmer",
      emoji: "\uD83E\uDDD1\u200D\uD83C\uDF3E",
      category: "linguistic",
      subcategory: "community",
      interactionTypes: ["Tap Activity", "Listening Activity", "Match Activity", "Timed Challenge"],
    },
    {
      assetId: "community-challenge",
      title: "Community Challenge",
      emoji: "BADGE",
      category: "linguistic",
      subcategory: "community",
      interactionTypes: ["Match Activity", "Drag and Drop Activity", "Mastery Challenge"],
      example: "Match every worker to a job and place.",
    },
  ],
};
