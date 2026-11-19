---
title: Plan - Bug: Trust CI and review evidence
ticket: local://ADW:ADW-Plan-Trust-CI-And-Review-2026-11
status: shipped
appetite: M
version: none
impact: patch
devTicketKey: ADW:ADW-Plan-Trust-CI-And-Review-2026-11
agent: Codex
branch: codex/trust-ci-and-review
worktree: AI-Dev-Workflow
startedAt: 2026-11-18
reviewedBy: Codex
reviewVerdict: pass
reviewSession: /root/review_solo_gate
reviewFingerprint: 9ea19e0167aad0872635c45709d06999ed8db19dd9fe9a4e79250c80d6f78a3d
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/40
baseBranch: main
---
# Trust CI and review evidence

## Summary

Require a plan for workflow changes, run repository invariants on exempt changes, and validate review stamps for the existing independent sub-agent workflow.

## Context

The plan gate executes the proposed sync program when deciding the no-plan exception. Trivial and archive-only paths return before repository invariants. Review fingerprints bind content, while reviewer identity and session text are supplied by the plan author.

## Open questions

None

## Acceptance criteria

- [x] AC1: A managed workflow change requires a plan, and the gate never executes a candidate sync verifier. verified(test): A legitimate upstream sync fixture is rejected by ci-check with no-plan.
- [x] AC2: The configured repository invariants run for valid no-plan and archive-only changes. verified(test): Trivial and archive-only fixtures reject a committed invariant violation even with a clean worktree copy.
- [ ] AC3: Required local review stamps include valid identities, and GitHub documents and enforces the independent approval boundary for a PR revision. deferred: The authenticated GitHub approval requirement was superseded by the approved solo workflow in AC4.
- [x] AC4: Plan check validates the reviewer fields and fingerprint while supporting independent sub-agent review for a solo GitHub owner. verified(test): Focused suite passed 7 of 7, including current sub-agent stamp acceptance and rejection of missing identities, self-review and stale fingerprints.

## Steps

- [x] Remove the untrusted sync verification route and keep invariants in the successful gate paths (AC1, AC2).
- [ ] Tighten local stamp validation and enforce authenticated independent review on GitHub (AC3). deferred: Retain local stamp validation and use the existing independent sub-agent process covered by AC4.
- [x] Verify the gate behavior with regression fixtures and align the distribution documentation (AC1, AC2, AC3).
- [x] Remove the GitHub approval dependency and verify valid sub-agent stamps, self-review rejection, and stale review rejection (AC4).

## Risks

The fingerprint detects stale stamps. The reviewer identity is recorded in the plan and depends on the independent review process.

## Out of scope

Notion close-out and local verification or shipping fixes have separate plans. GitHub repository settings are deployment controls.

## Notes

Aaron approved the review's fixes by saying “Implement your fixes.”

Aaron approved retaining independent sub-agent review and removing the mandatory GitHub approval by saying “Fix it and then merge it.”

## Progress log
- 2026-11-18 09:43 UTC, Codex (handoff): Done: CI trust fixes and targeted regression tests; independent review completed.; Next: Confirm full Windows suite and open the PR.; Open: none; Tree: 6 dirty file(s)
- 2026-11-18 09:43 UTC, Codex (review: warn): Independent review verified gate controls and resolved large-blob compatibility. Up-to-date branches avoid stale-head README invariant failures, and native reviewer and workflow-owner protection is required. [reviewer: /root/review_ci]
- 2026-11-19 14:30 UTC, Codex (handoff): Done: Removed the mandatory GitHub approver, retained the review-stamp and invariant checks, and passed focused tests and independent review.; Next: Push the revised PR, verify CI and merge.; Open: none; Tree: 5 dirty file(s)
- 2026-11-19 14:30 UTC, Codex (review: pass): Independent review confirmed the solo workflow, retained review fingerprint and invariants, and accurate deferrals. Focused suite passed 7 of 7. [reviewer: /root/review_solo_gate]
