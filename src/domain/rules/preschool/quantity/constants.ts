import type { PreschoolQuantityRole } from "./types";

export const QUANTITY_SUCCESS_TEXT = "Group matched!";

export function getQuantityDestinationLabel(targetRole: PreschoolQuantityRole) {
  return targetRole === "more" ? "More basket" : "Less basket";
}
