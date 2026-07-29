import type {
  VocabularyCategory,
  VocabularySubcategory,
} from "@/src/data/vocabulary/types";
export { VOCABULARY_LOTTIE_SOURCES } from "@/src/data/assets/vocabulary-animation-assets";

type VocabularyImageOptions = {
  accentColor: string;
  category: VocabularyCategory;
  emoji: string;
  subcategory: VocabularySubcategory;
  word: string;
};

const SUBCATEGORY_DECOR: Record<VocabularySubcategory, string> = {
  alphabet: "book",
  animals: "paw",
  body: "tap",
  colors: "spark",
  community: "spark",
  actions: "tap",
  family: "heart",
  nature: "sun",
  school: "book",
  story: "book",
  vocabulary: "book",
  plants: "leaf",
  things: "spark",
  reading: "book",
  adding: "plus",
  comparing: "ruler",
  counting: "count",
  division: "count",
  fractions: "shape",
  measurement: "ruler",
  money: "coin",
  multiplication: "plus",
  numbers: "count",
  patterns: "shape",
  "place-value": "count",
  "problem-solving": "spark",
  shapes: "shape",
};

function clampColorChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const safeHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : normalized;

  return {
    r: parseInt(safeHex.slice(0, 2), 16),
    g: parseInt(safeHex.slice(2, 4), 16),
    b: parseInt(safeHex.slice(4, 6), 16),
  };
}

function mixHex(hex: string, target: { r: number; g: number; b: number }, amount: number) {
  const source = hexToRgb(hex);

  return `rgb(${clampColorChannel(source.r + (target.r - source.r) * amount)}, ${clampColorChannel(source.g + (target.g - source.g) * amount)}, ${clampColorChannel(source.b + (target.b - source.b) * amount)})`;
}

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatWordLines(word: string) {
  const parts = word.toUpperCase().split(/\s+/);

  if (parts.length <= 2) {
    return parts;
  }

  const midpoint = Math.ceil(parts.length / 2);
  return [
    parts.slice(0, midpoint).join(" "),
    parts.slice(midpoint).join(" "),
  ];
}

function createWordLineMarkup(word: string) {
  const lines = formatWordLines(word);
  const startingY = lines.length === 1 ? 92 : 78;

  return lines
    .map(
      (line, index) =>
        `<tspan x="50%" y="${startingY + index * 34}">${escapeSvgText(line)}</tspan>`
    )
    .join("");
}

export function createVocabularyImageUri({
  accentColor,
  category,
  emoji,
  subcategory,
  word,
}: VocabularyImageOptions) {
  const primaryBackground = mixHex(accentColor, { r: 255, g: 255, b: 255 }, 0.14);
  const secondaryBackground = mixHex(accentColor, { r: 225, g: 245, b: 255 }, 0.64);
  const highlight = mixHex(accentColor, { r: 255, g: 255, b: 255 }, 0.78);
  const shadow = mixHex(accentColor, { r: 15, g: 23, b: 42 }, 0.18);
  const badgeBackground = mixHex(accentColor, { r: 255, g: 255, b: 255 }, 0.82);
  const categoryLabel = category === "linguistic" ? "WORD BANK" : "NUMBER LAB";
  const decorLabel = SUBCATEGORY_DECOR[subcategory].toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primaryBackground}" />
          <stop offset="100%" stop-color="${secondaryBackground}" />
        </linearGradient>
      </defs>
      <rect width="320" height="220" rx="28" fill="url(#bg)" />
      <circle cx="268" cy="54" r="52" fill="${highlight}" opacity="0.75" />
      <circle cx="60" cy="186" r="66" fill="${highlight}" opacity="0.32" />
      <path d="M28 168c34-21 75-30 125-28 43 2 88 14 139 38" fill="none" stroke="${highlight}" stroke-width="8" stroke-linecap="round" opacity="0.5" />
      <rect x="20" y="18" width="104" height="28" rx="14" fill="${badgeBackground}" opacity="0.96" />
      <text x="72" y="37" text-anchor="middle" font-size="12" font-family="Arial, sans-serif" font-weight="700" fill="${shadow}">${categoryLabel}</text>
      <rect x="206" y="18" width="94" height="28" rx="14" fill="${badgeBackground}" opacity="0.96" />
      <text x="253" y="37" text-anchor="middle" font-size="12" font-family="Arial, sans-serif" font-weight="700" fill="${shadow}">${decorLabel}</text>
      <text x="50%" y="122" text-anchor="middle" font-size="28" font-family="Arial, sans-serif" font-weight="800" fill="#FFFFFF">${createWordLineMarkup(word)}</text>
      <circle cx="56" cy="66" r="22" fill="${accentColor}" opacity="0.92" />
      <text x="56" y="74" text-anchor="middle" font-size="22" font-family="Arial, sans-serif" font-weight="700" fill="#FFFFFF">${escapeSvgText(emoji)}</text>
      <text x="50%" y="190" text-anchor="middle" font-size="13" font-family="Arial, sans-serif" font-weight="700" fill="${shadow}">Tap, say, and remember</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
