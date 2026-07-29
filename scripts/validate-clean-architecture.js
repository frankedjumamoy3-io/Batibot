const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const UI_ROOTS = ["app", "components", path.join("src", "screens")];
const CHECKED_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const FORBIDDEN_UI_IMPORTS = [
  "firebase/",
  "@/src/config/firebase",
  "@/src/infrastructure/firebase",
  "@/src/infrastructure/gemini",
  "@/src/services/authService",
  "@/src/services/learnerSessionService",
  "@/src/services/userProfileService",
  "@/src/services/userSettingsService",
  "@/src/store/learner-progress",
  "@/src/data/play-assets",
];
const CORE_LAYER_RULES = [
  {
    roots: [
      path.join("src", "data"),
      path.join("src", "domain"),
      path.join("src", "infrastructure"),
      path.join("src", "services"),
    ],
    forbiddenImports: [
      "@/app",
      "@/components",
      "@/hooks",
      "@/src/presentation",
      "@/src/store",
    ],
  },
];

function walkFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return walkFiles(entryPath);
    }

    return CHECKED_EXTENSIONS.has(path.extname(entry.name)) ? [entryPath] : [];
  });
}

function getImportLines(source) {
  return source
    .split(/\r?\n/)
    .filter((line) => /^\s*import\s/.test(line) || /^\s*const\s+.+require\(/.test(line));
}

function validateForbiddenImports({ roots, forbiddenImports }) {
  const violations = [];

  for (const root of roots) {
  const absoluteRoot = path.join(PROJECT_ROOT, root);

  for (const filePath of walkFiles(absoluteRoot)) {
    const source = fs.readFileSync(filePath, "utf8");
    const importLines = getImportLines(source);

    for (const line of importLines) {
      const forbiddenImport = forbiddenImports.find((candidate) =>
        line.includes(candidate)
      );

      if (forbiddenImport) {
        violations.push(
          `${path.relative(PROJECT_ROOT, filePath)} imports ${forbiddenImport}`
        );
      }
    }
  }
}

  return violations;
}

const violations = [
  ...validateForbiddenImports({
    roots: UI_ROOTS,
    forbiddenImports: FORBIDDEN_UI_IMPORTS,
  }),
  ...CORE_LAYER_RULES.flatMap(validateForbiddenImports),
];

if (violations.length) {
  console.error("Clean architecture boundary validation failed:");
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exit(1);
}

console.log("Clean architecture boundary validation passed.");
