export const SHOW_LESSON_LAYOUT_DEBUG = false;

type MissingAssetContext = {
  worldId: string;
  topicId?: string;
  stageId?: string;
  assetLabel: string;
  requestedKey?: string;
};

type OverflowContext = {
  worldId: string;
  topicId?: string;
  stageId?: string;
  contentType: string;
  itemCount?: number;
};

export function warnIfMissingAsset(context: MissingAssetContext) {
  if (__DEV__) {
    console.warn("[BatiBot UI Asset Fallback]", context);
  }
}

export function warnIfContentMayOverflow(context: OverflowContext) {
  if (__DEV__) {
    console.warn("[BatiBot UI Layout Check]", context);
  }
}
