import type { Grade1ShapeWorldConfig } from "./types";

export const GRADE1_SHAPE_WORLD_ID = "grade1-shapes";

export const GRADE1_SHAPE_WORLD_CONFIG: Grade1ShapeWorldConfig = {
  id: GRADE1_SHAPE_WORLD_ID,
  title: "Shape Adventure",
  emoji: "\uD83D\uDD36",
  accentColor: "#8B5CF6",
  description: "Explore 2D shapes, 3D shapes, and simple shape properties.",
  activities: ["Shape matching", "Puzzle quests", "Mastery check"],
  topics: [
    {
      assetId: "2d-shapes",
      title: "2D Shapes",
      emoji: "2D",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: ["Match Activity", "Puzzle Activity"],
      example: "Circle, square, triangle, and rectangle are 2D shapes.",
    },
    {
      assetId: "3d-shapes",
      title: "3D Shapes",
      emoji: "3D",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: ["Match Activity", "Puzzle Activity"],
      example: "Cube, sphere, cylinder, and cone are 3D shapes.",
    },
    {
      assetId: "shape-properties",
      title: "Shape Properties",
      emoji: "SIDE",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: ["Match Activity", "Puzzle Activity"],
      example: "Shapes have sides, corners, faces, and curves.",
    },
    {
      assetId: "shape-challenge",
      title: "Shape Challenge",
      emoji: "BADGE",
      category: "numeric",
      subcategory: "shapes",
      interactionTypes: [
        "Match Activity",
        "Puzzle Activity",
        "Mastery Challenge",
      ],
      example:
        "Build a playground using circles, squares, triangles, and rectangles.",
    },
  ],
};
