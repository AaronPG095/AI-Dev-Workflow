---
title: Plan - Bug: Trust CI and review evidence
ticket: local://ADW:ADW-Plan-Trust-CI-And-Review-2026-11
status: in-progress
appetite: M
version: none
impact: patch
devTicketKey: ADW:ADW-Plan-Trust-CI-And-Review-2026-11
agent: Codex
branch: codex/trust-ci-and-review
worktree: AI-Dev-Workflow
startedAt: 2026-11-18
reviewedBy: Codex
reviewVerdict: warn
reviewSession: /root/review_ci
reviewFingerprint: bc7fab6ac1764f96a1cca964c78c34ea3ade0614bccac9dbb48c8f984446bd6a
---
# Trust CI and review evidence

## Summary

Require a plan for workflow changes, run repository invariants on exempt changes, and distinguish local review stamps from authenticated GitHub approvals.

## Context

The plan gate executes the proposed sync program when deciding the no-plan exception. Trivial and archive-only paths return before repository invariants. Review fingerprints bind content, while reviewer identity and session text are supplied by the plan author.

## Open questions

None

## Acceptance criteria

- [x] AC1: A managed workflow change requires a plan, and the gate never executes a candidate sync verifier. verified(test): A legitimate upstream sync fixture is rejected by ci-check with no-plan.
- [x] AC2: The configured repository invariants run for valid no-plan and archive-only changes. verified(test): Trivial and archive-only fixtures reject a committed invariant violation even with a clean worktree copy.
- [x] AC3: Required local review stamps include valid identities, and GitHub documents and enforces the independent approval boundary for a PR revision. verified(test): Targeted tests accepted a current collaborator review and rejected missing identities, stale, self, external, dismissed, and changed-request reviews.

## Steps

- [x] Remove the untrusted sync verification route and keep invariants in the successful gate paths (AC1, AC2).
- [x] Tighten local stamp validation and enforce authenticated independent review on GitHub (AC3).
- [x] Verify the gate behavior with regression fixtures and align the distribution documentation (AC1, AC2, AC3).

## Risks

An approval for a prior revision could leave a check green. Check the reviewed head and use protected-branch rules to prevent approval and workflow-check bypasses.

## Out of scope

Notion close-out and local verification or shipping fixes have separate plans. GitHub repository settings are deployment controls.

## Notes

Aaron approved the review's fixes by saying “Implement your fixes.”

## Progress log
- 2026-11-18 09:43 UTC, Codex (handoff): Done: CI trust fixes and targeted regression tests; independent review completed.; Next: Confirm full Windows suite and open the PR.; Open: none; Tree: 6 dirty file(s)
- 2026-11-18 09:43 UTC, Codex (review: warn): Independent review verified gate controls and resolved large-blob compatibility. Up-to-date branches avoid stale-head README invariant failures, and native reviewer and workflow-owner protection is required. [reviewer: /root/review_ci]
