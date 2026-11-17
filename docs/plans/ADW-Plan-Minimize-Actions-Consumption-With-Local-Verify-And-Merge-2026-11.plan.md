---
title: Plan - Feature: Minimize Actions Consumption With Local Verify And Merge
ticket: local://ADW:ADW-Plan-Minimize-Actions-Consumption-With-Local-Verify-And-Merge-2026-11
status: shipped
priority: 
state: 
due: 
appetite: L
version: none
impact: none
devTicketKey: ADW:ADW-Plan-Minimize-Actions-Consumption-With-Local-Verify-And-Merge-2026-11
agent: Gemini
branch: feat/minimize-actions-consumption-with-local-verify-and-merge
worktree: AI-Dev-Workflow
startedAt: 2026-11-17
reviewedBy: Gemini
reviewVerdict: pass
reviewSession: ade7ad01-9f2f-4651-b44c-ca71368dd67c
reviewFingerprint: b3d8eb97643e9c5df43ba18c992ac6aec7c4cae49aec1a21f91610ddb4b6cefa
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/37
---
# Minimize Actions Consumption With Local Verify And Merge

## Summary

Minimize private-repository GitHub Actions consumption under Option A by skipping draft/duplicate CI work in `.github/workflows/plan-check.yml`, supporting opt-out of `.github/workflows/ticket-done.yml` in `scripts/sync.mjs` via `ci.ticketDoneWorkflow`, adding local `verify` and `merge` commands to `scripts/ticket.mjs`, and wiring `prePushVerify` into `hook install` and `doctor`.

## Context

- `.github/workflows/plan-check.yml:8-47` currently triggers on Draft PR commits (`synchronize` without `draft == false` or `ready_for_review`) and always runs `node --test scripts/ticket.test.mjs` downstream whenever synced workflow scripts change.
- `.github/workflows/ticket-done.yml:1-44` burns runner startup time on every merge even when closing Notion tickets locally, and `scripts/sync.mjs:243-250` unconditionally requires `manifest.branches` in target repos.
- `scripts/ticket.mjs:4067-4165` provides `pr` and `done` separately but lacks `merge` (PR merge + immediate local Notion closeout) and lacks `verify` / `prePushVerify` hook integration (`scripts/ticket.mjs:4566-4606`).

## Open questions

None

## Acceptance criteria

- [x] AC1: `.github/workflows/plan-check.yml` skips Draft PRs (`if: github.event.pull_request.draft == false`), adds `ready_for_review` trigger, and skips `node --test scripts/ticket.test.mjs` when `$BASE_SHA` `scripts/ticket.config.json` sets `ciSkipTicketTests: true`. verified(inspect): plan-check.yml updated with draft == false, ready_for_review, and $BASE_SHA ciSkipTicketTests check
- [x] AC2: `scripts/sync.mjs` supports `ci.ticketDoneWorkflow: false` in `scripts/ticket.config.json` to skip requiring `.github/workflows/ticket-done.yml` (Option A local closeout) while continuing to enforce it when true or omitted. verified(test): T3.5 passes verifying sync --check [EXTRA], sync [REMOVED], and default enforcement
- [x] AC3: `scripts/ticket.mjs` adds `verify [--tier <fast|test|full>] [--pre-push]` and `merge [<plan>] [--squash|--merge|--rebase] [--keep-branch]` (merging via `gh pr merge` and calling `done` locally), and `hook install` runs `node scripts/ticket.mjs verify --pre-push` when `prePushVerify` is configured (surfaced in `doctor`). verified(test): T3.5 passes verifying verify --pre-push, hook install, doctor surfacing, and merge Notion closeout
- [x] AC4: `README.md`, `AGENTS.md`, `scripts/sync.mjs`, `ticket.config.example.json`, `scripts/workflow-manifest.json`, `.agents/skills/`, `.claude/skills/`, and `scripts/ticket.test.mjs` document and verify AC1-AC3 with `node --test scripts/ticket.test.mjs` passing and an independent subagent review recorded via `--reviewer-id`. verified(test): README.md, AGENTS.md, skills mirrors (3/3 identical), ticket.config.example.json, and T3.5 verified via 89/89 passing tests + subagent ade7ad01

## Steps

- [x] Update `.github/workflows/plan-check.yml` to skip Draft PRs, include `ready_for_review`, and honor `ciSkipTicketTests` from `$BASE_SHA` `scripts/ticket.config.json`. (AC1)
- [x] Update `scripts/sync.mjs` to support optional `ci.ticketDoneWorkflow: false` in target `scripts/ticket.config.json` and update `renderDevProcessSection` / `AGENTS.md`. (AC2, AC4)
- [x] Implement `verify` (`--pre-push`, `--tier`), `merge` (`--squash|--merge|--rebase`, `--keep-branch`), `prePushVerify` in `hook install`, and `doctor` surfacing in `scripts/ticket.mjs`. (AC3)
- [x] Update `README.md`, `ticket.config.example.json`, `scripts/workflow-manifest.json`, and identical `.agents/skills/` + `.claude/skills/` copies (`dev-workflow`, `quick-review`), plus add automated unit/integration tests in `scripts/ticket.test.mjs`. (AC3, AC4)
- [x] Run full test suite (`node --test scripts/ticket.test.mjs`), sync and configure all downstream repositories under Option A, and obtain independent subagent review (`--reviewer-id`). (AC4)

## Risks

- A Draft PR marked ready for review could miss CI if `ready_for_review` were absent from `pull_request.types`; mitigated by adding `ready_for_review` alongside `if: github.event.pull_request.draft == false`.
- Downstream `prePushVerify` could block emergency branch deletion or `--pre-push` push of tags/empty refs if stdin ref deletion is not checked; mitigated by skipping verify when all pushed `local_oid` values are zero SHAs or `GIT_SKIP_PREPUSH_VERIFY=1` is set.
- Downstream repos that disable `ticket-done.yml` rely on local `ticket.mjs merge` or `ticket.mjs done`; mitigated by verifying local `merge` closes out Notion in `scripts/ticket.test.mjs` and updating `AGENTS.md` / skills.

## Out of scope

- Removing `release.yml` tag-triggered release packaging in `FluentOverlay` or altering public repository workflows (`FluentTimer`, `TokenHUD`, `AI-Dev-Workflow`).
- Modifying dirty WIP feature worktrees (`FluentOverlay` `fix/header-slider-and-favourites` or `Fluent-Studio-Website` `codex/product-truth-sync`).

## Notes

- Plan approved by Aaron (2026-11-17): "proceed with plan / Option A"

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-17 11:17 UTC, Gemini (review: pass): Independent read-only review passed: plan-check.yml base-SHA ciSkipTicketTests & draft gating, sync.mjs ci.ticketDoneWorkflow removal/drift checks, ticket.mjs verify --pre-push / merge / hook / doctor, docs/skills parity, T3.5 & full pack --test suite (0 failures), and all 6 downstream Option A checkouts verified. [reviewer: ade7ad01-9f2f-4651-b44c-ca71368dd67c]
