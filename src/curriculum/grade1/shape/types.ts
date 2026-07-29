export type Grade1ShapeTopicId =
  | "2d-shapes"
  | "3d-shapes"
  | "shape-properties"
  | "shape-challenge";

export type Grade1ShapeTopicConfig = {
  assetId: string;
  category: "numeric";
  emoji: string;
  example?: string;
  interactionTypes: string[];
  subcategory: "shapes";
  title: string;
};

export type Grade1ShapeWorldConfig = {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: Grade1ShapeTopicConfig[];
};

export type Grade1ShapeMeaning = {
  examples: string[];
  meaning: string;
  pronunciation: string;
};
