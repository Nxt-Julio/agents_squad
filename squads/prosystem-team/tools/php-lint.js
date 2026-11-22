#!/usr/bin/env node
// Confere a sintaxe dos arquivos PHP e JS do ProSystem.
//
// Uso (na raiz do agents_squad):
//   node squads/prosystem-team/tools/php-lint.js --changed <pasta do repo>   # arquivos alterados/novos no git
//   node squads/prosystem-team/tools/php-lint.js <arquivo> [...]
//
// PHP: usa `php -l` se houver PHP no PATH; se não, usa o pacote php-parser,
// instalado sozinho em squads/prosystem-team/tools/node_modules (fora do Git).
// JS: `node --check` (arquivos .min.js são ignorados).
// Só pega erro de sintaxe, não erro de execução. Sai com código 1 se houver erro.

const { execFileSync, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const toolsDir = __dirname;
const args = process.argv.slice(2);

function listChanged(repo) {
  const run = (a) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8" });
  const tracked = run(["diff", "--name-only", "--diff-filter=ACMR", "HEAD"]);
  const untracked = run(["ls-files", "--others", "--exclude-standard"]);
  return [...new Set((tracked + "\n" + untracked).split(/\r?\n/).filter(Boolean))].map((f) =>
    path.join(repo, f)
  );
}

let files = [];
let base = process.cwd();
if (args[0] === "--changed") {
  if (!args[1]) {
    console.error("uso: php-lint.js --changed <pasta do repo>");
    process.exit(2);
  }
  base = path.resolve(args[1]);
  files = listChanged(base);
} else {
  files = args.map((f) => path.resolve(f));
}

files = files.filter((f) => /\.(php|js)$/i.test(f) && !/\.min\.js$/i.test(f) && fs.existsSync(f));
if (files.length === 0) {
  console.log("Nenhum arquivo .php/.js para conferir.");
  process.exit(0);
}

const hasPhp = spawnSync("php", ["-v"], { encoding: "utf8", shell: false }).status === 0;
let engine = null;
function phpParser() {
  if (engine) return engine;
  const mod = path.join(toolsDir, "node_modules", "php-parser");
  if (!fs.existsSync(mod)) {
    console.log("Instalando php-parser@3 em squads/prosystem-team/tools/node_modules ...");
    const r = spawnSync("npm", ["install", "--no-save", "--no-package-lock", "--prefix", toolsDir, "php-parser@3"], {
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    if (r.status !== 0) {
      console.error("Falha ao instalar php-parser.");
      process.exit(2);
    }
  }
  const Engine = require(mod);
  engine = new Engine({ parser: { php8: true, suppressErrors: false }, ast: { withPositions: true } });
  return engine;
}

let errors = 0;
for (const file of files) {
  const rel = path.relative(base, file).replace(/\\/g, "/");
  let msg = null;
  if (/\.php$/i.test(file)) {
    if (hasPhp) {
      const r = spawnSync("php", ["-l", file], { encoding: "utf8" });
      if (r.status !== 0) msg = (r.stdout + r.stderr).trim();
    } else {
      try {
        phpParser().parseCode(fs.readFileSync(file, "utf8"), file);
      } catch (e) {
        msg = e.message;
      }
    }
  } else {
    const r = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (r.status !== 0) msg = r.stderr.split(/\r?\n/).filter((l) => l.trim() && !/^\s+at /.test(l)).slice(0, 4).join("\n");
  }
  if (msg) {
    errors += 1;
    console.log(`ERRO ${rel}\n     ${msg.replace(/\n/g, "\n     ")}`);
  } else {
    console.log(`OK   ${rel}`);
  }
}

console.log(`${files.length} arquivo(s), ${errors} erro(s) [${hasPhp ? "php -l" : "php-parser"}]`);
process.exit(errors ? 1 : 0);
