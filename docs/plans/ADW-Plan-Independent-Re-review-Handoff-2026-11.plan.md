---
title: Plan - Bug: Independent Re-review Handoff
ticket: local://ADW:ADW-Plan-Independent-Re-review-Handoff-2026-11
status: planned
priority: 
state: 
due: 
appetite: S
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Independent-Re-review-Handoff-2026-11
agent: Codex
---
# Independent Re-review Handoff

## Summary

Align the fixer and reviewer instructions with the independent review gate. Let reviewers resolve specific correctness questions left open by the review packet.

## Context

The fixer brief in `scripts/ticket.mjs:2708` tells the fixer to stamp a pass. The Level B guide calls for independent re-review. The generated review prompts and mirrored quick-review skills need consistent instructions for reviewer identity and focused inspection.

## Open questions

None.

## Acceptance criteria

- [ ] AC1: The fixer brief directs the fixer to verify the repair and hand findings and evidence to an independent reviewer for a fresh verdict.
- [ ] AC2: Both reviewer entry points and both quick-review skills start from the review packet and allow focused inspection when an unresolved correctness question warrants it. The CLI examples explain when to record an independent reviewer ID.
- [ ] AC3: Regression assertions cover the generated instructions. The skill copies match, and the ticket CLI suite passes with existing independence and review freshness checks.

## Steps

- [ ] Align the fixer handoff with the independent review workflow. (AC1)
- [ ] Update the reviewer prompts and mirrored skills. (AC2)
- [ ] Extend the role and review prompt regression assertions and run verification. (AC3)

## Risks

Overbroad guidance could cause full repository re-review on ordinary changes. Tie extra inspection to a specific unresolved concern and leave verdict validation in the existing gate.

## Out of scope

Model routing, new agent roles, review gate behavior, and the independent verifier evaluation.

## Notes

Aaron approved the proposed scope with “Approved.”

> **Make independent re-review explicit.** The fixer repairs the blocker, reruns verification, and hands back the finding addressed, the change made, and the check result.
>
> **Give the reviewer room to follow a concrete concern.** Start with the review packet. If it leaves a specific correctness question unresolved, let the reviewer inspect the relevant caller, test, or code path.
>
> **Verify the full handoff.** Add regression assertions for the generated instructions, check that the skill copies match, and run `node --test scripts/ticket.test.mjs`.

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
