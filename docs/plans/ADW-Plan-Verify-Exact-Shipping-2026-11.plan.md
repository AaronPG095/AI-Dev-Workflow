---
title: Plan - Bug: Verify exact shipping and supervisor state
ticket: local://ADW:ADW-Plan-Verify-Exact-Shipping-2026-11
status: planned
appetite: L
version: none
impact: patch
devTicketKey: ADW:ADW-Plan-Verify-Exact-Shipping-2026-11
agent: Codex
---
# Verify exact shipping and supervisor state

## Summary

Keep a failed runner step open, bind pre-push tests to the revision being sent, and carry one intended PR base through review and shipping. Record shipping retrospectives in the plan so reviewed source stays stable.

## Context

The supervisor can trust a runner's tick after failed verification. The pre-push hook discards pushed commit IDs. PR shipping appends a tracked lessons file after review, and local review can compare against the wrong protected branch.

## Open questions

None

## Acceptance criteria

- [ ] AC1: A runner-written tick with failed verification stays pending, retries the same step, and cannot make the supervisor report success.
- [ ] AC2: Configured pre-push verification runs only on a clean checkout matching the pushed commit, with actionable output for ambiguous pushes.
- [ ] AC3: PR retrospectives are retained, and the final pushed plan passes the same review fingerprint and CI gate.
- [ ] AC4: A change targeting a second protected branch uses that base for local review, close-out, and GitHub PR creation or reuse.

## Steps

- [ ] Keep failed runner verification pending and validate the original checkbox identity (AC1).
- [ ] Pass the pushed commit to the verification command and check the checkout before and after (AC2).
- [ ] Keep the retrospective in the PR plan and validate the final revision before push (AC3).
- [ ] Resolve and persist the intended protected branch and pass it to GitHub (AC4).
- [ ] Exercise each failure and legitimate control and update the operator documentation (AC1, AC2, AC3, AC4).

## Risks

A stricter pre-push check can require a clean checkout or separate pushes for different commits. The configured skip remains available when equivalent verification was done separately. Older plans use the first available configured protected branch unless an explicit base is chosen.

## Out of scope

GitHub rules, downstream deployment, and a redesign of the agent runner.

## Notes

Aaron approved the review's fixes by saying “Implement your fixes.”

## Progress log
