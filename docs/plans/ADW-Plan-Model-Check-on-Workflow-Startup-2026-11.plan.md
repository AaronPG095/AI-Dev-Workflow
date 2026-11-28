---
title: Plan - Feature: Model Check on Workflow Startup
ticket: local://ADW:ADW-Plan-Model-Check-on-Workflow-Startup-2026-11
status: planned
priority: 
state: 
due: 
appetite: M
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Model-Check-on-Workflow-Startup-2026-11
agent: Codex
---
# Model Check on Workflow Startup

## Summary

Replace the manual weekly model review with an opportunistic check during Codex workflow startup. Use local state to show a due hint after seven days and keep promotion in the existing reviewed workflow.

## Context

PR #63 documents a manual weekly check and a reviewed promotion procedure. The CLI already has Codex-aware role routing, and active work starts or resumes with prime or resume.

## Open questions

None

## Acceptance criteria

- [ ] AC1: Codex prime and resume emit a due hint only when the saved successful check is missing, invalid, or at least seven days old. Other clients keep their existing boot output.
- [ ] AC2: A completed public-source check records local state shared by worktrees. Missing state or a failed public-source lookup leaves a check due, and no model route changes.
- [ ] AC3: Workflow instructions tell Codex how to run the due check alongside current work, surface actionable changes and keep reviewed model promotion. Focused and full verification cover the startup behavior.

## Steps

- [ ] Add the local due check and completion command to the CLI. (AC1, AC2)
- [ ] Hook Codex boot guidance into the mirrored workflow skills and document the update procedure. (AC3)
- [ ] Verify due, fresh, stale and failed-check behavior, then obtain independent review. (AC1, AC2, AC3)

## Risks

Cache loss can cause an early recheck. Persist only successful completion in a checkout-local machine cache and leave the main workflow usable if the cache is unavailable. Keep public-source reads outside the CLI boot command.

## Out of scope

Scheduling, unattended model promotion, provider billing, and changes to the LLM router.

## Notes

Aaron approved with “Agreed.”

> After prime or resume, Codex would check when it last completed a model check. If it’s been at least seven days, Codex would check official release notes, prices, and retirements alongside the current work.

Use the operating system temporary directory and the Git common-directory identity so worktrees in one clone share a seven-day clock without creating working-tree changes.

## Progress log

<!-- One line per session/review, added with ticket.mjs log or ticket.mjs review -->
