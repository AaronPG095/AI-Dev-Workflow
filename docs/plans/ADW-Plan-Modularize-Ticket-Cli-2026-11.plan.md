---
title: Plan - Refactor: Modularize Ticket Cli
ticket: local://ADW:ADW-Plan-Modularize-Ticket-Cli-2026-11
status: shipped
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
branch: feat/modularize-ticket-cli
worktree: AI-Dev-Workflow
startedAt: 2026-11-23
reviewedBy: Other
reviewVerdict: pass
reviewSession: reviewer-argon-low
reviewModel: gemini-4-argon-low
baseBranch: main
reviewFingerprint: cce62d428c0a35ac3c9127ce9e1efc7d0ccc2d4631cc904f27c6c88e33c71726
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/49
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

- [x] AC1: Characterization test (`I1`) verifies direct ESM imports from `scripts/lib/*.mjs`, CLI command surface parity in `scripts/ticket.mjs`, and `node scripts/sync.mjs --check --bundle-only .` bundle consistency. verified(test): I1 test verifies direct ESM imports from scripts/lib/*.mjs and sync.mjs --check --bundle-only .
- [x] AC2: Four zero-dependency ESM modules exist under `scripts/lib/` and are imported by `scripts/ticket.mjs`: `scripts/lib/markdown-plan.mjs`, `scripts/lib/invariants-lint.mjs`, `scripts/lib/stats-lessons.mjs`, and `scripts/lib/symbols-map.mjs`. verified(test): I1 test and ticket.mjs imports verify markdown-plan.mjs, invariants-lint.mjs, stats-lessons.mjs, and symbols-map.mjs
- [x] AC3: All four `scripts/lib/*.mjs` paths are registered in `WORKFLOW_FILES` in `scripts/ticket.mjs` and `copy` in `scripts/workflow-manifest.json`, and `node scripts/ticket.mjs verify --tier fast` passes. verified(test): verify --tier fast and sync.mjs --check --bundle-only . pass with all 4 scripts/lib/*.mjs registered
- [x] AC4: `docs/dev-workflow/future-improvements.md` and `README.md` reflect the `scripts/lib/` module architecture and mark completed Tier 3 items (`dependsOn`/`ready`, `map`, Role-to-model routing, modularization) as shipped. verified(test): README.md and docs/dev-workflow/future-improvements.md document scripts/lib/ and shipped Tier 3 items
- [x] AC5: `node --test scripts/ticket.test.mjs`, `node scripts/ticket.mjs doctor`, and `node scripts/sync.mjs --check --bundle-only .` pass with 0 errors and byte-identical `.agents/skills/` and `.claude/skills/`. verified(test): node --test scripts/ticket.test.mjs (98/98 pass), doctor (Invariants 4/4 passed), and sync --check --bundle-only . exit 0

## Steps

- [x] Lock existing behaviour with characterization tests before structural changes (AC1) verified(test): done
- [x] Extract `scripts/lib/markdown-plan.mjs`, `scripts/lib/invariants-lint.mjs`, `scripts/lib/stats-lessons.mjs`, and `scripts/lib/symbols-map.mjs` and import them in `scripts/ticket.mjs` (AC2). verified(test): done
- [x] Register `scripts/lib/*.mjs` in `WORKFLOW_FILES` and `scripts/workflow-manifest.json` (AC3). verified(test): done
- [x] Update `README.md`, `docs/dev-workflow/future-improvements.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` identically (AC4). verified(test): done
- [x] Run `node --test scripts/ticket.test.mjs`, `node scripts/ticket.mjs doctor`, and `node scripts/sync.mjs --check --bundle-only .` (AC5). verified(test): done

## Risks

- `runInvariants()` `readmeCliSync` parses `const commands = {` inside `scripts/ticket.mjs`; keep `const commands = {` inside `scripts/ticket.mjs` while extracting helper functions into `scripts/lib/*.mjs`.
- Moving lines from `scripts/ticket.mjs` to `scripts/lib/*.mjs` counts both deletions and insertions in `checkAppetite`; keep extracted module size focused (or configure `appetite.L.maxLines`) so `check --strict` passes cleanly.

## Out of scope

- Splitting `const commands = { ... }` dispatch table out of `scripts/ticket.mjs` (must remain in `scripts/ticket.mjs` for `readmeCliSync` regex compatibility).

## Notes

- Aaron approved `next-gen-workflow-implementation-plan.md` ("The user has approved this document.") after instructing: "Run and implement all. Plan out using Argon High and implement using Argon Low."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-23 15:23 UTC, Other (review: pass [standards: pass, spec: pass]): AC1-AC5 verified: extracted scripts/lib/{markdown-plan,invariants-lint,stats-lessons,symbols-map}.mjs, registered in WORKFLOW_FILES and workflow-manifest.json, updated docs/dev-workflow/future-improvements.md and README.md, and verified with characterization test I1 and full mirror/bundle parity. [reviewer: reviewer-argon-low] (model: gemini-4-argon-low)
