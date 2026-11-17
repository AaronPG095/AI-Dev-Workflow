---
title: Plan - Bug: Strip Git Hook Env In Verify
ticket: local://ADW:ADW-Plan-Strip-Git-Hook-Env-In-Verify-2026-11
status: planned
priority: 
state: 
due: 
appetite: S
version: none
impact: none
devTicketKey: ADW:ADW-Plan-Strip-Git-Hook-Env-In-Verify-2026-11
agent: Gemini
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

- [ ] AC1: `scripts/ticket.mjs` uses `verifyExecEnv()` (stripping `GIT_DIR` and sibling Git hook env vars) across all verification execution paths (`verify`, `runVerifyCmd`, `pack --test`, `pr --verify`, `fleet verify`).
- [ ] AC2: `T3.5` in `scripts/ticket.test.mjs` verifies `verify --pre-push` runs cleanly even when `GIT_DIR` is set to a dummy path, `node --test scripts/ticket.test.mjs` passes all 89 tests, and independent subagent review passes.

## Steps

- [ ] Add `verifyExecEnv()` and wire it into verification command invocations in `scripts/ticket.mjs`. (AC1)
- [ ] Add regression assertion in `T3.5` (`scripts/ticket.test.mjs`), run full test suite, and obtain independent subagent review (`--reviewer-id`). (AC2)

## Risks

- A verification script legitimately expecting `GIT_DIR` during pre-push would see unset `GIT_DIR` and resolve Git from `cwd` (`repoRoot`), which is safer and desired across worktrees and temp directories.

## Out of scope

- Modifying `Fluent-Studio-Website`'s Next.js version or `.githooks/pre-push` (`pnpm audit --prod` advisory).

## Notes

- Continuation of Aaron's approved Option A plan ("proceed with plan / Option A"), fixing `GIT_DIR` leakage discovered during live `FluentOverlay` pre-push verification inside a linked worktree.

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
