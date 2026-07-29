import type { KindergartenNumberForestStageMetadata } from "./types";

export const KINDERGARTEN_NUMBER_CHALLENGE_SKILLS = [
  "number 11",
  "number 12",
  "number 13",
  "number 14",
  "number 15",
  "number 16",
  "number 17",
  "number 18",
  "number 19",
  "number 20",
];

export function getKindergartenNumberStageMetadata(
  topicTitle: string
): KindergartenNumberForestStageMetadata | null {
  if (/^Number\s+(1[1-9]|20)$/.test(topicTitle)) {
    return {
      countingRange: "11 to 20",
      countingSkill: "count and match teen quantity",
      forestMissionType: "number path",
      forestObjectTypes: ["forest counters", "number cards"],
    };
  }

  if (topicTitle === "Number Challenge") {
    return {
      countingRange: "11 to 20",
      countingSkill: "mixed teen number counting",
      forestChallengeSkills: KINDERGARTEN_NUMBER_CHALLENGE_SKILLS,
      forestMissionType: "number challenge path",
      forestObjectTypes: ["forest counters", "number cards"],
    };
  }

  return null;
}

export function getKindergartenNumberPlayInstruction(topicTitle: string) {
  if (/^Number\s+(?:1[1-9]|20)$/i.test(topicTitle)) {
    return `Build ${topicTitle} on the forest path.`;
  }

  if (topicTitle === "Number Challenge") {
    return "Complete the numbers 11 to 20 challenge.";
  }

  return "Complete the forest mission.";
}
