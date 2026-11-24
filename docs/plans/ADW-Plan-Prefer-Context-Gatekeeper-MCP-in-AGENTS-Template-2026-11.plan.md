---
title: Plan - Feature: Prefer Context Gatekeeper MCP in AGENTS Template
ticket: local://ADW:ADW-Plan-Prefer-Context-Gatekeeper-MCP-in-AGENTS-Template-2026-11
status: in-progress
priority: 
state: 
due: 
appetite: S
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Prefer-Context-Gatekeeper-MCP-in-AGENTS-Template-2026-11
agent: Gemini
branch: gemini/prefer-context-gatekeeper-mcp-in-agents-template
worktree: AI-Dev-Workflow
startedAt: 2026-11-24
---
# Prefer Context Gatekeeper MCP in AGENTS Template

## Summary

Add a concise token-lean tool preference rule to `renderDevProcessSection` (`scripts/sync.mjs`) and `AGENTS.md` instructing agents (Claude, Codex, Gemini/Antigravity, Cursor) to prefer `context-gatekeeper` MCP tools when available.

## Context

- `scripts/sync.mjs` (`renderDevProcessSection`) generates the canonical `## Development process` section synced to all target repositories.

## Open questions

None

## Acceptance criteria

- [x] AC1: `scripts/sync.mjs` (`renderDevProcessSection`) and `AGENTS.md` include the `context-gatekeeper` preference bullet under Step 4 (`Implement`). verified: scripts/sync.mjs and AGENTS.md updated with Token-lean tools bullet
- [x] AC2: `node --test scripts/ticket.test.mjs` passes (`100%`) and `node scripts/ticket.mjs check` closes out cleanly. verified: node --test scripts/ticket.test.mjs passed 100/100

## Steps

- [x] Add the `context-gatekeeper` preference bullet to `scripts/sync.mjs` (`renderDevProcessSection`) and `AGENTS.md`. (AC1) verified: scripts/sync.mjs renderDevProcessSection and AGENTS.md updated with Token-lean tools bullet
- [x] Run `node --test scripts/ticket.test.mjs`, tick criteria, run independent review (`pack --test` + `review`), verify `ticket.mjs check`, and open PR via `ticket.mjs pr`. (AC2) verified: node --test scripts/ticket.test.mjs passed 100/100

## Risks

- `sync.mjs` template changes could affect existing `ticket.test.mjs` assertions if any assert exact `AGENTS.md` text (verified via `node --test scripts/ticket.test.mjs`).

## Out of scope

- Running `sync-repos.ps1 -AllKnown` before this PR is merged.

## Notes

User requested: "Yes, please add it. Through AI dev workflow. Agents template and make sure it's being used everywhere here in integrity."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
