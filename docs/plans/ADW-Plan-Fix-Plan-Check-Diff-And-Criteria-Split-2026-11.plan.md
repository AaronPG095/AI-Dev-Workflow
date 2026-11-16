---
title: Plan - Bug: Fix Plan Check Diff And Criteria Split
ticket: local://ADW:ADW-Plan-Fix-Plan-Check-Diff-And-Criteria-Split-2026-11
status: shipped
priority: 
state: 
due: 
appetite: S
version: none
impact: none
devTicketKey: ADW:ADW-Plan-Fix-Plan-Check-Diff-And-Criteria-Split-2026-11
agent: Gemini
branch: gemini/fix-plan-check-diff-and-criteria-split
worktree: AI-Dev-Workflow
startedAt: 2026-11-16
reviewedBy: Gemini
reviewVerdict: pass
reviewSelfReason: Verified plan-check diff and criteria comma-split fix with 87/87 tests
reviewFingerprint: 28be451457184ae56cbb8e88ba0d5a211c96904cd287555736b5baeaf150b7c6
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/35
---
# Fix Plan Check Diff And Criteria Split

## Summary

Fix two edge cases found during independent review: avoid SIGPIPE and wrong merge-base range in plan-check.yml and preserve commas inside ticket.mjs new --criteria and --steps.

## Context

plan-check.yml:43 uses two-dot diff piped into grep -q under pipefail; scripts/ticket.mjs:2651,2661 splits --criteria and --steps on commas.

## Open questions

None

## Acceptance criteria

- [x] AC1: plan-check.yml uses git diff --quiet with a three-dot merge-base range and no grep pipe. verified(inspect): plan-check.yml updated to git diff --quiet BASE...HEAD without grep pipe
- [x] AC2: ticket.mjs new splits --criteria and --steps on pipes or newlines while preserving commas inside items. verified(test): ticket.mjs new splits --criteria and --steps on pipes/newlines only and new command test checks comma preservation
- [x] AC3: node --test scripts/ticket.test.mjs and node scripts/ticket.mjs check pass with the new regression test. verified(test): node --test scripts/ticket.test.mjs passed 87/87 tests and doctor passed 4/4 invariants

## Steps

- [x] Update .github/workflows/plan-check.yml to use git diff --quiet BASE...HEAD (AC1)
- [x] Update scripts/ticket.mjs new to split on pipes and newlines only (AC2)
- [x] Add regression test in scripts/ticket.test.mjs and run full test suite and check (AC3)

## Risks

Breaking callers that rely on comma-separated --criteria; verified all existing tests use pipe delimiters.

## Out of scope

Downstream syncs (applied in follow-up once this PR merges to main).

## Notes

- Approved by Aaron (2026-11-16): "Fix all issues"

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-16 13:30 UTC, Gemini (review: pass): Verified plan-check.yml git diff --quiet BASE...HEAD fix, pipe/newline criteria splitting, regression test, and 87/87 passing tests. [self-review: Verified plan-check diff and criteria comma-split fix with 87/87 tests]
