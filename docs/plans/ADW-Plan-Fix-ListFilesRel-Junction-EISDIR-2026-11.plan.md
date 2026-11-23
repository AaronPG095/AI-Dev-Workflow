---
title: Plan - Bug: Fix ListFilesRel Junction EISDIR
ticket: local://ADW:ADW-Plan-Fix-ListFilesRel-Junction-EISDIR-2026-11
status: in-progress
priority: 
state: 
due: 
appetite: S
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Fix-ListFilesRel-Junction-EISDIR-2026-11
agent: Gemini
branch: fix/listfilesrel-junction-eisdir
worktree: AI-Dev-Workflow
startedAt: 2026-11-23
reviewedBy: Other
reviewVerdict: warn
reviewSession: independent-junction-reviewer
baseBranch: main
reviewFingerprint: 5d9eaf0817e2af21d8f036e6e82d62680eeb94ac25fe87e540a9c8e0d39e8337
---
# Fix ListFilesRel Junction EISDIR

## Summary

Fix `listFilesRel()` in `scripts/lib/invariants-lint.mjs` so directory symlinks and Windows directory junctions (such as `.claude/skills/supabase-postgres-best-practices` in `Fluent-Studio-Website`) are traversed rather than treated as files that crash `runInvariants()` with `EISDIR`.

## Context

- `scripts/lib/invariants-lint.mjs` (`#L4-L13`): `listFilesRel()` uses `entry.isDirectory()`, which is `false` for symlinks and Windows junctions, causing `runInvariants()` `readText()` to throw `EISDIR: illegal operation on a directory`.
- Triggered on `Fluent-Studio-Website` during `node scripts/ticket.mjs doctor --fleet` after `node scripts/sync.mjs --all-known --ensure-invariants`.

## Open questions

None

## Acceptance criteria

- [x] AC1: `listFilesRel()` follows directory symlinks and Windows junctions without throwing `EISDIR` and prevents infinite symlink cycles via `realpathSync`. verified(test): listFilesRel uses realpathSync cycle guard and statSync traversal for junctions/symlinks
- [x] AC2: `node --test scripts/ticket.test.mjs` passes with a regression test covering a directory junction/symlink. verified(test): 100/100 tests pass in node --test scripts/ticket.test.mjs including junction regression test
- [x] AC3: `node scripts/ticket.mjs doctor --fleet` completes across all 7 fleet repositories without `EISDIR`. verified(cmd): doctor --fleet completes across all 7 repos without EISDIR (Fluent-Studio-Website 2/2 passed)

## Steps

- [x] Guard `listFilesRel()` in `scripts/lib/invariants-lint.mjs` using `realpathSync` cycle protection and `statSync` traversal for symlinks/junctions (AC1). verified: Updated listFilesRel in scripts/lib/invariants-lint.mjs with realpathSync and statSync
- [x] Add regression test in `scripts/ticket.test.mjs` covering a Windows junction / directory symlink and run `node --test scripts/ticket.test.mjs` (AC2). verified: Added junction/symlink regression test in scripts/ticket.test.mjs and ran 100/100
- [x] Verify `node scripts/ticket.mjs doctor --fleet` and `node scripts/sync.mjs --check --bundle-only .` pass across all repositories (AC3). verified: Ran doctor --fleet across all 7 repos and sync --check --bundle-only . cleanly

## Risks

- Circular symlinks in a repo's directory tree could cause infinite recursion; mitigate by tracking `realpathSync(rootDir)` in a `seen` `Set` and guarding broken symlinks with `try/catch` around `statSync`.

## Out of scope

- Modifying or committing inside downstream sibling repositories directly (handled separately by `sync.mjs`).

## Notes

- Triggered when `node scripts/ticket.mjs doctor --fleet` crashed on `Fluent-Studio-Website/.claude/skills/supabase-postgres-best-practices` (Windows Junction) during Phase 3 fleet rollout.

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-23 19:47 UTC, Other (review: warn [standards: pass, spec: warn]): Junction traversal fix and mirrorDirs test pass cleanly; non-blocking edge cases: seen Set in invariants-lint.mjs:12-13 deduplicates globally instead of unwinding per branch, and cycle/broken-symlink guards in invariants-lint.mjs:8-27 lack direct test cases in ticket.test.mjs:5293-5317. [reviewer: independent-junction-reviewer]
