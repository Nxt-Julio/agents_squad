#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { createFromTemplate } = require("./create-squad-from-template");
const { slugifyProjectCode } = require("./opensquad-paths");

const BLUEPRINTS_FILE = path.join("_opensquad", "templates", "team-blueprints.json");

function usage() {
  console.log(
    [
      "Usage:",
      "  node scripts/bootstrap-team-blueprint.js list",
      "  node scripts/bootstrap-team-blueprint.js detect [--source <project-path>] [--json]",
      "  node scripts/bootstrap-team-blueprint.js apply [--blueprint <id>] [--source <project-path>] [--project <project-code>] [--prefix <code-prefix>] [--force] [--dry-run]",
    ].join("\n")
  );
}

function parseFlags(argv) {
  const opts = {
    source: ".",
    blueprint: "",
    project: "",
    prefix: "",
    force: false,
    dryRun: false,
    json: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--force") {
      opts.force = true;
      continue;
    }
    if (token === "--dry-run") {
      opts.dryRun = true;
      continue;
    }
    if (token === "--json") {
      opts.json = true;
      continue;
    }
    if (token === "--source") {
      opts.source = argv[i + 1] || ".";
      i += 1;
      continue;
    }
    if (token === "--blueprint") {
      opts.blueprint = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (token === "--project") {
      opts.project = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (token === "--prefix") {
      opts.prefix = argv[i + 1] || "";
      i += 1;
      continue;
    }
  }

  return opts;
}

function loadBlueprints(repoRoot) {
  const fullPath = path.join(repoRoot, BLUEPRINTS_FILE);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Blueprint file not found: ${BLUEPRINTS_FILE}`);
  }
  const parsed = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  if (!Array.isArray(parsed.blueprints) || parsed.blueprints.length === 0) {
    throw new Error(`No blueprints defined in ${BLUEPRINTS_FILE}`);
  }
  return parsed.blueprints;
}

function readPackageJson(sourceDir) {
  const packageJsonPath = path.join(sourceDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  } catch {
    return null;
  }
}

function dirExists(base, relative) {
  return fs.existsSync(path.join(base, relative));
}

function fileExists(base, relative) {
  return fs.existsSync(path.join(base, relative));
}

function hasAnyDependency(pkg, names) {
  if (!pkg) return false;
  const deps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
    ...(pkg.peerDependencies || {}),
  };
  const keys = Object.keys(deps);
  return names.some((name) => keys.includes(name));
}

function hasDependencyPattern(pkg, patterns) {
  if (!pkg) return false;
  const deps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
    ...(pkg.peerDependencies || {}),
  };
  const keys = Object.keys(deps);
  return patterns.some((pattern) => keys.some((dep) => dep.includes(pattern)));
}

function inspectProject(sourceDir) {
  const pkg = readPackageJson(sourceDir);
  const mobileDeps = hasAnyDependency(pkg, [
    "react-native",
    "expo",
    "@capacitor/core",
    "@ionic/react",
  ]);
  const webDeps = hasAnyDependency(pkg, [
    "react",
    "next",
    "vue",
    "nuxt",
    "svelte",
    "@angular/core",
    "astro",
  ]);
  const backendDeps = hasAnyDependency(pkg, [
    "express",
    "fastify",
    "@nestjs/core",
    "koa",
    "hono",
    "django",
    "flask",
  ]);
  const ecommerceDeps = hasAnyDependency(pkg, [
    "@shopify/shopify-api",
    "@shopify/hydrogen",
    "@medusajs/medusa",
    "@saleor/sdk",
    "@commercetools/platform-sdk",
    "@vendure/core",
    "@woocommerce/woocommerce-rest-api",
  ]) || hasDependencyPattern(pkg, ["shopify", "commerce", "medusa", "saleor", "vendure", "woocommerce"]);

  const facts = {
    sourceDir,
    packageName: pkg && pkg.name ? String(pkg.name) : "",
    hasAndroidDir: dirExists(sourceDir, "android"),
    hasIosDir: dirExists(sourceDir, "ios"),
    hasFlutterPubspec: fileExists(sourceDir, "pubspec.yaml"),
    hasWebDir: dirExists(sourceDir, "web") || dirExists(sourceDir, "apps/web"),
    hasApiDir: dirExists(sourceDir, "api") || dirExists(sourceDir, "server") || dirExists(sourceDir, "apps/api"),
    hasMobileDeps: mobileDeps,
    hasWebDeps: webDeps,
    hasBackendDeps: backendDeps,
    hasEcommerceDeps: ecommerceDeps,
    hasLandingDir:
      dirExists(sourceDir, "landing") ||
      dirExists(sourceDir, "marketing") ||
      dirExists(sourceDir, "apps/landing"),
  };

  return facts;
}

function scoreBlueprint(id, facts) {
  let score = 0;
  const reasons = [];

  if (id === "mobile-web-app") {
    if (facts.hasAndroidDir || facts.hasIosDir || facts.hasFlutterPubspec) {
      score += 4;
      reasons.push("mobile platform files detected");
    }
    if (facts.hasMobileDeps) {
      score += 4;
      reasons.push("mobile dependencies detected");
    }
    if (facts.hasWebDeps || facts.hasWebDir) {
      score += 2;
      reasons.push("web surface detected");
    }
    if (facts.hasApiDir || facts.hasBackendDeps) {
      score += 1;
      reasons.push("backend/API surface detected");
    }
  } else if (id === "landing-page") {
    const hasLandingSurface =
      facts.hasWebDeps ||
      facts.hasWebDir ||
      facts.hasLandingDir ||
      facts.packageName.includes("landing") ||
      facts.packageName.includes("site");

    if (hasLandingSurface) {
      score += 4;
      reasons.push("web stack detected");
      if (facts.hasLandingDir || facts.packageName.includes("landing") || facts.packageName.includes("site")) {
        score += 3;
        reasons.push("landing/marketing structure detected");
      }
      if (!facts.hasApiDir && !facts.hasBackendDeps) {
        score += 2;
        reasons.push("no backend complexity detected");
      }
      if (!facts.hasEcommerceDeps) {
        score += 1;
        reasons.push("no e-commerce dependencies detected");
      }
    } else {
      reasons.push("missing web/landing signals");
    }
  } else if (id === "ecommerce") {
    if (facts.hasEcommerceDeps) {
      score += 5;
      reasons.push("e-commerce dependencies detected");
    }
    if (facts.hasWebDeps || facts.hasWebDir) {
      score += 2;
      reasons.push("web storefront detected");
    }
    if (facts.hasApiDir || facts.hasBackendDeps) {
      score += 2;
      reasons.push("backend/API services detected");
    }
  } else if (id === "software-general") {
    score = 1;
    reasons.push("fallback blueprint");
  }

  return { score, reasons };
}

function detectBlueprints(blueprints, facts) {
  const ranked = blueprints
    .map((bp) => {
      const { score, reasons } = scoreBlueprint(bp.id, facts);
      return {
        id: bp.id,
        name: bp.name,
        description: bp.description,
        score,
        reasons,
      };
    })
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  return ranked;
}

function replaceTokens(value, prefix) {
  return String(value || "").split("__PREFIX__").join(prefix);
}

function applyBlueprint(repoRoot, blueprints, options) {
  const sourceDir = path.resolve(repoRoot, options.source || ".");
  const facts = inspectProject(sourceDir);
  const ranked = detectBlueprints(blueprints, facts);

  const selectedId = options.blueprint || (ranked[0] ? ranked[0].id : "");
  const selected = blueprints.find((bp) => bp.id === selectedId);
  if (!selected) {
    throw new Error(`Blueprint not found: ${selectedId}`);
  }

  const derivedPrefix =
    slugifyProjectCode(options.prefix) ||
    slugifyProjectCode(options.project) ||
    slugifyProjectCode(path.basename(sourceDir)) ||
    "project";

  const plan = selected.squads.map((squad) => ({
    templateId: squad.templateId,
    code: slugifyProjectCode(replaceTokens(squad.code, derivedPrefix)),
    name: replaceTokens(squad.name, derivedPrefix)
      .split("-")
      .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
      .join(" "),
  }));

  if (options.dryRun) {
    console.log(`Blueprint: ${selected.id} (${selected.name})`);
    console.log(`Source: ${sourceDir}`);
    console.log(`Prefix: ${derivedPrefix}`);
    for (const item of plan) {
      console.log(`- ${item.templateId} -> ${item.code} (${item.name})`);
    }
    return;
  }

  for (const item of plan) {
    createFromTemplate(repoRoot, item.templateId, item.code, {
      project: options.project || "",
      name: item.name,
      force: options.force,
    });
  }

  console.log(`Adaptive team applied using blueprint: ${selected.id}`);
}

function cmdList(repoRoot) {
  const blueprints = loadBlueprints(repoRoot);
  for (const bp of blueprints) {
    console.log(`- ${bp.id}: ${bp.name} - ${bp.description}`);
  }
}

function cmdDetect(repoRoot, options) {
  const blueprints = loadBlueprints(repoRoot);
  const sourceDir = path.resolve(repoRoot, options.source || ".");
  const facts = inspectProject(sourceDir);
  const ranked = detectBlueprints(blueprints, facts);

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          sourceDir,
          facts,
          ranked,
          selected: ranked[0] || null,
        },
        null,
        2
      )
    );
    return;
  }

  console.log(`Source: ${sourceDir}`);
  console.log("Blueprint ranking:");
  for (const item of ranked) {
    console.log(`- ${item.id} (score ${item.score}): ${item.reasons.join("; ") || "no specific signals"}`);
  }
  if (ranked[0]) {
    console.log(`Selected: ${ranked[0].id}`);
  }
}

function cmdApply(repoRoot, options) {
  const blueprints = loadBlueprints(repoRoot);
  applyBlueprint(repoRoot, blueprints, options);
}

function main() {
  const repoRoot = process.cwd();
  const [, , command, ...rest] = process.argv;
  const options = parseFlags(rest);

  try {
    switch (command) {
      case "list":
        cmdList(repoRoot);
        return;
      case "detect":
        cmdDetect(repoRoot, options);
        return;
      case "apply":
        cmdApply(repoRoot, options);
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

if (require.main === module) {
  main();
}

module.exports = {
  loadBlueprints,
  inspectProject,
  detectBlueprints,
  applyBlueprint,
};
