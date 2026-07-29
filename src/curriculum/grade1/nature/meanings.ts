import type { Grade1NatureMeaning } from "./types";
import { getGrade1NatureTopicKey } from "./topics";

export const GRADE1_NATURE_MEANINGS: Record<string, Grade1NatureMeaning> = {
  tree: {
    meaning: "A tree is a tall plant with a trunk, branches, and leaves.",
    pronunciation: "tree",
    examples: ["mango tree", "shade tree", "fruit tree"],
  },
  flower: {
    meaning: "A flower is the colorful part of a plant.",
    pronunciation: "flower",
    examples: ["red flower", "yellow flower", "garden flower"],
  },
  forest: {
    meaning: "A forest is a place with many trees and plants.",
    pronunciation: "forest",
    examples: ["forest trail", "forest trees", "forest animals"],
  },
  river: {
    meaning: "A river is moving water that flows across land.",
    pronunciation: "river",
    examples: ["wide river", "clean river", "river bank"],
  },
  mountain: {
    meaning: "A mountain is a very high landform.",
    pronunciation: "mountain",
    examples: ["high mountain", "green mountain", "mountain path"],
  },
  "nature-challenge": {
    meaning: "Nature challenge uses tree, flower, forest, river, and mountain.",
    pronunciation: "nature challenge",
    examples: ["Sort nature features.", "Match places in nature."],
  },
};

export function getGrade1NatureMeaning(topicTitle: string) {
  return GRADE1_NATURE_MEANINGS[getGrade1NatureTopicKey(topicTitle)];
}
