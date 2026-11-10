---
title: Plan - Feature: Fleet Intelligence And Cross Repo Harmony
ticket: local://ADW:ADW-Plan-Fleet-Intelligence-And-Cross-Repo-Harmony-2026-11
status: planned
priority: medium
state: flow
due: 
devTicketKey: ADW:ADW-Plan-Fleet-Intelligence-And-Cross-Repo-Harmony-2026-11
agent: Gemini
---
# Fleet Intelligence And Cross Repo Harmony

## Summary

Deliver unified fleet intelligence and cross-repository harmony for multi-agent workflows across all 7 repositories: (1) a consolidated `fleet` dashboard command showing branch states, active plans, review verdicts, worktrees, and PR statuses, (2) a fleet-wide verification runner (`ticket.mjs fleet verify [--tier <name>|--all]`) to validate test suites across all repos in one pass, and (3) enhanced cross-repo architectural search (`ticket.mjs recall "<query>" --fleet`) indexing ADRs, decisions, and plan criteria to prevent cross-repo divergence.

## Acceptance criteria

- [ ] `node scripts/ticket.mjs fleet` provides a unified dashboard across all known fleet repositories displaying branches, dirty state, worktrees, active plans, review verdicts, and PR status.
- [ ] `node scripts/ticket.mjs fleet --pr` lists open GitHub pull requests across all fleet repositories.
- [ ] `node scripts/ticket.mjs fleet --worktrees` lists active worktrees across all fleet repositories.
- [ ] `node scripts/ticket.mjs fleet verify [--tier <name>|--all]` executes verification tiers across all fleet repositories and prints a pass/fail summary matrix.
- [ ] `node scripts/ticket.mjs recall "<query>" --fleet` indexes and displays matching ADRs, plans, criteria, and decisions across all repositories with line citations.
- [ ] `README.md` is updated with documentation for `fleet` dashboard, `fleet verify`, and cross-repo `recall`.
- [ ] Comprehensive unit tests cover `fleet`, `fleet --worktrees`, `fleet verify`, and enhanced `recall` in `scripts/ticket.test.mjs`.
- [ ] All unit tests pass 100% (`node --test scripts/ticket.test.mjs`).

## Steps

- [ ] Implement `fleet` command in `scripts/ticket.mjs` supporting dashboard, `--pr`, and `--worktrees`.
- [ ] Implement `fleet verify` sub-action in `scripts/ticket.mjs` supporting tiered verification across all fleet repositories.
- [ ] Enhance `recall` in `scripts/ticket.mjs` with multi-repo snippet extraction and criteria matching.
- [ ] Update `README.md` with `fleet` and `fleet verify` command references.
- [ ] Add unit tests for `fleet`, `fleet verify`, and `recall` in `scripts/ticket.test.mjs`.
- [ ] Run test suite `node --test scripts/ticket.test.mjs` and verify 100% pass rate.
- [ ] Run `ticket.mjs pack --test` and stamp review verdict with `ticket.mjs review`.
- [ ] Run `ticket.mjs check`, push branch, open PR, and merge to `main`.

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
