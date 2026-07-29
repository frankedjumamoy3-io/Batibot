const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkedRoots = ["app", "components", path.join("src", "screens"), path.join("src", "navigation")];
const extensions = new Set([".ts", ".tsx", ".js", ".jsx"]);
const violations = [];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory()
      ? walk(target)
      : extensions.has(path.extname(entry.name))
        ? [target]
        : [];
  });
}

checkedRoots.flatMap((directory) => walk(path.join(root, directory))).forEach((file) => {
  const source = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);

  if (source.includes("@/src/data/play-assets")) {
    violations.push(`${relative} imports the physical curriculum asset library directly.`);
  }

  if (/require\([^)]*Batibot assets/i.test(source)) {
    violations.push(`${relative} requires a curriculum asset directly.`);
  }
});

const resolver = fs.readFileSync(
  path.join(root, "src", "services", "assets", "assetResolver.ts"),
  "utf8"
);
[
  "export type AssetResolutionRequest",
  "const assetCache",
  "function findRegisteredAsset",
  "export function registerAsset",
  "export function resolveTopicAssetSource",
  "export function resolveWorldAssetSource",
  "parseAssetSlot",
].forEach((snippet) => {
  if (!resolver.includes(snippet)) {
    violations.push(`assetResolver.ts is missing ${snippet}.`);
  }
});

const manifest = fs.readFileSync(
  path.join(root, "src", "data", "assets", "batibot-asset-manifest.ts"),
  "utf8"
);
["category:", "tags:", "remoteUri?: string", "uri?: string"].forEach((snippet) => {
  if (!manifest.includes(snippet)) {
    violations.push(`batibot-asset-manifest.ts is missing ${snippet}.`);
  }
});

if (violations.length) {
  console.error("Global asset resolution validation failed:");
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exit(1);
}

console.log("Global asset resolution validation passed.");
