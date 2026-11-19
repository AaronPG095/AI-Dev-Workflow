---
title: Plan - Bug: Verify exact shipping and supervisor state
ticket: local://ADW:ADW-Plan-Verify-Exact-Shipping-2026-11
status: in-progress
appetite: L
version: none
impact: patch
devTicketKey: ADW:ADW-Plan-Verify-Exact-Shipping-2026-11
agent: Codex
branch: codex/verify-exact-shipping
worktree: AI-Dev-Workflow
startedAt: 2026-11-19
reviewedBy: Codex
reviewVerdict: pass
reviewSession: /root/review_shipping
baseBranch: main
reviewFingerprint: e172b23262ad6d663493c4f103992bed41a7c89b2715625aa9d51389894f7dab
---
# Verify exact shipping and supervisor state

## Summary

Keep a failed runner step open, bind pre-push tests to the revision being sent, and carry one intended PR base through review and shipping. Record shipping retrospectives in the plan so reviewed source stays stable.

## Context

The supervisor can trust a runner's tick after failed verification. The pre-push hook discards pushed commit IDs. PR shipping appends a tracked lessons file after review, and local review can compare against the wrong protected branch.

## Open questions

None

## Acceptance criteria

- [x] AC1: A runner-written tick with failed verification stays pending, retries the same step, and cannot make the supervisor report success. verified(test): Supervisor fixtures keep the tick open on failure, retry the same step after reordering and preserve verifier edits without reporting success.
- [x] AC2: Configured pre-push verification runs only on a clean checkout matching the pushed commit, with actionable output for ambiguous pushes. verified(test): The installed hook accepted a push of the clean HEAD to a bare fixture, rejected older and multiple commits and allowed deleting a branch.
- [x] AC3: PR retrospectives are retained, and the final pushed plan passes the same review fingerprint and CI gate. verified(test): Mock shipping recorded the retrospective only in the linked plan, verified the final push and passed ci-check on the linked head.
- [x] AC4: A change targeting a second protected branch uses that base for local review, close-out, and GitHub PR creation or reuse. verified(test): A divergent develop fixture recorded the base in review, printed that base in pack, sent it to GitHub and passed its exact CI gate.

## Steps

- [x] Keep failed runner verification pending and validate the original checkbox identity (AC1).
- [x] Pass the pushed commit to the verification command and check the checkout before and after (AC2).
- [x] Keep the retrospective in the PR plan and validate the final revision before push (AC3).
- [x] Resolve and persist the intended protected branch and pass it to GitHub (AC4).
- [x] Exercise each failure and legitimate control and update the operator documentation (AC1, AC2, AC3, AC4).

## Risks

A stricter pre-push check can require a clean checkout or separate pushes for different commits. The configured skip remains available when equivalent verification was done separately. Older plans use the first available configured protected branch unless an explicit base is chosen.

## Out of scope

GitHub rules, downstream deployment, and a redesign of the agent runner.

## Notes

Aaron approved the review's fixes by saying “Implement your fixes.”

## Progress log
- 2026-11-19 08:17 UTC, Codex (handoff): Done: Supervisor recovery, exact push verification, stable retrospectives, and PR base binding passed focused tests and independent review.; Next: Open the PR and confirm CI and compatibility with the close-out changes.; Open: none; Tree: 4 dirty file(s)
- 2026-11-19 08:17 UTC, Codex (review: pass): Independent review verified pinned retry recovery and the exact push pipeline. Added the requested snapshot check before final verification; focused tests passed. [reviewer: /root/review_shipping]
