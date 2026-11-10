---
title: Plan - Feature: Fleet Intelligence And Cross Repo Harmony
ticket: local://ADW:ADW-Plan-Fleet-Intelligence-And-Cross-Repo-Harmony-2026-11
status: in-progress
priority: medium
state: flow
due: 
devTicketKey: ADW:ADW-Plan-Fleet-Intelligence-And-Cross-Repo-Harmony-2026-11
agent: Gemini
branch: feat/fleet-intelligence-and-cross-repo-harmony
worktree: AI-Dev-Workflow
startedAt: 2026-11-10
reviewedBy: Gemini
reviewVerdict: pass
---
# Fleet Intelligence And Cross Repo Harmony

## Summary

Deliver unified fleet intelligence and cross-repository harmony for multi-agent workflows across all 7 repositories: (1) a consolidated `fleet` dashboard command showing branch states, active plans, review verdicts, worktrees, and PR statuses, (2) a fleet-wide verification runner (`ticket.mjs fleet verify [--tier <name>|--all]`) to validate test suites across all repos in one pass, and (3) enhanced cross-repo architectural search (`ticket.mjs recall "<query>" --fleet`) indexing ADRs, decisions, and plan criteria to prevent cross-repo divergence.

## Acceptance criteria

- [x] `node scripts/ticket.mjs fleet` provides a unified dashboard across all known fleet repositories displaying branches, dirty state, worktrees, active plans, review verdicts, and PR status. verified: tested via ticket.mjs fleet and unit test 52, outputs 7 repos with branch, dirty, worktrees, active plan, and review status
- [x] `node scripts/ticket.mjs fleet --pr` lists open GitHub pull requests across all fleet repositories. verified: tested via ticket.mjs fleet --pr and unit test 52, queries open pull requests across all fleet repos
- [x] `node scripts/ticket.mjs fleet --worktrees` lists active worktrees across all fleet repositories. verified: tested via ticket.mjs fleet --worktrees and unit test 52, outputs all active git worktrees per repo
- [x] `node scripts/ticket.mjs fleet verify [--tier <name>|--all]` executes verification tiers across all fleet repositories and prints a pass/fail summary matrix. verified: executed live across fleet (2 passed, 0 failed, 5 skipped) and verified in unit test 53
- [x] `node scripts/ticket.mjs recall "<query>" --fleet` indexes and displays matching ADRs, plans, criteria, and decisions across all repositories with line citations. verified: executed live across 7 repos returning 65 matches with line numbers, file paths, and repo headers, covered in unit test 54
- [x] `README.md` is updated with documentation for `fleet` dashboard, `fleet verify`, and cross-repo `recall`. verified: README.md updated with fleet, fleet verify, and recall --fleet sections, options, and test suite count
- [x] Comprehensive unit tests cover `fleet`, `fleet --worktrees`, `fleet verify`, and enhanced `recall` in `scripts/ticket.test.mjs`. verified: added unit tests 52, 53, 54 in scripts/ticket.test.mjs covering all added features
- [x] All unit tests pass 100% (`node --test scripts/ticket.test.mjs`). verified: 54 of 54 tests passing (0 failures, 0 skipped) in 28.3s

## Steps

- [x] Implement `fleet` command in `scripts/ticket.mjs` supporting dashboard, `--pr`, and `--worktrees`.
- [x] Implement `fleet verify` sub-action in `scripts/ticket.mjs` supporting tiered verification across all fleet repositories.
- [x] Enhance `recall` in `scripts/ticket.mjs` with multi-repo snippet extraction and criteria matching.
- [x] Update `README.md` with `fleet` and `fleet verify` command references.
- [x] Add unit tests for `fleet`, `fleet verify`, and `recall` in `scripts/ticket.test.mjs`.
- [x] Run test suite `node --test scripts/ticket.test.mjs` and verify 100% pass rate.
- [x] Run `ticket.mjs pack --test` and stamp review verdict with `ticket.mjs review`.
- [x] Run `ticket.mjs check`, push branch, open PR, and merge to `main`.

## Risks

- External command failures when probing `gh` or git across dirty repos: contained by wrapping calls in `allowFail: true` / try-catch and falling back to local git information.
- Performance when running fleet-wide verification: contained by reporting progress per repository with elapsed durations and clean exit codes.

## Out of scope

- Automating cross-repository PR merges without human review.

## Notes

User approval quoted:
"Okay, continue with track C."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-10 07:52 UTC, Gemini (review: pass [standards: pass, spec: pass]): Implemented fleet dashboard, fleet verify matrix, and enhanced cross-repo recall with full unit test coverage
