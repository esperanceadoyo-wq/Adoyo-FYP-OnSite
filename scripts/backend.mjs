import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const isWindows = process.platform === "win32";
const virtualEnvironmentPython = path.join(
  repositoryRoot,
  "backend",
  ".venv",
  isWindows ? "Scripts/python.exe" : "bin/python",
);
const command = process.argv[2];

function run(executable, args) {
  const result = spawnSync(executable, args, {
    cwd: repositoryRoot,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function supportsRequiredPython(executable, prefix = []) {
  const result = spawnSync(executable, [
    ...prefix,
    "-c",
    "import sys; raise SystemExit(0 if sys.version_info >= (3, 10) else 1)",
  ]);
  return result.status === 0;
}

function findSystemPython() {
  const configuredPython = process.env.ONSITE_PYTHON;
  const candidates = configuredPython
    ? [[configuredPython, []]]
    : isWindows
      ? [["py", ["-3.11"]], ["py", ["-3.10"]], ["python", []]]
      : [["python3.13", []], ["python3.12", []], ["python3.11", []], ["python3.10", []], ["python3", []]];

  for (const [executable, prefix] of candidates) {
    if (supportsRequiredPython(executable, prefix)) {
      return { executable, prefix };
    }
  }

  console.error(
    "Python 3.10 or newer is required. Set ONSITE_PYTHON to a compatible interpreter.",
  );
  process.exit(1);
}

function requireVirtualEnvironment() {
  if (!existsSync(virtualEnvironmentPython)) {
    console.error("Backend environment missing. Run `npm run backend:setup` first.");
    process.exit(1);
  }
  return virtualEnvironmentPython;
}

if (command === "setup") {
  if (!existsSync(virtualEnvironmentPython)) {
    const { executable, prefix } = findSystemPython();
    run(executable, [...prefix, "-m", "venv", "backend/.venv"]);
  }

  run(virtualEnvironmentPython, ["-m", "pip", "install", "-r", "backend/requirements.txt"]);
  run(virtualEnvironmentPython, ["-m", "flask", "--app", "backend/run.py", "db", "upgrade"]);
  run(virtualEnvironmentPython, ["-m", "flask", "--app", "backend/run.py", "seed"]);
  process.exit(0);
}

const python = requireVirtualEnvironment();
const commands = {
  dev: ["backend/run.py"],
  migrate: ["-m", "flask", "--app", "backend/run.py", "db", "upgrade"],
  seed: ["-m", "flask", "--app", "backend/run.py", "seed"],
  test: ["-m", "pytest", "backend/tests"],
};

if (!(command in commands)) {
  console.error("Usage: node scripts/backend.mjs <setup|dev|migrate|seed|test>");
  process.exit(1);
}

run(python, commands[command]);
