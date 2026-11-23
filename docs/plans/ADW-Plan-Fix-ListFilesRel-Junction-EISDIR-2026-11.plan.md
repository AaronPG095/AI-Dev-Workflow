---
title: Plan - Bug: Fix ListFilesRel Junction EISDIR
ticket: local://ADW:ADW-Plan-Fix-ListFilesRel-Junction-EISDIR-2026-11
status: planned
priority: 
state: 
due: 
appetite: S
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Fix-ListFilesRel-Junction-EISDIR-2026-11
agent: Gemini
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

- [ ] AC1: `listFilesRel()` follows directory symlinks and Windows junctions without throwing `EISDIR` and prevents infinite symlink cycles via `realpathSync`.
- [ ] AC2: `node --test scripts/ticket.test.mjs` passes with a regression test covering a directory junction/symlink.
- [ ] AC3: `node scripts/ticket.mjs doctor --fleet` completes across all 7 fleet repositories without `EISDIR`.

## Steps

- [ ] Guard `listFilesRel()` in `scripts/lib/invariants-lint.mjs` using `realpathSync` cycle protection and `statSync` traversal for symlinks/junctions (AC1).
- [ ] Add regression test in `scripts/ticket.test.mjs` covering a Windows junction / directory symlink and run `node --test scripts/ticket.test.mjs` (AC2).
- [ ] Verify `node scripts/ticket.mjs doctor --fleet` and `node scripts/sync.mjs --check --bundle-only .` pass across all repositories (AC3).

## Risks

- Circular symlinks in a repo's directory tree could cause infinite recursion; mitigate by tracking `realpathSync(rootDir)` in a `seen` `Set` and guarding broken symlinks with `try/catch` around `statSync`.

## Out of scope

- Modifying or committing inside downstream sibling repositories directly (handled separately by `sync.mjs`).

## Notes

- Triggered when `node scripts/ticket.mjs doctor --fleet` crashed on `Fluent-Studio-Website/.claude/skills/supabase-postgres-best-practices` (Windows Junction) during Phase 3 fleet rollout.

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
