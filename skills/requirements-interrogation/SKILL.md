---
name: requirements-interrogation
description: Exhaustively clarify a request before any design or code. Continuously asks the user one detailed question at a time and maintains a context ledger until the user explicitly unlocks the next phase. Use when starting /pipeline, building a new feature, changing behavior, or whenever a request is under-specified.
---

# Requirements Interrogation

Goal: clarify a request until there are no hidden assumptions, BEFORE any design,
plan, or code. Prefer over-asking to stopping early. The authority to decide
"we've asked enough" belongs to the user, not you.

## Hard Gate (non-negotiable)

Until the user gives an explicit unlock phrase (e.g. "start design", "LGTM",
"go ahead"), you MUST NOT: produce a design, write an implementation plan, write
or edit any code, scaffold anything, or invoke any implementation skill — even if
it "seems obvious". Wanting to skip means you are rationalizing; see the Red Flags
below and stop.

## Process

1. Explore the repo first: read relevant files, docs, and recent commits. Anything
   you can find yourself, do NOT ask the user.
2. Maintain a Context Ledger (update and show it at the end of every message)
   covering these dimensions:
   - **Goal**: the real problem being solved; why now.
   - **Users & scenarios**: who uses this, in what situations.
   - **Success criteria**: what "done/correct" means, in verifiable terms.
   - **Scope & non-goals**: what is explicitly out of scope.
   - **Constraints**: stack, performance, compatibility, security/compliance, time, dependencies.
   - **Data & interfaces**: input/output shapes, external APIs/dependencies.
   - **Edge & failure cases**: invalid input, empty states, concurrency, timeouts, expected error handling.
   - **Existing conventions**: similar implementations, code style (find these yourself).
   - **Interaction/UI** (if applicable): each state, empty/error visuals and behavior.
   - **Priorities & trade-offs**: what the user prefers when forced to choose.
   Mark each dimension `✅ known` / `❓ unknown` / `⚠️ assumption`.
3. Ask ONE question at a time, targeting a specific `❓` or `⚠️`. Prefer concrete
   multiple-choice options plus your recommendation to drive out detail.
4. Loop until the ledger has no `❓` and every `⚠️` has been confirmed by the user.
5. Before proceeding, output a "Requirements Understanding Summary" plus the full
   list of assumptions, ask the user to confirm each, and ask once more:
   "Anything to add or correct?"
6. Only after the user's explicit unlock, hand off to design (dev-pipeline Phase 1b).

## Ledger format (append at the end of every turn)

    ## Context Ledger
    - Goal: ✅ ...
    - Success criteria: ❓ (to ask)
    - Constraints: ⚠️ assuming Postgres — needs your confirmation
    ...
    ### This turn's question (exactly one)
    <one specific, detailed question with options>

## Anti-Rationalization Red Flags (if you think this, STOP and keep asking)

| Thought | Reality |
|---|---|
| "I basically get it, I can start." | The user decides that, not you. Keep asking. |
| "This request is too simple to interrogate." | Simple requests hide the most assumptions. Keep asking. |
| "I'll scaffold and clarify as I go." | Forbidden. Zero implementation before unlock. |
| "I'll just default the rest sensibly." | A default is a hidden assumption. Surface it and ask. |
| "The user might find this annoying." | The user explicitly asked to be interrogated. This is what they want. |
