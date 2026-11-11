---
title: Plan - Bug: Worktree Ownership and Cleanup
ticket: local://ADW:ADW-Plan-Worktree-Ownership-And-Cleanup-2026-11
status: planned
priority: high
devTicketKey: ADW:ADW-Plan-Worktree-Ownership-And-Cleanup-2026-11
agent: Codex
---

# Worktree Ownership and Cleanup

## Summary

Give each active plan one registered checkout and preserve work during reruns and cleanup.

## Acceptance criteria

- [ ] Spawning validates branch and path identity and preserves the live plan on reruns. Dry runs create no files or worktrees.
- [ ] Switch and wave status resolve the main checkout and show sibling worktree progress. Closed historical plans cannot spawn by default.
- [ ] Cleanup skips dirty, locked, current, and unmanaged checkouts. Worktree regressions and the full Node 22 suite pass.

## Steps

- [ ] Use registered Git worktrees for checkout ownership and status.
- [ ] Make worktree creation idempotent and cleanup safe.
- [ ] Verify regressions and document the worktree behavior.

## Notes

Aaron approved the repair sequence: “Plan approved.” Aaron directed execution of the entire sequence.

## Progress log

