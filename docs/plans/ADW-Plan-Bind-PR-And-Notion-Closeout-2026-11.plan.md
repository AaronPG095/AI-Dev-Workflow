---
title: Plan - Bug: Bind PR and Notion close-out
ticket: local://ADW:ADW-Plan-Bind-PR-And-Notion-Closeout-2026-11
status: planned
appetite: L
version: none
impact: patch
devTicketKey: ADW:ADW-Plan-Bind-PR-And-Notion-Closeout-2026-11
agent: Codex
---
# Bind PR and Notion close-out

## Summary

Bind Notion writes to the correct Development Task. Validate the GitHub pull request and reviewed head before merging, check for completed merges before close-out, and restore the manual Actions fallback.

## Context

The ticket URL chooses a page for start, PR linking, and close-out. The merge command trusts a successful gh process, and sync produces a manual workflow whose job can only run for a pull request event.

## Open questions

None

## Acceptance criteria

- [ ] AC1: Start, PR linking, and completion reject a Task whose data source, lane, project, or stable ticket key does not match the plan.
- [ ] AC2: Local merge requires the intended repository, plan, and reviewed revision, and pending GitHub merges leave Tasks open.
- [ ] AC3: Manual and automatic workflow entry points resolve a real merged PR on a protected branch before closing its Tasks.

## Steps

- [ ] Validate canonical Task identity in each Notion lifecycle path (AC1).
- [ ] Bind local merge and manual completion to verified GitHub state (AC2).
- [ ] Preserve working manual and automatic workflow entry points in sync (AC3).
- [ ] Verify the GitHub and Notion boundaries with fixtures and document the migration (AC1, AC2, AC3).

## Risks

Older Tasks may lack the development fields. Fail before changes and document how to reconcile the original Task. A merge queue can defer closing the ticket to a subsequent invocation.

## Out of scope

Live Notion data migration, GitHub repository rules, and deployment to other repositories.

## Notes

Aaron approved the review's fixes by saying “Implement your fixes.”

## Progress log
