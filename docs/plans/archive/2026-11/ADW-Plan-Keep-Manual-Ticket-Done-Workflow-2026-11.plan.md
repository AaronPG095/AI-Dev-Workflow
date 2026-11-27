---
title: Plan - Bug: Keep Manual Ticket Done Workflow
ticket: local://ADW:ADW-Plan-Keep-Manual-Ticket-Done-Workflow-2026-11
status: shipped
priority: 
state: 
due: 
appetite: S
version: none
impact: none
devTicketKey: ADW:ADW-Plan-Keep-Manual-Ticket-Done-Workflow-2026-11
agent: Gemini
branch: feat/keep-manual-ticket-done-workflow
worktree: AI-Dev-Workflow
startedAt: 2026-11-17
reviewedBy: Gemini
reviewVerdict: pass
reviewSession: 6cfe9bbc-8d15-449e-a932-3dfb17687031
reviewFingerprint: 93b37c460507cefa306e92ff8209dce4033ae18e4f18e9d0e2f607ac5cd2d88c
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/38
---
# Keep Manual Ticket Done Workflow

## Summary

Convert `.github/workflows/ticket-done.yml` to manual `on: workflow_dispatch:` triggers instead of deleting it when `ci.ticketDoneWorkflow: false`, keeping downstream test bundles self-consistent (`89/89` passing in `private-ai-repo` and `example-desktop-app`) with zero automatic GitHub Actions runs on PR close.

## Context

- Deleting `.github/workflows/ticket-done.yml` in `private-ai-repo` and `example-desktop-app` broke `scripts/ticket.test.mjs` (#54, #72, #89 `T3.5`), because those tests treat the local repo's `scripts/` / `.github/workflows/` directory as `BUNDLE_ROOT`.
- `scripts/sync.mjs:83-99,259-271` can rewrite the `on:` trigger block of `.github/workflows/ticket-done.yml` to `on:\n  workflow_dispatch:` when `cfg.ci?.ticketDoneWorkflow === false`, eliminating automatic PR-close Actions usage while keeping `ticket-done.yml` on disk.

## Open questions

None

## Acceptance criteria

- [x] AC1: `scripts/sync.mjs` preserves `.github/workflows/ticket-done.yml` on disk and rewrites its `on:` trigger block to `workflow_dispatch:` when `cfg.ci?.ticketDoneWorkflow === false`, while gracefully handling `workflow_dispatch:` `ticket-done.yml` when acting as a downstream `BUNDLE_ROOT`. verified(test): sync.mjs rewrites ticket-done.yml on: block to workflow_dispatch: when ci.ticketDoneWorkflow=false and accepts workflow_dispatch: downstream
- [x] AC2: `T3.5` in `scripts/ticket.test.mjs` verifies the `workflow_dispatch:` rewrite (zero `pull_request:` trigger) and `89/89` tests pass in both `AI-Dev-Workflow` and `private-ai-repo` (`example-desktop-app` verify suite). verified(test): 89/89 tests pass in AI-Dev-Workflow and private-ai-repo with T3.5 verifying workflow_dispatch: rewrite and --bundle-only check

## Steps

- [x] Update `scripts/sync.mjs` to replace `on:` with `workflow_dispatch:` for `.github/workflows/ticket-done.yml` when `ci.ticketDoneWorkflow === false`. (AC1)
- [x] Update `T3.5` in `scripts/ticket.test.mjs` and run full `node --test scripts/ticket.test.mjs` across `AI-Dev-Workflow` and downstream repos, then obtain independent subagent review. (AC2)

## Risks

- A downstream repo with `ci.ticketDoneWorkflow: false` might still have `workflow_dispatch:` manually invoked; keeping `workflow_dispatch:` runnable preserves manual fallback without automatic runs on merge.

## Out of scope

- Removing `plan-check.yml` or changing public repo workflows.

## Notes

- Continuation of Aaron's approved Option A plan ("proceed with plan / Option A"), fixing downstream `ticket.test.mjs` bundle-root compatibility discovered while running `verify --pre-push` in `private-ai-repo`.

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-17 11:33 UTC, Gemini (review: pass): scripts/sync.mjs cleanly converts .github/workflows/ticket-done.yml to on: workflow_dispatch: when ci.ticketDoneWorkflow=false, accepts workflow_dispatch:-only downstream bundles, and removes dead deletion logic; pack --test exit 0 and 89/89 pass in AI-Dev-Workflow and private-ai-repo. [reviewer: 6cfe9bbc-8d15-449e-a932-3dfb17687031]
