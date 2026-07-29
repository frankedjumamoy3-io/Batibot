const { spawn } = require("node:child_process");
const net = require("node:net");
const path = require("node:path");

const DEFAULT_PORT = 8082;
const MAX_PORT = 8090;
const DEFAULT_NODE_OPTIONS = "--max-old-space-size=8192";

function getNodeOptions() {
  const current = process.env.NODE_OPTIONS ?? "";

  if (current.includes("--max-old-space-size")) {
    return current;
  }

  return [DEFAULT_NODE_OPTIONS, current].filter(Boolean).join(" ");
}

function getExpoArgs(port) {
  const rawArgs = process.argv.slice(2);
  const shouldClear = rawArgs.includes("--clear");
  const shouldOpenAndroid = rawArgs.includes("--android");
  const shouldOpenIos = rawArgs.includes("--ios");
  const shouldOpenWeb = rawArgs.includes("--web");
  const shouldTunnel = rawArgs.includes("--tunnel");
  const args = ["start"];

  if (shouldClear) args.push("--clear");
  if (shouldOpenAndroid) args.push("--android");
  if (shouldOpenIos) args.push("--ios");
  if (shouldOpenWeb) args.push("--web");

  args.push("--host", shouldTunnel ? "tunnel" : "lan", "--port", String(port));

  return args;
}

function canListen(port, host) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, host);
  });
}

async function isPortAvailable(port) {
  if (!(await canListen(port, "0.0.0.0"))) {
    return false;
  }

  return canListen(port, "::");
}

async function findAvailablePort() {
  for (let port = DEFAULT_PORT; port <= MAX_PORT; port += 1) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }

  return null;
}

async function main() {
  const port = await findAvailablePort();

  if (!port) {
    console.error(
      `Expo ports ${DEFAULT_PORT}-${MAX_PORT} are already in use. Keep the existing Expo server open and reload Expo Go, or stop stale Metro processes before starting a new one.`
    );
    process.exit(1);
  }

  const expoCli = path.join(__dirname, "..", "node_modules", "expo", "bin", "cli");
  const env = Object.fromEntries(
    Object.entries({
      ...process.env,
      EXPO_NO_TELEMETRY: "1",
      NODE_OPTIONS: getNodeOptions(),
    }).filter((entry) => typeof entry[1] === "string")
  );
  console.log(
    `Starting Expo on port ${port} with ${env.NODE_OPTIONS}. Use npm run start:fresh only when Metro cache needs a reset.`
  );
  if (port !== DEFAULT_PORT) {
    console.log(`Port ${DEFAULT_PORT} is busy, so BatiBot is using ${port} for this session.`);
  }
  const child = spawn(
    process.execPath,
    [expoCli, ...getExpoArgs(port)],
    {
      env,
      stdio: "inherit",
    }
  );

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
