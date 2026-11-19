---
title: Plan - Feature: Architecture Blueprints For Multi-PR Initiatives
ticket: local://ADW:ADW-Plan-Architecture-Blueprints-2026-11
status: in-progress
priority: 
state: 
due: 
appetite: M
version: 
impact: 
devTicketKey: ADW:ADW-Plan-Architecture-Blueprints-2026-11
agent: Gemini
branch: feat/architecture-blueprints
worktree: AI-Dev-Workflow
startedAt: 2026-11-19
---
# Architecture Blueprints For Multi-PR Initiatives

## Summary

Add an opt-in Architecture Blueprint workflow (`node scripts/ticket.mjs blueprint "<Topic>" [--version <ver>]`) storing non-gated project/initiative master plans under `docs/architecture/<PREFIX>-Blueprint-<KebabTopic>.md`. Allow child PR plans to link via optional `blueprint:` frontmatter (`new "<Slice>" --blueprint <path>`) so `prime`, `step`, `pack`, `lint`, and `recall` surface architectural context automatically while keeping single-PR gates untouched.

## Context

- `scripts/ticket.mjs`: `new` (L2891), `prime` (L3106), `step` (L3363), `buildStepBrief` (L2347), `lintPlan` (L770), `recall` (L5185), `readmeCliSync` invariant (L683).
- `docs/ROADMAP.md` (`release` command, ADR-004) tracks product/version trains, whereas `docs/architecture/` holds technical architecture blueprints (module boundaries, shared contracts/invariants, and vertical-slice PR decomposition) created by the `planner` model before `builder` models execute individual PR plans.
- `docs/plans/` remains strictly per-PR `.plan.md` files so `ci-check`, `overview`, `fleet`, and `archive --all` require no exceptions.
- Invariants to preserve: zero npm dependencies, `.agents/skills` and `.claude/skills` identical (`mirrorDirs`), and `blueprint` documented in `README.md` (`readmeCliSync`).

## Open questions

None

## Acceptance criteria

- [ ] AC1: WHEN running `node scripts/ticket.mjs blueprint "<Topic>" [--version <ver>]` THE SYSTEM SHALL scaffold `docs/architecture/<PREFIX>-Blueprint-<KebabTopic>.md` with frontmatter (`title`, `status: active`, optional `version`, `plannerModel`, `created`) and sections (`Goal & Non-Goals`, `Architecture & Boundaries`, `Contracts & Invariants`, `PR Slice Breakdown`, `Living Updates & ADRs`), and running `blueprint` with no topic SHALL list existing blueprints under `docs/architecture/`.
- [ ] AC2: WHEN running `node scripts/ticket.mjs new "<Slice>" --blueprint <path>` THE SYSTEM SHALL validate the blueprint file exists, stamp `blueprint: <path>` in the child plan's frontmatter, and reference it in `## Context` when `--context` is not provided; standalone `new` without `--blueprint` remains unchanged.
- [ ] AC3: WHEN a plan declares `blueprint: <path>` in frontmatter, `prime`, `step` (text briefs for `planner`, `builder`, `fixer`, `reviewer` and `--json`), and `pack` SHALL surface the blueprint path (and builder/fixer/reviewer briefs SHALL instruct preserving its contracts/invariants).
- [ ] AC4: WHEN running `lint` on a plan with `blueprint: <path>`, THE SYSTEM SHALL fail with a clear error if the referenced file does not exist; AND `recall "<query>" [--fleet]` SHALL index `docs/architecture/*.md` as type `Blueprint`.
- [ ] AC5: `README.md`, `AGENTS.md`, `docs/plans/_template.plan.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` document the opt-in blueprint step for new projects and multi-PR initiatives and pass all configured invariants (`mirrorDirs`, `readmeCliSync`, `zeroDependencies`).
- [ ] AC6: Regression tests in `scripts/ticket.test.mjs` cover `blueprint`, `new --blueprint`, `prime`/`step`/`pack` surfacing, `lint` missing-blueprint validation, and `recall` indexing, and `node --test scripts/ticket.test.mjs` passes with 0 failures.

## Steps

- [ ] Add `commands.blueprint()` (scaffold + list) in `scripts/ticket.mjs` (AC1)
- [ ] Add `--blueprint` flag handling in `commands.new()` and `blueprint:` existence validation in `lintPlan()` (AC2, AC4)
- [ ] Surface `plan.meta.blueprint` in `prime`, `step` (`--json` + `buildStepBrief`), and `pack`, and add `docs/architecture` to `recall` (AC3, AC4)
- [ ] Update `README.md`, `AGENTS.md`, `docs/plans/_template.plan.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` (AC5)
- [ ] Add regression tests in `scripts/ticket.test.mjs` and run `node --test scripts/ticket.test.mjs` and `node scripts/ticket.mjs pack --test` (AC6)

## Risks

- Bloat or waterfall drift if blueprints become mandatory for single-PR changes or go stale — mitigated by keeping blueprints strictly opt-in, outside `docs/plans/*.plan.md`, and including a `Living Updates & ADRs` section.
- Breaking `readmeCliSync` or `mirrorDirs` invariants — mitigated by documenting `blueprint` in `README.md`, keeping `.agents/skills/` and `.claude/skills/` identical, and verifying via `pack --test` and `check`.

## Out of scope

Making blueprints mandatory for single-PR changes, gating blueprints in `ci-check`/`archive`, or adding `dependsOn`/`ready` plan DAG scheduling.

## Notes

Approval: "Plan approved. Continue."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
