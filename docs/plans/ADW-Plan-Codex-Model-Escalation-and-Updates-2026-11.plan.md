---
title: Plan - Feature: Codex Model Escalation and Updates
ticket: local://ADW:ADW-Plan-Codex-Model-Escalation-and-Updates-2026-11
status: shipped
priority: 
state: 
due: 
appetite: M
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Codex-Model-Escalation-and-Updates-2026-11
agent: Codex
branch: codex/model-escalation-and-updates
worktree: AI-Dev-Workflow
startedAt: 2026-11-28
reviewedBy: Codex
reviewVerdict: pass
reviewSession: /root/escalation_reviewer
reviewModel: gpt-6.2-sol
baseBranch: main
reviewFingerprint: 20069cbeb3cf9ebc56c10f034ca658ba2003919d83c091fddfe13ab6f0ed4872
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/63
---
# Codex Model Escalation and Updates

## Summary

Add a reusable Sol Extra High route before approval-only Astra. Document how maintainers discover and evaluate model changes before updating pinned routes.

## Context

PR #62 added client-specific model profiles and native dispatch guidance. Codex currently uses Sol Medium for routine reasoning and broad execution. The published Standard rate per token for Sol is one-quarter of Astra, while reasoning effort can change token consumption.

## Open questions

None

## Acceptance criteria

- [x] AC1: Codex exposes Sol Extra High for every role while the routine routes, Astra approval and Antigravity model resolution retain their behavior. verified(cmd): Codex review route resolves Sol Medium, Sol xhigh and approval-only Astra. Antigravity review returns its existing Neon model.
- [x] AC2: The shared workflow describes escalation triggers, verification and evidence, plus weekly model discovery, role-specific evaluation, promotion and rollback. verified(inspect): README documents weekly discovery, matched role trials, promotion and rollback. Both identical workflow references define escalation triggers, verification and evidence.
- [x] AC3: The route tests pass and a small matched pilot compares Sol Medium against Sol Extra High with the same task and scoring criteria. verified(test): Focused role and skill tests passed. Two native Sol subagents completed the matched Medium and xhigh exercise with scores of 6/6. Independent review evidence is recorded in the review log.

## Steps

- [x] Add the optional escalation route to the Codex profile and route output with coverage for all roles and legacy output. (AC1) verified(cmd): Codex review route resolves Sol Medium, Sol xhigh and approval-only Astra. Antigravity review returns its existing Neon model.
- [x] Update the README and mirrored dispatch reference with escalation rules and a repeatable model update procedure. (AC2) verified(inspect): README documents weekly discovery, matched role trials, promotion and rollback. Both identical workflow references define escalation triggers, verification and evidence.
- [x] Run the focused pilot and CLI verification, then obtain independent review. (AC3) verified(test): Focused role and skill tests passed. Two native Sol subagents completed the matched Medium and xhigh exercise with scores of 6/6. Independent review evidence is recorded in the review log.

## Risks

Higher effort can consume more reasoning tokens. Use one focused attempt per blocker unless new evidence changes the task. The pilot is directional and should report missing native usage telemetry explicitly.

## Out of scope

Changes to router-service dispatch, billing credentials and downstream model activation.

## Notes

Aaron approved with “Agreed.”

> I’d deliver the Extra High route and the model-update procedure in one PR, with tests for the new route and a small Medium-versus-Extra-High pilot.

### Sol reasoning pilot

Two fresh native Codex subagents received the same read-only PR-closeout scenario and a 350-word limit. The task was to design a small repair for wrong-ticket closure and double credit under concurrent replays, stale and fork PR events, and writes that succeed before returning a timeout.

Both Medium and Extra High covered six checks: base-repository identity, verified head at merge, protection against concurrent rebinding, recovery after an uncertain ticket write, ledger deduplication, and fail-closed verification cases. Extra High surfaced how to prove which operation caused the Done transition if that attribution matters. Medium made conflicting ledger entries explicit. This single sample showed no clear quality winner. Native per-agent token usage, allowance draw, and comparable latency were unavailable, so the pilot does not establish cost savings or a performance gain.

## Progress log

<!-- One line per session/review, added with ticket.mjs log or ticket.mjs review -->
- 2026-11-28 12:15 UTC, Codex (review: pass): Independent review confirmed optional escalation, backward-compatible routing, mirrored dispatch, model maintenance procedure and candid pilot evidence. [reviewer: /root/escalation_reviewer] (model: gpt-6.2-sol)
- 2026-11-28 12:15 UTC, Codex (handoff): Done: Implemented escalation and weekly model update procedure. Focused tests, matched pilot and independent review passed.; Next: Publish and merge after the full suite and CI pass.; Open: none; Tree: 9 dirty file(s)
