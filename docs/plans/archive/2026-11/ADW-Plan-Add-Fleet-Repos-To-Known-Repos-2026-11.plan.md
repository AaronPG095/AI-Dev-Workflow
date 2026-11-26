---
title: Plan - Feature: Add Fleet Repos To Known Repos
ticket: local://ADW:ADW-Plan-Add-Fleet-Repos-To-Known-Repos-2026-11
status: shipped
priority: 
state: 
due: 
appetite: S
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Add-Fleet-Repos-To-Known-Repos-2026-11
agent: Gemini
branch: chore/add-fleet-repos-to-known-repos
worktree: AI-Dev-Workflow
startedAt: 2026-11-26
reviewedBy: Other
reviewVerdict: pass
reviewSession: independent-known-repos-reviewer
baseBranch: main
reviewFingerprint: 132ceb0239e6456dd2e9c82a2055bd38f71990fb744fb7f10f214844334980cc
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/59
---
# Add Fleet Repos To Known Repos

## Summary

Register all 5 remaining ADW repositories (`Durable-Workflow-Engine`, `Fluent-Studio-Automations`, `my-minimalist-portfolio`, `Local-LLM-Router-Proxy`, `MCP-Audit`) in `scripts/ticket.config.json` `knownRepos` so fleet-wide `adw doctor`, `stats`, `recall`, and `sync` cover all 13 workspace repositories.

## Context

- `scripts/ticket.config.json` `knownRepos` previously listed 8 repositories (`FluentOverlay`, `Fluent-Studio-Website`, `FluentTimer`, `TokenHUD`, `Fluent-Studio-Atlas`, `AI-Cortex`, `Context-Gatekeeper-MCP`, `AI-Dev-Workflow`).
- `scripts/ticket.config.json` is a managed workflow file (`noPlan` cannot skip the plan gate).

## Open questions

None

## Acceptance criteria

- [x] AC1: `scripts/ticket.config.json` `knownRepos` includes `Durable-Workflow-Engine`, `Fluent-Studio-Automations`, `my-minimalist-portfolio`, `Local-LLM-Router-Proxy`, and `MCP-Audit` (13 total). verified(cmd): adw doctor --fleet --compact exited 0 across all 13 repos (12 universal, 1 synced)
- [x] AC2: `adw doctor --fleet --compact` exits 0 and reports all 13 repositories (12 `universal`, 1 `synced`). verified(cmd): adw doctor --fleet --compact exited 0 across all 13 repos (12 universal, 1 synced)

## Steps

- [x] Add the 5 repository names to `knownRepos` in `scripts/ticket.config.json` (AC1)
- [x] Verify `adw doctor --fleet --compact` across all 13 repositories (AC2)

## Risks

- Risk: A newly added repository path missing on another machine. Mitigation: `getKnownRepoDirs()` skips non-existent sibling directories gracefully.

## Out of scope

- Modifying any code or tests in `scripts/ticket.mjs` or `scripts/sync.mjs`.

## Notes

- Requested by Aaron ("Please add local LLM router proxy, MCP audit, and update the repos using the old ADW.").

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-26 10:10 UTC, Other (review: pass [standards: pass, spec: pass]): scripts/ticket.config.json adds only the 5 requested fleet repo names to knownRepos and the plan is cleanly closed out. [reviewer: independent-known-repos-reviewer]
