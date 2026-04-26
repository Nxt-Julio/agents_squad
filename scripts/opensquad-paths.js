#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const WORKSPACE_CONFIG_PATH = path.join(
  "_opensquad",
  "config",
  "workspace.config.json"
);

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function getDefaultWorkspaceConfig() {
  return {
    version: "1.0.0",
    workspaceMode: "global",
    activeProject: "",
    projectsDir: "projects",
    globalSquadsDir: "squads",
    globalSkillsDir: "skills",
    inheritGlobalSkills: true,
  };
}

function loadWorkspaceConfig(repoRoot = process.cwd()) {
  const fullPath = path.join(repoRoot, WORKSPACE_CONFIG_PATH);
  const existing = readJsonIfExists(fullPath);
  if (existing) return existing;
  const fallback = getDefaultWorkspaceConfig();
  writeJson(fullPath, fallback);
  return fallback;
}

function saveWorkspaceConfig(config, repoRoot = process.cwd()) {
  const fullPath = path.join(repoRoot, WORKSPACE_CONFIG_PATH);
  writeJson(fullPath, config);
}

function slugifyProjectCode(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function ensureFileWithContent(fullPath, content) {
  if (fs.existsSync(fullPath)) return;
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf8");
}

function getProjectRoot(repoRoot, projectCode, config) {
  return path.join(repoRoot, config.projectsDir || "projects", projectCode);
}

function listProjects(repoRoot = process.cwd(), config = loadWorkspaceConfig(repoRoot)) {
  const projectsDir = path.join(repoRoot, config.projectsDir || "projects");
  if (!fs.existsSync(projectsDir)) return [];
  return fs
    .readdirSync(projectsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function ensureProjectSkeleton(projectCode, repoRoot = process.cwd(), config = loadWorkspaceConfig(repoRoot)) {
  const code = slugifyProjectCode(projectCode);
  if (!code) throw new Error("Invalid project code.");

  const projectRoot = getProjectRoot(repoRoot, code, config);
  const dirs = [
    path.join(projectRoot, "_memory"),
    path.join(projectRoot, "skills"),
    path.join(projectRoot, "squads"),
  ];
  for (const dir of dirs) fs.mkdirSync(dir, { recursive: true });

  ensureFileWithContent(
    path.join(projectRoot, "_memory", "company.md"),
    [
      "# Company Context",
      "",
      "<!-- NOT CONFIGURED -->",
      "",
      "## Company Name",
      "",
      "## Website",
      "",
      "## Description",
      "",
      "## Sector",
      "",
      "## Target Audience",
      "",
      "## Products and Services",
      "",
      "## Tone of Voice",
      "",
      "## Social Profiles",
      "",
    ].join("\n")
  );

  ensureFileWithContent(
    path.join(projectRoot, "_memory", "preferences.md"),
    [
      "# Opensquad Preferences",
      "",
      "- **User Name:**",
      "- **Output Language:** Português (Brasil)",
      "- **IDEs:**",
      "- **Date Format:** YYYY-MM-DD",
      "",
    ].join("\n")
  );

  ensureFileWithContent(path.join(projectRoot, "squads", ".gitkeep"), "\n");
  ensureFileWithContent(path.join(projectRoot, "skills", ".gitkeep"), "\n");

  return { code, projectRoot };
}

function resolveWorkspacePaths(
  repoRoot = process.cwd(),
  options = {}
) {
  const config = loadWorkspaceConfig(repoRoot);
  const envProject = process.env.OPENSQUAD_PROJECT || "";
  const requestedProject = options.project || envProject || config.activeProject || "";
  const mode = options.mode || config.workspaceMode || "global";

  const globalSquadsDir = path.join(repoRoot, config.globalSquadsDir || "squads");
  const globalSkillsDir = path.join(repoRoot, config.globalSkillsDir || "skills");

  if (mode === "project" && requestedProject) {
    const projectCode = slugifyProjectCode(requestedProject);
    const projectRoot = getProjectRoot(repoRoot, projectCode, config);
    const projectSquadsDir = path.join(projectRoot, "squads");
    const projectSkillsDir = path.join(projectRoot, "skills");
    const memoryDir = path.join(projectRoot, "_memory");

    return {
      mode: "project",
      projectCode,
      projectRoot,
      squadsDir: projectSquadsDir,
      skillsDir: projectSkillsDir,
      globalSquadsDir,
      globalSkillsDir,
      memoryDir,
      inheritGlobalSkills: config.inheritGlobalSkills !== false,
      workspaceConfigPath: path.join(repoRoot, WORKSPACE_CONFIG_PATH),
    };
  }

  return {
    mode: "global",
    projectCode: "",
    projectRoot: repoRoot,
    squadsDir: globalSquadsDir,
    skillsDir: globalSkillsDir,
    globalSquadsDir,
    globalSkillsDir,
    memoryDir: path.join(repoRoot, "_opensquad", "_memory"),
    inheritGlobalSkills: true,
    workspaceConfigPath: path.join(repoRoot, WORKSPACE_CONFIG_PATH),
  };
}

function setActiveProject(projectCode, repoRoot = process.cwd()) {
  const config = loadWorkspaceConfig(repoRoot);
  const code = slugifyProjectCode(projectCode);
  config.workspaceMode = "project";
  config.activeProject = code;
  saveWorkspaceConfig(config, repoRoot);
  return config;
}

function setGlobalMode(repoRoot = process.cwd()) {
  const config = loadWorkspaceConfig(repoRoot);
  config.workspaceMode = "global";
  config.activeProject = "";
  saveWorkspaceConfig(config, repoRoot);
  return config;
}

module.exports = {
  WORKSPACE_CONFIG_PATH,
  getDefaultWorkspaceConfig,
  loadWorkspaceConfig,
  saveWorkspaceConfig,
  slugifyProjectCode,
  listProjects,
  ensureProjectSkeleton,
  resolveWorkspacePaths,
  setActiveProject,
  setGlobalMode,
};

if (require.main === module) {
  const repoRoot = process.cwd();
  const paths = resolveWorkspacePaths(repoRoot);
  process.stdout.write(JSON.stringify(paths, null, 2) + "\n");
}

