import type { NumberQuantityObjectAsset } from "./types";

export const NUMBER_SUPPORT_WORLD_IDS = {
  animal: "preschool-animal-adventure",
  fruit: "preschool-fruit-garden",
  shape: "preschool-shape-kingdom",
} as const;

export const MIXED_SHAPE_ASSETS: NumberQuantityObjectAsset[] = [
  {
    objectAssetTopicTitle: "Circle",
    objectAssetWorldId: NUMBER_SUPPORT_WORLD_IDS.shape,
    objectKind: "shape",
    objectLabel: "Circle",
  },
  {
    objectAssetTopicTitle: "Square",
    objectAssetWorldId: NUMBER_SUPPORT_WORLD_IDS.shape,
    objectKind: "shape",
    objectLabel: "Square",
  },
  {
    objectAssetTopicTitle: "Triangle",
    objectAssetWorldId: NUMBER_SUPPORT_WORLD_IDS.shape,
    objectKind: "shape",
    objectLabel: "Triangle",
  },
  {
    objectAssetTopicTitle: "Star",
    objectAssetWorldId: NUMBER_SUPPORT_WORLD_IDS.shape,
    objectKind: "shape",
    objectLabel: "Star",
  },
  {
    objectAssetTopicTitle: "Rectangle",
    objectAssetWorldId: NUMBER_SUPPORT_WORLD_IDS.shape,
    objectKind: "shape",
    objectLabel: "Rectangle",
  },
];
