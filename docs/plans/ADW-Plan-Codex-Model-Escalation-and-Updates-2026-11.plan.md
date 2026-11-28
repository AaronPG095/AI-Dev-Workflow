---
title: Plan - Feature: Codex Model Escalation and Updates
ticket: local://ADW:ADW-Plan-Codex-Model-Escalation-and-Updates-2026-11
status: planned
priority: 
state: 
due: 
appetite: M
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Codex-Model-Escalation-and-Updates-2026-11
agent: Codex
---
# Codex Model Escalation and Updates

## Summary

Add a reusable Sol Extra High route before approval-only Astra. Document how maintainers discover and evaluate model changes before updating pinned routes.

## Context

PR #62 added client-specific model profiles and native dispatch guidance. Codex currently uses Sol Medium for routine reasoning and broad execution. The published Standard rate per token for Sol is one-quarter of Astra, while reasoning effort can change token consumption.

## Open questions

None

## Acceptance criteria

- [ ] AC1: Codex exposes Sol Extra High for every role while the routine routes, Astra approval and Antigravity model resolution retain their behavior.
- [ ] AC2: The shared workflow describes escalation triggers, verification and evidence, plus weekly model discovery, role-specific evaluation, promotion and rollback.
- [ ] AC3: The route tests pass and a small matched pilot compares Sol Medium against Sol Extra High with the same task and scoring criteria.

## Steps

- [ ] Add the optional escalation route to the Codex profile and route output with coverage for all roles and legacy output. (AC1)
- [ ] Update the README and mirrored dispatch reference with escalation rules and a repeatable model update procedure. (AC2)
- [ ] Run the focused pilot and CLI verification, then obtain independent review. (AC3)

## Risks

Higher effort can consume more reasoning tokens. Use one focused attempt per blocker unless new evidence changes the task. The pilot is directional and should report missing native usage telemetry explicitly.

## Out of scope

Changes to router-service dispatch, billing credentials and downstream model activation.

## Notes

Aaron approved with “Agreed.”

> I’d deliver the Extra High route and the model-update procedure in one PR, with tests for the new route and a small Medium-versus-Extra-High pilot.

## Progress log

<!-- One line per session/review, added with ticket.mjs log or ticket.mjs review -->
