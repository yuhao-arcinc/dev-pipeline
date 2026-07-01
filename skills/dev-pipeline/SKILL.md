---
name: dev-pipeline
description: End-to-end, gated development workflow — requirements interrogation, design, implementation, testing, self-review, and human review — with four hard human checkpoints and an iterative feedback loop. Use when the user runs /pipeline, or asks to build a feature or change behavior "by the full process".
---

# Dev Pipeline

A looping, gated workflow. The only exit condition is the user's explicit "done"
phrase. First read `.cursor/rules/project-context.mdc` (if present) for the stack,
test command, lint command, and any pipeline overrides; otherwise ask for the test
command or infer it from the repo.

Copy this checklist into TodoWrite and work through it in order. It is a LOOP, not
a straight line.

- [ ] **Phase 1 — Requirements interrogation**: follow the `requirements-interrogation` skill.
- [ ] 🚩 **Gate 0 (Clarification)**: ledger has no `❓`, all assumptions confirmed, user gives the unlock phrase. HARD STOP.
- [ ] **Phase 1b — Design**: produce a short design/spec (architecture, components, data flow, error handling, testing), then a bite-sized, TDD-oriented implementation plan. Scale detail to complexity. Propose 2-3 approaches with a recommendation before settling.
- [ ] 🚩 **Gate A (Design review)**: present the design and WAIT for explicit approval. Revise and re-present until approved. HARD STOP.
- [ ] **Phase 2 — Implement**: follow the plan and the universal principles. Prefer test-first (write the failing test, then the minimal code to pass).
- [ ] **Phase 3 — Test + fix + green**: run tests; on failure, fix and re-run; loop until all green (use the project's test command).
- [ ] **Phase 4 — Agent self-review**: run the Bugbot subagent, then the Security Review subagent (subject to project-context overrides). Fix every 🔴 critical issue and re-run until no critical issues remain.
- [ ] 🚩 **Gate B (Human code review)**: ask the user to review. WAIT. If they raise points, address them (see "Handling human review feedback" below) and return to this gate. HARD STOP.
- [ ] **Phase 5 — Manual test**: give the user a concrete manual-test checklist and ask them to test.
- [ ] 🚩 **Gate C (Manual-test feedback + triage)**: WAIT for the user's feedback. Triage EACH item:
  - ✅ Pass/accepted → no action
  - 🐞 Bug (defect within the current design) → return to Phase 2/3
  - 🔧 Minor tweak (within design intent) → fix directly
  - ➕ New requirement / scope change → return to Gate 0, but interrogate ONLY the delta (carry forward the existing ledger, design, and plan)

  Loop until the user gives the explicit "done" phrase. HARD STOP.
- [ ] **Phase 6 — Wrap-up**: finalize (summary of changes, tests green, no leftover debug code); help the user land the work (commit/PR) per their preference.

## Loop & delta principles

- The workflow is a loop; the only exit is the user's explicit "done".
- The ledger, design doc, and plan accumulate across iterations. Each iteration
  handles only the delta — never start over from scratch.
- Match rollback depth to feedback severity: new requirement → Gate 0;
  bug → implementation; tweak → direct fix.

## Hard-gate rules

- At every 🚩 gate you MUST stop all further action, present what needs review, and
  explicitly ask "Approve? / What should change?".
- Do NOT proceed past a gate without the user's explicit approval. Never approve on
  the user's behalf.

## Handling human review feedback (Gate B)

- Treat feedback as a hypothesis to verify, not an order to implement blindly. If a
  suggestion seems technically wrong, say so with reasoning rather than complying
  performatively.
- For each point: confirm you understand it, decide fix vs. discuss, then act.
  Re-run Phase 3 (and Phase 4 if the change is non-trivial) after fixes.

## Self-contained: no external plugins required

This skill does not depend on any third-party skill pack. If the superpowers skills
(brainstorming, writing-plans, test-driven-development, etc.) are installed, you may
use them to enrich Phases 1b/2, but they are optional.
