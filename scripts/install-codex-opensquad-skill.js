#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

function parseArgs(argv) {
  return {
    force: argv.includes("--force"),
    dryRun: argv.includes("--dry-run"),
    printPath: argv.includes("--print-path"),
  };
}

function getCodexSkillsRoot() {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
  return path.join(codexHome, "skills");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(__dirname, "..");
  const sourceDir = path.join(repoRoot, ".agents", "skills", "opensquad");
  const targetRoot = getCodexSkillsRoot();
  const targetDir = path.join(targetRoot, "opensquad");

  if (!fs.existsSync(sourceDir)) {
    console.error(`Source skill not found: ${sourceDir}`);
    process.exit(1);
  }

  if (args.printPath) {
    console.log(targetDir);
    return;
  }

  if (args.dryRun) {
    console.log("Dry run:");
    console.log(`- source: ${sourceDir}`);
    console.log(`- target: ${targetDir}`);
    console.log(`- force: ${args.force ? "yes" : "no"}`);
    return;
  }

  fs.mkdirSync(targetRoot, { recursive: true });

  if (fs.existsSync(targetDir)) {
    if (!args.force) {
      console.log(`Skill already installed at: ${targetDir}`);
      console.log("Use --force to overwrite.");
      return;
    }
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });

  const installedSkillFile = path.join(targetDir, "SKILL.md");
  if (!fs.existsSync(installedSkillFile)) {
    console.error("Install failed: missing SKILL.md in target.");
    process.exit(1);
  }

  console.log(`Installed skill: opensquad`);
  console.log(`Location: ${targetDir}`);
}

main();
