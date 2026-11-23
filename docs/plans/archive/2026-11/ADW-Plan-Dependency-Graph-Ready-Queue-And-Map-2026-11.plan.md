---
title: Plan - Feature: Dependency Graph Ready Queue And Map
ticket: local://ADW:ADW-Plan-Dependency-Graph-Ready-Queue-And-Map-2026-11
status: shipped
priority: 
state: 
due: 
appetite: L
version: 
impact: 
blueprint: docs/architecture/ADW-Blueprint-Workflow-Next-Gen-Refinements.md
devTicketKey: ADW:ADW-Plan-Dependency-Graph-Ready-Queue-And-Map-2026-11
agent: Gemini
branch: feat/dependency-graph-ready-and-map
worktree: AI-Dev-Workflow
startedAt: 2026-11-23
reviewedBy: Other
reviewVerdict: pass
reviewSession: reviewer-argon-low
reviewModel: gemini-4-argon-low
baseBranch: main
reviewFingerprint: 447d0c75fde2e3466c4913584a9a5626cfe575d57c0a2c47200c49cd61f5eeea
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/48
---
# Dependency Graph Ready Queue And Map

## Summary

Add `dependsOn:` plan dependency resolution and cycle/missing lint checks, `ticket.mjs ready` with atomic worker claim/release (`claimedBy`/`claimedAt`), `ticket.mjs blueprint status` child-plan progress rollup, dependency-aware `wave --spawn`, and `ticket.mjs map` for zero-dependency repository symbol outlines.

## Context

- Blueprint: `docs/architecture/ADW-Blueprint-Workflow-Next-Gen-Refinements.md`
- `scripts/ticket.mjs`: `BOOLEAN_FLAGS` (`#L128-L165`), `lintPlan()` (`#L770-L872`), `commands.new()` (`#L2909+`), `commands.blueprint()` (`#L5051-L5138`), `commands.wave()` (`#L6246+`).
- `docs/plans/_template.plan.md`: optional `dependsOn:` frontmatter field.

## Open questions

None

## Acceptance criteria

- [x] AC1: Plans support `dependsOn: <comma-separated plan paths, basenames, or devTicketKeys>` in frontmatter (and `--depends-on "<list>"` on `ticket.mjs new`); a dependency is satisfied when its target plan has status `done`/`completed`, `localPlanStatusForDir(dep) === 'done'`, lies under `docs/plans/archive/**`, or has status `shipped` with all checkboxes closed; `lint` flags missing or circular dependencies as errors. verified(test): H1 test verifies dependsOn frontmatter, new --depends-on, resolveDependencyState, and lint missing/circular dependency errors
- [x] AC2: `ticket.mjs ready [--blueprint <path>] [--claim --agent <client>] [--release [<plan>]] [--json]` lists unblocked plans whose `dependsOn` dependencies are satisfied and that are not claimed by another worker (`--claim` stamps `claimedBy` and `claimedAt` on the top ready plan; `--release` clears `claimedBy` and `claimedAt`). verified(test): H1 test verifies ready [--blueprint] [--claim --agent] [--release] [--json]
- [x] AC3: `ticket.mjs blueprint status [<blueprint-path>] [--json]` rolls up all active and archived child plans referencing `blueprint: <path>` (status counts, checkbox progress, and dependency readiness), and `wave --spawn` skips plans with unsatisfied `dependsOn` dependencies unless `--force` is passed. verified(test): H1 test verifies blueprint status rollup and wave --spawn dependency gating
- [x] AC4: `ticket.mjs map [<path-or-filter>] [--max <N>] [--json]` scans tracked source files (`.mjs`, `.js`, `.ts`, `.tsx`, `.cs`, `.py`, `.go`, `.rs`), outputting exported functions, classes, and CLI command handlers with `file:L<line>` coordinates. verified(test): H1 test verifies map symbol extraction with file:L<line> coordinates
- [x] AC5: `node --test scripts/ticket.test.mjs` passes with hermetic tests for `dependsOn` lint validation, `ready --claim/--release`, `blueprint status`, `wave --spawn` dependency gating, and `map`; `README.md` and mirrored skills match byte-for-byte. verified(test): node --test scripts/ticket.test.mjs (97/97 pass) and doctor Invariants 4/4 passed

## Steps

- [x] Add `parseDependsOn(plan)` and `resolveDependencyState(plan, catalogPlans, dir)` and wire into `lintPlan()`, `commands.new()` (`--depends-on`), and `docs/plans/_template.plan.md` (AC1). verified(test): done
- [x] Implement `commands.ready()` (`--blueprint`, `--claim`, `--release`, `--json`) and `BOOLEAN_FLAGS` (`--claim`, `--release`) in `scripts/ticket.mjs` (AC2). verified(test): done
- [x] Extend `commands.blueprint()` with `status [<path>] [--json]` rollup and gate `commands.wave()` `--spawn` on `resolveDependencyState(plan).ready` unless `--force` is set (AC3). verified(test): done
- [x] Implement `collectRepoSymbolMap()` and `commands.map()` (`[<filter>] [--max <N>] [--json]`) in `scripts/ticket.mjs` (AC4). verified(test): done
- [x] Update `README.md`, `.agents/skills/dev-workflow/SKILL.md`, `.claude/skills/dev-workflow/SKILL.md`, and `T1.5` fixture command list (`ready`, `map`), add hermetic test `H1` in `scripts/ticket.test.mjs`, and run `node --test scripts/ticket.test.mjs` (AC5). verified(test): done

## Risks

- Adding new public CLI commands (`ready`, `map`) will trigger `readmeCliSync` in `T1.5` if `T1.5`'s fixture `README.md` list in `scripts/ticket.test.mjs` is not updated; mitigate by adding `'ready', 'map'` to `T1.5`'s fixture `README.md` and documenting both in `README.md`.
- Adding `dependsOn:` to `docs/plans/_template.plan.md` changes a managed bundle file; ensure `node scripts/sync.mjs --check --bundle-only .` passes.

## Out of scope

- Modularizing `scripts/ticket.mjs` into `scripts/lib/*.mjs` (covered in Plan I).

## Notes

- Aaron approved `next-gen-workflow-implementation-plan.md` ("The user has approved this document.") after instructing: "Run and implement all. Plan out using Argon High and implement using Argon Low."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-23 15:01 UTC, Other (review: pass [standards: pass, spec: pass]): AC1-AC5 verified: dependsOn parsing/resolution and lint checks, ready [--blueprint] [--claim/--release] [--json], blueprint status rollup, wave --spawn dependency gating, and map symbol outline implemented cleanly with hermetic tests and full mirror parity. [reviewer: reviewer-argon-low] (model: gemini-4-argon-low)
