import type { Grade3MoneyWorldConfig } from "./types";

export const GRADE3_MONEY_WORLD_ID = "grade3-money";

export const GRADE3_MONEY_WORLD_CONFIG: Grade3MoneyWorldConfig = {
  id: GRADE3_MONEY_WORLD_ID,
  title: "Money Market",
  emoji: "🪙",
  accentColor: "#EAB308",
  description: "Count coins and solve money problems.",
  activities: ["Story problems","Counting activity","Timed challenge"],
  topics: [
    {
      assetId: "coins",
      title: "Coins",
      emoji: "C",
      category: "numeric",
      subcategory: "money",
      interactionTypes: ["Counting Activity","Story-Based Activity"],
      example: "Recognize coin values.",
    },
    {
      assetId: "bills",
      title: "Bills",
      emoji: "B",
      category: "numeric",
      subcategory: "money",
      interactionTypes: ["Counting Activity","Story-Based Activity"],
      example: "Recognize bill values.",
    },
    {
      assetId: "counting-money",
      title: "Counting Money",
      emoji: "C",
      category: "numeric",
      subcategory: "money",
      interactionTypes: ["Counting Activity","Story-Based Activity"],
    },
    {
      assetId: "making-amounts",
      title: "Making Amounts",
      emoji: "M",
      category: "numeric",
      subcategory: "money",
      interactionTypes: ["Counting Activity","Story-Based Activity"],
      example: "Choose coins and bills to make an amount.",
    },
    {
      assetId: "buying-items",
      title: "Buying Items",
      emoji: "B",
      category: "numeric",
      subcategory: "money",
      interactionTypes: ["Counting Activity","Story-Based Activity"],
      example: "Use money to buy an item.",
    },
    {
      assetId: "making-change",
      title: "Making Change",
      emoji: "C",
      category: "numeric",
      subcategory: "money",
      interactionTypes: ["Counting Activity","Story-Based Activity"],
      example: "Find change from a purchase.",
    },
    {
      assetId: "money-word-problems",
      title: "Money Word Problems",
      emoji: "W",
      category: "numeric",
      subcategory: "money",
      interactionTypes: ["Counting Activity","Story-Based Activity"],
      example: "Solve a money word problem.",
    }
  ],
};
