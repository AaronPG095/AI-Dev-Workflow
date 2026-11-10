---
title: Plan - Feature: Verification Matrix And Hygiene Guardrails
ticket: local://ADW:ADW-Plan-Verification-Matrix-And-Hygiene-Guardrails-2026-11
status: in-progress
priority: medium
state: flow
due: 
devTicketKey: ADW:ADW-Plan-Verification-Matrix-And-Hygiene-Guardrails-2026-11
agent: Gemini
branch: feat/verification-matrix-and-hygiene-guardrails
worktree: AI-Dev-Workflow
startedAt: 2026-11-10
reviewedBy: Gemini
reviewVerdict: pass
---
# Verification Matrix And Hygiene Guardrails

## Summary

Introduce a tiered verification matrix (`ticket.mjs verify [--tier <name>|--all]`) supporting multiple test and validation stages (e.g. `fast`, `test`, `full`) with seamless fallback to `verifyCommand`. Add a strict working-tree hygiene scanner (`ticket.mjs hygiene`) to detect temporary build debris, uncommitted artifacts, oversized files, and dangling worktrees before code reviews and PR close-outs.

## Acceptance criteria

- [x] `ticket.config.json` supports a `"verify"` object with tiered commands (`fast`, `test`, `full`) while maintaining full backwards compatibility with string `"verifyCommand"`. verified: unit test 46 passed verifying tiered config and legacy verifyCommand fallback
- [x] `node scripts/ticket.mjs verify` executes the specified tier (`--tier <name>`, default `test`) or all tiers (`--all`), reporting clear success or failure. verified: unit test 46 passed verifying default tier, custom tier, and --all execution
- [x] `node scripts/ticket.mjs prime` displays tiered verification commands in the session context primer. verified: tested prime command output showing multi-tier verification formatted correctly
- [x] `node scripts/ticket.mjs pack --test` supports running a specific verification tier (`--tier`) and embedding the results into the review packet. verified: unit test 48 passed validating pack --test --tier embedding verification output
- [x] `node scripts/ticket.mjs hygiene` inspects the working tree for disallowed temporary artifacts (`.tmp`, `test-results`, `coverage`, `*.log`), oversized files, and dangling worktrees. verified: unit test 47 passed detecting .tmp, custom pattern, and oversized file warnings
- [x] `node scripts/ticket.mjs check` and `pack` integrate the hygiene scan into their reports. verified: unit test 47 passed verifying pack embeds hygiene section and check enforces hygiene
- [x] Comprehensive unit tests cover tiered verification, hygiene checks, and configuration backwards compatibility in `scripts/ticket.test.mjs`. verified: tests 46, 47, and 48 cover verification tiers, hygiene detection, and compatibility
- [x] All unit tests pass 100% (`node --test scripts/ticket.test.mjs`). verified: all 48 unit tests in scripts/ticket.test.mjs pass 100%

## Steps

- [x] Implement tiered verification resolution and `verify` command in `scripts/ticket.mjs`.
- [x] Update `prime`, `pack`, and `pr` to integrate verification tiers.
- [x] Implement `hygiene` scanner in `scripts/ticket.mjs` checking untracked disallowed files, oversized files, and broken worktrees.
- [x] Integrate `hygiene` checks into `pack` review packet and `check` validation.
- [x] Update `ticket.config.json` and `ticket.config.example.json` with verification tiers and hygiene configuration options.
- [x] Add unit tests for `verify` and `hygiene` commands in `scripts/ticket.test.mjs`.
- [x] Run test suite `node --test scripts/ticket.test.mjs` and verify 100% pass rate.
- [x] Run `ticket.mjs pack --test` and stamp review verdict with `ticket.mjs review`.
- [x] Run `ticket.mjs check`, push branch, open PR, and merge to `main`.

## Risks

- Breaking existing repositories that specify `"verifyCommand": "<string>"`. Contained by strictly treating `"verifyCommand"` as the default for tier `test` whenever `"verify"` object is omitted or does not define `test`.
- Performance overhead of file size and tree scanning in `hygiene`. Contained by relying on native `git status --porcelain` and `git ls-files` without recursive filesystem walks.

## Out of scope

- Auto-deleting untracked files without confirmation.
- Enforcing hygiene checks as hard blockers for existing downstream repositories during this PR (will be rolled out as an opt-in/warning).

## Notes

User approval quoted:
"Let's implement track A. Then prompt me with the remaining suggestions afterwards."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-10 07:16 UTC, Gemini (review: pass): Implemented tiered verification matrix and strict working-tree hygiene scanner with comprehensive unit tests
