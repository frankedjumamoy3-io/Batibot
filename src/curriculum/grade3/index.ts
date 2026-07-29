import {
  GRADE3_READING_LITERACY_BLUEPRINTS,
} from "./reading";
import { GRADE3_CONTEXT_CLUE_LITERACY_BLUEPRINTS } from "./context-clue";
import { GRADE3_STORY_LITERACY_BLUEPRINTS } from "./story";
import type { Grade3LiteracyBlueprint } from "./types";

export * from "./reading";
export * from "./context-clue";
export * from "./story";
export * from "./number";
export * from "./multiplication";
export * from "./division";
export * from "./fraction";
export * from "./money";
export * from "./challenge";
export * from "./types";

const GRADE3_LITERACY_BLUEPRINTS: Record<string, Grade3LiteracyBlueprint> = {
  ...GRADE3_READING_LITERACY_BLUEPRINTS,
  ...GRADE3_CONTEXT_CLUE_LITERACY_BLUEPRINTS,
  ...GRADE3_STORY_LITERACY_BLUEPRINTS,
};

export function getGrade3LiteracyBlueprint(worldId: string, topicTitle: string) {
  return GRADE3_LITERACY_BLUEPRINTS[worldId + ":" + topicTitle] ?? null;
}
