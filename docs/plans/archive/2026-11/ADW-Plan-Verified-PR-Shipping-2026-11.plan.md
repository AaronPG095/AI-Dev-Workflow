---
title: Plan - Bug: Verified PR Shipping
ticket: local://ADW:ADW-Plan-Verified-PR-Shipping-2026-11
status: shipped
priority: high
devTicketKey: ADW:ADW-Plan-Verified-PR-Shipping-2026-11
agent: Codex
branch: codex/verified-pr-shipping
worktree: AI-Dev-Workflow
startedAt: 2026-11-11
reviewedBy: Codex
reviewVerdict: pass
reviewFingerprint: c0ae0c25353072bb2762da7a6decc5c5758d67a3043d2db70e0ffeed46ce254e
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/20
---

# Verified PR Shipping

## Summary

Ship the verified commit and resume PR creation safely after partial failures.

## Acceptance criteria

- [x] PR verification runs on the committed snapshot and rejects staged or dirty work that would change it. The first push sends the verified commit. verified: Git fixture rejects staged changes and the first push matches the tested SHA
- [x] PR bodies fill the real template and retry reuses the existing matching PR. The link commit contains only the selected plan. verified: fixture fills the PR template, reuses the existing PR after a rejected link, and commits only the plan
- [x] Regression tests cover dirty or staged files, failed push, and PR reuse. The full Node 22 suite passes. verified: Windows targeted failure paths and the complete Node 22 suite pass

## Steps

- [x] Make verification and pushing agree on the candidate commit.
- [x] Populate the PR body and resume partial shipping safely.
- [x] Verify fixtures and document shipping behavior.

## Notes

Aaron approved the repair sequence: “Plan approved.” Aaron directed execution of the entire sequence.

## Progress log
- 2026-11-11 11:09 UTC, Codex (review: pass): Verified snapshot, exact push, real template, link scope, and retry tests pass.
- 2026-11-11 11:09 UTC, Codex (handoff): Done: Bind PR verification to the commit that is pushed, fill the real PR template, and safely resume an existing PR after a partial failure.; Next: Start the merge and ticket reconciliation repair.; Open: none; Tree: 1 dirty file(s)

