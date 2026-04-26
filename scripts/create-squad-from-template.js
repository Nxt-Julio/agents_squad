#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const {
  resolveWorkspacePaths,
  ensureProjectSkeleton,
  slugifyProjectCode,
} = require("./opensquad-paths");

const TEMPLATES_ROOT = path.join(
  "_opensquad",
  "templates",
  "squads"
);

function usage() {
  console.log(
    [
      "Usage:",
      "  node scripts/create-squad-from-template.js list",
      "  node scripts/create-squad-from-template.js create <template-id> <squad-code> [--name \"Squad Name\"] [--project <project-code>] [--force]",
    ].join("\n")
  );
}

function listTemplates(repoRoot) {
  const root = path.join(repoRoot, TEMPLATES_ROOT);
  if (!fs.existsSync(root)) {
    console.log("No templates directory found.");
    return;
  }
  const entries = fs.readdirSync(root, { withFileTypes: true }).filter((e) => e.isDirectory());
  for (const entry of entries) {
    const metaPath = path.join(root, entry.name, "template.json");
    let title = entry.name;
    let description = "";
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
      title = meta.name || title;
      description = meta.description || "";
    } catch {
      // best effort
    }
    console.log(`- ${entry.name}: ${title}${description ? ` - ${description}` : ""}`);
  }
}

function parseArgs(argv) {
  const args = { force: false, name: "", project: "" };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--force") {
      args.force = true;
      continue;
    }
    if (token === "--name") {
      args.name = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (token === "--project") {
      args.project = argv[i + 1] || "";
      i += 1;
      continue;
    }
  }
  return args;
}

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return [
    ".md",
    ".yaml",
    ".yml",
    ".json",
    ".csv",
    ".txt",
    ".js",
    ".ts",
    ".tsx",
  ].includes(ext);
}

function walkFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, acc);
      continue;
    }
    acc.push(fullPath);
  }
  return acc;
}

function replaceTokensInTree(targetDir, replacements) {
  const files = walkFiles(targetDir);
  for (const file of files) {
    if (!isTextFile(file)) continue;
    let content = fs.readFileSync(file, "utf8");
    for (const [key, value] of Object.entries(replacements)) {
      content = content.split(key).join(value);
    }
    fs.writeFileSync(file, content, "utf8");
  }
}

function ensurePipelineData(targetDir) {
  const dataDir = path.join(targetDir, "pipeline", "data");
  fs.mkdirSync(dataDir, { recursive: true });

  const placeholders = {
    "research-brief.md": "# Research Brief\n\nGenerated from template scaffold.\n",
    "domain-framework.md": "# Domain Framework\n\nGenerated from template scaffold.\n",
    "quality-criteria.md": "# Quality Criteria\n\nGenerated from template scaffold.\n",
    "output-examples.md": "# Output Examples\n\nGenerated from template scaffold.\n",
    "anti-patterns.md": "# Anti-Patterns\n\nGenerated from template scaffold.\n",
  };

  for (const [name, content] of Object.entries(placeholders)) {
    const fullPath = path.join(dataDir, name);
    if (!fs.existsSync(fullPath)) fs.writeFileSync(fullPath, content, "utf8");
  }
}

function createFromTemplate(repoRoot, templateId, squadCodeInput, options) {
  const templateDir = path.join(repoRoot, TEMPLATES_ROOT, templateId);
  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const squadCode = slugifyProjectCode(squadCodeInput);
  if (!squadCode) {
    throw new Error("Invalid squad code.");
  }

  let paths;
  if (options.project) {
    const projectCode = slugifyProjectCode(options.project);
    if (!projectCode) throw new Error("Invalid project code.");
    ensureProjectSkeleton(projectCode, repoRoot);
    paths = resolveWorkspacePaths(repoRoot, { mode: "project", project: projectCode });
  } else {
    paths = resolveWorkspacePaths(repoRoot);
  }

  fs.mkdirSync(paths.squadsDir, { recursive: true });

  const targetDir = path.join(paths.squadsDir, squadCode);
  if (fs.existsSync(targetDir)) {
    if (!options.force) {
      throw new Error(
        `Target squad already exists: ${path.relative(repoRoot, targetDir)} (use --force to overwrite)`
      );
    }
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  fs.cpSync(templateDir, targetDir, { recursive: true });
  const templateMetaPath = path.join(targetDir, "template.json");
  if (fs.existsSync(templateMetaPath)) fs.rmSync(templateMetaPath);

  const squadName = options.name || squadCode.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join(" ");
  const today = new Date().toISOString().slice(0, 10);
  replaceTokensInTree(targetDir, {
    "__SQUAD_CODE__": squadCode,
    "__SQUAD_NAME__": squadName,
    "__TODAY__": today,
  });
  ensurePipelineData(targetDir);

  console.log(`Template: ${templateId}`);
  console.log(`Squad created: ${path.relative(repoRoot, targetDir).replace(/\\/g, "/")}`);
  console.log(`Workspace mode: ${paths.mode}${paths.projectCode ? ` (${paths.projectCode})` : ""}`);
}

function main() {
  const repoRoot = process.cwd();
  const [, , command, ...rest] = process.argv;
  if (!command) {
    usage();
    process.exit(0);
  }

  try {
    if (command === "list") {
      listTemplates(repoRoot);
      return;
    }
    if (command === "create") {
      const [templateId, squadCode, ...flags] = rest;
      if (!templateId || !squadCode) {
        usage();
        process.exit(1);
      }
      const options = parseArgs(flags);
      createFromTemplate(repoRoot, templateId, squadCode, options);
      return;
    }
    usage();
    process.exit(1);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  TEMPLATES_ROOT,
  listTemplates,
  createFromTemplate,
  parseArgs,
  replaceTokensInTree,
  ensurePipelineData,
};

if (require.main === module) {
  main();
}
