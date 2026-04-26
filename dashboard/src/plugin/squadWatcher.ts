import type { Plugin, ViteDevServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import type { Server, IncomingMessage } from "node:http";
import type { Duplex } from "node:stream";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { watch as chokidarWatch } from "chokidar";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import type { SquadInfo, SquadState, WsMessage } from "../types/state";

interface WorkspaceConfig {
  workspaceMode?: "global" | "project";
  activeProject?: string;
  projectsDir?: string;
  globalSquadsDir?: string;
}

interface SquadTarget {
  squadsDir: string;
  project?: string;
}

function envTrue(name: string): boolean {
  const value = process.env[name];
  if (!value) return false;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function findRepoRoot(): string {
  const candidates = [
    process.cwd(),
    path.resolve(process.cwd(), ".."),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "_opensquad"))) return candidate;
  }
  return candidates[0];
}

function readWorkspaceConfig(repoRoot: string): WorkspaceConfig {
  const configPath = path.join(
    repoRoot,
    "_opensquad",
    "config",
    "workspace.config.json"
  );
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf-8")) as WorkspaceConfig;
  } catch {
    return {};
  }
}

function listProjectTargets(repoRoot: string, config: WorkspaceConfig): SquadTarget[] {
  const projectsDirName = config.projectsDir ?? "projects";
  const projectsDir = path.join(repoRoot, projectsDirName);
  if (!fs.existsSync(projectsDir)) return [];

  const targets: SquadTarget[] = [];
  for (const entry of fs.readdirSync(projectsDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const squadsDir = path.join(projectsDir, entry.name, "squads");
    if (!fs.existsSync(squadsDir)) continue;
    targets.push({ squadsDir, project: entry.name });
  }
  return targets;
}

function resolveTargets(): SquadTarget[] {
  const explicitDir = process.env.OPENSQUAD_SQUADS_DIR;
  if (explicitDir) {
    const squadsDir = path.isAbsolute(explicitDir)
      ? explicitDir
      : path.resolve(process.cwd(), explicitDir);
    return [{ squadsDir }];
  }

  const repoRoot = findRepoRoot();
  const config = readWorkspaceConfig(repoRoot);
  const globalSquadsDirName = config.globalSquadsDir ?? "squads";
  const globalTarget: SquadTarget = {
    squadsDir: path.join(repoRoot, globalSquadsDirName),
  };

  const includeGlobal = envTrue("OPENSQUAD_INCLUDE_GLOBAL");

  if (envTrue("OPENSQUAD_ALL_PROJECTS")) {
    const projectTargets = listProjectTargets(repoRoot, config);
    if (includeGlobal) return [globalTarget, ...projectTargets];
    return projectTargets.length > 0 ? projectTargets : [globalTarget];
  }

  const envProject = process.env.OPENSQUAD_PROJECT?.trim();
  const activeProject =
    envProject ||
    (config.workspaceMode === "project" ? config.activeProject?.trim() : "");

  if (activeProject) {
    const projectsDirName = config.projectsDir ?? "projects";
    const projectTarget: SquadTarget = {
      squadsDir: path.join(repoRoot, projectsDirName, activeProject, "squads"),
      project: activeProject,
    };
    if (includeGlobal) return [globalTarget, projectTarget];
    return [projectTarget];
  }

  return [globalTarget];
}

function buildSquadKey(target: SquadTarget, squadFolder: string): string {
  return target.project ? `${target.project}/${squadFolder}` : squadFolder;
}

async function discoverSquads(targets: SquadTarget[]): Promise<SquadInfo[]> {
  const squads: SquadInfo[] = [];

  for (const target of targets) {
    let entries;
    try {
      entries = await fsp.readdir(target.squadsDir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;

      const yamlPath = path.join(target.squadsDir, entry.name, "squad.yaml");
      const squadKey = buildSquadKey(target, entry.name);

      try {
        const raw = await fsp.readFile(yamlPath, "utf-8");
        const parsed = parseYaml(raw);
        const s = parsed?.squad;
        if (s) {
          squads.push({
            code: squadKey,
            rawCode: typeof s.code === "string" ? s.code : entry.name,
            name: typeof s.name === "string" ? s.name : entry.name,
            description: typeof s.description === "string" ? s.description : "",
            icon: typeof s.icon === "string" ? s.icon : "\u{1F4CB}",
            agents: Array.isArray(s.agents)
              ? (s.agents as unknown[]).filter((a): a is string => typeof a === "string")
              : [],
            project: target.project,
          });
          continue;
        }
      } catch {
        // Fall through with defaults
      }

      squads.push({
        code: squadKey,
        rawCode: entry.name,
        name: entry.name,
        description: "",
        icon: "\u{1F4CB}",
        agents: [],
        project: target.project,
      });
    }
  }

  return squads;
}

function isValidState(data: unknown): data is SquadState {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.status === "string" &&
    d.step != null &&
    typeof d.step === "object" &&
    Array.isArray(d.agents)
  );
}

async function readActiveStates(targets: SquadTarget[]): Promise<Record<string, SquadState>> {
  const states: Record<string, SquadState> = {};

  for (const target of targets) {
    let entries;
    try {
      entries = await fsp.readdir(target.squadsDir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const statePath = path.join(target.squadsDir, entry.name, "state.json");
      try {
        const raw = await fsp.readFile(statePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (!isValidState(parsed)) continue;
        states[buildSquadKey(target, entry.name)] = parsed;
      } catch {
        // Skip missing/invalid state
      }
    }
  }

  return states;
}

async function buildSnapshot(targets: SquadTarget[]): Promise<WsMessage> {
  return {
    type: "SNAPSHOT",
    squads: await discoverSquads(targets),
    activeStates: await readActiveStates(targets),
  };
}

function broadcast(wss: WebSocketServer, msg: WsMessage) {
  const data = JSON.stringify(msg);
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;
    try {
      client.send(data);
    } catch {
      // Best effort
    }
  }
}

function resolveTargetForFile(targets: SquadTarget[], filePath: string): SquadTarget | undefined {
  const normalized = path.resolve(filePath);
  return targets.find((target) => normalized.startsWith(path.resolve(target.squadsDir)));
}

export function squadWatcherPlugin(): Plugin {
  return {
    name: "squad-watcher",
    configureServer(server: ViteDevServer) {
      if (!server.httpServer) {
        server.config.logger.warn("[squad-watcher] no httpServer - skipping");
        return;
      }

      const targets = resolveTargets();
      if (targets.length === 0) {
        server.config.logger.warn("[squad-watcher] no target squads directories resolved");
        return;
      }

      for (const target of targets) {
        server.config.logger.info(
          `[squad-watcher] watching: ${target.squadsDir}${
            target.project ? ` (project=${target.project})` : ""
          }`
        );
      }

      const wss = new WebSocketServer({ noServer: true });
      (server.httpServer as Server).on(
        "upgrade",
        (req: IncomingMessage, socket: Duplex, head: Buffer) => {
          if (req.url === "/__squads_ws") {
            wss.handleUpgrade(req, socket, head, (ws) => {
              wss.emit("connection", ws, req);
            });
          }
        }
      );

      wss.on("connection", async (ws) => {
        try {
          const snapshot = await buildSnapshot(targets);
          ws.send(JSON.stringify(snapshot));
        } catch {
          // Ignore
        }
      });

      for (const target of targets) {
        fsp.mkdir(target.squadsDir, { recursive: true }).catch((err) => {
          server.config.logger.error(
            `[squad-watcher] failed to create target dir: ${target.squadsDir} (${err.message})`
          );
        });
      }

      server.middlewares.use(async (req, res, next) => {
        if (req.url !== "/api/snapshot") return next();
        try {
          const snapshot = await buildSnapshot(targets);
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Cache-Control", "no-cache");
          res.end(JSON.stringify(snapshot));
        } catch {
          res.writeHead(500);
          res.end("Internal Server Error");
        }
      });

      const watchers = targets.map((target) =>
        chokidarWatch(target.squadsDir, {
          ignoreInitial: true,
          awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 50 },
          ignored: [/(^|[/\\])\./, /node_modules/, /output[/\\]/],
          depth: 2,
        })
      );

      function handleFileChange(filePath: string) {
        const target = resolveTargetForFile(targets, filePath);
        if (!target) return;

        const relative = path.relative(target.squadsDir, filePath).replace(/\\/g, "/");
        const parts = relative.split("/");
        if (parts.length < 2) return;

        const squadName = parts[0];
        const fileName = parts[1];
        const squadKey = buildSquadKey(target, squadName);

        if (fileName === "state.json") {
          fsp
            .readFile(filePath, "utf-8")
            .then((raw) => {
              const parsed = JSON.parse(raw);
              if (!isValidState(parsed)) return;
              broadcast(wss, { type: "SQUAD_UPDATE", squad: squadKey, state: parsed });
            })
            .catch(() => {
              // Ignore partial writes
            });
        } else if (fileName === "squad.yaml") {
          buildSnapshot(targets).then((snapshot) => broadcast(wss, snapshot));
        }
      }

      function handleFileRemoval(filePath: string) {
        const target = resolveTargetForFile(targets, filePath);
        if (!target) return;

        const relative = path.relative(target.squadsDir, filePath).replace(/\\/g, "/");
        const parts = relative.split("/");
        if (parts.length < 2) return;

        const squadName = parts[0];
        const fileName = parts[1];
        const squadKey = buildSquadKey(target, squadName);

        if (fileName === "state.json") {
          broadcast(wss, { type: "SQUAD_INACTIVE", squad: squadKey });
        } else if (fileName === "squad.yaml") {
          buildSnapshot(targets).then((snapshot) => broadcast(wss, snapshot));
        }
      }

      for (const watcher of watchers) {
        watcher.on("add", handleFileChange);
        watcher.on("change", handleFileChange);
        watcher.on("unlink", handleFileRemoval);
      }

      server.httpServer.on("close", () => {
        for (const watcher of watchers) watcher.close();
      });
    },
  };
}

