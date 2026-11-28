---
title: Plan - Feature: Unified Model Routing
ticket: local://ADW:ADW-Plan-Unified-Model-Routing-2026-11
status: planned
priority: 
state: 
due: 
appetite: M
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Unified-Model-Routing-2026-11
agent: Codex
---
# Unified Model Routing

## Summary

Resolve Codex and Antigravity model choices from one workflow policy. Keep native client authentication and use the existing router for bounded local work.

## Context

`agentic.models` supplies Gemini role names to the CLI. Codex desktop can set a model and reasoning effort when delegating. The router MCP supports explicit local-only offloads.

## Open questions

None

## Acceptance criteria

- [ ] AC1: The workflow resolves Codex planner, builder, fixer, and reviewer routes, and preserves existing Antigravity model resolution.
- [ ] AC2: Codex workflow guidance covers scoped and complex execution, verification-based escalation, approval-only Astra, independent review evidence, and local-only offload.
- [ ] AC3: The CLI routing tests pass and a smoke test exercises local offload, scoped implementation, and independent review.

## Steps

- [ ] Add a client-specific role profile and route resolution with backward-compatible fallback. (AC1)
- [ ] Document and wire Codex role dispatch into the repo workflow and mirrored skills. (AC2)
- [ ] Verify CLI behavior, smoke-test the local router and Codex roles, and collect the independent review. (AC3)

## Risks

Selecting an incompatible provider model could break delegation. Keep inherited routing for other clients and test precedence. Tie escalation to failed verification and record it with the resolved model.

## Out of scope

Router-service changes and migration to API-key billing.

## Notes

Aaron approved the cost-first plan with “All right, sounds good. Agreed.” The approved first PR wires the shared policy into Codex, verifies the existing Antigravity routes, and smoke-tests a local offload, scoped build, and independent review. Sol handles planning and review, Luna handles narrowly scoped execution with Sol escalation, Sol handles broad implementation directly, and Astra requires explicit opt-in.

## Progress log

<!-- One line per session/review, added with ticket.mjs log or ticket.mjs review -->
