# dev-pipeline

A reusable, **gated** development workflow for AI coding agents. Tool-agnostic:
the workflow lives in `AGENTS.md`, so **codex, Cursor, or any agent** that reads
`AGENTS.md` follows the same process. Instead of re-explaining your process to every
new agent, run one command per project and get the whole pipeline wired in.

The pipeline turns your ad-hoc loop into an enforced, repeatable process:

```
requirements interrogation
  → 🚩 Gate 0  Clarification (you unlock)
  → design
  → 🚩 Gate A  Design review (you approve)
  → implement
  → test + fix + green
  → self-review (until no critical issues)
  → 🚩 Gate B  Human code review (you approve)
  → manual test
  → 🚩 Gate C  Manual-test feedback + triage  ──┐
        ✅ pass · 🐞 bug→impl · 🔧 tweak→fix · ➕ new req→Gate 0 (delta only)
  └───────────────── loop until you say "done" ──┘
  → wrap-up (commit / PR)
```

The four 🚩 gates are **hard stops**: the agent may not proceed without your
explicit approval, and it may not decide on its own that it has "asked enough".

## What gets installed

Running `init` in a project creates:

| Path | For | Purpose |
|---|---|---|
| `AGENTS.md` | **any agent** (codex, etc.) | Tool-neutral source of truth: universal principles + the full gated pipeline. |
| `.cursor/skills/requirements-interrogation/` | Cursor | Convenience: one-question-at-a-time clarification with a visible context ledger. |
| `.cursor/skills/dev-pipeline/` | Cursor | Convenience: the full gated workflow as a skill. |
| `.cursor/commands/pipeline.md` | Cursor | Convenience: the `/pipeline <request>` entry point. |
| `.cursor/rules/universal-principles.mdc` | Cursor | Cross-language principles, always applied. |
| `.cursor/rules/project-context.mdc` | any | Your project's stack, test/lint commands, and pipeline overrides. |

The `.cursor/` files are just convenience wrappers for Cursor users. If you use
codex or another agent, `AGENTS.md` alone drives the whole workflow.

Everything is project-local, so it travels with the repo and teammates get it on
clone. Nothing is written to global machine state.

## Setup

Requires Node.js >= 18. No install or npm publish needed — run it straight from
GitHub:

```bash
cd my-project
npx github:yuhao-arcinc/dev-pipeline init
```

No questions asked: the stack, test command, and lint command are left as
auto-detect markers that the agent fills in on first run by analyzing the repo
(you can still prefill them with flags if you want). Then start work with your agent:

- **codex / any agent**: it follows `AGENTS.md` automatically.
- **Cursor**: run `/pipeline add a CSV export button to the settings page`.

### Options

```
--dir <path>        Target project directory (default: cwd)
--stack <text>      Prefill project stack (optional; default: auto-detect)
--test-cmd <text>   Prefill test command (optional; default: auto-detect)
--lint-cmd <text>   Prefill lint/typecheck command (optional; default: auto-detect)
--force             Overwrite existing project-context.mdc and AGENTS.md
```

Example with prefilled values (skips auto-detection for those fields):

```bash
npx github:yuhao-arcinc/dev-pipeline init \
  --stack "TypeScript + React" --test-cmd "npm test" --lint-cmd "npm run lint"
```

## Customizing per project

Edit `.cursor/rules/project-context.mdc` to set the test/lint commands, project
conventions, and any pipeline overrides (e.g. skip a review step). Both `AGENTS.md`
and the Cursor skill treat this as project-specific configuration.

## License

MIT
