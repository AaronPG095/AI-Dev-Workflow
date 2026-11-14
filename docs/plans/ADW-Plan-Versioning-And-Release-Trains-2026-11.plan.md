---
title: Plan - Feature: Versioning And Release Trains
ticket: local://ADW:ADW-Plan-Versioning-And-Release-Trains-2026-11
status: planned
priority: high
state: flow
due: 
appetite: L
devTicketKey: ADW:ADW-Plan-Versioning-And-Release-Trains-2026-11
agent: Gemini
---
# Versioning And Release Trains

## Summary

Add first-class, opt-in Versioning and Release Train management to `AI-Dev-Workflow` so multi-release products (like `FluentOverlay`) can connect a single canonical forward roadmap (`docs/ROADMAP.md`), conflict-free per-plan release metadata (`version` and `impact` frontmatter), Notion `Target Version` task stamping, and zero-token CLI release tooling (`node scripts/ticket.mjs release status|notes|closeout|init`).

## Context

- `scripts/ticket.mjs:58-82` defines `FRONTMATTER_ORDER`, `OPTIONAL`, and plan parsing/serialization (`readPlanText`, `writePlan`), while `docs/plans/_template.plan.md:1-10` defines the V5 plan frontmatter.
- Historical v4 workflows in `Fluent-Studio-Website` (`b3154de65039`) required every PR to edit a shared `release/fluentoverlay-release-intent.json` file, causing merge conflicts across parallel worktrees; storing `version` and `impact` (`none | patch | minor | major`) per-plan in YAML frontmatter eliminates cross-branch conflicts.
- `scripts/ticket.mjs:645-875` (`problems()` and `lintPlan()`) validates plan completeness and V5 hygiene, and `scripts/ticket.mjs:565-635` (`runInvariants()`) enforces `readmeCliSync`, `mirrorDirs`, and `zeroDependencies`.
- `scripts/ticket.mjs:3288-3369` (`commands.create`) creates Notion Tasks in `collection://1db0b9c6-786f-80b0-bb5c-000b965dee0a`, which now includes the `Target Version` (`text`) property.

## Open questions

None

## Acceptance criteria

- [ ] AC1: `docs/plans/_template.plan.md` and `FRONTMATTER_ORDER` in `scripts/ticket.mjs` include `version` and `impact` (`none | patch | minor | major`), `ticket.mjs new` accepts `--version <ver>` and `--impact <impact>` (defaulting from `config.versioning.activeTrain` when enabled), and `ticket.mjs split` preserves `appetite`, `version`, and `impact` in Part 2 plans.
- [ ] AC2: `scripts/ticket.config.json`, `ticket.config.example.json`, and `scripts/workflow-manifest.json` define the opt-in `versioning` config schema (`enabled`, `currentVersion`, `activeTrain`, `roadmapPath`, `changelogPath`, `tagPrefix`, `requireVersionOnPlans`), and `problems()` + `lintPlan()` validate `impact` values and enforce `version` when `versioning.enabled && versioning.requireVersionOnPlans` is true.
- [ ] AC3: `ticket.mjs create` stamps `'Target Version': { rich_text: text(plan.meta.version) }` on Notion Tasks when `plan.meta.version` is set (and not `none` or `internal`), with a soft retry fallback if a custom database lacks the `Target Version` property.
- [ ] AC4: `ticket.mjs prime`, `resume`, `pack`, `stats` (`byVersion`), `overview`, and `doctor` surface version/release-train metadata when present or enabled.
- [ ] AC5: `node scripts/ticket.mjs release` implements `status [<version>] [--json]` (grouping active + archived plans by version into shipped, ready/unreleased, in-progress, and planned states, plus `docs/ROADMAP.md` train cross-check), `notes [<version>] [--write]` (Keep-a-Changelog generation from plans), `closeout <version> [--branch]` (scaffolding a release closeout plan), and `init` (scaffolding `docs/ROADMAP.md`).
- [ ] AC6: `README.md`, `AGENTS.md`, `.agents/skills/dev-workflow/SKILL.md`, `.claude/skills/dev-workflow/SKILL.md`, and an ADR in `docs/decisions/` document the versioning workflow while keeping skill mirrors byte-for-byte identical and passing `runInvariants`.
- [ ] AC7: Hermetic tests in `scripts/ticket.test.mjs` cover `new --version --impact`, `split` preservation, `lint`/`check` with `versioning.requireVersionOnPlans`, `release status|notes|closeout|init`, and `stats` `byVersion`, with `node --test scripts/ticket.test.mjs` and `node scripts/ticket.mjs check` passing.

## Steps

- [ ] Add `version` and `impact` to `docs/plans/_template.plan.md`, `FRONTMATTER_ORDER`, `commands.new` (`--version`, `--impact`), and `commands.split` (AC1)
- [ ] Add opt-in `versioning` config block to `scripts/ticket.config.json`, `ticket.config.example.json`, and `scripts/workflow-manifest.json`, and wire `version`/`impact` validation into `problems()` and `lintPlan()` (AC2)
- [ ] Update `commands.create` in `scripts/ticket.mjs` to stamp `Target Version` on Notion Tasks with graceful fallback when `plan.meta.version` is set (AC3)
- [ ] Surface version and release train metadata in `prime`, `resume`, `pack`, `collectRepoStats` (`stats`), `overview`, and `doctor` (AC4)
- [ ] Implement `commands.release` (`status`, `notes [--write]`, `closeout <version>`, and `init`) in `scripts/ticket.mjs` (AC5)
- [ ] Record an ADR via `ticket.mjs adr` and update `README.md`, `AGENTS.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` identically (AC6)
- [ ] Add comprehensive unit and CLI tests in `scripts/ticket.test.mjs` and run full verification (`node --test scripts/ticket.test.mjs` and `node scripts/ticket.mjs check`) (AC7)

## Risks

- Notion API calls failing on custom workspaces that have not added `Target Version` to their Tasks database — mitigated by catching `validation_error` mentioning `Target Version` and retrying without `Target Version` (matching the existing `Life Area` fallback).
- Unversioned repositories experiencing unexpected lint/check errors — mitigated by keeping `versioning.enabled: false` and `requireVersionOnPlans: false` by default and only validating `impact` when non-empty.
- Repository invariants (`readmeCliSync` or `mirrorDirs`) failing on closeout — mitigated by updating `README.md` and syncing `.agents/skills/` and `.claude/skills/` identically before running `check`.

## Out of scope

- Migrating `FluentOverlay`'s existing product docs (`FO-Plan.md`, `FO-PotentialFeatures.md`) into `FluentOverlay/docs/ROADMAP.md` in this PR (that happens in the `FluentOverlay` repository after syncing this workflow).
- Automated git tagging or binary installer signing.

## Notes

- User approval (2026-11-14):
  - "I'm thinking, see both connected together, as well as a single canonical roadmap. Ideally, if a project is using versioning, then I would like a target version property to be included on Notion tasks for my reference. And for, yes, that scope sounds good."
  - "Okay, the design pattern improvements have been implemented. Let's now plan how we're gonna add in versioning."
  - "The user has approved this document." (`versioning-architecture-plan.md`)

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
