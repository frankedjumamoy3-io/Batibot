export const HERO_SHEET_BODY_HEIGHT = {
  compact: 238,
  regular: 250,
} as const;

export function getHeroSheetHeight(topInset: number, isCompact: boolean) {
  return topInset + (isCompact ? HERO_SHEET_BODY_HEIGHT.compact : HERO_SHEET_BODY_HEIGHT.regular);
}
