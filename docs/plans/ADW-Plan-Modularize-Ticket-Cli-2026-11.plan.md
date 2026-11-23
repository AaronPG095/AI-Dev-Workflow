---
title: Plan - Refactor: Modularize Ticket Cli
ticket: local://ADW:ADW-Plan-Modularize-Ticket-Cli-2026-11
status: planned
priority: 
state: 
due: 
appetite: L
version: 
impact: 
dependsOn: docs/plans/ADW-Plan-Dependency-Graph-Ready-Queue-And-Map-2026-11.plan.md
blueprint: docs/architecture/ADW-Blueprint-Workflow-Next-Gen-Refinements.md
devTicketKey: ADW:ADW-Plan-Modularize-Ticket-Cli-2026-11
agent: Gemini
---
# Modularize Ticket Cli

## Summary

Extract cohesive, zero-dependency domain modules from `scripts/ticket.mjs` into `scripts/lib/` (`markdown-plan.mjs`, `invariants-lint.mjs`, `stats-lessons.mjs`, `symbols-map.mjs`), register them in `WORKFLOW_FILES` and `scripts/workflow-manifest.json`, and update `docs/dev-workflow/future-improvements.md` and `README.md` with characterization tests proving 100% behavioral parity.

## Context

- Blueprint: `docs/architecture/ADW-Blueprint-Workflow-Next-Gen-Refinements.md`
- `scripts/ticket.mjs`: `WORKFLOW_FILES` (`#L95-L125`), markdown helpers (`#L370-L512`, `#L873-L886`, `#L1599-L1644`), test integrity & diff formatting (`#L1371-L1525`), lessons helpers (`#L1929-L2021`), symbol map & dependency helpers (`collectRepoSymbolMap`, `parseDependsOn`).
- `scripts/workflow-manifest.json`: `copy` array (`#L3-L19`).
- `docs/dev-workflow/future-improvements.md`: Tier 3 backlog tracking.

## Open questions

None

## Acceptance criteria

- [ ] AC1: Characterization test (`I1`) verifies direct ESM imports from `scripts/lib/*.mjs`, CLI command surface parity in `scripts/ticket.mjs`, and `node scripts/sync.mjs --check --bundle-only .` bundle consistency.
- [ ] AC2: Four zero-dependency ESM modules exist under `scripts/lib/` and are imported by `scripts/ticket.mjs`: `scripts/lib/markdown-plan.mjs`, `scripts/lib/invariants-lint.mjs`, `scripts/lib/stats-lessons.mjs`, and `scripts/lib/symbols-map.mjs`.
- [ ] AC3: All four `scripts/lib/*.mjs` paths are registered in `WORKFLOW_FILES` in `scripts/ticket.mjs` and `copy` in `scripts/workflow-manifest.json`, and `node scripts/ticket.mjs verify --tier fast` passes.
- [ ] AC4: `docs/dev-workflow/future-improvements.md` and `README.md` reflect the `scripts/lib/` module architecture and mark completed Tier 3 items (`dependsOn`/`ready`, `map`, Role-to-model routing, modularization) as shipped.
- [ ] AC5: `node --test scripts/ticket.test.mjs`, `node scripts/ticket.mjs doctor`, and `node scripts/sync.mjs --check --bundle-only .` pass with 0 errors and byte-identical `.agents/skills/` and `.claude/skills/`.

## Steps

- [ ] Lock existing behaviour with characterization tests before structural changes (AC1)
- [ ] Extract `scripts/lib/markdown-plan.mjs`, `scripts/lib/invariants-lint.mjs`, `scripts/lib/stats-lessons.mjs`, and `scripts/lib/symbols-map.mjs` and import them in `scripts/ticket.mjs` (AC2).
- [ ] Register `scripts/lib/*.mjs` in `WORKFLOW_FILES` and `scripts/workflow-manifest.json` (AC3).
- [ ] Update `README.md`, `docs/dev-workflow/future-improvements.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` identically (AC4).
- [ ] Run `node --test scripts/ticket.test.mjs`, `node scripts/ticket.mjs doctor`, and `node scripts/sync.mjs --check --bundle-only .` (AC5).

## Risks

- `runInvariants()` `readmeCliSync` parses `const commands = {` inside `scripts/ticket.mjs`; keep `const commands = {` inside `scripts/ticket.mjs` while extracting helper functions into `scripts/lib/*.mjs`.
- Moving lines from `scripts/ticket.mjs` to `scripts/lib/*.mjs` counts both deletions and insertions in `checkAppetite`; keep extracted module size focused (or configure `appetite.L.maxLines`) so `check --strict` passes cleanly.

## Out of scope

- Splitting `const commands = { ... }` dispatch table out of `scripts/ticket.mjs` (must remain in `scripts/ticket.mjs` for `readmeCliSync` regex compatibility).

## Notes

- Aaron approved `next-gen-workflow-implementation-plan.md` ("The user has approved this document.") after instructing: "Run and implement all. Plan out using Argon High and implement using Argon Low."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
