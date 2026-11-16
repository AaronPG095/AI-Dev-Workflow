---
title: Plan - Bug: Fix Plan Check Diff And Criteria Split
ticket: local://ADW:ADW-Plan-Fix-Plan-Check-Diff-And-Criteria-Split-2026-11
status: planned
priority: 
state: 
due: 
appetite: S
version: none
impact: none
devTicketKey: ADW:ADW-Plan-Fix-Plan-Check-Diff-And-Criteria-Split-2026-11
agent: Gemini
---
# Fix Plan Check Diff And Criteria Split

## Summary

Fix two edge cases found during independent review: avoid SIGPIPE and wrong merge-base range in plan-check.yml and preserve commas inside ticket.mjs new --criteria and --steps.

## Context

plan-check.yml:43 uses two-dot diff piped into grep -q under pipefail; scripts/ticket.mjs:2651,2661 splits --criteria and --steps on commas.

## Open questions

None

## Acceptance criteria

- [ ] AC1: plan-check.yml uses git diff --quiet with a three-dot merge-base range and no grep pipe.
- [ ] AC2: ticket.mjs new splits --criteria and --steps on pipes or newlines while preserving commas inside items.
- [ ] AC3: node --test scripts/ticket.test.mjs and node scripts/ticket.mjs check pass with the new regression test.

## Steps

- [ ] Update .github/workflows/plan-check.yml to use git diff --quiet BASE...HEAD (AC1)
- [ ] Update scripts/ticket.mjs new to split on pipes and newlines only (AC2)
- [ ] Add regression test in scripts/ticket.test.mjs and run full test suite and check (AC3)

## Risks

Breaking callers that rely on comma-separated --criteria; verified all existing tests use pipe delimiters.

## Out of scope

Downstream syncs (applied in follow-up once this PR merges to main).

## Notes

- Approved by Aaron (2026-11-16): "Fix all issues"

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
