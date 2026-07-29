import type { PreschoolSizeRole } from "./types";

export const SIZE_SUCCESS_TEXT = "Size matched!";

export function getSizeDestinationLabel(targetSize: PreschoolSizeRole) {
  return targetSize === "big" || targetSize === "tall" ? "big basket" : "small basket";
}
