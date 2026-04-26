#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { loadWorkspaceConfig } = require("./opensquad-paths");

function parseRunsMarkdown(raw) {
  const lines = raw.split(/\r?\n/).map((line) => line.trim());
  const rows = [];
  for (const line of lines) {
    if (!line.startsWith("|")) continue;
    if (line.includes("|------")) continue;
    const cells = line
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);
    if (cells.length !== 5) continue;
    if (cells[0] === "Data") continue;
    rows.push({
      date: cells[0],
      runId: cells[1],
      topic: cells[2],
      output: cells[3],
      result: cells[4],
    });
  }
  return rows;
}

function collectSquads(baseDir, project = "") {
  if (!fs.existsSync(baseDir)) return [];
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  const squads = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    squads.push({
      project,
      squad: entry.name,
      dir: path.join(baseDir, entry.name),
    });
  }
  return squads;
}

function collectRuns(repoRoot) {
  const config = loadWorkspaceConfig(repoRoot);
  const globalSquadsDir = path.join(repoRoot, config.globalSquadsDir || "squads");
  const projectsDir = path.join(repoRoot, config.projectsDir || "projects");

  const squadEntries = [];
  squadEntries.push(...collectSquads(globalSquadsDir));

  if (fs.existsSync(projectsDir)) {
    for (const projectEntry of fs.readdirSync(projectsDir, { withFileTypes: true })) {
      if (!projectEntry.isDirectory() || projectEntry.name.startsWith(".")) continue;
      const projectSquadsDir = path.join(projectsDir, projectEntry.name, "squads");
      squadEntries.push(...collectSquads(projectSquadsDir, projectEntry.name));
    }
  }

  const runs = [];
  for (const squadEntry of squadEntries) {
    const runsPath = path.join(squadEntry.dir, "_memory", "runs.md");
    if (!fs.existsSync(runsPath)) continue;
    const raw = fs.readFileSync(runsPath, "utf8");
    const parsedRows = parseRunsMarkdown(raw);
    for (const row of parsedRows) {
      runs.push({
        ...row,
        project: squadEntry.project,
        squad: squadEntry.squad,
      });
    }
  }

  runs.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return runs;
}

function renderMarkdown(runs) {
  const total = runs.length;
  const byResult = new Map();
  for (const run of runs) {
    byResult.set(run.result, (byResult.get(run.result) || 0) + 1);
  }

  const summaryLines = [
    "# Opensquad Portfolio Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Total runs tracked: ${total}`,
    "",
    "## Result summary",
    "",
  ];

  for (const [result, count] of Array.from(byResult.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    summaryLines.push(`- ${result}: ${count}`);
  }

  summaryLines.push("", "## Runs", "", "| Date | Project | Squad | Run ID | Topic | Output | Result |");
  summaryLines.push("|------|---------|-------|--------|-------|--------|--------|");
  for (const run of runs) {
    summaryLines.push(
      `| ${run.date} | ${run.project || "-"} | ${run.squad} | ${run.runId} | ${run.topic} | ${run.output} | ${run.result} |`
    );
  }
  summaryLines.push("");

  return summaryLines.join("\n");
}

function main() {
  const repoRoot = process.cwd();
  const runs = collectRuns(repoRoot);
  const markdown = renderMarkdown(runs);

  const outDir = path.join(repoRoot, "_opensquad", "reports");
  fs.mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, "portfolio-runs.json");
  const mdPath = path.join(outDir, "portfolio-runs.md");

  fs.writeFileSync(jsonPath, JSON.stringify(runs, null, 2) + "\n", "utf8");
  fs.writeFileSync(mdPath, markdown, "utf8");

  console.log(`Saved JSON: ${path.relative(repoRoot, jsonPath).replace(/\\/g, "/")}`);
  console.log(`Saved Markdown: ${path.relative(repoRoot, mdPath).replace(/\\/g, "/")}`);
}

main();

