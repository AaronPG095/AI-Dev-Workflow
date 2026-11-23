---
title: Plan - Feature: Spike Plan Type
ticket: local://ADW:ADW-Plan-Spike-Plan-Type-2026-11
status: planned
priority: 
state: 
due: 
appetite: M
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Spike-Plan-Type-2026-11
agent: Gemini
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

- [ ] AC1: `node scripts/ticket.mjs new "<Topic>" --type Spike [--timebox <duration>]` defaults `appetite` to `S`, writes `timebox: <duration>` (default `2h`) in frontmatter, includes `## Hypothesis` and `## Findings & Recommendation` sections, and seeds time-boxed investigation steps and a documented-answer acceptance criterion when custom `--criteria`/`--steps` are omitted.
- [ ] AC2: `ticket.mjs lint` validates Spike plans (`Plan - Spike:`), flagging missing or placeholder `## Hypothesis` sections as errors and warning if `appetite` is unset or `L`.
- [ ] AC3: `ticket.mjs stats` counts `Spike` plans under `byType.Spike` and excludes `Spike` plans from `Feature`/`Refactor` escaped-defect attribution.
- [ ] AC4: `docs/dev-workflow/future-improvements.md`, `README.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` are updated identically (marking Candidate #4 `[Shipped]`).
- [ ] AC5: `node --test scripts/ticket.test.mjs` passes with hermetic test `J1` covering `new --type Spike`, `--timebox`, `lint` validation, and `stats` classification.

## Steps

- [ ] Implement `Spike` plan scaffolding (`isSpike`, default `appetite: S`, `--timebox`, `## Hypothesis`, `## Findings & Recommendation`, seeded criteria/steps) in `commands.new()` in `scripts/ticket.mjs` (AC1).
- [ ] Extend `lintPlan()` in `scripts/ticket.mjs` to validate `## Hypothesis` and warn on oversized Spike appetite (AC2, AC3).
- [ ] Update `docs/dev-workflow/future-improvements.md`, `README.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` identically (AC4).
- [ ] Write hermetic test `J1` in `scripts/ticket.test.mjs` and run `node --test scripts/ticket.test.mjs` (AC5).

## Risks

- A Spike plan created with `--create` must not fail `lintPlan` on unpopulated `## Hypothesis` placeholders; mitigate by replacing `<Hypothesis:[^>]*>` cleanly when `opts.create || opts.start` is passed, matching existing `new --create` behavior.
- Existing `plan-check.yml` / `problems()` require `## Acceptance criteria` and `## Steps`; keep both sections intact on Spike plans alongside `## Hypothesis` and `## Findings & Recommendation`.

## Out of scope

- Syncing downstream sibling repositories and archiving merged plans (executed after Plan J merges so downstream repos receive the final bundle).

## Notes

- Aaron approved implementing the `Spike` plan type and fleet sync/archive ("Do both.").

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
