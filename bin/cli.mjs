#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const SRC = {
  skills: join(ROOT, "skills"),
  commands: join(ROOT, "commands"),
  rules: join(ROOT, "rules"),
  templates: join(ROOT, "templates"),
};
const VERSION = JSON.parse(
  readFileSync(join(ROOT, "package.json"), "utf8"),
).version;

const AGENTS_START = "<!-- dev-pipeline:start -->";
const AGENTS_END = "<!-- dev-pipeline:end -->";

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const s = join(src, entry);
    const d = join(dest, entry);
    if (statSync(s).isDirectory()) copyDir(s, d);
    else copyFileSync(s, d);
  }
}

// Write/refresh the managed dev-pipeline block in AGENTS.md, preserving any
// content the user has outside the markers. Returns "created" | "updated" | "merged".
function upsertAgents(target) {
  const agentsPath = join(target, "AGENTS.md");
  const body = readFileSync(join(SRC.templates, "AGENTS.md"), "utf8").trimEnd();
  const stamp = `${AGENTS_START} (v${VERSION} — managed, do not edit inside this block)`;
  const managed = `${stamp}\n\n${body}\n\n${AGENTS_END}\n`;

  if (!existsSync(agentsPath)) {
    writeFileSync(agentsPath, managed);
    return "created";
  }
  const current = readFileSync(agentsPath, "utf8");
  const blockRe = /<!-- dev-pipeline:start[\s\S]*?<!-- dev-pipeline:end -->\n?/;
  if (blockRe.test(current)) {
    writeFileSync(agentsPath, current.replace(blockRe, managed));
    return "updated";
  }
  const sep = current.endsWith("\n") ? "\n" : "\n\n";
  writeFileSync(agentsPath, current + sep + managed);
  return "merged";
}

function parseArgs(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

function init(flags) {
  const target = flags.dir ? String(flags.dir) : process.cwd();
  const cursorDir = join(target, ".cursor");
  const force = Boolean(flags.force);
  console.log(`\ndev-pipeline v${VERSION}: setting up in ${target}\n`);

  copyDir(SRC.skills, join(cursorDir, "skills"));
  console.log("  • .cursor/skills/  (requirements-interrogation, dev-pipeline)");

  copyDir(SRC.commands, join(cursorDir, "commands"));
  console.log("  • .cursor/commands/pipeline.md");

  mkdirSync(join(cursorDir, "rules"), { recursive: true });
  copyFileSync(
    join(SRC.rules, "universal-principles.mdc"),
    join(cursorDir, "rules", "universal-principles.mdc"),
  );
  console.log("  • .cursor/rules/universal-principles.mdc");

  const pcPath = join(cursorDir, "rules", "project-context.mdc");
  if (existsSync(pcPath) && !force) {
    console.log("  • .cursor/rules/project-context.mdc (exists, kept)");
  } else {
    const auto = "(auto-detect — the agent fills this in from the repo on first run)";
    let tpl = readFileSync(join(SRC.templates, "project-context.mdc"), "utf8");
    tpl = tpl
      .replaceAll("{{STACK}}", flags.stack ? String(flags.stack) : auto)
      .replaceAll("{{TEST_CMD}}", flags["test-cmd"] ? String(flags["test-cmd"]) : auto)
      .replaceAll("{{LINT_CMD}}", flags["lint-cmd"] ? String(flags["lint-cmd"]) : auto);
    writeFileSync(pcPath, tpl);
    console.log("  • .cursor/rules/project-context.mdc");
  }

  const agentsResult = upsertAgents(target);
  console.log(`  • AGENTS.md (managed block ${agentsResult})`);

  console.log("\nDone. Start the pipeline with any agent:");
  console.log("  • codex / any agent: it follows AGENTS.md automatically.");
  console.log("  • Cursor: run  /pipeline <your request>\n");
}

function usage() {
  console.log(
    [
      `dev-pipeline v${VERSION} — set up a gated, tool-agnostic dev workflow in a project`,
      "",
      "Usage:",
      "  npx github:yuhao-arcinc/dev-pipeline init [options]     # first-time setup",
      "  npx github:yuhao-arcinc/dev-pipeline update [options]   # pull latest (same as init)",
      "",
      "Managed files (skills, commands, universal-principles, and the AGENTS.md",
      "managed block) are refreshed every run. Your project-context.mdc and anything",
      "you added to AGENTS.md outside the managed block are preserved.",
      "",
      "By default, stack/test/lint are left as auto-detect markers for the agent",
      "to infer from the repo on first run. The flags below only prefill them.",
      "",
      "Options:",
      "  --dir <path>        Target project directory (default: cwd)",
      "  --stack <text>      Prefill project stack (optional)",
      "  --test-cmd <text>   Prefill test command (optional)",
      "  --lint-cmd <text>   Prefill lint/typecheck command (optional)",
      "  --force             Also overwrite project-context.mdc (loses your customizations)",
    ].join("\n"),
  );
}

const { positional, flags } = parseArgs(process.argv.slice(2));
const cmd = positional[0] ?? "init";

if (cmd === "init" || cmd === "update") {
  init(flags);
} else if (cmd === "help" || flags.help) {
  usage();
} else {
  console.error(`Unknown command: ${cmd}\n`);
  usage();
  process.exit(1);
}
