---
title: Plan - Bug: Verified PR Shipping
ticket: local://ADW:ADW-Plan-Verified-PR-Shipping-2026-11
status: planned
priority: high
devTicketKey: ADW:ADW-Plan-Verified-PR-Shipping-2026-11
agent: Codex
---

# Verified PR Shipping

## Summary

Ship the verified commit and resume PR creation safely after partial failures.

## Acceptance criteria

- [ ] PR verification runs on the committed snapshot and rejects staged or dirty work that would change it. The first push sends the verified commit.
- [ ] PR bodies fill the real template and retry reuses the existing matching PR. The link commit contains only the selected plan.
- [ ] Regression tests cover dirty or staged files, failed push, and PR reuse. The full Node 22 suite passes.

## Steps

- [ ] Make verification and pushing agree on the candidate commit.
- [ ] Populate the PR body and resume partial shipping safely.
- [ ] Verify fixtures and document shipping behavior.

## Notes

Aaron approved the repair sequence: “Plan approved.” Aaron directed execution of the entire sequence.

## Progress log

