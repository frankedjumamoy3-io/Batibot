const fs = require("node:fs");
const path = require("node:path");

const workspaceRoot = path.resolve(__dirname, "..");
const CACHE_PATHS = [".expo", ".metro", path.join("node_modules", ".cache")];

function assertInsideWorkspace(targetPath) {
  const relative = path.relative(workspaceRoot, targetPath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to remove path outside workspace: ${targetPath}`);
  }
}

for (const cachePath of CACHE_PATHS) {
  const targetPath = path.resolve(workspaceRoot, cachePath);

  assertInsideWorkspace(targetPath);

  if (!fs.existsSync(targetPath)) {
    console.log(`Skipped missing ${cachePath}`);
    continue;
  }

  fs.rmSync(targetPath, { force: true, recursive: true });
  console.log(`Removed ${cachePath}`);
}
