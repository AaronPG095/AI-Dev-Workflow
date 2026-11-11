---
title: Plan - Bug: Worktree Ownership and Cleanup
ticket: local://ADW:ADW-Plan-Worktree-Ownership-And-Cleanup-2026-11
status: in-progress
priority: high
devTicketKey: ADW:ADW-Plan-Worktree-Ownership-And-Cleanup-2026-11
agent: Codex
branch: codex/worktree-ownership-and-cleanup
worktree: AI-Dev-Workflow
startedAt: 2026-11-11
reviewedBy: Codex
reviewVerdict: pass
reviewFingerprint: 46704bb5832fa45ae9c1682889c09b1efd02a0f9c86eb3e004cd18aada5e9927
---

# Worktree Ownership and Cleanup

## Summary

Give each active plan one registered checkout and preserve work during reruns and cleanup.

## Acceptance criteria

- [x] Spawning validates branch and path identity and preserves the live plan on reruns. Dry runs create no files or worktrees. verified: wave fixtures pass for colliding names, repeated spawn preserving progress, and dry-run snapshots
- [x] Switch and wave status resolve the main checkout and show sibling worktree progress. Closed historical plans cannot spawn by default. verified: linked-worktree fixtures pass for switch main, sibling progress, and six closed historical plans
- [x] Cleanup skips dirty, locked, current, and unmanaged checkouts. Worktree regressions and the full Node 22 suite pass. verified: prune fixture preserves dirty, locked, current and unmanaged checkouts; final full suite passes

## Steps

- [x] Use registered Git worktrees for checkout ownership and status.
- [x] Make worktree creation idempotent and cleanup safe.
- [x] Verify regressions and document the worktree behavior.

## Notes

Aaron approved the repair sequence: “Plan approved.” Aaron directed execution of the entire sequence.

## Progress log
- 2026-11-11 11:06 UTC, Codex (review: pass): Worktree branch and checkout identity match Git inventory. Full suite and Windows safety fixtures pass.

