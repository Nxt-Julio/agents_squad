#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const {
  ensureProjectSkeleton,
  slugifyProjectCode,
} = require("./opensquad-paths");

function usage() {
  console.log(
    [
      "Usage:",
      "  node scripts/migrate-squad-to-project.js <squad-name> <project-code> [--copy]",
      "",
      "Default behavior moves the squad.",
      "Use --copy to keep original squad in root squads/.",
    ].join("\n")
  );
}

function ensureDir(fullPath) {
  fs.mkdirSync(fullPath, { recursive: true });
}

function main() {
  const repoRoot = process.cwd();
  const [, , squadNameRaw, projectRaw, flag] = process.argv;
  if (!squadNameRaw || !projectRaw) {
    usage();
    process.exit(1);
  }

  const squadName = String(squadNameRaw).trim();
  const projectCode = slugifyProjectCode(projectRaw);
  if (!projectCode) {
    console.error("Invalid project code.");
    process.exit(1);
  }

  const source = path.join(repoRoot, "squads", squadName);
  if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) {
    console.error(`Squad not found: squads/${squadName}`);
    process.exit(1);
  }

  const { projectRoot } = ensureProjectSkeleton(projectCode, repoRoot);
  const targetBase = path.join(projectRoot, "squads");
  ensureDir(targetBase);

  const target = path.join(targetBase, squadName);
  if (fs.existsSync(target)) {
    console.error(
      `Target already exists: projects/${projectCode}/squads/${squadName}`
    );
    process.exit(1);
  }

  const shouldCopy = flag === "--copy";
  if (shouldCopy) {
    fs.cpSync(source, target, { recursive: true });
    console.log(
      `Squad copied to projects/${projectCode}/squads/${squadName}`
    );
  } else {
    fs.renameSync(source, target);
    console.log(
      `Squad moved to projects/${projectCode}/squads/${squadName}`
    );
  }
}

main();

