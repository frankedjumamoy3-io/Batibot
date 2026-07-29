import { batibotAssetRegistry } from "@/src/assets/assetRegistry";
import {
  ANIMAL_SOUND_ASSETS,
  PLAY_BACKGROUNDS,
  REWARD_ASSETS,
  WORLD_IMAGES,
} from "@/src/data/play-assets";

export type AdminAssetCatalogItem = {
  grade?: string;
  hasSource: boolean;
  key: string;
  label: string;
  topic?: string;
  world?: string;
};

export function getAdminAssetCatalog() {
  const assets: AdminAssetCatalogItem[] = Object.values(batibotAssetRegistry).map((asset) => ({
    grade: asset.grade,
    hasSource: Boolean(asset.source),
    key: asset.key,
    label: asset.label,
    topic: asset.topic,
    world: asset.world,
  }));
  const labelCounts = assets.reduce<Record<string, number>>((counts, asset) => {
    const key = asset.label.trim().toLowerCase();
    return { ...counts, [key]: (counts[key] ?? 0) + 1 };
  }, {});

  return {
    assets,
    audioCount: Object.keys(ANIMAL_SOUND_ASSETS).length,
    backgroundCount: Object.keys(PLAY_BACKGROUNDS).length,
    duplicateLabelCount: Object.values(labelCounts).filter((count) => count > 1).length,
    iconCount: Object.keys(REWARD_ASSETS).length,
    missingSourceCount: assets.filter((asset) => !asset.hasSource).length,
    worldImageCount: Object.keys(WORLD_IMAGES).length,
  };
}
