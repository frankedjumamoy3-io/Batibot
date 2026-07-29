import type { KindergartenCommunityRolePrompt } from "./types";

const KINDERGARTEN_COMMUNITY_ROLE_PROMPTS: Record<
  string,
  KindergartenCommunityRolePrompt
> = {
  Doctor: { object: "clinic", prompt: "Who helps sick people?" },
  Farmer: { object: "farm", prompt: "Who grows food?" },
  Firefighter: { object: "fire truck", prompt: "Who puts out fire?" },
  Nurse: { object: "clinic", prompt: "Who helps sick people?" },
  "Police Officer": { object: "badge", prompt: "Who keeps us safe?" },
  Teacher: { object: "classroom", prompt: "Who helps us learn?" },
};

const KINDERGARTEN_COMMUNITY_MEANINGS: Record<string, string> = {
  teacher: "Teacher helps us learn.",
  doctor: "Doctor helps sick people.",
  "police-officer": "Police Officer keeps us safe.",
  firefighter: "Firefighter puts out fire.",
  farmer: "Farmer grows food.",
  "community-challenge": "Match every worker to a job and place.",
};

export function getKindergartenCommunityRolePrompt(
  topicTitle: string
): KindergartenCommunityRolePrompt {
  return (
    KINDERGARTEN_COMMUNITY_ROLE_PROMPTS[topicTitle] ?? {
      object: "workplace",
      prompt: `Who is the ${topicTitle}?`,
    }
  );
}

export function getKindergartenCommunityMeaning(topicTitle: string) {
  const topicKey = topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  return (
    KINDERGARTEN_COMMUNITY_MEANINGS[topicKey] ?? `${topicTitle}.`
  );
}
