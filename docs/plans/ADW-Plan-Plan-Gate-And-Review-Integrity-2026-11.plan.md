---
title: Plan - Bug: Plan Gate and Review Integrity
ticket: local://ADW:ADW-Plan-Plan-Gate-And-Review-Integrity-2026-11
status: in-progress
priority: high
devTicketKey: ADW:ADW-Plan-Plan-Gate-And-Review-Integrity-2026-11
agent: Codex
branch: codex/plan-gate-review-integrity
worktree: AI-Dev-Workflow
startedAt: 2026-11-11
reviewedBy: Codex
reviewVerdict: pass
reviewFingerprint: 54b8fdb7561baca87620f44f17e6fa16cd1d323f1f1499ea550e3e0d1033ff4a
---

# Plan Gate and Review Integrity

## Summary

Make the required Plan check validate the proposed commits using the policy on the protected base branch. Bind review verdicts to the changes they cover and reject reused plans, missing evidence, and unverified sync exceptions.

## Acceptance criteria

- [x] The Plan check evaluates committed candidate files using the validator and configuration from the protected base. Upstream main requires PRs and the Plan check and blocks direct and force pushes. verified: workflow restores ticket.mjs and config from BASE_SHA; GitHub API confirms active PR, Plan check, and no force-push rules
- [x] A reused shipped plan, removed or replaced checkbox, empty verification or deferral, and invalid ticket identity fail close-out. A valid new plan and valid trivial no-plan PR still pass. verified: committed Git fixture rejects historical reuse, replaced item, empty evidence and deferral, and invalid ticket; valid current plan and trivial PR pass
- [x] Changes to reviewed code or criteria invalidate the review. Review, shipping, and progress metadata updates alone keep the review current. Pack identifies files it omits. verified: review and CI fixtures passed for post-review code edits and metadata-only shipping updates; pack lists untracked omissions
- [x] CI checks committed hygiene. Arbitrary changes to managed files cannot claim the workflow sync exception without evidence of the upstream version. verified: CI fixtures reject nested coverage and a managed-file no-plan claim; an ordinary trivial no-plan change passes
- [x] Regression fixtures reproduce the audit failures and the full Node 22 suite passes. verified: Node 22 full suite passed 58/58, including Git fixtures for committed plan and review integrity

## Steps

- [x] Set and verify the approved upstream GitHub branch protection.
- [x] Implement committed plan comparison and run the validator from the protected base.
- [x] Bind review verdicts to a reproducible diff and flag omissions in pack.
- [x] Add committed hygiene and validate the sync exception.
- [x] Verify compatibility and document the gate and review behavior.

## Risks

The base validator will enforce the new policy after this PR merges. Run the candidate validator against disposable repositories during review. Preserve the required GitHub job name so its branch protection continues to apply. Review changes to the enforcement workflow as part of this PR.

## Out of scope

Checkpoint transactions, worktree ownership, PR shipping transactions, ticket reconciliation, and fleet distribution are separate approved PRs.

## Notes

Aaron approved the repair sequence: “Plan approved.”

## Progress log

<!-- One line per session/review, added with ticket.mjs log or review -->
- 2026-11-11 08:16 UTC, Codex (review: pass): Verified base policy, committed plan validation, review freshness, hygiene, and no-plan regressions. All 58 tests pass. Workflow changes await maintainer review.
