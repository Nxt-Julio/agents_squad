#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const {
  loadWorkspaceConfig,
  ensureProjectSkeleton,
  listProjects,
  setActiveProject,
  setGlobalMode,
  resolveWorkspacePaths,
  slugifyProjectCode,
} = require("./opensquad-paths");

function usage() {
  console.log(
    [
      "Usage:",
      "  node scripts/opensquad-project.js list",
      "  node scripts/opensquad-project.js create <project-code>",
      "  node scripts/opensquad-project.js use <project-code>",
      "  node scripts/opensquad-project.js global",
      "  node scripts/opensquad-project.js current",
    ].join("\n")
  );
}

function cmdList(repoRoot) {
  const config = loadWorkspaceConfig(repoRoot);
  const projects = listProjects(repoRoot, config);
  if (projects.length === 0) {
    console.log("No projects found.");
    return;
  }
  for (const project of projects) {
    const active = config.workspaceMode === "project" && config.activeProject === project;
    console.log(`${active ? "*" : " "} ${project}`);
  }
}

function cmdCreate(repoRoot, rawCode) {
  const code = slugifyProjectCode(rawCode);
  if (!code) throw new Error("Invalid project code.");
  const { projectRoot } = ensureProjectSkeleton(code, repoRoot);
  console.log(`Project created: ${code}`);
  console.log(`Path: ${projectRoot}`);
}

function cmdUse(repoRoot, rawCode) {
  const code = slugifyProjectCode(rawCode);
  if (!code) throw new Error("Invalid project code.");
  ensureProjectSkeleton(code, repoRoot);
  const config = setActiveProject(code, repoRoot);
  console.log(`Workspace mode: ${config.workspaceMode}`);
  console.log(`Active project: ${config.activeProject}`);
}

function cmdGlobal(repoRoot) {
  const config = setGlobalMode(repoRoot);
  console.log(`Workspace mode: ${config.workspaceMode}`);
}

function cmdCurrent(repoRoot) {
  const resolved = resolveWorkspacePaths(repoRoot);
  console.log(JSON.stringify(resolved, null, 2));
}

function main() {
  const repoRoot = process.cwd();
  const [, , command, arg] = process.argv;

  try {
    switch (command) {
      case "list":
        cmdList(repoRoot);
        return;
      case "create":
        if (!arg) throw new Error("Missing project code.");
        cmdCreate(repoRoot, arg);
        return;
      case "use":
        if (!arg) throw new Error("Missing project code.");
        cmdUse(repoRoot, arg);
        return;
      case "global":
        cmdGlobal(repoRoot);
        return;
      case "current":
        cmdCurrent(repoRoot);
        return;
      default:
        usage();
        process.exit(command ? 1 : 0);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();

