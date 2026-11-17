---
title: Plan - Bug: Strip Git Hook Env In Verify
ticket: local://ADW:ADW-Plan-Strip-Git-Hook-Env-In-Verify-2026-11
status: shipped
priority: 
state: 
due: 
appetite: S
version: none
impact: none
devTicketKey: ADW:ADW-Plan-Strip-Git-Hook-Env-In-Verify-2026-11
agent: Gemini
branch: feat/strip-git-hook-env-in-verify
worktree: AI-Dev-Workflow
startedAt: 2026-11-17
reviewedBy: Gemini
reviewVerdict: pass
reviewSession: d7edea1f-0fc3-420b-bb26-cddc6abf9515
reviewFingerprint: 6e74058161f7c3f61e071686697964592e38254abb1446395d0eaff882b02194
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/39
---
# Strip Git Hook Env In Verify

## Summary

Strip inherited Git hook environment variables (`GIT_DIR`, `GIT_WORK_TREE`, `GIT_COMMON_DIR`, `GIT_INDEX_FILE`, `GIT_OBJECT_DIRECTORY`, `GIT_ALTERNATE_OBJECT_DIRECTORIES`, `GIT_QUARANTINE_PATH`, `GIT_PREFIX`) via a shared `verifyExecEnv()` helper when `ticket.mjs` runs verification commands so `pre-push` hooks inside linked worktrees do not break temp-repo tests.

## Context

- Pushing from `FluentOverlay/.worktrees/sync-option-a` ran `.git/hooks/pre-push` -> `node scripts/ticket.mjs verify --pre-push` -> `node --test scripts/ticket.test.mjs`, where Git's inherited `GIT_DIR` hijacked temp `git init`/`git diff` calls inside `ticket.test.mjs` (`fatal: this operation must be run in a work tree`).
- Adding `verifyExecEnv()` in `scripts/ticket.mjs` and replacing `{ ...process.env, CI: '1' }` across verification runners ensures child commands never inherit parent hook `GIT_*` pointers.

## Open questions

None

## Acceptance criteria

- [x] AC1: `scripts/ticket.mjs` uses `verifyExecEnv()` (stripping `GIT_DIR` and sibling Git hook env vars) across all verification execution paths (`verify`, `runVerifyCmd`, `pack --test`, `pr --verify`, `fleet verify`). verified(inspect): verifyExecEnv() deletes GIT_DIR/GIT_WORK_TREE/etc. across all 7 verify/pack/pr/fleet child process calls
- [x] AC2: `T3.5` in `scripts/ticket.test.mjs` verifies `verify --pre-push` runs cleanly even when `GIT_DIR` is set to a dummy path, `node --test scripts/ticket.test.mjs` passes all 89 tests, and independent subagent review passes. verified(test): T3.5 passes with dummy GIT_DIR/GIT_WORK_TREE set during verify --pre-push; full 89/89 ticket.test.mjs pass

## Steps

- [x] Add `verifyExecEnv()` and wire it into verification command invocations in `scripts/ticket.mjs`. (AC1)
- [x] Add regression assertion in `T3.5` (`scripts/ticket.test.mjs`), run full test suite, and obtain independent subagent review (`--reviewer-id`). (AC2)

## Risks

- A verification script legitimately expecting `GIT_DIR` during pre-push would see unset `GIT_DIR` and resolve Git from `cwd` (`repoRoot`), which is safer and desired across worktrees and temp directories.

## Out of scope

- Modifying `Fluent-Studio-Website`'s Next.js version or `.githooks/pre-push` (`pnpm audit --prod` advisory).

## Notes

- Continuation of Aaron's approved Option A plan ("proceed with plan / Option A"), fixing `GIT_DIR` leakage discovered during live `FluentOverlay` pre-push verification inside a linked worktree.

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-17 12:06 UTC, Gemini (review: pass): Verified verifyExecEnv() strips all 8 Git hook env vars across all 7 verification call sites in scripts/ticket.mjs, T3.5 covers dummy GIT_DIR/GIT_WORK_TREE under verify --pre-push, and pack --test (# fail 0) plus doctor (4/4 invariants) pass cleanly. [reviewer: d7edea1f-0fc3-420b-bb26-cddc6abf9515]
