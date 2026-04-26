#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = process.cwd();
const errors = [];
const warnings = [];

function exists(p) {
  return fs.existsSync(path.join(repoRoot, p));
}

function readFile(p) {
  return fs.readFileSync(path.join(repoRoot, p), "utf8");
}

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function parseFrontmatter(markdown, filePath) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    addError(`[${filePath}] Missing YAML frontmatter.`);
    return {};
  }

  const frontmatter = {};
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    frontmatter[key] = value;
  }

  return frontmatter;
}

function validateCoreMemory() {
  const requiredFiles = [
    "_opensquad/_memory/company.md",
    "_opensquad/_memory/preferences.md",
  ];

  for (const file of requiredFiles) {
    if (!exists(file)) {
      addError(`Missing required memory file: ${file}`);
    }
  }
}

function validateWorkspaceConfig() {
  const workspaceConfigPath = "_opensquad/config/workspace.config.json";
  if (!exists(workspaceConfigPath)) {
    addError(`Missing workspace config: ${workspaceConfigPath}`);
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(readFile(workspaceConfigPath));
  } catch (error) {
    addError(`[${workspaceConfigPath}] Invalid JSON: ${error.message}`);
    return;
  }

  const requiredFields = ["workspaceMode", "projectsDir", "globalSquadsDir", "globalSkillsDir"];
  for (const field of requiredFields) {
    if (!(field in parsed)) {
      addError(`[${workspaceConfigPath}] Missing field: ${field}`);
    }
  }

  if (parsed.workspaceMode && !["global", "project"].includes(parsed.workspaceMode)) {
    addError(
      `[${workspaceConfigPath}] Invalid workspaceMode "${parsed.workspaceMode}". Expected "global" or "project".`
    );
  }
}

