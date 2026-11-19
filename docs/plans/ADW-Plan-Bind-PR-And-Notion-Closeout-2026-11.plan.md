---
title: Plan - Bug: Bind PR and Notion close-out
ticket: local://ADW:ADW-Plan-Bind-PR-And-Notion-Closeout-2026-11
status: shipped
appetite: L
version: none
impact: patch
devTicketKey: ADW:ADW-Plan-Bind-PR-And-Notion-Closeout-2026-11
agent: Codex
branch: codex/bind-pr-and-notion-closeout
worktree: AI-Dev-Workflow
startedAt: 2026-11-18
reviewedBy: Codex
reviewVerdict: pass
reviewSession: /root/review_closeout
reviewFingerprint: 3e3852ba2d4d4259f0ba6bdfd97cceb06d5cda52d0466027976953132577b3cf
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/41
---
# Bind PR and Notion close-out

## Summary

Bind Notion writes to the correct Development Task. Validate the GitHub pull request and reviewed head before merging, check for completed merges before close-out, and restore the manual Actions fallback.

## Context

The ticket URL chooses a page for start, PR linking, and close-out. The merge command trusts a successful gh process, and sync produces a manual workflow whose job can only run for a pull request event.

## Open questions

None

## Acceptance criteria

- [x] AC1: Start, PR linking, and completion reject a Task whose data source, lane, project, or stable ticket key does not match the plan. verified(test): Fixtures reject Task data source, key, lane, project and recorded path mismatches before any write and preserve provenance on long descriptions.
- [x] AC2: Local merge requires the intended repository, plan, and reviewed revision, and pending GitHub merges leave Tasks open. verified(test): Mocked GitHub tests block stale heads and unrelated plans, pin the reviewed head, and leave the Task untouched while a merge is queued.
- [x] AC3: Manual and automatic workflow entry points resolve a real merged PR on a protected branch before closing its Tasks. verified(test): Fixtures cover dispatch wiring, unmerged and unprotected PR rejection, pagination, and committed plans after linear, squash, and merge-commit merges.

## Steps

- [x] Validate canonical Task identity in each Notion lifecycle path (AC1).
- [x] Bind local merge and manual completion to verified GitHub state (AC2).
- [x] Preserve working manual and automatic workflow entry points in sync (AC3).
- [x] Verify the GitHub and Notion boundaries with fixtures and document the migration (AC1, AC2, AC3).

## Risks

Older Tasks may lack the development fields. Fail before changes and document how to reconcile the original Task. A merge queue can defer closing the ticket to a subsequent invocation.

## Out of scope

Live Notion data migration, GitHub repository rules, and deployment to other repositories.

## Notes

Aaron approved the review's fixes by saying “Implement your fixes.”

## Progress log
- 2026-11-19 08:01 UTC, Codex (handoff): Done: Notion and GitHub close-out fixes, targeted fixtures, and independent review passed.; Next: Open the PR and confirm hosted CI.; Open: none; Tree: 6 dirty file(s)
- 2026-11-19 08:01 UTC, Codex (review: pass): Independent review verified the authoritative Notion provenance line and protected GitHub event and merge checks; 11 targeted fixtures passed. [reviewer: /root/review_closeout]
