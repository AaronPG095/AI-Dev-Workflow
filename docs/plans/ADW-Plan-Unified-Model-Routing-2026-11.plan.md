---
title: Plan - Feature: Unified Model Routing
ticket: local://ADW:ADW-Plan-Unified-Model-Routing-2026-11
status: in-progress
priority: 
state: 
due: 
appetite: M
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Unified-Model-Routing-2026-11
agent: Codex
branch: codex/unified-model-routing
worktree: AI-Dev-Workflow
startedAt: 2026-11-28
reviewedBy: Codex
reviewVerdict: pass
reviewSession: /root/routing_reviewer
reviewModel: gpt-6.2-sol
baseBranch: main
reviewFingerprint: a2e75f3cf2218e1ed6b688d4e839aa90886787962db6fcec578bf3affb0e1bdd
---
# Unified Model Routing

## Summary

Resolve Codex and Antigravity model choices from one workflow policy. Keep native client authentication and use the existing router for bounded local work.

## Context

`agentic.models` supplies Gemini role names to the CLI. Codex desktop can set a model and reasoning effort when delegating. The router MCP supports explicit local-only offloads.

## Open questions

None

## Acceptance criteria

- [x] AC1: The workflow resolves Codex planner, builder, fixer, and reviewer routes, and preserves existing Antigravity model resolution. verified(cmd): Codex prime and route resolved OpenAI roles while explicit Antigravity route returned gemini-4-neon-medium
- [x] AC2: Codex workflow guidance covers scoped and complex execution, verification-based escalation, approval-only Astra, independent review evidence, and local-only offload. verified(inspect): Repo instructions load the mirrored agentic skill for native dispatch, escalation evidence, approval-only Astra, independent review and local privacy
- [x] AC3: The CLI routing tests pass and a smoke test exercises local offload, scoped implementation, and independent review. verified(test): Routing and skill-budget tests passed. Live smoke exercised local Ollama classification, a scoped Luna build, and independent Sol review.

## Steps

- [x] Add a client-specific role profile and route resolution with backward-compatible fallback. (AC1) verified(cmd): Codex prime and route resolved OpenAI roles while explicit Antigravity route returned gemini-4-neon-medium
- [x] Document and wire Codex role dispatch into the repo workflow and mirrored skills. (AC2) verified(inspect): Repo instructions load the mirrored agentic skill for native dispatch, escalation evidence, approval-only Astra, independent review and local privacy
- [x] Verify CLI behavior, smoke-test the local router and Codex roles, and collect the independent review. (AC3) verified(test): Routing and skill-budget tests passed. Live smoke exercised local Ollama classification, a scoped Luna build, and independent Sol review.

## Risks

Selecting an incompatible provider model could break delegation. Keep inherited routing for other clients and test precedence. Tie escalation to failed verification and record it with the resolved model.

## Out of scope

Router-service changes and migration to API-key billing.

## Notes

Aaron approved the cost-first plan with “All right, sounds good. Agreed.”

> For the first PR, I’d wire the shared policy into Codex, verify that Antigravity still resolves its existing roles, and smoke-test a local offload, a scoped build, and an independent review.

Sol handles planning and review, Luna handles narrowly scoped execution with Sol escalation, Sol handles broad implementation directly, and Astra requires explicit opt-in.

## Progress log

<!-- One line per session/review, added with ticket.mjs log or ticket.mjs review -->
- 2026-11-28 11:55 UTC, Codex: Live smoke passed. GPT-6 Luna high built and validated the profile configs, GPT-6.2 Sol medium independently reviewed the patch, and a local-only classification used Ollama gemma3:4b. No escalation or Astra was needed.
- 2026-11-28 11:58 UTC, Codex (review: pass): Independent review passed for route compatibility, actual dispatch guidance, config drift tests and identical skill references. Targeted tests and live smoke passed. [reviewer: /root/routing_reviewer] (model: gpt-6.2-sol)
- 2026-11-28 11:58 UTC, Codex (handoff): Done: Closed routing acceptance criteria, ran live smoke and obtained independent Sol review; Next: Publish the reviewed branch after checking the full suite result; Open: none; Tree: 12 dirty file(s)
- 2026-11-28 12:02 UTC, Codex: Fixed the mock README command list and reran T1.5 successfully. The full suite is running on the final test fixture.
- 2026-11-28 12:02 UTC, Codex (review: pass): Independent review passed for route compatibility, dispatch guidance, mirrored skills and the updated README invariant fixture. Targeted verification and live smoke passed. [reviewer: /root/routing_reviewer] (model: gpt-6.2-sol)
