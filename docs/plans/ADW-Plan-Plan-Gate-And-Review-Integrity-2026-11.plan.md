---
title: Plan - Bug: Plan Gate and Review Integrity
ticket: local://ADW:ADW-Plan-Plan-Gate-And-Review-Integrity-2026-11
status: planned
priority: high
devTicketKey: ADW:ADW-Plan-Plan-Gate-And-Review-Integrity-2026-11
agent: Codex
---

# Plan Gate and Review Integrity

## Summary

Make the required Plan check validate the proposed commits using the policy on the protected base branch. Bind review verdicts to the changes they cover and reject reused plans, missing evidence, and unverified sync exceptions.

## Acceptance criteria

- [ ] The Plan check evaluates committed candidate files using the validator and configuration from the protected base. Upstream main requires PRs and the Plan check and blocks direct and force pushes.
- [ ] A reused shipped plan, removed or replaced checkbox, empty verification or deferral, and invalid ticket identity fail close-out. A valid new plan and valid trivial no-plan PR still pass.
- [ ] Changes to reviewed code or criteria invalidate the review. Review, shipping, and progress metadata updates alone keep the review current. Pack identifies files it omits.
- [ ] CI checks committed hygiene. Arbitrary changes to managed files cannot claim the workflow sync exception without evidence of the upstream version.
- [ ] Regression fixtures reproduce the audit failures and the full Node 22 suite passes.

## Steps

- [ ] Set and verify the approved upstream GitHub branch protection.
- [ ] Implement committed plan comparison and run the validator from the protected base.
- [ ] Bind review verdicts to a reproducible diff and flag omissions in pack.
- [ ] Add committed hygiene and validate the sync exception.
- [ ] Verify compatibility and document the gate and review behavior.

## Risks

The base validator will enforce the new policy after this PR merges. Run the candidate validator against disposable repositories during review. Preserve the required GitHub job name so its branch protection continues to apply. Review changes to the enforcement workflow as part of this PR.

## Out of scope

Checkpoint transactions, worktree ownership, PR shipping transactions, ticket reconciliation, and fleet distribution are separate approved PRs.

## Notes

Aaron approved the repair sequence: “Plan approved.”

## Progress log

<!-- One line per session/review, added with ticket.mjs log or review -->
