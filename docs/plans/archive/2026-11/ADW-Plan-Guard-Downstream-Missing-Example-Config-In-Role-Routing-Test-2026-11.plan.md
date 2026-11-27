---
title: Plan - Bug: Guard Downstream Missing Example Config In Role Routing Test
ticket: local://ADW:ADW-Plan-Guard-Downstream-Missing-Example-Config-In-Role-Routing-Test-2026-11
status: shipped
priority: 
state: 
due: 
appetite: S
version: none
impact: none
devTicketKey: ADW:ADW-Plan-Guard-Downstream-Missing-Example-Config-In-Role-Routing-Test-2026-11
agent: Gemini
branch: feat/guard-downstream-missing-example-config-in-role-routing-test
worktree: fix-role-routing-test
startedAt: 2026-11-19
reviewedBy: Gemini
reviewVerdict: pass
reviewSession: 3ad994e1-8acd-40e4-9cbd-06fa94295f12
baseBranch: main
reviewFingerprint: 694ff48c759cc106d4a9cfb26d7e213ef87322945e45058ee8cfa811d1ad4768
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/44
---
# Guard Downstream Missing Example Config In Role Routing Test

## Summary

Guard missing `ticket.config.example.json` in `scripts/ticket.test.mjs` (`role-to-model routing` test) with `if (!existsSync(fullCfg)) continue;` so downstream repositories without `ticket.config.example.json` (`private-ai-repo`, `example-desktop-app`, etc.) pass `93/93` workflow tests cleanly.

## Context

- `scripts/ticket.test.mjs:1311` already guards `ticket.config.example.json` with `if (existsSync(examplePath))`, whereas PR #43 added `scripts/ticket.test.mjs:4265-4268` reading `ticket.config.example.json` unconditionally.
- Running `node --test scripts/ticket.test.mjs` in `..\private-ai-repo` failed only on test #93 (`ENOENT: no such file or directory, open '...\\private-ai-repo\\ticket.config.example.json'`, `92/93` passed).

## Open questions

None

## Acceptance criteria

- [x] AC1: `scripts/ticket.test.mjs:4265-4269` skips `ticket.config.example.json` only when absent (`!existsSync(fullCfg)`) while still validating `scripts/ticket.config.json` and `ticket.config.example.json` whenever present, and `93/93` tests pass in `AI-Dev-Workflow` and `private-ai-repo`. verified(test): role-to-model routing skips absent ticket.config.example.json cleanly and 93/93 tests + 4/4 invariants pass

## Steps

- [x] Guard `!existsSync(fullCfg)` in the `role-to-model routing` loop in `scripts/ticket.test.mjs`. (AC1)
- [x] Run `node --test scripts/ticket.test.mjs` (`93/93`) and obtain independent subagent review (`--reviewer-id`). (AC1)

## Risks

- Skipping `scripts/ticket.config.json` could hide missing `agentic.models`; mitigated by keeping `scripts/ticket.config.json` asserted in `AI-Dev-Workflow` and downstream repos while skipping only missing files (`ticket.config.example.json`).

## Out of scope

- Modifying `ticket.mjs` runtime role-routing behavior.

## Notes

- Plan approved by Aaron (2026-11-19): "Yes, do this." (downstreams rollout uncovered test failure on `verify --pre-push` in `private-ai-repo`).

## Progress log

- 2026-11-19 17:00 UTC, Gemini (review: pass): Guards absent ticket.config.example.json in role-to-model routing test; pack --test passes (0 failures) and diff matches plan. [reviewer: 3ad994e1-8acd-40e4-9cbd-06fa94295f12]
