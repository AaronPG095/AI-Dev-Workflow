---
title: Plan - Feature: Verification Matrix And Hygiene Guardrails
ticket: local://ADW:ADW-Plan-Verification-Matrix-And-Hygiene-Guardrails-2026-11
status: planned
priority: medium
state: flow
due: 
devTicketKey: ADW:ADW-Plan-Verification-Matrix-And-Hygiene-Guardrails-2026-11
agent: Gemini
---
# Verification Matrix And Hygiene Guardrails

## Summary

Introduce a tiered verification matrix (`ticket.mjs verify [--tier <name>|--all]`) supporting multiple test and validation stages (e.g. `fast`, `test`, `full`) with seamless fallback to `verifyCommand`. Add a strict working-tree hygiene scanner (`ticket.mjs hygiene`) to detect temporary build debris, uncommitted artifacts, oversized files, and dangling worktrees before code reviews and PR close-outs.

## Acceptance criteria

- [ ] `ticket.config.json` supports a `"verify"` object with tiered commands (`fast`, `test`, `full`) while maintaining full backwards compatibility with string `"verifyCommand"`.
- [ ] `node scripts/ticket.mjs verify` executes the specified tier (`--tier <name>`, default `test`) or all tiers (`--all`), reporting clear success or failure.
- [ ] `node scripts/ticket.mjs prime` displays tiered verification commands in the session context primer.
- [ ] `node scripts/ticket.mjs pack --test` supports running a specific verification tier (`--tier`) and embedding the results into the review packet.
- [ ] `node scripts/ticket.mjs hygiene` inspects the working tree for disallowed temporary artifacts (`.tmp`, `test-results`, `coverage`, `*.log`), oversized files, and dangling worktrees.
- [ ] `node scripts/ticket.mjs check` and `pack` integrate the hygiene scan into their reports.
- [ ] Comprehensive unit tests cover tiered verification, hygiene checks, and configuration backwards compatibility in `scripts/ticket.test.mjs`.
- [ ] All unit tests pass 100% (`node --test scripts/ticket.test.mjs`).

## Steps

- [ ] Implement tiered verification resolution and `verify` command in `scripts/ticket.mjs`.
- [ ] Update `prime`, `pack`, and `pr` to integrate verification tiers.
- [ ] Implement `hygiene` scanner in `scripts/ticket.mjs` checking untracked disallowed files, oversized files, and broken worktrees.
- [ ] Integrate `hygiene` checks into `pack` review packet and `check` validation.
- [ ] Update `ticket.config.json` and `ticket.config.example.json` with verification tiers and hygiene configuration options.
- [ ] Add unit tests for `verify` and `hygiene` commands in `scripts/ticket.test.mjs`.
- [ ] Run test suite `node --test scripts/ticket.test.mjs` and verify 100% pass rate.
- [ ] Run `ticket.mjs pack --test` and stamp review verdict with `ticket.mjs review`.
- [ ] Run `ticket.mjs check`, push branch, open PR, and merge to `main`.

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
