---
title: Plan - Feature: Agentic Workflow Engine
ticket: local://ADW:ADW-Plan-Agentic-Workflow-Engine-2026-11
status: in-progress
priority: high
state: flow
due: 
devTicketKey: ADW:ADW-Plan-Agentic-Workflow-Engine-2026-11
agent: Gemini
branch: feat/agentic-workflow-engine
worktree: AI-Dev-Workflow
startedAt: 2026-11-10
reviewedBy: Gemini
reviewVerdict: pass
---
# Agentic Workflow Engine

## Summary

Extend AI-Dev-Workflow with an opt-in, modular Layer 2 Agentic Execution Engine on top of the existing Layer 1 Deterministic Core: Level A (autonomous self-healing step loop with verification gating, atomic git commits, and circuit breaker via `step` and `checkpoint`), Level B (adversarial Builder ↔ Reviewer sub-agents with role briefs via `step --role`), Level C (parallel worktree wave orchestrator via `wave`), and Two-Layer Portfolio Positioning in README.md.

## Acceptance criteria

- [x] Level A (`ticket.mjs step` & `ticket.mjs checkpoint`): `node scripts/ticket.mjs step [<plan>] [--json]` outputs a focused brief for the next unticked step, open acceptance criteria, verify command, and retry budget; `node scripts/ticket.mjs checkpoint <#|query> [--verified <evidence>] [--commit]` runs the configured verify tier, ticks the checkbox only if verification passes, and optionally creates an atomic git commit checkpoint. verified: unit test 55 and 56 passing, step and checkpoint verified in scripts/ticket.test.mjs
- [x] Level B (`ticket.mjs step --role <builder|reviewer|fixer>`): Generates role-isolated sub-agent briefs: `builder` (minimal `prime` + current step brief), `reviewer` (adversarial rubric + `pack --test` instructions in a fresh context), and `fixer` (extracts the latest `block` review findings from the Progress log paired with open/failed criteria). verified: unit test 55 passing, builder/reviewer/fixer role prompts verified in scripts/ticket.test.mjs
- [x] Level C (`ticket.mjs wave`): `node scripts/ticket.mjs wave [<plan1> <plan2> ...] [--spawn|--status]` provisions isolated git worktrees for multiple independent plans, outputs each worktree's path and `builder` brief, and `--status` renders a live multi-worktree dashboard table (open checkboxes, verify state, review verdict, close-out readiness). verified: unit test 57 passing, worktree spawning and status table verified in scripts/ticket.test.mjs
- [x] Modular Skill (`agentic-workflow`) & Sync: `.agents/skills/agentic-workflow/SKILL.md` and `.claude/skills/agentic-workflow/SKILL.md` are created and kept identical, registered in `WORKFLOW_FILES` in `scripts/ticket.mjs` and `DIRECT_FILES` in `scripts/sync.mjs`. verified: both skill files identical with matching SHA256, registered in WORKFLOW_FILES and DIRECT_FILES
- [x] Two-Layer Portfolio Positioning & Tests: `README.md` is upgraded with the Deterministic & Agentic Engineering Harness headline, Mermaid architecture diagram, and Agentic CLI reference; hermetic tests in `scripts/ticket.test.mjs` cover `step`, `checkpoint`, and `wave` and pass `node --test scripts/ticket.test.mjs`. verified: README.md updated with 57-test suite and layer 2 CLI reference, 57 of 57 tests passing

## Steps

- [x] Step 1 (Level A CLI — `step` & `checkpoint`): Add `step` and `checkpoint` commands to `scripts/ticket.mjs` (plus `--json`, `--commit`, `--role`, `--status`, `--spawn` flags in `BOOLEAN_FLAGS` / `opts`) and default `agentic` config support (`maxRetries: 3`, `verifyTier: "test"`).
- [x] Step 2 (Level B Role Briefs — `--role`): Implement `--role <builder|reviewer|fixer>` inside `commands.step()` in `scripts/ticket.mjs` to emit zero-fluff, role-isolated prompts for Builder, Adversarial Reviewer, and Block-Fixer sub-agents.
- [x] Step 3 (Level C Wave Orchestrator — `wave`): Implement `commands.wave()` in `scripts/ticket.mjs` to provision isolated worktrees for multiple plans (`--spawn`) and render a live multi-worktree swarm progress table (`--status`).
- [x] Step 4 (Modular Skill & Sync Registration): Create identical `.agents/skills/agentic-workflow/SKILL.md` and `.claude/skills/agentic-workflow/SKILL.md` covering Levels A/B/C and circuit-breaker rules; add both paths to `WORKFLOW_FILES` in `scripts/ticket.mjs` and `DIRECT_FILES` in `scripts/sync.mjs`.
- [x] Step 5 (README Two-Layer Positioning & Hermetic Tests): Upgrade `README.md` with the Two-Layer Engineering Harness positioning, Mermaid architecture diagram, and Agentic CLI reference; update `ticket.config.example.json`; add unit/integration tests for `step`, `checkpoint`, and `wave` in `scripts/ticket.test.mjs` and verify all tests pass.

## Risks

- Unbounded agent retry loops burning tokens: mitigated by enforcing a strict default `maxRetries: 3` circuit breaker in the `step` output and `agentic-workflow` skill instructions.
- Worktree clutter: handled by utilizing existing `ticket.mjs wt` conventions with safe prune and cleanup.

## Out of scope

- External npm dependencies or background daemons.
- Modifying mandatory Layer 1 core rules in AGENTS.md (Layer 2 remains strictly opt-in).

## Notes

Plan approved by Aaron: "All right, implement."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-10 08:11 UTC, Gemini (review: pass [standards: pass, spec: pass]): Layer 2 Agentic Execution Engine: step, checkpoint, wave, agentic-workflow skill, 57 hermetic tests pass
