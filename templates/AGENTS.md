# Agent Guidelines

These apply to **any** AI coding agent working in this repository (codex, Cursor,
or otherwise). This file is the tool-neutral source of truth for how work gets done
here. (Cursor users also get the same workflow as a `/pipeline` command and skills
under `.cursor/`, but those are just convenience wrappers around this process.)

## Universal engineering principles

- DRY (rule of three; avoid premature abstraction).
- YAGNI — build only the current explicit requirement.
- Single responsibility; small, focused functions and files.
- Intention-revealing names; no cryptic abbreviations.
- Explicit error handling; never swallow errors.
- No dead code, commented-out code, or stray debug prints.
- Comments explain "why", not "what".
- Edit existing code instead of copy-pasting variants.
- New/changed logic ships with tests.
- Read and follow existing conventions before changing code.
- Handle edge and failure cases (null/empty, concurrency, timeouts, bounds) before the happy path.

## The dev pipeline

For any new feature or behavior change, follow this **looping, gated** workflow.
The only exit condition is the user's explicit "done". The four 🚩 gates are HARD
STOPS: do not proceed past a gate without the user's explicit approval, and never
decide on your own that you have "asked enough" — that authority belongs to the user.

**Before starting**, determine the project's stack, test command, and lint/typecheck
command by reading the repo yourself (build files, scripts, lockfiles — package.json,
Makefile, pyproject.toml, go.mod, Cargo.toml, CI config). Do not ask the user for
anything you can infer. If `.cursor/rules/project-context.mdc` exists, read it first
and fill in any "(auto-detect ...)" fields from the repo, confirming once with the user.

1. **Requirements interrogation** — clarify until there are no hidden assumptions:
   - Explore the repo first; anything you can find yourself, don't ask.
   - Maintain and show a **context ledger** each turn, covering: goal, users &
     scenarios, success criteria, scope & non-goals, constraints, data & interfaces,
     edge & failure cases, existing conventions, interaction/UI, priorities.
     Mark each `✅ known` / `❓ unknown` / `⚠️ assumption`.
   - Ask **one** detailed question at a time (prefer options + a recommendation).
   - Before proceeding, list every assumption for confirmation and ask "Anything to
     add or correct?"
2. 🚩 **Gate 0 (Clarification)** — ledger has no `❓`, all assumptions confirmed, the
   user gives an explicit unlock ("start design" / "go ahead"). HARD STOP.
3. **Design** — short spec (architecture, components, data flow, error handling,
   testing) + a bite-sized, test-first plan. Propose 2-3 approaches with a
   recommendation before settling.
4. 🚩 **Gate A (Design review)** — present the design and WAIT for approval; revise
   and re-present until approved. HARD STOP.
5. **Implement** — follow the plan and the principles above; prefer test-first.
6. **Test + fix + green** — run tests; on failure, fix and re-run; loop until green.
7. **Self-review** — review your own diff for bugs and security issues; fix every
   critical issue and re-check until none remain. (In Cursor, use the Bugbot and
   Security Review subagents.)
8. 🚩 **Gate B (Human code review)** — ask the user to review; WAIT. Treat feedback
   as a hypothesis to verify, not an order to follow blindly. Address points and
   return to this gate. HARD STOP.
9. **Manual test** — give the user a concrete manual-test checklist and ask them to test.
10. 🚩 **Gate C (Manual-test feedback + triage)** — WAIT for feedback, then triage
    EACH item and loop until the user says "done":
    - ✅ Pass/accepted → no action
    - 🐞 Bug (within current design) → back to step 5/6
    - 🔧 Minor tweak (within design intent) → fix directly
    - ➕ New requirement / scope change → back to Gate 0, interrogating ONLY the
      delta (carry forward the existing ledger, design, and plan)
11. **Wrap-up** — summary of changes, tests green, no leftover debug code; help the
    user land the work (commit/PR) per their preference.

### Loop & delta principles

- The ledger, design, and plan accumulate across iterations — never start over from
  scratch. Handle only the delta.
- Match rollback depth to feedback severity: new requirement → Gate 0;
  bug → implementation; tweak → direct fix.
