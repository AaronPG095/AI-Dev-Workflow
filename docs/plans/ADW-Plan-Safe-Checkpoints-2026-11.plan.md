---
title: Plan - Bug: Safe Checkpoints
ticket: local://ADW:ADW-Plan-Safe-Checkpoints-2026-11
status: planned
priority: high
devTicketKey: ADW:ADW-Plan-Safe-Checkpoints-2026-11
agent: Codex
---

# Safe Checkpoints

## Summary

Make checkpoints report what actually verified and committed. Preserve unrelated staged changes and recover from a rejected commit.

## Acceptance criteria

- [ ] Checkpoint refuses skipped or missing verification and stops before another run at the retry limit.
- [ ] A checkpoint commits the plan and explicitly staged changes while preserving unrelated working-copy edits. A rejected commit restores the plan and original index and exits nonzero.
- [ ] Regression fixtures cover skipped verification, exhausted retries, commit rejection, and commit scope. The complete Node 22 suite passes.

## Steps

- [ ] Implement fail-closed verification and retry enforcement.
- [ ] Implement scoped staging and recovery on failed commit.
- [ ] Update tests, command guidance, and the README.

## Notes

Aaron approved the repair sequence: “Plan approved.” Aaron directed execution of the entire sequence.

## Progress log
