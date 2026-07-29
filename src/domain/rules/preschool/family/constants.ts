import type { FamilyPlayCard } from "./types";

export const FAMILY_WORLD_ID = "preschool-family-world";

export const FAMILY_HOME_DRAG_CARDS: FamilyPlayCard[] = [
  { assetTopicTitle: "Baby", assetWorldId: FAMILY_WORLD_ID, id: "baby", label: "Baby", topicTitle: "Baby" },
  { assetTopicTitle: "Friend", assetWorldId: FAMILY_WORLD_ID, id: "friend", label: "Friend", topicTitle: "Friend" },
  { assetTopicTitle: "Trees", assetWorldId: "kindergarten-nature", id: "tree", label: "Tree", topicTitle: "Tree" },
  { assetTopicTitle: "Cow", assetWorldId: "preschool-animal-adventure", id: "cow", label: "Cow", topicTitle: "Cow" },
];

export const FAMILY_BUILD_CARDS: FamilyPlayCard[] = [
  { assetTopicTitle: "Home", assetWorldId: FAMILY_WORLD_ID, id: "home", label: "Home", topicTitle: "Home" },
  { assetTopicTitle: "Mother", assetWorldId: FAMILY_WORLD_ID, id: "mother", label: "Mother", topicTitle: "Mother" },
  { assetTopicTitle: "Father", assetWorldId: FAMILY_WORLD_ID, id: "father", label: "Father", topicTitle: "Father" },
  { assetTopicTitle: "Trees", assetWorldId: "kindergarten-nature", id: "tree", label: "Tree", topicTitle: "Tree" },
];
