---
title: Plan - Feature: Model Check on Workflow Startup
ticket: local://ADW:ADW-Plan-Model-Check-on-Workflow-Startup-2026-11
status: shipped
priority: 
state: 
due: 
appetite: M
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Model-Check-on-Workflow-Startup-2026-11
agent: Codex
branch: codex/model-check-on-startup
worktree: AI-Dev-Workflow
startedAt: 2026-11-28
reviewedBy: Codex
reviewVerdict: pass
reviewSession: /root/startup_check_reviewer
reviewModel: gpt-6.2-sol
baseBranch: main
reviewFingerprint: b2b6e68aa8b0f9f8e2ae6bf88a877cf05f1d27f942de6a522b31e05623c2ce4f
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/64
---
# Model Check on Workflow Startup

## Summary

Replace the manual weekly model review with an opportunistic check during Codex workflow startup. Use local state to show a due hint after seven days and keep promotion in the existing reviewed workflow.

## Context

PR #63 documents a manual weekly check and a reviewed promotion procedure. The CLI already has Codex-aware role routing, and active work starts or resumes with prime or resume.

## Open questions

None

## Acceptance criteria

- [x] AC1: Codex prime and resume emit a due hint only when the saved successful check is missing, invalid, or at least seven days old. Other clients keep their existing boot output. verified(test): Focused regression passed for missing, stale, future and fresh state, shared worktrees and other clients. Live public check completed and the next Codex prime and resume stayed quiet.
- [x] AC2: A completed public-source check records local state shared by worktrees. Missing state or a failed public-source lookup leaves a check due, and no model route changes. verified(test): Focused regression passed for missing, stale, future and fresh state, shared worktrees and other clients. Live public check completed and the next Codex prime and resume stayed quiet.
- [x] AC3: Workflow instructions tell Codex how to run the due check alongside current work, surface actionable changes and keep reviewed model promotion. Focused and full verification cover the startup behavior. verified(test): All 105 Windows CLI tests passed. Startup guidance is mirrored, the first live check completed without an actionable change, and independent review passed.

## Steps

- [x] Add the local due check and completion command to the CLI. (AC1, AC2) verified(test): Focused regression passed for missing, stale, future and fresh state, shared worktrees and other clients. Live public check completed and the next Codex prime and resume stayed quiet.
- [x] Hook Codex boot guidance into the mirrored workflow skills and document the update procedure. (AC3) verified(test): All 105 Windows CLI tests passed. Startup guidance is mirrored, the first live check completed without an actionable change, and independent review passed.
- [x] Verify due, fresh, stale and failed-check behavior, then obtain independent review. (AC1, AC2, AC3) verified(test): All 105 Windows CLI tests passed. Startup guidance is mirrored, the first live check completed without an actionable change, and independent review passed.

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
- 2026-11-28 12:33 UTC, Codex: Live check read the official Codex changelog, Codex rate card and OpenAI deprecations. No actionable change to pinned models. Recorded completion and observed quiet startup and resume.
- 2026-11-28 12:37 UTC, Codex (review: pass): Independent review confirmed the seven-day gate, worktree sharing, backward-compatible boot output, documented prerequisites and unchanged promotion requirements. [reviewer: /root/startup_check_reviewer] (model: gpt-6.2-sol)
- 2026-11-28 12:37 UTC, Codex (handoff): Done: Implemented, verified, and independently reviewed workflow-triggered model checks; Next: Publish, wait for CI, then merge.; Open: none; Tree: 9 dirty file(s)
