---
title: Plan - Bug: Trust CI and review evidence
ticket: local://ADW:ADW-Plan-Trust-CI-And-Review-2026-11
status: planned
appetite: M
version: none
impact: patch
devTicketKey: ADW:ADW-Plan-Trust-CI-And-Review-2026-11
agent: Codex
---
# Trust CI and review evidence

## Summary

Require a plan for workflow changes, run repository invariants on exempt changes, and distinguish local review stamps from authenticated GitHub approvals.

## Context

The plan gate executes the proposed sync program when deciding the no-plan exception. Trivial and archive-only paths return before repository invariants. Review fingerprints bind content, while reviewer identity and session text are supplied by the plan author.

## Open questions

None

## Acceptance criteria

- [ ] AC1: A managed workflow change requires a plan, and the gate never executes a candidate sync verifier.
- [ ] AC2: The configured repository invariants run for valid no-plan and archive-only changes.
- [ ] AC3: Required local review stamps include valid identities, and GitHub documents and enforces the independent approval boundary for a PR revision.

## Steps

- [ ] Remove the untrusted sync verification route and keep invariants in the successful gate paths (AC1, AC2).
- [ ] Tighten local stamp validation and enforce authenticated independent review on GitHub (AC3).
- [ ] Verify the gate behavior with regression fixtures and align the distribution documentation (AC1, AC2, AC3).

## Risks

An approval for a prior revision could leave a check green. Check the reviewed head and use protected-branch rules to prevent approval and workflow-check bypasses.

## Out of scope

Notion close-out and local verification or shipping fixes have separate plans. GitHub repository settings are deployment controls.

## Notes

Aaron approved the review's fixes by saying “Implement your fixes.”

## Progress log
