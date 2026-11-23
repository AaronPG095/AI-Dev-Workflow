---
title: Plan - Feature: Spike Plan Type
ticket: local://ADW:ADW-Plan-Spike-Plan-Type-2026-11
status: in-progress
priority: 
state: 
due: 
appetite: M
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Spike-Plan-Type-2026-11
agent: Gemini
branch: feat/spike-plan-type
worktree: AI-Dev-Workflow
startedAt: 2026-11-23
reviewedBy: Other
reviewVerdict: pass
reviewSession: independent-plan-j-reviewer
baseBranch: main
reviewFingerprint: 93cd5b66f2c3d247bef6b518e9aaaabf464482c497dad21f2c73e816e29b4244
---
# Spike Plan Type

## Summary

Add a dedicated `Spike` plan type (`node scripts/ticket.mjs new "<Topic>" --type Spike [--timebox <duration>]`) with default time-boxed appetite (`S`), `timebox:` frontmatter, `## Hypothesis` and `## Findings & Recommendation` sections, and `lint` validation so exploratory prototypes stay separate from production Feature plans.

## Context

- `docs/dev-workflow/future-improvements.md` (`#L13-L15`): final remaining Tier 3 candidate (`Spike` plan type).
- `scripts/ticket.mjs`: `commands.new()` (`#L3020-L3260`) and `lintPlan()` (`#L740-L825`).
- `README.md` (`#L150-L185`) and mirrored `.agents/skills/dev-workflow/SKILL.md` / `.claude/skills/dev-workflow/SKILL.md`.

## Open questions

None

## Acceptance criteria

- [x] AC1: `node scripts/ticket.mjs new "<Topic>" --type Spike [--timebox <duration>]` defaults `appetite` to `S`, writes `timebox: <duration>` (default `2h`) in frontmatter, includes `## Hypothesis` and `## Findings & Recommendation` sections, and seeds time-boxed investigation steps and a documented-answer acceptance criterion when custom `--criteria`/`--steps` are omitted. verified(test): J1 passes: Spike defaults appetite S, timebox, Hypothesis, Findings & Recommendation, criteria/steps
- [x] AC2: `ticket.mjs lint` validates Spike plans (`Plan - Spike:`), flagging missing or placeholder `## Hypothesis` sections as errors and warning if `appetite` is unset or `L`. verified(test): J1 passes: lint rejects placeholder Hypothesis and warns on appetite L
- [x] AC3: `ticket.mjs stats` counts `Spike` plans under `byType.Spike` and excludes `Spike` plans from `Feature`/`Refactor` escaped-defect attribution. verified(test): J1 passes: stats --json classifies Spike under byType.Spike with 0 escaped defects
- [x] AC4: `docs/dev-workflow/future-improvements.md`, `README.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` are updated identically (marking Candidate #4 `[Shipped]`). verified(test): Updated future-improvements.md, README.md, and mirrored SKILL.md files identically
- [x] AC5: `node --test scripts/ticket.test.mjs` passes with hermetic test `J1` covering `new --type Spike`, `--timebox`, `lint` validation, and `stats` classification. verified(test): 99/99 tests pass in node --test scripts/ticket.test.mjs; doctor and sync --check pass

## Steps

- [x] Implement `Spike` plan scaffolding (`isSpike`, default `appetite: S`, `--timebox`, `## Hypothesis`, `## Findings & Recommendation`, seeded criteria/steps) in `commands.new()` in `scripts/ticket.mjs` (AC1). verified: Added isSpike, --timebox, default appetite S, sections and seed items in commands.new
- [x] Extend `lintPlan()` in `scripts/ticket.mjs` to validate `## Hypothesis` and warn on oversized Spike appetite (AC2, AC3). verified: Extended lintPlan with ## Hypothesis error checks and S/M appetite warning
- [x] Update `docs/dev-workflow/future-improvements.md`, `README.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` identically (AC4). verified: Updated future-improvements.md, README.md, and both mirrored dev-workflow SKILL.md files
- [x] Write hermetic test `J1` in `scripts/ticket.test.mjs` and run `node --test scripts/ticket.test.mjs` (AC5). verified: Added test J1 and verified 99/99 pass in node --test scripts/ticket.test.mjs

## Risks

- A Spike plan created with `--create` must not fail `lintPlan` on unpopulated `## Hypothesis` placeholders; mitigate by replacing `<Hypothesis:[^>]*>` cleanly when `opts.create || opts.start` is passed, matching existing `new --create` behavior.
- Existing `plan-check.yml` / `problems()` require `## Acceptance criteria` and `## Steps`; keep both sections intact on Spike plans alongside `## Hypothesis` and `## Findings & Recommendation`.

## Out of scope

- Syncing downstream sibling repositories and archiving merged plans (executed after Plan J merges so downstream repos receive the final bundle).

## Notes

- Aaron approved implementing the `Spike` plan type and fleet sync/archive ("Do both.").

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-23 19:37 UTC, Other (review: pass [standards: pass, spec: pass]): AC1-AC5 verified; 99/99 tests pass, lint --strict clean, 4/4 invariants pass, skills byte-identical. [reviewer: independent-plan-j-reviewer]