function validateSkills() {
  const skillsDir = path.join(repoRoot, "skills");
  if (!fs.existsSync(skillsDir)) {
    addWarning("skills/ directory not found.");
    return;
  }

  const required = ["name", "description", "type", "version"];
  const allowedTypes = new Set(["mcp", "script", "hybrid", "prompt"]);

  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillPath = path.join(skillsDir, entry.name, "SKILL.md");
    const relSkillPath = path.relative(repoRoot, skillPath).replace(/\\/g, "/");
    if (!fs.existsSync(skillPath)) {
      addWarning(`[${entry.name}] missing SKILL.md`);
      continue;
    }

    const content = fs.readFileSync(skillPath, "utf8");
    const fm = parseFrontmatter(content, relSkillPath);

    for (const field of required) {
      if (!(field in fm) || !String(fm[field]).trim()) {
        addError(`[${relSkillPath}] Missing required frontmatter field: ${field}`);
      }
    }

    if (fm.type) {
      const cleanType = String(fm.type).replace(/^['"]|['"]$/g, "");
      if (!allowedTypes.has(cleanType)) {
        addError(
          `[${relSkillPath}] Invalid skill type "${cleanType}". Expected one of: ${Array.from(
            allowedTypes
          ).join(", ")}`
        );
      }
    }
  }
}

function validateSquadTemplates() {
  const templatesRoot = path.join(repoRoot, "_opensquad", "templates", "squads");
  if (!fs.existsSync(templatesRoot)) {
    addError("Missing templates root: _opensquad/templates/squads");
    return;
  }

  const templateDirs = fs
    .readdirSync(templatesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== ".git" && entry.name !== "..")
    .map((entry) => entry.name);

  if (templateDirs.length === 0) {
    addWarning("No squad templates found in _opensquad/templates/squads.");
    return;
  }

  for (const templateId of templateDirs) {
    const base = `_opensquad/templates/squads/${templateId}`;
    const requiredFiles = [
      `${base}/template.json`,
      `${base}/squad.yaml`,
      `${base}/squad-party.csv`,
      `${base}/pipeline/pipeline.yaml`,
    ];
    for (const file of requiredFiles) {
      if (!exists(file)) addError(`[template:${templateId}] Missing file: ${file}`);
    }
  }
}

function validateBestPracticesCatalog() {
  const catalogPath = "_opensquad/core/best-practices/_catalog.yaml";
  if (!exists(catalogPath)) {
    addError(`Missing catalog file: ${catalogPath}`);
    return;
  }

  const raw = readFile(catalogPath);
  const files = [];
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*file:\s*(.+)\s*$/);
    if (!m) continue;
    const fileName = m[1].trim().replace(/^['"]|['"]$/g, "");
    files.push(fileName);
  }

  if (files.length === 0) {
    addError(`[${catalogPath}] No best-practice files found in catalog.`);
    return;
  }

  const seen = new Set();
  for (const fileName of files) {
    if (seen.has(fileName)) {
      addWarning(`[${catalogPath}] Duplicate file entry: ${fileName}`);
      continue;
    }
    seen.add(fileName);

    const fullRel = `_opensquad/core/best-practices/${fileName}`;
    if (!exists(fullRel)) {
      addError(`[${catalogPath}] Referenced file not found: ${fullRel}`);
    }
  }
}

function validatePromptArtifacts() {
  const promptFiles = [
    "_opensquad/core/prompts/discovery.prompt.md",
    "_opensquad/core/prompts/design.prompt.md",
    "_opensquad/core/prompts/build.prompt.md",
    "_opensquad/core/runner.pipeline.md",
  ];

  for (const file of promptFiles) {
    if (!exists(file)) continue;
    const content = readFile(file);
    if (content.includes("`r`n")) {
      addError(`[${file}] Found literal sequence \`r\`n that indicates corrupted line breaks.`);
    }
  }
}

function validateSoftwareSupportPrompts() {
  const discoveryPath = "_opensquad/core/prompts/discovery.prompt.md";
  const designPath = "_opensquad/core/prompts/design.prompt.md";

  if (exists(discoveryPath)) {
    const discovery = readFile(discoveryPath);
    if (!discovery.includes("`software`")) {
      addError(`[${discoveryPath}] Missing software domain support in discovery flow.`);
    }
  }

  if (exists(designPath)) {
    const design = readFile(designPath);
    if (!design.includes("Software Squad Pattern")) {
      addWarning(`[${designPath}] Software Squad Pattern section not found.`);
    }
  }
}

function validateTeamBlueprints() {
  const blueprintsPath = "_opensquad/templates/team-blueprints.json";
  if (!exists(blueprintsPath)) {
    addError(`Missing team blueprints file: ${blueprintsPath}`);
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(readFile(blueprintsPath));
  } catch (error) {
    addError(`[${blueprintsPath}] Invalid JSON: ${error.message}`);
    return;
  }

  if (!Array.isArray(parsed.blueprints) || parsed.blueprints.length === 0) {
    addError(`[${blueprintsPath}] "blueprints" must be a non-empty array.`);
    return;
  }

  const ids = new Set();
  for (const bp of parsed.blueprints) {
    if (!bp || typeof bp !== "object") {
      addError(`[${blueprintsPath}] Invalid blueprint entry.`);
      continue;
    }
    if (!bp.id || !bp.name || !bp.description) {
      addError(`[${blueprintsPath}] Every blueprint must include id, name, and description.`);
      continue;
    }
    if (ids.has(bp.id)) {
      addError(`[${blueprintsPath}] Duplicate blueprint id: ${bp.id}`);
    }
    ids.add(bp.id);

    if (!Array.isArray(bp.squads) || bp.squads.length === 0) {
      addError(`[${blueprintsPath}] Blueprint "${bp.id}" must include a non-empty squads array.`);
      continue;
    }

    for (const squad of bp.squads) {
      if (!squad.templateId || !squad.code || !squad.name) {
        addError(
          `[${blueprintsPath}] Blueprint "${bp.id}" has squad entries missing templateId/code/name.`
        );
      }
    }
  }

  const requiredScript = "scripts/bootstrap-team-blueprint.js";
  if (!exists(requiredScript)) {
    addError(`Missing adaptive team bootstrap script: ${requiredScript}`);
  }
}

function validateCodexOpensquadSkill() {
  const skillPath = ".agents/skills/opensquad/SKILL.md";
  if (!exists(skillPath)) {
    addError(`Missing Codex skill file: ${skillPath}`);
    return;
  }

  const fm = parseFrontmatter(readFile(skillPath), skillPath);
  for (const field of ["name", "description"]) {
    if (!(field in fm) || !String(fm[field]).trim()) {
      addError(`[${skillPath}] Missing required frontmatter field: ${field}`);
    }
  }

  const requiredFiles = [
    ".agents/skills/opensquad/agents/openai.yaml",
    ".agents/skills/opensquad/references/team-quickstart.md",
    ".agents/skills/opensquad/references/operating-model.md",
    "scripts/install-codex-opensquad-skill.js",
  ];

  for (const file of requiredFiles) {
    if (!exists(file)) {
      addError(`Missing required Codex team-skill file: ${file}`);
    }
  }
}

function main() {
  validateCoreMemory();
  validateWorkspaceConfig();
  validateSkills();
  validateSquadTemplates();
  validateBestPracticesCatalog();
  validatePromptArtifacts();
  validateSoftwareSupportPrompts();
  validateTeamBlueprints();
  validateCodexOpensquadSkill();

  if (warnings.length > 0) {
    console.log("Warnings:");
    for (const warning of warnings) {
      console.log(`  - ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error("Validation failed:");
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log("Opensquad validation passed.");
}

main();
