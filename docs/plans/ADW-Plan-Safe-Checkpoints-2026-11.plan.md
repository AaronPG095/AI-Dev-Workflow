---
title: Plan - Bug: Safe Checkpoints
ticket: local://ADW:ADW-Plan-Safe-Checkpoints-2026-11
status: in-progress
priority: high
devTicketKey: ADW:ADW-Plan-Safe-Checkpoints-2026-11
agent: Codex
branch: codex/safe-checkpoints
worktree: AI-Dev-Workflow
startedAt: 2026-11-11
reviewedBy: Codex
reviewVerdict: pass
reviewFingerprint: c327d02fcf6932d532ce712c34401858fa89b547e00507a2ee6a1ed4af8ae298
---

# Safe Checkpoints

## Summary

Make checkpoints report what actually verified and committed. Preserve unrelated staged changes and recover from a rejected commit.

## Acceptance criteria

- [x] Checkpoint refuses skipped or missing verification and stops before another run at the retry limit. verified: checkpoint fixture rejects --no-verify and unknown tiers, and stops at 2/2 before running again
- [x] A checkpoint commits the plan and explicitly staged changes while preserving unrelated working-copy edits. A rejected commit restores the plan and original index and exits nonzero. verified: rejecting-hook fixture preserves exact plan and staged diff; successful retry commits only the staged file and plan
- [x] Regression fixtures cover skipped verification, exhausted retries, commit rejection, and commit scope. The complete Node 22 suite passes. verified: pack --test reports PASS for the full Node 22 suite; targeted checkpoint fixture passes all four failure paths

## Steps

- [x] Implement fail-closed verification and retry enforcement.
- [x] Implement scoped staging and recovery on failed commit.
- [x] Update tests, command guidance, and the README.

## Notes

Aaron approved the repair sequence: “Plan approved.” Aaron directed execution of the entire sequence.

## Progress log
- 2026-11-11 10:58 UTC, Codex (review: pass): Verification cannot be skipped or rerun at the retry limit. Scoped commits and rejected-hook recovery passed the Git fixtures.
