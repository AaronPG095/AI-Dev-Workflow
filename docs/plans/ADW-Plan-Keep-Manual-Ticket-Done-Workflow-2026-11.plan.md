---
title: Plan - Bug: Keep Manual Ticket Done Workflow
ticket: local://ADW:ADW-Plan-Keep-Manual-Ticket-Done-Workflow-2026-11
status: planned
priority: 
state: 
due: 
appetite: S
version: none
impact: none
devTicketKey: ADW:ADW-Plan-Keep-Manual-Ticket-Done-Workflow-2026-11
agent: Gemini
---
# Keep Manual Ticket Done Workflow

## Summary

Convert `.github/workflows/ticket-done.yml` to manual `on: workflow_dispatch:` triggers instead of deleting it when `ci.ticketDoneWorkflow: false`, keeping downstream test bundles self-consistent (`89/89` passing in `AI-Cortex` and `FluentOverlay`) with zero automatic GitHub Actions runs on PR close.

## Context

- Deleting `.github/workflows/ticket-done.yml` in `AI-Cortex` and `FluentOverlay` broke `scripts/ticket.test.mjs` (#54, #72, #89 `T3.5`), because those tests treat the local repo's `scripts/` / `.github/workflows/` directory as `BUNDLE_ROOT`.
- `scripts/sync.mjs:83-99,259-271` can rewrite the `on:` trigger block of `.github/workflows/ticket-done.yml` to `on:\n  workflow_dispatch:` when `cfg.ci?.ticketDoneWorkflow === false`, eliminating automatic PR-close Actions usage while keeping `ticket-done.yml` on disk.

## Open questions

None

## Acceptance criteria

- [ ] AC1: `scripts/sync.mjs` preserves `.github/workflows/ticket-done.yml` on disk and rewrites its `on:` trigger block to `workflow_dispatch:` when `cfg.ci?.ticketDoneWorkflow === false`, while gracefully handling `workflow_dispatch:` `ticket-done.yml` when acting as a downstream `BUNDLE_ROOT`.
- [ ] AC2: `T3.5` in `scripts/ticket.test.mjs` verifies the `workflow_dispatch:` rewrite (zero `pull_request:` trigger) and `89/89` tests pass in both `AI-Dev-Workflow` and `AI-Cortex` (`FluentOverlay` verify suite).

## Steps

- [ ] Update `scripts/sync.mjs` to replace `on:` with `workflow_dispatch:` for `.github/workflows/ticket-done.yml` when `ci.ticketDoneWorkflow === false`. (AC1)
- [ ] Update `T3.5` in `scripts/ticket.test.mjs` and run full `node --test scripts/ticket.test.mjs` across `AI-Dev-Workflow` and downstream repos, then obtain independent subagent review. (AC2)

## Risks

- A downstream repo with `ci.ticketDoneWorkflow: false` might still have `workflow_dispatch:` manually invoked; keeping `workflow_dispatch:` runnable preserves manual fallback without automatic runs on merge.

## Out of scope

- Removing `plan-check.yml` or changing public repo workflows.

## Notes

- Continuation of Aaron's approved Option A plan ("proceed with plan / Option A"), fixing downstream `ticket.test.mjs` bundle-root compatibility discovered while running `verify --pre-push` in `AI-Cortex`.

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
