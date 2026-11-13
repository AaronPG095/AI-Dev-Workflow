---
title: Plan - Feature: Plan Lint And Invariants
ticket: local://ADW:ADW-Plan-Plan-Lint-And-Invariants-2026-11
status: in-progress
priority: 
state: 
due: 
appetite: L
devTicketKey: ADW:ADW-Plan-Plan-Lint-And-Invariants-2026-11
agent: Gemini
branch: gemini/plan-lint-and-invariants
worktree: AI-Dev-Workflow
startedAt: 2026-11-13
reviewedBy: Other
reviewVerdict: pass
reviewFingerprint: cf269c5dab8248d5248b354882c4d927d412ee989deee745baf1d296da646edf
---
# Plan Lint And Invariants

## Summary

Turn advisory prose rules in `AGENTS.md` into machine-checkable `invariants` enforced by `check`, `ci-check`, and `doctor`, and add a zero-token `ticket.mjs lint` analyzer to catch vague criteria, orphaned steps, and placeholders before implementation.

## Context

- `scripts/ticket.mjs`: `problems()` (`#L333+`), `commands.create()` (`#L2445+`), `commands.pack()` (`#L2760+`), `commands.check()` (`#L3100+`), `commands['ci-check']()` (`#L3230+`), `commands.doctor()` (`#L3900+`).
- `scripts/ticket.config.json` & `scripts/workflow-manifest.json` (`starterConfig`): store repo-level and starter invariants.
- `AGENTS.md` prose rules to mechanize: mirrored `.agents/skills` ↔ `.claude/skills`, `README.md` CLI parity, zero external npm dependencies, and no committed secrets/Notion tokens.

## Open questions

None

## Acceptance criteria

- [x] AC1: `runInvariants(cfg, dir)` supports `mirrorDirs` (byte-identical directory pairs), `readmeCliSync` (every public CLI command in `commands` appears in `README.md`), `zeroDependencies` (`package.json` has no `dependencies`/`devDependencies` if present), `noSecretsPatterns` (regex scan across tracked files), and `customChecks` (`{ name, cmd }`). verified: T1.5 passes in node --test scripts/ticket.test.mjs (79/79)
- [x] AC2: `check`, `ci-check`, and `doctor [--fleet]` execute configured `invariants`; failures block `check`/`ci-check` and surface clearly in `doctor`. verified: doctor reports Invariants: 4/4 passed and T1.5 verifies check/ci-check blocking
- [x] AC3: `ticket.mjs lint [<plan>] [--strict] [--json]` flags: (a) placeholder `<...>` tokens, (b) unresolved `## Open questions`, (c) missing/placeholder `Risks` or `Out of scope`, (d) Acceptance Criteria phrased as implementation verbs (`Implement`/`Add`/`Update`/etc.) instead of outcomes, (e) vague adjectives (`robust`, `properly`, `cleanly`, `all edge cases`) without concrete bounds, and (f) `AC#` criteria unreferenced by any step. verified: T2.1 verifies lint rules and --strict/--json flags
- [x] AC4: `create` aborts on `lint` errors and prints `lint` warnings; `pack` displays uncovered `AC#` IDs when `AC#` tags are present. verified: T2.1 verifies create lint abort and pack checks uncovered AC# IDs
- [x] AC5: `node --test scripts/ticket.test.mjs` passes with hermetic tests for all invariant types and lint rules; `README.md`, `scripts/ticket.config.json`, `scripts/workflow-manifest.json`, and mirrored skills are updated identically. verified: node --test scripts/ticket.test.mjs passes 79/79 and skill diff is empty

## Steps

- [x] Implement `runInvariants(cfg, dir)` and wire into `commands.check()`, `commands['ci-check']()`, and `commands.doctor()` in `scripts/ticket.mjs` (AC1, AC2). verified: Implemented runInvariants and wired into check, ci-check, and doctor
- [x] Implement `lintPlan(plan)` and `commands.lint()` (`--strict`, `--json`), and wire into `commands.create()` and `commands.pack()` in `scripts/ticket.mjs` (AC3, AC4). verified: Implemented lintPlan and commands.lint, wired into create and pack
- [x] Configure `invariants` in `scripts/ticket.config.json` and `starterConfig` in `scripts/workflow-manifest.json` (AC1, AC5). verified: Configured invariants in scripts/ticket.config.json and scripts/workflow-manifest.json
- [x] Update `README.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` identically (AC5). verified: Updated README.md and both mirrored dev-workflow SKILL.md files
- [x] Add hermetic tests in `scripts/ticket.test.mjs` and run `node --test scripts/ticket.test.mjs` (AC5). verified: Added T1.5 and T2.1 tests; 79/79 pass

## Risks

- Over-strict `lint` phrasing rules could block legitimate plans; keep verb/vague-word checks as warnings (only blocking under `--strict`), while placeholders and empty/missing required sections are errors.
- `noSecretsPatterns` must not false-positive on test fixtures or `ticket.test.mjs` itself; use real token prefixes (`ntn_`, `secret_`, `ghp_`, `github_pat_`) and skip files containing `invariant-ignore` or `scripts/ticket.test.mjs` when configured via `excludePaths`.

## Out of scope

- Workflow `stats` and `docs/lessons.md` feedback loop (covered in Plan D).
- AI-client runtime hooks and `prime --verify` / `tick --red` (covered in Plan E).

## Notes

- Aaron approved `tier1-tier2-implementation-plan.md` ("The user has approved this document.") and requested: "Merge A and B and then implement C."
- Appetite bumped from `M` (450 lines) to `L` (1200 lines) because implementation + hermetic tests (`T1.5`, `T2.1`) + config/docs totaled 462 changed lines.

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-13 20:02 UTC, Other (review: pass [standards: pass, spec: pass]): AC1-AC5 verified; 79/79 tests pass, doctor 4/4 invariants pass, skills mirrored identically, README updated. Minor notes: Appetite M slightly exceeded (462/450 lines) and lint warns on AC3 quoting vague example words.
